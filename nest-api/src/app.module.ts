import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { VerificationRequestModule } from './verification-request/verification-request.module';
import { OrganizationModule } from './organization/organization.module';
import { MemberModule } from './member/member.module';
import { InviteModule } from './invite/invite.module';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { CustomLogger } from './logger/logger.service';
import { AuditEventModule } from './audit-event/audit-event.module';
import { JobsModule } from './jobs/jobs.module';
import { GuardsModule } from './auth/guard.module';
import { FileModule } from './file/file.module';
import { ViaCepModule } from './providers/via-cep/via-cep.module';
import { CloudinaryModule } from './providers/cloudinary/cloudinary.module';
import { validate } from './config/env.validation';
import { CaslModule } from './casl/casl.module';
import { RolePermissionModule } from './role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module';
import { PriceTableModule } from './price-table/price-table.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    PrismaModule,
    UserModule,
    VerificationRequestModule,
    AuthModule,
    OrganizationModule,
    MemberModule,
    InviteModule,
    AuditEventModule,
    FileModule,
    JobsModule,
    GuardsModule,
    ViaCepModule,
    CloudinaryModule,
    CaslModule,
    RolePermissionModule,
    RedisModule,
    PriceTableModule,
  ],
  controllers: [AppController],
  providers: [CustomLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
