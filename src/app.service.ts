import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { Company } from './interfaces/company.interface';

@Injectable()
export class AppService {

  constructor(@InjectModel('Company') private readonly companyModel: Model<Company>) {}

  private readonly logger = new Logger(AppService.name);

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      if(await this.findCompanyByName(createCompanyDto.name)) {
        throw new RpcException('Company already registered');
      } 

      const companySaved = await new this.companyModel(createCompanyDto).save();
      
      if(!companySaved) {
        throw new RpcException('Problem to create a company');
      }
      return companySaved;
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async findCompanyByName(name: string): Promise<Company> {
    try {
      return await this.companyModel.findOne({ name });
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async findCompanyByIdOrThrow(_id: string) : Promise<Company> {
    try {
      const company = await this.companyModel.findById({ _id });

      if(!company) {
        throw new RpcException('Company not found');
      }
      return company;
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async findAllCompanies() : Promise<Array<Company>> {
    try {
      return await this.companyModel.find();
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async updateCompany(_id: string, updateCompanyDto: UpdateCompanyDto): Promise<void> {
    try {
      const companyById = await this.findCompanyByIdOrThrow(_id);
      const companyByName = await this.findCompanyByName(updateCompanyDto.name);

      if(companyByName && (companyByName._id.toString() != companyById._id.toString())) {
        throw new RpcException('This name is already being used by another company');
      }

      await this.companyModel.findByIdAndUpdate(_id, updateCompanyDto);
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }
}
