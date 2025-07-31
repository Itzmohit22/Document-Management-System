import express from 'express';
import Recent from '../models/Recent.js';
import Document from '../models/Document.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

// Log a recent action (internal use)
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { documentId, action } = req.body;
    if (!['view', 'download', 'upload', 'delete'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    const recent = new Recent({
      user: req.user.id,
      document: documentId,
      action
    });
    await recent.save();
    res.status(201).json(recent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recent actions for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const recents = await Recent.find({ user: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('document');
    res.json(recents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
