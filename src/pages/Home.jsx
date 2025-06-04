import React from 'react';
import Hero from '../components/Hero';
import VisiMisi from '../components/VisiMisi';
import useScrollReveal from '../hooks/useScrollReveal';

const Home = () => {
  const heroRef = useScrollReveal();
  const visiMisiRef = useScrollReveal();

  return (
    <>
      {/* Hero Section */}
      <section 
        className="bg-pln-blue text-white text-center py-5 fade-in" 
        ref={heroRef}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">PLN UPT Tanjung Karang</h1>
          <p className="lead">Energi Untuk Kehidupan. Memberikan layanan listrik terbaik untuk wilayah Lampung.</p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-5 bg-light fade-in" ref={visiMisiRef}>
        <div className="container">
          <h2 className="text-pln-blue mb-4 text-center">Visi & Misi</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold text-pln-blue">Visi</h5>
                  <p className="mb-0">
                    Menjadi perusahaan penyedia tenaga listrik yang handal, andal, dan berkelanjutan demi mendukung kualitas kehidupan bangsa.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold text-pln-blue">Misi</h5>
                  <ul className="mb-0">
                    <li>Meningkatkan mutu dan keandalan pasokan listrik.</li>
                    <li>Memberikan pelayanan prima kepada pelanggan.</li>
                    <li>Mendorong efisiensi operasional dan pengelolaan aset yang optimal.</li>
                    <li>Membangun budaya kerja yang profesional dan inovatif.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lokasi Kantor */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-pln-blue mb-4 text-center fade-in" ref={useScrollReveal()}>
            Lokasi Kantor
          </h2>
          <div 
            className="ratio ratio-16x9 fade-in" 
            style={{ borderRadius: "8px", overflow: "hidden" }} 
            ref={useScrollReveal()}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.8468503142117!2d105.25424100000002!3d-5.440214500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da257ead9411%3A0x659abd8812931783!2sPLN%20UPT%20Tanjung%20Karang!5e0!3m2!1sen!2sid!4v1749022189651!5m2!1sen!2sid"
              title="Lokasi Kantor PLN UPT Tanjung Karang"
              allowfullscreen=""
              loading="lazy"
              style={{ border: "none" }}
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;