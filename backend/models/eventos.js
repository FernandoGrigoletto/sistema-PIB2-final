class Evento {
    constructor(data) {
        this.id = data.id || null;
        this.description = data.description;
        this.category = data.category;
        this.brand = data.brand; // Data do evento
    }

    validate() {
        const errors = [];
        if (!this.description) errors.push('Descrição é obrigatória!');
        if (!this.category) errors.push('Categoria é obrigatória!');
        if (!this.brand) errors.push('Data é obrigatória!');
        return errors;
    }

    toJSON() {
        return {
            id: this.id,
            description: this.description,
            category: this.category,
            brand: this.brand
        };
    }
}
export default Evento;