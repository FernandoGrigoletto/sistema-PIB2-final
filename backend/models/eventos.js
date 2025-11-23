class Evento {
    constructor(data) {
        this.id = data.id || null;
        this.titulo = data.titulo; // <--- Adicionado
        this.description = data.description;
        this.category = data.category;
        this.brand = data.brand; 
        this.arquivo = data.arquivo || null; // <--- Adicionado
    }

    validate() {
        const errors = [];
        if (!this.titulo) errors.push('Título é obrigatório!'); // <--- Adicionado
        if (!this.description) errors.push('Descrição é obrigatória!');
        if (!this.category) errors.push('Categoria é obrigatória!');
        if (!this.brand) errors.push('Data é obrigatória!');
        return errors;
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo, // <--- Adicionado
            description: this.description,
            category: this.category,
            brand: this.brand,
            arquivo: this.arquivo // <--- Adicionado
        };
    }
}
export default Evento;