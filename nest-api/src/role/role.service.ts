import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';

@Injectable()
export class RolePermissionService {
  constructor(private prisma: PrismaService) {}

  async copyRolePermissionsToMember(role_id: number, member_id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: member_id },
    });

    if (!member) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    const role = await this.prisma.role.findUnique({
      where: { id: role_id },
    });

    if (!role) {
      throw new NotFoundException(ErrorMessagesHelper.ROLE_NOT_FOUND);
    }

    const role_permissions = await this.prisma.rolePermission.findMany({
      where: { role_id },
    });

    const memberPermissionsTransaction = role_permissions.map((rp) => {
      return this.prisma.memberPermission.upsert({
        where: {
          member_id_module_id: {
            member_id,
            module_id: rp.module_id,
          },
        },
        update: { allowed: rp.allowed },
        create: {
          member_id,
          module_id: rp.module_id,
          allowed: rp.allowed,
        },
      });
    });

    const member_permissions = await this.prisma.$transaction(
      memberPermissionsTransaction,
    );

    return member_permissions;
  }

  async updateRole(role_id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { id: role_id },
    });

    if (!role) {
      throw new NotFoundException(ErrorMessagesHelper.ROLE_NOT_FOUND);
    }

    const { name, description, role_permissions, propagate } = updateRoleDto;

    if (name) {
      const roleWithSameName = await this.prisma.role.findUnique({
        where: { name },
      });

      if (roleWithSameName && roleWithSameName.id !== role_id) {
        throw new Error(ErrorMessagesHelper.ROLE_NAME_TAKEN);
      }
    }

    await this.prisma.role.update({
      where: { id: role_id },
      data: {
        name,
        description,
      },
    });

    if (role_permissions) {
      const moduleIds = role_permissions.map((rp) => rp.module_id);
      const modules = await this.prisma.module.findMany({
        where: { id: { in: moduleIds } },
      });

      if (modules.length !== moduleIds.length) {
        const moduleNotFound = moduleIds.find(
          (id) => !modules.some((m) => m.id === id),
        );
        throw new NotFoundException(
          ErrorMessagesHelper.moduleNotFound(moduleNotFound as number),
        );
      }

      const upsertRolePermissions = role_permissions.map((rp) => {
        return this.prisma.rolePermission.upsert({
          where: {
            module_id_role_id: {
              module_id: rp.module_id,
              role_id,
            },
          },
          update: { allowed: rp.allowed },
          create: {
            module_id: rp.module_id,
            role_id,
            allowed: rp.allowed,
          },
        });
      });

      await this.prisma.$transaction(upsertRolePermissions);

      if (propagate) {
        await this.syncRoleToMembers(role_id);
      }
    }
  }

  async syncRoleToMembers(role_id: number) {
    const members = await this.prisma.member.findMany({
      where: { role_id },
      include: { member_permissions: true },
    });

    const role_permissions = await this.prisma.rolePermission.findMany({
      where: { role_id },
    });

    const memberPermissionTransaction = members.map((member) => {
      return role_permissions.map((rp) => {
        return this.prisma.memberPermission.upsert({
          where: {
            member_id_module_id: {
              member_id: member.id,
              module_id: rp.module_id,
            },
          },
          create: {
            member_id: member.id,
            module_id: rp.module_id,
            allowed: rp.allowed,
          },
          update: {
            allowed: rp.allowed,
          },
        });
      });
    });

    const member_permissions = await this.prisma.$transaction(
      memberPermissionTransaction.flat(),
    );

    return member_permissions;
  }

  async findModules(organization_id: string) {
    return await this.prisma.module.findMany({
      where: { organization_id },
    });
  }

  async findRoles(organization_id: string) {
    return await this.prisma.role.findMany({
      where: { organization_id },
      include: {
        role_permissions: {
          include: {
            module: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.role.findUnique({
      where: { id },
      include: {
        role_permissions: {
          include: {
            module: true,
          },
        },
      },
    });
  }
}
