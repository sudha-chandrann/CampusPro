import React from 'react'
import Logo from './Logo'
import GuestRoutes from './GuestRoutes'

function SideBar() {
  return (
    <div className='h-full w-full border-r flex flex-col overflow-y-auto  bg-slate-200 shadow-sm'>
       <div className='py-2 px-2 '>
          <Logo/>
       </div>
       <div className='mt-3'>
        <GuestRoutes/>
       </div>
    </div>
  )
} 

export default SideBar
