import { Router } from "express";
import manager from "../../dao/managers/Cart.js";
import productManager from "../../dao/managers/Product.js";

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

// PUT ADD UNITS TO CART
router.put("/:cid/product/:pid/:units", async (req, res, next) => {
  try {
    let cartId = Number(req.params.cid);
    let productId = Number(req.params.pid);
    let productUnits = Number(req.params.units);

    let productFound = productManager.getProductById(productId);
    if (productFound !== undefined && productUnits <= productFound.stock) {
      let cart = await manager.addProducts(cartId, {
        pid: productId,
        units: productUnits,
      });
      if (cart === 200) {
        await productManager.updateProduct(productId, {
          stock: productFound.stock - productUnits,
        });
        return res.json({
          status: 200,
          response: `${productUnits} units of product: ${productId} added to the cart`,
        });
      }
    } else if (productFound.stock === 0) {
      return res.json({ status: 404, response: "out of stock" });
    }
    return res.json({ status: 400, response: "not enough stock" });
  } catch (error) {
    next(error);
  }
});

// DELETE UNITS FROM CART
router.delete("/:cid/product/:pid/:units", async (req, res, next) => {
  try {
    let cartId = Number(req.params.cid);
    let productId = Number(req.params.pid);
    let productUnits = Number(req.params.units);

    let productFound = productManager.getProductById(productId);
    if (productFound !== undefined && productUnits > 0) {
      let cart = await manager.deleteProducts(cartId, {
        pid: productId,
        units: productUnits,
      });

      if (cart === 200) {
        await productManager.updateProduct(productId, {
          stock: productFound.stock + productUnits,
        });
        return res.json({
          status: 200,
          response: `${productUnits} units of product: ${productId} deleted from cart: ${cartId}`,
        });
      } else if (cart !== null) {
        // Regresamos las unidades que tenía el prod con cart (número de unidades que tenía el prod)
        await productManager.updateProduct(productId, {
          stock: productFound.stock + productUnits,
        });
        return res.json({
          status: 200,
          response: `${cart} units of product: ${productId} deleted from cart: ${cartId}`,
        });
      }
    }
    return res.json({ status: 400, response: "product(s) not deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
