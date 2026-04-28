/**
 * API client methods for image upload
 */

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

  const response = await fetch(`/api/images/customers/${customerId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Image upload failed:', response.status, errorText);
    throw new Error(`Failed to upload image: ${response.statusText} - ${errorText}`);
  }

  return response.json();
};
