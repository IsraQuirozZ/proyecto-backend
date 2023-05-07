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
    console.log("- Get Carts");
    if (this.carts.length > 0) {
      console.log(this.carts);
    } else {
      console.log("error: Not found");
    }
    return this.carts;
  }

  getCartById(cartId) {
    console.log("- Get Cart By Id");
    let cartFound = this.carts.find((cart) => cart.id === cartId);
    if (cartFound) {
      console.log(cartFound);
    } else {
      console.log(`Product with Id: ${cartId} not found.`);
    }
    return cartFound;
  }

  async addCart({ products }) {
    try {
      console.log("- Add cart:");
      if (!products || typeof products !== "object") {
        console.log("error: Chack the data...");
        return "error: Chack the data...";
      } else {
        let cart = { products }; // products: [{pid, qty},{pid, qty}]
        if (this.carts.length > 0) {
          let lastCart = this.carts[this.carts.length - 1];
          cart.id = lastCart.id + 1;
        } else {
          cart.id = 1;
        }
        this.carts.push(cart);
        let dataJson = JSON.stringify(this.carts, null, 2);
        await fs.promises.writeFile(this.path, dataJson);
        console.log("The cart has been added");
        console.log(`Cart: ${cart.id} added`);
        return cart.id;
      }
    } catch (err) {
      console.log(err);
      return console.log("error: creating cart");
    }
  }
}

async function managment() {
  let cartManager = new CartManager("../data/carts.json");
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
