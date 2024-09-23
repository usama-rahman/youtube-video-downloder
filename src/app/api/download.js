import ytdl from "ytdl-core";

export default async function get(req, res) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).send("Video ID is required");
  }

  try {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${videoId}.mp4"`
    );
    ytdl(`http://www.youtube.com/watch?v=${videoId}`).pipe(res);
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Failed to download video");
  }
}
