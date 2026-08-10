import { ImagePlus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type AnswerUploadProps = {
  onFilesChange?: (files: File[]) => void;
};

export function AnswerUpload({ onFilesChange }: AnswerUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const selected = Array.from(selectedFiles).filter((file) =>
      file.type.startsWith("image/"),
    );

    const nextFiles = [...files, ...selected];

    setFiles(nextFiles);
    onFilesChange?.(nextFiles);
  }

  function removeFile(index: number) {
    const nextFiles = files.filter((_, fileIndex) => fileIndex !== index);

    setFiles(nextFiles);
    onFilesChange?.(nextFiles);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-6 text-center">
        <ImagePlus className="mx-auto size-8 text-muted-foreground" />

        <h3 className="mt-3 font-semibold">
          Upload your handwritten answers
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Take clear photographs of every page of your completed test. Make
          sure the writing is readable and all pages are included.
        </p>

        <label className="mt-5 inline-flex cursor-pointer">
          <Button asChild type="button" className="rounded-full">
            <span>
              <ImagePlus className="mr-2 size-4" aria-hidden />
              Add Answer Photos
            </span>
          </Button>

          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">
            Answer pages ({files.length})
          </p>

          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border bg-background p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  Page {index + 1}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {file.name}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-full"
                onClick={() => removeFile(index)}
                aria-label={`Remove page ${index + 1}`}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}