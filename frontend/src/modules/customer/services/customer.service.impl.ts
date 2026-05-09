import { apiClient } from "../../../lib/api";
import { CustomerPayload, CustomerResponse } from "../types/customer.types";
import { CustomerService } from "./customer.service";

export class CustomerServiceImpl implements CustomerService {
  async createCustomerProfile(payload: CustomerPayload): Promise<CustomerResponse> {
    return apiClient.post<CustomerResponse>("/customers/me", payload);
  }

  async getCustomerProfile(): Promise<CustomerResponse> {
    return apiClient.get<CustomerResponse>("/customers/me");
  }

  async updateCustomerProfile(payload: CustomerPayload): Promise<CustomerResponse> {
    return apiClient.put<CustomerResponse>("/customers/me", payload);
  }

  async deleteCustomerProfile(): Promise<void> {
    return apiClient.delete("/customers/me");
  }
}
