"use client";

import * as React from "react";

import { cn } from "@/shared/lib";

export interface CarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** REQUIRED. List of image URLs. Each one fills the carousel frame. */
  images: string[];
  /** Optional overlay title shown on top of every slide. */
  title?: string;
  /** Optional overlay description shown on top of every slide. */
  description?: string;
  /** Controlled current slide. */
  index?: number;
  /** Uncontrolled initial slide. Default 0. */
  defaultIndex?: number;
  /** Fires whenever the slide changes (click, dot, autoslide). */
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
      index: indexProp,
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
    const isControlled = indexProp !== undefined;
    const [internal, setInternal] = React.useState(defaultIndex);
    const current = isControlled ? indexProp : internal;
    const safeCurrent = count === 0 ? 0 : Math.min(current, count - 1);

    const setIndex = React.useCallback(
      (next: number) => {
        if (count === 0) return;
        const wrapped = ((next % count) + count) % count;
        if (!isControlled) setInternal(wrapped);
        onIndexChange?.(wrapped);
      },
      [count, isControlled, onIndexChange],
    );

    // Auto-slide: only when more than one image and the prop is on.
    React.useEffect(() => {
      if (!autoSlide || count <= 1) return;
      const id = window.setInterval(
        () => setIndex(safeCurrent + 1),
        slideInterval,
      );
      return () => window.clearInterval(id);
    }, [autoSlide, count, safeCurrent, setIndex, slideInterval]);

    return (
      <div
        ref={ref}
        className={cn(
          // Default size matches the design's hero-card slot. Override via
          // className when you need a different frame.
          "relative w-[340px] h-[220px] overflow-hidden rounded-2xl bg-card-bg",
          className,
        )}
        aria-roledescription="carousel"
        aria-label={title ?? "이미지 캐러셀"}
        {...rest}
      >
        {/* Slide track — fills the fixed-size root. */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${safeCurrent * 100}%)` }}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-full w-full shrink-0"
              aria-roledescription="slide"
              aria-label={
                imageAlts?.[i] ?? `${title ?? "이미지"} ${i + 1}/${count}`
              }
              aria-hidden={i !== safeCurrent}
            >
              {/* Larger images crop to the frame via object-cover. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={imageAlts?.[i] ?? ""}
                className="block h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Title / description overlay — z-stacked above the image with a
            solid dark band so text stays legible over any photo. Uses
            literal black/white instead of theme tokens because the band
            sits on the image, not on the surface. */}
        {(title || description) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 bg-black/55 backdrop-blur-sm px-4 py-3 text-white">
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
        )}

        {/* Pagination dots — moved to top-right so they never overlap the
            title band at the bottom. */}
        {count > 1 && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}번 슬라이드`}
                aria-current={i === safeCurrent ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={cn(
                  "size-1.5 rounded-full transition-colors cursor-pointer",
                  i === safeCurrent
                    ? "bg-white"
                    : "bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
Carousel.displayName = "Carousel";
