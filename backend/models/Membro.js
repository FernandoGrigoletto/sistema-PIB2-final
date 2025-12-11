export default class Membro {
    // Listas estáticas para fácil acesso e validação
    static GENERO_VALIDOS = ["Masculino", "Feminino"];
    static STATUS_VALIDOS = ["Ativo", "Inativo", "Ausente", "Visitante"];
  
    constructor(data) {
      this.id = data.id || null;
      this.nome = data.nome;
      this.endereco = data.endereco;
      this.cidade = data.cidade;
      this.email = data.email;
      this.cpf = data.cpf;
      this.nasc = data.nasc; 
      this.genero = data.genero;
      this.telefone = data.telefone;
      this.status = data.status || "Ativo";
    }
  
    // Método auxiliar para verificar se está vazio
    _isEmpty(value) {
        if (!value) return true;
        if (typeof value === 'string' && value.trim().length === 0) return true;
        return false;
    }
  
    validate() {
      const errors = [];
  
      if (this._isEmpty(this.nome)) errors.push("Nome é obrigatório!");
      if (this._isEmpty(this.endereco)) errors.push("Endereço é obrigatório!");
      if (this._isEmpty(this.cidade)) errors.push("Cidade é obrigatória!");
      // if (this._isEmpty(this.email)) errors.push("Email é obrigatório!"); // Opcional
      if (this._isEmpty(this.cpf)) errors.push("CPF é obrigatório!");
      if (!this.nasc) errors.push("Data de Nascimento é obrigatória!");
      
      if (this._isEmpty(this.telefone)) errors.push("Telefone é obrigatório!");
  
      if (!Membro.GENERO_VALIDOS.includes(this.genero)) {
        errors.push(`Gênero inválido! Opções: ${Membro.GENERO_VALIDOS.join(', ')}`);
      }
  
      if (!Membro.STATUS_VALIDOS.includes(this.status)) {
        errors.push(`Status inválido! Opções: ${Membro.STATUS_VALIDOS.join(', ')}`);
      }
  
      return errors;
    }
  
    toJSON() {
      return {
        id: this.id,
        nome: this.nome,
        endereco: this.endereco,
        cidade: this.cidade,
        email: this.email,
        cpf: this.cpf,
        nasc: this.nasc,
        genero: this.genero,
        telefone: this.telefone,
        status: this.status,
      };
    }
}