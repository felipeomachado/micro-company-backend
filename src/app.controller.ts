import { Controller, Logger } from '@nestjs/common';
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
    }catch(exception) {
      this.logger.error(`error create-company: ${JSON.stringify(exception.message)}`);
    }
  }

  @MessagePattern('find-all-companies')
  async findCompanyById(@Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findAllCompanies();
    }catch(exception) {
      this.logger.error(`error find-all-companies: ${JSON.stringify(exception.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('find-company-by-id')
  async findAllCompanies(@Payload() _id: string, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findCompanyByIdOrThrow(_id);
    }catch(exception) {
      this.logger.error(`error find-company-by-id: ${JSON.stringify(exception.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('find-company-by-name')
  async findCompanyByName(@Payload() name: string, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findCompanyByName(name);
    }catch(exception) {
      this.logger.error(`error find-company-by-name: ${JSON.stringify(exception.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-company')
  async updateCompany(@Payload() data: any, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();

    try {
      await this.appService.updateCompany(data.id, data.company);
      await channel.ack(originalMessage);
    }catch(exception) {
      this.logger.error(`error update-company: ${JSON.stringify(exception.message)}`);
    }
  }
}
