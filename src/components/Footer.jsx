import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-pln-yellow text-dark py-3">
      <div className="container">
        <div className="row">
          {/* Logo & Deskripsi Singkat */}
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="d-flex align-items-center">
              <img src="/logo-pln.png" alt="Logo PLN" width="40" className="me-2" />
              <h5 className="mb-0 fw-bold">PLN UPT Tanjung Karang</h5>
            </div>
            <p className="mt-3 text-dark-50">
              Energi Untuk Kehidupan. Memberikan layanan listrik terbaik untuk wilayah X.
            </p>
          </div>

          {/* Kontak */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Kontak Kami</h5>
            <ul className="list-unstyled text-dark-50">
              <li className="mb-2"><i className="bi bi-envelope me-2"></i> info@plnupttkr.co.id</li>
              <li className="mb-2"><i className="bi bi-telephone me-2"></i> (0721) 486288</li>
              <li><i className="bi bi-geo-alt me-2"></i> Jl. Basuki Rahmat No.19, Gedong Pakuon, Kec. Telukbetung Selatan, Kota Bandar Lampung, Lampung 35116</li>
            </ul>
          </div>

          {/* Link Cepat */}
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">Link Cepat</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/" className="text-dark text-decoration-none">Beranda</a></li>
              <li className="mb-2"><a href="/about" className="text-dark text-decoration-none">Tentang Kami</a></li>
              <li className="mb-2"><a href="/services" className="text-dark text-decoration-none">Layanan</a></li>
              <li><a href="/contact" className="text-dark text-decoration-none">Kontak</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-pln-blue text-white text-center py-2">
        &copy; {new Date().getFullYear()} PLN UPT Tanjung Karang. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;