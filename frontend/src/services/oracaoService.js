const API_BASE_URL ='http://localhost:3000/api/oracoes'

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

const getAll = async()=>{
    try{
        const response = await fetch(API_BASE_URL);
        const result = await handleResponse(response)
        return result.data.map(oracao=>({...oracao}))

    } catch (error){
        console.error('Erro ao buscar oracao:', error);
        throw error;

    }
   
}

const getById=async(id)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`)
        const result = await handleResponse(response);
        return {...result.data}
    }catch (error){
        console.error(`Erro ao buscar oração ${id}: `, error);
        throw error;
    }
   
    
}

const add= async(oracao)=>{
    try {
        const oracaoData = {...oracao};
        const response = await fetch(API_BASE_URL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(oracaoData),
        })
        const result = await handleResponse(response);
        return {...result.data}

    } catch (error){
        console.error('Erro ao adicionar oração:', error);
        throw error;

    }

}

 
const update= async (oracao)=>{
    try {
        const oracaoData = {...oracao, id: parseInt(oracao.id)};
        const response = await fetch(`${API_BASE_URL}/${oracao.id}`,{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(oracaoData),
        })
        const result = await handleResponse(response);
        return {
            ...result.data
        };

    } catch (error){
        console.error(`Erro ao atualizar evento ${oracao.id}:`, error);
        throw error;

    }
}

const remove =async(id)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`,{
            method:'DELETE',
        });
        const result = await handleResponse(response);
        return result.message;

    } catch (error){
        console.error(`Erro ao remover evento ${id}`,error)
        throw error;

    }

}

const oracaoService ={
getAll,
getById,
update,
add,
remove

}

export default oracaoService;

