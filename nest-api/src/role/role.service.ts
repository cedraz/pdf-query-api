import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';

@Injectable()
export class RolePermissionService {
  constructor(private prisma: PrismaService) {}

  async updateRole(role_id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { id: role_id },
    });

    if (!role) {
      throw new NotFoundException(ErrorMessagesHelper.ROLE_NOT_FOUND);
    }

    const { name, description, role_permissions } = updateRoleDto;

    if (name) {
      const roleWithSameName = await this.prisma.role.findUnique({
        where: {
          name_organization_id: {
            name,
            organization_id: role.organization_id,
          },
        },
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
          create: {
            module_id: rp.module_id,
            role_id,
            allowed: {
              connect: rp.allowed_permission_ids.map((permission_id) => ({
                id: permission_id,
              })),
            },
          },
          update: {
            allowed: {
              set: [],
              connect: rp.allowed_permission_ids.map((permission_id) => ({
                id: permission_id,
              })),
            },
          },
        });
      });

      await this.prisma.$transaction(upsertRolePermissions);
    }
  }

  async findModules() {
    return await this.prisma.module.findMany({
      where: { enabled: true },
    });
  }

  async findRoles(organization_id: string) {
    return await this.prisma.role.findMany({
      where: { organization_id },
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
