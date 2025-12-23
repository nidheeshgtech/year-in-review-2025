import React from 'react';
import gtechLogo from '../images/gtech-logo.svg';
import './Menu.scss';

const Menu = () => {
  return (
    <nav className="menu-nav">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6 col-md-6">
            <div className="menu-logo">
              <img src={gtechLogo} alt="GTECH" />
            </div>
          </div>
          <div className="col-6 col-md-6">
            <div className="menu-year-review gap-10">
              <span className="view-show-reel"><a href="#section7">View Show Reel</a></span>
              <span>2025 Year in Review</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;

