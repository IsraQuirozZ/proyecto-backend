import MainRouter from "./Router.js";
import CartController from "../controllers/CartController.js";

const {
  getCarts,
  getCart,
  getCartBill,
  addProduct,
  // createCart,
  deleteProduct,
  deleteCart,
} = CartController;

class CartRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getCarts); // ADMIN
    this.get("/:cid", ["PUBLIC"], getCart); // USER & ADMIN
    this.get("/bill/:cid", ["PUBLIC"], getCartBill); // USER & ADMIN
    // El post (create de carrito) se tendrá que hacer al crear un usuario.
    // this.post("/", ["PUBLIC"], createCart);
    this.put("/:cid/product/:pid/:units", ["PUBLIC"], addProduct); // USER
    this.delete("/:cid/product/:pid/:units", ["PUBLIC"], deleteProduct); // USER
    this.delete("/:cid", ["PUBLIC"], deleteCart); // USER
  }
}

export default new CartRouter();
