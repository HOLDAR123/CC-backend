import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TerminusModule} from "@nestjs/terminus";
import {ThrottlerModule} from "@nestjs/throttler";
import {ConfigModule} from "@nestjs/config";
import {APP_GUARD} from "@nestjs/core";
import {ThrottlerBehindProxyGuard} from "./guards/throttler-behind-proxy.guard";
import {Unicom24Module} from "./unicom24/unicom24.module";
import {OffersModule} from "./offers/offers.module";
import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";
import {LinksModule} from "./links/links.module";
import {LeadsModule} from "./leads/leads.module";
import {ReportsModule} from "./reports/reports.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60,
                limit: 60,
            },
        ]),
        TerminusModule.forRoot({
            errorLogStyle: 'pretty',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT) || 5432,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            synchronize: true,
            autoLoadEntities: true,
            migrationsRun: true,
            migrations: [],
            subscribers: [],
        }),
        AuthModule,
        UsersModule,
        Unicom24Module,
        OffersModule,
        LinksModule,
        LeadsModule,
        ReportsModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerBehindProxyGuard,
        },
    ],
})
export class AppModule {
}
