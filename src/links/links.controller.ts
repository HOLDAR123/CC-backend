import {
    Body,
    ClassSerializerInterceptor,
    Controller, Delete,
    Get,
    Param, Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {LinksService} from "./links.service";
import {PaginationDto} from "../common/dto/pagination.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {CreateLinkDto} from "./dto/create.link.dto";

@ApiTags('Links')
@Controller({path: 'links'})
export class LinksController {
    constructor(private readonly linksService: LinksService) {
    }

    @Get('get/link/:hash')
    @UseInterceptors(ClassSerializerInterceptor)
    async checkLink(@Param('hash') hash: string) {
        return this.linksService.checkLink(hash)
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    async createOrUpdateLink(@Req() req: unknown, @Body() body: CreateLinkDto) {
        return await this.linksService.createOrUpdateLink(req['user'], body)
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    @UseInterceptors(ClassSerializerInterceptor)
    async deleteById(@Req() req: unknown, @Param('id') id: number) {
        return await this.linksService.deleteById(req['user'], id)
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getLinks(@Req() req: unknown) {
        return await this.linksService.getLinks(req['user'])
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Get(":id")
    @UseInterceptors(ClassSerializerInterceptor)
    async getLinkById(@Param('id') id: number) {
        return await this.linksService.getLinkById(id)
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Get(":id/lead")
    @UseInterceptors(ClassSerializerInterceptor)
    async getLinkByIdLead(@Param('id') id: string) {
        return await this.linksService.getLinkByIdLead(id)
    }
}
