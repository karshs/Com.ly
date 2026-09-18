const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema(
  {
    link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
      index: true, 
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true, 
    },
    referrer: {
      type: String,
      default: 'direct',
      trim: true,
    },
    device: {
      type: String,
      enum: ['Desktop', 'Mobile', 'Tablet', 'Unknown'],
      default: 'Unknown',
    },
    ipHash: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: false, // We already have our explicit `timestamp` field
  }
);

clickSchema.index({ link: 1, timestamp: -1 });

const Click = mongoose.model('Click', clickSchema);

module.exports = Click;
