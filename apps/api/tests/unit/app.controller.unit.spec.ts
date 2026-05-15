import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';

describe('AppController unit', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return foundation status', () => {
    expect(appController.getFoundationStatus()).toEqual(
      expect.objectContaining({
        status: 'ok',
        mvpSequence: ['MVP-1', 'MVP-2', 'MVP-3'],
      }),
    );
  });
});
