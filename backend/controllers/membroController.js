import db from '../config/database.js';

// --- FUNÇÕES AUXILIARES ---

// Remove tudo o que não for número
const apenasNumeros = (str) => str ? str.replace(/\D/g, '') : null;

// Algoritmo oficial de validação de CPF do Brasil
const validarCPF = (cpf) => {
    cpf = apenasNumeros(cpf);

    if (!cpf || cpf.length !== 11) return false;

    // Elimina CPFs com todos os dígitos iguais (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Validação do 1º Dígito Verificador
    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    // Validação do 2º Dígito Verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
};

// --- CONTROLLERS ---

// Listar todos os membros
export async function getAllMembros(req, res) {
    try {
        const [rows] = await db.execute('SELECT * FROM membros ORDER BY nome ASC');
        return res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar membros:", error);
        return res.status(500).json({ success: false, message: 'Erro ao buscar membros' });
    }
}

// Criar novo membro
export async function createMembro(req, res) {
    const { nome, email, cpf, telefone, nasc, genero, endereco, cidade, status } = req.body;

    if (!nome) {
        return res.status(400).json({ success: false, message: 'O nome é obrigatório.' });
    }

    // 1. Validação de CPF (Algoritmo)
    if (cpf) {
        if (!validarCPF(cpf)) {
            return res.status(400).json({ success: false, message: 'CPF inválido. Verifique os números.' });
        }
    } else {
        // Se decidir que CPF é obrigatório, descomente a linha abaixo:
        // return res.status(400).json({ success: false, message: 'O CPF é obrigatório.' });
    }

    const cpfLimpo = apenasNumeros(cpf);
    const telefoneLimpo = apenasNumeros(telefone);

    try {
        const [result] = await db.execute(
            `INSERT INTO membros (nome, email, cpf, telefone, nasc, genero, endereco, cidade, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome, 
                email || null, 
                cpfLimpo, 
                telefoneLimpo, 
                nasc || null, 
                genero || null, 
                endereco || null, 
                cidade || null, 
                status || 'Ativo'
            ]
        );

        const novoMembro = { id: result.insertId, ...req.body };
        return res.status(201).json({ success: true, data: novoMembro });

    } catch (error) {
        console.error("Erro ao criar membro:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Este CPF já está cadastrado.' });
        }
        return res.status(500).json({ success: false, message: 'Erro ao criar membro' });
    }
}

// Atualizar membro
export async function updateMembro(req, res) {
    const { id } = req.params;
    const { nome, email, cpf, telefone, nasc, genero, endereco, cidade, status } = req.body;

    // 1. Validação de CPF na edição
    if (cpf && !validarCPF(cpf)) {
        return res.status(400).json({ success: false, message: 'CPF inválido. Verifique os números.' });
    }

    const cpfLimpo = apenasNumeros(cpf);
    const telefoneLimpo = apenasNumeros(telefone);

    try {
        await db.execute(
            `UPDATE membros SET nome=?, email=?, cpf=?, telefone=?, nasc=?, genero=?, endereco=?, cidade=?, status=? 
             WHERE id=?`,
            [nome, email, cpfLimpo, telefoneLimpo, nasc, genero, endereco, cidade, status, id]
        );

        return res.json({ success: true, data: { id, ...req.body } });

    } catch (error) {
        console.error("Erro ao atualizar membro:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Este CPF já está em uso por outro membro.' });
        }
        return res.status(500).json({ success: false, message: 'Erro ao atualizar membro' });
    }
}

// Remover membro
export async function deleteMembro(req, res) {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM membros WHERE id = ?', [id]);
        return res.json({ success: true, message: 'Membro removido com sucesso' });
    } catch (error) {
        console.error("Erro ao remover membro:", error);
        return res.status(500).json({ success: false, message: 'Erro ao remover membro' });
    }
}
