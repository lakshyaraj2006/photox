import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Loader2Icon, UploadCloud } from "lucide-react";

type UploadImageProps = {
  onFileAccepted: (file: File) => Promise<void>;
  accept?: { [key: string]: string[] };
};

export const UploadImage: React.FC<UploadImageProps> = ({
  onFileAccepted,
  accept = { "image/*": [".png", ".jpg", ".jpeg"] },
}) => {
  const [uploading, setUploading] = useState(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      try {
        setUploading(true);
        await onFileAccepted(file);
      } finally {
        setUploading(false);
      }
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept,
    disabled: uploading
  });

  return (
     <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-colors border-blue-500 bg-blue-50 h-40",
        uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <Loader2Icon className="animate-spin h-6 w-6 text-blue-500 mb-2" />
      ) : (
        <UploadCloud className="w-10 h-10 text-blue-500 mb-2" />
      )}
      <p className="text-sm text-blue-500 font-semibold">
        {uploading
          ? "Uploading file..."
          : isDragActive
          ? "Drop the file here..."
          : "Drag & drop or click to upload"}
      </p>
    </div>
  );
};
