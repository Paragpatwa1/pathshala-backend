import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 optional but recommended
@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // 👈 VERY IMPORTANT
})
export class PrismaModule {}