import "./database";

import { Op } from "sequelize";

import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";

class Playground {
  static async play() {
    // Create
    // const customer = await Customer.create({
    //   name: "Valter Jr",
    //   email: "valterbjr@mail.com.br",
    // });
    // Update
    const customer = await Customer.findByPk(1);
    console.log(
      "Antes: ----------------------- ",
      JSON.stringify(customer, null, 2)
    );

    const newCustomer = await customer.update({ status: "ACTIVE" });
    console.log(
      "Depois: ----------------------- ",
      JSON.stringify(newCustomer, null, 2)
    );
  }
}

// class Playground {
//   static async play() {
//     // .findOne, .findByPk(1) select por id = 1,
//     const customers = await Customer.findAll({
//       //attributes: ["id", "email"],
//       // attributes: { exclude: ["status", "email"] },
//       // where: {
//       //   id: 1,
//       include: [
//         {
//           model: Contact,
//           where: {
//             status: "ACTIVE",
//           },
//           required: false, //Irá produzir o 'LEFT JOIN'
//         },
//       ],
//       where: {
//         [Op.or]: {
//           status: {
//             [Op.in]: ["ACTIVE", "ARCHIVED"],
//           },
//           name: {
//             [Op.like]: "Dev%",
//           },
//         },
//         createdAt: {
//           [Op.between]: [new Date(2019, 1, 1), new Date(2023, 12, 31)],
//         },
//       },
//       order: ["name"], //[["name", "DESC"], ["createdAt"]]
//       limit: 25,
//       offset: 2 * 1 - 2, // limit * página - limit     **página 1, 2, 3 ou 4....
//     });
//     console.log(JSON.stringify(customers, null, 2));
//   }
// }

Playground.play();
