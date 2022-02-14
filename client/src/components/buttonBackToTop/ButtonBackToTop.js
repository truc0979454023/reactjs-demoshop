import React from 'react';
import IconUp from '../headers/icon/up.svg'

function ButtonBackToTop() {


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
            
        });
    }
    return (
        <button className="bttop bttop--activeHide" onClick={scrollToTop}>
            <img src={IconUp} alt="" width="25" className="icon-up"/>
        </button>
    );
}

export default ButtonBackToTop;