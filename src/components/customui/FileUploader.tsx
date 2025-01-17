
"use client";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

 interface FileUploadProps {
    onChange: (info?:string|CloudinaryUploadWidgetInfo)=>void;
 }

function FileUploader  ({
  onChange,
}:FileUploadProps){ 
  
  

  return (
    <div className="w-full h-[200px] flex items-center justify-center">
          <CldUploadWidget
          signatureEndpoint="/api/signcloudinary"
          onSuccess={(result) => {
            onChange(result?.info);
            console.log("Upload result:", result);
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
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Upload an Image
              </button>
            );
          }}
        </CldUploadWidget>

    </div>
  )
}

export default FileUploader
