import { Router } from "express";
import manager from "../../managers/Product.js";

const router = Router();

// let socket = io();

// GET PRODUCTS (QUERY)
// Posible queries --> ?limit=Number
router.get("/", async (req, res, next) => {
  try {
    let limit = req.query.limit;
    let products = await manager.getProducts().slice(0, limit);
    if (products.length > 0) {
      // socket.emit("products", products);
      return res.send({
        status: 200,
        response: products,
      });
    } else {
      return res.send({
        status: 400,
        response: "not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET PRODUCT BY ID (PARAMS)
router.get("/:pid", (req, res, next) => {
  try {
    let id = Number(req.params.pid);
    let product = manager.getProductById(id);
    if (product) {
      return res.send({ status: 200, response: product });
    }
    return res.send({ status: 404, response: "not found" });
  } catch (error) {
    next(error);
  }
});

// ADD PRODUCT
router.post("/", async (req, res, next) => {
  try {
    let product = await manager.addProduct(req.body);
    if (product === 201) {
      return res.json({ status: 201, response: "product created" });
    } else {
      return res.json({ status: 400, response: "not created" });
    }
  } catch (error) {
    next(error);
  }
});

// UPDATE PRODUCT
router.put("/:pid", async (req, res, next) => {
  try {
    if (req.params.pid && Object.entries(req.body).length !== 0) {
      let id = Number(req.params.pid);
      let data = req.body;
      let product = await manager.updateProduct(id, data);
      if (product === 200) {
        return res.json({ status: 200, response: "product updated" });
      }
    }
    return res.json({ status: 400, response: "not updated" });
  } catch (error) {
    next(error);
  }
});

// DELETE PRODUCT
router.delete("/:pid", async (req, res, next) => {
  try {
    let id = Number(req.params.pid);
    let product = await manager.deleteProduct(id);
    if (product === 200) {
      return res.json({ status: 200, response: `product deleted` });
    }
    return res.json({ status: 400, response: `not found product to delete` });
  } catch (error) {
    next(error);
  }
});

export default router;
