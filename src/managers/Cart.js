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

  // Solo tiene que crear un carrito vacío, se modificará más adelante con un método put
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

  async updateCart(cartId, data) {
    try {
      let cartFound = this.getCartById(cartId);
      if (!cartFound) {
        return null; // error: not found cart to update
      }
      // Verificar si la data no está vacía
      if (
        Object.keys(data).length === 0 ||
        typeof data !== "object" ||
        data.units === 0
      ) {
        return null; // error: data is required
      }

      // Si es el mismo producto subir el stock (no agregar el mismo producto)
      console.log(cartFound.products);
      // console.log(cartFound.products[units]);
      cartFound.products.push(data);
      let dataJson = JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile(this.path, dataJson);
      return 200; // cart has been updated
    } catch (error) {
      // console.log(error);
      return null; // error: updating cart
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
