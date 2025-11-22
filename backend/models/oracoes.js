class Oracao {
    constructor(data){
        this.id=data.id || null;
        this.nome = data.nome;
        this.contato = data.contato;
        this.pedido = data.pedido;
        this.data = data.data;
    }

   

    toJSON(){

        return{
            id: this.id,
            nome: this.nome,
            contato: this.contato,
            pedido: this.pedido,
            data: this.data
        }

    }

    
}

module.exports = Oracao