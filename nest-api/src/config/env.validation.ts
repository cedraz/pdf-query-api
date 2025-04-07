import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  PORT: string;

  @IsString()
  @IsNotEmpty()
  WEB_URL: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  MONGODB_URI: string;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsString()
  @IsNotEmpty()
  REDIS_PORT: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  MAIL_PORT: number;

  @IsString()
  @IsNotEmpty()
  MAIL_USER: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASS: string;

  @IsString()
  @IsNotEmpty()
  MAIL_SECURE: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_PRIVATE_KEY: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_SPREADSHEET_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_PROJECT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_CLOUD_NAME: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const formattedErrors = errors.map((error) => {
    return error.constraints;
  });

  if (errors.length > 0) {
    console.error(formattedErrors);
    throw new Error('Env validation error');
  }

  return validatedConfig;
}
