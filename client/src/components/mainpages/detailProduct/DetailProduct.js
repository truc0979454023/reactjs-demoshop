import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productsItem/ProductItem'


function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [productAll] = state.productsAPI.productAll
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState('')

    const [tab, setTab] = useState(0)

    const isActive = (index) => {
        if (tab === index) return "activeImg"
    }



    useEffect(() => {
        if (params.id) {
            productAll.forEach(product => {
                if (product._id === params.id) setDetailProduct(product)
                setTab(0)
            });
        }
    }, [params.id, productAll])

    console.log(detailProduct)


    if (detailProduct.length === 0) return null;
    return (
        <div>
            <div className="detail">
                <div className="detail-img" >

                    <img className="detail-img-main" src={detailProduct.images[tab].url} alt="" />
                    <div className="" style={{ cursor: 'pointer', display: 'flex' }} >
                        {
                            detailProduct.images.map((image, index) => (
                                <img key={index} src={image.url} alt={image.url}
                                    className={`detail-img-list ${isActive(index)}`}
                                    onClick={() => setTab(index)} />
                            ))
                        }
                    </div>
                </div>
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailProduct.title}</h2>
                        <h6>#id: {detailProduct.product_id}</h6>
                    </div>
                    <span><b>Price: </b>$ {detailProduct.price}</span>
                    <div className="size-color">
                        <p><b>Size:</b> </p>
                        {
                            detailProduct.size.map((sizeItem, index) => (
                                <p key={index} className="size-item">{sizeItem}</p>
                            ))
                        }

                    </div>
                    <div className="size-color">
                        {
                            detailProduct.color.length !== 0 ?
                                <>
                                    <p><b> Color:</b></p>
                                    {

                                        detailProduct.color.map((colorItem, index) => (
                                            <p key={index} className="color-item">{colorItem}</p>
                                        ))
                                    }
                                </>
                                : ''
                        }

                    </div>
                    <p><b>Description: </b>{detailProduct.description}</p>
                    <p><b>Content: </b>{detailProduct.content}</p>
                    <p><b>Soid:</b> {detailProduct.sold}</p>
                    {
                        detailProduct.active ? <span to="#!" className="cart"
                            onClick={() => addCart(detailProduct)}>Buy Now
                        </span>
                            : <span to="#!" className="cart_out_stock">Buy Now
                            </span>

                    }

                </div>
            </div>

            <div>
                <h2>Related products</h2>

                <div className="products">
                    {
                        productAll.map(product => {
                            return (product.category === detailProduct.category && product._id !== detailProduct._id)
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default DetailProduct