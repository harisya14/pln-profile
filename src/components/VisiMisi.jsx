import React from 'react';

const VisiMisi = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-pln-blue mb-4 text-center">Visi & Misi</h2>
        <div className="row g-4 justify-content-center">
          {/* Visi */}
          <div className="col-md-6">
            <div className="card bg-light shadow-sm h-100">
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
            <div className="card bg-light shadow-sm h-100">
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
      </div>
    </section>
  );
};

export default VisiMisi;