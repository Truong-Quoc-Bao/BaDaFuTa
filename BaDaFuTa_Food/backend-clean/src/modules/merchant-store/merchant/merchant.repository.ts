import { prisma } from '@/libs/prisma';

export const findByEmail = async (email: string) => {
  return await prisma.merchant.findFirst({
    where: { email: email },
  });
};
