import { headers } from "next/headers";

export type Device = "pc" | "mobile";

const MOBILE_UA_REGEX = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;

export async function getDevice(): Promise<Device> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  return MOBILE_UA_REGEX.test(ua) ? "mobile" : "pc";
}
