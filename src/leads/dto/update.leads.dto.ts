import {IsOptional} from "class-validator";

export class UpdateLeadsDto {

    @IsOptional()
    username?: string
}
