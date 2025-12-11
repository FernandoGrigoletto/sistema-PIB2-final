import apiService from './api';

const userService = {
  // Listar todos
  getAll: async () => {
    // ADICIONADO: credentials: 'include' para enviar o cookie
    return apiService.request('/auth/users', {
      credentials: 'include' 
    });
  },

  // Criar (Reutiliza a rota de registro)
  create: async (userData) => {
    return apiService.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      credentials: 'include' // Necessário para autenticação de admin
    });
  },

  // Atualizar
  update: async (id, userData) => {
    return apiService.request(`/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
      credentials: 'include' // Necessário
    });
  },

  // Remover
  remove: async (id) => {
    return apiService.request(`/auth/users/${id}`, {
      method: 'DELETE',
      credentials: 'include' // Necessário
    });
  }
};

export default userService;