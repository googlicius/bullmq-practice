import { OnQueueEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('notification', { lockDuration: 0 })
export class AppConsumer extends WorkerHost {
  logger = new Logger(AppConsumer.name);

  async process(job: Job, token?: string): Promise<any> {
    let progress = 0;

    for (let i = 0; i < 100; i++) {
      // await doSomething(job.data);
      progress += 1;
      await job.updateProgress(progress);
    }

    this.logger.log(
      `Job progress ${job.progress}, ${job.name}, token ${token}`,
    );
    await job.moveToCompleted('Ok', token, false);
    this.logger.log('This is ok');

    return;
  }

  onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log('Shut down', signal);
    return;
  }

  @OnQueueEvent('progress')
  notificationProgress(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueEvent('error')
  @OnQueueEvent('failed')
  onError(job: Job) {
    this.logger.warn(`ERR ${job.stacktrace}`);
  }
}
