class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getCarts = async (array) => {
    return await this.dao.getCarts(array);
  };

  getCart = async (id) => {
    return await this.dao.getCart(id);
  };

  getCartBill = async (array) => {
    return this.dao.getCartBill(array);
  };

  createCart = async () => {
    return this.dao.createCart();
  };

  addProduct = async (id, modifiedCart) => {
    return await this.dao.addProduct(id, modifiedCart);
  };

  deleteProduct = async (id, modifiedCart) => {
    return await this.dao.deleteProduct(id, modifiedCart);
  };

  deleteCart = async (id, modifiedCart) => {
    return await this.dao.deleteCart(id, modifiedCart);
  };
  purchase = async (date, amount, purchaser) => {
    return await this.dao.purchase(date, amount, purchaser);
  }
}

export default CartRepository;
