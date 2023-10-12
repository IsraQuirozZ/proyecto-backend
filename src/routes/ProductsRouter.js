import MainRouter from "./Router.js";
import ProductController from "../controllers/ProductController.js";

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } =
  ProductController;

class ProductsRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getProducts);
    this.get("/:pid", ["PUBLIC"], getProduct);
    this.post("/", ["ADMIN", "PREMIUM"], createProduct);
    this.put("/:pid", ["ADMIN", "PREMIUM"], updateProduct);
    this.delete("/:pid", ["ADMIN", "PREMIUM"], deleteProduct);
  }
}

export default new ProductsRouter();
