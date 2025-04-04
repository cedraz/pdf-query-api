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
        member_permissions: {
          include: { module: true },
        },
      },
    });

    if (!member) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    member.member_permissions.forEach((mp) => {
      const subject = mp.module.name;

      mp.allowed.forEach((action) => {
        if (mp.module.actions.includes(action)) {
          can(action, subject);
        }
      });
    });

    return build();
  }
}
