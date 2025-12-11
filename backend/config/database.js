import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'evento_db',
    port: process.env.DB_PORT || 3307, 
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ Conectado ao MySQL com sucesso na porta ${dbConfig.port}!`);
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar ao MySQL:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('⚠️  Dica: Verifique se o XAMPP/MySQL está ligado e se a porta correta é a ' + dbConfig.port);
        }
    }
};

testConnection();

export default pool;
