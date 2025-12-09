const API_BASE_URL = "http://localhost:3000/api/membros";

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! cidade: ${response.status}`);
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Erro na requisição");
  }
  return data;
};

const getAll = async (filtro = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtro.genero && filtro.genero.trim()) {
      params.append("genero", filtro.genero);
    }

    if (filtro.status && filtro.status.trim()) {
      params.append("status", filtro.status);
    }

    if (filtro.cidade && filtro.cidade.trim()) {
      params.append("cidade", filtro.cidade);
    }

    if (filtro.nome && filtro.nome.trim()) {
      params.append("nome", filtro.nome);
    }

    const url = params.toString()
      ? `${API_BASE_URL}?${params.toString()}`
      : API_BASE_URL;

    const response = await fetch(url);
    const result = await handleResponse(response);

    return result.data.map((membro) => ({
      ...membro,
    }));
  } catch (error) {
    console.error("Erro ao buscar membros: ", error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    const result = await handleResponse(response);
  } catch (error) {
    console.error("Erro ao buscar membros: ", error);
    throw error;
  }
};

const add = async (membro) => {
  console.log("Dados enviados:", membro);

  try {
    const membroData = {
      ...membro,
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(membroData),
    });
    const result = await handleResponse(response);

    return {
      ...result.data,
    };
  } catch (error) {
    console.error("Erro ao adicionar membro: ", error);
    throw error;
  }
};

const update = async (membro) => {
  try {
    const membroData = {
      ...membro,
    };

    const response = await fetch(`${API_BASE_URL}/${membro.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(membroData),
    });

    const result = await handleResponse(response);

    return {
      ...result.data,
    };
  } catch (error) {
    console.error(`Erro ao atualizar membro ${membro.id}`, error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await handleResponse(response);

    return result.message;
  } catch (error) {
    console.error(`Erro ao remover membro ${id}`, error);
    throw error;
  }
};

const verificarCpfExistente = async (cpf, id = null) => {
  try {
    const queryParams = new URLSearchParams({ cpf });
    if (id) queryParams.append("id", id);

    const response = await fetch(
      `${API_BASE_URL}/check-cpf?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Erro ao verificar CPF");
    }

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Erro na verificação de CPF:", error);
    return false; // libera se der erro, ou retorne true se quiser bloquear por segurança
  }
};

const membroService = {
  getAll,
  getById,
  add,
  update,
  remove,
  verificarCpfExistente,
};

export default membroService;
