const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    tableNo: { type: Number, required: true },
    status: {
        type: String,
        default: "Available"
    },
    seats: { 
        type: Number,
        required: true
    },
    hall: {
        type: String,
        enum: ["Family Hall", "Gents Hall"],
        default: "Family Hall",
        required: true
    },
    currentOrder: {type: mongoose.Schema.Types.ObjectId, ref: "Order"}
});

tableSchema.index({ tableNo: 1, hall: 1 }, { unique: true });

module.exports = mongoose.model("Table", tableSchema);