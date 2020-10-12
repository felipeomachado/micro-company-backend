import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
}, {timestamps: true, collection: 'company'})