import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  brand: String,
  category: String,
  price: Number,
  countInStock: Number
}, { timestamps: true });

export default mongoose.model('Product', productSchema);