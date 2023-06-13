import Cart from '../models/Cart.js'
import Product from '../models/Product.js';

class CartManager {

	async addProducts(cartId, data) {
		try {
			let cartFound = await Cart.findById(cartId);
			let productFound = await Product.findById(data.pid);

			if (!cartFound && !productFound) {
				return 404; // error: not found cart to update
			}

			if (
				Object.keys(data).length === 0 ||
				typeof data !== "object" ||
				data.units === 0
			) {
				return 400; // error: data is required
			}

			let stock = productFound.stock;

			stock >= data.units 
				? stock -= data.units 
				: (data.units = stock,
					stock = 0); // Si el stock es mayor a las unidades a agregar, le resto las unidades, de lo contrario, le seteo stock a units para que no se agregue más de lo máximo disponible 

			if (cartFound.products.length === 0) {
				cartFound.products.push(data); // Solo se ejecutará cuando el array de productos esté vacío

			} else { // Si ya existen productos en el carrito

				let products = [];
				cartFound.products.forEach((product) => {
					products.push(product.pid);
				});

				if (products.includes(data.pid)) { // Si el producto ya está dentro del array 
					// Aumenta las unidades
					let productToAddUnits = cartFound.products.find(
						(product) => product.pid === data.pid
					);
					productToAddUnits.units = productToAddUnits.units + data.units;
				} else { // Si no estaba en el array
					// Agrega todo el producto
					cartFound.products.push(data);
				}
			}

			await Cart.findByIdAndUpdate(cartId, {products: cartFound.products})
			await Product.findByIdAndUpdate(data.pid, {stock})

			return 200; // cart has been updated
		} catch (error) {
			console.log(error);
			return 500; // error: updating cart
		}
	}

	async deleteProducts(cartId, data) {
		try {
			let cartFound = await Cart.findById(cartId);
			if (!cartFound) {
				return 404;
			}

			let productCart = cartFound.products.find(prod => prod.pid === data.pid)
			if (!productCart) {
				return 404
			}

			const product = await Product.findById(data.pid)
			let stock = product.stock

			productCart.units > data.units 
				? (productCart.units -= data.units,
					stock += data.units)
				: (stock += productCart.units,
					cartFound = {...cartFound, products: cartFound.products.filter(prod => prod.pid !== data.pid)}) // Si las unidades a eliminar son menores a las unidades añadidas, se restan. De lo contrario, las unidades pasarían a ser 0, entonces se elimina el producto del carrito.
			
			await Cart.findByIdAndUpdate(cartId, {products: cartFound.products})
			await Product.findByIdAndUpdate(data.pid, {stock})
			return 200
		} catch (error) {
			console.log(error);
			return 500;
		}
	}
}

let cartManager = new CartManager();
export default cartManager;
