import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { TherapistRegistrationService } from './therapist-registration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Therapist Registration')
@Controller('therapists')
export class TherapistRegistrationController {
  constructor(
    private therapistRegistrationService: TherapistRegistrationService,
  ) {}

  @Post('register')
  async register(@Body() data: any) {
    return this.therapistRegistrationService.registerTherapist(data);
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Param('id') therapistId: string) {
    return this.therapistRegistrationService.getTherapistProfile(therapistId);
  }

  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(@Param('id') therapistId: string, @Body() data: any) {
    return this.therapistRegistrationService.updateTherapistProfile(
      therapistId,
      data,
    );
  }

  @Post(':id/documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async uploadDocument(
    @Param('id') therapistId: string,
    @Body('documentType') documentType: string,
    @Body('fileUrl') fileUrl: string,
  ) {
    return this.therapistRegistrationService.uploadDocument(
      therapistId,
      documentType,
      fileUrl,
    );
  }

  @Get(':id/documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getDocuments(@Param('id') therapistId: string) {
    return this.therapistRegistrationService.getDocuments(therapistId);
  }

  @Get(':id/verification-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getVerificationStatus(@Param('id') therapistId: string) {
    return this.therapistRegistrationService.getVerificationStatus(therapistId);
  }
}
