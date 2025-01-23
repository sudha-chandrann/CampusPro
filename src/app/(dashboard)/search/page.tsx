import { db } from "@/lib/db";
import Categories from "./_components/Categories";
import SearchInput from "@/components/customui/SearchInput";
import { getCourses } from "../../../../actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CoursesList from "@/components/customui/CoursesList";



interface SearchPageProps{
  searchParams:{
    title:string;
    category:string;
  }
}


const SearchPage = async ({
  searchParams
}:SearchPageProps) =>{
  const {userId} =await auth();

  if(!userId){
    return redirect("/");
  }
   const categories=await db.category.findMany({
     orderBy:{
      name:"asc"
     }
   })  

   const courses=await getCourses({userId,...searchParams})

  return (
    <>
    <div className="md:hidden md:mb-0  w-full pt-3 ml-5 flex items-center">
     <SearchInput/>
    </div>
    <div>
      <Categories  items={categories}/>
      <CoursesList items={courses}/>
    </div>
    </>

  )
}

export default SearchPage;