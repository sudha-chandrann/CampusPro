// src/app/(dashboard)/teacher/courses/CoursesClient.tsx (Client Component)
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DataTable } from './DataTable';
import { columns } from './Columns';


export default function CoursesClient({ data }) {
  return (
    <div className='p-4'>
      <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link>
      <div className='mt-5'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
