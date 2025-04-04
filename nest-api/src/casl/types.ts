// src/casl/types.ts
import { createPrismaAbility } from '@casl/prisma';
import { TModules } from 'src/common/constants/module.const';

export type AppAction = 'create' | 'read' | 'update' | 'delete' | (string & {});
export type AppSubject = TModules | 'all';
export type AppAbility = ReturnType<typeof createPrismaAbility>;
