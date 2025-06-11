import React from 'react';
import './Footer.css';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import ReadyToApply from '../ReadyToApply/ReadyToApply';


const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <ReadyToApply />
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src='/logo-light.svg' alt='logo' />
            UniForm
          </div>
          <div className="footer-socials">
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <Twitter />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <Facebook />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <Instagram />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <Linkedin />
            </a>
          </div>
        </div>
        <div className="footer-columns">
          <div>
            <div className="footer-col-title">Product</div>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Universities</a>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
          </div>
          <div>
            <div className="footer-col-title">Support</div>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} UniForm. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;