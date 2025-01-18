import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { attachmentId: string; courseId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Verify course ownership
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!courseOwner || courseOwner.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to this course" },
        { status: 403 }
      );
    }

    // Delete attachment
    const attachment = await db.attachment.findUnique({
      where: {
        id: params.attachmentId,
      },
    });

    if (!attachment || attachment.courseId !== params.courseId) {
      return NextResponse.json(
        { error: "Attachment not found or doesn't belong to this course" },
        { status: 404 }
      );
    }

    await db.attachment.delete({
      where: {
        id: params.attachmentId,
      },
    });

    return NextResponse.json(
      { message: "Attachment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COURSE_ATTACHMENT_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
