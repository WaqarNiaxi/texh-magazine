import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalItems: { type: Number, default: 0 },
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
