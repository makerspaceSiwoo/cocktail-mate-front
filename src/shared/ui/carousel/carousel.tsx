"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";

import { cn } from "@/shared/lib";

export interface CarouselSlide {
  /** Image url that fills the slide via object-cover. */
  src: string;
  /** Alt text for the image. Defaults to "" (decorative). */
  alt?: string;
  /** Optional per-slide title shown in the bottom band. */
  title?: string;
  /** Optional per-slide description shown in the bottom band. */
  description?: string;
}

export interface CarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** REQUIRED. List of slides — each carries its own title/description. */
  slides: CarouselSlide[];
  /** Uncontrolled initial slide (0-based). Default 0. */
  defaultIndex?: number;
  /** Fires whenever the slide settles on a new index. */
  onIndexChange?: (next: number) => void;
  /** Auto-advance through slides. Default true. */
  autoSlide?: boolean;
  /** Auto-slide interval in ms. Default 4000. */
  slideInterval?: number;
}

const BAND_HEIGHT_PX = 60;

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      slides,
      defaultIndex = 0,
      onIndexChange,
      autoSlide = true,
      slideInterval = 4000,
      className,
      ...rest
    },
    ref,
  ) => {
    const count = slides.length;
    const loopable = count > 1;

    const plugins = React.useMemo(
      () =>
        autoSlide && loopable
          ? [
              Autoplay({
                delay: slideInterval,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]
          : [],
      [autoSlide, loopable, slideInterval],
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        loop: loopable,
        align: "start",
        startIndex: defaultIndex,
        watchDrag: loopable,
      },
      plugins,
    );

    const [selected, setSelected] = React.useState(defaultIndex);

    React.useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => {
        const i = emblaApi.selectedScrollSnap();
        setSelected(i);
        onIndexChange?.(i);
      };
      onSelect();
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
      };
    }, [emblaApi, onIndexChange]);

    const goTo = (i: number) => emblaApi?.scrollTo(i);
    const current = slides[selected];

    return (
      <div
        ref={ref}
        className={cn(
          // Default frame — overridden by any width/height utility passed
          // through className (tailwind-merge resolves the conflict in
          // favor of the later class).
          "w-[400px] h-[300px]",
          "relative flex flex-col overflow-hidden rounded-2xl bg-card-bg",
          className,
        )}
        aria-roledescription="carousel"
        aria-label={current?.title ?? "이미지 캐러셀"}
        {...rest}
      >
        {/* Image area — fills everything above the band. */}
        <div
          ref={emblaRef}
          className={cn(
            "min-h-0 flex-1 overflow-hidden",
            loopable ? "cursor-grab active:cursor-grabbing" : "",
          )}
        >
          <div className="flex h-full touch-pan-y">
            {slides.map((slide, i) => (
              <div
                key={`${slide.src}-${i}`}
                className="relative h-full w-full shrink-0 grow-0 basis-full"
                aria-roledescription="slide"
                aria-label={
                  slide.alt ??
                  slide.title ??
                  `슬라이드 ${i + 1}/${count}`
                }
                aria-hidden={i !== selected}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt ?? ""}
                  className="block h-full w-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom band — fixed 60px tall. Reads per-slide title/description.
            Always rendered so dots have a home; when loopable=false the
            dot area collapses, leaving just title/description. */}
        <div
          className="flex shrink-0 items-end justify-between gap-3 bg-black/85 px-4 py-2.5 text-white"
          style={{ height: BAND_HEIGHT_PX }}
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            {current?.title && (
              <span className="truncate font-serif text-base font-bold leading-tight tracking-[-0.02em] text-white">
                {current.title}
              </span>
            )}
            {current?.description && (
              <span className="truncate text-xs leading-snug text-white/80">
                {current.description}
              </span>
            )}
          </div>
          {loopable && (
            <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${i + 1}번 슬라이드`}
                  aria-current={i === selected ? "true" : undefined}
                  onClick={() => goTo(i)}
                  className={cn(
                    "size-1.5 rounded-full transition-colors cursor-pointer",
                    i === selected
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);
Carousel.displayName = "Carousel";
