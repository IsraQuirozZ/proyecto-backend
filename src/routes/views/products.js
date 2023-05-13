import { Router } from "express";
import products_api_router from "../api/products.js";

const router = Router();

async function getProducts() {
  return await fetch("http://localhost:8080/api/products")
    .then((res) => res.json())
    .then((data) => data.response);
}

router.get("/products", async (req, res, next) => {
  try {
    return res.render("products", {
      title: "Products",
      products: await fetch("http://localhost:8080/api/products")
        .then((res) => res.json())
        .then((data) => data.response),
    });
  } catch (error) {
    next(error);
  }
});

// {
//   "title": "Producto 1",
//   "description": "Este es un producto prueba",
//   "price": 200,
//   "thumbnail": "Sin imagen",
//   "code": "abc123",
//   "stock": 25,
//   "id": 1
// },

export default router;
