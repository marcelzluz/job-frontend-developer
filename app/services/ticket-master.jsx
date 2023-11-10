import { toast } from "react-toastify";

export async function fetchArtistInfo(searchTerm) {
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