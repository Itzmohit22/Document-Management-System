import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileType: String,
  fileUrl: String,
  fileSize: Number,
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accessLevel: { type: String, enum: ['public', 'private'], default: 'private' },
  uploadDate: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);
