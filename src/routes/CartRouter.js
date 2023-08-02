import MainRouter from "./Router.js";
import CartController from "../controllers/CartController.js";

const {
  getCarts,
  getCart,
  getCartBill,
  addProducts,
  deleteProduct,
  deleteCart,
} = CartController;

class CartRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getCarts); // ADMIN
    this.get("/:cid", ["PUBLIC"], getCart); // USER & ADMIN
    // El post (create de carrito) se tendrá que hacer al crear un usuario.
    this.get("/bill/:cid", ["PUBLIC"], getCartBill); // USER & ADMIN
    this.put("/:cid/product/:pid/:units", ["PUBLIC"], addProducts); // USER
    this.delete("/:cid/product/:pid/:units", ["PUBLIC"], deleteProduct); // USER
    this.delete("/:cid", ["PUBLIC"], deleteCart); // USER
  }
}

export default new CartRouter();
