import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Document from '../models/Document.js';
import User from '../models/User.js';
import Recent from '../models/Recent.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
// Set file size limit (5MB for all file types)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max for any file
});

// Upload document
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { title, description, accessLevel } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    // Check file count limit (max 20 files per user)
    const user = await User.findById(req.user.id);
    const userFileCount = await Document.countDocuments({ uploader: user._id });
    if (userFileCount >= 20) {
      return res.status(400).json({ message: 'Upload limit reached: Max 20 files allowed per user.' });
    }
    // File type check
    const ext = file.originalname.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif'];
    const docTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip'];
    const videoTypes = ['mp4', 'mov', 'avi', 'mkv'];
    let resourceType = 'auto';
    let maxSize = 5 * 1024 * 1024; // 5MB for all files
    if (videoTypes.includes(ext)) {
      resourceType = 'video';
      maxSize = 25 * 1024 * 1024; // 25MB for videos
    }
    if (file.size > maxSize) {
      return res.status(400).json({ message: `File too large! Max allowed size is 5MB for all file types.` });
    }
    // Upload to Cloudinary with correct resource_type
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: resourceType }, async (error, result) => {
      if (error) return res.status(500).json({ message: 'Cloudinary error', error });
      const doc = new Document({
        title,
        description,
        fileType: ext,
        fileUrl: result.secure_url,
        fileSize: file.size,
        uploader: user._id,
        accessLevel,
      });
      await doc.save();
      // Log upload to recents
      try {
        await Recent.create({ user: user._id, document: doc._id, action: 'upload' });
      } catch (e) { /* ignore logging errors */ }
      res.status(201).json(doc);
    });
    uploadStream.end(file.buffer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get all documents (only user's own, unless admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let docs;
    if (user.role === 'admin') {
      docs = await Document.find({}).sort({ uploadDate: -1 });
    } else {
      docs = await Document.find({ uploader: user._id }).sort({ uploadDate: -1 });
    }
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    // Only uploader or admin can delete
    if (doc.uploader.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }
    await doc.deleteOne();
    // Log delete to recents
    try {
      await Recent.create({ user: user._id, document: doc._id, action: 'delete' });
    } catch (e) { /* ignore logging errors */ }
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
