import {Global, Module} from '@nestjs/common';
import {OffersService} from "./offers.service";
import {OffersController} from "./offers.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OffersEntity} from "./entities/offers.entity";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([OffersEntity])],
    controllers: [OffersController],
    providers: [OffersService],
    exports: [OffersService],
})
export class OffersModule {
}
