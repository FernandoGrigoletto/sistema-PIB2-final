const API_BASE_URL ='http://localhost:3000/api/eventos';

const handleResponse = async (response)=>{
    if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json();
    if(!data.success){
        throw new Error(data.message || 'Erro na requisição');
    }
    return data;
}

const getAll = async (filtro = {}) => {
    try {
        const params = new URLSearchParams();
        if (filtro.category && filtro.category.trim()) {
            params.append("category", filtro.category);
        }
        const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;

        // Leitura é pública, não precisa de credentials obrigatório, mas não faz mal
        const response = await fetch(url);
        const result = await handleResponse(response);

        return result.data.map(evento => ({ ...evento }));
    } catch (error) {
        console.error('Erro ao buscar evento:', error);
        throw error;
    }
};

const getById = async(id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const result = await handleResponse(response);
        return {...result.data};
    } catch (error){
        console.error(`Erro ao buscar evento ${id}: `, error);
        throw error;
    }
}

const add = async (evento) => {
    try {
        const formData = new FormData();
        formData.append('titulo', evento.titulo);
        formData.append('description', evento.description);
        formData.append('category', evento.category);
        formData.append('brand', evento.brand);
        if (evento.arquivo) {
            formData.append('arquivo', evento.arquivo);
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            body: formData,
            credentials: 'include' // Necessário para Admin
        });
        const result = await handleResponse(response);
        return { ...result.data };
    } catch (error) {
        console.error('Erro ao adicionar evento:', error);
        throw error;
    }
}

const update = async (evento) => {
    try {
        const formData = new FormData();
        formData.append('titulo', evento.titulo);
        formData.append('description', evento.description);
        formData.append('category', evento.category);
        formData.append('brand', evento.brand);

        if (evento.arquivo && evento.arquivo instanceof File) {
            formData.append('arquivo', evento.arquivo);
        }

        const response = await fetch(`${API_BASE_URL}/${evento.id}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include' // Necessário para Admin
        });
        const result = await handleResponse(response);
        return { ...result.data };
    } catch (error) {
        console.error(`Erro ao atualizar evento ${evento.id}:`, error);
        throw error;
    }
}

const remove = async(id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`,{
            method:'DELETE',
            credentials: 'include' // Necessário para Admin
        });
        const result = await handleResponse(response);
        return result.message;
    } catch (error){
        console.error(`Erro ao remover evento ${id}`,error)
        throw error;
    }
}

export default { getAll, getById, update, add, remove };

