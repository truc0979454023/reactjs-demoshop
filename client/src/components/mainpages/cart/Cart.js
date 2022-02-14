import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Paypal from './PayPal'
import { Link } from 'react-router-dom';

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [token] = state.token
    const [total, setTotal] = useState(0)
    const [callback, setCallback] = state.productsAPI.callback
    const [callbackPayment, setCallbackPayment] = state.userAPI.callbackPayment
    const [productAll, setProductAll] = state.productsAPI.productAll

    useEffect(() => {
        const getTotal = () => {
            const total = cart.reduce((prev, item) => {
                return prev + (item.product.price * item.product.quantity)
            }, 0)
            setTotal(total)
        }

        getTotal()
    }, [cart])

    const addToCart = async (cart) => {
        await axios.patch('user/addcart', { cart }, {
            headers: { Authorization: token }
        })
    }

    const increment = (id) => {
        cart.forEach(item => {
            if (item.product._id === id) {
                item.product.quantity += 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const decrement = (id) => {
        cart.forEach(item => {
            if (item.product._id === id) {
                item.product.quantity === 1 ? item.product.quantity = 1 : item.product.quantity -= 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }
    const onSize = (id, size) => {
        cart.forEach(item => {
            if (item.product._id === id) {
                item.size = size
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const onColor = (id, color) => {
        cart.forEach(item => {
            if (item.product._id === id) {
                item.color = color
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = id => {
        if (window.confirm("Do you want to delete the product.")) {
            cart.forEach((item, index) => {
                if (item.product._id === id) {
                    cart.splice(index, 1)
                }
            })
            setCart([...cart])
            addToCart(cart)
        }
    }



    const [count, setCount] = useState()
    const [temp, setTemp] = useState([])
    const handlePayment = () => {
        const number = cart.reduce((count, c) => {
            if ((c.product.size.length !== 0 && c.size === '') || (c.product.color.length !== 0 && c.color === ''))
                return count += 1
            return count
        }, 0)

        const array = [];
        cart.forEach(cartItem => {
            array.push(...productAll.filter(productItem => {
                return productItem.active === false && productItem._id === cartItem.product._id
            }))
        })

        if (number > 0) {
            alert('Please choose all sizes and colors')
        }
        if (array.length > 0) {
            const title = array.reduce((str, item) => {
                return str + item.title + ', '
            }, '')
            alert(`The products: ${title} are out of stock`)
        }
        setTemp(array)
        setCount(number)
    }

    const tranSuccess = async (payment) => {
        const { paymentID, address } = payment;

        await axios.post('/api/payment', { cart, paymentID, address }, {
            headers: { Authorization: token }
        })
        setCart([])
        addToCart([])
        setCallback(!callback)
        setCallbackPayment(!callbackPayment)
        alert("You have successfully placed an order.")
    }


    const isActiveSize = (id, size) => {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].product._id === id && cart[i].size === size) {

                return 'activeCart'
            }
        }
    }

    const isActiveColor = (id, color) => {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].product._id === id && cart[i].color === color) {

                return 'activeCart'
            }
        }
    }

    if (cart.length === 0)
        return <div className="no-cart">
            <h1 className="no-cart__title">Cart Empty</h1>
            <p className="no-cart__content" >(There are no products in the cart)</p>
            <img className="no-cart__img" src="data:image/png;base64,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" alt="" />
        </div>
    return (
        <div className="containerCart">
            {
                cart.map((cItem, index) => (
                    <div className="cart" key={index}>
                        <img className="cart-img" src={cItem.product.images[0].url} alt="" />

                        <div className="box-detail-cart">
                            <Link to={`/detail/${cItem.product._id}`}>
                                <h2 className="title">{cItem.product.title}</h2>
                            </Link>
                            <div className="content">

                                <div className="content-price-sold">

                                    <h3 style={{ fontSize: "24px" }} className="price">$ {cItem.product.price} </h3>
                                    <div className="size-color">
                                        <p style={{ fontSize: '20px' }}>Size:</p>
                                        {
                                            cItem.product.size ? cItem.product.size.map((s) => (
                                                <p key={s} className={`cart-size-item ${isActiveSize(cItem.product._id, s)}`}
                                                    onClick={() => (onSize(cItem.product._id, s))}>{s}
                                                </p>

                                            )) : ''
                                        }

                                    </div>
                                    <div className="size-color">
                                        {
                                            cItem.product.color.length !== 0 ?
                                                <>
                                                    <p style={{ fontSize: '20px' }}>Color:</p>
                                                    {

                                                        cItem.product.color ? cItem.product.color.map((c) => (
                                                            <p key={c} className={`cart-color-item ${isActiveColor(cItem.product._id, c)}`}
                                                                onClick={() => onColor(cItem.product._id, c)}>{c}</p>
                                                        )) : ''
                                                    }
                                                </>
                                                : ''
                                        }

                                    </div>
                                    {/* <p>{cItem.product.description}</p>
                            <p>{cItem.product.content}</p> */}
                                    <p className="sold">Sold: {cItem.product.sold}</p>
                                </div>

                                <div className="amount">
                                    <button onClick={() => decrement(cItem.product._id)}>-</button>
                                    <span>{cItem.product.quantity}</span>
                                    <button onClick={() => increment(cItem.product._id)}>+</button>
                                </div>
                            </div>

                            <div className="delete"
                                onClick={() => removeProduct(cItem.product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }

            <div className="total">
                <div className="total_price">
                    <h3>Total: </h3>
                    <p>$ {total} </p>
                </div>
                {
                    count === 0 && temp.length === 0 ?
                        <Paypal
                            total={total}
                            tranSuccess={tranSuccess}
                        /> :
                        <button className="btn-payment" onClick={handlePayment}>
                            Payment
                        </button>}

            </div>
        </div>
    )
}

export default Cart