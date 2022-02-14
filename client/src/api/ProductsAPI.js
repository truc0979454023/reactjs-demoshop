import { useState, useEffect } from 'react'
import axios from 'axios'

function ProductsAPI() {
    const [products, setProducts] = useState([])
    const [productAll, setProductAll] = useState([])
    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)


    useEffect(() => {
        const getProducts = async () => {
            // const res = await axios.get(`/api/products?limit=${12}&${category}&${sort}&title[regex]=${search}&page=${page}`)
            const res = await axios.get(`/api/products?limit=${page * 12}&${category}&${sort}&title[regex]=${search}`)
            setProducts(res.data.products)
            setResult(res.data.result)
        }
        getProducts()

        const getProductAll = async () => {
            const res = await axios.get(`/api/getProductAll`)
            setProductAll(res.data.products)
        }
        getProductAll()

    }, [callback, category, sort, search, page])
    return {
        products: [products, setProducts],
        productAll: [productAll, setProductAll],
        callback: [callback, setCallback],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult]

    }
}

export default ProductsAPI;