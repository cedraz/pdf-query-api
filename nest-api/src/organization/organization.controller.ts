import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationPaginationDto } from './dto/organization.pagination.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Organization } from './entities/organization.entity';
import { ApiPaginatedResponse } from 'src/common/dto/api-pagineted-response.dto';
import { Request as ExpressRequest } from 'express';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidationPipe } from 'src/common/pipes/image-validation.pipe';
@Controller('organization')
@ApiTags('organization')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: Organization })
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as JwtPayload;
    return this.organizationService.create(user.sub, createOrganizationDto);
  }

  @Get('')
  @ApiPaginatedResponse(Organization)
  findAll(@Query() organizationPaginationDto: OrganizationPaginationDto) {
    return this.organizationService.findAll(organizationPaginationDto);
  }

  @Get(':organization_id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Organization })
  findOne(@Param('organization_id') organization_id: string) {
    return this.organizationService.findOne(organization_id);
  }

  @Patch(':organization_id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Organization })
  update(
    @Param('organization_id') organization_id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(
      organization_id,
      updateOrganizationDto,
    );
  }

  @Post('/logo/:id')
  @ApiOperation({
    summary: 'Upload organization logo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo para upload',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image')) // 'image' é o nome do campo no formulário
  uploadAvatar(
    @UploadedFile(new imageValidationPipe()) image: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.organizationService.uploadLogo(id, image);
  }

  // @Post('/:organization_id/add-member')
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: Organization })
  // @UseGuards(JwtAuthGuard, OrganizationGuard, RolesGuard)
  // @Roles('ADMIN')
  // async addMember(
  //   @Param('organization_id') organization_id: string,
  //   @Body()
  //   addMemberToOrganizationDto: Omit<
  //     AddMemberToOrganizationDto,
  //     'organization_id'
  //   >,
  // ) {
  //   return this.organizationService.addMember({
  //     ...addMemberToOrganizationDto,
  //     organization_id,
  //   });
  // }

  // @Patch('/:organization_id/change-member-role')
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: Member })
  // @UseGuards(JwtAuthGuard, OrganizationGuard, RolesGuard)
  // @Roles('ADMIN')
  // async changeMemberRole(
  //   @Param('organization_id') organization_id: string,
  //   @Body()
  //   changeMemberRoleDto: ChangeMemberRoleDto,
  // ) {
  //   return this.organizationService.changeMemberRole(
  //     organization_id,
  //     changeMemberRoleDto,
  //   );
  // }
}
