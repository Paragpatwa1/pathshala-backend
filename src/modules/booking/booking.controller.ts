import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Booking')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Body() dto: any,
    @CurrentUser() user: any,
  ) {
    return this.bookingService.createBooking(dto, user.userId);
  }
}