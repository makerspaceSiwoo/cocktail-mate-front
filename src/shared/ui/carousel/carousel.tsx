"use client";

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
  /** Controlled current slide (0-based). */
  index?: number;
  /** Uncontrolled initial slide (0-based). Default 0. */
  defaultIndex?: number;
  /** Fires whenever the slide changes (click, dot, drag, autoslide). */
  onIndexChange?: (next: number) => void;
  /** Auto-advance through slides. Default true. */
  autoSlide?: boolean;
  /** Auto-slide interval in ms. Default 4000. */
  slideInterval?: number;
  /** Optional alt text per image. Falls back to "이미지 N/M". */
  imageAlts?: string[];
  /** Minimum drag distance (px) before a swipe registers. Default 40. */
  dragThreshold?: number;
}

const DEFAULT_INTERVAL = 4000;
const DEFAULT_THRESHOLD = 40;
const TRANSITION = "transform 500ms ease-out";

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
      slideInterval = DEFAULT_INTERVAL,
      imageAlts,
      dragThreshold = DEFAULT_THRESHOLD,
      className,
      ...rest
    },
    ref,
  ) => {
    const count = images.length;
    const isControlled = indexProp !== undefined;
    const loopable = count > 1;

    // Map between real (0..count-1) and extended (0..count+1) indices.
    // Extended track is [last, ...images, first] when loopable so we can
    // animate past either end and snap back without a visible rewind.
    const extended = React.useMemo(
      () =>
        loopable
          ? [images[count - 1]!, ...images, images[0]!]
          : images,
      [images, loopable, count],
    );
    const extToReal = React.useCallback(
      (e: number) => {
        if (!loopable) return 0;
        if (e === 0) return count - 1;
        if (e === count + 1) return 0;
        return e - 1;
      },
      [loopable, count],
    );
    const realToExt = React.useCallback(
      (r: number) => (loopable ? r + 1 : r),
      [loopable],
    );

    const [extIdx, setExtIdx] = React.useState(() =>
      realToExt(isControlled ? indexProp! : defaultIndex),
    );
    const [transitionOn, setTransitionOn] = React.useState(true);

    // Sync from controlled prop.
    React.useEffect(() => {
      if (isControlled) {
        setExtIdx(realToExt(indexProp!));
        setTransitionOn(true);
      }
    }, [isControlled, indexProp, realToExt]);

    // After a snap (transitionOn=false), re-enable transition on the next
    // paint so subsequent advances animate.
    React.useLayoutEffect(() => {
      if (transitionOn) return;
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionOn(true));
      });
      return () => cancelAnimationFrame(id);
    }, [transitionOn]);

    const realIdx = isControlled ? indexProp! : extToReal(extIdx);

    // Advance helper — wraps using the extended track so the visual
    // direction is always forward.
    const advance = React.useCallback(
      (delta: 1 | -1) => {
        if (count === 0) return;
        if (!loopable) return;
        if (isControlled) {
          const nextReal = ((indexProp! + delta) % count + count) % count;
          onIndexChange?.(nextReal);
          return;
        }
        setExtIdx((prev) => {
          const next = prev + delta;
          // Fire onIndexChange with the real index this maps to.
          onIndexChange?.(extToReal(next));
          return next;
        });
      },
      [count, loopable, isControlled, indexProp, onIndexChange, extToReal],
    );

    const goTo = React.useCallback(
      (realTarget: number) => {
        if (count === 0) return;
        if (isControlled) {
          onIndexChange?.(realTarget);
        } else {
          setExtIdx(realToExt(realTarget));
          onIndexChange?.(realTarget);
        }
      },
      [count, isControlled, onIndexChange, realToExt],
    );

    // Drag (pointer events — works for mouse, touch, pen).
    const dragRef = React.useRef<{ startX: number; width: number } | null>(
      null,
    );
    const [dragPx, setDragPx] = React.useState(0);
    const isDragging = dragRef.current !== null;

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!loopable) return;
      dragRef.current = {
        startX: e.clientX,
        width: e.currentTarget.offsetWidth,
      };
      setDragPx(0);
      setTransitionOn(false);
      // Capture so pointer-up fires even outside the element.
      e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      setDragPx(e.clientX - dragRef.current.startX);
    };
    const finishDrag = (clientX: number) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = clientX - drag.startX;
      dragRef.current = null;
      setDragPx(0);
      setTransitionOn(true);
      if (Math.abs(dx) > dragThreshold) {
        // Drag left -> next slide; right -> previous.
        advance(dx < 0 ? 1 : -1);
      }
    };
    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) =>
      finishDrag(e.clientX);
    const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) =>
      finishDrag(e.clientX);

    // When animation lands on a clone slot, snap back to its real twin
    // without animation so the next advance keeps going forward.
    const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "transform") return;
      if (!loopable) return;
      if (extIdx === 0) {
        setTransitionOn(false);
        setExtIdx(count);
      } else if (extIdx === count + 1) {
        setTransitionOn(false);
        setExtIdx(1);
      }
    };

    // Auto-slide — pauses while dragging or when only one image.
    React.useEffect(() => {
      if (!autoSlide || !loopable || isDragging) return;
      const id = window.setInterval(() => advance(1), slideInterval);
      return () => window.clearInterval(id);
    }, [autoSlide, loopable, isDragging, slideInterval, advance]);

    // Final transform = extIdx step + active drag offset (px → calc).
    const transform = `translateX(calc(${-extIdx * 100}% + ${dragPx}px))`;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-[340px] h-[220px] overflow-hidden rounded-2xl bg-card-bg select-none",
          loopable ? "cursor-grab active:cursor-grabbing touch-pan-y" : "",
          className,
        )}
        aria-roledescription="carousel"
        aria-label={title ?? "이미지 캐러셀"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        {...rest}
      >
        {/* Slide track — extended with clone buffers for infinite loop. */}
        <div
          className="flex h-full w-full"
          style={{
            transform,
            transition: transitionOn ? TRANSITION : "none",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {extended.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-full w-full shrink-0"
              aria-roledescription="slide"
              aria-label={
                imageAlts?.[extToReal(i)] ??
                `${title ?? "이미지"} ${extToReal(i) + 1}/${count}`
              }
              aria-hidden={i !== extIdx}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={imageAlts?.[extToReal(i)] ?? ""}
                className="block h-full w-full object-cover pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Title / description overlay — z-stacked above the image. */}
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

        {/* Pagination dots — bottom-right, sitting above the title band. */}
        {loopable && (
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}번 슬라이드`}
                aria-current={i === realIdx ? "true" : undefined}
                onClick={() => goTo(i)}
                className={cn(
                  "size-1.5 rounded-full transition-colors cursor-pointer",
                  i === realIdx
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
