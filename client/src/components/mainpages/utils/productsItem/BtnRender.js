import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'

function BtnRender({ product, deleteProduct }) {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const addCart = state.userAPI.addCart

    return (
        <div className="row-btn">
            {
                isAdmin ?
                    <>
                        <span id="btn_buy" to="#!"
                            onClick={() => deleteProduct(product._id, product.images.public_id)}>
                            Delete
                        </span>
                        <Link id="btn_view" to={`/edit_product/${product._id}`}>
                            Edit
                        </Link>
                    </>
                    :
                    <>
                        {
                            product.active ?
                                <span id="btn_buy" to="#!" onClick={() => addCart(product)}>
                                    Buy
                                </span>
                                : <span id="btn_buy" className="btn_buy_out_stock" to="#!" >
                                    Buy
                                </span>
                        }
                        <Link id="btn_view" to={`/detail/${product._id}`}>
                            View
                        </Link>
                    </>
            }
        </div>
    )

}

export default BtnRender