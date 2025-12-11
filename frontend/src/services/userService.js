const API_URL = 'http://localhost:3000/api/users';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const getAll = async () => {
    const response = await fetch(API_URL, { headers: getHeaders() });
    return response.json();
};

const create = async (user) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(user)
    });
    return response.json();
};

const update = async (id, user) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(user)
    });
    return response.json();
};

const remove = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return response.json();
};

export default { getAll, create, update, remove };