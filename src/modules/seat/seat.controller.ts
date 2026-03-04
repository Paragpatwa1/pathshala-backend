import {
  Controller,
  Get,
  Query,
  Patch,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Seats')
@Controller('seats')
export class SeatController {
  constructor(private seatService: SeatService) {}

  // Public
  @Get()
  getSeats(@Query('category') category: string) {
    return this.seatService.getSeatsByCategory(category);
  }

  // Admin only
  @ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Patch(':seatNumber/toggle')
toggleSeat(@Param('seatNumber') seatNumber: string) {
  return this.seatService.toggleSeat(Number(seatNumber));
}
}