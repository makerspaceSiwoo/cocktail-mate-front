import { getDevice } from "@/shared/lib/device";

import { HomeMobile } from "./_components/home.mobile";
import { HomePc } from "./_components/home.pc";

export default async function HomeRoute() {
  const device = await getDevice();
  return device === "pc" ? <HomePc /> : <HomeMobile />;
}
