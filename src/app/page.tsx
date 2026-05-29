import Link from "next/link";

type RouteNode = {
  href: string;
  label: string;
  desc?: string;
};

type RouteGroup = {
  group: string;
  desc: string;
  routes: RouteNode[];
  children?: RouteGroup[];
};

const ROUTE_TREE: RouteGroup[] = [
  {
    group: "(auth)",
    desc: "로그인 / 회원가입",
    routes: [
      { href: "/sign-in", label: "/sign-in", desc: "로그인" },
      { href: "/sign-up", label: "/sign-up", desc: "회원가입" },
    ],
  },
  {
    group: "(guest)",
    desc: "비로그인 사용자도 접근 가능",
    routes: [],
    children: [
      {
        group: "(with-menu)",
        desc: "하단 메뉴 있음",
        routes: [
          { href: "/home", label: "/home", desc: "홈" },
          { href: "/explore", label: "/explore", desc: "탐색" },
          { href: "/list", label: "/list", desc: "리스트" },
        ],
      },
      {
        group: "(without-menu)",
        desc: "하단 메뉴 없음",
        routes: [
          {
            href: "/detail/sample-1",
            label: "/detail/[id]",
            desc: "상세 (예시 id=sample-1)",
          },
          { href: "/search", label: "/search", desc: "검색" },
        ],
      },
    ],
  },
  {
    group: "(member)",
    desc: "로그인 필요",
    routes: [{ href: "/my", label: "/my", desc: "마이페이지" }],
  },
];

function RouteList({ routes }: { routes: RouteNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {routes.map((r) => (
        <li key={r.href}>
          <Link
            href={r.href}
            className="flex flex-col rounded border border-border px-4 py-3 hover:bg-chip-bg"
          >
            <span className="font-mono text-sm font-semibold">{r.label}</span>
            {r.desc ? (
              <span className="text-xs text-muted">{r.desc}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function GroupBlock({ group }: { group: RouteGroup }) {
  return (
    <section className="flex flex-col gap-2">
      <header>
        <h2 className="font-mono text-sm font-semibold">{group.group}</h2>
        <p className="text-xs text-muted">{group.desc}</p>
      </header>
      {group.routes.length > 0 ? <RouteList routes={group.routes} /> : null}
      {group.children ? (
        <div className="ml-3 flex flex-col gap-3 border-l border-border pl-4">
          {group.children.map((child) => (
            <GroupBlock key={child.group} group={child} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default function RouteIndex() {
  return (
    <main className="flex flex-1 flex-col gap-5 p-6">
      <header>
        <h1 className="text-lg font-semibold">개발용 라우트 인덱스</h1>
        <p className="text-xs text-muted">
          그룹별로 묶인 모든 페이지의 endpoint 링크.
        </p>
      </header>
      <div className="flex flex-col gap-5">
        {ROUTE_TREE.map((g) => (
          <GroupBlock key={g.group} group={g} />
        ))}
      </div>
    </main>
  );
}
