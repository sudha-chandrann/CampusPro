import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }


        if (!params.courseId || !params.chapterId) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // Verify the user owns the course before allowing updates
        const course = await db.course.findUnique({
            where: { id: params.courseId, userId },
        });

        if (!course) {
            return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
        }

        const chapter = await db.chapter.findUnique({
            where: { id: params.chapterId, courseId:params.courseId },
        });

        const muxData = await db.muxData.findUnique({
            where: { chapterId: params.chapterId }
        })
        if(!muxData|| !chapter || !chapter.title || !chapter.description || !chapter.videoUrl){
            return NextResponse.json({ error: "Missing required fields" }, { status: 403 });
        }
  
        const updatedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true,
            },
        });


        return NextResponse.json(updatedChapter, { status: 200 });
    } catch (error) {
        console.error("[Chapter_ID_Publish_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
