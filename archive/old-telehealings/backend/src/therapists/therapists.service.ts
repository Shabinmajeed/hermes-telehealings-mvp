import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';

@Injectable()
export class TherapistsService {
  constructor(private prisma: PrismaService) {}

  async create(createTherapistDto: CreateTherapistDto) {
    return this.prisma.therapist.create({
      data: createTherapistDto,
    });
  }

  async findAll() {
    return this.prisma.therapist.findMany();
  }

  async findOne(id: string) {
    return this.prisma.therapist.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTherapistDto: Partial<CreateTherapistDto>) {
    return this.prisma.therapist.update({
      where: { id },
      data: updateTherapistDto,
    });
  }

  async uploadDocument(id: string, documentUrl: string) {
    return this.prisma.therapist.update({
      where: { id },
      data: {
        verificationDocument: documentUrl,
        licenseVerified: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.therapist.delete({
      where: { id },
    });
  }
}