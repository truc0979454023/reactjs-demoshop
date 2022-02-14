import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    
                    <div className="footer-col">
                        <h4>Get help</h4>
                        <ul>
                            <li><a href="#!">about us</a></li>
                            <li><a href="#!">our services</a></li>
                            <li><a href="#!">privacy policy</a></li>
                            <li><a href="#!">affiliate program</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            {/* <li><a href="#!">FAQ</a></li> */}
                            <li><a href="#!">Shipping</a></li>
                            <li><a href="#!">Address</a></li>
                            <li><a href="#!">Order status</a></li>
                            <li><a href="#!">Payment options</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Online shop</h4>
                        <ul>
                            <li><a href="#!">http://localhost:3000</a></li>
                            {/* <li><a href="#!"></a></li> */}
                            <li><a href="#!">Other</a></li>
                            {/* <li><a href="#!">Dress</a></li> */}
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Follow us</h4>
                        <div className="social-links">
                            <><a href="#!"><i className="fab fa-facebook-messenger"></i></a></>
                            <><a href="#!"><i className="fab fa-instagram"></i></a></>
                            <><a href="#!"><i className="fab fa-twitter"></i></a></>
                            <><a href="#!"><i className="fab fa-linkedin-in"></i></a></>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;