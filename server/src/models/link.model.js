const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,

        },
        originalUrl: {
            type: String,
            required: true,
            trim: true,
        },
        shortCode: {
            type: String,
            required: [true, 'Short code or custom slug is required'],
            unique: true, 
            lowercase: true, // case sensititvity
            minlength: 3,
            maxlength: 50,
            match: [/^[a-z0-9_-]+$/, 'Short code can only contain lowercase letters, numbers, hyphens, and underscores'],
        },
        clicks: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
    timestamps: true,
    },


);

linkSchema.index({ owner: 1, createdAt: -1 });

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;
