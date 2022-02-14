import React, { useState, useContext } from 'react';
import { GlobalState } from '../../../GlobalState'
import axios from 'axios';

function Categories() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [category, setCategory] = useState('')
    const [token] = state.token
    const [callback, setCallback] = state.categoriesAPI.callback
    const [onEdit, setOnEdit] = useState(false)
    const [id, setID] = useState('')


    const createCategory = async e => {
        e.preventDefault()
        try {
            if (onEdit) {
                await axios.put(`/api/category/${id}`, { name: category }, {
                    headers: { Authorization: token }
                })
            }
            else {
                await axios.post('/api/category', { name: category }, {
                    headers: { Authorization: token }
                })
            }
            setOnEdit(false)
            setCategory('')
            setCallback(!callback)
        }
        catch (err) {
            console.log(err.response)
            alert(err.response.statusText)
        }
    }


    const editCategory = async (id, name) => {
        setID(id)
        setCategory(name)
        setOnEdit(true)
    }


    const deleteCategory = async id => {
        if (window.confirm("Do you want to delete the category.")) {
            try {
                await axios.delete(`/api/category/${id}`, {
                    headers: { Authorization: token }
                })
                setCallback(!callback)
            } catch (err) {
                alert(err.response.statusText)
            }
        }
    }


 
    return (
        <div className="categories">
            <form onSubmit={createCategory}>
                <label htmlFor="category">Category</label>
                <input type="text" name="category" value={category} required
                    onChange={e => setCategory(e.target.value)} />

                <button type="submit" >{onEdit ? "Update" : "Create"}</button>
            </form>

            <div className="col">
                {
                    categories.map(category => (
                        <div className="row" key={category._id}>
                            <p>{category.name}</p>
                            <div>
                                <button onClick={() => editCategory(category._id, category.name)}>Edit</button>
                                <button onClick={() => deleteCategory(category._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    );
}

export default Categories;