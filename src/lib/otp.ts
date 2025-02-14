// otp.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateOTP = (length = 6) => {
  return Math.floor(
    10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)
  ).toString();
};

export const storeOTP = async (email: string, otp: string, expiresAt: Date) => {
  try {
    const result = await prisma.otp.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt }
    });
    return result;
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const record = await prisma.otp.findUnique({ where: { email } });
    if (!record || record.otp !== otp || record.expiresAt < new Date()) return false;
    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Ensure connection is closed when the app terminates
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});