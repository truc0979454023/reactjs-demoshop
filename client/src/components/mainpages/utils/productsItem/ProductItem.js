import React from 'react'
import BtnRender from './BtnRender'



function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {

    return (
        <div className="product_card">
            {
                product.active && product.saleOff ? <p className="sale">Sale Off</p> : ''
            }

            {
                isAdmin && <input type="checkbox" checked={product.checked}
                    onChange={() => handleCheck(product._id)} />
            }
            <img src={product.images[0].url} alt="" />
            {
                !product.active ? <span className="product_out_stock">Out Stock</span> : ""
            }
            <div className="product-bottom">

                <div className="product_box">
                    <h3 title={product.title}>{product.title}</h3>

                    <span >
                        {
                            !product.oldPrice ? '' : (!product.active ? '' : <span className="oldprice">${product.oldPrice}</span>)
                        }
                        ${product.price}
                    </span>
                    <p>{product.description}</p>
                </div>
                <BtnRender product={product} deleteProduct={deleteProduct} />
            </div>
        </div>
    )
}

export default ProductItem