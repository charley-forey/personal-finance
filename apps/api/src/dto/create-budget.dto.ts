import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty()
  @IsString()
  categoryId!: string;

  @ApiProperty({ description: 'ISO date (YYYY-MM-DD)' })
  @IsString()
  periodStart!: string;

  @ApiProperty({ description: 'ISO date (YYYY-MM-DD)' })
  @IsString()
  periodEnd!: string;

  @ApiProperty()
  @IsNumber()
  amount!: number;
}
