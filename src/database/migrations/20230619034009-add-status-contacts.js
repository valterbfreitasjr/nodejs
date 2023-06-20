"use strict";

const { query } = require("express");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("contacts", "status", {
      type: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      //Irá remover a coluna
      await queryInterface.removeColumn("contacts", "status", { transaction });
      //Irá remover o type criado pela ENUM enum_contacts_status.
      await queryInterface.sequelize.query("DROP TYPE enum_contacts_status", {
        transaction,
      });
    });
  },
};
