import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './constants';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import logger from './logger';
import { requestLogger } from './middlewares/request.logger';
import { setupSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api'); // add /api globally


  // Enable CORS for the specified origin
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : process.env.NODE_ENV === 'production'
      ? [] // Must be set in production
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3000/api']; // Development defaults

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.) in development only
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      // In production, if CORS_ORIGINS is not set, log a warning but allow the request
      // This is a fallback to prevent complete failure, but CORS_ORIGINS should be set
      if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
        const logger = new Logger('CORS');
        logger.warn('⚠️  CORS_ORIGINS is not set in production! Allowing all origins as fallback.');
        logger.warn('⚠️  Please set CORS_ORIGINS environment variable in Railway for security.');
        return callback(null, true);
      }
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        const logger = new Logger('CORS');
        logger.warn(`🚫 CORS blocked request from origin: ${origin}`);
        logger.warn(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-secret-change-in-production'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1800000,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevent XSS attacks
        sameSite: 'strict', // CSRF protection
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: process.env.NODE_ENV !== 'production', // Disable in production
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      whitelist: true,
      forbidNonWhitelisted: true, // Reject unknown properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(requestLogger({ log: logger.log }));

  // Only enable Swagger in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  await app.listen(normalizePort(), onAppListen);
}

function normalizePort() {
  return process.env.PORT ? process.env.PORT : DEFAULT_PORT;
}

function onAppListen() {
  Logger.log(
    `🚀 ERP API is running on http://localhost:${normalizePort()}`,
    'Bootstrap',
  );
  Logger.log(
    `📄 API Docs available at http://localhost:${normalizePort()}/api/docs`,
    'Bootstrap',
  );
}

bootstrap();
