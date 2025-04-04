import { PrismaClient } from '@prisma/client';
import { roleSeed } from './role-seed';
import { userSeed } from './user-seed';
import { memberSeed } from './member-seed';

const prisma = new PrismaClient();

async function main() {
  console.time('Seed completed successfully! 🌿');
  const roleSeedData = await roleSeed(prisma);
  const userSeedData = await userSeed(prisma);
  await memberSeed(prisma, {
    users: userSeedData,
    roles: roleSeedData.roles,
    organization_id: roleSeedData.organization.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    console.timeEnd('Error seeding the database!');
    process.exit(1);
  })
  .finally(() => {
    (async () => {
      console.timeEnd('Seed completed successfully! 🌿');
      await prisma.$disconnect();
    })();
  });
