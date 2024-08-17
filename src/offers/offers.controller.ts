import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post, Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {OffersService} from "./offers.service";
import {IsAdminGuard} from "../auth/guards/is-admin.guard";

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
    constructor(private readonly offersService: OffersService) {
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async offers(@Req() req: unknown) {
        return await this.offersService.getOffers(req['user'])
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard, IsAdminGuard)
    @Get(":id")
    @UseInterceptors(ClassSerializerInterceptor)
    async offersById(@Param('id') id: number) {
        return await this.offersService.getOffersById(id)
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard, IsAdminGuard)
    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    async createOrRemove(@Body() data: { unicom_id: number }) {
        return await this.offersService.createOrRemove(data.unicom_id)
    }
}
