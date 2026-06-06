import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string): Promise<any> {
    return this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            emailVerified: true,
            phoneVerified: true,
          },
        },
      },
    });
  }

  async updateUserProfile(userId: string, data: any): Promise<any> {
    return this.prisma.userProfile.update({
      where: { userId },
      data: {
        name: data.name,
        bio: data.bio,
        avatar: data.avatar,
        theme: data.theme,
      },
    });
  }

  async uploadAvatar(userId: string, avatarUrl: string): Promise<any> {
    // In production, upload to Supabase Storage
    return this.prisma.userProfile.update({
      where: { userId },
      data: { avatar: avatarUrl },
    });
  }

  async getUserSessions(userId: string): Promise<any> {
    // Placeholder for therapy sessions
    return {
      sessions: [],
      message: 'No therapy sessions yet',
    };
  }

  async getRecommendations(userId: string): Promise<any> {
    // Placeholder for AI recommendations
    return {
      recommendations: [],
      message: 'Personalized recommendations coming soon',
    };
  }
}
