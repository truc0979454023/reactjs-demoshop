import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState'
import { useHistory, useParams } from 'react-router-dom'
import { imageUpload } from './imageUpload';

const initialState = {
    product_id: '',
    title: '',
    oldPrice: 0,
    price: 0,
    size: [],
    color: [],
    description: '',
    content: '',
    category: '',
    _id: '',
    active: false
}

function CreateProducts() {

    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [categories] = state.categoriesAPI.categories
    const [images, setImages] = useState([])

    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    const history = useHistory()
    const param = useParams()

    // const [products] = state.productsAPI.products
    const [productAll] = state.productsAPI.productAll
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback

    const [number, setNumber] = useState(0)
    const [color, setColor] = useState('')

    const [check, setCheck] = useState(false)

   

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            productAll.forEach(product => {
                if (product._id === param.id) {
                    setProduct(product)
                    setImages(product.images)
                    setNumber(product.color.length)

                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages([])
        }
    }, [param.id, productAll])

    useEffect(() => {
        setCheck(product.active)
    }, [product])

    const handleUpload = async e => {
        e.preventDefault()
        try {
            let newImages = []
            let num = 0

            if (!isAdmin) return alert("You are not a admin")
            const files = [...e.target.files]
            files.forEach(file => {
                if (!file) return alert("File not exist")

                if (file.size > 1024 * 1024)
                    return alert("size too large")

                if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                    return alert("File format is inconncet")
                num += 1;
                if (num <= 5) newImages.push(file)
                return newImages
            })

            const imgCount = images.length
            if (imgCount + newImages.length > 5) return alert(" Select up to 5 images. ")
            setImages([...images, ...newImages])

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const deleteImage = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }


    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const handleChangeCheckbox = e => {
        //gán value mới change vào chuỗi product.size (có thế bị trùng)
        let newArray = [...product.size, e.target.value];
        //kiểm tra trong mảng có tồn tại value mới change không
        if (product.size.includes(e.target.value)) {
            //Nếu có thì trả về mảng mới bằng mảng đã bỏ hết các phần tử đã tồn tại 
            newArray = newArray.filter(size => size !== e.target.value);
        }
        setProduct({
            ...product,
            size: newArray
        });
    }

    const checkSize = (value) => {
        return product.size.includes(value)
    }

    const handleAddColor = (e) => {
        e.preventDefault()
        setNumber(number + 1);
        let newArray = [...product.color, color];
        if (product.size.includes(color)) {
            newArray = newArray.filter(clr => clr !== color);
        }
        setProduct({
            ...product,
            color: newArray
        });
        setColor('')
    }
    const deleteColor = (i) => {
        product.color.splice(i, 1)
        setNumber(number - 1)
        setProduct({ ...product })
    }

    const inputColor = () => {
        let temp = []
        for (let i = 0; i < number; i++) {
            temp.push(
                <div key={i} className="color-item">
                    <label className="color-label" htmlFor="color">{product.color[i]}</label>
                    <span className="color-btn" onClick={() => deleteColor(i)}>X</span>
                </div>
            )

        }
        return temp;
    }

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            if (!isAdmin) return alert("You are not admin")
            if (images.length === 0) return alert("No image upload")

            let media = []
            const imgNewURL = images.filter(img => !img.url)
            const imgOldURL = images.filter(img => img.url)

            if (imgNewURL.length > 0) media = await imageUpload(imgNewURL)
            if (onEdit) {
                await axios.put(`/api/products/${product._id}`, { ...product, images: [...imgOldURL, ...media] }, {
                    headers: { Authorization: token }
                })
                alert('Updated success.')

                history.push("/products")
            } else {
                await axios.post('/api/products', { ...product, images: [...imgOldURL, ...media] }, {
                    headers: { Authorization: token }
                })
                alert('Created success.')

                history.push("/create_product")
            }
            setCallback(!callback)
            setColor('')
            setNumber(0)
            setCheck(false)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // const styleUpload = {
    //     display: images ? "block" : "none"
    // }

    const handleCheck = (e) => {
        setCheck(e.target.value)
        if (check === true) setProduct({ ...product, active: false })
        if (check === false) {
            setProduct({ ...product, active: true })
        }
        setCheck(!check)
    }

    return (
        <div className="create_product">
            <div className="upload">

                <div className="upload-btn" onChange={handleUpload}>
                    <span name="upload" className="upload-span">Upload</span>
                    <input type="file" id="file_up" name='upload' multiple accept="image/*" />
                </div>

                <div className="upload-image">
                    {
                        images.map((img, index) => (
                            <div key={index} className="upload-item">
                                <img src={img.url ? img.url : URL.createObjectURL(img)}
                                    alt="" className="upload-item__img" />
                                <span className="upload-item__span" onClick={() => deleteImage(index)}>X</span>
                            </div>
                        ))
                    }
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row" >
                    <label htmlFor="product_id">Product ID</label>
                    <input type="text" name="product_id" id="product_id" required
                        value={product.product_id} onChange={handleChangeInput} disabled={onEdit} />
                </div>

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                        value={product.title} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="oldprice">Old price</label>
                    <input type="number" name="oldPrice" id="oldprice" required
                        value={product.oldPrice} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" required
                        value={product.price} onChange={handleChangeInput} />
                </div>

                <div className="row" >
                    <label htmlFor="price">Size</label>
                    <div className="form-size">
                        <div className="form-size-item">
                            <label htmlFor="sizeS">S</label>
                            <input type="checkbox" name="size" id="sizeS"
                                value="S" onChange={handleChangeCheckbox} checked={checkSize("S")} />
                        </div>
                        <div className="form-size-item">
                            <label htmlFor="sizeM">M</label>
                            <input type="checkbox" name="size" id="sizeM"
                                value="M" onChange={handleChangeCheckbox} checked={checkSize("M")} />
                        </div>
                        <div className="form-size-item">
                            <label htmlFor="sizeL">L</label>
                            <input type="checkbox" name="size" id="sizeL"
                                value="L" onChange={handleChangeCheckbox} checked={checkSize("L")} />
                        </div>
                        <div className="form-size-item">
                            <label htmlFor="sizeXL">XL</label>
                            <input type="checkbox" name="size" id="sizeXL"
                                value="XL" onChange={handleChangeCheckbox} checked={checkSize("XL")} />

                        </div>
                        <div className="form-size-item">
                            <label htmlFor="sizeXXL">XXL</label>
                            <input type="checkbox" name="size" id="sizeXXL"
                                value="XXL" onChange={handleChangeCheckbox} checked={checkSize("XXL")} />
                        </div>
                    </div>
                </div>

                <div >
                    <label htmlFor="color">Color</label>
                    <div className="form-color">

                        <input key='color' type="text" name="color"
                            onChange={e => setColor(e.target.value)} value={color} />
                        <button onClick={handleAddColor}>Add</button>
                    </div>
                    <div className="color-list">
                        {
                            inputColor()
                        }
                    </div>

                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                        value={product.description} rows="5" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content" required
                        value={product.content} rows="7" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="categories">Categories: </label>
                    <select name="category" value={product.category} onChange={handleChangeInput}>
                        <option value="">Please select a category</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="row" style={{ display: 'flex', alignItems: "center" }}>
                    <label htmlFor="active">Actived: </label>
                    <input type="checkbox" id="active" value={check} onChange={handleCheck} style={{ width: '50px' }} checked={check} />
                </div>
                <button type="submit">{onEdit ? "Update" : "Create"}</button>
            </form>

        </div>
    );
}

export default CreateProducts;