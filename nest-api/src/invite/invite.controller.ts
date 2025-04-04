/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Request,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { InvitePaginationDto } from './dto/invite.pagination.dto';
import { InviteRequestBodyDto } from './dto/create-invite.dto';
import { Request as ExpressRequest } from 'express';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/:organization_id/invite')
@ApiTags('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('')
  @ApiBearerAuth()
  create(
    @Body() inviteRequestBodyDto: InviteRequestBodyDto,
    @Request() req: ExpressRequest,
    @Param('organization_id') organization_id: string,
  ) {
    const user = req.user as JwtPayload;

    return this.inviteService.create({
      ...inviteRequestBodyDto,
      inviter_id: user.sub,
      organization_id: organization_id,
    });
  }

  @Get()
  findAll(
    @Query() invitePaginationDto: InvitePaginationDto,
    @Param('organization_id') organization_id: string,
  ) {
    return this.inviteService.findAll(organization_id, invitePaginationDto);
  }

  @Get(':invite_id')
  @ApiBearerAuth()
  findOne(@Param('invite_id') invite_id: string) {
    return this.inviteService.findOne(invite_id);
  }

  @Put(':invite_id')
  @ApiBearerAuth()
  update(
    @Param('invite_id') invite_id: string,
    @Body() updateInviteDto: UpdateInviteDto,
    @Param('organization_id') organization_id: string,
  ) {
    return this.inviteService.update(invite_id, updateInviteDto);
  }

  @Delete(':invite_id')
  @ApiBearerAuth()
  remove(
    @Param('invite_id') invite_id: string,
    @Param('organization_id') organization_id: string,
  ) {
    return this.inviteService.remove(invite_id);
  }

  @Delete('/remove-many')
  @ApiBearerAuth()
  removeMany(
    @Body() invite_ids: string[],
    @Param('organization_id') organization_id: string,
  ) {
    return this.inviteService.removeMany(invite_ids);
  }
}
