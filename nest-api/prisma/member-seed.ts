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

      return await prisma.member.upsert({
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
    }),
  );

  return members;
}
