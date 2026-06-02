// ──────────────────────────────────────────────────────
// Application Model
// ──────────────────────────────────────────────────────
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Intern reference is required'],
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: [true, 'Internship reference is required'],
    },
    coverLetter: {
      type: String,
      maxlength: [1000, 'Cover letter cannot exceed 1000 characters'],
      default: '',
    },
    resume: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    reviewNote: {
      type: String,
      maxlength: [500, 'Review note cannot exceed 500 characters'],
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ── Compound index: Prevent duplicate applications ──
applicationSchema.index({ intern: 1, internship: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ internship: 1 });

export default mongoose.model('Application', applicationSchema);
