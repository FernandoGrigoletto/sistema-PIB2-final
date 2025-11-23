import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    database: 'evento_db',
    port: 3307, // Confirme se sua porta é 3307 ou 3306
    password: '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao MySQL com sucesso!');
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar ao MySQL:', error.message);
    }
};

testConnection();

export default pool;
