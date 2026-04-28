import { z } from "zod";

export const seatSchema = z.object({
  seatName: z.string().min(1, "Seat name is required"),
});

export interface SeatResponse {
  id: number;
  seatName: string;
  barberId?: number;
  barberFullName?: string;
}
