import { cartService, productService } from "../service/index.js";
import { Types } from "mongoose";

class CartController {
  getCarts = async (req, res) => {
    try {
      let carts = await cartService.getCarts([
        {
          $lookup: {
            from: "products", // Colección
            localField: "products.pid", // Campo de la colección
            foreignField: "_id", // Campo de la colección que debo buscar
            as: "productsPopulated", // Nombre
          },
        },
        {
          $unwind: {
            path: "$productsPopulated",
            preserveNullAndEmptyArrays: true,
          },
        }, // Desagrega el arreglo del lookup, y agrega aquellos que están vacíos
        { $sort: { "productsPopulated.name": 1 } },
        {
          $group: {
            _id: "$_id",
            products: {
              $push: {
                pid: "$productsPopulated",
                units: {
                  $arrayElemAt: [
                    "$products.units",
                    {
                      $indexOfArray: [
                        "$products.pid",
                        "$productsPopulated._id",
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      ]);

      if (carts.length > 0) {
        return res.sendSuccess(200, { carts });
      }

      return res.sendUserError(404, "Not found carts");
    } catch (error) {
      return res.sendServerError(500, error);
    }
  };

  getCart = async (req, res) => {
    try {
      let id = req.params.cid;
      let cart = await cartService.getCart(id);
      if (cart) {
        return res.sendSuccess(200, { cart });
      }
      return res.sendUserError(404, "Not found cart");
    } catch (error) {
      return res.sendServerError(500, error);
    }
  };

  getCartBill = async (req, res) => {
    try {
      let id = req.params.cid;
      let cart = await cartService.getCartBill([
        { $match: { _id: new Types.ObjectId(id) } }, // filtro por id carrito
        { $unwind: "$products" },
        {
          $lookup: {
            from: "products",
            localField: "products.pid",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 0,
            total: {
              $multiply: ["$products.units", "$product.price"],
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]);
      if (cart) {
        return res.sendSuccess(200, { cart });
      }
      return res.sendUserError(404, "Not found cart");
    } catch (error) {
      return res.sendServerError(500, error);
    }
  };

  createCart = async (req, res) => {
    try {
      let cart = await cartService.createCart();
      return res.sendSuccess(200, { cart });
    } catch (error) {
      console.log(error);
      return res.sendServerError(500, error);
    }
  };

  addProduct = async (req, res) => {
    try {
      let cartId = req.params.cid;
      let productId = req.params.pid;
      let units = Number(req.params.units) || 0;

      let cartFound = await cartService.getCart(cartId);
      let productFound = await productService.getProduct(productId);

      if (!cartFound || !productFound) {
        let response = cartFound ? "Not found Product" : "Not found Cart";
        return res.sendUserError(404, response);
      }

      /* Check if the stock of a product is greater than or equal to the units to be added to the cart 
      and subtracted to the product stock. */
      let stock = productFound.stock;
      stock >= units ? (stock -= units) : ((units = stock), (stock = 0));

      let cart;
      if (cartFound.products.length === 0 && units !== 0) {
        cartFound.products.push({ pid: productId, units });
      } else if (units === 0) {
        cart = await cartService.addProduct(cartId, {
          products: cartFound.products,
        });
      } else {
        let productsId = [];
        cartFound.products.forEach((product) => {
          productsId.push(String(product.pid));
        });
        /* Check if a product with the given `productId` already exists in the
        `cartFound.products` array. */
        if (!productsId.includes(productId) && units !== 0) {
          cartFound.products.push({ pid: productId, units });
        } else {
          /* Increases units of a existing product. */
          let productToAddUnits = cartFound.products.find(
            (product) => String(product.pid) === productId
          );
          if (productToAddUnits.units + units < productFound.stock) {
            productToAddUnits.units = productToAddUnits.units + units;
          } else if (productToAddUnits.units + units === productFound.stock) {
            productToAddUnits.units = productFound.stock;
          } else {
            productToAddUnits.units = productFound.stock;
          }
        }
      }

      cart = await cartService.addProduct(cartId, {
        products: cartFound.products,
      });
      // Esto no se agrega ya que solo descontará las unidades cuando se realice la compra
      //   await this.productService.updateProduct(productId, { stock });
      return res.sendSuccess(200, { cart });
    } catch (error) {
      return res.sendServerError(500, error); // error: updating cart
    }
  };

  deleteProduct = async (req, res) => {
    try {
      let cartId = req.params.cid;
      let productId = req.params.pid;
      let units = Number(req.params.units);

      let cartFound = await cartService.getCart(cartId);
      let productFound = await productService.getProduct(productId);
      let productInCart = cartFound.products.find(
        (product) => String(product.pid) === productId
      );

      //   if (!cartFound || !productFound || !productInCart) {
      //     return res.sendUserError(400, "Not found");
      //   }
      if (!cartFound) {
        return res.sendUserError(400, "Not found cart");
      }
      if (!productFound) {
        return res.sendUserError(400, "Not found product");
      }
      if (!productInCart) {
        return res.sendUserError(400, "Not found product in cart");
      }

      let stock = productFound.stock;
      /* Check if the stock of a product is greater than or equal to the units to be added to the cart 
      and subtracted to the product stock. */
      productInCart.units > units
        ? ((productInCart.units -= units), (stock += units))
        : ((stock += units),
          (cartFound = {
            ...cartFound,
            products: cartFound.products.filter(
              (product) => String(product.pid) !== productId
            ),
          }));

      let cart = await cartService.deleteProduct(cartId, {
        products: cartFound.products,
      });
      // Esto no se agrega ya que el stock no se modifica a menos que  se realice la compra
      //   await productService.updateProduct(productId, { stock });
      return res.sendSuccess(200, { cart });
    } catch (error) {
      console.log(error);
      return res.sendServerError(500, error);
    }
  };

  clearCart = async (req, res) => {
    try {
      let cartId = req.params.cid;
      let cartFound = await cartService.getCart(cartId);

      if (!cartFound) {
        return res.sendUserError(404, "Not found cart");
      }

      let cart = await cartService.clearCart(cartId, { products: [] });

      return res.sendSuccess(200, { cart });
    } catch (error) {
      console.log(error);
      return res.sendServerError(500, error);
    }
  };

  purchase = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getCart(cartId);

      if (!cart) {
        return res.sendUserError(404, { error: "Cart not found" });
      }

      if (cart.products.length < 1) {
        return res.sendUserError(400, "No products found");
      }

      let outOfStockProducts = [];
      let availableProducts = [];
      let amount = 0;

      for (const cartProduct of cart.products) {
        const product = await productService.getProduct(cartProduct.pid);

        if (cartProduct.units > product.stock) {
          outOfStockProducts.push(cartProduct);
        } else {
          availableProducts.push(product);
          amount += product.price * cartProduct.units;

          product.stock -= cartProduct.units;
          await product.save();

          cart.products = cart.products.filter(
            (product) => product.pid !== cartProduct.pid
          );
          await cart.save();
        }
      }

      const date = new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      const ticket = await cartService.purchase(
        formattedDate,
        amount,
        req.user.email
      );

      return res.sendSuccess(201, {
        ticket,
        purchasedItems: availableProducts,
        outOfStockProducts,
      });
    } catch (error) {
      console.log(error);
      return res.sendServerError(500, error);
    }
  };
}

export default new CartController();
