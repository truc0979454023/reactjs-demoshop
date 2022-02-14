import React, { useContext, useState } from 'react'
import { GlobalState } from '../../GlobalState'
import Menu from './icon/menu.svg'
import Close from './icon/times.svg'
import Cart from './icon/cart.svg'
import { Link } from 'react-router-dom'
import axois from 'axios'


function Header() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [cart] = state.userAPI.cart

    const [count, setCount] = useState(window.scrollY)

    const logoutUser = async () => {
        await axois.get('/user/logout')
        localStorage.clear()

        localStorage.removeItem('fristLogin')

        window.location.href = "/";
    }

    const adminRouter = () => {
        return (
            <>
                <li><Link to="/create_product">Create Product</Link></li>
                <li><Link to="/category">Categories</Link></li>
                <li><Link to="/users">Users</Link></li>

            </>
        )
    }

    const loggedRouter = () => {
        return (
            <>
                <li><Link to="/history">Account</Link></li>
                <li><Link to="/" onClick={logoutUser}>Logout</Link></li>

            </>
        )
    }

    window.addEventListener('scroll', () => {
        setCount(window.scrollY)
    })

    const header = document.querySelector("#header");
    const btnBackToTop = document.querySelector(".bttop");
    window.onscroll = () => {
        if (header) {
            if (count > header.offsetTop) {
                header.classList.add("sticky");
                btnBackToTop.classList.add("bttop--active")
                btnBackToTop.classList.remove("bttop--activeHide")

            } else {
                header.classList.remove("sticky");
                btnBackToTop.classList.remove("bttop--active")
                btnBackToTop.classList.add("bttop--activeHide")

            }
        }
    }

    return (

        <header id="header" >
            <div className="menu">
                <img src={Menu} alt="" width="30" />
            </div>

            <div className="logo">
                <h1>
                    <Link to="/">{isAdmin ? ' Admin' : 'Demo Shop'}</Link>
                </h1>
            </div>

            <ul>
                {isAdmin && <li><Link to="/charts">Charts</Link></li>}
                <li> <Link to="/products">{isAdmin ? 'Products' : 'Shop'}</Link></li>
                {isAdmin && adminRouter()}
                {
                    isLogged ? loggedRouter() : <li><Link to="/login">Login || Register</Link></li>
                }
                <li><img src={Close} alt="" width="30" className="menu" /></li>
            </ul>
            {
                isAdmin ? ''
                    :
                    <div className="cart-icon">
                        <span>{cart.length}</span>
                        <Link to="/cart">
                            <img src={Cart} alt="" width="30" />
                        </Link>
                    </div>
            }

        </header>
    )
}

export default Header