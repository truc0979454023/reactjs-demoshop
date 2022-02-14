import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'



function Login() {
    const [user, setUser] = useState({
        email: '', password: ''
    })
    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })

    }

    const loginSubmit = async e => {
        e.preventDefault()
        try {
            await axios.post('/user/login', { ...user })

            localStorage.setItem('fristLogin', true)

            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const passField = document.querySelector("#show-input");
    const showBtn = document.querySelector('.show-btn__password');

    const handleOnOffPassword=()=>{
        if(passField && showBtn){

            if (passField.type === "password") {
                passField.type = "text";
                showBtn.firstChild.classList.add("fa-eye-slash");
                showBtn.firstChild.classList.remove("fa-eye");
                return;
       
            } if(passField.type === "text") {
                passField.type = "password";
                showBtn.firstChild.classList.add("fa-eye");
                showBtn.firstChild.classList.remove("fa-eye-slash");
                return;
            }
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={loginSubmit}>
                <h2>Login</h2>
                <input type="email" name="email" required placeholder="Email"
                    value={user.email} onChange={onChangeInput} />
                <div className="password-form">
                    <input id="show-input" type="password" name="password" required autoComplete="on" placeholder="Password"
                        value={user.password} onChange={onChangeInput} />
                    <span onClick={handleOnOffPassword} className="show-btn__password"><i className="fas fa-eye "></i></span>
                </div>
                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="./register">Register</Link>
                </div>
            </form>
        </div>
    )
}

export default Login