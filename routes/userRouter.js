const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const authAdmin = require('../middleware/authAdmin')


const auth = require('../middleware/auth')

router.post('/register', userCtrl.register)

router.post('/login', userCtrl.login)

router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/infor', auth, userCtrl.getUserById)

router.get('/user_all', auth, authAdmin, userCtrl.getUserAll)

router.delete('/delete_user/:id', auth, authAdmin, userCtrl.deleteUser)

router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateRole)

router.patch('/update_info', auth, userCtrl.updateInfo)

router.patch('/update_password', auth, userCtrl.updatePasword)

router.patch('/addcart', auth, userCtrl.addCart)

router.get('/history', auth, userCtrl.history)




module.exports = router