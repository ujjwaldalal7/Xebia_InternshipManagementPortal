// ──────────────────────────────────────────────────────
// Task Model
// ──────────────────────────────────────────────────────
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: [true, 'Internship reference is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned intern is required'],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigner (mentor) is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'submitted', 'reviewed', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    submission: {
      text: { type: String, default: '' },
      attachments: [
        {
          url: { type: String },
          publicId: { type: String },
          filename: { type: String },
        },
      ],
      submittedAt: { type: Date },
    },
    grade: {
      score: { type: Number, min: 0, max: 100 },
      feedback: { type: String, default: '' },
      gradedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ──
taskSchema.index({ internship: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });

export default mongoose.model('Task', taskSchema);
