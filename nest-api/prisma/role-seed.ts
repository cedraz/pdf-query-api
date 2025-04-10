import { PrismaClient } from '@prisma/client';
import {
  modulesData,
  permissionsData,
  rolesData,
} from './seed-data/role-seed.data';
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

  await prisma.$transaction(
    permissionsData.map((permission) => {
      return prisma.action.upsert({
        where: {
          name: permission.name,
        },
        create: {
          name: permission.name,
          display_name: permission.label,
        },
        update: {},
      });
    }),
  );

  const modules = await prisma.$transaction(
    modulesData.map((module) => {
      return prisma.module.upsert({
        where: {
          name: module.name,
        },
        create: {
          display_name: module.label,
          name: module.name,
          actions: {
            connectOrCreate: module.actions.map((action) => ({
              where: {
                name: action.name,
              },
              create: {
                name: action.name,
                display_name: action.label,
              },
            })),
          },
        },
        update: {},
      });
    }),
  );

  const roles = await prisma.$transaction(
    rolesData.map((role) => {
      return prisma.role.upsert({
        where: {
          name_organization_id: {
            name: role.name,
            organization_id: organization.id,
          },
        },
        create: {
          name: role.name,
          description: role.description,
          organization_id: organization.id,
          role_permissions: {
            create: role.rolePermissions.map((rp) => {
              return {
                module_id: modules[rp.moduleIndex].id,
                allowed: {
                  connectOrCreate: rp.permissions.map((permission) => ({
                    where: { name: permission.name },
                    create: {
                      name: permission.name,
                      display_name: permission.label,
                    },
                  })),
                },
              };
            }),
          },
        },
        update: {},
      });
    }),
  );

  console.timeEnd('Role Seed');

  return {
    organization,
    modules,
    roles,
  };
}
