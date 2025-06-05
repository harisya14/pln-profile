import React from "react";

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
        style={{ position: "absolute", top: 0, left: 0, borderRadius: "8px" }}
      ></iframe>
    </div>
  );
};

const MapSection: React.FC = () => {
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.8468503142117!2d105.25424100000002!3d-5.440214500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da257ead9411%3A0x659abd8812931783!2sPLN%20UPT%20Tanjung%20Karang!5e0!3m2!1sen!2sid!4v1749022189651!5m2!1sen!2sid";

  return (
    <section className="py-6 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Temukan Kami</h2>
        <div className="max-w-4xl mx-auto mb-6 shadow-lg rounded-lg overflow-hidden">
          <Map url={mapUrl} />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
