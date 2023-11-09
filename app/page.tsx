'use client';
import { Dialog, DialogBody } from '@material-tailwind/react';
import Image from 'next/image';
import React, { FormEvent, useState } from 'react';

type ArtistInfoData = {
  name: string;
  url: string;
  externalLinks: {
    homepage: [
      {
        url: string;
      }
    ];
    instagram: [
      {
        url: string;
      }
    ];
    twitter: [
      {
        url: string;
      }
    ];
    spotify: [
      {
        url: string;
      }
    ];
  };
};


type Videos = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  rating?: number;
  uploader: string;
};

type YoutubeVideoItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
  };
};


export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState<Videos[]>([]);
  const [artistInfo, setArtistInfo] = useState<ArtistInfoData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  async function fetchYoutubeVideos(searchTerm: string) {
    const YOUTUBE_API_KEY = 'AIzaSyBY0olt3bwN4-7YRckfEMScfPpYY8JQW4w';
    const baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchTerm)}&key=${YOUTUBE_API_KEY}`;

    try {
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      };
      const data = await response.json();
      return data.items.map((item: YoutubeVideoItem) => ({
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

  async function fetchArtistInfo(searchTerm: string) {
    const TICKETMASTER_API_KEY = 'x9TAS10ua31T7nONj8geuWe7Cnp7OixA';
    const baseURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${encodeURIComponent(searchTerm)}&classificationName=Music&apikey=${TICKETMASTER_API_KEY}`;

    try {
      const response = await fetch(baseURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      };
      const data = await response.json();
      return data._embedded.attractions[0];
    } catch (error) {
      console.error("Failed to fetch artist info:", error);
      return null
    };
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchTerm) {
      alert('Please enter a search term');
      return;
    };
    setLoading(true);
    try {
      const videos = await fetchYoutubeVideos(searchTerm);
      const artistInfo = await fetchArtistInfo(searchTerm);
      setVideos(videos);
      setArtistInfo(artistInfo);
      setError(null);
      console.log(videos)
      console.log(artistInfo);
    } catch (error) {
      setError("Failed to fetch videos");
      setVideos([]);
    };
    setLoading(false);
  };


  return (
    <section className="block p-4 w-full m-auto">
      <div className={videos.length > 0 ? "flex flex-col" : "flex flex-col mt-16"}>
        <h1 className="text-4xl font-bold text-center">Melody Explorer</h1>
        <h3 className="text-center">
          Conheça mais sobre seu artista favorito
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquise Aqui"
            className="p-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <section className="mt-4 flex flex-col items-center justify-center">
        {artistInfo && (
          <div className="flex flex-col max-w-md w-full my-4 bg-white rounded-lg shadow-md">
            <p className='font-bold'>{`Nome da Banda - ${artistInfo.name}`}</p>
            <p className='font-bold'>{`URL - ${artistInfo.url}`}</p>
            <p className='font-bold'>{`Homepage - ${artistInfo.externalLinks.homepage[0].url}`}</p>
            <p className='font-bold'>{`Instagram - ${artistInfo.externalLinks.instagram[0].url}`}</p>
            <p className='font-bold'>{`Twitter - ${artistInfo.externalLinks.twitter[0].url}`}</p>
            <p className='font-bold'>{`Spotify - ${artistInfo.externalLinks.spotify[0].url}`}</p>
          </div>
        )}
      </section>
      <div className="mt-4 flex flex-col items-center justify-center">
        {videos.map((video) => (
          <div key={video.id} className="flex flex-col max-w-md w-full my-4 bg-white rounded-lg shadow-md">
            <div className="relative h-48 w-full mt-4">
              <Image
                src={video.thumbnail}
                alt={`Thumbnail of ${video.title}`}
                layout='fill'
                objectFit='contain'
              />
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold text-xl mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-700 text-base">{video.description}</p>
              </div>
              <p className="text-gray-600 text-sm">Uploaded by: {video.uploader ?? 'Unknown'}</p>
            </div>
            <div className="flex justify-center items-center pb-4">
            <button type="submit" onClick={handleOpen} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
              See Video
            </button>
              <Dialog open={open} handler={handleOpen} size='xs'>
                <DialogBody>
                  <iframe
                    id={`ytplayer-${video.id}`}
                    title={video.title}
                    width="420"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                    allowFullScreen
                    allow='autoplay; encrypted-media'
                  />
                </DialogBody>
              </Dialog>
              </div>
          </div>
        ))};
      </div>
    </section>
  );
};
