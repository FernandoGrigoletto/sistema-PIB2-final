class Membro {
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

  // Validações básicas

  validate() {
    const errors = [];

    if (!this.nome || this.nome.trim().length === 0) {
      errors.push("Nome é obrigatório!");
    }

    if (!this.endereco || this.endereco.trim().length === 0) {
      errors.push("Endereço é obrigatório!");
    }

    if (!this.cidade || this.cidade.trim().length === 0) {
      errors.push("Cidade é obrigatório!");
    }

    if (!this.email || this.email.trim().length === 0) {
      errors.push("Email é obrigatório!");
    }

    if (!this.cpf || this.cpf.trim().length === 0) {
      errors.push("CPF é obrigatório!");
    }

    if (!this.nasc || this.nasc.trim().length === 0) {
      errors.push("Data de Nascimento é obrigatória!");
    }

    const validGenero = ["Masculino", "Feminino"];

    if (!validGenero.includes(this.genero)) {
      errors.push("Gênero inválido!");
    }

    if (!this.telefone || this.telefone.trim().length === 0) {
      errors.push("Telefone é obrigatório!");
    }

    const validStatus = ["Ativo", "Inativo", "Ausente", "Visitante"];

    if (!validStatus.includes(this.status)) {
      errors.push("Status inválido!");
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

module.exports = Membro;
