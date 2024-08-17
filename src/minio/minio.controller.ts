import {Controller, Get, Param, Res} from '@nestjs/common';
import {MinioService} from './minio.service';
import {Response} from 'express';
import {ApiTags} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class MinioController {
    constructor(private readonly minioClientService: MinioService) {
    }

    @Get(':folder/:filename')
    async getRequestsFile(
        @Param('folder') folder: string,
        @Param('filename') filename: string,
        @Res() res: Response,
    ) {
        try {
            const response = await this.minioClientService.getFile(filename, folder);
            response.pipe(res);
        } catch (e) {
            throw e;
        }
    }
}
