import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data") || "";
  const format = searchParams.get("format") || "png";
  const fg_color = searchParams.get("fg_color") || "000000";
  const bg_color = searchParams.get("bg_color") || "ffffff";

  if (!data.trim()) {
    return NextResponse.json({ error: "Data is required" }, { status: 400 });
  }

  // Note: the size param causes the API to return 502 — omit it and scale client-side
  const params = new URLSearchParams({ data, format, fg_color, bg_color });
  const url = `https://api.api-ninjas.com/v1/qrcode?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJA_KEY,
        Accept: "image/png",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `API error: ${text}` }, { status: res.status });
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
