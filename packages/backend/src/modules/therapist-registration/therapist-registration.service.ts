import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TherapistRegistrationService {
  constructor(private prisma: PrismaService) {}

  async registerTherapist(data: any): Promise<any> {
    const therapist = await this.prisma.therapist.create({
      data: {
        id: uuidv4(),
        name: data.name,
        bio: data.bio,
        avatar: data.avatar,
        specializations: data.specializations || [],
        languages: data.languages || [],
        hourlyRate: data.hourlyRate,
        rating: 0,
        reviewCount: 0,
      },
    });

    return {
      therapistId: therapist.id,
      status: 'pending_verification',
      message: 'Registration submitted. Pending verification.',
    };
  }

  async getTherapistProfile(therapistId: string): Promise<any> {
    return this.prisma.therapist.findUnique({
      where: { id: therapistId },
    });
  }

  async updateTherapistProfile(
    therapistId: string,
    data: any,
  ): Promise<any> {
    return this.prisma.therapist.update({
      where: { id: therapistId },
      data: {
        name: data.name,
        bio: data.bio,
        avatar: data.avatar,
        specializations: data.specializations,
        languages: data.languages,
        hourlyRate: data.hourlyRate,
      },
    });
  }

  async uploadDocument(
    therapistId: string,
    documentType: string,
    fileUrl: string,
  ): Promise<any> {
    // In production, upload to Supabase Storage
    return {
      documentId: uuidv4(),
      therapistId,
      type: documentType,
      fileUrl,
      uploadedAt: new Date(),
      status: 'pending_review',
    };
  }

  async getDocuments(therapistId: string): Promise<any> {
    // Placeholder for documents
    return {
      documents: [],
      message: 'No documents uploaded yet',
    };
  }

  async getVerificationStatus(therapistId: string): Promise<any> {
    const therapist = await this.prisma.therapist.findUnique({
      where: { id: therapistId },
    });

    return {
      therapistId,
      name: therapist?.name,
      status: 'pending_verification',
      documentsSubmitted: false,
      backgroundCheckStatus: 'not_started',
      verifiedAt: null,
    };
  }
}
