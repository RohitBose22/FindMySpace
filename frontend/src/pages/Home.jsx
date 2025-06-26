import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/properties?location=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="overlay">
          <h1 className="hero-title">Find Your Dream Space</h1>
          <p className="hero-subtitle">Buy, Rent or Lease Flats, PGs, and Messes with Ease</p>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, area, or property type"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Why Choose FindMySpace?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Verified Listings</h3>
            <p>All properties are thoroughly verified for authenticity and safety.</p>
          </div>
          <div className="feature-card">
            <h3>Direct Messaging</h3>
            <p>Contact property owners directly through our real-time chat system.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Filters</h3>
            <p>Use advanced filters to find the perfect property for your needs.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>🏠 FindMySpace</h2>
            <p>Your trusted partner for property solutions</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={24} color="#0A66C2" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} color="#E4405F" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={24} color="#1877F2" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={24} color="#1DA1F2" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FindMySpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
