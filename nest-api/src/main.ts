import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaErrorsInterceptor } from './prisma/prisma-errors.interceptor';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { CustomLogger } from './logger/logger.service';
import { GlobalErrorFilter } from './common/filters/global-error.filter';

async function bootstrap() {
  console.time('server-started');

  const logger = new CustomLogger();

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Cors
  app.enableCors({
    origin: '*', // Ou especifique domínios específicos em vez de '*'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('PDF Query API Docs')
    .setDescription('API documentation for the project API Query')
    .setVersion('1.0')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // writeFileSync('./swagger/swagger.json', JSON.stringify(document, null, 2));
  // writeFileSync('./swagger/swagger.yaml', dump(document, { noRefs: true }));

  SwaggerModule.setup('docs', app, document);

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  // Filters
  app.useGlobalFilters(new GlobalErrorFilter(logger));

  // Interceptors
  app.useGlobalInterceptors(
    new PrismaErrorsInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Start
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || 3000;

  await app.listen(port);

  console.log(`
    Server running in http://localhost:${process.env.PORT ?? 3000}
    API documentation in http://localhost:${process.env.PORT ?? 3000}/docs
    `);

  console.timeEnd('server-started');
}

bootstrap();
