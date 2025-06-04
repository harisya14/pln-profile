import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const About = () => {
  const refVisi = useScrollReveal();
  const refMisi = useScrollReveal();
  const refPeta = useScrollReveal();

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-pln-blue mb-4 text-center">Visi & Misi</h2>
        <div className="row g-4 justify-content-center">
          {/* Visi */}
          <div className="col-md-6">
            <div className="fade-in card bg-light shadow-sm h-100" ref={refVisi}>
              <div className="card-body p-3">
                <h5 className="fw-bold text-pln-blue">Visi</h5>
                <p className="mb-0">
                  Menjadi perusahaan penyedia tenaga listrik yang handal, andal, dan berkelanjutan demi mendukung kualitas kehidupan bangsa.
                </p>
              </div>
            </div>
          </div>

          {/* Misi */}
          <div className="col-md-6">
            <div className="fade-in card bg-light shadow-sm h-100" ref={refMisi}>
              <div className="card-body p-3">
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

        {/* Lokasi Kantor */}
        <section className="py-5 mt-5">
          <h2 className="text-pln-blue mb-4 text-center">Lokasi Kantor</h2>
          <div className="fade-in ratio ratio-16x9" style={{ borderRadius: "8px", overflow: "hidden" }} ref={refPeta}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.8468503142117!2d105.25424100000002!3d-5.440214500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da257ead9411%3A0x659abd8812931783!2sPLN%20UPT%20Tanjung%20Karang!5e0!3m2!1sen!2sid!4v1749022189651!5m2!1sen!2sid"
              title="Lokasi Kantor PLN UPT Tanjung Karang"
              allowfullscreen=""
              loading="lazy"
              style={{ border: "none" }}
            ></iframe>
          </div>
        </section>
      </div>
    </section>
  );
};

export default About;