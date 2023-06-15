import fetch from "node-fetch";
import { Router } from "express";
import Product from "../../dao/models/Product.js";

const router = Router();

router.get("/carts", async (req, res, next) => {
  try {
    await fetch(`http://localhost:8080/api/carts/647f9a508af5814325d1e75a`)
      .then((res) => res.json())
      .then(async (data) => {
        let cartProducts = data.response.products;
        let products = [];
        for (let product of cartProducts) {
          products.push({
            id: product.pid,
            product: await Product.findById(product.pid),
            units: product.units,
          });
        }
        let totalProducts = 0;
        let totalPrice = 0;
        products.forEach((item) => {
          item.price = item.product.price * item.units;
          totalProducts = totalProducts + item.units;
          totalPrice = totalPrice + item.price;
        });
        console.log(products);
        return res.render("cart", {
          title: "Carrito",
          products: products,
          totalProducts: totalProducts,
          totalPrice: totalPrice,
          script: "/public/scripts/cart.js",
        });
      });
  } catch (error) {}
});

export default router;
