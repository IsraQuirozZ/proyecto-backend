import { cartService, productService } from "../service/index.js"

class CartController {

	getCart = async (req, res) => {
		try {
			let cid = req.params.cid
			let cart = await cartService.getCart(cid)
			if (cart) return res.sendSuccess(200, { cart })
			return res.sendUserError(404, { error: 'Not found' })
		} catch (error) {
			return res.sendServerError(500, error)
		}
	}

	addProducts = async (req, res) => {
		try {
			let cartId = req.params.cid;
			let productId = req.params.pid;
			let productUnits = Number(req.params.units);

			let cartFound = await cartService.getCart(cartId);
			let productFound = await productService.getProduct(productId);

			if (!cartFound || !productFound) {
				return res.sendUserError(404, { error: 'Not found' }); // error: not found cart to update
			}

			let stock = productFound.stock;
			stock >= productUnits
				// Si el stock es mayor a las unidades a agregar, le resto esas unidades al stock, de lo contrario,
				? (stock -= productUnits)
				// unidades a agregar será igual a stock para que no se agregue más de lo máximo disponible
				: ((productUnits = stock), (stock = 0));

			if (cartFound.products.length === 0) { // Si el carrito está vacio
				cartFound.products.push({ productId, productUnits }); // Le agrego el producto
			} else {
				let productsId = [];
				cartFound.products.forEach((product) => {
					productsId.push(String(product.pid));
				});

				if (productsId.includes(productId)) {
					// Si el producto ya está dentro del array
					// Aumenta las unidades
					let productToAddUnits = cartFound.products.find(
						(product) => String(product.pid) === productId
					);
					productToAddUnits.units = productToAddUnits.units + productUnits;
				} else {
					// Si no estaba en el array
					// Agrega todo el producto
					cartFound.products.push({ pid, units });
				}
			}

			const cart = await cartService.addProducts(cartId, productId, stock, cartFound);

			return res.sendSuccess({ cart }) // cart has been updated
		} catch (error) {
			console.log(error);
			return res.sendServerError(error); // error: updating cart
		}
	}

	//   deleteProducts = async (cartId, data) => {
	deleteProducts = async (req, res) => {
		try {
			let cartId = req.params.cid;
			let productId = req.params.pid;
			let productUnits = Number(req.params.units);

			let cartFound = await cartService.getCart(cartId);
			let productFound = await productService.getProduct(productId);

			let productCart = cartFound?.products.find(
				(prod) => String(prod.pid) === productId
			);

			if (!cartFound || !productFound || !productCart) {
				return res.sendUserError(404, { error: 'Not found' });
			}

			let stock = productFound.stock;

			// Si las unidades a eliminar son menores a las unidades del carrito, se restan.
			// De lo contrario, las unidades del carrito pasarían a ser 0 y se elimina el producto del carrito.
			productCart.units > productUnits
				? ((productCart.units -= productUnits), (stock += productUnits))
				: ((stock += productCart.units),
					(cartFound = {
						...cartFound,
						products: cartFound.products.filter(
							(prod) => String(prod.pid) !== productId
						),
					}));

			let cart = await cartService.deleteProducts(cartId,
				productId,
				stock,
				cartFound
			);
			return res.sendSuccess({ cart })
		} catch (error) {
			console.log(error);
			return res.sendServerError({ error });
		}
	}
}

export default new CartController()
