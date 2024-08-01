import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class AppService {
  constructor(@InjectQueue('notification') private notiQueue: Queue) {}

  getHello(): string {
    return 'Hello World!';
  }

  addNotification(mes: string) {
    this.notiQueue
      .add(
        'myMes',
        {
          message: mes,
        },
        {
          attempts: 2,
          delay: 3000,
        },
      )
      .then((value) => {
        console.log('Queue added', value.returnvalue);
      });
  }
}
