import config from "../config/config.js";

// import ProductDaoMongo from "./mongo/Product.mongo.js";
// import CartDaoMongo from "./mongo/Cart.mongo.js";
// import UserDaoMongo from "./mongo/User.mongo.js";

// import CartDaoMemory from "./memory/Cart.js";

let ProductDao, CartDao, UserDao;

switch (config.PERSISTENCE) {
  case "MONGO":
    const { default: ProductDaoMongo } = await import(
      "./mongo/Product.mongo.js"
    );
    const { default: CartDaoMongo } = await import("./mongo/Cart.mongo.js");
    const { default: UserDaoMongo } = await import("./mongo/User.mongo.js");

    ProductDao = ProductDaoMongo;
    CartDao = CartDaoMongo;
    UserDao = UserDaoMongo;

    break;
  case "MEMORY":
    const { default: CartDaoMemory } = await import("./memory/Cart.js");
    CartDao = CartDaoMemory;

    break;

  case "FILE":
    break;
  default:
    break;
}

export { ProductDao, CartDao, UserDao };
