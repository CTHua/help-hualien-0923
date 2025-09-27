import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { LoggingInterceptor } from "./logging/logging.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 設定全域前綴路由
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // 只能允許DTO白名單內的屬性被傳入
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 啟用白名單
      forbidNonWhitelisted: true, // 禁止白名單以外的屬性被傳入
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        strategy: 'excludeAll',
      },
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // Swagger
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Help Hualien API Document')
      .setVersion('v1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/:version/docs', app, document,
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
