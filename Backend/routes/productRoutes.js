import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.status(201).json(savedProduct);
});

export default router;