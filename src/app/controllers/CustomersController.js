import Customer from "../models/Customer";

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
    const data = await Customer.findAll({
      limit: 1000,
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
