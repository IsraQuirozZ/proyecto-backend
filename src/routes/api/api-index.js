import { Router } from "express";
// import products_router from "./products.js";
import products_router from "./products.mongo.js"; // mongo
import cart_router from "./carts.js";

const router = Router();

router.use("/products", products_router);
router.use("/carts", cart_router);

export default router;
