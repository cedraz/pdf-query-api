import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { MemberService } from 'src/member/member.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    jwtService: JwtService,
    configService: ConfigService,
    prismaService: PrismaService,
    private memberService: MemberService,
  ) {
    super(jwtService, configService, prismaService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    const organization_id = this.getOrganizationId(request);

    const member = await this.memberService.findWithCache(
      user.sub,
      organization_id,
    );

    if (!member) {
      throw new BadRequestException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    request['user'] = {
      memberId: member.id,
      ...user,
    };

    return true;
  }

  private getOrganizationId(request: Request): string {
    const organization_id = request.params.organization_id;

    if (!organization_id) {
      throw new BadRequestException(
        ErrorMessagesHelper.ORGANIZATION_ID_NOT_PROVIDED,
      );
    }

    return organization_id;
  }
}
