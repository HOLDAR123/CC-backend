import {Global, Module} from '@nestjs/common';
import {MinioService} from './minio.service';
import {NestMinioModule} from 'nestjs-minio';
import {MinioController} from './minio.controller';
import {ConfigModule} from '@nestjs/config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        NestMinioModule.register({
            endPoint: process.env.MINIO_HOST,
            port: Number(process.env.MINIO_PORT) || 9000,
            useSSL: false,
            accessKey: process.env.MINIO_ROOT_USER,
            secretKey: process.env.MINIO_ROOT_PASSWORD,
        }),
    ],
    controllers: [MinioController],
    providers: [MinioService],
    exports: [MinioService],
})
export class MinioModule {
}
