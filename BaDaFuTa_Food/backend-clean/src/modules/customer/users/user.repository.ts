// src/modules/users/user.repository.ts
import { prisma } from "@/libs/prisma";
import { RegisterInput } from "./user.types";

export const findByEmail = (email: string) =>
  prisma.users.findUnique({ where: { email } });

export const findByPhone = (phone: string) =>
  prisma.users.findUnique({ where: { phone } });

export const findById = (id: string) =>
  prisma.users.findUnique({ where: { id } });

export const create = (data: RegisterInput) => prisma.users.create({ data });
