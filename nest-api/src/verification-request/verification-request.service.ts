import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { VerificationRequest, VerificationType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ValidateVerificationRequestDto } from './dto/validate-verification-request.dto';
import { SendEmailQueueService } from 'src/jobs/queues/send-email-queue.service';
import { ConfigService } from '@nestjs/config';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { verifyUserAccountDto } from './dto/verify-user-account.dto';

interface VerificationRequestMetadata {
  user_id: string;
}

@Injectable()
export class VerificationRequestService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private sendEmailQueueService: SendEmailQueueService,
    private configService: ConfigService,
  ) {}

  isVerificationRequestExpired(verificationRequest: VerificationRequest) {
    return new Date() > verificationRequest.expires;
  }

  async createVerificationRequest({
    createVerificationRequestDto,
    codeDigits,
    expiresIn,
  }: {
    createVerificationRequestDto: CreateVerificationRequestDto;
    codeDigits?: string;
    expiresIn?: Date;
  }): Promise<VerificationRequest> {
    const code = codeDigits
      ? codeDigits
      : Math.floor(100000 + Math.random() * 900000).toString();

    const expires = expiresIn
      ? expiresIn
      : new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

    const verificationRequest =
      await this.prismaService.verificationRequest.upsert({
        where: {
          identifier: createVerificationRequestDto.identifier,
        },
        update: {
          code,
          expires,
          type: createVerificationRequestDto.type,
        },
        create: {
          identifier: createVerificationRequestDto.identifier,
          code,
          type: createVerificationRequestDto.type,
          expires,
          metadata: createVerificationRequestDto.metadata,
        },
      });

    await this.sendEmailQueueService.execute({
      to: createVerificationRequestDto.identifier,
      subject: `Your email verification code is ${code}`,
      message: `Copy and paste this code to verify your email: ${code}`,
    });

    return verificationRequest;
  }

  async validateChangeEmailRequest(
    validateVerificationRequestDto: ValidateVerificationRequestDto,
  ) {
    const verificationRequest =
      await this.prismaService.verificationRequest.findFirst({
        where: {
          identifier: validateVerificationRequestDto.identifier,
          code: validateVerificationRequestDto.code,
          type: validateVerificationRequestDto.type,
        },
      });

    if (
      !verificationRequest ||
      this.isVerificationRequestExpired(verificationRequest)
    ) {
      throw new ConflictException(
        ErrorMessagesHelper.INVALID_VERIFICATION_REQUEST,
      );
    }

    const metadata =
      verificationRequest.metadata as unknown as VerificationRequestMetadata;

    if (!metadata || !metadata.user_id) {
      throw new ConflictException(ErrorMessagesHelper.INVALID_METADATA);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        email: metadata.user_id,
      },
    });

    if (!user) {
      throw new ConflictException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: validateVerificationRequestDto.identifier,
        email_verified_at: new Date(),
        token_version: {
          increment: 1,
        },
      },
    });

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

    await this.prismaService.verificationRequest.delete({
      where: {
        id: verificationRequest.id,
      },
    });

    return {
      message: 'Senha alterada com sucesso.',
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

  async validateVerificationRequest(
    validateVerificationRequestDto: ValidateVerificationRequestDto,
  ) {
    const verificationRequest =
      await this.prismaService.verificationRequest.findFirst({
        where: {
          identifier: validateVerificationRequestDto.identifier,
          code: validateVerificationRequestDto.code,
          type: validateVerificationRequestDto.type,
        },
      });

    if (
      !verificationRequest ||
      this.isVerificationRequestExpired(verificationRequest)
    ) {
      throw new ConflictException(
        ErrorMessagesHelper.INVALID_VERIFICATION_REQUEST,
      );
    }

    const tokenPayload = {
      sub: '',
      email: validateVerificationRequestDto.identifier,
      type: validateVerificationRequestDto.type,
      expiresIn: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes
    };

    return {
      token: await this.jwtService.signAsync(tokenPayload, {
        expiresIn: '5m',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }),
    };
  }

  async verifyUserAccount(verifyUserAccountDto: verifyUserAccountDto) {
    const verificationRequest =
      await this.prismaService.verificationRequest.findUnique({
        where: {
          identifier: verifyUserAccountDto.identifier,
          code: verifyUserAccountDto.code,
          type: VerificationType.EMAIL_VERIFICATION,
        },
      });

    if (
      !verificationRequest ||
      this.isVerificationRequestExpired(verificationRequest)
    ) {
      throw new ConflictException(
        ErrorMessagesHelper.INVALID_VERIFICATION_REQUEST,
      );
    }

    await this.prismaService.user.update({
      where: {
        email: verifyUserAccountDto.identifier,
      },
      data: {
        email_verified_at: new Date(),
      },
    });

    return true;
  }

  async createIncompleteUserVerificationRequest({
    createVerificationRequestDto,
    codeDigits,
    expiresIn,
    organization_id,
  }: {
    createVerificationRequestDto: CreateVerificationRequestDto;
    codeDigits?: string;
    expiresIn?: Date;
    organization_id: string;
  }): Promise<VerificationRequest> {
    const code = codeDigits
      ? codeDigits
      : Math.floor(100000 + Math.random() * 900000).toString();

    const expires = expiresIn
      ? expiresIn
      : new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

    const verificationRequest =
      await this.prismaService.verificationRequest.upsert({
        where: {
          identifier: createVerificationRequestDto.identifier,
        },
        update: {
          code,
          expires,
          type: createVerificationRequestDto.type,
        },
        create: {
          identifier: createVerificationRequestDto.identifier,
          code,
          type: createVerificationRequestDto.type,
          expires,
        },
      });

    const webUrl = this.configService.get<string>('WEB_URL');

    const url = `${webUrl}/verify-email?organization_id=${organization_id}&token=${code}`;

    await this.sendEmailQueueService.execute({
      to: createVerificationRequestDto.identifier,
      subject: `Your email verification code is ${code}`,
      message: `Click in the link below to verify your email: ${url}`,
    });

    return verificationRequest;
  }

  async completeUserCreation({
    identifier,
    code,
    organization_id,
  }: {
    identifier: string;
    code: string;
    organization_id: string;
  }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: identifier,
      },
    });

    if (!user) {
      return false;
    }

    const member = await this.prismaService.member.findFirst({
      where: {
        user_id: user.id,
        organization_id,
      },
    });

    if (!member) {
      return false;
    }

    const verificationRequest =
      await this.prismaService.verificationRequest.findUnique({
        where: {
          identifier,
          code,
          type: VerificationType.COMPLETE_USER_CREATION,
        },
      });

    if (
      !verificationRequest ||
      this.isVerificationRequestExpired(verificationRequest)
    ) {
      return false;
    }

    await this.prismaService.user.update({
      where: {
        email: identifier,
      },
      data: {
        email_verified_at: new Date(),
      },
    });

    await this.prismaService.member.update({
      where: {
        id: member.id,
      },
      data: {
        status: 'ACTIVE',
      },
    });

    // COM ESSE TOKEN O USUÁRIO TROCAR A SENHA DELE
    const tokenPayload = {
      sub: identifier,
      type: VerificationType.PASSWORD_RESET,
      expiresIn: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes
    };

    return {
      jwtToken: await this.jwtService.signAsync(tokenPayload, {
        expiresIn: '5m',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }),
    };
  }

  async verifyGlobalAdminAccount(verifyUserAccountDto: verifyUserAccountDto) {
    const verificationRequest =
      await this.prismaService.verificationRequest.findUnique({
        where: {
          identifier: verifyUserAccountDto.identifier,
          code: verifyUserAccountDto.code,
          type: VerificationType.GLOBAL_ADMIN_VERIFICATION,
        },
      });

    if (
      !verificationRequest ||
      this.isVerificationRequestExpired(verificationRequest)
    ) {
      throw new ConflictException(
        ErrorMessagesHelper.INVALID_VERIFICATION_REQUEST,
      );
    }

    await this.prismaService.globalAdmin.update({
      where: {
        email: verifyUserAccountDto.identifier,
      },
      data: {
        email_verified_at: new Date(),
      },
    });

    return {
      message: 'Global admin account verified successfully.',
    };
  }
}
