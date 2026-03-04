import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: {
          // Cast properly to satisfy strict type
          expiresIn: config.get<string>('JWT_EXPIRES_IN') as unknown as number,
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
  ],

  exports: [JwtModule],
})
export class AuthModule {}