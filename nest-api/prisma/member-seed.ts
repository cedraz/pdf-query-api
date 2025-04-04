import { MemberStatus, PrismaClient, Role, User } from '@prisma/client';

export async function memberSeed(
  prisma: PrismaClient,
  {
    users,
    roles,
    organization_id,
  }: {
    users: User[];
    roles: Role[];
    organization_id: string;
  },
) {
  const randomRole = () => {
    const randomIndex = Math.floor(Math.random() * roles.length);
    return roles[randomIndex];
  };

  const randomStatus = () => {
    const statuses = ['ACTIVE', 'INACTIVE', 'PENDING'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const statusKey = statuses[randomIndex] as keyof typeof MemberStatus;
    return MemberStatus[statusKey];
  };

  const members = await Promise.all(
    users.map(async (user) => {
      const role = randomRole();
      const status = randomStatus();

      const member = await prisma.member.upsert({
        where: {
          organization_id_user_id: {
            organization_id,
            user_id: user.id,
          },
        },
        create: {
          organization_id,
          user_id: user.id,
          role_id: role.id,
          invited_at: new Date(),
          status: status,
        },
        update: {},
      });

      await copyRolePermissionsToMember(prisma, role.id, member.id);
    }),
  );

  // await copyRolePermissionsToMember(
  //   prisma,
  //   6,
  //   '10da107d-af8a-4b3d-bf7f-61cef73eb3b2',
  // );

  return members;
}

async function copyRolePermissionsToMember(
  prisma: PrismaClient,
  role_id: number,
  member_id: string,
) {
  const role_permissions = await prisma.rolePermission.findMany({
    where: { role_id },
  });

  const member_permissions = role_permissions.map((rp) => {
    return prisma.memberPermission.upsert({
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

  await prisma.$transaction(member_permissions);

  return member_permissions;
}
