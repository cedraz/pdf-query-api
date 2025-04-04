import { PartialType } from '@nestjs/swagger';
import { CreateAuditEventDto } from './create-audit-event.dto';

export class UpdateAuditEventDto extends PartialType(CreateAuditEventDto) {}
