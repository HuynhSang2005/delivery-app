import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getFoundationStatus() {
    return {
      status: 'ok',
      app: 'api',
      mvpSequence: ['MVP-1', 'MVP-2', 'MVP-3'],
    };
  }
}
