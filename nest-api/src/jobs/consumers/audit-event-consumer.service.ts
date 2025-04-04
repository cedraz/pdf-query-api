import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueNames } from '../utils/queue-names.helper';
import { CreateAuditEventDto } from 'src/audit-event/dto/create-audit-event.dto';
import { AuditEventService } from 'src/audit-event/audit-event.service';

@Processor(QueueNames.AUDIT_EVENT_QUEUE)
export class AuditEventConsumerService extends WorkerHost {
  constructor(
    // private googleSheetsService: GoogleSheetsService,
    private auditEventService: AuditEventService,
  ) {
    super();
  }

  async process({ data }: Job<CreateAuditEventDto>) {
    const {
      title,
      description,
      location,
      url,
      details,
      old_data,
      new_data,
      operation,
      model,
    } = data;

    // await this.auditEventService.create({
    //   title,
    //   description,
    //   location,
    //   url,
    //   details,
    //   old_data,
    //   new_data,
    //   operation,
    //   model,
    // });

    // const { googleSheets, auth, spreadsheetId } =
    //   await this.googleSheetsService.getAuthSheets();

    // const values = [[title, description, details, location, url]];

    // await googleSheets.spreadsheets.values.append({
    //   auth,
    //   spreadsheetId,
    //   range: 'Página1',
    //   valueInputOption: 'USER_ENTERED',
    //   requestBody: {
    //     values,
    //   },
    // });
  }
}
