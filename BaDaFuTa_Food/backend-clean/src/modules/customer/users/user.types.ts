// src/modules/users/user.types.ts
export type RegisterInput = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password?: string;
  role?: "customer" | "merchant";
};

export type LoginInput = {
  identifier: string; // email hoặc phone
  password: string;
};
