// TODO: Configure NextAuth.js with credentials provider
// - Set up JWT strategy
// - Add sign-in, sign-up logic
// - Configure session callbacks
// - Note: in this Next.js version, dynamic route params are Promises (await params)

export async function GET() {
  return Response.json({ message: "Auth endpoint - not yet implemented" }, { status: 501 });
}

export async function POST() {
  return Response.json({ message: "Auth endpoint - not yet implemented" }, { status: 501 });
}
