import * as Yup from "yup";
import { Op } from "sequelize";
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
          attributes: ["id", "name", "status"],
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  // Recupera um customer
  async show(req, res) {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json();
    }

    return res.json(customer);
  }

  // Cria um customer
  async create(req, res) {
    // Utilizado o Yup para validar o request.body
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      status: Yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema!" });
    }

    const customer = await Customer.create(req.body);

    return res.status(201).json(customer);
  }

  // Atualiza um customer
  async update(req, res) {
    Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      status: Yup.string().uppercase(),
    });

    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(400).json({ error: "Error on validate schema!" });
    }

    await customer.update(req.body);

    return res.status(201).json(customer);
  }

  // Exclui um customer
  async destroy(req, res) {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(400).json({ error: "Error on validate schema!" });
    }

    await customer.destroy();

    return res.json();
  }
}

export default new CustomersController();
