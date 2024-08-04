import mongoose from 'mongoose';

const reportSchema = mongoose.Schema({
  reported_by: { type: String, required: true },
  reported_by_id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  altitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  picture: { type: String, required: true },
  state: { type: String, required: true },
  pickedup_by: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

export { Report };
