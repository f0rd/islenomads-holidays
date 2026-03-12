import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  maxSizeMB?: number;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  onError,
  maxSizeMB = 5,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const uploadMutation = trpc.system.uploadImage.useMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const error = `File size exceeds ${maxSizeMB}MB limit`;
      onError?.(error);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const error = "Please select a valid image file";
      onError?.(error);
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const response = await uploadMutation.mutateAsync({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });

      if (response?.url) {
        onChange(response.url);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      onError?.(message);
      setPreview("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreview("");
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {preview && (
        <div className="relative w-full max-w-xs">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="relative cursor-pointer">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => {
              const input = document.querySelector('input[type="file"]') as HTMLInputElement;
              input?.click();
            }}
            className="cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </>
            )}
          </Button>
        </label>
        {value && (
          <span className="text-sm text-gray-600 truncate max-w-xs">
            {value.split("/").pop()}
          </span>
        )}
      </div>

      {value && !preview && (
        <div className="text-sm text-gray-600">
          Image URL: <span className="font-mono text-xs break-all">{value}</span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Max size: {maxSizeMB}MB. Supported formats: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
}
