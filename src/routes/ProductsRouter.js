import MainRouter from "./Router.js";
import Product from "../dao/models/Product.js";

class ProductsRouter extends MainRouter {
	init() {
		this.get('/', ['PUBLIC'], async (req, res) => {
			try {
				let page = req.query.page ?? 1;
				let limit = req.query.limit ?? 6;
				let name = req.query.name
					? new RegExp(req.query.name, 'i')
					: new RegExp('');

				let products = await Product.paginate({ name }, { limit, page });

				if (products) {
					return res.sendSuccess(200, { products });
				} else { return res.sendUserError({ error: 'Not found' }); }
			} catch (error) {
				res.sendServerError(error)
			}
		})
		this.get('/:id', ['PUBLIC'], async (req, res) => {
			try {
				let id = req.params.id;
				let product = await Product.findById(id);
				if (product) {
					return res.sendSuccess({ product })
				} else {
					return res.sendUserError({ error: 'Not found' });
				}
			} catch (error) {
				res.sendServerError(error)
			}
		})
		this.post('/', ['ADMIN'], async (req, res) => {
			try {
				let productData = req.body;
				let newProduct = await Product.create(productData);
				return res.sendSuccess({ message: `product "${newProduct._id}" created` });
			} catch (error) {
				res.sendServerError(error);
			}
		})
		this.put('/:id', ['ADMIN'], async (req, res) => {
			try {
				let id = req.params.id;
				let productData = req.body;
				let response;
				if (Object.entries(productData).length !== 0) {
					let product = await Product.findByIdAndUpdate(id, productData, {
						new: true,
					});
					if (product) { response = product;
					} else { return res.sendUserError({ response: 'Product not found' });	}
				} else {
					response = "There's nothing to update";
				}
				return res.sendSuccess({ response });
			} catch (error) {
				res.sendServerError(error)
			}
		} )
		this.delete('/:id', ['ADMIN'], async (req, res) => {
			try {
				let id = req.params.id;
				let product = await Product.findByIdAndDelete(id);
				if (product) {
					return res.sendSuccess({ response: `Product '${product._id}' deleted` });
				} else {
					return res.sendUserError({ response: 'Product not found' });
				}	
			} catch (error) {
				res.sendServerError(error)
			
			}
		})
	}
}

export default new ProductsRouter()
