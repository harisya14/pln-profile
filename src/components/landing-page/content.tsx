"use client";

import React, { useEffect, useRef, useState } from "react";

const ContentSection: React.FC = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const [textInView, setTextInView] = useState(false);
  const [imageInView, setImageInView] = useState(false);

  useEffect(() => {
    const textObserver = new IntersectionObserver(
      ([entry]) => setTextInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    const currentText = textRef.current;
    if (currentText) textObserver.observe(currentText);
    return () => {
      if (currentText) textObserver.unobserve(currentText);
    };
  }, []);

  useEffect(() => {
    const imageObserver = new IntersectionObserver(
      ([entry]) => setImageInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    const currentImage = imageRef.current;
    if (currentImage) imageObserver.observe(currentImage);
    return () => {
      if (currentImage) imageObserver.unobserve(currentImage);
    };
  }, []);

  return (
    <section className="bg-secondary dark:bg-gray-900">
      <div className="gap-16 items-center py-12 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-20 lg:px-6">
        {/* Visi Misi Text */}
        <div
          ref={textRef}
          className={`font-light text-gray-700 sm:text-lg dark:text-gray-300 transform transition duration-700 ease-in-out ${
            textInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <h2 className="mb-6 text-4xl tracking-tight font-extrabold text-blue-800 dark:text-white">
            Visi dan Misi Perusahaan
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Visi</h3>
            <p>
              Menjadi perusahaan penyedia layanan ketenagalistrikan yang andal, profesional,
              dan berdaya saing tinggi untuk mendukung pembangunan nasional berkelanjutan.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Misi</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Menyediakan infrastruktur listrik yang andal dan efisien.</li>
              <li>Mengembangkan sumber daya manusia yang kompeten dan berintegritas tinggi.</li>
              <li>Mendorong inovasi dan penggunaan teknologi ramah lingkungan.</li>
              <li>Memberikan pelayanan terbaik kepada pelanggan dan masyarakat.</li>
              <li>Berkomitmen terhadap keselamatan kerja dan keberlanjutan lingkungan.</li>
            </ul>
          </div>
        </div>

        {/* Gambar */}
        <div
          ref={imageRef}
          className={`grid grid-cols-2 gap-4 mt-10 lg:mt-0 transform transition duration-700 ease-in-out ${
            imageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <img
            className="w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
            alt="kantor pln"
          />
          <img
            className="mt-4 w-full lg:mt-10 rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
            alt="tim kerja"
          />
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
