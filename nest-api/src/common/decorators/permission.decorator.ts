import { SetMetadata } from '@nestjs/common';
import { TModules } from '../constants/module.const';
import { AppAction } from 'src/casl/types';

export interface RequiredPermission {
  action: AppAction;
  subject: TModules;
}

export const CheckPermissions = (...requirements: RequiredPermission[]) =>
  SetMetadata('permissions', requirements);
