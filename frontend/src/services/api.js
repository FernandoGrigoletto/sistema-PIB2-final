const API_BASE_URL = "http://localhost:3000/api";

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

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || "Erro na requisição"
        );
      }

      return response.json().catch(() => ({}));
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async forgotPassword(email) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email, newPassword) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
    });
  }

  async login(email, password) {
    // Chama /api/auth/login
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include", // Importante para receber o cookie
    });
  }


  // Atualize o método register para aceitar 'role'
  async register(nome, email, password, role) {
    return this.request("/auth/register", {
      method: "POST",
      // Envie o role no corpo da requisição
      body: JSON.stringify({ nome, email, password, role }),
      credentials: "include",
    });
  }

// ...

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  }

  async checkAuth() {
    return this.request("/auth/me", { credentials: "include" });
  }

  async getAllUsers() {
    return this.request("/auth/users", {
      method: "GET",
      credentials: "include",
    });
  }
}

export default new ApiService();
