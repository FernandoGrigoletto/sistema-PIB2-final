const API_BASE_URL = "http://localhost:3000";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    const config = {
      ...options,
      headers,
    };
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro na requisição");
    }
    return response.json().catch(() => ({}));
  }

  async login(email, password) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
  }

  async logout() {
    return this.request("/logout", {
      method: "POST",
      credentials: "include",
    });
  }

  async checkAuth() {
    return this.request("/auth/me", { credentials: "include" });
  }
}

export default new ApiService();


