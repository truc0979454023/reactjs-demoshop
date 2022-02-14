import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import './Filter.css';

function Filters() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [category,setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search

    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

    return (
        <div className="filter-menu__category">
            <div className="category-list"  >
                <option className="category-item" name="category" value="" onClick={handleCategory}> All</option>
                {
                    categories.map((category) => (
                        <option onClick={handleCategory} value={"category=" + category._id} key={category._id}
                            className="category-item"> {category.name}</option>
                    ))
                }
            </div>
            <div className="filter_menu">
                {/* <div>

                    <span>Filters:</span>
                    <select name="category" value={category} onChange={handleCategory} >
                        <option value="">All Products</option>
                        {
                            categories.map(category => (
                                <option value={"category=" + category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }

                    </select>
                </div> */}
                <input className="filter_menu__input" type="text" value={search} placeholder="Enter your search!"
                    onChange={e => setSearch(e.target.value.toLocaleLowerCase())} />

                <div className="filter_menu__sort" >
                    <select value={sort} onChange={e => setSort(e.target.value)}  >
                        <option value="sort=-createdAt">Newest</option>
                        <option value="sort=createdAt">Oldest</option>
                        <option value="sort=-saleOff">Sale off</option>
                        <option value="sort=-sold">Best sales</option>
                        <option value="sort=-price">Price: Hight-Low</option>
                        <option value="sort=price">Price: Low-Hight</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Filters;