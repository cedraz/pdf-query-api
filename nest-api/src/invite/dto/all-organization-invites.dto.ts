import { IsNotEmpty, IsUUID } from 'class-validator';
import { InvitePaginationDto } from './invite.pagination.dto';

export class AllOrganizationInvitesDto extends InvitePaginationDto {
  @IsNotEmpty()
  @IsUUID()
  organization_id: string;
}
