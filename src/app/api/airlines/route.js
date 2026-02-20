import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const iata = searchParams.get("iata");
  const icao = searchParams.get("icao");

  if (!name && !iata && !icao) {
    return NextResponse.json({ error: "Search parameter is required" }, { status: 400 });
  }

  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (iata) params.append("iata", iata);
  if (icao) params.append("icao", icao);

  const url = `https://api.api-ninjas.com/v1/airlines?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJA_KEY,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `API error: ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
