import { PrismaClient } from '@prisma/client';
import { moduleData, roleData } from './seed-data/role-seed.data';
import { organizationData } from './seed-data/seed.data';

export async function roleSeed(prisma: PrismaClient) {
  console.time('Role Seed');

  const organization = await prisma.organization.upsert({
    where: {
      cnpj: organizationData.cnpj,
    },
    create: {
      ...organizationData,
    },
    update: {},
  });

  const modules = await Promise.all(
    moduleData.map((module) => {
      return prisma.module.upsert({
        where: {
          name: module.name,
        },
        create: {
          name: module.name,
          label: module.label,
          actions: module.actions,
          description: module.description,
          organization_id: organization.id,
        },
        update: {},
      });
    }),
  );

  const roles = await Promise.all(
    roleData.map((role) => {
      return prisma.role.upsert({
        where: {
          name: role.name,
        },
        create: {
          name: role.name,
          description: role.description,
          organization_id: organization.id,
        },
        update: {},
      });
    }),
  );

  const moduleAllowedActions = roleData.map((role) => {
    return role.rolePermissions.map((rolePermission) => {
      const moduleId = modules.find(
        (module) => module.name === rolePermission.moduleName,
      )?.id;

      if (!moduleId) {
        throw new Error('Module not found');
      }

      return {
        module_id: moduleId,
        allowed: rolePermission.allowed,
      };
    });
  });

  roles.map((role, index) => {
    moduleAllowedActions[index].map(async (moduleAllowedAction) => {
      return prisma.rolePermission.upsert({
        where: {
          module_id_role_id: {
            module_id: moduleAllowedAction.module_id,
            role_id: role.id,
          },
        },
        create: {
          role_id: role.id,
          module_id: moduleAllowedAction.module_id,
          allowed: moduleAllowedAction.allowed,
        },
        update: {
          allowed: moduleAllowedAction.allowed,
        },
      });
    });
  });

  console.timeEnd('Role Seed');

  return {
    organization,
    modules,
    roles,
  };
}
