import { model, Schema } from "mongoose";

let collection = "carts";

let schema = new Schema({
  products: { type: Array, required: true }
});

let Cart = model(collection, schema);

export default Cart;
