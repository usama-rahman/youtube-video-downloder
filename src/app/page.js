"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [urlValue, setUrlValue] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloadStatus("Downloading...");

    try {
      await fetch(urlValue)
        .then((res) => res.blob())
        .then((file) => {
          let tempUrl = URL.createObjectURL(file);
          let aTag = document.createElement("a");

          aTag.href = tempUrl;
          aTag.download = "video.mp4";
          document.body.appendChild(aTag);
          aTag.click();
          window.URL.revokeObjectURL(tempUrl);
          document.body.removeChild(aTag);
        });

      setDownloadStatus("Downloaded");
    } catch (error) {
      console.log(error.message);
      setDownloadStatus("Error !!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        className="flex flex-col items-center justify-center w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          className="w-full border border-gray-300 rounded-md p-2 mb-2"
          placeholder="Enter YouTube URL"
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Download
        </Button>
        {downloadStatus}
      </form>
    </div>
  );
}
