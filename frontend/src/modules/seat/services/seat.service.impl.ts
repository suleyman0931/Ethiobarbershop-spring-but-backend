import { apiClient } from "../../../lib/api";
import { SeatResponse } from "../types/seat.types";

export interface SeatService {
  listSeatsByShop(shopId: string): Promise<SeatResponse[]>;
  getSeat(shopId: string, seatId: string): Promise<SeatResponse>;
  createSeat(shopId: string, payload: any): Promise<SeatResponse>;
  updateSeat(shopId: string, seatId: string, payload: any): Promise<SeatResponse>;
  deleteSeat(shopId: string, seatId: string): Promise<void>;
  assignBarber(shopId: string, seatId: string, barberId: string): Promise<SeatResponse>;
}

class SeatServiceImpl implements SeatService {
  async listSeatsByShop(shopId: string): Promise<SeatResponse[]> {
    return apiClient.get<SeatResponse[]>(`/shops/${shopId}/seats`);
  }

  async getSeat(shopId: string, seatId: string): Promise<SeatResponse> {
    return apiClient.get<SeatResponse>(`/shops/${shopId}/seats/${seatId}`);
  }

  async createSeat(shopId: string, payload: any): Promise<SeatResponse> {
    return apiClient.post<SeatResponse>(`/shops/${shopId}/seats`, payload);
  }

  async updateSeat(shopId: string, seatId: string, payload: any): Promise<SeatResponse> {
    return apiClient.put<SeatResponse>(`/shops/${shopId}/seats/${seatId}`, payload);
  }

  async deleteSeat(shopId: string, seatId: string): Promise<void> {
    return apiClient.delete<void>(`/shops/${shopId}/seats/${seatId}`);
  }

  async assignBarber(shopId: string, seatId: string, barberId: string): Promise<SeatResponse> {
    return apiClient.post<SeatResponse>(`/shops/${shopId}/seats/${seatId}/assign/${barberId}`, {});
  }
}

export const seatService = new SeatServiceImpl();
