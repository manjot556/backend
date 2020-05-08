import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors();
    const options = new DocumentBuilder()
        .setTitle('Typeorm + mysql + Nest.js')
        .setDescription('Just for learn')
        .setVersion('0.1')
        .addTag('ZQ-jhon')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
    await app.listen(3000);
}
bootstrap();
