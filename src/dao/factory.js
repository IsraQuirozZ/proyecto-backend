import config from "../config/config.js";

import ProductDaoMongo from "./mongo/Product.mongo.js";
import CartDaoMongo from "./mongo/Cart.mongo.js";
import UserDaoMongo from "./mongo/User.mongo.js";

import CartDaoMemory from "./memory/Cart.js";

let ProductDao, CartDao, UserDao;

switch (config.PERSISTENCE) {
    case 'MONGO':

        ProductDao = ProductDaoMongo
        CartDao = CartDaoMongo
        UserDao = UserDaoMongo

        break;
    case 'MEMORY':

        CartDao = CartDaoMemory
        
        break

    case 'FILE':

        break;
    default:
        break;
}

export {
    ProductDao,
    CartDao,
    UserDao
}