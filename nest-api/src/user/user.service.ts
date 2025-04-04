import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessagesHelper } from 'src/helpers/error-messages.helper';
import { VerificationRequestService } from 'src/verification-request/verification-request.service';
import { VerificationType } from '@prisma/client';
import { User } from './entities/user.entity';
import { UserPaginationDto } from './dto/user.pagination.dto';
import { PaginationResultDto } from 'src/common/entities/pagination-result.entity';
import * as bcrypt from 'bcrypt';
import { CreateIncompleteUserDto } from './dto/create-incomplete-user.dto';
import { CloudinaryService } from 'src/providers/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private verificationRequestService: VerificationRequestService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.findByEmail(createUserDto.email);

    if (userExists) {
      throw new ConflictException(ErrorMessagesHelper.USER_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.prismaService.user.create({
      data: {
        cpf: createUserDto.cpf,
        email: createUserDto.email,
        name: createUserDto.name,
        phone: createUserDto.phone,
        password_hash: password_hash,
        postal_code: createUserDto.postal_code,
        address_line: createUserDto.address_line,
        address_number: createUserDto.address_number,
        neighborhood: createUserDto.neighborhood,
        city: createUserDto.city,
        state: createUserDto.state,
        birth_date: createUserDto.birth_date,
      },
      select: userSelect,
    });

    await this.verificationRequestService.createVerificationRequest({
      createVerificationRequestDto: {
        identifier: user.email,
        type: VerificationType.EMAIL_VERIFICATION,
      },
      expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });

    return user;
  }

  async createIncompleteUser(
    createIncompleteUserDto: CreateIncompleteUserDto,
  ): Promise<User> {
    const userExists = await this.findByEmail(createIncompleteUserDto.email);

    if (userExists) {
      throw new ConflictException(ErrorMessagesHelper.USER_ALREADY_EXISTS);
    }

    const user = await this.prismaService.user.create({
      data: {
        cpf: createIncompleteUserDto.cpf,
        email: createIncompleteUserDto.email,
        name: createIncompleteUserDto.name,
        phone: createIncompleteUserDto.phone,
        password_hash: 'password',
        postal_code: createIncompleteUserDto.postal_code,
        address_line: createIncompleteUserDto.address_line,
        address_number: createIncompleteUserDto.address_number,
        neighborhood: createIncompleteUserDto.neighborhood,
        city: createIncompleteUserDto.city,
        state: createIncompleteUserDto.state,
        birth_date: createIncompleteUserDto.birth_date,
      },
      select: userSelect,
    });

    await this.verificationRequestService.createIncompleteUserVerificationRequest(
      {
        createVerificationRequestDto: {
          identifier: user.email,
          type: VerificationType.COMPLETE_USER_CREATION,
        },
        expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        organization_id: createIncompleteUserDto.organization_id,
      },
    );

    await this.prismaService.member.create({
      data: {
        invited_at: new Date(),
        organization_id: createIncompleteUserDto.organization_id,
        user_id: user.id,
        status: 'PENDING',
        role_id: createIncompleteUserDto.role_id,
      },
    });

    return user;
  }

  async findAll(
    userPaginationDto: UserPaginationDto,
  ): Promise<PaginationResultDto<User>> {
    const users = await this.prismaService.user.findMany({
      where: userPaginationDto.where(),
      ...userPaginationDto.orderBy(),
      select: userSelect,
    });

    const total = await this.prismaService.user.count({
      where: userPaginationDto.where(),
    });

    return userPaginationDto.createMetadata(users, total);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        member_on: {
          include: {
            organization: true,
          },
        },
      },
    });

    return user;
  }

  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    if (updateUserDto.cpf) {
      const userWithSameCPF = await this.prismaService.user.findFirst({
        where: {
          cpf: updateUserDto.cpf,
        },
      });

      if (userWithSameCPF && userWithSameCPF.id !== user.id) {
        throw new ConflictException(ErrorMessagesHelper.USER_ALREADY_EXISTS);
      }
    }

    // if (updateUserDto.email) {
    //   const userWithSameEmail = await this.prismaService.user.findFirst({
    //     where: {
    //       email: updateUserDto.email,
    //     },
    //   });

    //   if (userWithSameEmail && userWithSameEmail.id !== user.id) {
    //     throw new ConflictException(ErrorMessagesHelper.USER_ALREADY_EXISTS);
    //   }
    // }

    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
      select: userSelect,
    });

    return updatedUser;
  }

  async recoverPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password_hash,
      },
    });

    return {
      message: 'Senha alterada com sucesso.',
    };
  }

  async inactivateUser(id: string) {
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return 'Usuário inativado com sucesso.';
  }

  async activateUser(id: string) {
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        deleted_at: null,
      },
    });

    return 'Usuário reativado com sucesso.';
  }

  async uploadAvatar(id: string, image: Express.Multer.File) {
    const response = await this.cloudinaryService.uploadImage(image);

    const imageURL = response.secure_url as string;

    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        image: imageURL,
      },
      select: userSelect,
    });
  }
}

const userSelect = {
  id: true,
  email: true,
  phone: true,
  name: true,
  created_at: true,
  updated_at: true,
  email_verified_at: true,
  deleted_at: true,
  cpf: true,
  image: true,
  token_version: true,
  address_line: true,
  address_number: true,
  neighborhood: true,
  city: true,
  state: true,
  postal_code: true,
  member_on: true,
  birth_date: true,
};
