const API_BASE = "https://dummyjson.com";
const REQUEST_TIMEOUT = 10000;

class ApiError extends Error {
  name: string;
  status?: number;
  isNetworkError: boolean;

  constructor(
    message: string,
    status?: number,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        "Request timeout. Please check your connection.",
        undefined,
        true
      );
    }
    throw error;
  }
};

export const api = {
  login: async (username: string, password: string) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, expiresInMins: 60 }),
      });
      if (!res.ok) {
        if (res.status === 400) {
          throw new ApiError("Invalid username or password", 400);
        } else if (res.status === 401) {
          throw new ApiError("Authentication failed", 401);
        } else if (res.status >= 500) {
          throw new ApiError(
            "Server error. Please try again later.",
            res.status
          );
        }
        throw new ApiError("Login failed", res.status);
      }

      return await res.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof TypeError) {
        throw new ApiError(
          "Network error. Please check your internet connection.",
          undefined,
          true
        );
      }
    }
  },

  getProducts: async (skip: number, limit: number, search: string = "") => {
    try {
      const url = search
        ? `${API_BASE}/products/search?q=${search}&limit=${limit}&skip=${skip}`
        : `${API_BASE}/products?limit=${limit}&skip=${skip}`;

      const res = await fetchWithTimeout(url);

      if (!res.ok) {
        if (res.status >= 500) {
          throw new ApiError(
            "Server error. Unable to load products.",
            res.status
          );
        }
        throw new ApiError("Failed to load products", res.status);
      }

      return await res.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof TypeError) {
        throw new ApiError(
          "Network error. Please check your internet connection.",
          undefined,
          true
        );
      }
    }
  },

  updateUser: async (userId: number, data: any, token: string) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new ApiError("Session expired. Please login again.", 401);
        } else if (res.status >= 500) {
          throw new ApiError(
            "Server error. Unable to update information.",
            res.status
          );
        }
        throw new ApiError("Failed to update user information", res.status);
      }
      return await res.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof TypeError) {
        throw new ApiError(
          "Network error. Please check your internet connection.",
          undefined,
          true
        );
      }
    }
  },
};
