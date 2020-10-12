import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanySchema } from './interfaces/company.schema';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONBODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`,
      { 
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useUnifiedTopology: true, 
        useFindAndModify: false 
      } ),
        MongooseModule.forFeature([
          { name: 'Company', schema: CompanySchema}
        ])
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
