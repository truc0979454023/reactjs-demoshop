const mongoose = require('mongoose')

const userChema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: [],
        require: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userChema)