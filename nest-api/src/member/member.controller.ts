import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberPaginationDto } from './dto/member.pagination.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Member } from './entities/member.entity';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { Request as ExpressRequest } from 'express';
import { ApiPaginatedResponse } from 'src/common/dto/api-pagineted-response.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrganizationGuard } from 'src/auth/guards/organization.guard';
import { UpdatedMembersResponseDto } from 'src/member/dto/updated-members-response.dto';
import { UpdateManyMembersDto } from './dto/update-many-members.dto';
@Controller('/:organization_id/member')
@ApiTags('member')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiPaginatedResponse(Member)
  findAll(
    @Query() memberPaginationDto: MemberPaginationDto,
    @Param('organization_id') organization_id: string,
  ) {
    return this.memberService.findAll(organization_id, memberPaginationDto);
  }

  @Get(':member_id')
  @ApiOkResponse({ type: Member })
  findOne(
    @Param('member_id') member_id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('organization_id') organization_id: string,
  ) {
    return this.memberService.findOne(member_id);
  }

  @Put('/:member_id')
  @ApiOkResponse({ type: Member })
  update(
    @Param('member_id') member_id: string,
    @Body() updateMemberDto: UpdateMemberDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('organization_id') organization_id: string,
  ) {
    return this.memberService.update(member_id, updateMemberDto);
  }

  @Get('/profile')
  @ApiOkResponse({ type: Member })
  profile(
    @Request() req: ExpressRequest,
    @Param('organization_id') organization_id: string,
  ) {
    const user = req.user as JwtPayload;
    return this.memberService.findWithCache(user.sub, organization_id);
  }

  @Put('/profile')
  @ApiOkResponse({ type: Member })
  @ApiOperation({
    summary: 'Update profile',
    description: 'Update profile for the logged in user',
  })
  updateProfile(
    @Body() updateMemberDto: UpdateMemberDto,
    @Request() req: ExpressRequest,
    @Param('organization_id') organization_id: string,
  ) {
    const user = req.user as JwtPayload;
    return this.memberService.updateProfile(
      user.sub,
      organization_id,
      updateMemberDto,
    );
  }

  @Patch('/profile/change-password')
  @ApiOkResponse({ type: Member })
  @ApiOperation({
    summary: 'Change password',
    description: 'Change password for the logged in user',
  })
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: ExpressRequest,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('organization_id') organization_id: string,
  ) {
    const user = req.user as JwtPayload;
    return this.memberService.changePassword(user.sub, changePasswordDto);
  }

  @Patch('/block-members')
  @ApiOkResponse({ type: UpdatedMembersResponseDto })
  blockManyMembers(
    @Param('organization_id') organization_id: string,
    @Body()
    updateManyMembersDto: UpdateManyMembersDto,
  ) {
    return this.memberService.blockMembers({
      organization_id,
      updateManyMembersDto,
    });
  }

  @Patch('/activate-members')
  @ApiOkResponse({ type: UpdatedMembersResponseDto })
  activateManyMembers(
    @Param('organization_id') organization_id: string,
    @Body()
    updateManyMembers: UpdateManyMembersDto,
  ) {
    return this.memberService.activateMembers(
      organization_id,
      updateManyMembers.member_ids,
    );
  }

  // @Put('/:member_id/bank-information')
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: Member })
  // updateBankInformation(
  //   @Param('member_id') member_id: string,
  //   @Body() updateBankInformationDto: UpdateBankInformationDto,
  // ) {
  //   return this.memberService.updateBankInformation(
  //     member_id,
  //     updateBankInformationDto,
  //   );
  // }

  // @Patch('/:organization_id/leave-organization')
  // @ApiBearerAuth()
  // leaveOrganization(
  //   @Param('organization_id') organization_id: string,
  //   @Request() req: ExpressRequest,
  // ): Promise<{ message: string }> {
  //   const user = req.user as JwtPayload;
  //   return this.memberService.leaveOrganization({
  //     organization_id,
  //     user_id: user.sub,
  //   });
  // }
}
