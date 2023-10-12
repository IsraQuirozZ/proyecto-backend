import MainRouter from "./Router.js";
import CartController from "../controllers/CartController.js";
import validateCart from "../middlewares/validateCart.js";
import passportCall from "../middlewares/passportCall.js";

const {
  getCarts,
  getCart,
  getCartBill,
  addProduct,
  deleteProduct,
  clearCart,
  purchase,
} = CartController;

class CartRouter extends MainRouter {
  init() {
    this.get("/", ["ADMIN"], getCarts);
    this.get(
      "/:cid",
      ["USER", "ADMIN", "PREMIUM"],
      passportCall("jwt"),
      validateCart,
      getCart
    );
    this.get(
      "/bill/:cid",
      ["USER", "ADMIN", "PREMIUM"],
      passportCall("jwt"),
      validateCart,
      getCartBill
    );
    this.post(
      "/:cid/purchase",
      ["USER", "PREMIUM"],
      passportCall("jwt"),
      validateCart,
      purchase
    );
    this.put(
      "/:cid/product/:pid/:units",
      ["USER", "PREMIUM"],
      passportCall("jwt"),
      validateCart,
      addProduct
    );
    this.delete(
      "/:cid/product/:pid/:units",
      ["USER", "PREMIUM"],
      passportCall("jwt"),
      validateCart,
      deleteProduct
    );
    this.delete(
      "/:cid",
      ["USER", "PREMIUM"],
      passportCall("jwt"),
      validateCart,
      clearCart
    );
  }
}

export default new CartRouter();
