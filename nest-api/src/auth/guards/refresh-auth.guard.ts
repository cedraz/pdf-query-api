import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshAuthGuard extends JwtAuthGuard {
  constructor(
    protected jwtService: JwtService,
    protected configService: ConfigService,
    protected prismaService: PrismaService,
  ) {
    super(jwtService, configService, prismaService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(ErrorMessagesHelper.NO_TOKEN_PROVIDED);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (user?.token_version !== payload.tokenVersion) {
        throw new UnauthorizedException(ErrorMessagesHelper.INVALID_SESSION);
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(ErrorMessagesHelper.INVALID_TOKEN);
    }

    return true;
  }
}
