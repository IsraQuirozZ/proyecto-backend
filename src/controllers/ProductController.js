import { productService } from "../service/index.js";

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
      res.sendServerError(error);
    }
  };

  getProduct = async (req, res) => {
    try {
      let id = req.params.id;
      let product = await productService.getProduct(id);
      if (product) {
        return res.sendSuccess(200, { product });
      } else {
        return res.sendUserError(404, { error: "Not found" });
      }
    } catch (error) {
      res.sendServerError(500, error);
    }
  };

  createProduct = async (req, res) => {
    try {
      let productData = req.body;
      let newProduct = await productService.createProduct(productData);
      return res.sendSuccess(201, {
        response: `product "${newProduct._id}" created`,
      });
    } catch (error) {
      res.sendServerError(error);
    }
  };

  updateProduct = async (req, res) => {
    try {
      let id = req.params.id;
      let productData = req.body;
      let response;
      if (Object.entries(productData).length !== 0) {
        let product = await productService.updateProduct(id, productData);
        if (product) {
          response = product;
        } else {
          return res.sendUserError(404, { response: "Product not found" });
        }
      } else {
        response = "There's nothing to update";
      }
      return res.sendSuccess(200, response);
    } catch (error) {
      res.sendServerError(error);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      let id = req.params.id;
      let product = await productService.deleteProduct(id);
      if (product) {
        return res.sendSuccess(200, {
          response: `Product '${product._id}' deleted`,
        });
      } else {
        return res.sendUserError(404, { response: "Product not found" });
      }
    } catch (error) {
      res.sendServerError(error);
    }
  };
}

export default new ProductController();
