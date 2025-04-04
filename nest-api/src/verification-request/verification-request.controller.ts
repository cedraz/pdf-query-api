import { Body, Controller, Post } from '@nestjs/common';
import { VerificationRequestService } from './verification-request.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { verifyUserAccountDto } from './dto/verify-user-account.dto';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { ValidateVerificationRequestDto } from './dto/validate-verification-request.dto';
import { CompleteUserCreationDto } from './dto/complete-user-creation.dto';

@Controller('verification-request')
@ApiTags('verification-request')
export class VerificationRequestController {
  constructor(
    private readonly verificationRequestService: VerificationRequestService,
  ) {}

  @ApiOperation({
    summary: 'Create a verification request (not for admin creation)',
  })
  @Post('create-verification-request')
  createVerificationRequest(
    @Body() createVerificationRequestDto: CreateVerificationRequestDto,
  ) {
    return this.verificationRequestService.createVerificationRequest({
      createVerificationRequestDto,
    });
  }

  @ApiOperation({
    summary: 'Validate a verification request',
  })
  @Post('validate-verification-request')
  validateVerificationRequest(
    @Body() validateVerificationRequestDto: ValidateVerificationRequestDto,
  ) {
    return this.verificationRequestService.validateVerificationRequest(
      validateVerificationRequestDto,
    );
  }

  @ApiOperation({
    summary: 'Validate a verification request for change email',
  })
  @Post('change-email-validation')
  validateChangeEmailRequest(
    @Body() validateVerificationRequestDto: ValidateVerificationRequestDto,
  ) {
    return this.verificationRequestService.validateChangeEmailRequest(
      validateVerificationRequestDto,
    );
  }

  @ApiOperation({
    summary: 'Verify an email (only for common user email verification)',
  })
  @Post('verify-email')
  verifyUserAccount(
    @Body() verifyUserAccountDto: verifyUserAccountDto,
  ): Promise<boolean> {
    return this.verificationRequestService.verifyUserAccount(
      verifyUserAccountDto,
    );
  }

  @ApiOperation({
    summary: 'Complete user creation',
  })
  @Post('complete-user-creation')
  completeUserCreation(
    @Body() completeUserCreationDto: CompleteUserCreationDto,
  ) {
    return this.verificationRequestService.completeUserCreation(
      completeUserCreationDto,
    );
  }

  @ApiOperation({
    summary: 'Verify global admin account',
  })
  @Post('verify-global-admin')
  verifyGlobalAdminAccount(@Body() verifyUserAccountDto: verifyUserAccountDto) {
    return this.verificationRequestService.verifyGlobalAdminAccount(
      verifyUserAccountDto,
    );
  }
}
