import {Module} from '@nestjs/common';
import {ReportsController} from "./reports.controller";
import {ReportsService} from "./reports.service";
import {Unicom24Module} from "../unicom24/unicom24.module";

@Module({
    imports: [Unicom24Module],
    providers: [ReportsService],
    exports: [ReportsService],
    controllers: [ReportsController],
})
export class ReportsModule {}
