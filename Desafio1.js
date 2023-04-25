const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./data/products.json";
    this.init(this.path);
  }

  init(path) {
    let file = fs.existsSync(path);
    if (!file) {
      fs.writeFileSync(path, "[]");
      return console.log("File created");
    } else {
      this.products = JSON.parse(fs.readFileSync(path, "utf-8"));
      return console.log("Data recovered");
    }
  }

  getProducts() {
    console.log("- Get products:");
    console.log(this.products);
    return this.products;
  }

  getProductById(productId) {
    let productFound = this.products.find(
      (product) => product.id === productId
    );
    if (productFound) {
      console.log("- Get Product by Id: ");
      console.log(productFound);
    } else {
      console.log("- Get Product by Id: ");
      console.log(`Product with Id: ${productId} not found.`);
    }
    return productFound;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    let id;
    let codes = [];
    // Validar que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("- Add Product:");
      console.log("error: all fields are required");
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
      if (!codes.includes(product.code)) {
        this.products.push(product);
        let dataJson = JSON.stringify(this.products, null, 2);
        fs.promises
          .writeFile(this.path, dataJson)
          .then((res) => console.log("- Add Product:"))
          .then((res) => console.log(`Product #${product.id} added`))
          .catch((err) => console.log(err));
      } else {
        console.log("- Add Product:");
        console.log(
          `We can't add this product because it has a repeated code: ${product.code}`
        );
      }
    }
  }

  updateProduct(productId, data) {
    let productFound = this.getProductById(productId);
    if (!productFound) {
      console.log("- Update Product:");
      console.log("error: not found user to update");
      return "error: not found user to update";
    }

    // Verificar si la data no está vacía
    if (Object.keys(data).length === 0 || typeof data !== "object") {
      console.log("- Update Product:");
      console.log("error: data is required");
      return "error: data is required";
    }

    for (let prop in data) {
      //Verificar que la propiedad pertenece al objeto (propiedad que exista)
      for (let prop in data) {
        if (
          prop === "title" ||
          prop === "description" ||
          prop === "price" ||
          prop === "thumbnail" ||
          prop === "stock"
        ) {
        } else if (prop === "code" || prop === "id") {
          console.log("- Update Product:");
          console.log(`error: you can't modify the ${prop} of a product`);
          return `error: you can't modify the ${prop} of a product`;
        } else {
          console.log("- Update Product:");
          console.log(`error: "${prop}" is not a property of product`);
          return `error: "${prop}" is not a property of product`;
        }
      }
      productFound[prop] = data[prop];
    }

    let dataJson = JSON.stringify(this.products, null, 2);
    fs.promises
      .writeFile(this.path, dataJson)
      .then((res) => console.log("- Update Product:"))
      .then((res) => console.log(`Updated product: ${productFound.id}`))
      .then((res) => console.log(productFound))
      .catch((err) => console.log(err));
  }

  deleteProduct(productId) {
    let productFound = this.getProductById(productId);

    if (!productFound) {
      console.log("error: not found user to delete");
      return "error: not found user to delete";
    } else {
      this.products = this.products.filter(
        (prod) => prod.id !== productFound.id
      );
      let dataJson = JSON.stringify(this.products, null, 2);
      fs.promises
        .writeFile(this.path, dataJson)
        .then((res) => {
          console.log(
            `The product with id: ${productId} has been deleted successfully`
          );
        })
        .catch((err) => console.log(err));
    }
  }
}

let product = new ProductManager();
// Se creará el archivo JSON con un array vacío

// product.getProducts(); // Array vacío

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

product.getProductById(1); // Objeto anterior
product.getProductById(3); // Error (no existe el producto con id 3)
// product.updateProduct(1, { title: "Producto actualizado" }); // Actualizará el producto con id 1
// product.deleteProduct(2); // Se eliminará el producto y el archivo JSON quedará vacío
