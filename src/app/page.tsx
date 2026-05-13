import Link from "next/link";

const ROUTES = [
  { href: "/", group: "(root)", desc: "이 페이지 — 개발용 라우트 인덱스" },
  { href: "/login", group: "(auth)", desc: "로그인" },
  { href: "/signup", group: "(auth)", desc: "회원가입" },
  { href: "/me", group: "(member)", desc: "마이페이지 — 로그인 필요" },
];

export default function RouteIndex() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-lg font-semibold">개발용 라우트 인덱스</h1>
      <ul className="flex flex-col gap-2">
        {ROUTES.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="flex flex-col rounded border px-4 py-3 hover:bg-gray-50"
            >
              <span className="font-mono text-sm font-semibold">{r.href}</span>
              <span className="text-xs text-gray-500">
                {r.group} · {r.desc}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
