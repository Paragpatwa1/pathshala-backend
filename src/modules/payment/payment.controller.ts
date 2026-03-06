import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';

import * as crypto from 'crypto';

@ApiTags('Payment')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  async createOrder(
    @Body() body: CreateOrderDto,
    @Req() req: any,
  ) {
    return this.paymentService.createOrder(body.amount);
  }

  @Post('verify')
  async verifyPayment(@Body() body: any) {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const generated_signature = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET as string,
      )
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    await this.paymentService.markBookingPaid(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    return { message: 'Payment verified successfully' };
  }
}