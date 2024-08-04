import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Username: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Country: { type: String, required: true },
  Password: { type: String, required: true },
  role: { type: String, default: 'user' },
  created_at: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
