const mongoose = require('mongoose');

const bioLinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const bioProfileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // 1-to-1 relationship (one bio profile per user)
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: '',
    },
    theme: {
      type: String,
      enum: ['minimal-light', 'dark-slate', 'gradient'],
      default: 'minimal-light',
    },
    links: [bioLinkSchema], // Array of embedded link buttons
  },
  {
    timestamps: true,
  }
);

const BioProfile = mongoose.model('BioProfile', bioProfileSchema);

module.exports = BioProfile;
