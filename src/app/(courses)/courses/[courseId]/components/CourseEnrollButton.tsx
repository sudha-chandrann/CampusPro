'use client';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
interface CourseEnrollButtonProps {
    courseId:string;
    price:number;
}

function CourseEnrollButton({courseId,price}:CourseEnrollButtonProps) {
  const router =useRouter();
  const [isloading,setisloading]=useState(false);
   const onclick=async()=>{
      try{
        setisloading(true);
        await axios.post(`/api/courses/${courseId}/purchase`)
        toast.success(" the chapter is purchased successfully")
        router.refresh();
      }
      catch(error){
        console.error(error);
        toast.error("something  is  not found")

      }
      finally{
        setisloading(false);
      }
      
   }

  return (
   <Button size="sm" variant="teacher" onClick={onclick} disabled={isloading} >
      Enroll for { formatPrice(price)}
   </Button>
  )
}

export default CourseEnrollButton
