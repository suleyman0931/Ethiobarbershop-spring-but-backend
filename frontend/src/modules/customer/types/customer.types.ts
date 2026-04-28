import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export type CustomerPayload = z.infer<typeof customerSchema>;

export interface CustomerResponse {
  customerId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userId: number;
}
