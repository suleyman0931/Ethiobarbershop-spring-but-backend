import { apiClient } from "../../../lib/api";
import { LoginPayload, LoginResponse, SignupPayload, SignupResponse } from "../types/auth.types";

export interface AuthService {
  login(payload: LoginPayload): Promise<LoginResponse>;
  signup(payload: SignupPayload): Promise<SignupResponse>;
  logout(): void;
}

class AuthServiceImpl implements AuthService {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", payload);
  }

  async signup(payload: SignupPayload): Promise<SignupResponse> {
    // Backend expects role as Set<String> (array), not a single string
    const body = {
      ...payload,
      role: payload.role ? [payload.role] : undefined,
    };
    return apiClient.post<SignupResponse>("/auth/signup", body);
  }

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export const authService = new AuthServiceImpl();
