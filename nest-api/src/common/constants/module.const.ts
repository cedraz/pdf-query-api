import { modules } from 'prisma/seed-data/role-seed.data';

export type TModules = (typeof modules)[number];

export const isAppModule = (value: string): value is TModules => {
  return modules.includes(value);
};
