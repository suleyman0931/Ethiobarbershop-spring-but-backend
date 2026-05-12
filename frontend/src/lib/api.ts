const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  
  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  } else {
    // Remove Content-Type header for FormData - browser will set it with boundary
    headers.delete("Content-Type");
  }

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // Auto-refresh on 401
  if (response.status === 401 && retry) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      return apiRequest<T>(endpoint, options, false);
    }
    // Refresh failed — clear auth and redirect to login (only if not on public pages)
    if (typeof window !== "undefined") {
      const publicPaths = ['/', '/about', '/login', '/signup'];
      const currentPath = window.location.pathname;
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Only redirect if not on a public page
      if (!publicPaths.includes(currentPath)) {
        window.location.href = "/login";
      }
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (response.status === 204) return {} as T;

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
