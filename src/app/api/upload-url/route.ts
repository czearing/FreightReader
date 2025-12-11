import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_BUCKET = "uploads";
const DEFAULT_PREFIX = "incoming";

const normalizePath = (path: string | undefined) => {
  const cleaned = path?.replace(/^\/+/, "").trim();
  return cleaned ?? "";
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();

    let requestedPath: string | undefined;

    try {
      const body = (await request.json()) as { path?: string } | undefined;
      requestedPath = body?.path;
    } catch {
      // empty body is fine
    }

    const objectPath =
      normalizePath(requestedPath) || `${DEFAULT_PREFIX}/${crypto.randomUUID()}`;

    const { data, error } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .createSignedUploadUrl(objectPath, { upsert: true });

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Unable to create signed upload URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      bucket: DEFAULT_BUCKET,
      path: data.path,
      signedUrl: data.signedUrl,
      token: data.token,
      upsert: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Unexpected error" },
      { status: 500 },
    );
  }
}
