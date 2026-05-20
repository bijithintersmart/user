import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Flight code is required" }, { status: 400 });
  }

  const access_key = process.env.AVIATIONSTACK_API_KEY;
  if (!access_key) {
    return NextResponse.json({ error: "AviationStack API key is missing on the server" }, { status: 500 });
  }

  const params = new URLSearchParams({
    access_key: access_key,
  });

  if (query.length === 6 || query.length === 7) {
      // Likely ICAO like DLH400 or BAW123
      params.append("flight_icao", query.toUpperCase());
  } else {
      // Likely IATA like LH400 or AA100
      params.append("flight_iata", query.toUpperCase());
  }

  const url = `http://api.aviationstack.com/v1/flights?${params.toString()}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `API error: ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    
    // aviationstack returns data in a 'data' array
    if (data && data.data) {
        return NextResponse.json(data.data);
    }

    return NextResponse.json([]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
