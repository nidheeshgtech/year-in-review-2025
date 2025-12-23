import React, { useState } from 'react';
import gtechLogo from '../images/gtech-logo.svg';
import './Menu.scss';

const Menu = () => {
  const [showReelOpen, setShowReelOpen] = useState(false);

  const handleOpenShowReel = (e) => {
    e.preventDefault();
    setShowReelOpen(true);
  };

  const handleCloseShowReel = () => {
    setShowReelOpen(false);
  };

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
              <span className="view-show-reel">
                <a href="#section7" onClick={handleOpenShowReel}>View Show Reel</a>
              </span>
              <span>2025 Year in Review</span>
            </div>
          </div>
        </div>
      </div>

      {showReelOpen && (
        <div className="showreel-modal">
          <div className="showreel-backdrop" onClick={handleCloseShowReel} />
          <div className="showreel-content">
            <button
              className="showreel-close"
              aria-label="Close show reel"
              onClick={handleCloseShowReel}
            >
              ✕
            </button>
            <div className="showreel-video-wrapper">
              <iframe
                src="https://player.vimeo.com/video/1148749117?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="2025-Year-End-Review"
                className="showreel-iframe"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Menu;

