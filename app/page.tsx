'use client';
import React, { FormEvent, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArtistInfoData, Videos, YoutubeVideoItem } from './types';
import { SearchForm } from './components/search-form'
import { ArtistInfo } from './components/artist-info';
import { VideoCard } from './components/video-card';
import { fetchYoutubeVideos } from './services/youtube';
import { fetchArtistInfo } from './services/ticket-master';


export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState<Videos[]>([]);
  const [artistInfo, setArtistInfo] = useState<ArtistInfoData>();
  const [openVideoId, setOpenVideoId] = useState<string | null>(null);

  const handleOpen = (videoId: string | null) => {
    setOpenVideoId(openVideoId === videoId ? null : videoId);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchTerm) {
      toast.warn('🎧 Insert a band in the search bar!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    };
    toast.info('Loading... Please wait.', {
      position: "top-center",
      autoClose: false, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      toastId: 'loadingId'
    });
    try {
      const videos = await fetchYoutubeVideos(searchTerm);
      const artistInfo = await fetchArtistInfo(searchTerm);
      setVideos(videos);
      setArtistInfo(artistInfo);
      toast.dismiss('loadingId');
      console.log(videos);
      console.log(artistInfo);
    } catch (error) {
      console.error("Failed to fetch videos");
      toast.error('🎧 Failed to fetch videos. Please try again later.')
      setVideos([]);
      toast.dismiss('loadingId');
    };
  };

  return (
    <section className="block p-4 w-full m-auto">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={videos.length > 0 ? "flex flex-col" : "flex flex-col items-center justify-center min-h-screen"}>
        <h1 className="text-4xl font-bold text-center text-stone-50">Melody Explorer</h1>
        <h3 className="text-center text-white">
          Learn more about your favorite band
        </h3>
        <SearchForm
          handleSubmit={handleSubmit}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <section className="mt-4 flex flex-col items-center justify-center">
        {artistInfo && (
          <ArtistInfo artistInfo={artistInfo} />
        )}
      </section>
      <div className="mt-4 flex flex-col items-center justify-center">
        {videos.map((video) => (
          console.log(video.id),
          <VideoCard key={video.id} video={video} open={openVideoId === video.id} handleOpen={() => handleOpen(video.id)} />
        ))}
      </div>
    </section>
  );
};
