import { ApiProperty } from '@nestjs/swagger';
import { Invite } from 'src/invite/entities/invite.entity';
import { MemberSimple } from 'src/member/entities/member-simple.entity';
import { OrganizationSimple } from './organization-simple.entity';

export class Organization extends OrganizationSimple {
  @ApiProperty({ type: () => [MemberSimple] })
  members: MemberSimple[];

  @ApiProperty({ type: () => [Invite] })
  invites: Invite[];
}
