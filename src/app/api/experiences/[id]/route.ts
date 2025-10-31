import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Experience from "@/lib/models/Experience";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await dbConnect();

  try {
    const experience = await Experience.findById(id);

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: experience });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Invalid ID or server error" },
      { status: 400 }
    );
  }
}
