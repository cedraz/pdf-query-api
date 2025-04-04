export interface ExcelJSError {
  response: {
    message: Array<{
      target: {
        [key: string]: number | null | string;
        UF: string;
      };
      value: any;
      property: string;
      children: any[];
      constraints: {
        isNumber: string;
      };
    }>;
    error: string;
    statusCode: number;
  };
  status: number;
  options: Record<string, any>;
  message: string;
  name: string;
}
