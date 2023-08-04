import MainRouter from "./Router.js";
import CartController from "../controllers/CartController.js";
import validateCart from "../middlewares/validateCart.js";
import passportCall from "../middlewares/passportCall.js";

const {
  getCarts,
  getCart,
  getCartBill,
  addProduct,
  // createCart,
  deleteProduct,
  clearCart,
  purchase,
} = CartController;

class CartRouter extends MainRouter {
  init() {
    this.get("/", ["ADMIN"], getCarts);
    this.get(
      "/bill/:cid",
      ["USER", "ADMIN"],
      passportCall("jwt"),
      validateCart,
      getCartBill
    );
    // El post (create de carrito) se tendrá que hacer al crear un usuario.
    // this.post("/", ["PUBLIC"], createCart);
    this.delete("/:cid", ["PUBLIC"], clearCart); // USER
    this.get("/:cid", ["USER"], passportCall("jwt"), validateCart, getCart);
    this.post(
      "/:cid/purchase",
      ["USER", "ADMIN"],
      passportCall("jwt"),
      validateCart,
      purchase
    );
    this.put(
      "/:cid/product/:pid/:units",
      ["USER"],
      passportCall("jwt"),
      validateCart,
      addProduct
    );
    this.put(
      "/:cid/product/:pid/:units",
      ["USER"],
      passportCall("jwt"),
      validateCart,
      deleteProduct
    );
  }
}

export default new CartRouter();
