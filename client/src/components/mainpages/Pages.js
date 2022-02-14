import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import Products from './products/Products'
import DetailProduct from './detailProduct/DetailProduct'
import Login from './auth/Login'
import Register from './auth/Register'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'
import Categories from './categoties/Categories'
import CreateProducts from './createProducts/CreateProducts'
import Cart from './cart/Cart'
import NotFound from '../mainpages/utils/notFound/NotFound'
import { GlobalState } from '../../GlobalState'
import MainPage from './pagedefault/MainPage'
import Users from './users.js/Users'
import Charts from './charts/Charts'




function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin


    return (
        <Switch>
            <Route path="/" exact component={MainPage} />
            <Route path="/charts" exact component={isAdmin ? Charts : NotFound} />
            <Route path="/products" exact component={Products} />
            <Route path="/detail/:id" exact component={DetailProduct} />

            <Route path="/login" exact component={isLogged ? NotFound : Login} />
            <Route path="/register" exact component={isLogged ? NotFound : Register} />

            <Route path="/category" exact component={isAdmin ? Categories : NotFound} />
            <Route path="/create_product" exact component={isAdmin ? CreateProducts : NotFound} />
            <Route path="/edit_product/:id" exact component={isAdmin ? CreateProducts : NotFound} />
            <Route path="/users" exact component={isAdmin ? Users : NotFound} />

            <Route path="/history" exact component={isLogged ? OrderHistory : NotFound} />
            <Route path="/history/:id" exact component={isLogged ? OrderDetails : NotFound} />
              
            <Route path="/cart" exact component={Cart} />

            <Route path="*" exact component={NotFound} />
        </Switch>
    )
}

export default Pages