import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolePermissionService } from './role.service';
import { Role } from './entity/role.entity';
import { Module } from './entity/module.entity';
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
  findModules() {
    return this.roleService.findModules();
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
