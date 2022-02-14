import { useState, useEffect } from 'react';
import axios from 'axios'


function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [history, setHistory] = useState([])
    const [users, setUsers] = useState([])
    const [userProfile, setUserProfile] = useState('')
    const [callback, setCallback] = useState(false)
    const [callbackPayment, setCallbackPayment] = useState(false)

    useEffect(() => {
        if (token) {
            const getUserById = async () => {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: token }
                    })
                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    setCart(res.data.cart)
                    setUserProfile(res.data)

                } catch (err) {
                    alert(err.data)
                }
            }
            getUserById()
        }
    }, [token, callback])

    useEffect(() => {
        if (isAdmin) {
            const getUserAll = async () => {
                try {
                    const res = await axios.get('/user/user_all', {
                        headers: { Authorization: token }
                    })
                    setUsers(res.data.users)

                } catch (err) {
                    alert(err.data.users)
                }
            }
            getUserAll()
        }
    }, [callback, isAdmin, token])

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const res = await axios.get('/api/payment', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                } else {
                    const res = await axios.get('/user/history', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                }
            }
            getHistory()
        }
    }, [token, isAdmin, callbackPayment])

    const addCart = async (product) => {
        if (!isLogged) return alert("Please login to continue buying")


        const check = cart.every(item => {
            return item.product._id !== product._id
        })
        if (check) {
            setCart([...cart, { product: { ...product, quantity: 1 }, size: '', color: '' }])


            await axios.patch('/user/addcart', { cart: [...cart, { product: { ...product, quantity: 1 }, size: '', color: '' }] }, {
                headers: { Authorization: token }
            })

        } else {
            return alert("This product has added to cart")
        }

    }
    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        users: [users, setUsers],
        addCart: addCart,
        history: [history, setHistory],
        callback: [callback, setCallback],
        callbackPayment: [callbackPayment, setCallbackPayment],
        userProfile: [userProfile, setUserProfile]
    }
}

export default UserAPI;