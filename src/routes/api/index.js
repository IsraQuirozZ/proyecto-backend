import { Router } from "express";
import product_router from "./products.js";
// import cart_router from './carts.js'

const router = Router();

router.use("/products", product_router);
// router.use("/carts",cart_router)

export default router;
