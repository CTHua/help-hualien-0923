import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { LoggingInterceptor } from "./logging/logging.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 只能允許DTO白名單內的屬性被傳入
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 啟用白名單
      forbidNonWhitelisted: true, // 禁止白名單以外的屬性被傳入
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );


  // Swagger
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Help Hualien API Document')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document,
      {
        swaggerOptions: {
          persistAuthorization: true
        },
      }
    );
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
