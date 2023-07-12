import "dotenv/config";

module.exports = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamp: true, //cria duas colunas: createdAt e updatedAt
    underscored: true, //nomenclatura_(não camelCase) mas por _(underline)
    underscoredAll: true,
  },
};
