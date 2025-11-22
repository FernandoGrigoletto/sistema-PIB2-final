class FluxoCaixa {
    constructor(data) {
        this.id = data.id || null;
        this.descricao = data.descricao;
        this.valor = data.valor;
        this.tipo = data.tipo;
        this.data = data.data;
        // Se vier do banco com join, pode ter o nome da categoria
        this.categoria = data.categoria || null;
        this.categoria_id = data.categoria_id || null;
    }

    toJSON() {
        return {
            id: this.id,
            descricao: this.descricao,
            valor: parseFloat(this.valor), // Garante que venha como número
            tipo: this.tipo,
            data: this.data,
            categoria: this.categoria // Nome da categoria para o frontend
        };
    }
}

module.exports = FluxoCaixa;
