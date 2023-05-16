import { Router } from "express";

const router = Router();

router.get("/new-product", async (req, res, next) => {
  try {
    return res.render("newProduct", {
      title: "Add new product",
      script: "/public/src/newProduct.js",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
