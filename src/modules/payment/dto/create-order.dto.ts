import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderDto {

  @ApiProperty({
    example: 800,
    description: 'Amount in INR',
  })
  @IsNumber()
  amount: number;
}