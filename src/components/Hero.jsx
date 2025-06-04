import React, { useEffect } from 'react';
import Typewriter from 'typewriter-effect';

const Hero = () => {
  return (
    <section className="bg-pln-blue text-white text-center py-5">
      <div className="container">
        <h1 className="display-4 fw-bold">
          <Typewriter
            options={{
              strings: ['PLN UPT Tanjung Karang', 'Energi Untuk Kehidupan'],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
        <p className="lead">Memberikan layanan listrik terbaik untuk wilayah Lampung.</p>
      </div>
    </section>
  );
};

export default Hero;