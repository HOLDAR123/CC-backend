import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUsersDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
