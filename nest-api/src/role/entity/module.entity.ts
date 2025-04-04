export class Module {
  id: number;
  name: string;
  label: string;
  description?: string | null;
  actions: string[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  organization_id: string;
}
