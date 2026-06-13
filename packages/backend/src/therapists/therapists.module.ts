// src/therapists/therapists.module.ts
import { Module } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { TherapistsController } from './therapists.controller';
import { PrismaModule } from '../common/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TherapistsController],
  providers: [TherapistsService],
  exports: [TherapistsService],
})
export class TherapistsModule {}
