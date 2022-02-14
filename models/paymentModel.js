const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    paymentID: {
        type: String,
        require: true
    },
    address: {
        type: Object,
        require: true
    },
    cart: {
        type: Array,
        require: []
    },
    status: {
        type: Boolean,
        default: false,
        require: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Payments", paymentSchema)