export const modules = [];

const moduleData = [];

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
