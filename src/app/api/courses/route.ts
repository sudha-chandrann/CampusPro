import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    // Check if the user is authenticated
    if ( !user|| !user.firstName|| !user.id) {
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
        userId: user.id,
        title: title,
        author:user.fullName? user.fullName: user.firstName,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error("[courses]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
