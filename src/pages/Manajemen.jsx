import React from 'react';

const Manajemen = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-pln-blue mb-4 text-center">Struktur Organisasi</h2>
        <p className="text-center mb-5 text-muted">Berikut adalah struktur organisasi PLN UPT Tanjung Karang:</p>

        <div className="row g-4 justify-content-center">
          {/* Kepala UPT */}
          <div className="col-md-2 col-sm-4 col-6">
            <div className="card h-100 shadow-sm">
              <img 
                src="/kepala_upt.jpg" 
                alt="Kepala UPT" 
                className="card-img-top" 
                style={{ height: "150px", objectFit: "cover" }} 
              />
              <div className="card-body p-3">
                <h5 className="fw-bold text-pln-blue">Kepala UPT</h5>
                <p className="mb-0">Ir. Suryadi Prayoga</p>
              </div>
            </div>
          </div>

          {/* Manager Jaringan */}
          <div className="col-md-2 col-sm-4 col-6">
            <div className="card h-100 shadow-sm">
              <img 
                src="/manager_jaringan.jpg" 
                alt="Manager Jaringan" 
                className="card-img-top" 
                style={{ height: "150px", objectFit: "cover" }} 
              />
              <div className="card-body p-3">
                <h5 className="fw-bold text-pln-blue">Manager Jaringan</h5>
                <p className="mb-0">Antoni Putra</p>
              </div>
            </div>
          </div>

          {/* Manager Operasi */}
          <div className="col-md-2 col-sm-4 col-6">
            <div className="card h-100 shadow-sm">
              <img 
                src="/manager_operasi.jpg" 
                alt="Manager Operasi" 
                className="card-img-top" 
                style={{ height: "150px", objectFit: "cover" }} 
              />
              <div className="card-body p-3">
                <h5 className="fw-bold text-pln-blue">Manager Operasi</h5>
                <p className="mb-0">Rina Wijaya</p>
              </div>
            </div>
          </div>

          {/* Manager Pelayanan */}
          <div className="col-md-2 col-sm-4 col-6">
            <div className="card h-100 shadow-sm">
              <img 
                src="/manager_pelayanan.jpg" 
                alt="Manager Pelayanan" 
                className="card-img-top" 
                style={{ height: "150px", objectFit: "cover" }} 
              />
              <div className="card-body p-3">
                <h5 className="fw-bold text-pln-blue">Manager Pelayanan</h5>
                <p className="mb-0">Dudi Suryadi</p>
              </div>
            </div>
          </div>

          {/* Staff Pendukung */}
          <div className="col-md-2 col-sm-4 col-6">
            <div className="card h-100 shadow-sm">
              <img 
                src="/staff_pendukung.jpg" 
                alt="Staff Pendukung" 
                className="card-img-top" 
                style={{ height: "150px", objectFit: "cover" }} 
              />
              <div className="card-body p-3">
                <h5 className="fw-bold text-pln-blue">Staff Pendukung</h5>
                <p className="mb-0">Seksi Administrasi, Teknik, Pelanggan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manajemen;