import React from 'react'
import SideBar from './_components/SideBar';

function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className='h-screen flex'>
        <div className='hidden md:flex w-56 lg:w-64 h-full flex-col fixed insert-y-0 z-50 '>
          <SideBar/>
        </div>
        <div className='mx-5 md:ml-64 lg:ml-72'> {children}</div>
     
    </div>
  )
}

export default DashboardLayout
