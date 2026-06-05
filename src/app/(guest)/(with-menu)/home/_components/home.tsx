"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Carousel } from "@/shared/ui/carousel";
import { BellIcon, ChevronRightIcon, SearchIcon } from "@/shared/ui/icon/icons";
import { Text } from "@/shared/ui/text";

const heroSlides = [
  {
    title: "코스모폴리탄",
    proof: "도수 20%",
    href: "/detail/cosmopolitan",
    src: "/images/cosmopolitan-example.jpg",
    alt: "코스모폴리탄 칵테일",
    description: "상큼한 라임과 크랜베리의 조화, 세련된 분위기를 완성하는 글라스",
  },
  {
    title: "코스모폴리탄",
    proof: "도수 20%",
    href: "/detail/cosmopolitan",
    src: "/images/cosmopolitan-example.jpg",
    alt: "코스모폴리탄 칵테일",
    description: "상큼한 라임과 크랜베리의 조화, 세련된 분위기를 완성하는 글라스",
  },
  {
    title: "코스모폴리탄",
    proof: "도수 20%",
    href: "/detail/cosmopolitan",
    src: "/images/cosmopolitan-example.jpg",
    alt: "코스모폴리탄 칵테일",
    description: "상큼한 라임과 크랜베리의 조화, 세련된 분위기를 완성하는 글라스",
  },
  {
    title: "코스모폴리탄",
    proof: "도수 20%",
    href: "/detail/cosmopolitan",
    src: "/images/cosmopolitan-example.jpg",
    alt: "코스모폴리탄 칵테일",
    description: "상큼한 라임과 크랜베리의 조화, 세련된 분위기를 완성하는 글라스",
  },
  {
    title: "코스모폴리탄",
    proof: "도수 20%",
    href: "/detail/cosmopolitan",
    src: "/images/cosmopolitan-example.jpg",
    alt: "코스모폴리탄 칵테일",
    description: "상큼한 라임과 크랜베리의 조화, 세련된 분위기를 완성하는 글라스",
  },
];

const picks = [
  {
    name: "블루 하와이",
    src: "/images/cosmopolitan-example.jpg",
    bg: "bg-pick-blue",
  },
  {
    name: "피나 콜라다",
    src: "/images/margarita-example.jpg",
    bg: "bg-pick-ivory",
  },
  {
    name: "모히토",
    src: "/images/mojito-example.jpg",
    bg: "bg-pick-mint",
  },
  {
    name: "진 토닉",
    src: "/images/negroni-example.jpg",
    bg: "bg-pick-sage",
  },
  {
    name: "패션프루트 마티니",
    src: "/images/margarita-example.jpg",
    bg: "bg-pick-yellow",
  },
  {
    name: "마티니",
    src: "/images/negroni-example.jpg",
    bg: "bg-pick-sage",
  },
  {
    name: "트로피컬 선셋",
    src: "/images/cosmopolitan-example.jpg",
    bg: "bg-pick-orange",
  },
  {
    name: "애플 진 피즈",
    src: "/images/mojito-example.jpg",
    bg: "bg-pick-green",
  },
];

export function HomePage() {
  const [heroIndex, setHeroIndex] = React.useState(0);
  const currentHero = heroSlides[heroIndex] ?? heroSlides[0]!;

  return (
    <main className="bg-bg flex flex-1 flex-col px-4 pt-5 pb-7">
      <header className="flex h-15 items-center justify-between">
        <Text as="h1" variant="display" className="font-serif text-[25px] leading-none">
          CocktailMate
        </Text>
        <div className="text-text flex items-center gap-4">
          <button
            type="button"
            aria-label="알림"
            className="inline-flex size-8 items-center justify-center rounded-full"
          >
            <BellIcon size={22} aria-hidden />
          </button>
          <Link
            href="/search"
            aria-label="칵테일 검색"
            className="inline-flex size-8 items-center justify-center rounded-full"
          >
            <SearchIcon size={24} aria-hidden />
          </Link>
        </div>
      </header>

      <section aria-labelledby="today-title" className="mt-2">
        <SectionHeader id="today-title" title="오늘의 추천" />
        <Link
          href={currentHero.href}
          className="group bg-banner-bg relative mt-3 block overflow-hidden rounded-2xl"
        >
          <Carousel
            slides={heroSlides}
            className="h-[220px] w-full rounded-2xl"
            onIndexChange={setHeroIndex}
            showPagination={false}
            slideInterval={5000}
            renderOverlay={({ slide, selectedIndex, slideCount }) => {
              const active = heroSlides[selectedIndex] ?? heroSlides[0]!;
              return (
                <>
                  <div className="from-home-hero-from via-home-hero-via to-home-hero-to absolute inset-0 z-10 bg-gradient-to-br opacity-95" />
                  <div className="absolute inset-0 z-10 bg-black/10" />
                  <div className="relative z-20 flex h-full flex-col justify-end px-5 py-5 text-white">
                    <Text
                      as="h2"
                      variant="display"
                      className="text-[26px] leading-tight text-white"
                    >
                      {slide?.title}
                    </Text>
                    <p className="mt-2 line-clamp-1 text-[12px] leading-snug text-white/85">
                      {slide?.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-full bg-black/35 px-4 py-1.5 text-xs font-bold text-white">
                        {active.proof}
                      </span>
                      <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-bold text-white">
                        {selectedIndex + 1}/{slideCount}
                      </span>
                    </div>
                  </div>
                </>
              );
            }}
          />
        </Link>
        <CarouselDots activeIndex={heroIndex} count={heroSlides.length} />
      </section>

      <section aria-labelledby="pick-title" className="mt-5">
        <SectionHeader id="pick-title" title="나를 위한 Pick" href="/list" />
        <div className="mt-5 grid grid-cols-4 gap-x-5 gap-y-6">
          {picks.map((pick) => (
            <CocktailDisc key={pick.name} {...pick} />
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionHeader({ id, title, href }: { id: string; title: string; href?: string }) {
  return (
    <div className="flex h-9 items-center justify-between">
      <Text as="h2" id={id} variant="title" className="text-[17px]">
        {title}
      </Text>
      {href ? (
        <Link href={href} className="text-muted inline-flex items-center gap-1 text-xs font-medium">
          더보기
          <ChevronRightIcon size={13} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

function CarouselDots({ activeIndex, count }: { activeIndex: number; count: number }) {
  return (
    <div className="flex h-[30px] items-center justify-center gap-1.5">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={
            index === activeIndex
              ? "bg-accent h-1.5 w-[18px] rounded-full"
              : "bg-border-soft size-1.5 rounded-full"
          }
          aria-hidden
        />
      ))}
    </div>
  );
}

function CocktailDisc({ name, src, bg }: { name: string; src: string; bg: string }) {
  return (
    <Link href={`/detail/${encodeURIComponent(name)}`} className="group">
      <span className="flex flex-col items-center gap-2">
        <span className={`relative size-16 overflow-hidden rounded-full ${bg}`} aria-hidden>
          <Image
            src={src}
            alt=""
            fill
            sizes="64px"
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-60"
          />
        </span>
        <span className="text-text min-h-[32px] max-w-[72px] text-center text-xs leading-snug break-keep">
          {name}
        </span>
      </span>
    </Link>
  );
}
