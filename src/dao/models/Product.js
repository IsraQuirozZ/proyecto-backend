import { model, Schema } from "mongoose";

let collection = "products";

let schema = new Schema({
  name: { type: String, required: true, unique: true }, // unique?
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ["Lightning", "Wall Deco", "Accesories", "Textile", "Art", "Nature", "Furniture"] },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true }, // investigar como hacer para tener las imágenes
  stock: { type: Number, default: 25 },
  rating: { type: Number, default: 0 },
});

let Product = model(collection, schema);

export default Product;
