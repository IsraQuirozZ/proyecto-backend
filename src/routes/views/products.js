import { Router } from "express";

const router = Router();

router.get("/products", async (req, res, next) => {
  try {
    return res.render("products", {
      title: "Products",
      products: [{ title: "1" }, { title: "2" }, { title: "3" }],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
