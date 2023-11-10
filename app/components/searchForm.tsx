'useclient';
import { toast } from 'react-toastify';
import { useSearchContext } from '../search-context';
import { Search } from 'lucide-react';
import { FormEvent } from 'react';

export function SearchForm() {
  const {
    searchTerm,
    setSearchTerm,
    fetchYoutubeVideos,
    fetchArtistInfo,
    setVideos,
    setArtistInfo,
    videos,
  } = useSearchContext();

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
    <div className={videos.length > 0 ? "flex flex-col" : "flex flex-col items-center justify-center min-h-screen"}>
    <h1 className="text-4xl font-bold text-center">Melody Explorer</h1>
    <h3 className="text-center">
      Learn more about your favorite band
    </h3>
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a band"
        className="p-2 border border-gray-300 rounded-md mt-2"
      />
      <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        <Search />
      </button>
    </form>
  </div>
  );
}