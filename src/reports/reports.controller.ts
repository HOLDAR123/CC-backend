import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Query,
    Request,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ReportsService} from "./reports.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ReportsQueryInterface} from "./interface/reports-query.interface";
import {RightsEnum} from "../users/interfaces/rights.enum";


@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {
    }

    @ApiOperation({summary: 'Getting reports Conversation list'})
    @Get('conversation')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getReportsConversation(@Request() req: Request, @Query() query: ReportsQueryInterface) {
        return this.reportsService.getStatsConversation({
            id: query.id || req['user'].id,
            date_from: query.date_from,
            date_to: query.date_to,
        }, query.page, query.limit);
    }

    @ApiOperation({summary: 'Getting reports Custom list'})
    @Get('custom')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getReportsCustom(@Request() req: Request, @Query() query: ReportsQueryInterface) {
        return this.reportsService.getStatsCustom({
            id: query.id || req['user'].id,
            date_from: query.date_from,
            date_to: query.date_to,
            slice: query.slice
        }, query.page, query.limit);
    }
}
