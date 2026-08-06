import { HomePage } from "./_components/home";

export default function HomeRoute() {
  // 데이터 fetch 는 HomePage 안의 각 Suspense 경계(추천·랭킹)가 들고 있다.
  return <HomePage />;
}
