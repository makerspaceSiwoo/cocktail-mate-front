import Link from "next/link";

const ROUTES = [
  { href: "/", label: "/", group: "(guest)", desc: "랜딩 (현재 페이지)" },
  { href: "/login", label: "/login", group: "(auth)", desc: "로그인 placeholder" },
  { href: "/signup", label: "/signup", group: "(auth)", desc: "회원가입 placeholder" },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 p-8">
      <div className="text-center">
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Cocktail Mate
        </h1>
        <p className="mt-3 text-muted-foreground">
          자연어로 칵테일을 검색하세요.
        </p>
      </div>

      <div className="w-full max-w-md">
        <div
          className="mb-3 font-bold text-foreground"
          style={{ fontSize: 14, letterSpacing: "-0.02em" }}
        >
          개발용 라우트 링크
        </div>
        <ul className="flex flex-col gap-2">
          {ROUTES.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="flex items-center justify-between rounded-[14px] border border-[color:var(--border-soft)] bg-card px-4 py-3 transition-colors hover:bg-secondary"
              >
                <div className="flex flex-col">
                  <span
                    className="font-mono font-semibold text-foreground"
                    style={{ fontSize: 13 }}
                  >
                    {r.label}
                  </span>
                  <span
                    className="text-muted-foreground"
                    style={{ fontSize: 11 }}
                  >
                    {r.group} · {r.desc}
                  </span>
                </div>
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: 18 }}
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p
          className="mt-4 text-muted-foreground"
          style={{ fontSize: 11 }}
        >
          Storybook은 별도 포트:{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 font-mono">
            pnpm storybook
          </code>{" "}
          → http://localhost:6006
        </p>
      </div>
    </main>
  );
}
