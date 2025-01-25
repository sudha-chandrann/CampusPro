import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import React from 'react'

interface CourseEnrollButtonProps {
    courseId:string;
    price:number;
}

function CourseEnrollButton({courseId,price}:CourseEnrollButtonProps) {
  return (
   <Button size="sm" variant="teacher" >
      Enroll for { formatPrice(price)}
   </Button>
  )
}

export default CourseEnrollButton
