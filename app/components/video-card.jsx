import React from 'react';
import Image from 'next/image';
import { Dialog, DialogBody } from '@material-tailwind/react';

export const VideoCard = ({ video, open, handleOpen }) => (
  <div className="flex flex-col max-w-md w-full my-4 bg-white rounded-lg shadow-md">
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
      <button type="button" onClick={handleOpen} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        See Video
      </button>
      {open && (
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
      )}
    </div>
  </div>
);