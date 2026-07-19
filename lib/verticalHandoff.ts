import type { AuthUser } from "@/lib/api";
import { Capacitor } from "@capacitor/core";
import {
  getStoredAccessToken,
  getStoredActiveBranchId,
  getStoredActiveTenantId,
  getStoredBranchScope,
  getStoredDemoRole,
  getStoredHrisTier,
  getStoredUser,
} from "@/lib/mobile/session";

type Vertical = "cafe" | "hris" | "retail";

const verticalOrigins: Record<Vertical, string> = {
  cafe: process.env.NEXT_PUBLIC_CAFE_WEB_URL ?? "https://omnia-cafe-web.vercel.app",
  hris: process.env.NEXT_PUBLIC_HRIS_WEB_URL ?? "https://omnia-hris-web.vercel.app",
  retail: process.env.NEXT_PUBLIC_RETAIL_WEB_URL ?? "https://omnia-retail-web.vercel.app",
};

function encodePayload(value: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function resolveVerticalTarget(pathname: string): { vertical: Vertical; path: string } | null {
  if (pathname === "/portal/fnb/cafe" || pathname.startsWith("/portal/fnb/cafe/")) return { vertical: "cafe", path: pathname };
  if (/^\/portal\/(?:professional-services|jasa-profesional|internal-operations)\/hris(?:\/|$)/.test(pathname) || pathname === "/portal/hris" || pathname.startsWith("/portal/hris/")) {
    return { vertical: "hris", path: pathname };
  }
  if (pathname === "/portal/retail-and-stores/retail-store" || pathname.startsWith("/portal/retail-and-stores/retail-store/")) {
    return { vertical: "retail", path: pathname };
  }
  return null;
}

export function buildVerticalHandoffUrl(vertical: Vertical, destinationPath: string) {
  const accessToken = getStoredAccessToken();
  const user = getStoredUser<AuthUser>();
  if (!accessToken || !user) return `${verticalOrigins[vertical]}/login`;
  const payload = encodePayload({
    version: 1,
    expiresAt: Date.now() + 60_000,
    accessToken,
    user,
    tenantId: getStoredActiveTenantId(),
    branchId: getStoredActiveBranchId(),
    branchScope: getStoredBranchScope(),
    demoRole: getStoredDemoRole(),
    hrisTier: getStoredHrisTier(),
    appShell: Capacitor.isNativePlatform(),
    destinationPath,
  });
  return `${verticalOrigins[vertical]}/auth/handoff#session=${payload}`;
}
