import { Injectable } from '@nestjs/common';
import { CreateAuditEventDto } from './dto/create-audit-event.dto';
import { UpdateAuditEventDto } from './dto/update-audit-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditEventService {
  constructor(private prismaService: PrismaService) {}

  // create(createAuditEventDto: CreateAuditEventDto) {
  //   return this.prismaService.auditEvent.create({
  //     data: createAuditEventDto,
  //   });
  // }

  // update(id: number, updateAuditEventDto: UpdateAuditEventDto) {
  //   return this.prismaService.auditEvent.update({
  //     where: { id },
  //     data: updateAuditEventDto,
  //   });
  // }
}
