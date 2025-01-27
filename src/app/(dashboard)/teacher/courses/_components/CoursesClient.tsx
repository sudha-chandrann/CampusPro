// src/app/(dashboard)/teacher/courses/CoursesClient.tsx (Client Component)
"use client";


import { DataTable } from './DataTable';
import { columns } from './Columns';


export default function CoursesClient({ data }) {
  return (
    <div className='p-4'>
      <div className='mt-5'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
