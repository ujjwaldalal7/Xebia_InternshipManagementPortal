// ──────────────────────────────────────────────────────
// Internship Model
// ──────────────────────────────────────────────────────
import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      trim: true,
    },
    duration: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['weeks', 'months'], default: 'months' },
    },
    stipend: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'remote',
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'At least 1 seat required'],
    },
    filledSeats: {
      type: Number,
      default: 0,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mentor is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'in-progress', 'completed', 'closed'],
      default: 'open',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    applicationDeadline: {
      type: Date,
    },
    requirements: {
      type: [String],
      default: [],
    },
    perks: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ── Virtual: Check if internship is full ──
internshipSchema.virtual('isFull').get(function () {
  return this.filledSeats >= this.totalSeats;
});

// ── Virtual: Available seats ──
internshipSchema.virtual('availableSeats').get(function () {
  return this.totalSeats - this.filledSeats;
});

// Ensure virtuals are included in JSON
internshipSchema.set('toJSON', { virtuals: true });
internshipSchema.set('toObject', { virtuals: true });

// ── Indexes ──
internshipSchema.index({ status: 1 });
internshipSchema.index({ mentor: 1 });
internshipSchema.index({ domain: 1 });
internshipSchema.index({ company: 1 });

export default mongoose.model('Internship', internshipSchema);
