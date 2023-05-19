import { Router } from "express";
import productManager from "../../managers/Product.js";
import fetch from "node-fetch";

const router = Router();

router.get("/carts", async (req, res, next) => {
  try {
    await fetch(`http://localhost:8080/api/carts/1`)
      .then((res) => res.json())
      .then((data) => {
        let cartProducts = data.response.products;
        let products = [];
        cartProducts.forEach((product) => {
          products.push({
            product: productManager.getProductById(product.pid),
            units: product.units,
          });
        });
        let totalProducts = 0;
        let totalPrice = 0;
        products.forEach((item) => {
          item.price = item.product.price * item.units;
          totalProducts = totalProducts + item.units;
          totalPrice = totalPrice + item.price;
        });
        return res.render("cart", {
          title: "Carrito",
          products: products,
          totalProducts: totalProducts,
          totalPrice: totalPrice,
          script: "/public/scripts/cart.js",
        });
      });
  } catch (error) {
    next(error);
  }
});

export default router;
