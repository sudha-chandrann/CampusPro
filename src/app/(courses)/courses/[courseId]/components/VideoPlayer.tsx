"use client";
import { cn } from '@/lib/utils';
import MuxPlayer from '@mux/mux-player-react';
import { Loader2, Lock } from 'lucide-react';
import React, { useState } from 'react'
import { useConfettiStore } from '../../../../../../hooks/use-confetti-store';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface VideoPlayerProps {
    chapterId:string;
    courseId:string;
    title:string;
    nextChapterId:string;
    playbackId:string;
    isLocked:boolean;
    completeOnEnd:boolean;
}

function VideoPlayer(
    {
        chapterId,
        courseId,
        title,
        nextChapterId,
        playbackId,
        isLocked,
        completeOnEnd
    }:VideoPlayerProps
) {
    const [isReady,setIsReady]=useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();  
    const onclick = async () => {
      try {
       if(completeOnEnd){
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });
        
        if (!nextChapterId) {
          confetti.onOpen();
        }
        toast.success("Progress updated");
        router.refresh()
        if ( nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
       }

      } catch {
        toast.error("Something went wrong");
      } 
    };
  return (
    <div className='relative aspect-video'>
       {
       !isReady && !isLocked && (
            <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
               <Loader2 className=' text-white h-8 w-8 animate-spin text-secondary'/>
            </div>
        )
       }
       {
        isLocked && (
            <div className='absolute inset-0 flex items-center justify-center
             bg-slate-800 flex-col gap-y-2 text-secondary'>
                <Lock className='h-10 w-10'/>
                <p className='text-sm'>
                  This chapter  is locked
                </p>
            </div>
        )
       }
       {
         !isLocked && (
           <MuxPlayer
           title={title}
           className={cn(!isReady && "hidden")}
           onCanPlay={()=>{
            setIsReady(true);
           }}
           onEnded={onclick}
           playbackId={playbackId}
           />
        )
       }
    </div>
  )
}

export default VideoPlayer
