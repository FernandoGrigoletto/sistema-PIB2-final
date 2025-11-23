class FluxoCaixa {
    constructor(data) {
        this.id = data.id || null;
        this.descricao = data.descricao;
        this.valor = data.valor;
        this.tipo = data.tipo;
        this.data = data.data;
        this.categoria = data.categoria || null;
        this.categoria_id = data.categoria_id || null;
    }

    toJSON() {
        return {
            id: this.id,
            descricao: this.descricao,
            valor: parseFloat(this.valor),
            tipo: this.tipo,
            data: this.data,
            categoria: this.categoria
        };
    }
}
export default FluxoCaixa;
