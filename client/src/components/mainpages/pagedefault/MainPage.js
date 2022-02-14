import React, { useEffect, useState, useContext } from 'react';
import ProductItem from '../utils/productsItem/ProductItem';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import Slide from './Slide';


function MainPage() {

  const state = useContext(GlobalState)
  const [productsSale, setProductsSale] = useState([])
  const [productsNew, setProductsNew] = useState([])
  const [productsSaleOff, setProductsSaleOff] = useState([])
  const [setSort] = state.productsAPI.sort
  const [setCategory] = state.productsAPI.category


  const [page] = useState(1)

  const [callback, setCallback] = state.productsAPI.callback
  const [setLoading] = useState(false)
  const [token] = state.token

  const [count, setCount] = useState(window.scrollY)

  useEffect(() => {
    const getProductsBestSale = async () => {
      const res = await axios.get(`/api/products?limit=${page * 6}&sort=-sold`)
      setProductsSale(res.data.products)
    }
    getProductsBestSale()

    const getProductsNew = async () => {
      const res = await axios.get(`/api/products?limit=${page * 6}&sort=-createdAt`)
      setProductsNew(res.data.products)
    }
    getProductsNew()

    const getProductsSaleOff = async () => {
      const res = await axios.get(`/api/products?limit=${page * 6}&sort=-saleOff`)
      setProductsSaleOff(res.data.products)
    }
    getProductsSaleOff()


  }, [page])

  const deleteProduct = async (id, public_id) => {
    if (window.confirm("Do you want to delete a product.")) {
      try {
        setLoading(true)
        // const destroyImg = axios.post('/api/destroy', { public_id }, {
        //     headers: { Authorization: token }
        // })

        const deleteProduct = axios.delete(`/api/products/${id}`, {
          headers: { Authorization: token }
        })
        // await destroyImg
        await deleteProduct
        alert("Deleted success!")
        setLoading(false)
        setCallback(!callback)
      } catch (err) {
        alert(err.data.msg)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setCount(window.scrollY)
    })

    return () => {
      window.removeEventListener('scroll', () => {
        setCount(window.scrollY)
      })
    }
  }, [])

  useEffect(() => {
    const pdts = document.getElementsByClassName('show-products-item')
    const spt = document.getElementsByClassName('show-products-title')
    if (pdts && spt) {

      for (let i = 0; i < pdts.length; i++) {
        if (count >= (pdts[i].offsetTop - 500))
          pdts[i].classList.add('active-products')
      }
      for (let i = 0; i < spt.length; i++) {
        if (count >= (spt[i].offsetTop - 700))
          spt[i].classList.add('active-title')

      }
    }
  }, [count])

  return (
    <>
      <Slide />

      {
        productsSaleOff.length !== 0 ?
          <div className="show-products">
            <h3 className="show-products-title ">Sale Off</h3>

            <div className="products" >
              {
                productsSaleOff.map(product => {

                  return <div key={product._id} className="show-products-item" >
                    <ProductItem key={product._id} product={product} setProducts={setProductsSaleOff}
                      deleteProduct={deleteProduct} />
                  </div>
                })
              }
            </div>
            <Link to="/products" onClick={() => (setSort('sort=-saleOff') && setCategory(''))}>
              <p className="link show-products-title">Load more</p>
            </Link>
          </div>
          : ''
      }

      {
        productsSale.length !== 0 ?
          <div className="show-products ">
            <h3 className="show-products-title">Best sales</h3>

            <div className="products"  >
              {
                productsSale.map(product => {

                  return <div key={product._id} className="show-products-item" >
                    <ProductItem key={product._id} product={product} setProducts={setProductsSale}
                      deleteProduct={deleteProduct} />
                  </div>
                })
              }
            </div>
            <Link to="/products" onClick={() => (setSort('sort=-sold') && setCategory(''))}>
              <p className='link show-products-title'>Load more</p>
            </Link>
          </div>
          : ''
      }



      {
        productsNew.length !== 0 ?
          <div className="show-products ">
            <h3 className="show-products-title ">Newest</h3>

            <div className="products " >
              {
                productsNew.map(product => {

                  return <div key={product._id} className="show-products-item" >
                    <ProductItem key={product._id} product={product} setProducts={setProductsSale}
                      deleteProduct={deleteProduct} />
                  </div>
                })
              }
            </div>
            <Link to="/products" onClick={() => (setSort('sort=-createdAt') && setCategory(''))}>
              <p className="link show-products-title">Load more</p>
            </Link>
          </div>
          : ''
      }
    </>
  );

}

export default MainPage;
