import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsIn(['cash', 'brokerage', 'retirement', 'liability', 'other'])
  purpose?: 'cash' | 'brokerage' | 'retirement' | 'liability' | 'other';

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
