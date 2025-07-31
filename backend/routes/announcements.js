import express from 'express';
import Announcement from '../models/Announcement.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Create announcement (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Only admin can post announcements' });
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });
    const ann = new Announcement({ message, createdBy: user._id });
    await ann.save();
    res.status(201).json(ann);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get all announcements (newest first)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const anns = await Announcement.find({}).sort({ createdAt: -1 }).populate('createdBy', 'username');
    res.json(anns);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router; 