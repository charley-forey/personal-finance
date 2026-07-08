import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private client: S3Client | null = null;

  constructor(private config: ConfigService) {}

  private getClient(): S3Client {
    if (!this.client) {
      const endpoint = this.config.get<string>('S3_ENDPOINT');
      this.client = new S3Client({
        region: this.config.get<string>('S3_REGION') ?? 'auto',
        endpoint: endpoint || undefined,
        forcePathStyle: Boolean(endpoint),
        credentials: {
          accessKeyId: this.config.get<string>('S3_ACCESS_KEY_ID') ?? '',
          secretAccessKey: this.config.get<string>('S3_SECRET_ACCESS_KEY') ?? '',
        },
      });
    }
    return this.client;
  }

  async createUploadUrl(orgId: string, filename: string, contentType: string) {
    const bucket = this.config.get<string>('S3_BUCKET') ?? 'finance-os-documents';
    const key = `orgs/${orgId}/${uuidv4()}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.getClient(), command, { expiresIn: 3600 });

    return { uploadUrl, storageKey: key, bucket };
  }
}
