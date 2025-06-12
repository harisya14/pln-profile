"use client"

import Link from "next/link";
import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  MutableRefObject,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Default images untuk hero section
const defaultImages: string[] = [
  "/images/hero1.jpg",
  "/images/hero6.jpg",
  "/images/hero5.jpg",
];

interface HeroSectionProps {
  images?: string[];
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ images = defaultImages, title, subtitle = "", ctaText, ctaLink = "" }, ref) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Typewriter state
    const [displayedSubtitle, setDisplayedSubtitle] = useState<string>("");
    const [isTypingDone, setIsTypingDone] = useState<boolean>(false);

    // Fungsi navigasi slide
    const goToSlide = (index: number) => {
      setCurrentIndex(index);
      resetInterval();
    };

    const goToPrev = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      resetInterval();
    };

    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      resetInterval();
    };

    const resetInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
    };

    useEffect(() => {
      if (!subtitle) {
        setDisplayedSubtitle("");
        setIsTypingDone(true);
        return;
      }

      setDisplayedSubtitle("");
      setIsTypingDone(false);

      const typingInterval = setInterval(() => {
        setDisplayedSubtitle((prev) => {
          if (prev.length < subtitle.length) {
            return prev + subtitle[prev.length];
          } else {
            clearInterval(typingInterval);
            setIsTypingDone(true);
            return prev;
          }
        });
      }, 50);

      return () => clearInterval(typingInterval);
    }, [subtitle]);

    useEffect(() => {
      resetInterval();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, []);

    return (
      <section
        ref={ref}
        className="relative w-full h-screen min-h-screen overflow-hidden bg-gradient-to-t from-primary to-white text-white"
      >
        {/* Slides */}
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            className={`
              absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out
              ${
                index === currentIndex
                  ? "opacity-100 scale-100 blur-0"
                  : "opacity-0 scale-105 blur-md pointer-events-none"
              }
            `}
          />
        ))}

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black/10 z-10 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg whitespace-pre-line">
            {title}
          </h2>
          <p className="text-lg lg:text-xl text-white mb-8 drop-shadow min-h-[2rem]">
            {displayedSubtitle}
            {!isTypingDone && <span className="animate-pulse">|</span>}
          </p>

          {ctaLink && (
            <Link
              href={ctaLink}
              className="bg-white text-primary font-semibold py-3 px-6 rounded-full shadow hover:bg-[#089cdc] transition"
            >
              {ctaText || "Browse Articles"}
            </Link>
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full cursor-pointer z-20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full cursor-pointer z-20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/70"
              } cursor-pointer`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
