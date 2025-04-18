// cloudinary.provider.ts
import { ConfigService } from '@nestjs/config';
import { ConfigOptions, v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY_CONFIG',
  useFactory: (configService: ConfigService): ConfigOptions => {
    return v2.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
