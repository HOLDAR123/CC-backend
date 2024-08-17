import {IsEmail, IsEnum, IsNumber, IsOptional, IsStrongPassword} from 'class-validator';
import {RightsEnum} from '../interfaces/rights.enum';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsEnum(RightsEnum)
    @IsOptional()
    rights: RightsEnum;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    password: string;

    @IsOptional()
    @IsNumber()
    balance?: number
}
