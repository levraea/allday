import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
