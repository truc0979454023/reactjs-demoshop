import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios';


function OrderHistory() {

    const initialState = {
        name: '',
        password: '',
        new_password: '',
        cf_new_password: ''
    }

    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [callback, setCallback] = state.userAPI.callback
    const [userProfile] = state.userAPI.userProfile
    const [token] = state.token
    const [isAdmin] = state.userAPI.isAdmin
    const [isLogged] = state.userAPI.isLogged

    const [data, setData] = useState(initialState)

    const { name, password, new_password, cf_new_password } = data


    const [filter, setFilter] = useState('')
    const [temp, setTemp] = useState([])

    useEffect(() => {
        if (userProfile)
            setData({ ...data, name: userProfile.name })
    }, [userProfile])


    useEffect(() => {
        setTemp(history)
        if (filter === 'true') {
            setTemp(history => (
                history.filter(item => (
                    item.status === true
                ))
            ))
        }
        if (filter === 'false') {
            setTemp(history => (
                history.filter(item => (
                    item.status === false
                ))
            ))
        }
    }, [filter, history])

    const handleChangeProfile = e => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }
    const handleSubmit = async () => {
        if (name !== userProfile.name && name) {
            try {
                const res = await axios.patch('/user/update_info', { data: { ...data, email: userProfile.email } }, {
                    headers: { Authorization: token }
                })
                alert(res.data.msg)
                setData(initialState)
                setCallback(!callback)
            } catch (err) {
                alert(err.response.statusText)
            }
        }
        if (new_password && password) {
            try {
                const res = await axios.patch('/user/update_password', { data: { ...data, email: userProfile.email } }, {
                    headers: { Authorization: token }
                })
                alert(res.data.msg)
                setData(initialState)
                setCallback(!callback)
            } catch (err) {
                alert(err.response.statusText)
            }
        }
    }
    const handleChangeDelivery = async (id, status_history) => {
        if (isAdmin) {
            if (window.confirm("Do you want to change the delivery.")) {
                try {
                    const res = await axios.patch(`/api/payment/${id}`, { status: !status_history }, {
                        headers: { Authorization: token }
                    })
                    //Nếu mà res trả về 200 thì sửa trực tiếp vào globalState luôn 
                    if (res.status === 200) {
                        setHistory(history => {
                            const newHistory = history.map(item => {
                                if (item._id === id) item.status = !item.status
                                return item
                            })
                            return newHistory;
                        })
                    }
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
        }
    }

    return (
        <div className="profile">
            
            <div className="user-profile">
                <h2>Profile</h2>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" value={name} placeholder="Your name"
                        onChange={handleChangeProfile} />

                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" defaultValue={userProfile.email} disabled
                        placeholder="Your email" />

                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={password} placeholder="Your password"
                        onChange={handleChangeProfile} />

                </div>
                <div className="form-group">
                    <label htmlFor="new_password">New Password</label>
                    <input type="password" id="new_password" name="new_password" value={new_password} placeholder="Your new password"
                        onChange={handleChangeProfile} />

                </div>
                <div className="form-group">
                    <label htmlFor="cf_new_password">Confirm New Password</label>
                    <input type="password" id="cf_new_password" name="cf_new_password" value={cf_new_password} placeholder="Confirm new password"
                        onChange={handleChangeProfile} />
                </div>
                <button className="user-profile-btn" onClick={handleSubmit}> Update</button>
            </div>

            <div className="history-page" >
                <h2>History</h2>
                <h4>You have {history.length} ordered</h4>
                <div style={{ maxHeight: '500px', overflowY: "scroll" }} >
                    <table >
                        <thead >
                            <tr>
                                <th>Payment ID</th>
                                <th>Date of Purchased</th>
                                <th></th>
                                <th>Deliveried
                                    <select value={filter} style={{ marginLeft: '4px', border: "none",width:'20px' }}
                                        className={filter === "true" ? 'check-user' : (filter === 'false' ? 'times-user' : '')}
                                        onChange={e => setFilter(e.target.value)}>
                                        <option value="" ></option>
                                        <option value='true' className="check-user">V</option>
                                        <option value='false' className="times-user">X</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                temp.map(items => (
                                    <tr key={items._id}>
                                        <td>{items.paymentID}</td>
                                        <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                        <td><Link to={`/history/${items._id}`}>View</Link></td>
                                        <td onClick={() => handleChangeDelivery(items._id, items.status)}
                                            style={isAdmin ? { cursor: 'pointer' } : {}}>
                                            {
                                                items.status ? <span className="check-user">V</span>
                                                    : <span className="times-user">X</span>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div >

    );
}
export default OrderHistory;