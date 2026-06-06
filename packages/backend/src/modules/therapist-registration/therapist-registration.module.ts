import { Module } from '@nestjs/common';
import { TherapistRegistrationController } from './therapist-registration.controller';
import { TherapistRegistrationService } from './therapist-registration.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TherapistRegistrationController],
  providers: [TherapistRegistrationService, PrismaService],
  exports: [TherapistRegistrationService],
})
export class TherapistRegistrationModule {}
