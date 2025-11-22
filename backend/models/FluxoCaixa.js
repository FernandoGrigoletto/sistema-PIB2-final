const { DataTypes } = require("sequelize");
const sequelize = require("../db.js");
const Categoria = require("./Categoria.js");

const FluxoCaixa = sequelize.define("FluxoCaixa", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM("entrada", "saida"),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: "fluxo_caixa",
  timestamps: true,
  createdAt: "criado_em",
  updatedAt: false,
});

// Relacionamento
FluxoCaixa.belongsTo(Categoria, { foreignKey: "categoria_id", as: "categoria" });

module.exports = FluxoCaixa;
