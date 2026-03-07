import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}

  async createBooking(dto: any, userId: number) {

  const seat = await this.prisma.seat.findUnique({
    where: { seatNumber: dto.seatNumber },
  });

  if (!seat) throw new Error('Seat not found');

  // ✅ seat already booked check
  if (seat.isBooked) {
    throw new Error("Seat already booked");
  }

  const start = new Date(dto.startDate);
  const end = new Date(dto.endDate);

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (months <= 0) throw new Error('Invalid date range');

  const priceMap = {
    Common: 800,
    Reserved: 1200,
    Cabin: 2000,
  };

  const pricePerMonth = priceMap[seat.category];
  const subtotal = months * pricePerMonth;
  const discount = Math.floor(subtotal * 0.2);
  const finalAmount = subtotal - discount;

  const order = await this.paymentService.createOrder(finalAmount);

  const booking = await this.prisma.booking.create({
    data: {
      userId,
      seatId: seat.id,
      startDate: start,
      endDate: end,
      months,
      pricePerMonth,
      subtotal,
      discount,
      finalAmount,
      razorpayOrderId: order.id,
    },
  });

  return {
    bookingId: booking.id,
    razorpayOrderId: order.id,
    amount: finalAmount,
    key: process.env.RAZORPAY_KEY_ID,
  };
}
}