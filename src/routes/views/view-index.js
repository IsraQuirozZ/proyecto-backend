import { Router } from "express";
import newProduct_router from "./newProduct.js";
import products_router from "./products.js";
import cart_router from "./cart.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    return res.render("index", {
      title: "Home",
    });
  } catch (error) {
    next(error);
  }
});

router.use("/", newProduct_router);
router.use("/", products_router);
router.use("/", cart_router);

export default router;
