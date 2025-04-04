import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PriceTableService } from './price-table.service';
import { CreatePriceTableDto } from './dto/create-price-table.dto';
import { UpdatePriceTableDto } from './dto/update-price-table.dto';
import { CreateSimulationDto } from './dto/create-simulation.dto';

@Controller('price-table')
export class PriceTableController {
  constructor(private readonly priceTableService: PriceTableService) {}

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
  //   return await this.priceTableService.runSimulation(file.buffer);
  // }

  @Post('simulation')
  async createSimulation(@Body() createSimulationDto: CreateSimulationDto) {
    return this.priceTableService.createSimulation(createSimulationDto);
  }

  @Post()
  create(@Body() createPriceTableDto: CreatePriceTableDto) {
    return this.priceTableService.create(createPriceTableDto);
  }

  @Get()
  findAll() {
    return this.priceTableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.priceTableService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePriceTableDto: UpdatePriceTableDto,
  ) {
    return this.priceTableService.update(+id, updatePriceTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priceTableService.remove(+id);
  }
}
