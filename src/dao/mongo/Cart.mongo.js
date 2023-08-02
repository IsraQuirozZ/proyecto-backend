import Cart from "./models/Cart.js";
import Product from "./models/Product.js";
import Ticket from "./models/Ticket.js";

class CartDao {
  constructor() {
    this.CartModel = Cart
    this.ProductModel = Product
    this.TicketModel = Ticket
  }

  getCart = async cid => {
    return await this.CartModel.findById(cid)
  }

  addProduct = async (cid, pid, stock, modifiedCart) => {
    await this.ProductModel.findByIdAndUpdate(pid, { stock });

    return await this.CartModel.findByIdAndUpdate(
      cid,
      {
        modifiedCart,
      },
      { new: true }
    );
  }

  async deleteProduct(cid, pid, stock, modifiedCart) {
    await this.ProductModel.findByIdAndUpdate(pid, { stock });
    return await this.CartModel.findByIdAndUpdate(cid, modifiedCart);
  }

  purchase = async (date, amount, purchaser) => {
    return await this.TicketModel.create(date, amount, purchaser);
  }
}

export default CartDao;
