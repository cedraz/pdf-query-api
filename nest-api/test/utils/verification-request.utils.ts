import { PrismaClient, VerificationType } from '@prisma/client';

const prisma = new PrismaClient();

export function createVerificationRequest(
  identifier: string,
  type: VerificationType,
  code: string,
  expires?: Date,
) {
  return prisma.verificationRequest.create({
    data: {
      identifier,
      code,
      expires: expires ? expires : new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      type,
    },
  });
}

export function setEmailAsVerified(email: string) {
  return prisma.user.update({
    where: {
      email,
    },
    data: {
      email_verified_at: new Date(),
    },
  });
}
