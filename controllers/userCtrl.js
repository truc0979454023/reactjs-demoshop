const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "The email already sxists." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Pass is at least 6 characters long." })

            //password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash
            })
            //save mongodb
            await newUser.save()

            // then create jsonbtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000

            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password" })

            //if login success, create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.json({ accesstoken })

            res.json({ msg: "Login Success!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: " Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })
                const accesstoken = createAccessToken({ id: user.id })
                res.json({ accesstoken })
            })
            return res.json({ rf_token })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    getUserById: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ msg: "User does not exist" })
            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserAll: async (req, res) => {
        try {
            const users = await Users.find().select('-password')
            if (!users) return res.status(400).json({ msg: "Error occurred" })
            res.json({ users })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted a user" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateRole: async (req, res) => {
        try {

            const { role } = req.body;

            await Users.findOneAndUpdate({ _id: req.params.id }, { role })

            res.json({ msg: 'Update success!' })
        } catch (err) {
            return res.status(500).json({ err: err.message })
        }
    },
    updateInfo: async (req, res) => {
        try {
            const { data } = req.body;
            const { name, email } = data;

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Error occurred." })

            if (!name || !email)
                return res.status(400).json({ msg: "Please add your new name." })

            await Users.findOneAndUpdate({ _id: user._id }, { name: name })

            res.json({ msg: 'Update Success!' })

        } catch (err) {
            return res.status(500).json({ err: err.message })
        }
    },
    updatePasword: async (req, res) => {
        try {
            const { data } = req.body;
            const { email, password, new_password, cf_new_password } = data;

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Error occurred." })

            if (!email || !password || !new_password)
                return res.status(400).json({ msg: "Please add password and new password." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password" })

            if (new_password === password)
                return res.status(400).json({ msg: "Please change the new password that does not match the old password." })
            if (new_password !== cf_new_password)
                return res.status(400).json({ msg: "Confirm password is not match." })
            if (new_password.length < 6)
                return res.status(400).json({ msg: "Pass is at least 6 characters long." })

            const passwordHash = await bcrypt.hash(new_password, 10)

            await Users.findOneAndUpdate({ _id: user._id }, { password: passwordHash })

            res.json({ msg: 'Update Success!' })

        } catch (err) {
            return res.status(500).json({ err: err.message })
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })
            res.json({ msg: "Added to cart" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    history: async (req, res) => {
        try {
            const history = await Payments.find({ user_id: req.user.id })

            res.json(history)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}
//Thoi gian het han cookie 7 ngay se logout
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userCtrl