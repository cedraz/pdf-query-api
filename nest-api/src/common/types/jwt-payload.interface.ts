import { VerificationType } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  expiresIn: string;
  iat: number;
  exp: number;
  tokenVersion: number;
  type?: VerificationType;
  email?: string;
  memberId?: string;
};
