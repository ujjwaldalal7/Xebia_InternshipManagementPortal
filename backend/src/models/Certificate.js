// ──────────────────────────────────────────────────────
// Certificate Model
// ──────────────────────────────────────────────────────
import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
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
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Issuer reference is required'],
    },
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    certificateUrl: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'],
      default: 'B',
    },
    remarks: {
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ── Compound index: One certificate per intern per internship ──
certificateSchema.index({ intern: 1, internship: 1 }, { unique: true });

export default mongoose.model('Certificate', certificateSchema);
