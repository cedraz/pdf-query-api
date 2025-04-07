import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { OrganizationPaginationDto } from './dto/organization.pagination.dto';
import { PaginationResultDto } from 'src/common/entities/pagination-result.entity';
import { Organization } from './entities/organization.entity';
import { AddMemberToOrganizationDto } from './dto/add-member-to-organization.dto';
import { CloudinaryService } from 'src/providers/cloudinary/cloudinary.service';
import { MemberService } from 'src/member/member.service';
import { moduleData, roleData } from 'prisma/seed-data/role-seed.data';

@Injectable()
export class OrganizationService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
    private memberService: MemberService,
  ) {}

  async create(user_id: string, createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.prismaService.organization.create({
      data: {
        ...createOrganizationDto,
      },
      include: {
        invites: true,
        members: true,
      },
    });

    const modules = await this.prismaService.$transaction(
      moduleData.map((module) => {
        return this.prismaService.module.create({
          data: {
            organization_id: organization.id,
            ...module,
          },
        });
      }),
    );

    const roles = await this.prismaService.$transaction(
      roleData.map((role) => {
        return this.prismaService.role.create({
          data: {
            organization_id: organization.id,
            name: role.name,
            description: role.description,
            role_permissions: {
              createMany: {
                data: modules.flatMap((module) => {
                  return role.rolePermissions.map((rolePermission) => ({
                    allowed: rolePermission.allowed,
                    module_id: module.id,
                  }));
                }),
              },
            },
          },
        });
      }),
    );

    const adminRole = roles.find((role) => role.name === 'ADMIN')!;

    await this.memberService.create({
      organization_id: organization.id,
      role_id: adminRole.id,
      invited_at: new Date().toISOString(),
      user_id,
    });

    return organization;
  }

  async findAll(
    organizationPaginationDto: OrganizationPaginationDto,
  ): Promise<PaginationResultDto<Organization>> {
    const organizations = await this.prismaService.organization.findMany({
      where: organizationPaginationDto.where(),
      ...organizationPaginationDto.orderBy(),
      include: {
        invites: true,
        members: true,
      },
    });

    const total = await this.prismaService.organization.count({
      where: organizationPaginationDto.where(),
    });

    return organizationPaginationDto.createMetadata(organizations, total);
  }

  findOne(id: string): Promise<Organization | null> {
    return this.prismaService.organization.findUnique({
      where: {
        id,
      },
      select: organizationSelect,
    });
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.prismaService.organization.findUnique({
      where: {
        id,
      },
    });

    if (!organization) {
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    }

    return this.prismaService.organization.update({
      where: {
        id,
      },
      data: {
        ...updateOrganizationDto,
      },
    });
  }

  async addMember(addMemberToOrganizationDto: AddMemberToOrganizationDto) {
    const member = await this.prismaService.user.findUnique({
      where: {
        id: addMemberToOrganizationDto.member_id,
      },
    });

    if (!member) {
      throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
    }

    const organization = await this.prismaService.organization.findUnique({
      where: {
        id: addMemberToOrganizationDto.organization_id,
      },
    });

    if (!organization) {
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    }

    return this.prismaService.organization.update({
      where: {
        id: addMemberToOrganizationDto.organization_id,
      },
      data: {
        members: {
          connect: {
            id: addMemberToOrganizationDto.member_id,
          },
        },
      },
    });
  }

  async uploadLogo(id: string, image: Express.Multer.File) {
    const response = await this.cloudinaryService.uploadImage(image);

    const imageURL = response.secure_url as string;

    return await this.prismaService.organization.update({
      where: {
        id,
      },
      data: {
        logo_url: imageURL,
      },
    });
  }

  // async changeMemberRole(
  //   organization_id: string,
  //   changeMemberRoleDto: ChangeMemberRoleDto,
  // ) {
  //   const organization = await this.prismaService.organization.findUnique({
  //     where: {
  //       id: organization_id,
  //     },
  //   });

  //   if (!organization) {
  //     throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
  //   }

  //   const member = await this.prismaService.member.findUnique({
  //     where: {
  //       id: changeMemberRoleDto.member_id,
  //       organization_id,
  //     },
  //   });

  //   if (!member) {
  //     throw new NotFoundException(ErrorMessagesHelper.MEMBER_NOT_FOUND);
  //   }

  //   // INVALIDAR SESSÃO DO USUÁRIO
  //   await this.prismaService.user.update({
  //     where: {
  //       id: member.user_id,
  //     },
  //     data: {
  //       token_version: {
  //         increment: 1,
  //       },
  //     },
  //   });

  //   return this.prismaService.member.update({
  //     where: {
  //       id: changeMemberRoleDto.member_id,
  //       organization_id,
  //     },
  //     data: {
  //       role: changeMemberRoleDto.role,
  //     },
  //   });
  // }
}

const organizationSelect = {
  id: true,
  name: true,
  cnpj: true,
  corporate_name: true,
  phone: true,
  billing_email: true,
  general_email: true,
  address_line: true,
  address_number: true,
  neighborhood: true,
  postal_code: true,
  city: true,
  state: true,
  created_at: true,
  updated_at: true,
  invites: true,
  members: true,
};
