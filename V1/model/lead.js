const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({

    email: {
        type: [String],
        required: true,
        unique: true,
        trim: true,
    },
     firstName: {
        type: String,
        required: true
    },
    websiteURL: {
        type: String,
        required: true
    },
    linkdinURL: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    whatsUpNumber: {
        type: Number,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },
    workEmail: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    priority: {
        type: String,
        enum: ["HIGH", "MEDIUM", "LOW"],
        default: "HIGH"
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
     isDeleted: {
    type: Boolean,
    default: false
  }
});
module.exports = mongoose.model("Lead", leadSchema);
