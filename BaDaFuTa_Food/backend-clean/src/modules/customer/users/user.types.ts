// src/modules/users/user.types.ts
export type RegisterInput = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password?: string;
  role?: 'customer' | 'merchant';
};

export type LoginInput = {
  identifier: string; // email hoặc phone
  password: string;
};

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: Date | string | null;
  gender?: string | null;
  avatar?: string | null;
  role: 'customer' | 'merchant'; // Đồng bộ với kiểu role của bạn
  unfid?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserDTO {
  full_name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  avatar?: string | null;
}
