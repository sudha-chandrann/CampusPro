'use client'
import FileUploader from "@/components/customui/FileUploader";

export default function Home() {
  return (
    <div className="h-screen  flex items-center justify-center">
          <FileUploader 
            onChange={(info)=> {
              if(info){
                console.log("the info is ",info)
                console.log(" the url is ",info?.url)
              }
            }}
            />
    </div>
  );
}
