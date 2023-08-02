class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getCart = async id => {
        return await this.dao.getCart(id);
    }
    addProduct = async (cid, pid, stock, modifiedCart) => {
        return await this.dao.addProduct(cid, pid, stock, modifiedCart);
    }
    deleteProduct = async (cid, pid, stock, modifiedCart) => {
        return await this.dao.deleteProduct(cid, pid, stock, modifiedCart);
    }
    purchase = async (date, amount, purchaser) => {
        return await this.dao.purchase(date, amount, purchaser);
    }
}

export default CartRepository;