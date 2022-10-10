import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';
import Logo from '../../Images/logo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

const Header = (props) => {
    return (
        <>
            <nav className="navbar navbar-expand navbar-light my-2">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <img src={Logo} alt="Food truck Logo"/>
                    </Link>
                    <ul className="navbar-nav align-items-center">
                        <li className="nav-item active">
                            <Link to="/checkout" className="nav-link"><FontAwesomeIcon className="cart-icon" icon={faCartArrowDown} />
                            <span className="badge">{props.cart.length}</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin" className="nav-link">Admin</Link> 
                        </li>
                    </ul>
                </div>
            </nav>
            <hr className="hrcls"/>
        </>        
    );
};
export default Header;