import { Module, forwardRef } from '@nestjs/common';
import { GoldController } from './gold.controller';
import { GoldService } from './gold.service';
import { ToolsModule } from '../tools/tools.module';

@Module({
  imports: [forwardRef(() => ToolsModule)],
  controllers: [GoldController],
  providers: [GoldService],
  exports: [GoldService],
})
export class GoldModule {}
