module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "postgres",
  database: "master",
  define: {
    timestamp: true, //cria duas colunas: createdAt e updatedAt
    underscored: true, //nomenclatura_(não camelCase) mas por _(underline)
    underscoredAll: true,
  },
};
