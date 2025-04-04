import { Injectable } from '@nestjs/common';
import { DoclingService } from 'src/providers/docling/docling.service';
import { LmStudioService } from 'src/providers/lm-studio/lm-studio.service';

@Injectable()
export class FileService {
  constructor(
    private lmStudioService: LmStudioService,
    private doclingService: DoclingService,
  ) {}

  // async processExcel(buffer: Buffer): Promise<StateCommissionRateFormatDto[]> {
  //   this.validateExcelFile(buffer);

  //   const workbook = new Workbook();
  //   await workbook.xlsx.load(buffer);
  //   const worksheet = workbook.worksheets[0];
  //   const data: StateCommissionRateFormatDto[] = [];

  //   let emptyRowCount = 0;
  //   const maxEmptyRowsAllowed = 0;

  //   const headers = worksheet.getRow(1).values as any[];

  //   this.validateHeaders(headers.slice(1, headers.length) as string[]);

  //   for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
  //     const row = worksheet.getRow(rowNumber);

  //     if (this.isRowEmpty(row)) {
  //       emptyRowCount++;
  //       if (emptyRowCount >= maxEmptyRowsAllowed) break;
  //       continue;
  //     } else {
  //       emptyRowCount = 0; // Resetar contador se encontrar linha válida
  //     }

  //     try {
  //       const dto = plainToInstance(StateCommissionRateFormatDto, {
  //         state_acronym: row.getCell(1).text,
  //         commission_rate_1: row.getCell(2).value,
  //         commission_rate_2: row.getCell(3).value,
  //         commission_rate_3: row.getCell(4).value,
  //         commission_rate_4: row.getCell(5).value,
  //         commission_rate_5: row.getCell(6).value,
  //         commission_rate_6: row.getCell(7).value,
  //         commission_rate_7: row.getCell(8).value,
  //         commission_rate_8: row.getCell(9).value,
  //         commission_rate_9: row.getCell(10).value,
  //         commission_rate_10: row.getCell(11).value,
  //         commission_rate_11: row.getCell(12).value,
  //         commission_rate_12: row.getCell(13).value,
  //       });

  //       await validateOrReject(dto);

  //       data.push(dto);
  //     } catch (errors) {
  //       const error = errors as ExcelJSError[];
  //       throw new BadRequestException({
  //         message: ErrorMessagesHelper.INVALID_SHEET_DATA,
  //         details: error,
  //         error: 'Bad Request Exception',
  //       });
  //     }
  //   }

  //   return data;
  // }

  // private validateExcelFile(buffer: Buffer): void {
  //   const fileSignature = buffer.toString('hex', 0, 4);
  //   const validSignatures = ['504b0304', '504b0506', '504b0708'];

  //   if (!validSignatures.some((sig) => fileSignature.startsWith(sig))) {
  //     throw new BadRequestException({
  //       message: ErrorMessagesHelper.INVALID_XLSX_FILE,
  //       error: 'Bad Request Exception',
  //     });
  //   }
  // }

  // private isRowEmpty(row: Row): boolean {
  //   for (let col = 1; col <= 13; col++) {
  //     const cell = row.getCell(col);
  //     if (
  //       cell.value !== null &&
  //       cell.value !== undefined &&
  //       cell.value !== ''
  //     ) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  // async processCsv(buffer: Buffer): Promise<StateCommissionRateFormatDto[]> {
  //   const readable = Readable.from(buffer.toString());
  //   const data: StateCommissionRateFormatDto[] = [];

  //   return new Promise((resolve, reject) => {
  //     const parser = csv();

  //     const errorHandler = (error: Error) => {
  //       readable.destroy();
  //       parser.destroy();
  //       reject(error);
  //     };

  //     parser.once('headers', (headers: string[]) => {
  //       this.validateHeaders(headers);
  //     });

  //     parser
  //       .on('data', (row: Record<string, string>) => {
  //         try {
  //           const dto = plainToInstance(StateCommissionRateFormatDto, row);

  //           const errors = validateSync(dto);
  //           if (errors.length > 0) {
  //             errorHandler(
  //               new BadRequestException({
  //                 message: 'Erro na validação do arquivo CSV',
  //                 details: errors,
  //               }),
  //             );
  //           }

  //           data.push(dto);
  //         } catch (error) {
  //           errorHandler(error as Error);
  //         }
  //       })
  //       .on('end', () => {
  //         resolve(data);
  //       })
  //       .on('error', errorHandler);

  //     readable.pipe(parser);
  //   });
  // }

  // private validateHeaders(headers: string[]): void {
  //   const expectedHeaders = [
  //     'state_acronym',
  //     'commission_rate_1',
  //     'commission_rate_2',
  //     'commission_rate_3',
  //     'commission_rate_4',
  //     'commission_rate_5',
  //     'commission_rate_6',
  //     'commission_rate_7',
  //     'commission_rate_8',
  //     'commission_rate_9',
  //     'commission_rate_10',
  //     'commission_rate_11',
  //     'commission_rate_12',
  //   ];

  //   if (headers.length !== expectedHeaders.length) {
  //     throw new BadRequestException({
  //       message: ErrorMessagesHelper.INVALID_CSV_HEADERS,
  //       error: 'Bad Request Exception',
  //     });
  //   }
  // }
}
