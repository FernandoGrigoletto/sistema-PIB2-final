import db from './config/database.js';
import bcrypt from 'bcryptjs';

async function createUsers() {
    console.log("🚀 Iniciando criação de usuários especiais...");

    // Definição dos usuários a serem criados
    const users = [
        {
            nome: 'Administrador Principal',
            email: 'admin@sistema.com',
            password: '123', // Senha simples para teste
            role: 'admin'
        },
        {
            nome: 'Operador do Caixa',
            email: 'operador@sistema.com',
            password: '123',
            role: 'operador'
        }
    ];

    try {
        for (const user of users) {
            // 1. Verifica se já existe
            const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [user.email]);
            
            if (existing.length > 0) {
                console.log(`⚠️  O usuário ${user.email} já existe. Pulando...`);
                continue;
            }

            // 2. Criptografa a senha
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // 3. Insere no banco
            await db.execute(
                'INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)',
                [user.nome, user.email, hashedPassword, user.role]
            );

            console.log(`✅ Usuário criado: ${user.nome} (${user.role})`);
        }
        
        console.log("\n🏁 Processo finalizado! Agora você pode logar com esses e-mails.");
        process.exit();

    } catch (error) {
        console.error("❌ Erro ao criar usuários:", error);
        process.exit(1);
    }
}

createUsers();