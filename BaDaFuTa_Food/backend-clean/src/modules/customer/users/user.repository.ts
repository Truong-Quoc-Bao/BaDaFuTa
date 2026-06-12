// src/modules/users/user.repository.ts
import { prisma } from '@/libs/prisma';
import { RegisterInput } from './user.types';

export const findByEmail = (email: string) => prisma.users.findUnique({ where: { email } });

export const findByPhone = (phone: string) => prisma.users.findUnique({ where: { phone } });

export const findById = (id: string) => prisma.users.findUnique({ where: { id } });

export const create = (data: RegisterInput) => prisma.users.create({ data });

// Thêm vào cuối file user.repository.ts
export const saveResetToken = (id: string, token: string, expireTime: Date) =>
  prisma.users.update({
    where: { id },
    data: {
      resetPasswordToken: token,
      resetPasswordExpire: expireTime,
    },
  });

export const findByResetToken = (token: string) =>
  prisma.users.findFirst({
    where: {
      resetPasswordToken: token,
    },
  });

export const updatePasswordAndClearToken = (id: string, passwordHash: string) =>
  prisma.users.update({
    where: { id },
    data: {
      password: passwordHash,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
  });
