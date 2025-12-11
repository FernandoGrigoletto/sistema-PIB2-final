const API_BASE_URL = 'http://localhost:3000/api/membros';

// Função auxiliar para tratar a resposta
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // O nosso backend retorna sempre { success: true, data: ... }
    if (data.success === false) { 
        throw new Error(data.message || 'Erro na requisição');
    }
    return data;
};

const getAll = async (filtro = {}) => {
    try {
        // Monta a Query String para filtros (opcional)
        const params = new URLSearchParams();
        if (filtro.nome) params.append("nome", filtro.nome);
        if (filtro.cidade) params.append("cidade", filtro.cidade);
        
        const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include' // Importante para passar o cookie de sessão
        });
        
        const result = await handleResponse(response);
        return result.data; // Retorna o array de membros
    } catch (error) {
        console.error('Erro ao buscar membros:', error);
        throw error;
    }
};

const add = async (membro) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membro),
            credentials: 'include'
        });
        const result = await handleResponse(response);
        return result.data;
    } catch (error) {
        console.error('Erro ao adicionar membro:', error);
        throw error; // Lança o erro para o Form exibir (ex: CPF duplicado)
    }
};

const update = async (membro) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${membro.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membro),
            credentials: 'include'
        });
        const result = await handleResponse(response);
        return result.data;
    } catch (error) {
        console.error('Erro ao atualizar membro:', error);
        throw error;
    }
};

const remove = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const result = await handleResponse(response);
        return result;
    } catch (error) {
        console.error('Erro ao remover membro:', error);
        throw error;
    }
};

// Verificação auxiliar (opcional, pois o backend já valida no 'add/update')
const verificarCpfExistente = async (cpf, id) => {
    try {
        const allMembros = await getAll();
        // Backend guarda apenas números, certifique-se que 'cpf' aqui vem limpo
        const cpfLimpo = cpf.replace(/\D/g, "");
        
        return allMembros.some(m => m.cpf === cpfLimpo && m.id !== id);
    } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        return false;
    }
};

export default { getAll, add, update, remove, verificarCpfExistente };
