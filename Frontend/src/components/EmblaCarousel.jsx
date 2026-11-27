import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import LeftArrow from "../assets/svg/arrow-left.svg?react";

const EmblaCarousel = ({ children, options = {}, showControls = true }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "start",
      containScroll: "trimSnaps",
      slidesToScroll: "auto",
      ...options, // Allow custom options to override defaults
    },
    [WheelGesturesPlugin()]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("init", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("init", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="overflow-scroll">
      <div className="embla relative">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">{children}</div>
        </div>

        {showControls && (
          <>
            <button
              className={`absolute left-1 top-1/2 z-10 -translate-y-1/2 cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-blue-50/90 p-2 shadow-lg transition-opacity duration-300 ${
                !canScrollPrev ? "opacity-0" : "opacity-100"
              }`}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
            >
              <LeftArrow className="h-8 w-8" />
            </button>
            <button
              className={`absolute right-1 top-1/2 z-10 -translate-y-1/2 cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-blue-50/90 p-2 shadow-lg transition-opacity duration-300 ${
                !canScrollNext ? "opacity-0" : "opacity-100"
              }`}
              onClick={scrollNext}
              disabled={!canScrollNext}
            >
              <LeftArrow className="rotate-180 h-8 w-8" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmblaCarousel;
