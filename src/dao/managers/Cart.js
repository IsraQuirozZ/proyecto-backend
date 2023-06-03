import fs from "fs";

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.init(path);
  }

  init(path) {
    let file = fs.existsSync(path);
    if (!file) {
      fs.writeFileSync(path, "[]");
      return console.log("File created");
    } else {
      this.carts = JSON.parse(fs.readFileSync(path, "utf-8"));
      return console.log("Data recovered");
    }
  }

  getCarts() {
    return this.carts;
  }

  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  async addCart() {
    try {
      let cart = { products: [] };
      if (this.carts.length > 0) {
        cart.id = this.carts.length + 1;
      } else {
        cart.id = 1;
      }
      this.carts.push(cart);
      let dataJson = JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile(this.path, dataJson);
      return 201; // cart created
    } catch (err) {
      return null; // error: creating cart
    }
  }

  async addProducts(cartId, data) {
    try {
      let cartFound = this.getCartById(cartId);
      if (!cartFound) {
        return null; // error: not found cart to update
      }

      if (
        Object.keys(data).length === 0 ||
        typeof data !== "object" ||
        data.units === 0
      ) {
        return null; // error: data is required
      }

      if (cartFound.products.length === 0) {
        cartFound.products.push(data); // Solo se ejecutará cuando el array de productos esté vacío
      } else {
        // Si ya existe el producto en el carrito
        let products = [];
        cartFound.products.forEach((product) => {
          products.push(product.pid);
        });

        if (products.includes(data.pid)) {
          // aumenta las unidades
          let productToAddUnits = cartFound.products.find(
            (product) => product.pid === data.pid
          );
          productToAddUnits.units = productToAddUnits.units + data.units;
        } else {
          // Agrega todo el producto
          cartFound.products.push(data);
        }
      }
      let dataJson = JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile(this.path, dataJson);
      return 200; // cart has been updated
    } catch (error) {
      // console.log(error);
      return null; // error: updating cart
    }
  }

  async deleteProducts(cartId, data) {
    try {
      let cartFound = this.getCartById(cartId);
      if (!cartFound) {
        return null;
      }

      let productInCart = false;
      let moreUnits = false;
      let newUnits;
      cartFound.products.forEach((product) => {
        if (product.pid === data.pid) {
          if (data.units >= product.units) {
            moreUnits = true;
            newUnits = product.units;
            cartFound.products = cartFound.products.filter(
              (product) => product.pid !== data.pid
            );
          } else {
            product.units = product.units - data.units;
          }
          productInCart = true;
        }
      });

      if (productInCart) {
        let dataJson = JSON.stringify(this.carts, null, 2);
        await fs.promises.writeFile(this.path, dataJson);
        if (moreUnits) {
          // Si mandan más unidades de las que tiene el prod
          return newUnits; // Regresamos las unidades del producto (para no aumentar el stock a más de las que tenía)
        }
        return 200; // cart has been deleted
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

async function managment() {
  let cartManager = new CartManager("./src/data/carts.json");
  await cartManager.getCarts();
  await cartManager.getCartById(3);
  await cartManager.addCart({
    products: [
      { pid: 1, quantity: 2 },
      { pid: 2, quantity: 2 },
    ],
  });
}
// managment();

let cartManager = new CartManager("./src/data/carts.json");
export default cartManager;
