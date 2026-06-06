import { Module } from '@nestjs/common';
import { TherapistsController } from './therapists.controller';
import { TherapistsService } from './therapists.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TherapistsController],
  providers: [TherapistsService, PrismaService],
  exports: [TherapistsService],
})
export class TherapistsModule {}
