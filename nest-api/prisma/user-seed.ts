import { PrismaClient } from '@prisma/client';
import { userData } from './seed-data/user-seed.data';
import * as bcrypt from 'bcrypt';

export async function userSeed(prisma: PrismaClient) {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('user@123', salt);

  const users = await Promise.all(
    userData.map((user) => {
      return prisma.user.upsert({
        where: {
          email: user.email,
        },
        create: {
          ...user,
          password_hash: password,
        },
        update: {},
      });
    }),
  );

  return users;
}
