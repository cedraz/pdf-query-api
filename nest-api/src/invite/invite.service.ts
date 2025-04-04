import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { InvitePaginationDto } from './dto/invite.pagination.dto';
import { Invite } from '@prisma/client';

@Injectable()
export class InviteService {
  constructor(private prismaService: PrismaService) {}

  async create(createInviteDto: CreateInviteDto): Promise<Invite> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [inviter, userInvited, organization] = await Promise.all([
      this.validateUser(createInviteDto.inviter_id),
      this.validateUserByEmail(createInviteDto.email),
      this.validateOrganization(createInviteDto.organization_id),
    ]);

    if (createInviteDto.inviter_id === userInvited.id) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    return this.prismaService.invite.upsert({
      where: {
        organization_id_email: {
          email: createInviteDto.email,
          organization_id: createInviteDto.organization_id,
        },
      },
      create: {
        email: createInviteDto.email,
        organization_id: createInviteDto.organization_id,
        inviter_id: createInviteDto.inviter_id,
        expires_at: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour
        role_id: createInviteDto.role_id,
      },
      update: {
        expires_at: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour
        deleted_at: null,
      },
    });
  }

  async findAll(
    organization_id: string,
    invitePaginationDto: InvitePaginationDto,
  ) {
    const invites = await this.prismaService.invite.findMany({
      where: {
        organization_id,
        ...invitePaginationDto.where(),
      },
      ...invitePaginationDto.orderBy(),
    });

    const total = await this.prismaService.invite.count({
      where: {
        organization_id,
        ...invitePaginationDto.where(),
      },
    });

    return invitePaginationDto.createMetadata(invites, total);
  }

  findOne(invite_id: string): Promise<Invite | null> {
    return this.prismaService.invite.findUnique({
      where: { id: invite_id },
    });
  }

  async update(
    invite_id: string,
    updateInviteDto: UpdateInviteDto,
  ): Promise<Invite> {
    const invite = await this.prismaService.invite.findUnique({
      where: { id: invite_id },
    });

    if (!invite) {
      throw new NotFoundException(ErrorMessagesHelper.INVITE_NOT_FOUND);
    }

    return this.prismaService.invite.update({
      where: { id: invite_id },
      data: updateInviteDto,
    });
  }

  remove(invite_id: string): Promise<Invite> {
    return this.prismaService.invite.delete({
      where: { id: invite_id },
    });
  }

  removeMany(ids: string[]) {
    return this.prismaService.invite.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  // async acceptInvite(invite_id: string, invited_user_id: string) {
  //   const invite = await this.prismaService.invite.findUnique({
  //     where: { id: invite_id },
  //   });

  //   if (!invite) {
  //     throw new NotFoundException(ErrorMessagesHelper.INVITE_NOT_FOUND);
  //   }

  //   if (invite.expires_at < new Date()) {
  //     throw new NotFoundException(ErrorMessagesHelper.INVITE_EXPIRED);
  //   }

  //   const user = await this.prismaService.user.findUnique({
  //     where: { id: invited_user_id },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
  //   }

  //   if (user.email !== invite.email) {
  //     throw new NotFoundException(ErrorMessagesHelper.USER_NOT_INVITED);
  //   }

  //   await this.prismaService.$transaction([
  //     this.prismaService.member.create({
  //       data: {
  //         user_id: user.id,
  //         organization_id: invite.organization_id,
  //         invited_at: invite.created_at,
  //         status: 'ACTIVE',
  //       },
  //     }),

  //     this.prismaService.invite.delete({
  //       where: { id: invite_id },
  //     }),
  //   ]);

  //   return invite;
  // }

  async rejectInvite(invite_id: string, invited_user_id: string) {
    const invite = await this.prismaService.invite.findUnique({
      where: { id: invite_id },
    });

    if (!invite) {
      throw new NotFoundException(ErrorMessagesHelper.INVITE_NOT_FOUND);
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: invited_user_id },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    if (user.email !== invite.email) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_INVITED);
    }

    await this.prismaService.invite.delete({
      where: { id: invite_id },
    });
  }

  private async validateUser(user_id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: user_id },
    });
    if (!user) throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    return user;
  }

  private async validateUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    return user;
  }

  private async validateOrganization(organization_id: string) {
    const organization = await this.prismaService.organization.findUnique({
      where: { id: organization_id },
    });
    if (!organization)
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    return organization;
  }
}
