export class UserSimple {
  id: string;
  email: string;
  phone: string;
  name: string;
  image: string | null;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
  token_version: number;
  postal_code: string | null;
  address_line: string | null;
  address_number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  birth_date: Date;
}
