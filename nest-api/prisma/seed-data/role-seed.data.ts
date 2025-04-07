export const modules = ['profile', 'priceTable', 'users'];

type TModuleData = {
  name: string;
  label: string;
  actions: string[];
  description: string;
};

const moduleData: TModuleData[] = [
  {
    name: modules[0],
    label: 'Perfil',
    actions: ['create', 'read', 'update', 'delete'],
    description: 'Gerenciamento do perfil',
  },
];

type TRoleData = {
  name: string;
  description: string;
  rolePermissions: {
    moduleName: string;
    allowed: string[];
  }[];
};

const roleData: TRoleData[] = [];

export { moduleData, roleData };
