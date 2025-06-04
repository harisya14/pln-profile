import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-pln-blue text-white shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center text-white" href="/">
          <img src="/logo-pln.png" alt="Logo PLN" width="40" className="me-2" />
          <span className="fs-5 fw-bold">PLN UPT Tanjung Karang</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link text-white text-decoration-none"
                style={{ transition: 'color 0.3s ease' }}
                onMouseEnter={() => console.log('Mouse Enter')}
                onMouseLeave={() => console.log('Mouse Leave')}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className="nav-link text-white text-decoration-none"
                style={{ transition: 'color 0.3s ease' }}
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/manajemen"
                className="nav-link text-white text-decoration-none"
                style={{ transition: 'color 0.3s ease' }}
              >
                Manajemen
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className="nav-link text-white text-decoration-none"
                style={{ transition: 'color 0.3s ease' }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;