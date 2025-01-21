
"use client";
import {  FileVideo, ImageDownIcon } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

 interface FileUploadProps {
    isImage:boolean;
    onChange: (info?:string|CloudinaryUploadWidgetInfo)=>void;
 }

function FileUploader  ({
  onChange,
  isImage
}:FileUploadProps){ 
  
  

  return (
    <div className="w-full h-[200px] flex flex-col items-center justify-center">
          {
            isImage ? (
              <ImageDownIcon className="w-24 h-24 text-sky-700 mb-2"/>
            ):(
              <FileVideo  className="w-24 h-24 text-sky-700 mb-2"/>
              
            )
          }
          <CldUploadWidget
          signatureEndpoint="/api/signcloudinary"
          onSuccess={(result) => {
            onChange(result?.info);
          }}
          onQueuesEnd={(result, { widget }) => {
            widget.close();
          }}
        >
          {({ open }) => {
            function handleOnClick() {
              open();
            }
            return (
              <button
                onClick={handleOnClick}
                className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-600"
              >
                {
                  isImage ?" Upload an Image":" Upload an Video"
                }
               
              </button>
            );
          }}
        </CldUploadWidget>

    </div>
  )
}

export default FileUploader
