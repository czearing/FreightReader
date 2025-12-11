import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const jobId =
    (body?.jobId as string | undefined) ??
    `job-${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;

  return NextResponse.json({
    jobId,
    status: "processing",
    received: {
      path: body?.path,
      bucket: body?.bucket,
      name: body?.name,
    },
  });
}
