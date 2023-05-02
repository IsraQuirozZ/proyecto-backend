import express from "express";
import productManager from "./product-manager.js";
import cartManager from "./cart-manager.js";

const server = express();

const PORT = 8080;
const ready = () => console.log("server ready on port " + PORT);

server.listen(PORT, ready);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  return res.send("Welcome");
});

// PRODUCTS
// GET PRODUCTS (query)
server.get("/products", (req, res) => {
  let limit = req.query.limit;
  let products = productManager.getProducts().slice(0, limit);
  if (products.length > 0) {
    return res.send({ status: 200, response: products });
  } else {
    return res.send({
      status: 400,
      response: "Products not found",
    });
  }
});

// GET PRODUCT BY ID (params)
server.get("/products/:pid", (req, res) => {
  let id = Number(req.params.pid);
  let product = productManager.getProductById(id);
  if (product) {
    return res.send({ status: 200, response: product });
  } else {
    return res.send({
      status: 404,
      response: {},
    });
  }
});

//CARTS
// GET CARTS (query)
server.get("/carts", (req, res) => {
  let carts = cartManager.getCarts();
  if (carts.length > 0) {
    return res.send({ status: 200, response: carts });
  } else {
    return res.send({ status: 400, response: "Carts not found" });
  }
});

// GET CART BY ID (params)
server.get("/carts/:cid", (req, res) => {
  let id = Number(req.params.cid);
  let cart = cartManager.getCartById(id);
  if (cart) {
    return res.send({ status: 200, response: cart });
  } else {
    return res.send({ status: 404, response: {} });
  }
});
