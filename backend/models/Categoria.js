class Categoria {
    constructor(data) {
        this.id = data.id || null;
        this.nome = data.nome;
    }
}

export default Categoria; // Correção: usar export default ao invés de module.exports
