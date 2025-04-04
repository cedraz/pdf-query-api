import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'No DATABASE_URL provided. Please set the DATABASE_URL environment variable.',
    );
  }

  let url: URL;

  url = new URL(process.env.DATABASE_URL);

  if (process.env.MIGRATION_DATABASE_URL) {
    url = new URL(process.env.MIGRATION_DATABASE_URL);
  }

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseURL }, // Passa o ambiente atualizado
  });

  process.env.DATABASE_URL = databaseURL;
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
