import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LeadsEntity} from "./entities/leads.entity";
import {LeadsService} from "./leads.service";
import {LeadsController} from "./leads.controller";

@Module({
    imports: [TypeOrmModule.forFeature([LeadsEntity])],
    providers: [LeadsService],
    exports: [LeadsService],
    controllers: [LeadsController],
})
export class LeadsModule {
}
