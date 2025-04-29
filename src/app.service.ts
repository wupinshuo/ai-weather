import { Injectable } from '@nestjs/common';
import { timeTool } from '../tools/time-tool';
@Injectable()
export class AppService {
  getHello(): string {
    const now = timeTool.getChinaTimeDate();
    return `Hello World! ${now}`;
  }
}
