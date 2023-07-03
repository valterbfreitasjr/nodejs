import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";

import Contact from "./../models/Contact";
import Customer from "../models/Customer";

class ContactController {
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

    let where = { customer_id: req.params.customerId };
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

    const data = await Contact.findAll({
      where,
      include: [
        {
          model: Customer,
          attributes: ["id", "status"],
          required: true, // inner join
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
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      // include: [Customer], //Irá retornar o customer também.
      attributes: { exclude: ["customer_id", "customerId"] },
    });

    if (!contact) {
      return res.status(404).json();
    }

    return res.json(contact);
  }

  // Cria um customer
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      status: Yup.string().uppercase(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Error on validate schema!" });
    }

    const contact = await Contact.create({
      customer_id: req.params.customerId,
      ...req.body,
    });

    return res.status(201).json(contact);
  }

  // Atualiza um customer
  async update(req, res) {
    Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      status: Yup.string().uppercase(),
    });

    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      // include: [Customer], //Irá retornar o customer também.
      attributes: { exclude: ["customer_id", "customerId"] },
    });

    if (!contact) {
      return res.status(400).json({ error: "Error on validate schema!" });
    }

    await contact.update(req.body);

    return res.status(201).json(contact);
  }

  // Exclui um customer
  async destroy(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
    });

    if (!contact) {
      return res.status(400).json({ error: "Error on validate schema!" });
    }

    await contact.destroy();

    return res.status(201).json();
  }
}

export default new ContactController();
