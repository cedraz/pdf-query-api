import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';

@Injectable()
export class GlobalAdminGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(ErrorMessagesHelper.NO_TOKEN_PROVIDED);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      const globalAdmin = await this.prismaService.globalAdmin.findUnique({
        where: { id: payload.sub },
      });

      if (!globalAdmin) {
        throw new ForbiddenException(ErrorMessagesHelper.NOT_A_GLOBAL_ADMIN);
      }

      request['user'] = {
        globalAdmin: globalAdmin.id,
      };
    } catch {
      throw new UnauthorizedException(ErrorMessagesHelper.INVALID_TOKEN);
    }

    return true;
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
