import { z } from "zod";

export const shopSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

export type ShopPayload = z.infer<typeof shopSchema>;

export interface SeatResponse {
  id: number;
  seatName: string;
  barberId?: number;
  barberFullName?: string;
}

export interface ShopResponse {
  id: number;
  name: string;
  address: string;
  seats: SeatResponse[];
}
