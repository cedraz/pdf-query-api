import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { MemberPaginationDto } from './dto/member.pagination.dto';
import { PaginationResultDto } from 'src/common/entities/pagination-result.entity';
import { Member } from './entities/member.entity';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateManyMembersDto } from './dto/update-many-members.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerificationRequestService } from 'src/verification-request/verification-request.service';
import { VerificationType } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private verificationRequestService: VerificationRequestService,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: createMemberDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    const organization = await this.prismaService.organization.findUnique({
      where: { id: createMemberDto.organization_id },
    });

    if (!organization) {
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    }

    const role = await this.prismaService.role.findUnique({
      where: { id: createMemberDto.role_id },
      include: {
        role_permissions: { include: { module: true } },
      },
    });

    if (!role) {
      throw new NotFoundException(ErrorMessagesHelper.ROLE_NOT_FOUND);
    }

    return await this.prismaService.member.create({
      data: {
        status: 'ACTIVE',
        organization_id: createMemberDto.organization_id,
        user_id: createMemberDto.user_id,
        role_id: createMemberDto.role_id,
        invited_at: createMemberDto.invited_at,
      },
    });
  }

  async findAll(
    organization_id: string,
    memberPaginationDto: MemberPaginationDto,
  ): Promise<PaginationResultDto<Member>> {
    const members = await this.prismaService.member.findMany({
      where: {
        organization_id,
        ...memberPaginationDto.where(),
      },
      ...memberPaginationDto.orderBy(),
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            created_at: true,
            updated_at: true,
            email_verified_at: true,
            deleted_at: true,
            cpf: true,
            image: true,
            token_version: true,
            address_line: true,
            address_number: true,
            neighborhood: true,
            city: true,
            state: true,
            postal_code: true,
            birth_date: true,
          },
        },
        role: {
          include: {
            role_permissions: {
              include: {
                module: {
                  include: {
                    actions: true,
                  },
                },
                allowed: true,
              },
            },
          },
        },
      },
    });

    const total = await this.prismaService.member.count({
      where: {
        organization_id,
        ...memberPaginationDto.where(),
      },
    });

    return memberPaginationDto.createMetadata(members, total);
  }

  async findWithCache(user_id: string, organization_id: string) {
    const member = await this.prismaService.member.findFirst({
      where: {
        user_id,
        organization_id,
        status: 'ACTIVE',
      },
    });

    return member;
  }

  findOne(id: string) {
    return this.prismaService.member.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            created_at: true,
            updated_at: true,
            cpf: true,
            image: true,
            address_line: true,
            address_number: true,
            neighborhood: true,
            city: true,
            state: true,
            postal_code: true,
          },
        },
      },
    });
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const member = await this.prismaService.member.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    if (updateMemberDto.cpf) {
      const user = await this.prismaService.user.findUnique({
        where: { cpf: updateMemberDto.cpf },
      });

      if (user && user.id !== member.user_id) {
        throw new NotFoundException(ErrorMessagesHelper.INVALID_CPF);
      }
    }

    if (updateMemberDto.new_email) {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: updateMemberDto.new_email,
        },
      });

      if (user && user.id !== member.user_id) {
        throw new NotFoundException(ErrorMessagesHelper.INVALID_CREDENTIALS);
      }

      await this.verificationRequestService.createVerificationRequest({
        createVerificationRequestDto: {
          identifier: updateMemberDto.new_email,
          type: VerificationType.EMAIL_VERIFICATION,
          metadata: {
            user_id: member.user_id,
          },
        },
        expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      });
    }

    await this.prismaService.user.update({
      where: { id: member.user_id },
      data: {
        cpf: updateMemberDto.cpf,
        phone: updateMemberDto.phone,
        name: updateMemberDto.name,
        postal_code: updateMemberDto.postal_code,
        address_line: updateMemberDto.address_line,
        address_number: updateMemberDto.address_number,
        neighborhood: updateMemberDto.neighborhood,
        city: updateMemberDto.city,
        state: updateMemberDto.state,
        birth_date: updateMemberDto.birth_date,
        account: updateMemberDto.account,
        pix_key: updateMemberDto.pix_key,
        pix_key_type: updateMemberDto.pix_key_type,
        bank_corporate_reason: updateMemberDto.bank_corporate_reason,
        agency: updateMemberDto.agency,
        agency_digit: updateMemberDto.agency_digit,
        account_digit: updateMemberDto.account_digit,
      },
    });

    const memberUpdated = await this.prismaService.member.update({
      where: { id },
      data: {
        last_active: updateMemberDto.last_active,
        status: updateMemberDto.status,
        role_id: updateMemberDto.role_id,
      },
    });

    return { memberUpdated };
  }

  async changePassword(user_id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.old_password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new ConflictException(ErrorMessagesHelper.INVALID_CREDENTIALS);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(
      changePasswordDto.new_password,
      salt,
    );

    await this.prismaService.user.update({
      where: {
        id: user_id,
      },
      data: {
        password_hash,
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

  async blockMembers({
    organization_id,
    updateManyMembersDto,
  }: {
    organization_id: string;
    updateManyMembersDto: UpdateManyMembersDto;
  }) {
    const organization = await this.prismaService.organization.findUnique({
      where: {
        id: organization_id,
      },
    });

    if (!organization) {
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    }

    const members = await this.prismaService.member.findMany({
      where: {
        id: {
          in: updateManyMembersDto.member_ids,
        },
        role: {
          NOT: {
            name: 'ADMIN',
          },
        },
      },
    });

    if (members.length !== updateManyMembersDto.member_ids.length) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    await this.prismaService.member.updateMany({
      where: {
        id: {
          in: updateManyMembersDto.member_ids,
        },
      },
      data: {
        status: 'INACTIVE',
      },
    });

    return {
      message: 'Members removed successfully',
      members,
    };
  }

  async blockAny({
    organization_id,
    updateManyMembersDto,
  }: {
    organization_id: string;
    updateManyMembersDto: UpdateManyMembersDto;
  }) {
    const organization = await this.prismaService.organization.findUnique({
      where: {
        id: organization_id,
      },
    });

    if (!organization) {
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    }

    const admins: number = await this.prismaService.member.count({
      where: {
        role: {
          name: 'ADMIN',
        },
      },
    });

    const members = await this.prismaService.member.findMany({
      where: {
        id: {
          in: updateManyMembersDto.member_ids,
        },
      },
      include: {
        role: true,
      },
    });

    const adminsToBlock: number = members.filter((member) => {
      return member.role.name === 'ADMIN';
    }).length;

    if (admins - adminsToBlock < 1) {
      throw new ConflictException(ErrorMessagesHelper.CANNOT_BLOCK_LAST_ADMIN);
    }

    if (members.length !== updateManyMembersDto.member_ids.length) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    await this.prismaService.member.updateMany({
      where: {
        id: {
          in: updateManyMembersDto.member_ids,
        },
      },
      data: {
        status: 'INACTIVE',
      },
    });

    return {
      message: 'Members removed successfully',
      members,
    };
  }

  async activateMembers(organization_id: string, member_ids: string[]) {
    const organization = await this.prismaService.organization.findUnique({
      where: {
        id: organization_id,
      },
    });

    if (!organization) {
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    }

    const members = await this.prismaService.member.findMany({
      where: {
        id: {
          in: member_ids,
        },
      },
    });

    if (members.length !== member_ids.length) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    await this.prismaService.member.updateMany({
      where: {
        id: {
          in: member_ids,
        },
      },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  async updateProfile(
    user_id: string,
    organization_id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Member> {
    const member = await this.prismaService.member.findUnique({
      where: {
        organization_id_user_id: {
          organization_id,
          user_id,
        },
      },
    });

    if (!member) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    if (updateProfileDto.new_email) {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: updateProfileDto.new_email,
        },
      });

      if (user && user.id !== member.user_id) {
        throw new NotFoundException(ErrorMessagesHelper.INVALID_CREDENTIALS);
      }

      await this.verificationRequestService.createVerificationRequest({
        createVerificationRequestDto: {
          identifier: updateProfileDto.new_email,
          type: VerificationType.EMAIL_VERIFICATION,
          metadata: {
            user_id: member.user_id,
          },
        },
        expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      });
    }

    const updatedMember = await this.prismaService.member.update({
      where: {
        id: member.id,
      },
      data: {
        last_active: new Date(),
        user: {
          update: {
            neighborhood: updateProfileDto.neighborhood,
            city: updateProfileDto.city,
            state: updateProfileDto.state,
            address_line: updateProfileDto.address_line,
            address_number: updateProfileDto.address_number,
            postal_code: updateProfileDto.postal_code,
            phone: updateProfileDto.phone,
            name: updateProfileDto.name,
          },
        },
      },
      include: {
        user: true,
        role: true,
      },
    });

    return updatedMember;
  }

  // async updateBankInformation(
  //   member_id: string,
  //   updateBankInformationDto: UpdateBankInformationDto,
  // ) {
  //   const member = await this.prismaService.member.findUnique({
  //     where: { id: member_id },
  //   });

  //   if (!member) {
  //     throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
  //   }

  //   return await this.prismaService.user.update({
  //     where: {
  //       id: member.user_id,
  //     },
  //     data: {
  //       ...updateBankInformationDto,
  //     },
  //   });
  // }

  // async leaveOrganization(leaveOrganizationDto: LeaveOrganizationDto) {
  //   const organization = await this.prismaService.organization.findUnique({
  //     where: { id: leaveOrganizationDto.organization_id },
  //   });

  //   if (!organization) {
  //     throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
  //   }

  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       id: 'b2bb8387-6559-4526-a954-e2a514558458',
  //     },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
  //   }

  //   const member = await this.prismaService.member.findFirst({
  //     where: {
  //       organization_id: leaveOrganizationDto.organization_id,
  //       user_id: 'b2bb8387-6559-4526-a954-e2a514558458',
  //       left_at: null,
  //     },
  //   });

  //   if (!member) {
  //     throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
  //   }

  //   await this.prismaService.member.update({
  //     where: { id: member.id },
  //     data: {
  //       left_at: new Date(),
  //     },
  //   });

  //   return {
  //     message: 'Você saiu da organização com sucesso.',
  //   };
  // }
}
