import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/server";
import type { MembershipApplication } from "@/lib/types";

function isValidApplication(payload: Partial<MembershipApplication>) {
  return Boolean(
    payload.fullName &&
      payload.className &&
      payload.section &&
      payload.age &&
      payload.gender &&
      payload.phone &&
      payload.email &&
      payload.address &&
      payload.reason &&
      payload.skills &&
      payload.interests
  );
}

export async function POST(request: Request) {
  const payload = (await request.json()) as MembershipApplication;

  if (!isValidApplication(payload)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const application = {
    ...payload,
    createdAt: new Date().toISOString()
  };

  const db = getAdminDb();

  if (db) {
    await db.collection("membershipRequests").add(application);
  }

  return NextResponse.json({
    ok: true,
    savedToFirebase: Boolean(db)
  });
}
