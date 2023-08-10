import { Router } from "express";
import SessionRouter from "./SessionRouter.js";
import UserRouter from "./UserRouter.js";
import ProductsRouter from "./ProductsRouter.js";
import CartRouter from "./CartRouter.js";
import sendMail from "../utils/sendMail.js";
import generateProduct from "../utils/mocks/generateProduct.js";

const router = Router();

router.use("/api/session", SessionRouter.getRouter());
router.use("/api/users", UserRouter.getRouter());
router.use("/api/products", ProductsRouter.getRouter());
router.use("/api/cart", CartRouter.getRouter());
router.use("/api/mockingProducts", async (req, res) => {
  let products = []
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct()); 
  }
  res.send(products);
});
router.use("/api/gmail", async (req, res) => {
  await sendMail();
  res.send("Email sended successfully");
});
// router.use('/api/logger', async (req, res) => {
//   req.logger.error('error - ' + Date().toLocaleString());
//   res.send('logger registred');
// })

export default router;
