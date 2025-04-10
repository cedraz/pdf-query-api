import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePriceTableDto } from './dto/create-price-table.dto';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { RedisService } from 'src/redis/redis.service';
import { LmStudioService } from 'src/providers/lm-studio/lm-studio.service';
import { InjectModel } from '@nestjs/mongoose';
import { PriceTable } from './schemas/price-table.schema';
import { Model } from 'mongoose';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { DoclingService } from 'src/providers/docling/docling.service';

@Injectable()
export class PriceTableService {
  constructor(
    private redisService: RedisService,
    private lmStudioService: LmStudioService,
    private doclingService: DoclingService,
    @InjectModel(PriceTable.name)
    private priceTableModel: Model<PriceTable>,
  ) {}

  async create(
    file: Express.Multer.File,
    createPriceTableDto: CreatePriceTableDto,
  ) {
    const priceTableExists = await this.priceTableModel.findOne({
      name: createPriceTableDto.name,
    });

    if (priceTableExists) {
      throw new ConflictException(
        ErrorMessagesHelper.PRICE_TABLE_ALREADY_EXISTS,
      );
    }

    const doctags = await this.doclingService.processPDF(file.buffer);

    const createdPriceTable = new this.priceTableModel({
      filename: file.originalname,
      doctags: doctags.content,
      name: createPriceTableDto.name,
      organization_id: createPriceTableDto.organization_id,
    });

    const savedPriceTable = await createdPriceTable.save();
    return savedPriceTable.toObject();
  }

  async createSimulation(createSimulationDto: CreateSimulationDto) {
    const { credit, monthly_fee, name } = createSimulationDto;

    const key = `simulation${credit}_${monthly_fee}`;

    const simulationResult = await this.redisService.get(key);

    if (simulationResult) {
      const parsedResult = JSON.parse(simulationResult) as {
        [key: string]: unknown;
      };
      return parsedResult;
    }

    const doctags = await this.priceTableModel.findOne({ name });

    if (!doctags) {
      throw new NotFoundException(ErrorMessagesHelper.PRICE_TABLE_NOT_FOUND);
    }

    const result = await this.lmStudioService.getSimulationResult({
      doctags: doctags.doctags,
      credit,
      monthly_fee,
    });

    await this.redisService.set(key, result);

    return result;
  }

  findAll() {
    return `This action returns all priceTable`;
  }

  findOne(id: number) {
    return `This action returns a #${id} priceTable`;
  }

  // update(id: number, updatePriceTableDto: UpdatePriceTableDto) {
  //   return `This action updates a #${id} priceTable`;
  // }

  remove(id: number) {
    return `This action removes a #${id} priceTable`;
  }
}
