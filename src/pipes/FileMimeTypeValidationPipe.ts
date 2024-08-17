import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { BufferedFile } from '../minio/dto/file.dto';

@Injectable()
export class FileMimeTypeValidationPipe implements PipeTransform {
  transform(file: BufferedFile) {
    if (file) {
      const errors: { text: string; file: BufferedFile }[] = [];

      if (
        file.mimetype !== 'image/png' &&
        file.mimetype !== 'image/jpeg' &&
        file.mimetype !== 'image/heic'
      ) {
        errors.push({ text: 'Unauthorized file format loaded', file: file });
      }

      if (file.size / 1000000 > 5) {
        errors.push({ text: 'File size too large > 5mb', file: file });
      }

      if (errors.length === 0) {
        return file;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
            error: errors.map((er) => ({
              text: er.text,
              file: {
                originalname: er.file.originalname,
                mimetype: er.file.mimetype,
                size: er.file.size,
              },
            })),
          },
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }
    }
  }
}
