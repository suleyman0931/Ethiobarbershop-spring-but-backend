import { z } from "zod";

export const ownerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export type OwnerPayload = z.infer<typeof ownerSchema>;

export interface OwnerResponse {
  id: number;
  ownerId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userId: number;
}
