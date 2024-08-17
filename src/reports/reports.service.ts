import {Injectable,} from '@nestjs/common';
import {Unicom24Service} from "../unicom24/unicom24.service";
import {Unicom24FilterQueryInterface} from "../unicom24/interface/unicom24-filter-query.interface";

@Injectable()
export class ReportsService {
    constructor(private readonly unicom24Service: Unicom24Service) {
    }

    async getStatsConversation(options: Unicom24FilterQueryInterface, page: number = 1, limit = 20) {
        return await this.unicom24Service.getReportsConversation(options, page, limit)
    }

    async getStatsCustom(options: Unicom24FilterQueryInterface, page: number = 1, limit = 20) {
        return await this.unicom24Service.getReportsCustom(options, page, limit)
    }
}
