"use client";

import React, { useEffect, useRef, useState } from "react";

interface MapProps {
  url: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({ url, className = "" }) => {
  return (
    <div className={`relative w-full h-0 pb-[56.25%] ${className}`}>
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps Embed"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: "8px",
        }}
      ></iframe>
    </div>
  );
};

const MapSection: React.FC = () => {
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.8468503142117!2d105.25424100000002!3d-5.440214500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da257ead9411%3A0x659abd8812931783!2sPLN%20UPT%20Tanjung%20Karang!5e0!3m2!1sen!2sid!4v1749022189651!5m2!1sen!2sid";

  const headingRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [titleInView, setTitleInView] = useState(false);
  const [mapInView, setMapInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setTitleInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    const current = headingRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMapInView(entry.isIntersecting);
        setReady(true);
      },
      { threshold: 0.25 }
    );

    const current = mapRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const baseTransition = "transition-all duration-1000 ease-in-out";

  const headingClass = titleInView
    ? `opacity-100 translate-y-0 scale-100 ${baseTransition}`
    : `opacity-0 -translate-y-4 scale-90 ${baseTransition}`;

  const mapClass = ready
    ? mapInView
      ? `opacity-100 ${baseTransition}`
      : `opacity-0 ${baseTransition}`
    : "opacity-0";

  return (
    <section className="py-6 bg-secondary md:py-8 lg:py-10">
      <div className="container mx-auto px-4">
        <div
          ref={headingRef}
          className={`text-center transform ${headingClass}`}
        >
          <h2 className="text-3xl font-extrabold mb-6 text-primary md:mb-8 lg:text-4xl lg:mb-10">
            Temukan Kami
          </h2>
        </div>

        <div
          ref={mapRef}
          className={`max-w-4xl mx-auto mb-6 shadow-lg rounded-lg overflow-hidden ${mapClass}`}
        >
          <Map url={mapUrl} />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
