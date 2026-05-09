/**
 * API client methods for image upload
 */

import { apiClient } from "@/lib/api";

export interface ImageUploadResponse {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export const uploadCustomerImage = async (
  customerId: number,
  file: File,
  token: string
): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  // Use apiClient which handles the full backend URL
  return apiClient.post<ImageUploadResponse>(`/images/customers/${customerId}`, formData);
};
