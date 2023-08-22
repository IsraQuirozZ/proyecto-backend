import { Router } from "express";
import SessionRouter from "./SessionRouter.js";
import UserRouter from "./UserRouter.js";
import ProductsRouter from "./ProductsRouter.js";
import CartRouter from "./CartRouter.js";
import sendMail from "../utils/sendMail.js";
import MockingRouter from "./MockingRouter.js";
import { logger } from "../utils/logger.js";

const router = Router();

router.use("/api/session", SessionRouter.getRouter());
router.use("/api/users", UserRouter.getRouter());
router.use("/api/products", ProductsRouter.getRouter());
router.use("/api/cart", CartRouter.getRouter());
router.use("/api/mocking", MockingRouter.getRouter());
router.use("/loggertest", (req, res) => {
  logger.debug("debug");
  logger.http("http");
  logger.info("info");
  logger.warning("warning");
  logger.error("error");
  logger.fatal("fatal");
  res.send("Complete test");
});
router.use("/api/gmail", async (req, res) => {
  await sendMail();
  res.send("Email sended successfully");
});

export default router;
