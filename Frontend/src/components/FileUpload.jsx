import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import ImageUpload from "../assets/svg/image-upload.svg?react";
import PdfIcon from "../assets/svg/document-upload.svg?react";
import CloseIcon from "../assets/svg/trash.svg?react";
import { cn } from "../lib/utils";
import DocumentUpload from "./svgs/DocumentUpload";
import Button from "./Buttons/Button";

const FileUpload = ({ name, accept = "image/*,.pdf", multiple = false }) => {
  const { register, setValue, watch } = useFormContext();
  const fileInputRef = useRef(null);
  const files = watch(name) || (multiple ? [] : null);

  const handleButtonClick = () => {
    fileInputRef.current.value = ""; // Reset input to allow re-selecting same file
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    if (multiple) {
      setValue(name, [...(files || []), ...selectedFiles]);
    } else {
      setValue(name, selectedFiles[0]); // Store single file
    }
  };

  const removeFile = () => {
    setValue(name, multiple ? [] : null);
  };

  const handleFileClick = (file) => {
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, "_blank");
    // Note: You should revoke the object URL when done
    // This will be handled when the new tab is closed
  };

  const filesToDisplay = multiple ? files : files ? [files] : [];

  return (
    <div className="flex flex-col items-start w-full relative text-blue">
      {/* Hidden file input */}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        ref={(e) => {
          fileInputRef.current = e;
          register(name).ref(e);
        }}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Custom upload button */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="w-full text-sm flex items-center justify-between p-2 h-10 text-blue cursor-pointer border border-light-blue rounded-lg"
      >
        <span>{multiple ? "Select Files" : "Select File"}</span>
        <span
          className={cn(
            "p-1.5 text-xs rounded-md flex items-center gap-0.5",
            filesToDisplay.length > 0
              ? "bg-green-200 text-[#00AC00]"
              : "bg-light-blue text-blue"
          )}
        >
          <DocumentUpload
            {...(filesToDisplay.length > 0 && { color: "#00AC00" })}
          />{" "}
          {filesToDisplay.length > 0 ? "Uploaded" : "Upload"}
        </span>
      </button>

      {/* File preview */}
      {filesToDisplay.length > 0 && (
        <div className="absolute top-full text-sm text-blue cursor-pointer rounded-md ">
          {filesToDisplay.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <span
                className="text-xs truncate max-w-xs cursor-pointer hover:underline"
                onClick={() => handleFileClick(file)}
              >
                {file.name}
              </span>
              <Button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <CloseIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
