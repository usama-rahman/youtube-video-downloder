"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios"; // Add axios for making HTTP requests

export default function Home() {
  const [urlValue, setUrlValue] = useState("");
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    // Load the YouTube API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = loadVideo;
  }, []);

  const loadVideo = () => {
    if (videoId) {
      new window.YT.Player("youtube-player", {
        height: "360",
        width: "640",
        videoId: videoId,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(urlValue);
    if (videoId) {
      setVideoId(videoId);
      loadVideo();
      downloadVideo(videoId); // Call download function
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const downloadVideo = async (videoId) => {
    try {
      const response = await axios.get(`/api/download?videoId=${videoId}`, {
        responseType: "blob",
      });
      console.log(response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${videoId}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading video:", error);
      alert("Failed to download video");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        className="flex flex-col items-center justify-center w-full max-w-md mb-4"
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
          Load Video
        </Button>
      </form>
      <div id="youtube-player"></div>
    </div>
  );
}
