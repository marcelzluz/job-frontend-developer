'useclient';
import React, { createContext, useState, useContext, FormEvent } from 'react';
import { ArtistInfoData, Videos, YoutubeVideoItem } from './types';
import { toast } from 'react-toastify';

type SearchContextProviderProps = {
  children: React.ReactNode;
};

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  videos: Videos[];
  setVideos: React.Dispatch<React.SetStateAction<Videos[]>>;
  artistInfo: ArtistInfoData | null;
  setArtistInfo: React.Dispatch<React.SetStateAction<ArtistInfoData | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchYoutubeVideos: (searchTerm: string) => Promise<Videos[]>;
  fetchArtistInfo: (searchTerm: string) => Promise<ArtistInfoData | null>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchContextProvider');
  }
  return context;
};

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState<Videos[]>([]);
  const [artistInfo, setArtistInfo] = useState<ArtistInfoData | null>(null);
  const [open, setOpen] = useState(false);

async function fetchYoutubeVideos(searchTerm: string) {
    const YOUTUBE_API_KEY_TOKEN = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchTerm)}&key=${YOUTUBE_API_KEY_TOKEN}`;

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
    const TICKETMASTER_API_KEY_TOKEN = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
    const baseURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${encodeURIComponent(searchTerm)}&classificationName=Music&apikey=${TICKETMASTER_API_KEY_TOKEN}`;

    try {
      const response = await fetch(baseURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      };
      const data = await response.json();
      if (data._embedded && data._embedded.attractions.length > 0) {
        return data._embedded.attractions[0];
      } else {
        toast.error("Band data not found");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch artist info:", error);
      toast.error("Failed to fetch artist info");
      return null
    };
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

  const context = {
    searchTerm,
    setSearchTerm,
    videos,
    setVideos,
    artistInfo,
    setArtistInfo,
    open,
    setOpen,
    fetchYoutubeVideos,
    fetchArtistInfo,
    handleSubmit,
  };

  return (
    <SearchContext.Provider value={context}>
      {children}
    </SearchContext.Provider>
  );
};
