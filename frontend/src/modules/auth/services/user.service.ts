import { apiClient } from "../../../lib/api";

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export const userService = {
  getProfile: async (): Promise<UserResponse> => {
    return apiClient.get<UserResponse>("/users/profile");
  },
  updateProfile: async (data: Partial<UserResponse>): Promise<UserResponse> => {
    return apiClient.put<UserResponse>("/users/profile", data);
  }
};
