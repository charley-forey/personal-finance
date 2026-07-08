import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  goalType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  targetAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetDate?: string;
}
