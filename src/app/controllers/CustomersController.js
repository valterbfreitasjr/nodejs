import { Op, where } from "sequelize";
import { parseISO } from "date-fns";

import Customer from "../models/Customer";
import Contact from "./../models/Contact";

const customers = [
  { id: 1, name: "Dev Samurai", site: "https://devsamurai.com.br" },
  { id: 2, name: "Dev Juninho", site: "https://devjuninho.com.br" },
  { id: 3, name: "Dev Goku", site: "https://devgoku.com.br" },
  { id: 4, name: "Dev Naruto", site: "https://narutodeveloper.com.br" },
  { id: 5, name: "Google", site: "https://google.com.br" },
  { id: 6, name: "UOL", site: "https://uol.com.br" },
  { id: 7, name: "Terra", site: "https://terra.com" },
];

class CustomersController {
  // List dos customers
  async index(req, res) {
    const {
      name,
      email,
      status,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 25;

    let where = {};
    let order = [];

    if (name) {
      where = {
        ...where,
        name: {
          [Op.iLike]: name,
        },
      };
    }

    if (email) {
      where = {
        ...where,
        email: {
          [Op.iLike]: email,
        },
      };
    }

    //[Op.in]: ["ARCHIVED"] ou ["ACTIVE"] --- localhost:3000/customers?status=active,archived
    if (status) {
      where = {
        ...where,
        status: {
          [Op.in]: status.split(",").map((item) => item.toUpperCase()),
        },
      };
    }

    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdBefore),
        },
      };
    }

    if (createdAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(createdAfter),
        },
      };
    }

    if (updatedBefore) {
      where = {
        ...where,
        updatedAt: {
          [Op.gte]: parseISO(updatedBefore),
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where,
        updatedAt: {
          [Op.lte]: parseISO(updatedAfter),
        },
      };
    }

    //localhost:3000/customers?sort=id:desc,name
    if (sort) {
      order = sort.split(",").map((item) => item.split(":"));
    }

    const data = await Customer.findAll({
      where,
      include: [
        {
          model: Contact,
          attributes: ["id", "status"],
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  // Recupera um customer
  show(req, res) {
    const id = parseInt(req.params.id, 10);
    const customer = customers.find((item) => item.id === id);
    const status = customer ? 200 : 404;

    console.warn("GET :: /customers/:id", JSON.stringify(customer));

    return res.status(status).json(customer);
  }

  // Cria um customer
  create(req, res) {
    const { nome, site } = req.body;
    const id = customers[customers.length - 1].id + 1;

    const newCustomer = { id, nome, site };
    customers.push(newCustomer);

    return res.status(201).json(newCustomer);
  }

  // Atualiza um customer
  update(req, res) {
    const id = parseInt(req.params.id, 10);
    const { name, site } = req.body;

    const index = customers.find((item) => item.id === id);
    const status = index >= 0 ? 200 : 404;

    if (index >= 0) {
      customers[index] = { id: parseInt(id, 10), name, site };
    }

    return res.status(status).json(customers[index]);
  }

  // Exclui um customer
  destroy(req, res) {
    const id = parseInt(req.params.id, 10);
    const index = customers.find((item) => item.id === id);
    const status = index >= 0 ? 200 : 404;

    if (index >= 0) {
      customers.splice(index, 1);
    }

    return res.status(status).json();
  }
}

export default new CustomersController();
