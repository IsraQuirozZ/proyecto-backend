import { Router } from "express";
import manager from "../../managers/Product.js";

const router = Router();

// GET PRODUCTS (QUERY)
// Posible queries --> ?limit=Number
router.get("/", (req, res, next) => {
  try {
    let limit = req.query.limit;
    let products = manager.getProducts().slice(0, limit);
    if (products.length > 0) {
      return res.send({ status: 200, response: products });
    } else {
      return res.send({
        status: 400,
        response: "Products not found",
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
    } else {
      return res.send({
        status: 404,
        response: {},
      });
    }
  } catch (error) {
    next(error);
  }
});

// ADD PRODUCT
router.post("/", async (req, res, next) => {
  try {
    let title = req.body.title ?? null;
    let description = req.body.description ?? null;
    let price = req.body.price ?? null;
    let thumbnail = req.body.thumbnail ?? null;
    let code = req.body.code ?? null;
    let stock = req.body.stock ?? null;
    if (title && description && price && thumbnail && code && stock) {
      let product = await manager.addProduct({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      return res.json({ status: 201, response: product });
    } else {
      return res.json({ status: 400, response: "all data is required" });
    }
  } catch (error) {
    next(error);
  }
});

// UPDATE PRODUCT
router.put("/:pid", (req, res, next) => {
  try {
    if (req.params.pid && Object.entries(req.body).length !== 0) {
      let id = Number(req.params.pid);
      let data = req.body;
      manager.updateProduct(id, data);
      return res.json({ status: 200, response: "updated" });
    } else {
      return res.json({ status: 400, response: "check data" });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE PRODUCT
router.delete("/:pid", (req, res, next) => {
  try {
    let id = Number(req.params.pid);
    manager.deleteProduct(id);
    return res.json({ status: 200, response: `deleted` });
  } catch (error) {
    next(error);
  }
});

export default router;
