import { apiClient } from "../../../lib/api";
import { ShopService } from "./shop.service";
import { ShopPayload, ShopResponse } from "../types/shop.types";

export class ShopServiceImpl implements ShopService {
  async listShops(): Promise<ShopResponse[]> {
    return apiClient.get<ShopResponse[]>("/shops");
  }

  async getShop(id: string): Promise<ShopResponse> {
    return apiClient.get<ShopResponse>(`/shops/${id}`);
  }

  async createShop(payload: ShopPayload): Promise<ShopResponse> {
    return apiClient.post<ShopResponse>("/shops", payload);
  }

  async updateShop(id: string, payload: ShopPayload): Promise<ShopResponse> {
    return apiClient.put<ShopResponse>(`/shops/${id}`, payload);
  }

  async deleteShop(id: string): Promise<void> {
    return apiClient.delete<void>(`/shops/${id}`);
  }

  async getShopsByOwner(): Promise<ShopResponse[]> {
    return apiClient.get<ShopResponse[]>("/shops/owned");
  }
}
