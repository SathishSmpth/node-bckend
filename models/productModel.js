const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required!"],
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  image: {
    type: Array,
    required: [true, "Image is required!"],
  },
  createdBy: {
    type: String,
    required: [true, "Created by is required!"],
  },
});

ProductSchema.set("timestamps", true);

const Products = mongoose.model("products", ProductSchema);

module.exports = Products;
