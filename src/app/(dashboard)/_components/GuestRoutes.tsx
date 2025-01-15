'use client';
import React from 'react'
import SidebarItem from './SidebarItem';
import {Layout,Compass} from "lucide-react"
const guestRoutes=[
    {
        icon:Layout,
        lable:"Dashboard",
        href:"/dashboard"
    },
    {
        icon:Compass,
        lable:"Browser",
        href:"/search"
    },
]
function GuestRoutes() {
     const routes=guestRoutes;

  return (
    <div className='flex flex-col w-full'>
      {
        routes.map((route)=>(
            <SidebarItem key={route.href} icon={route.icon} label={route.lable} href={route.href}/>
        ))
      }
    </div>
  )
}

export default GuestRoutes
