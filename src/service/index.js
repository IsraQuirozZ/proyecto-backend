import ProductDao from "../dao/mongo/Product.mongo.js";
import CartDao from "../dao/mongo/Cart.mongo.js";
import UserDao from "../dao/mongo/User.mongo.js";

const productService = new ProductDao()
const cartService = new CartDao()
const userService = new UserDao()

export { productService, cartService, userService }