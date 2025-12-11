const API_BASE_URL = 'http://localhost:3000/api/membros';

// Função auxiliar para tratar a resposta
const handleResponse = async (response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Verifica se a resposta da API tem o campo success (padrão do seu projeto)
    // Se o backend retornar o array direto, você pode ajustar aqui.
    // Assumindo o padrão do eventoService:
    if (data.success === false) { 
        throw new Error(data.message || 'Erro na requisição');
    }
    return data;
};

const getAll = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            credentials: 'include' 
        });
        const result = await handleResponse(response);
        // Retorna result.data ou result (dependendo de como o backend envia)
        return result.data || result; 
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
        throw error;
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

const verificarCpfExistente = async (cpf, id) => {
    try {
        // Busca todos os membros para verificar duplicação
        // (Idealmente o backend teria um endpoint específico para isso, mas isso funciona)
        const allMembros = await getAll();
        
        // Verifica se existe algum membro com o mesmo CPF, ignorando o próprio ID (no caso de edição)
        const duplicado = allMembros.some(m => m.cpf === cpf && m.id !== id);
        
        return duplicado;
    } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        return false; // Em caso de erro, assume que não existe para não bloquear
    }
};

export default { getAll, add, update, remove, verificarCpfExistente };
