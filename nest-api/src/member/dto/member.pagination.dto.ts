import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

enum MemberSortFieldEnum {
  CreatedAt = 'created_at',
  LeftAt = 'left_at',
  LastActive = 'last_active',
  InvitedAt = 'invited_at',
}

export class MemberPaginationDto extends PaginationQueryDto<MemberSortFieldEnum> {
  @ApiPropertyOptional({
    enum: MemberSortFieldEnum,
    default: MemberSortFieldEnum.CreatedAt,
  })
  @IsEnum(MemberSortFieldEnum)
  @IsOptional()
  sort: MemberSortFieldEnum = MemberSortFieldEnum.CreatedAt;

  @IsInt()
  @ApiPropertyOptional()
  @IsOptional()
  role_id: number;

  where(): Prisma.MemberWhereInput {
    const AND: Prisma.Enumerable<Prisma.MemberWhereInput> = [];

    if (this.role_id) {
      AND.push({
        role_id: this.role_id,
      });
    }

    if (this.q) {
      AND.push({
        OR: [
          {
            user: {
              name: {
                contains: this.q,
                mode: 'insensitive',
              },
            },
          },
          {
            organization: {
              name: {
                contains: this.q,
                mode: 'insensitive',
              },
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
