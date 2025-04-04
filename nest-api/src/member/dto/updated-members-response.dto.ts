import { Member } from 'src/member/entities/member.entity';

export class UpdatedMembersResponseDto {
  message: string;
  members: Member[];
}
