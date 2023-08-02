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

  addProducts = async (id, modifiedCart) => {
    return await this.dao.addProducts(id, modifiedCart);
  };

  deleteProduct = async (id, modifiedCart) => {
    return await this.dao.deleteProduct(id, modifiedCart);
  };

  deleteCart = async (id, modifiedCart) => {
    return await this.dao.deleteCart(id, modifiedCart);
  };
}

export default CartRepository;
