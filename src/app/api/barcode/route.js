import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "";
  const type = searchParams.get("type") || "code128";

  if (!text.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const params = new URLSearchParams({ text: text.trim(), type });
  const url = `https://api.api-ninjas.com/v1/barcodegenerate?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJA_KEY,
        Accept: "image/png",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `API error (${res.status}): ${text}` },
        { status: res.status }
      );
    }

    const imageBuffer = await res.arrayBuffer();
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
