import {Inject, Injectable, Logger, NotFoundException,} from '@nestjs/common';
import {BufferedFile} from './dto/file.dto';
import * as crypto from 'crypto';
import {MINIO_CONNECTION} from 'nestjs-minio';
import {Client} from 'minio';

@Injectable()
export class MinioService {
    public logger = new Logger();
    public bucketUsersName = 'users';

    constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {
    }

    /* Create buckets */
    private async onModuleInit() {
        if (!(await this.minioClient.bucketExists(this.bucketUsersName))) {
            await this.minioClient.makeBucket(this.bucketUsersName);
            this.logger.log('Bucket created: ' + this.bucketUsersName);
        }
    }

    public async getFile(
        filename: string,
        bucketName: string = this.bucketUsersName,
    ) {
        const file = await this.minioClient.getObject(bucketName, filename);
        if (!file) throw new NotFoundException();

        return file;
    }

    public async upload(file: BufferedFile, bucket = this.bucketUsersName) {
        const temp_filename: string = Date.now().toString();
        const hashedFileName: string = crypto
            .createHash('md5')
            .update(temp_filename)
            .digest('hex');

        const ext = file.originalname.substring(
            file.originalname.lastIndexOf('.'),
            file.originalname.length,
        );

        const filename = hashedFileName + ext;
        const fileBuffer = file.buffer;

        try {
            await this.minioClient.putObject(bucket, filename, fileBuffer)
        } catch (e) {
            this.logger.error(e);
        }

        return filename;
    }
}
