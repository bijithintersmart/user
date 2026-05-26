import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip");

  if (!ip) {
    return NextResponse.json({ error: "IP address is required" }, { status: 400 });
  }

  const accessKey = process.env.IPSTACK_API_KEY || process.env.NEXT_PUBLIC_IPSTACK_API_KEY;
  
  if (!accessKey) {
    return NextResponse.json({ error: "API key is not configured" }, { status: 500 });
  }

  // Note: Standard API calls use http, paid plans support https
  const url = `http://api.ipstack.com/${ip}?access_key=${accessKey}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `API error: ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    
    if (data.success === false) {
       return NextResponse.json({ error: data.error.info || "API Error" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
