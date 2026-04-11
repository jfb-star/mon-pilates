// TODO: Implement session endpoints
// - GET: List available sessions (filterable by date, courseType, instructor)
// - POST: Admin-only - create a new session from a schedule
// - Include participant count and availability info

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Query sessions with filters (date range, courseTypeId, instructorId, status)
  return Response.json({ message: "Sessions GET - not yet implemented" }, { status: 501 });
}

export async function POST(request: NextRequest) {
  // TODO: Admin auth check, create session linked to schedule
  return Response.json({ message: "Sessions POST - not yet implemented" }, { status: 501 });
}
