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
      <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div
          ref={textRef}
          className={`font-light text-gray-500 sm:text-lg dark:text-gray-400 transform transition duration-1000 ease-in-out ${
            textInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-primary dark:text-white">
            We didn't reinvent the wheel
          </h2>
          <p className="mb-4">
            We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.
          </p>
          <p>
            We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick.
          </p>
        </div>
        <div
          ref={imageRef}
          className={`grid grid-cols-2 gap-4 mt-8 transform transition duration-1000 ease-in-out ${
            imageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <img
            className="w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
            alt="office content 1"
          />
          <img
            className="mt-4 w-full lg:mt-10 rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
            alt="office content 2"
          />
        </div>
      </div>
    </section>
  );
};

export default ContentSection;