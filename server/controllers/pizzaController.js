const Pizza = require("../models/pizzaModel");

module.exports = {
  getPizzas: async (req, res) => {
    try {
      const { price, search } = req.body;
      const pizzas = await Pizza.find({
        price: { $gte: price[0], $lte: price[1] },
        name: { $regex: search, $options: "i" },
      });
      return res.json(pizzas);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ msg: err.message });
    }
  },
};
