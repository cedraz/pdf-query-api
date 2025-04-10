import { GlobalAdminStatus, MemberStatus } from '@prisma/client';

const user3Data = {
  email: 'userthree@email.com',
  name: 'User 3',
  phone: '123456789',
  cpf: '57685839587',
  email_verified_at: new Date(),
  postal_code: '12345678',
  address_line: 'Rua Teste',
  address_number: '123',
  neighborhood: 'Bairro Teste',
  city: 'Cidade Teste',
  state: 'Estado Teste',
};

const organizationData = {
  cnpj: '12345678901234',
  address_line: 'Rua Teste',
  address_number: '123',
  neighborhood: 'Bairro Teste',
  city: 'Cidade Teste',
  state: 'Estado Teste',
  postal_code: '12345678',
  billing_email: 'billing@teste.com',
  corporate_name: 'Corporate Name',
  name: 'Company Name',
  general_email: 'teste@teste.com',
  phone: '123456789',
};

const member1Data = {
  status: MemberStatus.ACTIVE,
  invited_at: new Date(),
  joined_at: new Date(),
};

const member2Data = {
  status: MemberStatus.ACTIVE,
  invited_at: new Date(),
  joined_at: new Date(),
};

const globalAdminData = {
  name: 'Global Admin',
  email: 'global-admin@email.com',
  status: GlobalAdminStatus.ACTIVE,
};

export {
  user3Data,
  organizationData,
  member1Data,
  member2Data,
  globalAdminData,
};
