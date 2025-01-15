import React from 'react'
import SideBar from './_components/SideBar';
import Navbar from './_components/Navbar';

function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className='h-screen flex'>
        <div className='h-[60px] md:pl-56 lg:pl-64 fixed insert-y-0 w-full '>
          <Navbar/>
        </div>
        <div className='hidden md:flex w-56 lg:w-64 h-full flex-col fixed insert-y-0 z-50 '>
          <SideBar/>
        </div>
        <div className='md:ml-56 lg:ml-64 mt-[60px]'> {children}</div>
     
    </div>
  )
}

export default DashboardLayout
