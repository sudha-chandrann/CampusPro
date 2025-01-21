import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { title } = body;

    // Validate the title
    if (!title || typeof title !== "string") {
      return new NextResponse("Invalid title", { status: 400 });
    }

    // Create a new course in the database
    const course = await db.course.create({
      data: {
        userId: userId,
        title: title,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error("[courses]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
