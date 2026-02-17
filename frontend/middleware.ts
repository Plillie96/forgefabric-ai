import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // If Clerk is configured, use Clerk auth middleware
  // Otherwise pass through (dev mode)
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkKey) {
    return NextResponse.next();
  }

  // When @clerk/nextjs is installed, replace this with:
  // import { authMiddleware } from "@clerk/nextjs";
  // export default authMiddleware({
  //   publicRoutes: ["/", "/api/webhook/clerk"],
  // });

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)"],
};
