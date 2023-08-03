import MainRouter from "./Router.js";
import CartController from "../controllers/CartController.js";

const { getCart, addProduct, deleteProduct, deleteAllProducts, purchase } = CartController

class CartRouter extends MainRouter {
    init() {
        this.get('/:cid', ['USER'], getCart)
        this.post('/:cid/purchase', ['USER'], purchase)
        this.put('/:cid/product/:pid/:units', ['USER'], addProduct)
        this.put('/:cid/product/:pid/:units', ['USER'], deleteProduct)
        this.delete('/:cid/clear', ['USER'], deleteAllProducts)
    }
}

export default new CartRouter();
