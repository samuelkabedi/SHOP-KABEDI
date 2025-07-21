import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
  const user = new User(req.body);
  const saved = await user.save();
  res.status(201).json(saved);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isMatch = user && await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ user, token });
});

export default router;