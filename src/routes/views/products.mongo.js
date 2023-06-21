import fetch from "node-fetch";
import { Router } from "express";

const router = Router();

router.get("/products", async (req, res, next) => {
  try {
    await fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        return res.render("products", {
          title: "Products",
          products: data.success ? data.response : null,
        });
      });
  } catch (error) {
    next(error);
  }
});

router.get("/products/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    await fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        return res.render("productDetail", {
          title: `${data.response.name}`,
          product: data.success ? data.response : null,
          script: "/public/scripts/product.js",
        });
      });
  } catch (error) {
    next(error);
  }
});

export default router;
