import { IsNotEmpty } from "class-validator";

export class UpdateCompanyDto {
  @IsNotEmpty()
  readonly name: string;
}