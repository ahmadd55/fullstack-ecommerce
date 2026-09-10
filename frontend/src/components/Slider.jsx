import { useState, useEffect, useCallback } from "react";
import slider from "../assets/slider.webp";
import slider1 from "../assets/slider1.webp";
import slider2 from "../assets/slider2.webp";

const SLIDES = [
  { src: slider, alt: "GulAhmed Ideas PK – Summer Collection" },
  { src: slider1, alt: "GulAhmed Ideas PK – Summer Collection" },
  { src: slider2, alt: "GulAhmed Ideas PK – Summer Collection" },
];

const AUTO_PLAY_INTERVAL = 4000;

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const goTo = (i) => setCurrent(i);

  useEffect(() => {
    if (total <= 1 || paused) return;
    const id = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(id);
  }, [total, paused, next]);

  
  if (total === 1) {
    return (
      <div className="slider">
        <img src={SLIDES[0].src} alt={SLIDES[0].alt} />
      </div>
    );
  }

  return (
    <div
      className="slider relative w-full overflow-hidden bg-black select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div key={i} className="min-w-full flex-shrink-0">
            <img
              src={slide.src}
              alt={slide.alt}
              draggable={false}
              className="object-cover
                         max-h-[50vw]
                         sm:max-h-[55vw]
                         md:max-h-[60vh]
                         lg:max-h-[70vh]
                         xl:max-h-[80vh]"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`
              rounded-full border-none cursor-pointer p-0
              transition-all duration-250
              ${i === current
                ? "w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white scale-110"
                : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/45"
              }
            `}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20 z-10">
        <div
          className="h-full bg-white"
          style={{
            width: `${((current + 1) / total) * 100}%`,
            transition: paused ? "none" : `width ${AUTO_PLAY_INTERVAL}ms linear`,
          }}
        />
      </div>
    </div>
  );
}