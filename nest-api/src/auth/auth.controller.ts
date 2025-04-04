import {
  Controller,
  Get,
  Request,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { Request as ExpressRequest } from 'express';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user')
  @ApiOperation({
    summary: 'User login',
  })
  @ApiOkResponse({
    type: User,
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('user/refresh')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh token (user)',
  })
  @UseGuards(RefreshAuthGuard)
  userRefresh(@Request() req: ExpressRequest) {
    const user = req.user as JwtPayload;
    return this.authService.refreshAccessToken(user.sub);
  }

  @Get('/check/:organization_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Check the access token',
  })
  @ApiParam({
    name: 'organization_id',
    description: 'Organization ID',
  })
  check(@Request() req: RequestWithUser) {
    return req.user;
  }
}
