import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Company } from './interfaces/company.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger(AppController.name);

  @EventPattern('create-company')
  async createCompany(@Payload() company: Company, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    try {
      await this.appService.createCompany(company);
      await channel.ack(originalMessage);
    }catch(error) {
      this.logger.error(error.message);

      if(error.message === 'Company already registered') {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('find-all-companies')
  async findAllCompanies(@Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    try {
      return await this.appService.findAllCompanies();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-company')
  async updateCompany(@Payload() data: any, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();

    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      await this.appService.updateCompany(data.id, data.company);
      await channel.ack(originalMessage);
    }catch(error) {
      this.logger.error(error.message);
      if(error.message === 'This name is already being used by another company') {
        await channel.ack(originalMessage);
      }
    }


  }
}
