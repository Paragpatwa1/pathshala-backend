import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {

  @ApiProperty({
    example: 960,
    description: 'Amount in INR',
  })
  amount: number;

}