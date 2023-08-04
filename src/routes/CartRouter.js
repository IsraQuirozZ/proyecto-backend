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
  purchase,
} = CartController;

class CartRouter extends MainRouter {
  init() {
    this.get("/", ["ADMIN"], getCarts);
    this.get("/bill/:cid", ["USER", "ADMIN"], getCartBill);
    // El post (create de carrito) se tendrá que hacer al crear un usuario.
    // this.post("/", ["PUBLIC"], createCart);
    this.delete("/:cid", ["PUBLIC"], deleteCart); // USER
    this.get("/:cid", ["USER"], getCart);
    this.post("/:cid/purchase", ["USER", "ADMIN"], purchase);
    this.put("/:cid/product/:pid/:units", ["USER"], addProduct);
    this.delete("/:cid/product/:pid/:units", ["USER"], deleteProduct);
  }
}

export default new CartRouter();
