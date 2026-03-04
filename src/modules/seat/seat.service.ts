import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SeatCategory } from '@prisma/client';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}

  async getSeatsByCategory(category: string) {
    return this.prisma.seat.findMany({
      where: {
        category: category as SeatCategory,
      },
      select: {
        seatNumber: true,
        isBooked: true,
      },
      orderBy: {
        seatNumber: 'asc',
      },
    });
  }

  async toggleSeat(seatNumber: number) {
    const seat = await this.prisma.seat.findUnique({
      where: { seatNumber },
    });

    if (!seat) throw new NotFoundException('Seat not found');

    return this.prisma.seat.update({
      where: { seatNumber },
      data: {
        isBooked: !seat.isBooked,
      },
    });
  }
}