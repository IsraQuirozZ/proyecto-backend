import { productService } from "../service/index.js";
import CustomError from "../middlewares/error/CustomError.js";
import {
  productCreationErrorInfo,
  non_existentProductErrorInfo,
} from "../middlewares/error/generateProductInfo.js";
import EError from "../middlewares/error/enum.js";
import { logger } from "../utils/logger.js";
import sendMail from "../utils/sendMail.js";

class ProductController {
  getProducts = async (req, res) => {
    try {
      let page = req.query.page ?? 1;
      let limit = req.query.limit ?? 6;
      let name = req.query.name
        ? new RegExp(req.query.name, "i")
        : new RegExp("");

      let products = await productService.getProducts(name, limit, page);

      if (products) {
        return res.sendSuccess(200, { products });
      }
      return res.sendUserError(404, { error: "Not found products" });
    } catch (error) {
      logger.error(error);
      res.sendServerError(error);
    }
  };

  getProduct = async (req, res) => {
    try {
      let id = req.params.pid;
      let product = await productService.getProduct(id);
      if (product) {
        return res.sendSuccess(200, { product });
      } else {
        return res.sendUserError(404, { error: "Not found" });
      }
    } catch (error) {
      logger.error(error);
      res.sendServerError(500, error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      let { name, description, category, price, thumbnail, stock, rating } =
        req.body;
      if (!name || !description || !category || !price || !thumbnail) {
        CustomError.createError({
          name: "Product creation error",
          cause: productCreationErrorInfo({
            name,
            description,
            category,
            price,
            thumbnail,
          }),
          message: "Error trying to create product",
          code: EError.INVALID_TYPE_ERROR,
        });
      }
      let newProduct = await productService.createProduct({
        name,
        description,
        category,
        price,
        thumbnail,
        stock,
        rating,
        owner: req.user.email,
      });
      return res.sendSuccess(201, {
        response: newProduct,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      let id = req.params.pid;
      let product = await productService.getProduct(id);
      let productData = req.body;
      let user = req.user;
      let response;

      if (!product) return res.sendUserError(400, "The product doesnt exist");

      if (Object.entries(productData).length !== 0) {
        if (user.role === "admin" || user.email === product.owner) {
          let updatedProduct = await productService.updateProduct(
            id,
            productData
          );
          if (updatedProduct) {
            response = { updatedProduct };
          } else {
            CustomError.createError({
              name: "Product update error",
              cause: non_existentProductErrorInfo(id),
              message: "Error trying to update the product",
              code: EError.DATABASE_ERROR,
            });
          }
        } else {
          return res.sendUserError(
            400,
            "You do not have the credentials to modify this product"
          );
        }
      } else {
        response = "There's nothing to update";
      }
      return res.sendSuccess(200, response);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      let id = req.params.pid;
      let user = req.user;
      let product = await productService.getProduct(id);

      if (!product) return res.sendUserError(400, "The product doesnt exist");

      if (user.role === "admin" || user.email === product.owner) {
        await productService.deleteProduct(id);
        if (product.owner !== "admin") {
          sendMail(
            product.owner,
            "Your product was deleted",
            `
                <p>The product "${product.name}" has been deleted.</p>
              `
          );
        }
        return res.sendSuccess(200, `Product '${product._id}' deleted`);
      } else {
        return res.sendUserError(
          400,
          "You do not have the credentials to delete this product"
        );
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}

export default new ProductController();
