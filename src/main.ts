import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const PORT = 80;
    const app: any = await NestFactory.create(AppModule, { cors: true });

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                return new BadRequestException(validationErrors);
            },
        }),
    );

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.use(json({ limit: '5mb' }));
    app.use(urlencoded({ extended: true, limit: '5mb' }));
    app.set('trust proxy', true);

    const config = new DocumentBuilder()
        .setTitle('Shark-Cpa Docs')
        .setVersion('1.0.0')
        .setContact(
            'Yesmagambetov Timur',
            'https://github.com/HOLDAR123',
            'timurkabravo@gmail.com',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/docs', app, document, {
        explorer: true,
        customSiteTitle: 'Shark-Cpa Docs',
        customCss: '.swagger-ui .topbar { display: none }',
    });

    await app.listen(PORT, () => console.log('Server started on port =', PORT));
}

bootstrap().catch(console.error);
