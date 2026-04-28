import { z } from "zod";

export const barberSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  skills: z.string().min(1, "Skills are required"),
  experienceYears: z.number().min(0, "Experience years must be positive"),
});

export type BarberPayload = z.infer<typeof barberSchema>;

export interface BarberResponse {
  barberId: number;
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  summary?: string;
  skills: string;
  experienceYears: number;
  userId: number;
  shopId?: number | null;
  shopName?: string | null;
}
