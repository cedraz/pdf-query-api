import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';

@Injectable()
export class PasswordRecoveryAuthGuard
  extends JwtAuthGuard
  implements CanActivate
{
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      throw new UnauthorizedException(ErrorMessagesHelper.UNAUTHORIZED);
    }

    const request = context.switchToHttp().getRequest<Request>();

    try {
      const payload = request.user as JwtPayload;

      if (payload.type !== 'PASSWORD_RESET') {
        throw new ForbiddenException(ErrorMessagesHelper.FORBIDDEN);
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
