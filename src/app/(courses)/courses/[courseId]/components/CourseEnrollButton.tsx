'use client';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
interface CourseEnrollButtonProps {
    courseId:string;
    price:number;
}

function CourseEnrollButton({courseId,price}:CourseEnrollButtonProps) {
  const router =useRouter();
   const onclick=async()=>{
      try{
        await axios.post(`/api/courses/${courseId}/purchase`)
        toast.success(" the chapter is purchased successfully")
        router.refresh();
      }
      catch(error){
        console.error(error);
        toast.error("something  is  not found")

      }
      
   }

  return (
   <Button size="sm" variant="teacher" onClick={onclick} >
      Enroll for { formatPrice(price)}
   </Button>
  )
}

export default CourseEnrollButton
