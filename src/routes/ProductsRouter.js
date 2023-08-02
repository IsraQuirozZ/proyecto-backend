import MainRouter from "./Router.js";
import ProductController from "../controllers/ProductController.js";

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } =
  ProductController;

class ProductsRouter extends MainRouter {
  init() {
    this.get("/", ["PUBLIC"], getProducts);
    this.get("/:id", ["PUBLIC"], getProduct);
    this.post("/", ["ADMIN"], createProduct);
    this.put("/:id", ["ADMIN"], updateProduct);
    this.delete("/:id", ["ADMIN"], deleteProduct);
  }
}

export default new ProductsRouter();
