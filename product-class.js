const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path; // Ruta que pasamos por parámetro de la clase
    this.init(path); // Para iniciar instancia
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
      console.log(`- Get Product by Id (${productFound.id}): `);
      console.log(productFound);
    } else {
      console.log(`- Get Product by Id (${productId}): `);
      console.log(`Product with Id: ${productId} not found.`);
    }
    return productFound;
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      let codes = [];
      // Validar que todos los campos sean obligatorios
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("- Add Product:");
        console.log("error: all fields are required");
        return "error: all fields are required";
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
          console.log(`- Add Product (${product.id}):`);
          console.log(`The product has been added`);
          return `The product has been added`;
        } else {
          console.log("- Add Product:");
          console.log(
            `We can't add this product because it has a repeated code: ${product.code}`
          );
          return `We can't add this product because it has a repeated code: ${product.code}`;
        }
      }
    } catch (err) {
      console.log(err);
      return "error: creating product";
    }
  }

  async updateProduct(productId, data) {
    try {
      // let productFound = this.getProductById(productId); Lo utilizaremos después
      let productFound = this.products.find((prod) => prod.id === productId); // Mientras utilizaremos esto para simplificar la consola
      if (!productFound) {
        console.log(`- Update Product (${productId}):`);
        console.log("error: not found user to update");
        return "error: not found user to update";
      }

      // Verificar si la data no está vacía
      if (Object.keys(data).length === 0 || typeof data !== "object") {
        console.log(`- Update Product (${productId}):`);
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
            console.log(`- Update Product (${productId}):`);
            console.log(`error: you can't modify the "${prop}" of a product`);
            return `error: you can't modify the "${prop}" of a product`;
          } else {
            console.log(`- Update Product (${productId}):`);
            console.log(`error: "${prop}" is not a property of product`);
            return `error: "${prop}" is not a property of product`;
          }
        }
        productFound[prop] = data[prop];
      }

      let dataJson = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, dataJson);
      console.log(`- Update Product (${productId}):`);
      console.log(productFound);
      console.log(`The product has been updated`);
      return `The product has been updated`;
    } catch (err) {
      console.log(err);
      return "error: creating product";
    }
  }

  async deleteProduct(productId) {
    try {
      //  let productFound = this.getProductById(productId);
      let productFound = this.products.find((prod) => prod.id === productId);
      if (!productFound) {
        console.log(`Delete Product (${productId}):`);
        console.log("error: not found user to delete");
        return "error: not found user to delete";
      } else {
        this.products = this.products.filter((prod) => prod.id !== productId);
        let dataJson = JSON.stringify(this.products, null, 2);
        await fs.promises.writeFile(this.path, dataJson);
        console.log(`Delete Product (${productId}):`);
        console.log(`The product has been deleted`);
        return `The product has been deleted`;
      }
    } catch (err) {
      console.log(err);
      return "error: creating product";
    }
  }
}

async function manager() {
  let product = new ProductManager("./data/products.json");

  await product.getProducts();

  await product.addProduct({
    title: "Producto 1",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });

  await product.addProduct({
    title: "Producto 2",
    description: "Este es un producto prueba",
    price: 220,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25,
  });

  await product.addProduct({
    title: "Producto 3",
    description: "Este es un producto prueba",
    price: 230,
    thumbnail: "Sin imagen",
    code: "abc125",
    stock: 25,
  });

  await product.getProductById(1); // Objeto anterior
  await product.getProductById(4); // Error (no existe el producto con id 4)
  await product.updateProduct(3, { title: "Producto 3 actualizado" }); // Actualizará el producto con id 3
  await product.deleteProduct(3); // Se eliminará el producto y el archivo JSON quedará con producto 1 y 2
}

manager();
