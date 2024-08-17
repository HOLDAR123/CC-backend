import {Global, Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {Unicom24Controller} from "./unicom24.controller";
import {Unicom24Service} from "./unicom24.service";
import {OffersModule} from "../offers/offers.module";

@Global()
@Module({
    imports: [HttpModule, OffersModule],
    controllers: [Unicom24Controller],
    providers: [Unicom24Service],
    exports: [Unicom24Service],
})
export class Unicom24Module {
}
