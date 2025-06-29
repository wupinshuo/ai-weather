import { Module, forwardRef } from '@nestjs/common';
import { TaskService } from './task.service';
import { EmailService } from './email.service';
import { GoldModule } from '../gold/gold.module';

@Module({
  imports: [forwardRef(() => GoldModule)],
  providers: [TaskService, EmailService],
  exports: [TaskService, EmailService],
})
export class ToolsModule {}
