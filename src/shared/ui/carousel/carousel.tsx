"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";

import { cn } from "@/shared/lib";

export interface CarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** REQUIRED. List of image URLs. Each one fills the carousel frame. */
  images: string[];
  /** Optional overlay title shown on top of every slide. */
  title?: string;
  /** Optional overlay description shown on top of every slide. */
  description?: string;
  /** Uncontrolled initial slide (0-based). Default 0. */
  defaultIndex?: number;
  /** Fires whenever the slide settles on a new index. */
  onIndexChange?: (next: number) => void;
  /** Auto-advance through slides. Default true. */
  autoSlide?: boolean;
  /** Auto-slide interval in ms. Default 4000. */
  slideInterval?: number;
  /** Optional alt text per image. Falls back to "이미지 N/M". */
  imageAlts?: string[];
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      images,
      title,
      description,
      defaultIndex = 0,
      onIndexChange,
      autoSlide = true,
      slideInterval = 4000,
      imageAlts,
      className,
      ...rest
    },
    ref,
  ) => {
    const count = images.length;
    const loopable = count > 1;

    // Embla owns the loop, drag, snap, and autoplay logic. We just bind
    // a ref and read the selected index for the pagination dots.
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

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-[340px] h-[220px] overflow-hidden rounded-2xl bg-card-bg",
          className,
        )}
        aria-roledescription="carousel"
        aria-label={title ?? "이미지 캐러셀"}
        {...rest}
      >
        {/* Embla viewport — drag, loop, autoplay all handled internally. */}
        <div
          ref={emblaRef}
          className={cn(
            "h-full w-full overflow-hidden",
            loopable ? "cursor-grab active:cursor-grabbing" : "",
          )}
        >
          <div className="flex h-full touch-pan-y">
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative h-full w-full shrink-0 grow-0 basis-full"
                aria-roledescription="slide"
                aria-label={
                  imageAlts?.[i] ?? `${title ?? "이미지"} ${i + 1}/${count}`
                }
                aria-hidden={i !== selected}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={imageAlts?.[i] ?? ""}
                  className="block h-full w-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Title / description band — dark overlay for legibility over photos.
            Always rendered when loopable so the dot pagination has a home;
            without title/description it shrinks to just hold the dots. */}
        {(title || description || loopable) && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 bg-black/55 backdrop-blur-sm px-4 py-3 text-white">
            <div className="pointer-events-none flex min-w-0 flex-col gap-1">
              {title && (
                <span className="font-serif text-xl font-bold tracking-[-0.02em] text-white">
                  {title}
                </span>
              )}
              {description && (
                <span className="text-xs leading-snug text-white/85">
                  {description}
                </span>
              )}
            </div>
            {loopable && (
              <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
                {images.map((_, i) => (
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
        )}
      </div>
    );
  },
);
Carousel.displayName = "Carousel";
