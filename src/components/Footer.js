import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-5 mt-5" style={{ background: 'var(--podcast-bg-secondary)', borderTop: '1px solid var(--podcast-border)' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3">
              <i className="fa-solid fa-podcast fa-2x text-primary me-3"></i>
              <div>
                <h4 className="mb-1 fw-bold">Revivo</h4>
                <p className="text-muted mb-0">Press play . Power Up</p>
              </div>
            </div>
            <p className="text-muted">It's More than a podcast -it's a mindset Whether you're chasing success, struggling with doubt or just needed that weekly spark - this is Where you level up <b>No fluff.just fuel</b></p>
          </div>
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><NavLink to="/" className="text-decoration-none footer-link">Home</NavLink></li>
              <li className="mb-2"><NavLink to="podcasts" className="text-decoration-none footer-link">Podcasts</NavLink></li>
              <li className="mb-2"><NavLink to="contact" className="text-decoration-none footer-link">Contact</NavLink></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Start A Conversation </h6>
            <div className="d-flex gap-3">
              <a className="text-muted fs-4" href="https://x.com" aria-label="X"><i className="fa-brands fa-x-twitter"></i></a>
              <a className="text-muted fs-4" href="https://www.instagram.com" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a className="text-muted fs-4" href="https://www.youtube.com" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <hr className="my-4" style={{ borderColor: 'var(--podcast-border)' }} />
        <div className="text-center text-muted">
          <small>© {new Date().getFullYear()} Revivo. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;