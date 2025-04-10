import { ApiProperty } from '@nestjs/swagger';
import { Invite } from 'src/invite/entities/invite.entity';
import { MemberSimple } from 'src/member/entities/member.entity';

export class OrganizationSimple {
  id: string;
  name: string;
  cnpj: string;
  corporate_name: string;
  phone: string;
  billing_email: string;
  general_email: string;
  address_line: string;
  address_number: string;
  neighborhood: string;
  postal_code: string;
  city: string;
  state: string;
  created_at: Date;
  updated_at: Date;
}

export class Organization extends OrganizationSimple {
  @ApiProperty({ type: () => [MemberSimple] })
  members: MemberSimple[];

  @ApiProperty({ type: () => [Invite] })
  invites: Invite[];
}
