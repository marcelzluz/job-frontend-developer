export type ArtistInfoData = {
  name: string;
  url: string;
  externalLinks?: {
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
    youtube: [
      {
        url: string;
      }
    ];
  };
};


export type Videos = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  uploader: string;
};

export type YoutubeVideoItem = {
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

export type SocialMediaLinks = {
  url: string;
};

export type SocialLinksArray = SocialMediaLinks[] | undefined;

export type IconComponentType = React.FC;