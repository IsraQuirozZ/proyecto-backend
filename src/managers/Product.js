import fs from "fs";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
    this.init(path);
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
    return this.products;
  }

  getProductById(productId) {
    return this.products.find((product) => product.id === productId);
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      let codes = [];
      // Validar que todos los campos sean obligatorios
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return 400; // error: all fields are required
      } else {
        let product = { title, description, price, thumbnail, code, stock };
        // Id autoincrementable
        if (this.products.length > 0) {
          let lastProduct = this.products[this.products.length - 1];
          product.id = lastProduct.id + 1;
        } else {
          product.id = 1;
        }
        // Códigos repetidos no se agregan
        this.products.forEach((prod) => codes.push(prod["code"]));
        if (!codes.includes(product.code)) {
          this.products.push(product);
          let dataJson = JSON.stringify(this.products, null, 2);
          await fs.promises.writeFile(this.path, dataJson);
          return 201; // product created
        } else {
          return 409; // error: repeated code
        }
      }
    } catch (err) {
      return 500;
    }
  }

  async updateProduct(productId, data) {
    try {
      let productFound = this.getProductById(productId);
      if (!productFound) {
        return null; // error: not found user to update;
      }
      // Verificar si la data no está vacía
      if (Object.keys(data).length === 0 || typeof data !== "object") {
        return null; // error: data is required
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
            return null; // error: you can't modify the "${prop}" of a product
          } else {
            return null; // error: "${prop}" is not a property of product
          }
        }
        productFound[prop] = data[prop];
      }
      let dataJson = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, dataJson);
      return 200; // The product has been updated
    } catch (err) {
      // console.log(err);
      return null; // error: creating product
    }
  }

  async deleteProduct(productId) {
    try {
      let productFound = this.getProductById(productId);
      if (!productFound) {
        return null; // "error: not found user to delete";
      }
      this.products = this.products.filter((prod) => prod.id !== productId);
      let dataJson = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, dataJson);
      return 200; // `The product has been deleted`;
    } catch (err) {
      // console.log(err);
      return null; // error: creating product
    }
  }
}

let productManager = new ProductManager("./src/data/products.json");

export default productManager;
