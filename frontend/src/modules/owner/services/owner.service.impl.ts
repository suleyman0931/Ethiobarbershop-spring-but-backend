import { apiClient } from "../../../lib/api";
import { OwnerPayload, OwnerResponse } from "../types/owner.types";
import { OwnerService } from "./owner.service";

export class OwnerServiceImpl implements OwnerService {
  async createOwnerProfile(payload: OwnerPayload): Promise<OwnerResponse> {
    return apiClient.post<OwnerResponse>("/owners/me", payload);
  }

  async getOwnerProfile(): Promise<OwnerResponse> {
    return apiClient.get<OwnerResponse>("/owners/me");
  }

  async updateOwnerProfile(payload: OwnerPayload): Promise<OwnerResponse> {
    return apiClient.put<OwnerResponse>("/owners/me", payload);
  }

  async deleteOwnerProfile(): Promise<void> {
    return apiClient.delete("/owners/me");
  }
}
