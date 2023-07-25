import MainRouter from "./Router.js";
import CartController from "../controllers/CartController.js";

const { getCart, addProducts, deleteProducts } = CartController

class CartRouter extends MainRouter {
    init() {
        this.get('/:cid', getCart)
        this.put('/:cid/product/:pid/:units', addProducts)
        this.put('/:cid/product/:pid/:units', deleteProducts)
    }
}

export default new CartRouter()