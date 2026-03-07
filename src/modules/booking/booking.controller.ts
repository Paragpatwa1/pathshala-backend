import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Booking')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('booking')
export class BookingController {

  constructor(
    private bookingService: BookingService,
    private prisma: PrismaService
  ) {}

  @Post()
  async createBooking(
    @Body() dto: any,
    @CurrentUser() user: any,
  ) {
    return this.bookingService.createBooking(dto, user.userId);
  }

  @Get('my')
  async myBookings(@CurrentUser() user: any) {

    return this.prisma.booking.findMany({
      where: {
        userId: user.userId
      },
      include: {
        seat: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });

  }
}