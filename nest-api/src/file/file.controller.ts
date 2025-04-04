import { Controller } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // @Post('upload/pdf')
  // @ApiOperation({ summary: 'Upload a file in pdf format' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Arquivo para upload',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file')) // 'file' é o nome do campo no formulário
  // async uploadFileXlsx(
  //   @UploadedFile(new ParseFilePipe({ validators: [] }))
  //   file: Express.Multer.File,
  // ) {
  //   return await this.fileService.runSimulation(file.buffer);
  // }

  // @Post('upload/xlsx')
  // @ApiOperation({ summary: 'Upload a file in xlsx format' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Arquivo para upload',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file')) // 'file' é o nome do campo no formulário
  // async uploadFileXlsx(
  //   @UploadedFile(new ParseFilePipe({ validators: [] }))
  //   file: Express.Multer.File,
  // ) {
  //   return await this.fileService.processExcel(file.buffer);
  // }

  // @Post('upload/csv')
  // @ApiOperation({ summary: 'Upload a file in csv format' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Arquivo para upload',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file')) // 'file' é o nome do campo no formulário
  // async uploadFileCsv(
  //   @UploadedFile(new ParseFilePipe({ validators: [] }))
  //   file: Express.Multer.File,
  // ) {
  //   return await this.fileService.processCsv(file.buffer);
  // }
}
