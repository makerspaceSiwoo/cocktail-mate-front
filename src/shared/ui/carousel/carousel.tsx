"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/shared/lib";

export interface CarouselSlide {
  /** Image url that fills the slide via object-cover. Empty string → neutral placeholder. */
  src: string;
  /** Alt text for the image. Defaults to "" (decorative). */
  alt?: string;
  /** Optional per-slide title shown in the bottom band. */
  title?: string;
  /** Optional per-slide description shown in the bottom band. */
  description?: string;
  /** When set, the slide image becomes a link to this href (e.g. detail page). */
  href?: string;
}

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
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

    const onIndexChangeRef = React.useRef(onIndexChange);
    React.useEffect(() => {
      onIndexChangeRef.current = onIndexChange;
    });

    React.useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => {
        const i = emblaApi.selectedScrollSnap();
        setSelected(i);
        onIndexChangeRef.current?.(i);
      };
      onSelect();
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
      };
    }, [emblaApi]);

    const goTo = (i: number) => emblaApi?.scrollTo(i);
    const current = slides[selected];

    return (
      <div
        ref={ref}
        className={cn(
          // Default frame — overridden by any width/height utility passed
          // through className (tailwind-merge resolves the conflict in
          // favor of the later class).
          "h-[300px] w-[400px]",
          "bg-card-bg relative overflow-hidden rounded-2xl",
          className,
        )}
        aria-roledescription="carousel"
        aria-label={current?.title ?? "이미지 캐러셀"}
        {...rest}
      >
        {/* Image area — fills the entire frame. The band overlays the
            bottom 60px so the image stays visible behind it with blur. */}
        <div
          ref={emblaRef}
          className={cn(
            "absolute inset-0 overflow-hidden",
            loopable ? "cursor-grab active:cursor-grabbing" : "",
          )}
        >
          <div className="flex h-full touch-pan-y">
            {slides.map((slide, i) => {
              const label = slide.alt ?? slide.title ?? `슬라이드 ${i + 1}/${count}`;
              // src 가 비어 있으면 next/image 대신 중립 배경을 채운다
              // (Image 에 빈 문자열을 넘기면 에러가 난다).
              const image = slide.src ? (
                <Image
                  src={slide.src}
                  alt={slide.alt ?? ""}
                  fill
                  sizes="(max-width: 430px) 100vw, 430px"
                  className="pointer-events-none object-cover"
                  draggable={false}
                />
              ) : (
                <div className="bg-card-bg absolute inset-0" aria-hidden="true" />
              );
              return (
                <div
                  key={`${slide.src}-${i}`}
                  className="relative h-full w-full shrink-0 grow-0 basis-full"
                  aria-roledescription="slide"
                  aria-label={label}
                  aria-hidden={i !== selected}
                >
                  {slide.href ? (
                    // 드래그 후 오클릭은 embla 가 캡처 단계에서 click 을
                    // preventDefault 하고, next/link 는 defaultPrevented 면
                    // 이동을 건너뛴다. 별도 가드 불필요.
                    <Link
                      href={slide.href}
                      aria-label={label}
                      tabIndex={i === selected ? undefined : -1}
                      className="relative block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
                    >
                      {image}
                    </Link>
                  ) : (
                    image
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom band — overlays the image's lower 60px. backdrop-blur lets
            the photo show through softened, the semi-transparent dark tint
            keeps white text legible. Always rendered so dots have a home;
            when loopable=false the dot area collapses, leaving title/desc. */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 bg-black/35 px-4 py-2.5 text-white backdrop-blur-md"
          style={{ height: BAND_HEIGHT_PX }}
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            {current?.title ? (
              <span className="truncate font-serif text-base leading-tight font-bold tracking-[-0.02em] text-white">
                {current.title}
              </span>
            ) : null}
            {current?.description ? (
              <span className="truncate text-xs leading-snug text-white/80">
                {current.description}
              </span>
            ) : null}
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
                    "size-1.5 cursor-pointer rounded-full transition-colors",
                    i === selected ? "bg-white" : "bg-white/40 hover:bg-white/70",
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
