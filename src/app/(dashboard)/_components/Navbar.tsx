'use client';
import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import SideBar from './SideBar'
import { Menu } from 'lucide-react'
import NavRoutes from '@/components/customui/NavRoutes';
import SearchInput from '@/components/customui/SearchInput';
import { usePathname } from 'next/navigation';
function Navbar() {
    const pathname=usePathname();
  
      const isSearchPage=pathname ==="/search";
  return (
    <div className='h-full shadow-md  flex px-4  items-center justify-between '>
                 {
      isSearchPage && (
        <div className='hidden md:block mr-auto'>
          <SearchInput/>
        </div>
      )
    }
       <div className='md:hidden'>
        <Sheet>
            <SheetTrigger>
                <Menu/>
            </SheetTrigger>
            <SheetContent side="left">
                <SideBar/>
            </SheetContent>
        </Sheet>
        
       </div>

       <div className='ml-auto'>
          <NavRoutes/>
       </div>
        
    </div>
  )
}

export default Navbar
