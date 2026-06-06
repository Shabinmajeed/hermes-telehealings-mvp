import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ========== USER MANAGEMENT ==========

  async getUsers(filters?: { status?: string; search?: string }) {
    const where: any = {};

    if (filters?.status === 'active') {
      where.suspended = false;
    } else if (filters?.status === 'suspended') {
      where.suspended = true;
    }

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      phone: user.phone,
      status: user.suspended ? 'suspended' : 'active',
      name: user.profile?.name || null,
      createdAt: user.createdAt,
    }));
  }

  async suspendUser(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { suspended: true },
    });
    return { message: 'User suspended', userId: user.id };
  }

  async unsuspendUser(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { suspended: false },
    });
    return { message: 'User unsuspended', userId: user.id };
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted', userId };
  }

  // ========== THERAPIST MANAGEMENT ==========

  async getTherapists(filters?: { status?: string; search?: string }) {
    const where: any = {};

    if (filters?.status === 'pending') {
      where.verified = false;
    } else if (filters?.status === 'verified') {
      where.verified = true;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const therapists = await this.prisma.therapist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return therapists.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      specializations: t.specializations,
      status: t.verified ? 'verified' : 'pending',
      rating: t.rating,
      hourlyRate: t.hourlyRate,
      createdAt: t.createdAt,
    }));
  }

  async approveTherapist(therapistId: string) {
    const therapist = await this.prisma.therapist.update({
      where: { id: therapistId },
      data: { verified: true },
    });
    return { message: 'Therapist approved', therapistId: therapist.id };
  }

  async rejectTherapist(therapistId: string) {
    const therapist = await this.prisma.therapist.update({
      where: { id: therapistId },
      data: { verified: false },
    });
    return { message: 'Therapist rejected', therapistId: therapist.id };
  }

  // ========== ANALYTICS ==========

  async getAnalytics() {
    const [
      totalUsers,
      totalTherapists,
      totalVerifiedTherapists,
      totalAvailabilitySlots,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.therapist.count(),
      this.prisma.therapist.count({ where: { verified: true } }),
      this.prisma.therapistAvailability.count(),
    ]);

    return {
      totalUsers,
      totalTherapists,
      totalVerifiedTherapists,
      totalAvailabilitySlots,
    };
  }

  async getReports() {
    const users = await this.prisma.user.groupBy({
      by: ['createdAt'],
      _count: true,
    });

    const therapists = await this.prisma.therapist.groupBy({
      by: ['createdAt'],
      _count: true,
    });

    return {
      userRegistrations: users.length,
      therapistRegistrations: therapists.length,
    };
  }

  // ========== PLATFORM SETTINGS ==========

  async getSettings() {
    return {
      maintenanceMode: false,
      allowNewRegistrations: true,
      defaultTherapistCommission: 15,
      minTherapySessionDuration: 30,
      maxTherapySessionDuration: 120,
    };
  }

  async updateSettings(data: Record<string, any>) {
    // In a real app, these would be stored in a Settings table
    // For now return the updated settings
    return {
      ...(await this.getSettings()),
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }
}
