import {IsOptional, IsUrl} from "class-validator";

export class CreateLinkDto {
    @IsOptional()
    lead_id?: string

    @IsOptional()
    user_id?: number

    @IsOptional()
    offer_id?: number

    @IsOptional()
    price?: number

    @IsUrl()
    original_link: string
}
