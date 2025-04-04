import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { RequiredPermission } from 'src/common/decorators/permission.decorator';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { Request } from 'express';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<RequiredPermission[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    const ability = await this.caslAbilityFactory.createForMember(
      user.memberId!,
    );

    const missingPermissions = requiredPermissions.filter(
      (perm) => !ability.can(perm.action, perm.subject),
    );

    const hasAllPermissions = missingPermissions.length === 0;

    if (!hasAllPermissions) {
      throw new ForbiddenException({
        message: ErrorMessagesHelper.FORBIDDEN,
        details: {
          missingPermissions,
        },
        error: 'Forbidden',
      });
    }

    request['ability'] = ability;

    return true;
  }
}
