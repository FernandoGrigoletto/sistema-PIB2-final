const API_BASE_URL = 'http://localhost:3000/api/fluxo';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erro HTTP: ${response.status}`);
  }
  return response.json();
};

const getAll = async () => {
  try {
    // ADICIONADO: credentials: 'include'
    const response = await fetch(API_BASE_URL, { credentials: 'include' });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao buscar fluxos:", error);
    throw error;
  }
};

const add = async (fluxo) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fluxo),
      credentials: 'include' // ADICIONADO
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao adicionar fluxo:", error);
    throw error;
  }
};

const update = async (fluxo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${fluxo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fluxo),
      credentials: 'include' // ADICIONADO
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao atualizar fluxo:", error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include' // ADICIONADO
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao remover fluxo:", error);
    throw error;
  }
};

export default { getAll, add, update, remove };