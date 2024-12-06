// export { auth as middleware } from "@/auth"

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export async function middleware(req:NextRequest) {
  const secret = process.env.AUTH_SECRET;

  // Retrieve the token from the request
  const token = await getToken({ req, secret });

  // If the token is valid, allow access
  if (token) {
    return NextResponse.next();
  }

  // If no token, redirect to the login page or return a 401 response
  const url = req.nextUrl.clone();
  url.pathname = "/signin"; // Redirect to the login page
  return NextResponse.redirect(url);
}

// Define which routes require protection
export const config = {
  matcher: ["/"], // Replace with your protected routes
};
