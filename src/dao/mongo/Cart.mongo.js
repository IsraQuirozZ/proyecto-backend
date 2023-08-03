import Cart from "./models/Cart.js";

class CartDao {
  constructor() {
    this.CartModel = Cart;
  }

  getCarts = async (array) => {
    return this.CartModel.aggregate(array);
  };

  getCart = async (id) => {
    return await this.CartModel.findById(id);
  };

  getCartBill = async (array) => {
    return await this.CartModel.aggregate(array);
  };

  createCart = async () => {
    return await this.CartModel.create({ products: [] });
  };

  addProduct = async (id, modifiedCart) => {
    return await this.CartModel.findByIdAndUpdate(id, modifiedCart, {
      new: true,
    });
  };

  deleteProduct = async (id, modifiedCart) => {
    return await this.CartModel.findByIdAndUpdate(id, modifiedCart, {
      new: true,
    });
  };

  deleteCart = async (id, modifiedCart) => {
    return await this.CartModel.findByIdAndUpdate(id, modifiedCart, {
      new: true,
    });
  };
}

export default CartDao;
