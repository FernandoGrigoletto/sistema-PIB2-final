import MembroRepository from '../repository/membroRepository.js';
import Membro from '../models/Membro.js'; // Importação do Model para validação

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

// Listar todos os membros (com suporte a filtros)
export async function getAllMembros(req, res) {
    try {
        // Captura filtros da URL, ex: /api/membros?nome=Joao&cidade=SaoPaulo
        const filters = {
            nome: req.query.nome,
            cidade: req.query.cidade,
            genero: req.query.genero,
            status: req.query.status
        };

        const membros = await MembroRepository.findAll(filters);
        return res.json({ success: true, data: membros });

    } catch (error) {
        console.error("Erro ao buscar membros:", error);
        return res.status(500).json({ success: false, message: 'Erro ao buscar membros' });
    }
}

// Criar novo membro
export async function createMembro(req, res) {
    const dados = req.body;

    // 1. Instancia o Modelo para validar campos obrigatórios e Enums
    const novoMembroModel = new Membro(dados);
    const errosValidacao = novoMembroModel.validate();

    if (errosValidacao.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Erro de validação',
            errors: errosValidacao 
        });
    }

    // 2. Validação Específica de CPF (Algoritmo matemático)
    if (dados.cpf && !validarCPF(dados.cpf)) {
        return res.status(400).json({ success: false, message: 'CPF inválido. Verifique os números.' });
    }

    // 3. Preparação dos dados (Limpeza e uso do objeto validado)
    // Usamos .toJSON() para garantir que pegamos apenas os campos da classe, 
    // mas sobrescrevemos CPF e Telefone com a versão limpa (apenas números)
    const membroData = {
        ...novoMembroModel.toJSON(),
        cpf: apenasNumeros(dados.cpf),
        telefone: apenasNumeros(dados.telefone)
    };

    try {
        const novoMembro = await MembroRepository.create(membroData);
        return res.status(201).json({ success: true, data: novoMembro });

    } catch (error) {
        console.error("Erro ao criar membro:", error);
        
        if (error.message.includes('CPF já cadastrado')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        
        return res.status(500).json({ success: false, message: 'Erro ao criar membro' });
    }
}

// Atualizar membro
export async function updateMembro(req, res) {
    const { id } = req.params;
    const dados = req.body;

    // 1. Validação de consistência básica
    const membroModel = new Membro(dados);
    const errosValidacao = membroModel.validate();

    if (errosValidacao.length > 0) {
         return res.status(400).json({ 
            success: false, 
            message: 'Erro de validação',
            errors: errosValidacao 
        });
    }

    // 2. Validação de CPF na edição
    if (dados.cpf && !validarCPF(dados.cpf)) {
        return res.status(400).json({ success: false, message: 'CPF inválido. Verifique os números.' });
    }

    // 3. Preparar dados para atualização
    const membroData = {
        ...membroModel.toJSON(),
        cpf: apenasNumeros(dados.cpf),
        telefone: apenasNumeros(dados.telefone)
    };

    try {
        const membroAtualizado = await MembroRepository.update(id, membroData);
        
        if (!membroAtualizado) {
            return res.status(404).json({ success: false, message: 'Membro não encontrado.' });
        }

        return res.json({ success: true, data: membroAtualizado });

    } catch (error) {
        console.error("Erro ao atualizar membro:", error);

        if (error.message.includes('CPF já cadastrado')) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(500).json({ success: false, message: 'Erro ao atualizar membro' });
    }
}

// Remover membro
export async function deleteMembro(req, res) {
    const { id } = req.params;
    try {
        const sucesso = await MembroRepository.delete(id);
        
        if (!sucesso) {
            return res.status(404).json({ success: false, message: 'Membro não encontrado ou já removido.' });
        }

        return res.json({ success: true, message: 'Membro removido com sucesso' });

    } catch (error) {
        console.error("Erro ao remover membro:", error);
        return res.status(500).json({ success: false, message: 'Erro ao remover membro' });
    }
}
