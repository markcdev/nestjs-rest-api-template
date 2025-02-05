import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @Type(() => String)
  @IsEmail()
  email: string;

  @Type(() => String)
  @IsNotEmpty()
  firstName: string;

  @Type(() => String)
  @IsNotEmpty()
  lastName: string;
}
