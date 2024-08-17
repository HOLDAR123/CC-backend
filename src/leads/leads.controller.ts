import {
    Body,
    ClassSerializerInterceptor,
    Controller, Delete,
    Get, Param,
    Post,
    Put,
    Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {LeadsService} from "./leads.service";
import {CreateLeadsDto} from "./dto/create.leads.dto";
import {UpdateLeadsDto} from "./dto/update.leads.dto";

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getLeads(@Req() req: unknown) {
        return await this.leadsService.getLeads(req['user'])
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async getLeadById(@Req() req: unknown, @Param("id") id: string) {
        return await this.leadsService.getLeadById(req['user'], id)
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    async createLeads(@Req() req: unknown, @Body() body: CreateLeadsDto) {
        return await this.leadsService.createLeads(req['user'], body)
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async updateLeads(@Req() req: unknown, @Body() body: UpdateLeadsDto, @Param("id") id: string) {
        return await this.leadsService.updateLeads(req['user'], id, body)
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async deleteLeads(@Req() req: unknown, @Param("id") id: string) {
        return await this.leadsService.deleteLeads(req['user'], id)
    }
}
