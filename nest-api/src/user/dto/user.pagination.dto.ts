import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

enum UserSortFieldEnum {
  CreatedAt = 'created_at',
}

export class UserPaginationDto extends PaginationQueryDto<UserSortFieldEnum> {
  @ApiPropertyOptional({
    enum: UserSortFieldEnum,
    default: UserSortFieldEnum.CreatedAt,
  })
  @IsEnum(UserSortFieldEnum)
  @IsOptional()
  sort: UserSortFieldEnum = UserSortFieldEnum.CreatedAt;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  phone?: string;

  where(): Prisma.UserWhereInput {
    const AND: Prisma.Enumerable<Prisma.UserWhereInput> = [];

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
