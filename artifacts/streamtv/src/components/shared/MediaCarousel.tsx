import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MediaCard } from "./MediaCard";
import { cn } from "@/lib/utils";

interface MediaCarouselProps {
  title: string;
  items: any[];
  type: "movie" | "series" | "live";
  className?: string;
}

export function MediaCarousel({ title, items, type, className }: MediaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    direction: "rtl" // CRITICAL for Arabic
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!items || items.length === 0) return null;

  return (
    <div className={cn("relative py-6 group/carousel", className)}>
      <div className="px-4 md:px-8 mb-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white relative inline-block">
          {title}
          <div className="absolute -bottom-2 right-0 w-1/2 h-1 bg-primary rounded-full" />
        </h2>
        
        <div className="hidden md:flex gap-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
          <button
            onClick={scrollNext} // In RTL, next means going left conceptually in Embla
            disabled={!nextBtnEnabled}
            className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-white disabled:opacity-30 hover:bg-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-white disabled:opacity-30 hover:bg-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden px-4 md:px-8" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6">
          {items.map((item) => {
            const id = item.stream_id || item.series_id;
            const title = item.name;
            const image = item.stream_icon || item.cover;
            
            return (
              <div key={id} className="flex-[0_0_40%] sm:flex-[0_0_25%] md:flex-[0_0_20%] lg:flex-[0_0_15%] min-w-0">
                <MediaCard
                  id={id}
                  type={type}
                  title={title}
                  image={image}
                  rating={item.rating}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
