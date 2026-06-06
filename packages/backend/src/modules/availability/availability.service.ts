import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async createAvailability(
    therapistId: string,
    data: any,
  ): Promise<any> {
    return this.prisma.therapistAvailability.create({
      data: {
        id: uuidv4(),
        therapistId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        slotDuration: data.slotDuration || 60,
        bufferTime: data.bufferTime || 15,
      },
    });
  }

  async getAvailability(therapistId: string): Promise<any> {
    return this.prisma.therapistAvailability.findMany({
      where: { therapistId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async updateAvailability(
    slotId: string,
    data: any,
  ): Promise<any> {
    return this.prisma.therapistAvailability.update({
      where: { id: slotId },
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        slotDuration: data.slotDuration,
        bufferTime: data.bufferTime,
      },
    });
  }

  async deleteAvailability(slotId: string): Promise<any> {
    await this.prisma.therapistAvailability.delete({
      where: { id: slotId },
    });
    return { message: 'Availability slot deleted' };
  }

  async createBlockedDate(
    therapistId: string,
    data: any,
  ): Promise<any> {
    return {
      blockedDateId: uuidv4(),
      therapistId,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      createdAt: new Date(),
    };
  }

  async getBlockedDates(therapistId: string): Promise<any> {
    // Placeholder for blocked dates
    return {
      blockedDates: [],
      message: 'No blocked dates set',
    };
  }

  async deleteBlockedDate(dateId: string): Promise<any> {
    return { message: 'Blocked date removed' };
  }

  async getAvailableSlots(
    therapistId: string,
    date: string,
  ): Promise<any> {
    // Placeholder for available slots on a specific date
    return {
      date,
      therapistId,
      availableSlots: [],
      message: 'No available slots for this date',
    };
  }
}
