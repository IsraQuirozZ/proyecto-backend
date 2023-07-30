import MainRouter from "./Router.js";
import CartController from "../controllers/CartController.js";

const { getCart, addProducts, deleteProducts } = CartController

class CartRouter extends MainRouter {
    init() {
        this.get('/:cid', ['USER'], getCart)
        this.put('/:cid/product/:pid/:units', ['USER'], addProducts)
        this.put('/:cid/product/:pid/:units', ['USER'], deleteProducts)
    }
}

export default new CartRouter()