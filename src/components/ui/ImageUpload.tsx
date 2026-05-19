"use client";

import { useState, useRef } from "react";
import { useUploadThing } from "@/lib/uploadthing";

interface ImageUploadProps {
  endpoint: "avatarUploader" | "competitionBanner";
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: Error) => void;
  shape?: "circle" | "rect";
  label?: string;
  previewSize?: number;
}

export function ImageUpload({
  endpoint,
  currentImageUrl,
  onUploadComplete,
  onUploadError,
  shape = "rect",
  label = "Upload Image",
  previewSize = 120,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: (p) => setUploadProgress(p),
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        onUploadComplete(res[0].url);
        setUploadProgress(0);
      }
    },
    onUploadError: (err) => {
      console.error("Upload error:", err);
      onUploadError?.(err);
      setUploadProgress(0);
    },
  });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Uploadthing
    await startUpload([file]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isCircle = shape === "circle";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      {/* Preview / Drop Zone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          width: isCircle ? previewSize : "100%",
          height: isCircle ? previewSize : 180,
          borderRadius: isCircle ? "50%" : "16px",
          border: `2px dashed ${isDragging ? "var(--ho)" : "var(--bdr)"}`,
          background: isDragging ? "rgba(245,166,35,0.05)" : "var(--bg)",
          cursor: isUploading ? "not-allowed" : "pointer",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: isUploading ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            />
            {/* Hover overlay */}
            {!isUploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                className="upload-hover-overlay"
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <i className="ph-fill ph-camera" style={{ fontSize: "24px" }}></i>
                Change
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              color: "var(--t2)",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <i className="ph-fill ph-image-square" style={{ fontSize: isCircle ? "32px" : "40px" }}></i>
            {!isCircle && (
              <span style={{ fontSize: "13px" }}>
                Drop image here or click to browse
              </span>
            )}
          </div>
        )}

        {/* Upload progress overlay */}
        {isUploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              Uploading {uploadProgress}%
            </div>
            <div
              style={{
                width: isCircle ? "60%" : "80%",
                height: "4px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "100px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: "100%",
                  background: "var(--ho)",
                  borderRadius: "100px",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Label & hint */}
      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="btn btn-sm"
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--bdr)",
            color: "var(--t)",
            fontSize: "13px",
          }}
          disabled={isUploading}
        >
          <i className="ph-fill ph-upload-simple"></i>{" "}
          {isUploading ? "Uploading..." : label}
        </button>
        <div style={{ fontSize: "11px", color: "var(--t3)", marginTop: "6px" }}>
          JPG, PNG, WebP · Max {endpoint === "avatarUploader" ? "4MB" : "8MB"}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
