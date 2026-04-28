import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional(),
});

// Public signup is customer-only.
// Barbers are registered by the shop owner.
// Owners are registered by the super admin.
export const roles = [
  { label: "Customer", value: "customer" },
];

export type SignupPayload = z.infer<typeof registerSchema>;
export type RegisterPayload = SignupPayload;

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  type: string;
}

export interface SignupResponse {
  message: string;
}
