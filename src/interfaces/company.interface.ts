import { Document } from "mongoose";

export interface Company extends Document {
  readonly _id: string;
  readonly name: string;
}