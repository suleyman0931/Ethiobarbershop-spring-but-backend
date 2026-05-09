import { apiClient } from "../../../lib/api";
import { ImageResponse } from "../types/image.types";
import { ImageService } from "./image.service";

export class ImageServiceImpl implements ImageService {
  private async uploadImage(url: string, file: File): Promise<ImageResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<ImageResponse>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async uploadOwnerImage(ownerId: number, file: File): Promise<ImageResponse> {
    return this.uploadImage(`/images/owner/${ownerId}`, file);
  }

  async getOwnerImage(ownerId: number): Promise<ImageResponse | null> {
    try {
      return await apiClient.get<ImageResponse>(`/images/owner/${ownerId}`);
    } catch (e) {
      return null;
    }
  }

  async uploadBarberImage(barberId: number, file: File): Promise<ImageResponse> {
    return this.uploadImage(`/images/barber/${barberId}`, file);
  }

  async uploadCustomerImage(customerId: number, file: File): Promise<ImageResponse> {
    return this.uploadImage(`/images/customer/${customerId}`, file);
  }

  async uploadShopImage(shopId: number, file: File): Promise<ImageResponse> {
    return this.uploadImage(`/images/shop/${shopId}`, file);
  }

  async deleteOwnerImage(ownerId: number): Promise<void> {
    return apiClient.delete(`/images/owner/${ownerId}`);
  }
}
