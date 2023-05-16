import { Router } from "express";
import productManager from "../../managers/Product.js";

const router = Router();

router.get("/products", async (req, res, next) => {
  try {
    return res.render("products", {
      title: "Products",
      products: await productManager.getProducts(),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/products/:pid", async (req, res, next) => {
  try {
    let id = Number(req.params.pid);
    await fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        res.render("productDetail", {
          title: `Product ${data.response.id}`,
          product: data.status === 200 ? data.response : null,
          script: "/public/scripts/product.js",
        });
      });
  } catch (error) {
    next(error);
  }
});

export default router;
