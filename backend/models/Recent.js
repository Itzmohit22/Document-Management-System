import mongoose from 'mongoose';

const recentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  action: { type: String, enum: ['view', 'download', 'upload', 'delete'], required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Recent', recentSchema);
