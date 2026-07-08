import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lifeStage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  riskTolerance?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filingStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  dependents?: number;

  @ApiPropertyOptional()
  @IsOptional()
  annualIncome?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stateCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  goalsSummary?: string;
}
