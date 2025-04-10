import { Injectable, NotFoundException } from '@nestjs/common';
import { AbilityBuilder } from '@casl/ability';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { createPrismaAbility } from '@casl/prisma';

@Injectable()
export class CaslAbilityFactory {
  constructor(private prisma: PrismaService) {}

  async createForMember(member_id: string) {
    const { can, build } = new AbilityBuilder(createPrismaAbility);

    const member = await this.prisma.member.findUnique({
      where: { id: member_id },
      include: {
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

    if (!member) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    member.role.role_permissions.forEach((rp) => {
      const subject = rp.module.name;

      const modulePermissionsIds = rp.module.actions.map((action) =>
        rp.module.enabled && action.enabled ? action.id : null,
      );

      rp.allowed.forEach((permission) => {
        if (modulePermissionsIds.includes(permission.id)) {
          can(permission.name, subject);
        }
      });
    });

    return build();
  }
}
