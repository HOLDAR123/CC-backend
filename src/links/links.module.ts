import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LinksEntity} from "./entities/links.entity";
import {LinksService} from "./links.service";
import {LinksController} from "./links.controller";
import {UsersModule} from "../users/users.module";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([LinksEntity]), UsersModule],
    controllers: [LinksController],
    providers: [LinksService],
    exports: [LinksService]
})
export class LinksModule {
}
