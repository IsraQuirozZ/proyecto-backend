import express from "express";
import manager from "./product-manager.js";

const server = express();

const PORT = 8080;
const ready = () => console.log("server ready on port " + PORT);

server.listen(PORT, ready);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  return res.send("Welcome");
});

// GET PRODUCTS (query)
server.get("/products", (req, res) => {
  let limit = req.query.limit;
  let products = manager.getProducts().slice(0, limit);
  if (products.length > 0) {
    return res.send(products);
  } else {
    return res.send({
      status: 400,
      message: "Products not found",
    });
  }
});

// GET PRODUCT BY ID (params)
server.get("/products/:pid", (req, res) => {
  let id = Number(req.params.pid);
  let product = manager.getProductById(id);
  if (product) {
    return res.send(product);
  } else {
    return res.send({
      status: 404,
      message: `product with id: ${id} not found`,
    });
  }
});
