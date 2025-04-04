import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsCNPJ } from 'src/common/decorators/is-cnpj.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

enum OrganizationSortFieldEnum {
  CreatedAt = 'created_at',
}

export class OrganizationPaginationDto extends PaginationQueryDto<OrganizationSortFieldEnum> {
  @ApiPropertyOptional({
    enum: OrganizationSortFieldEnum,
    default: OrganizationSortFieldEnum.CreatedAt,
  })
  @IsEnum(OrganizationSortFieldEnum)
  @IsOptional()
  sort: OrganizationSortFieldEnum = OrganizationSortFieldEnum.CreatedAt;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsCNPJ()
  @ApiPropertyOptional()
  cnpj?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  corporate_name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  city?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  state?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  country?: string;

  where(): Prisma.OrganizationWhereInput {
    const AND: Prisma.Enumerable<Prisma.OrganizationWhereInput> = [];

    if (this.name) {
      AND.push({
        name: {
          contains: this.name,
        },
      });
    }

    if (this.cnpj) {
      AND.push({
        cnpj: {
          contains: this.cnpj,
        },
      });
    }

    if (this.corporate_name) {
      AND.push({
        corporate_name: {
          contains: this.corporate_name,
        },
      });
    }

    if (this.city) {
      AND.push({
        city: {
          contains: this.city,
        },
      });
    }

    if (this.state) {
      AND.push({
        state: {
          contains: this.state,
        },
      });
    }

    if (this.phone) {
      AND.push({
        phone: {
          contains: this.phone,
        },
      });
    }

    if (this.q) {
      AND.push({
        OR: [
          {
            name: {
              contains: this.q,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    return {
      AND,
    };
  }
}
