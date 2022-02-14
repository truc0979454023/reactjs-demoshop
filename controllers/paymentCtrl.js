const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')


const paymentCtrl = {
    getPayments: async (req, res) => {
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createPayment: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            const { cart, paymentID, address } = req.body;
            const { _id, name, email } = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, paymentID, address
            })

            cart.filter(item => {
                return sold(item.product._id, item.product.quantity, item.product.sold)
            })

            await newPayment.save()
            //res.json({newPayment})
            res.json({ msg: "Payment success !" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    changeDelivery: async (req, res) => {
        try {
            const { status } = req.body;

            await Payments.findByIdAndUpdate({ _id: req.params.id }, { status })

            res.json({ msg: "Update success" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

const sold = async (id, quantity, oldSold) => {
    await Products.findOneAndUpdate({ _id: id }, {
        sold: quantity + oldSold
    })
}

module.exports = paymentCtrl