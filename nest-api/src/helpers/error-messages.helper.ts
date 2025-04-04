export const ErrorMessagesHelper = {
  USER_NOT_FOUND: 'Usuário não encontrado.',
  ORGANIZATION_NOT_FOUND: 'Organização não encontrada.',
  MEMBER_NOT_FOUND: 'Membro não encontrado.',
  INVITE_NOT_FOUND: 'Convite não encontrado.',
  PROPOSAL_NOT_FOUND: 'Proposta não encontrada.',
  ROLE_NOT_FOUND: 'Cargo não encontrada.',
  PRICE_TABLE_NOT_FOUND: 'Tabela de preços não encontrada.',
  ROLE_NAME_TAKEN: 'Nome de cargo já está em uso.',
  USER_ALREADY_EXISTS: 'Credenciais inválidas para cadastro do usuário.',
  GLOBAL_ADMIN_EXISTS:
    'Credenciais inválidas para cadastro do administrador global.',
  UNAUTHORIZED: 'Acesso não autorizado.',
  NO_TOKEN_PROVIDED: 'Nenhum token fornecido.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  NOT_A_GLOBAL_ADMIN: 'Você não é um administrador global.',
  INTERNAL_SERVER_ERROR: 'Erro interno do servidor.',
  CONFLICT: 'Ação conflitante.',
  EMAIL_NOT_VERIFIED: 'E-mail não verificado.',
  DOES_NOT_BELONG_TO_ORGANIZATION: 'Não pertence à organização.',
  ORGANIZATION_ID_NOT_PROVIDED: 'ID da organização não fornecido.',
  TRYING_TO_REMOVE_OWNER: 'Tentando remover o proprietário.',
  OWNER_CANNOT_LEAVE: 'O proprietário não pode sair da organização.',
  INVITE_EXPIRED: 'Convite para entrar na organização expirado.',
  USER_NOT_INVITED: 'Usuário não convidado.',
  INVALID_TOKEN: 'Token inválido ou expirado.',
  INVALID_CREDENTIALS: 'Credenciais inválidas.',
  INVALID_VERIFICATION_REQUEST:
    'Solicitação de verificação não encontrada ou expirada.',
  INVALID_METADATA: 'Dados adicionais inválidos.',
  INVALID_STATE: 'Estado inválido.',
  INVALID_SESSION: 'Sessão inválida.',
  INVALID_CPF: 'CPF inválido.',
  INVALID_CNPJ: 'CNPJ inválido.',
  INVALID_SHEET_DATA: 'Dados da planilha inválidos.',
  INVALID_CSV_HEADERS: 'Cabeçalhos do CSV inválidos.',
  INVALID_XLSX_FILE: 'Arquivo XLSX inválido.',
  INVITE_ALREADY_SENT: 'Convite já enviado.',
  INVALID_IMAGE_FORMAT: 'Formato de imagem inválido.',
  CLOUDINARY_UPLOAD_ERROR: 'Erro ao fazer upload da imagem.',
  CANNOT_BLOCK_LAST_ADMIN:
    'Não é possível bloquear o último administrador. É necessário que haja pelo menos um administrador na aplicação.',
  moduleNotFound(module_id: number) {
    return `Módulo com ID ${module_id} não encontrado.`;
  },
  fileSizeLimitExceeded(limit: string) {
    return `Tamanho do arquivo excedeu o limite de ${limit}.`;
  },
  isForbidden(field: string = '') {
    return `O campo ${field} não é permitido nesta rota`;
  },
  serviceUnavailableException(externalService: string) {
    return `Erro ao tentar se comunicar com o serviço externo ${externalService}`;
  },
};
