import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { AuditEventService } from './audit-event.service';
import { CreateAuditEventDto } from './dto/create-audit-event.dto';
import { UpdateAuditEventDto } from './dto/update-audit-event.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('audit-event')
@ApiTags('audit-event')
export class AuditEventController {
  constructor(private readonly auditEventService: AuditEventService) {}

  // @Post()
  // @ApiOperation({
  //   summary: 'Create an audit event',
  // })
  // @ApiOkResponse({ type: CreateAuditEventDto })
  // create(@Body() createAuditEventDto: CreateAuditEventDto) {
  //   return this.auditEventService.create(createAuditEventDto);
  // }
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAuditEventDto: UpdateAuditEventDto,
  // ) {
  //   return this.auditEventService.update(+id, updateAuditEventDto);
  // }
}
