import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolePermissionService } from './role.service';
import { Role } from './entity/role.entity';
import { Module } from './entity/module.entity';
import { MemberPermission } from './entity/member-permission.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('/:organization_id/role')
@ApiTags('role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RolePermissionService) {}

  @Get('')
  @ApiOkResponse({ type: [Role] })
  findRoles(@Param('organization_id') organization_id: string) {
    return this.roleService.findRoles(organization_id);
  }

  @Get(':role_id')
  @ApiOkResponse({ type: Role })
  findRole(@Param('role_id') role_id: number) {
    return this.roleService.findById(role_id);
  }

  @Get('modules')
  @ApiOkResponse({ type: [Module] })
  findModules(@Param('organization_id') organization_id: string) {
    return this.roleService.findModules(organization_id);
  }

  @Patch(':role_id/copy-permissions/:member_id')
  @ApiOkResponse({ type: [MemberPermission] })
  copyRolePermissionsToMember(
    @Param('role_id') role_id: number,
    @Param('member_id') member_id: string,
  ) {
    return this.roleService.copyRolePermissionsToMember(role_id, member_id);
  }

  @Patch(':role_id/sync-permissions')
  @ApiOkResponse({ type: [MemberPermission] })
  syncRoleToMembers(@Param('role_id') role_id: number) {
    return this.roleService.syncRoleToMembers(role_id);
  }

  @Put(':role_id')
  @ApiOkResponse({ type: Role })
  updateRole(
    @Param('role_id') role_id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(role_id, updateRoleDto);
  }
}
