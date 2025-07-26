import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fen, seed } = body;

    if (!fen || !seed) {
      return NextResponse.json(
        { error: "Missing required fields: fen and seed" },
        { status: 400 },
      );
    }

    // Make request to the backend
    const response = await fetch("http://localhost:8000/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fen: fen,
        seed: seed,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in move API route:", error);
    return NextResponse.json(
      { error: "Failed to get move from backend" },
      { status: 500 },
    );
  }
}
