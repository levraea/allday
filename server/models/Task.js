import mongoose from 'mongoose'

export const PRIORITIES = ['high', 'medium', 'low']
export const STATUSES = ['open', 'completed']

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: PRIORITIES, default: 'medium' },
    dueDate: { type: Date, default: null },
    status: { type: String, enum: STATUSES, default: 'open' },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
