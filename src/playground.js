import "./database";

import { Op } from "sequelize";

import Customer from "./app/models/Customer";

class Playground {
  static async play() {
    // .findOne, .findByPk(1) select por id = 1,
    const customers = await Customer.findAll({
      //attributes: ["id", "email"],
      // attributes: { exclude: ["status", "email"] },
      // where: {
      //   id: 1,
      where: {
        [Op.or]: {
          statu: {
            [Op.in]: ["ACTIVE", "ARCHIVED"],
          },
          name: {
            [Op.like]: "Dev%",
          },
        },
        createdAt: {
          [Op.between]: [new Date(2019, 1, 1), new Date(2023, 12, 31)],
        },
      },
    });
    console.log(JSON.stringify(customers, null, 2));
  }
}

Playground.play();
