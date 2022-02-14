import React, { useState, useContext, useEffect } from 'react';
import print from 'print-js'
import QRCode from 'qrcode.react';
import { useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'


function OrderDetails() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [orderDetails, setOrderDetails] = useState([])
    const [total, setTotal] = useState(0)
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            history.forEach(item => {
                if (item._id === params.id) setOrderDetails(item)
            })
        }
    }, [params.id, history])


    useEffect(() => {
        const getTotal = async () => {
            if (orderDetails.cart) {
                const total = await orderDetails.cart.reduce((prev, item) => {
                    return prev + (item.product.price * item.product.quantity)
                }, 0)
                setTotal(total)
            }
        }

        getTotal()
    }, [orderDetails])
    const [QRcode, setQRcode] = useState([])
    useEffect(() => {
        if (orderDetails.length !== 0) {
            setQRcode({
                name: orderDetails.address.recipient_name,
                address: orderDetails.address.line1 + " - " + orderDetails.address.city,
                state: orderDetails.address.state,
                postal: orderDetails.address.postal_code,
                country: orderDetails.address.country_code,
                createdAt: orderDetails.createdAt,
                cart: orderDetails.cart.reduce((array, item) => {
                    array.push({
                        title: item.product.title,
                        quantity: item.product.quantity,
                        total: item.product.price * item.product.quantity,
                        size: item.size,
                        color: item.color
                    })
                    return array
                }, []),
                total: total
            })
        }
    }, [orderDetails, total])

    const downloadQR = () => {
        const canvas = document.getElementById('qrcode');
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        console.log('pngUrl', pngUrl);
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    if (orderDetails.length === 0) return null;
    return (
        <div className="history-page">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => print({ printable: 'printJS-form', type: 'html', header: 'Demo-Shop order' })}
                    style={{ background: "gray", padding: '4px 32px', borderRadius: '4px', color: '#fff', margin: '6px 0' }}>
                    <i className="fas fa-print"></i>
                    Print
                </button>
            </div>

            <div id="printJS-form">
                <table >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>State</th>
                            <th>Postal Code</th>
                            <th>Country Code</th>
                            <th>Created At</th>
                            <th> QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{orderDetails.address.recipient_name}</td>
                            <td>{orderDetails.address.line1 + " - " + orderDetails.address.city}</td>
                            <td>{orderDetails.address.state}</td>
                            <td>{orderDetails.address.postal_code}</td>
                            <td>{orderDetails.address.country_code}</td>
                            <td>{orderDetails.createdAt}</td>
                            {/* <td>
                                <QRCode
                                    id='qrcode'
                                    value={JSON.stringify(QRcode)}
                                    size={128}
                                    level={'L'}
                                    includeMargin={true}
                                />
                                <i onClick={downloadQR} style={{ display: 'block', cursor: 'pointer', color: 'crimson' }}> Download QR </i>
                            </td> */}
                            <td>
                                <QRCode
                                    id='qrcode'
                                    value={`http://localhost:3000/history/${params.id}`}
                                    size={128}
                                    level={'L'}
                                    includeMargin={true}
                                />
                                <i onClick={downloadQR} style={{ display: 'block', cursor: 'pointer', color: 'crimson' }}> Download QR </i>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table style={{ margin: "30px 0px" }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Size</th>
                            <th>Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderDetails.cart.map(item => (
                                <tr key={item.product._id}>
                                    <td><img src={item.product.images[0].url} alt="" /></td>
                                    <td>{item.product.title}</td>
                                    <td>{item.product.quantity}</td>
                                    <td>$ {item.product.price * item.product.quantity}</td>
                                    <td>{item.size}</td>
                                    <td>{item.color}</td>
                                </tr>
                            ))
                        }
                        <tr>
                            <td>Total</td>
                            <td></td>
                            <td></td>
                            <td style={{ color: 'crimson' }}>$ {total}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default OrderDetails;