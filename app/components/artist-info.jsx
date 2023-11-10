'use client';
import React from 'react';
import { HomeIcon, Instagram, Twitter, Youtube, XCircle } from 'lucide-react';

const renderSocialLinks = (urlArray, IconComponent, label) => {
  if (urlArray && urlArray.length > 0 && urlArray[0]) {
    return (
      <a href={urlArray[0].url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
        <IconComponent />
        <span>{label}</span>
      </a>
    );
  } else {
    return (
      <div className="flex flex-col items-center">
        <XCircle className="text-red-500" />
        <span>{label} Not found</span>
      </div>
    );
  }
};

export const ArtistInfo = ({ artistInfo }) => (
  <div className="flex flex-col max-w-sm md:max-w-3xl w-full my-4 bg-white rounded-lg shadow-md">
    <h3 className='font-bold text-center text-xl my-1'>{`Band - ${artistInfo.name}`}</h3>
    <h4 className='font-bold text-center my-1'>Social Links:</h4>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
      {renderSocialLinks(artistInfo?.externalLinks?.homepage, HomeIcon, 'Homepage')}
      {renderSocialLinks(artistInfo?.externalLinks?.instagram, Instagram, 'Instagram')}
      {renderSocialLinks(artistInfo?.externalLinks?.twitter, Twitter, 'Twitter')}
      {renderSocialLinks(artistInfo?.externalLinks?.youtube, Youtube, 'Youtube')}
    </div>
  </div>
);