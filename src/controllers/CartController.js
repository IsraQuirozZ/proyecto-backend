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
        return res.sendSuccess(200, cart);
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

  addProducts = async (req, res) => {
    try {
      let cartId = req.params.cid;
      let productId = req.params.pid;
      let units = Number(req.params.units);

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

      //   if (cartFound.products.length === 0) {
      //     cartFound.products.push({ pid: productId, units });
      //   }
      if (cartFound.products.length !== 0) {
        /* Check if a product with the given `productId` already exists in the
        `cartFound.products` array. */
        let productsId = [];
        cartFound.products.forEach((product) => {
          productsId.push(String(product.pid));
        });
        if (productsId.includes(productId)) {
          /* Increases units of a existing product. */
          let productToAddUnits = cartFound.products.find(
            (product) => String(product.pid) === productId
          );
          productToAddUnits.units = productToAddUnits.units + units;
        } else if (stock !== 0) {
          cartFound.products.push({ pid: productId, units });
        }
      }

      let cart = await cartService.addProducts(cartId, {
        products: cartFound.products,
      });
      // Esto no se agrega ya que solo descontará las unidades cuando se realice la compra
      //   await this.productService.updateProduct(productId, { stock });
      return res.sendSuccess(200, cart);
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
      return res.sendSuccess(200, cart);
    } catch (error) {
      console.log(error);
      return res.sendServerError(500, error);
    }
  };

  deleteCart = async (req, res) => {
    try {
      let cartId = req.params.cid;
      let cartFound = await cartService.getCart(cartId);

      if (!cartFound) {
        return res.sendUserError(404, "Not found cart");
      }

      let cart = await cartService.deleteCart(cartId, { products: [] });

      return res.sendSuccess(200, cart);
    } catch (error) {
      console.log(error);
      return res.sendServerError(500, error);
    }
  };
}

export default new CartController();
