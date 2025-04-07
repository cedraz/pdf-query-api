import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PriceTableService } from './price-table.service';
import { CreatePriceTableDto } from './dto/create-price-table.dto';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('price-table')
export class PriceTableController {
  constructor(private readonly priceTableService: PriceTableService) {}

  @Post('upload/pdf/price-table')
  @ApiOperation({ summary: 'Upload a file in pdf format' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo para upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        organization_id: {
          type: 'string',
          description: 'ID da organização',
        },
        name: {
          type: 'string',
          description: 'Nome da tabela de preços',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file')) // 'file' é o nome do campo no formulário
  async uploadFileXlsx(
    @UploadedFile(new ParseFilePipe({ validators: [] }))
    file: Express.Multer.File,
    @Body() createPriceTableDto: CreatePriceTableDto,
  ) {
    return await this.priceTableService.create(file, createPriceTableDto);
  }

  @Post('simulation')
  async createSimulation(@Body() createSimulationDto: CreateSimulationDto) {
    return this.priceTableService.createSimulation(createSimulationDto);
  }

  @Get()
  findAll() {
    return this.priceTableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.priceTableService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePriceTableDto: UpdatePriceTableDto,
  // ) {
  //   return this.priceTableService.update(+id, updatePriceTableDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priceTableService.remove(+id);
  }
}
