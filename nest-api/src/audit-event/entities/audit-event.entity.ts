import { Operation } from '@prisma/client';

export class AuditEvent {
  id: number;
  title: string;

  description?: string;
  location?: string;
  url?: string;
  details?: any;

  model?: string;
  operation?: Operation;
  old_data?: any;
  new_data?: any;

  created_at: Date;
  updated_at: Date;
}
