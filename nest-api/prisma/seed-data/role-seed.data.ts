export const modules = ['profile', 'priceTable', 'users'];

const permissionsData = [
  {
    name: 'read',
    label: 'Ler',
  },
  {
    name: 'create',
    label: 'Criar',
  },
  {
    name: 'update',
    label: 'Atualizar',
  },
  {
    name: 'delete',
    label: 'Deletar',
  },
];

const modulesData = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    active: true,
    description: 'Gestão do Dashboard',
    actions: permissionsData.slice(0, 4),
  },
  {
    name: 'users',
    label: 'Usuários',
    active: true,
    description: 'Gestão de Usuários',
    actions: permissionsData.slice(0, 4),
  },
];

const rolesData: TRole[] = [
  {
    name: 'ADMIN',
    description: 'Administrador',
    rolePermissions: [
      {
        moduleIndex: 0,
        moduleName: modulesData[0].name,
        permissions: modulesData[0].actions,
      },
      {
        moduleIndex: 1,
        moduleName: modulesData[1].name,
        permissions: modulesData[1].actions,
      },
    ],
  },
];

type TPermission = {
  name: string;
  label: string;
};

type TRole = {
  name: string;
  description: string;
  rolePermissions: {
    moduleIndex: number;
    moduleName: string;
    permissions: TPermission[];
  }[];
};

export { permissionsData, modulesData, rolesData };
