// const router = require('express').Router()
// const cloudinary = require('cloudinary')//quan ly hinh anh 
// const auth = require('../middleware/auth')
// const authAdmin = require('../middleware/authAdmin')
// const fs = require("fs")

// //we will update image on cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_KEY,
//     api_secret: process.env.CLOUD_SECRET
// })
// //upload image only Admin can use
// router.post('/upload', auth, authAdmin, (req, res) => {
//     try {
//         if (!req.files || Object.keys(req.files).length === 0)
//             return res.status(400).json({ msg: "No file were upload." })

//         const file = req.files.file;
//         if (!file.size > 1024 * 1024) {
//             removeTmp(file.tempFilePath)
//             return res.status.json({ msg: "Size too large" })//1024*1024 = 1mb
//         }
//         if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
//             removeTmp(file.tempFilePath)
//             return res.status(400).json({ msg: "File format is incorrect." })
//         }

//         cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async (err, result) => {
//             if (err) throw err;

//             removeTmp(file.tempFilePath)
//             res.json({ public_id: result.public_id, url: result.secure_url })
//         })
//     } catch (err) {
//         return res.status(500).json({ msg: err.message })
//     }
// })
// //delete image only admin can use
// router.post('/destroy', auth, authAdmin, (req, res) => {
//     try {
//         const { public_id } = req.body;
//         if (!public_id) res.status(400).json({ msg: 'No image Selected' })

//         cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
//             if (err) throw err;
//             res.json({ msg: 'Deleted image ' })
//         })
//     } catch (err) {
//         return res.status(400).json({ msg: err.message })
//     }
// })

// const removeTmp = (path) => {
//     fs.unlink(path, err => {
//         if (err) throw err;
//     })
// }
// module.exports = router