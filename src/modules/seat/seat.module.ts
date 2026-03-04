import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { PrismaModule } from '../../prisma/prisma.module'; // 👈 add this

@Module({
  imports: [PrismaModule],  // 👈 add this
  controllers: [SeatController],
  providers: [SeatService],
})
export class SeatModule {}