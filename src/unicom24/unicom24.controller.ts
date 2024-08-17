import {Controller, Get, Param, Query, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Unicom24Service} from "./unicom24.service";
import {IsAdminGuard} from "../auth/guards/is-admin.guard";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@ApiTags('Unicom')
@Controller('unicom')
export class Unicom24Controller {
    constructor(private readonly unicom24Service: Unicom24Service) {
    }

    @UseGuards(JwtAuthGuard, IsAdminGuard)
    @Get('offers')
    async offers(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
        return this.unicom24Service.getOffers(page, limit, search);
    }

    @UseGuards(JwtAuthGuard, IsAdminGuard)
    @Get('offers/:id')
    async offerById(@Param('id') id: number) {
        return this.unicom24Service.getOfferById(id);
    }
}
