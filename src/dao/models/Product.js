import { model, Schema } from "mongoose";

let collection = "products";

let schema = new Schema({
  name: { type: String, required: true }, // unique?
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true }, // investigar como hacer para tener las imágenes
  code: { type: String, required: true, unique: true }, // Lo quitamos?
  stock: { type: Number, required: true },
  rating: { type: Number, default: 0 }, // required?
});

let Product = model(collection, schema);

export default Product;
