import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password_hash: {
    type: String,
    required: true
  },
  user_type: {
    type: String,
    default: 'student'
  },
  name: {
    type: String,
    required: true
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;