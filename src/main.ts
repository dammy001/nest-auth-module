import { NestFactory } from '@nestjs/core';
import {
  Logger,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/framework/response.interceptor';

const mapCorsOptions = function (req, callback): void {
  const options = {
    origin: false as boolean | string | string[],
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  if (['development', 'test', 'local'].includes(process.env.NODE_ENV)) {
    options.origin = '*';
  } else {
    options.origin = [process.env.FRONT_BASE_URL];
  }

  callback(null, options);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.flushLogs();

  const server = app.getHttpServer();
  Logger.verbose(`Server timeout: ${server.timeout}`);
  server.keepAliveTimeout = 61 * 1000;
  Logger.verbose(
    `Server keepAliveTimeout: ${server.keepAliveTimeout / 1000}s `,
  );
  server.headersTimeout = 65 * 1000;
  Logger.verbose(`Server headersTimeout: ${server.headersTimeout / 1000}s `);

  app.use(helmet());
  app.use(compression());
  app.enableCors(mapCorsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
      validationError: { value: true },
      exceptionFactory: (errors: ValidationError[]) => {
        throw new UnprocessableEntityException({
          message: 'Invalid data provided',
          errors: errors
            .map(({ property, constraints }: ValidationError) => {
              const response: Record<string, unknown> = {};
              response[`${property}`] = Object.values(constraints);
              return response;
            })
            .reduce((a, v) => ({ ...a, ...v }), {}),
        });
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  const options = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Auth API description')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Password')
    .addTag('Email Verification')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  Logger.log('Bootstrap successfully');

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 4000);
}

bootstrap().then(() => {
  Logger.log(`Application started on port ${process.env.PORT || 4000}`);
});
