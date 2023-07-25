import Cart from "./models/Cart.js";
import Product from "./models/Product.js";

class CartDao {
  constructor() {
    this.CartModel = Cart
  }

  getCart = async cid => {
    return await this.CartModel.findById(cid)
  }

  addProducts = async (cid, pid, stock, modifiedCart) => {
    await Product.findByIdAndUpdate(pid, { stock });

    return await this.CartModel.findByIdAndUpdate(
      cid,
      {
        modifiedCart,
      },
      { new: true }
    );
  }

  async deleteProducts(cid, pid, stock, modifiedCart) {
    await Product.findByIdAndUpdate(pid, { stock });
    return await this.CartModel.findByIdAndUpdate(cid, modifiedCart);
  }
}

export default CartDao;
