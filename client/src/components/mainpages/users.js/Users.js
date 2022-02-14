import React, { useState, useContext, useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import './Users.css'
import axios from 'axios'

export default function Users() {
    const state = useContext(GlobalState)
    const [users] = state.userAPI.users
    const [userProfile] = state.userAPI.userProfile
    const [callback, setCallback] = state.userAPI.callback
    const [token] = state.token

    const [checkAdmin, setCheckAdmin] = useState(0)
    const [num, setNum] = useState(0)
    const [editUser, setEditUser] = useState([])
    const [id, setId] = useState()
    const [form, setForm] = useState(false)

    const [filter, setFilter] = useState('')
    const [temp, setTemp] = useState([])


    useEffect(() => {
        users.forEach(user => {
            if (user._id === id) {
                setEditUser(user)
                setCheckAdmin(user.role === 1 ? true : false)
            }
        })
    }, [users, id])

    useEffect(() => {
        setTemp(users)
        if (filter === 'true') {
            setTemp(users => (
                users.filter(user => (
                    user.role === 1
                ))
            ))
        }
        if (filter === 'false') {
            setTemp(users => (
                users.filter(user => (
                    user.role === 0
                ))
            ))
        }
    }, [filter, users])

    const deleteUser = async (id) => {
        if (window.confirm("Do you want to delete the user.")) {
            try {
                await axios.delete(`/user/delete_user/${id}`, {
                    headers: { Authorization: token }
                })
                setCallback(!callback)
            } catch (err) {
                alert(err.response.data.msg)
            }
        }
    }

    const updateRole = (id) => {
        setId(id)
        setForm(true)
    }

    const handleCheck = () => {
        setCheckAdmin(!checkAdmin)
        setNum(num + 1)
    }

    const handleUpdateRole = async () => {
        let role = checkAdmin ? 1 : 0
        if (num % 2 !== 0) {
            try {
                await axios.patch(`/user/update_role/${editUser._id}`, { role }, {
                    headers: { Authorization: token }
                })
                setId('')
                setForm(false)
                setNum(0)
                setCallback(!callback)
            } catch (err) {
                alert(err.response.data.msg)
            }
        }
    }

    const formUpdateRole = () => {
        return (
            <div className="form-update-role">
                <h3 className="form-update-role__title">Edit Role User</h3>
                <div className="form-group">
                    <label htmlFor="name" >Name</label>
                    <input type="text" id="name" defaultValue={editUser.name} disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="email" >Email</label>
                    <input type="text" id="email" defaultValue={editUser.email} disabled />
                </div>

                <div className="form-group">
                    <input type="checkbox" id="isAdmin" checked={checkAdmin}
                        style={{ width: '20px', height: '20px' }}
                        onChange={handleCheck} />
                    <label className="label-is-admin" htmlFor="isAdmin" >
                        isAdmin
                    </label>
                </div>
                <span className="form-update-role__btn" onClick={handleUpdateRole}>Update</span>

            </div>
        )
    }

    return (
        <div className="user-container"  >

            <table className="table-user">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>
                            Admin
                            <select value={filter} style={{ marginLeft: '4px', border: "none", width: '20px' }}
                                className={filter === "true" ? 'check-user' : (filter === 'false' ? 'times-user' : '')}
                                onChange={e => setFilter(e.target.value)}>
                                <option value="" ></option>
                                <option value='true' className="check-user">V</option>
                                <option value='false' className="times-user">X</option>
                            </select>
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        temp.map((user, index) => (
                            <tr key={user._id} >

                                <th>{index + 1}</th>
                                <th>{user._id}</th>
                                <th>{user.name}</th>
                                <th>{user.email}</th>
                                <th>
                                    {
                                        user.role ?
                                            (

                                                user.root ?

                                                    <span style={{ color: 'darkcyan' }}>
                                                        <span className="check-user">V</span>

                                                        Root
                                                    </span> :
                                                    <span className=" check-user">V</span>

                                            ) : <span className="times-user">X</span>

                                    }
                                </th>
                                <th>
                                    {
                                        (user.root || user.email === userProfile.email) ? ''
                                            : <div className="action-icon">
                                                <span onClick={() => updateRole(user._id)}>
                                                    <i className="fas fa-edit edit-user"></i>
                                                </span>

                                                <span onClick={() => deleteUser(user._id)}>
                                                    <i className="fas fa-trash-alt trash-user" title="Remove"></i>
                                                </span>
                                            </div>
                                    }
                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                form && formUpdateRole()
            }
        </div>
    )
}
