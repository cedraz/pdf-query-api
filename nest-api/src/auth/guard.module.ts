import { Global, Module } from '@nestjs/common';
import { GlobalAdminGuard } from './guards/global-admin.guard';
import { PermissionsGuard } from './guards/permission.guard';
import { CaslModule } from 'src/casl/casl.module';

@Global()
@Module({
  imports: [CaslModule],
  providers: [GlobalAdminGuard, PermissionsGuard],
  exports: [GlobalAdminGuard, PermissionsGuard, CaslModule],
})
export class GuardsModule {}
