import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

let collection = "products";

let schema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Lightning",
      "Wall Deco",
      "Accessories",
      "Textile",
      "Art",
      "Nature",
      "Furniture",
    ],
  },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true }, // investigar como hacer para tener las imágenes
  stock: { type: Number, default: 25 },
  rating: { type: Number, default: 0 },
});

schema.plugin(mongoosePaginate);

let Product = model(collection, schema);

export default Product;
