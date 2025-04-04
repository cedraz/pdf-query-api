import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email,
      },
      include: {
        member_on: {
          include: {
            member_permissions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    if (!user.email_verified_at) {
      throw new UnauthorizedException(ErrorMessagesHelper.EMAIL_NOT_VERIFIED);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessagesHelper.INVALID_CREDENTIALS);
    }

    const accessTokenPayload = {
      sub: user.id,
      expiresIn: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // 4 hours
      tokenVersion: user.token_version,
    };

    const refreshTokenPayload = {
      sub: user.id,
      expiresIn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      tokenVersion: user.token_version,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user;

    return {
      userWithoutPassword,
      access_token: await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: '4h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }),
      refresh_token: await this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      }),
    };
  }

  async refreshAccessToken(user_id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      expiresIn: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // 2 hours
      tokenVersion: user.token_version,
    };

    const refreshTokenPayload = {
      sub: user.id,
      expiresIn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      tokenVersion: user.token_version,
    };

    return {
      access_token: await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: '4h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }),
      refreshToken: await this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      }),
    };
  }

  // async getUserRoleInOrganization(
  //   user_id: string,
  //   organization_id: string,
  // ): Promise<Role | null> {
  //   const member = await this.prismaService.member.findFirst({
  //     where: {
  //       user_id,
  //       organization_id,
  //       left_at: null,
  //     },
  //     select: {
  //       role: true,
  //     },
  //   });

  //   return member?.role || null;
  // }

  // async isOrganizationOwner(
  //   userId: string,
  //   organizationId: string,
  // ): Promise<boolean> {
  //   const organization = await this.prismaService.organization.findUnique({
  //     where: {
  //       id: organizationId,
  //     },
  //     select: {
  //       owner_id: true,
  //     },
  //   });

  //   return organization?.owner_id === userId;
  // }
}
