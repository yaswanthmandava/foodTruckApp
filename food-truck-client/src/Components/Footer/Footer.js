import React from 'react';
import './Footer.css'
import WhiteLogo from '../../Images/logo2.png';
const Footer = () => {
    return (
        <footer className="bg-dark py-1">
            <div className="container">
                <div className="row footer-top py-1">
                    <div className="col-md-6 mb-1">
                        <img src={WhiteLogo} alt="Food truck Logo"/>
                    </div>
                </div>

                <div className="footer-bottom d-flex justify-content-between align-items-center">
                    <small className="text-secondary">Copyright &copy;  2022 Online Food </small>
                    <ul className="list-inline">
                        <li className="list-inline-item ml-3"><a href="" >Privacy Policy</a></li>
                        <li className="list-inline-item  ml-3"><a href="">Terms of Use</a></li>
                        <li className="list-inline-item  ml-3"><a href="">Pricing</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;