import { Router } from "express";
import Cart from "../../dao/models/Cart.js";
import cartManager from "../../dao/managers/Cart.mongo.js";

const router = Router()

router.get("/", async (req, res, next) => {
	try {
		let carts = await Cart.find();
		if (carts.length > 0) {
			return res.status(200).json({ success: true, response: carts });
		}
		return res.status(400).json({ success: false, response: "carts not found" });
	} catch (error) {
		next(error);
	}
});

router.get("/:cid", async (req, res, next) => {
  try {
    let id = req.params.cid;
    let cart = await Cart.findById(id);
    if (cart) {
      return res.status(200).json({ success: true, response: cart });
    }
    return res.status(400).json({ success: false, response: "cart not found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let cart = await Cart.create({products: []}); // Add empty cart
		return res.status(201).json(
			{ success: true, 
				response: `cart created with ID ${cart._id}` 
			});
  } catch (error) {
    next(error);
  }
});

router.put("/:cid/product/:pid/:units", async (req, res, next) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let productUnits = Number(req.params.units);
    
		let response = await cartManager.addProducts(cartId, {pid: productId, units: productUnits})

		if (response === 200) {
      return res.status(200).json({ success: true, response: 'Updated'})
    } else if (response === 404) {
      return res.status(404).json({ success: false, response: 'Check ids'})
    } else if (response === 400) {
      return res.status(400).json({ success: false, response: 'Data required'})
    } else if (response === 500) {
      return res.status(500).json({ success: false, response: 'Internal server error'})
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:cid/product/:pid/:units", async (req, res, next) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let productUnits = Number(req.params.units);

    console.log(productId)

    let response = await cartManager.deleteProducts(cartId, {pid: productId, units: productUnits})

    if (response === 200) {
      return res.status(200).json({ success: true, response: 'Updated'})
    } else if (response === 404) {
      return res.status(404).json({ success: false, response: 'Check ids'})
    } else if (response === 500) {
      return res.status(500).json({ success: false, response: 'Internal server error'})
    }

    return res.json({ status: 400, response: "product(s) not deleted" });
  } catch (error) {
    next(error);
  }
});

export default router