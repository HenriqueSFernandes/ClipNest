const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, credentials: "include" });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>(endpoint, { method: "GET", ...options });
  },

  post: <T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> => {
    const isFormData = data instanceof FormData;
    const headers = options?.headers || {};

    if (!isFormData && data !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    return apiFetch<T>(endpoint, {
      method: "POST",
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  },

  put: <T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> => {
    const isFormData = data instanceof FormData;
    const headers = options?.headers || {};

    if (!isFormData && data !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    return apiFetch<T>(endpoint, {
      method: "PUT",
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  },

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>(endpoint, { method: "DELETE", ...options });
  },
};
