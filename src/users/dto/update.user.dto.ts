import {IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsStrongPassword,} from 'class-validator';
import {RightsEnum} from '../interfaces/rights.enum';

export class UpdateDataUsersDto {
    @IsOptional()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    password?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    balance?: number

    @IsOptional()
    @IsEnum(RightsEnum)
    rights?: RightsEnum;
}
