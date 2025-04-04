import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

enum InviteSortFieldEnum {
  CreatedAt = 'created_at',
}

export class InvitePaginationDto extends PaginationQueryDto<InviteSortFieldEnum> {
  @ApiPropertyOptional({
    enum: InviteSortFieldEnum,
    default: InviteSortFieldEnum.CreatedAt,
  })
  @IsEnum(InviteSortFieldEnum)
  @IsOptional()
  sort: InviteSortFieldEnum = InviteSortFieldEnum.CreatedAt;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsInt()
  role_id?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsDateString()
  expires_at?: Date;

  where(): Prisma.InviteWhereInput {
    const AND: Prisma.Enumerable<Prisma.InviteWhereInput> = [];

    if (this.email) {
      AND.push({
        email: {
          contains: this.email,
        },
      });
    }

    if (this.expires_at) {
      AND.push({
        expires_at: {
          lte: this.expires_at,
        },
      });
    }

    return {
      AND,
    };
  }
}
