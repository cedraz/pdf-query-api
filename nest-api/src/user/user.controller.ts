import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserPaginationDto } from './dto/user.pagination.dto';
import { PasswordRecoveryAuthGuard } from 'src/auth/guards/password-recovery.guard';
import { Request as ExpressRequest } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { ApiPaginatedResponse } from 'src/common/dto/api-pagineted-response.dto';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ViaCepService } from 'src/providers/via-cep/via-cep.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidationPipe } from 'src/common/pipes/image-validation.pipe';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private viaCepService: ViaCepService,
  ) {}

  @ApiOperation({
    summary: 'Create a new user',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Ger all users',
  })
  @Get()
  @ApiPaginatedResponse(User)
  findAll(@Query() pagination: UserPaginationDto) {
    return this.userService.findAll(pagination);
  }

  @ApiOperation({
    summary: 'Get logged user profile',
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: User,
  })
  async getProfile(@Request() req: ExpressRequest) {
    const payload = req.user as JwtPayload;
    return this.userService.findById(payload.sub);
  }

  @ApiOperation({
    summary: 'Get user by id',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @ApiOperation({
    summary: 'Update logged user profile',
  })
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: User,
  })
  updateProfile(
    @Request() req: ExpressRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = req.user as JwtPayload;
    return this.userService.update(user.sub, updateProfileDto);
  }

  @ApiOperation({
    summary: 'Update user',
  })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: User,
  })
  update(@Body() updateProfileDto: UpdateProfileDto, @Param('id') id: string) {
    return this.userService.update(id, updateProfileDto);
  }

  @ApiOperation({
    summary: 'Delete logged user profile',
  })
  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removeLoggedUser(@Request() req: ExpressRequest) {
    const user = req.user as JwtPayload;
    return this.userService.inactivateUser(user.sub);
  }

  @ApiOperation({
    summary: 'Delete specific user',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.inactivateUser(id);
  }

  @ApiOperation({
    summary: 'Recover password',
  })
  @Post('recover-password')
  @UseGuards(PasswordRecoveryAuthGuard)
  @ApiBearerAuth()
  recoverPassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as JwtPayload;
    return this.userService.recoverPassword({
      email: user.email!,
      password: changePasswordDto.password,
    });
  }

  // @Get('cpf/:cpf')
  // @ApiOperation({
  //   summary: 'Consult user info by CPF',
  // })
  // consultUserInfoByCPF(@Param('cpf') cpf: string) {
  // return this.apiBrasilService.consultUserInfoByCPF(cpf);
  // }

  @Get('cep/:cep')
  @ApiOperation({
    summary: 'Consult user address by CEP',
  })
  getAddressByCep(@Param('cep') cep: string) {
    return this.viaCepService.getAddressByCep(cep);
  }

  @Post('/profile/avatar')
  @ApiOperation({
    summary: 'Upload user avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo para upload',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image')) // 'image' é o nome do campo no formulário
  uploadProfileAvatar(
    @UploadedFile(new imageValidationPipe()) image: Express.Multer.File,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as JwtPayload;
    return this.userService.uploadAvatar(user.sub, image);
  }

  @Post('/avatar/:id')
  @ApiOperation({
    summary: 'Upload user avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo para upload',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image')) // 'image' é o nome do campo no formulário
  uploadAvatar(
    @UploadedFile(new imageValidationPipe()) image: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.userService.uploadAvatar(id, image);
  }
}
