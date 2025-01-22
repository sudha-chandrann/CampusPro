import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

// Ensure environment variables are available
if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  console.log("Mux credentials are missing")
  throw new Error("Mux credentials are missing");
}

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Parse and validate request body
    const {  ...values } = await req.json();


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

    // Update the chapter with provided values
    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    // Handle video updates
    if (values.videoUrl) {
      try {
        // Check if Mux data already exists for this chapter
        const existingMuxData = await db.muxData.findFirst({
          where: {
            chapterId: params.chapterId,
          },
        });

        // If Mux data exists, delete the old asset and record
        if (existingMuxData) {
          await mux.video.assets.delete(existingMuxData.assertId);
          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
            },
          });
        }

        const asset = await mux.video.assets.create({
          input: values.videoUrl,
          playback_policy: ["public"],
          test: false,
        });


        await db.muxData.create({
          data: {
            chapterId: params.chapterId,
            assertId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id || null,
          },
        });

      } catch (muxError) {
        console.error("[MUX_ASSET_ERROR]", muxError);
        return NextResponse.json(
          { error: "Failed to process video upload" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ID_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(
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

    const course = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!course) {
      return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
    }
    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId, courseId: params.courseId },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        }
      });
      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assertId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    await db.chapter.delete({
      where: { id: params.chapterId, courseId: params.courseId },
    });


    const publishedchapters=await db.chapter.findMany({
      where: { courseId: params.courseId, isPublished: true },
    })

    if(!publishedchapters.length){
      await db.course.update({
        where: { id: params.courseId },
        data: {
          isPublished: false
        }
        })
    }



    return NextResponse.json({ message: "chapter is deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ID_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
