import { Router } from "express";
import manager from "../../managers/Cart.js";
import productManager from "../../managers/Product.js";

const router = Router();

// GET CARTS
router.get("/", (req, res, next) => {
  try {
    let carts = manager.getCarts();
    if (carts.length > 0) {
      return res.send({ status: 200, response: carts });
    }
    return res.send({ status: 400, response: "carts not found" });
  } catch (error) {
    next(error);
  }
});

// GET CART BY ID (query)
router.get("/:cid", (req, res, next) => {
  try {
    let id = Number(req.params.cid);
    let cart = manager.getCartById(id);
    if (cart) {
      return res.json({ status: 200, response: cart });
    }
    return res.json({ status: 200, response: "cart not found" });
  } catch (error) {
    next(error);
  }
});

// POST ADD EMPTY CART
router.post("/", async (req, res, next) => {
  try {
    let cart = await manager.addCart();
    if (cart === 201) {
      return res.json({ status: 201, response: "cart created" });
    }
    return res.json({ status: 400, response: "cart not created" });
  } catch (error) {
    next(error);
  }
});

// PUT UPDATE CART
router.put("/:cid/product/:pid/:units", async (req, res, next) => {
  let cartId = Number(req.params.cid);
  let productId = Number(req.params.pid);
  let productUnits = Number(req.params.units);

  let foundProduct = productManager.getProductById(productId);
  if (foundProduct !== undefined && productUnits <= foundProduct.stock) {
    let cart = await manager.updateCart(cartId, {
      pid: productId,
      units: productUnits,
    });
    if (cart === 200) {
      await productManager.updateProduct(productId, {
        stock: foundProduct.stock - productUnits,
      });
      return res.json({ status: 200, response: "cart updated" });
    }
  } else if (foundProduct.stock === 0) {
    return res.json({ status: 404, response: "out of stock" });
  }
  return res.json({ status: 400, response: "cart not updated" });
});

export default router;
