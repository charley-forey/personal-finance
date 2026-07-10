import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class InsightFeedbackDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  helpful?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  actedOn?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  dismissed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
