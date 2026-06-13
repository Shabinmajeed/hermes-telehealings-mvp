"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcryptjs"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const Role = client_1.$Enums.Role;
const UserStatus = client_1.$Enums.UserStatus;
const SessionType = client_1.$Enums.SessionType;
const SessionStatus = client_1.$Enums.SessionStatus;
const BookingStatus = client_1.$Enums.BookingStatus;
const PaymentStatus = client_1.$Enums.PaymentStatus;
const NotificationType = client_1.$Enums.NotificationType;
const SALT_ROUNDS = 10;
async function main() {
    console.log('Seeding database...');
    await prisma.notification.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.session.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.fileUpload.deleteMany();
    await prisma.clientProfile.deleteMany();
    await prisma.therapistProfile.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data.');
    const hashedPassword = await bcrypt.hash('Password123!', SALT_ROUNDS);
    const clientUsers = await Promise.all([
        prisma.user.create({
            data: {
                email: 'alice.johnson@example.com',
                password: hashedPassword,
                role: Role.CLIENT,
                status: UserStatus.ACTIVE,
                clientProfile: {
                    create: {
                        firstName: 'Alice',
                        lastName: 'Johnson',
                        phone: '+1-555-0101',
                        dateOfBirth: new Date('1990-03-15'),
                        gender: 'Female',
                        address: '123 Oak Street, San Francisco, CA 94102',
                        emergencyContact: 'Bob Johnson - +1-555-0102',
                        medicalHistory: 'Generalized anxiety disorder, managed with therapy.',
                    },
                },
            },
            include: { clientProfile: true },
        }),
        prisma.user.create({
            data: {
                email: 'carlos.martinez@example.com',
                password: hashedPassword,
                role: Role.CLIENT,
                status: UserStatus.ACTIVE,
                clientProfile: {
                    create: {
                        firstName: 'Carlos',
                        lastName: 'Martinez',
                        phone: '+1-555-0201',
                        dateOfBirth: new Date('1985-07-22'),
                        gender: 'Male',
                        address: '456 Pine Avenue, Austin, TX 78701',
                        emergencyContact: 'Maria Martinez - +1-555-0202',
                        medicalHistory: 'Depression and insomnia. Responding well to CBT.',
                    },
                },
            },
            include: { clientProfile: true },
        }),
        prisma.user.create({
            data: {
                email: 'priya.sharma@example.com',
                password: hashedPassword,
                role: Role.CLIENT,
                status: UserStatus.ACTIVE,
                clientProfile: {
                    create: {
                        firstName: 'Priya',
                        lastName: 'Sharma',
                        phone: '+1-555-0301',
                        dateOfBirth: new Date('1995-11-08'),
                        gender: 'Female',
                        address: '789 Maple Drive, Seattle, WA 98101',
                        emergencyContact: 'Raj Sharma - +1-555-0302',
                        medicalHistory: 'Stress management and career counseling.',
                    },
                },
            },
            include: { clientProfile: true },
        }),
    ]);
    console.log(`Created ${clientUsers.length} clients.`);
    const therapistUsers = await Promise.all([
        prisma.user.create({
            data: {
                email: 'dr.sarah.williams@example.com',
                password: hashedPassword,
                role: Role.THERAPIST,
                status: UserStatus.ACTIVE,
                therapistProfile: {
                    create: {
                        firstName: 'Sarah',
                        lastName: 'Williams',
                        phone: '+1-555-1001',
                        specialization: ['Anxiety', 'Depression', 'CBT'],
                        bio: 'Licensed clinical psychologist with 12 years of experience in cognitive behavioral therapy. Specializes in anxiety and mood disorders.',
                        licenseNumber: 'PSY-CA-2012-8842',
                        yearsExperience: 12,
                        rating: 4.8,
                        reviewCount: 142,
                        isVerified: true,
                    },
                },
            },
            include: { therapistProfile: true },
        }),
        prisma.user.create({
            data: {
                email: 'dr.james.chen@example.com',
                password: hashedPassword,
                role: Role.THERAPIST,
                status: UserStatus.ACTIVE,
                therapistProfile: {
                    create: {
                        firstName: 'James',
                        lastName: 'Chen',
                        phone: '+1-555-1002',
                        specialization: ['Trauma', 'PTSD', 'EMDR'],
                        bio: 'Board-certified therapist specializing in trauma recovery and PTSD. Trained in EMDR and somatic experiencing.',
                        licenseNumber: 'LCSW-TX-2015-3391',
                        yearsExperience: 9,
                        rating: 4.9,
                        reviewCount: 98,
                        isVerified: true,
                    },
                },
            },
            include: { therapistProfile: true },
        }),
        prisma.user.create({
            data: {
                email: 'dr.emily.brown@example.com',
                password: hashedPassword,
                role: Role.THERAPIST,
                status: UserStatus.ACTIVE,
                therapistProfile: {
                    create: {
                        firstName: 'Emily',
                        lastName: 'Brown',
                        phone: '+1-555-1003',
                        specialization: ['Relationships', 'Family Therapy', 'Couples'],
                        bio: 'Marriage and family therapist with expertise in couples counseling and family dynamics. Gottman Method certified.',
                        licenseNumber: 'LMFT-WA-2018-5520',
                        yearsExperience: 7,
                        rating: 4.7,
                        reviewCount: 76,
                        isVerified: true,
                    },
                },
            },
            include: { therapistProfile: true },
        }),
    ]);
    console.log(`Created ${therapistUsers.length} therapists.`);
    const now = new Date();
    const sessions = await Promise.all([
        prisma.session.create({
            data: {
                clientId: clientUsers[0].id,
                therapistId: therapistUsers[0].therapistProfile.userId,
                scheduledAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                duration: 50,
                type: SessionType.VIDEO,
                status: SessionStatus.COMPLETED,
                notes: 'Client showed significant progress in managing anxiety triggers. Homework assigned: daily journaling.',
                rating: 5,
                feedback: 'Dr. Williams is amazing. Very empathetic and practical advice.',
            },
        }),
        prisma.session.create({
            data: {
                clientId: clientUsers[1].id,
                therapistId: therapistUsers[1].therapistProfile.userId,
                scheduledAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
                duration: 60,
                type: SessionType.AUDIO,
                status: SessionStatus.COMPLETED,
                notes: 'Deep dive into childhood trauma. EMDR session was productive.',
                rating: 4,
                feedback: 'Good session, feeling more grounded.',
            },
        }),
        prisma.session.create({
            data: {
                clientId: clientUsers[2].id,
                therapistId: therapistUsers[2].therapistProfile.userId,
                scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
                duration: 50,
                type: SessionType.VIDEO,
                status: SessionStatus.SCHEDULED,
                notes: 'Initial consultation for couples therapy.',
            },
        }),
        prisma.session.create({
            data: {
                clientId: clientUsers[0].id,
                therapistId: therapistUsers[1].therapistProfile.userId,
                scheduledAt: new Date(now.getTime() - 30 * 60 * 1000),
                duration: 50,
                type: SessionType.CHAT,
                status: SessionStatus.IN_PROGRESS,
                notes: 'Crisis intervention session. Client experiencing acute stress.',
            },
        }),
        prisma.session.create({
            data: {
                clientId: clientUsers[1].id,
                therapistId: therapistUsers[0].therapistProfile.userId,
                scheduledAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
                duration: 50,
                type: SessionType.VIDEO,
                status: SessionStatus.CANCELLED,
                notes: 'Client cancelled due to illness. Rescheduled for next week.',
            },
        }),
    ]);
    console.log(`Created ${sessions.length} sessions (2 completed, 1 scheduled, 1 in-progress, 1 cancelled).`);
    const bookings = await Promise.all([
        prisma.booking.create({
            data: {
                clientId: clientUsers[0].id,
                therapistId: therapistUsers[0].therapistProfile.userId,
                sessionType: SessionType.VIDEO,
                scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
                status: BookingStatus.CONFIRMED,
            },
        }),
        prisma.booking.create({
            data: {
                clientId: clientUsers[1].id,
                therapistId: therapistUsers[1].therapistProfile.userId,
                sessionType: SessionType.AUDIO,
                scheduledAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
                status: BookingStatus.CONFIRMED,
            },
        }),
        prisma.booking.create({
            data: {
                clientId: clientUsers[2].id,
                therapistId: therapistUsers[2].therapistProfile.userId,
                sessionType: SessionType.VIDEO,
                scheduledAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
                status: BookingStatus.PENDING,
            },
        }),
        prisma.booking.create({
            data: {
                clientId: clientUsers[0].id,
                therapistId: therapistUsers[2].therapistProfile.userId,
                sessionType: SessionType.CHAT,
                scheduledAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                status: BookingStatus.CONFIRMED,
            },
        }),
        prisma.booking.create({
            data: {
                clientId: clientUsers[1].id,
                therapistId: therapistUsers[0].therapistProfile.userId,
                sessionType: SessionType.VIDEO,
                scheduledAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
                status: BookingStatus.CANCELLED,
            },
        }),
    ]);
    console.log(`Created ${bookings.length} bookings (3 confirmed, 1 pending, 1 cancelled).`);
    const payments = await Promise.all([
        prisma.payment.create({
            data: {
                clientId: clientUsers[0].id,
                therapistId: therapistUsers[0].therapistProfile.userId,
                sessionId: sessions[0].id,
                amount: 150.00,
                currency: 'USD',
                status: PaymentStatus.COMPLETED,
                stripePaymentId: 'pi_3abc123def456',
                stripePaymentIntentId: 'pi_3abc123def456_intent',
            },
        }),
        prisma.payment.create({
            data: {
                clientId: clientUsers[1].id,
                therapistId: therapistUsers[1].therapistProfile.userId,
                sessionId: sessions[1].id,
                amount: 175.00,
                currency: 'USD',
                status: PaymentStatus.COMPLETED,
                stripePaymentId: 'pi_789ghi012jkl',
                stripePaymentIntentId: 'pi_789ghi012jkl_intent',
            },
        }),
        prisma.payment.create({
            data: {
                clientId: clientUsers[2].id,
                therapistId: therapistUsers[2].therapistProfile.userId,
                amount: 200.00,
                currency: 'USD',
                status: PaymentStatus.PENDING,
            },
        }),
    ]);
    console.log(`Created ${payments.length} payments (2 completed, 1 pending).`);
    const notifications = await Promise.all([
        prisma.notification.create({
            data: {
                userId: clientUsers[0].id,
                title: 'Session Reminder',
                body: 'Your session with Dr. Sarah Williams is tomorrow at 2:00 PM PST.',
                type: NotificationType.SESSION_REMINDER,
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: clientUsers[1].id,
                title: 'Booking Confirmed',
                body: 'Your booking with Dr. James Chen has been confirmed for next Monday.',
                type: NotificationType.BOOKING_CONFIRMED,
                isRead: true,
            },
        }),
        prisma.notification.create({
            data: {
                userId: clientUsers[2].id,
                title: 'Payment Received',
                body: 'Your payment of $200.00 for the upcoming session has been received.',
                type: NotificationType.PAYMENT_RECEIVED,
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: therapistUsers[0].id,
                title: 'New Message',
                body: 'You have a new message from Alice Johnson.',
                type: NotificationType.MESSAGE_RECEIVED,
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: therapistUsers[1].id,
                title: 'System Update',
                body: 'TeleHealings will undergo scheduled maintenance on Sunday from 2-4 AM PST.',
                type: NotificationType.SYSTEM,
                isRead: true,
            },
        }),
        prisma.notification.create({
            data: {
                userId: clientUsers[0].id,
                title: 'Session Completed',
                body: 'Your session with Dr. Sarah Williams has been completed. Please leave a review.',
                type: NotificationType.SESSION_REMINDER,
                isRead: true,
            },
        }),
        prisma.notification.create({
            data: {
                userId: clientUsers[1].id,
                title: 'Session Cancelled',
                body: 'Your session with Dr. Sarah Williams scheduled for yesterday has been cancelled.',
                type: NotificationType.SYSTEM,
                isRead: false,
            },
        }),
    ]);
    console.log(`Created ${notifications.length} notifications.`);
    console.log('\n=== Seed Summary ===');
    console.log(`Users: ${(await prisma.user.count())} (3 clients + 3 therapists)`);
    console.log(`Client Profiles: ${(await prisma.clientProfile.count())}`);
    console.log(`Therapist Profiles: ${(await prisma.therapistProfile.count())}`);
    console.log(`Sessions: ${(await prisma.session.count())} (2 completed, 1 scheduled, 1 in-progress, 1 cancelled)`);
    console.log(`Bookings: ${(await prisma.booking.count())} (3 confirmed, 1 pending, 1 cancelled)`);
    console.log(`Payments: ${(await prisma.payment.count())} (2 completed, 1 pending)`);
    console.log(`Notifications: ${(await prisma.notification.count())}`);
    console.log('====================\n');
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map