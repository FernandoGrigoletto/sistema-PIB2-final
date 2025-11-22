const mysql =require('mysql2/promise')

const dbConfig={
    host: 'localhost',
    user: 'root',
    database: 'evento_db',
    port: 3307,
    password: '',
    waitForConnections: true,
    connectionLimit: 10,           
    queueLimit: 0,
           


}
const pool = mysql.createPool(dbConfig);

const testConnection =async ()=>{
    try {
        const connection = await pool.getConnection();
        console.log('Conectado com sucesso!')
        connection.release()
    } catch (error) {
        console.error('Erro ao conectar ao mysql:',error.message);
    }
    
}
testConnection();

module.exports = pool;
