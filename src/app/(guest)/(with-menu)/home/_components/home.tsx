import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardBody } from "@/shared/ui/card";
import { Carousel } from "@/shared/ui/carousel";
import { Chip } from "@/shared/ui/chip";
import {
  ArrowUpRightIcon,
  BellIcon,
  ChevronRightIcon,
  GlassIcon,
  SearchIcon,
  StarFilledIcon,
} from "@/shared/ui/icon/icons";
import { Text } from "@/shared/ui/text";

const heroSlides = [
  {
    src: "/images/negroni-example.jpg",
    alt: "네그로니 칵테일",
    title: "오늘의 밸런스",
    description: "쌉쌀한 향과 단단한 피니시",
  },
  {
    src: "/images/mojito-example.jpg",
    alt: "모히토 칵테일",
    title: "상쾌한 한 잔",
    description: "민트와 라임으로 가볍게 시작",
  },
  {
    src: "/images/cosmopolitan-example.jpg",
    alt: "코스모폴리탄 칵테일",
    title: "시트러스 무드",
    description: "선명한 산미와 부드러운 단맛",
  },
];

const tasteChips = ["전체", "상큼", "달콤", "쌉쌀", "무알콜"];

const recommendations = [
  {
    name: "Mojito",
    desc: "라임, 민트, 탄산의 청량한 조합",
    image: "/images/mojito-example.jpg",
    tag: "상큼",
    rating: "4.8",
  },
  {
    name: "Negroni",
    desc: "진과 캄파리가 만드는 깊은 쌉쌀함",
    image: "/images/negroni-example.jpg",
    tag: "쌉쌀",
    rating: "4.7",
  },
];

const quickActions = [
  { label: "취향 탐색", href: "/explore", desc: "맛 프로필로 찾기" },
  { label: "전체 리스트", href: "/list", desc: "칵테일 모아보기" },
];

export function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-8">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Text as="p" variant="caption" tone="muted" weight="medium">
            CocktailMate
          </Text>
          <Text as="h1" variant="display" className="mt-1 leading-tight">
            오늘 마실 한 잔을
            <br />
            같이 골라볼까요?
          </Text>
        </div>
        <button
          type="button"
          aria-label="알림"
          className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card-bg text-text"
        >
          <BellIcon size={20} aria-hidden />
        </button>
      </header>

      <Button asChild variant="secondary" size="lg" fullWidth>
        <Link href="/search" aria-label="칵테일 검색으로 이동">
          <SearchIcon size={20} aria-hidden />
          칵테일 이름, 재료 검색
        </Link>
      </Button>

      <section aria-label="추천 배너" className="flex flex-col gap-3">
        <SectionTitle title="오늘의 추천" href="/list" />
        <Carousel
          slides={heroSlides}
          className="h-[232px] w-full rounded-2xl"
          slideInterval={5000}
        />
      </section>

      <section aria-label="취향 필터" className="flex flex-col gap-3">
        <SectionTitle title="취향으로 빠르게 보기" />
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {tasteChips.map((label, index) => (
            <Chip key={label} label={label} active={index === 0} />
          ))}
        </div>
      </section>

      <section aria-label="나를 위한 추천" className="flex flex-col gap-3">
        <SectionTitle title="나를 위한 Pick" href="/explore" />
        <div className="flex flex-col gap-3">
          {recommendations.map((cocktail) => (
            <RecommendationCard key={cocktail.name} {...cocktail} />
          ))}
        </div>
      </section>

      <section aria-label="빠른 이동" className="flex flex-col gap-3">
        <SectionTitle title="다음으로 할 일" />
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="h-full rounded-xl">
                <CardBody className="flex h-full flex-col gap-3 p-4">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-chip-bg text-text">
                    <GlassIcon size={18} aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1">
                    <Text as="h3" variant="subtitle">
                      {action.label}
                    </Text>
                    <Text as="p" variant="caption" tone="muted">
                      {action.desc}
                    </Text>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Text as="h2" variant="title">
        {title}
      </Text>
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted"
        >
          더보기
          <ChevronRightIcon size={14} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

function RecommendationCard({
  name,
  desc,
  image,
  tag,
  rating,
}: {
  name: string;
  desc: string;
  image: string;
  tag: string;
  rating: string;
}) {
  return (
    <Card className="rounded-xl">
      <Link href={`/detail/${name.toLowerCase()}`} className="flex gap-4 p-3">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-banner-bg">
          <Image
            src={image}
            alt={`${name} 칵테일`}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <Text as="h3" variant="subtitle" truncate>
                {name}
              </Text>
              <ArrowUpRightIcon size={16} className="shrink-0 text-muted" />
            </div>
            <Text as="p" variant="caption" tone="muted" className="line-clamp-2">
              {desc}
            </Text>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{tag}</Badge>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-text">
              <StarFilledIcon size={13} className="text-accent" aria-hidden />
              {rating}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
