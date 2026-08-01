// 로컬/배포 API 토글 dev 러너.
//
//   pnpm dev                  → 배포 API 사용 (기본)
//   API_SERVER=local pnpm dev → 로컬 API 사용
//
// NEXT_PUBLIC_API_URL 을 직접 export 한 경우 그 값을 최우선으로 존중한다.
// (Next.js 는 process.env 에 이미 있는 값을 .env* 로 덮어쓰지 않으므로, 여기서
//  자식 프로세스 env 에 넣어주면 .env.local 값보다 우선 적용된다.)
import { spawn } from "node:child_process";

const LOCAL_API = "http://localhost:8000";
const DEPLOYED_API = "https://api.cocktail-mate.com";

const useLocal = process.env.API_SERVER === "local";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? (useLocal ? LOCAL_API : DEPLOYED_API);

const label = useLocal ? "local" : "deployed";
console.log(`▶ [dev] API_SERVER=${label} → NEXT_PUBLIC_API_URL=${apiUrl}`);

const child = spawn("next", ["dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_PUBLIC_API_URL: apiUrl },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
