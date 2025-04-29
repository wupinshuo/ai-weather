import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { WeatherModule } from '../weather/weather.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), WeatherModule, PrismaModule],
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule {}
