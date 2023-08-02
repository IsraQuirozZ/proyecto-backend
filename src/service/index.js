import { ProductDao } from "../dao/factory.js";
import CartDao from "../dao/mongo/Cart.mongo.js";
import UserDao from "../dao/mongo/User.mongo.js";
import ProductRepository from "../repositories/Product.repository.js";
import CartRepository from "../repositories/Cart.repository.js";

const productService = new ProductRepository(new ProductDao());
const cartService = new CartRepository(new CartDao())
const userService = new UserDao()

export { productService, cartService, userService }