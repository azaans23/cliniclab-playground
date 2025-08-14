import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log(process.env.NEXT_PUBLIC_RETELL_API_KEY);
    const response = await fetch(
      "https://api.retellai.com/v2/create-web-call",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: "agent_7873e77c8e1ea2119b442133ef", // Demo agent ID
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data.access_token);
  } catch (error) {
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 }
    );
  }
}
