const mongoose = require('mongoose')


const productChema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        trim: true,
        require: true
    },
    title: {
        type: String,
        trim: true,
        require: true
    },
    oldPrice: {
        type: Number,
        trim: true,
        require: true
    },
    price: {
        type: Number,
        trim: true,
        require: true
    },
    saleOff: {
        type: Number,
        trim: true,
        require: true
    },
    size: {
        type: Array,
        trim: true,
        require: true
    },
    color: {
        type: Array,
        trim: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    images: {
        type: Array,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    sold: {
        type: Number,
        default: 0
    },
    active :{
        type: Boolean,
        default:false
    }
},{
    timestamps: true//important
})


module.exports = mongoose.model('Products', productChema)