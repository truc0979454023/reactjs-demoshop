const Products = require('../models/productModel')


//filter, sorting and qaginating
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString } //this.queryString= req.query
        const excludeFields = ['page', 'sort', 'limit']
        excludeFields.forEach(el => delete (queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => `$` + match)

        this.query.find(JSON.parse(queryStr))
        //gte= greater than or equal
        //lte = lesser than oer equal
        //lt = lesser
        //gt= greate
        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 12
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query)
                .filtering().sorting().paginating()
            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getProductAll: async (req, res) => {
        try {
            const products = await Products.find()

            res.json({ products: products })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, oldPrice, price, size, color, description, content, images, category, active } = req.body;
           
            if (images.length === 0) return res.status(400).json({ msg: " No image upload" })
            if (size.length === 0) return res.status(400).json({ msg: " Please add sizes of product" })
            if (!product_id || !title || !description || !content || !category) return res.status(400).json({ msg: 'Please add all the fields.' })

            const product = await Products.findOne({ product_id })
            if (product) return res.status(400).json({ msg: " This product already exists" })

            let saleOff;
            if (oldPrice === 0) {
                saleOff = 0
            }
            else {

                saleOff = ((oldPrice - price) / oldPrice) * 100
            }

            const newProduct = new Products({
                product_id, title: title.toLowerCase(), oldPrice, price, saleOff, size, color, description, content, images, category, active
            })

            await newProduct.save()
            res.json({ msg: "Created new product" })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ msg: "Delete a product" })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { title, oldPrice, price, size, color, description, content, images, category, active } = req.body;
            if (!images) return res.status(400).json({ msg: " No image upload" })
            if (size.length === 0) return res.status(400).json({ msg: " Please add sizes of product" })

            // if (price === 0) return res.status(400).json({ msg: 'Please add price.' })
            let saleOff;
            if (oldPrice === 0) {
                saleOff = 0
            }
            else {
                saleOff = ((oldPrice - price) / oldPrice) * 100
            }

            await Products.findByIdAndUpdate({ _id: req.params.id }, {
                title: title.toLowerCase(), oldPrice, price, size, color, saleOff, description, content, images, category, active
            })

            res.json({ msg: "Updated a product" })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = productCtrl