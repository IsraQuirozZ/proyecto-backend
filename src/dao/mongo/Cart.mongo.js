import Cart from "./models/Cart.js";
import Product from "./models/Product.js";
import Ticket from "./models/Ticket.js";

class CartDao {
  constructor() {
    this.CartModel = Cart
    this.ProductModel = Product
    this.TicketModel = Ticket
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

  addProducts = async (id, modifiedCart) => {
    // await Product.findByIdAndUpdate(pid, { stock });

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

  purchase = async (date, amount, purchaser) => {
    return await this.TicketModel.create(date, amount, purchaser);
  }
}

export default CartDao;
