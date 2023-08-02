import { Router } from "express";
import SessionRouter from "./SessionRouter.js";
import UserRouter from "./UserRouter.js";
import ProductsRouter from "./ProductsRouter.js";
import CartRouter from "./CartRouter.js";
import sendMail from "../utils/sendMail.js";
// import api_router from "./api/api-index.js";

const router = Router();

router.use('/api/session', SessionRouter.getRouter())
router.use('/api/users', UserRouter.getRouter())
router.use('/api/products', ProductsRouter.getRouter())
router.use('/api/cart', CartRouter.getRouter())
router.use('/api/gmail', async (req, res) => {
    await sendMail()
    res.send('Email sended successfully')
})
// router.use("/api", api_router);
export default router;
