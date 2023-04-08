class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    console.log(this.products);
    return this.products;
  }

  getProductById(productId) {
    let foundedProduct = this.products.find(
      (product) => product.id === productId
    );
    if (foundedProduct) {
      console.log(foundedProduct);
    } else {
      console.log(`Product ${productId} not founded.`);
    }
    return foundedProduct;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    let id;
    let codes = [];
    // Validar que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("All fields are required");
    } else {
      // Id autoincrementable
      if (!this.products.length) {
        id = 1;
      } else {
        let lastProduct = this.products[this.products.length - 1];
        id = lastProduct.id + 1;
      }
      this.products.forEach((prod) => codes.push(prod["code"]));
      let product = { title, description, price, thumbnail, code, stock, id };
      // Códigos repetidos no se agregan
      if (codes.includes(product.code)) {
        console.log(
          `Product ${product.id} will not be added because it has an existing code:  ${product.code}.`
        );
      } else {
        this.products.push(product);
      }
    }
  }
}

let product = new ProductManager();

product.addProduct({
  title: "Producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

product.addProduct({
  title: "Producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc124",
  stock: 25,
});

// Este producto no se agrega
product.addProduct({
  title: "Producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

product.getProducts();
product.getProductById(3);
