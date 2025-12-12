import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = ["/", "/auth", "/auth/callback"];
const DASHBOARD_ROUTE = "/dashboard";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => request.cookies.get(name)?.value,
      set: (name, value, options) => {
        response.cookies.set(name, value, options);
      },
      remove: (name, options) => {
        response.cookies.set(name, "", { ...options, expires: new Date(0) });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isDashboard = path.startsWith(DASHBOARD_ROUTE);

  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (user && (path === "/" || path === "/auth" || path === "/auth/")) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_ROUTE;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
