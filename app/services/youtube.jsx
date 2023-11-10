export async function fetchYoutubeVideos(searchTerm) {
  const YOUTUBE_API_KEY_TOKEN = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchTerm)}&key=${YOUTUBE_API_KEY_TOKEN}`;

  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    };
    const data = await response.json();
    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      uploader: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error("Failed to fetch Youtube videos:", error);
  };
};