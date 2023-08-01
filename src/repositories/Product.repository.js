class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getProducts = async () => {
        return await this.dao.getProducts();
    }

	getProduct = async id => {
        return await this.dao.getProduct(id);
    }

	createProduct = async productData => {
        return await this.dao.createProduct(productData);
    }

	updateProduct = async (id, productData) => {
        return await this.dao.updateProduct(id, productData);
    }

	deleteProduct = async id => {
        return await this.dao.deleteProduct(id);
    }

}

export default ProductRepository