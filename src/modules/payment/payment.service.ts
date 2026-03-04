import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.config.get<string>('RAZORPAY_KEY_ID')!,
      key_secret: this.config.get<string>('RAZORPAY_KEY_SECRET')!,
    });
  }

  async createOrder(amount: number) {
    return this.razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
  }

  async markBookingPaid(
    orderId: string,
    paymentId: string,
    signature: string,
  ) {
    return this.prisma.booking.update({
      where: { razorpayOrderId: orderId },
      data: {
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        paymentStatus: 'CONFIRMED', // ✅ FIXED
      },
    });
  }
}