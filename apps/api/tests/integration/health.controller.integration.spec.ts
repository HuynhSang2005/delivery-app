import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { HealthController } from '../../src/health.controller';

describe('HealthController integration', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    healthController = moduleRef.get<HealthController>(HealthController);
  });

  it('returns live status payload', () => {
    expect(healthController.live()).toEqual({ status: 'ok' });
  });

  it('returns readiness payload', () => {
    expect(healthController.ready()).toEqual({
      status: 'ok',
      checks: {
        api: true,
      },
    });
  });
});
