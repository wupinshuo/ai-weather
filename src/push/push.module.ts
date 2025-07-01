import { Module } from '@nestjs/common';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { WeatherModule } from '../weather/weather.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GoldModule } from 'src/gold/gold.module';

@Module({
  imports: [WeatherModule, PrismaModule, GoldModule],
  controllers: [PushController],
  providers: [PushService],
  exports: [],
})
export class PushModule {}
