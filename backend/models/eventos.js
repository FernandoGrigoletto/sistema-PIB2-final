class Evento {
    constructor(data){
        this.id=data.id || null;
        this.description = data.description;
        this.category = data.category;
        this.brand = data.brand;
    }

    validate(){
        const errors=[]

        if(!this.description || this.description.trim().length===0){
            errors.push('Descrição é Obrigatória!')
        }
        if(!this.category || this.category.trim().length===0){
            errors.push('Categoria é Obrigatória!')
        }
        if(!this.brand || this.brand.trim().length===0){
            errors.push('Data é Obrigatória!')
        }

        return errors;
    }

    toJSON(){

        return{
            id: this.id,
            description: this.description,
            category: this.category,
            brand: this.brand
        }

    }

    
}

module.exports = Evento