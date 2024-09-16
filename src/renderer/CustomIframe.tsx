// src/components/CustomIframe.tsx
import React from 'react';
import bbc from '../../assets/BBC_News_Logo.png';
import medium from '../../assets/Medium_Logo.png';

interface CustomIframeProps {
  src: string;
  title?: string;
}

const CustomIframe: React.FC<CustomIframeProps> = ({ src, title }) => {
  return (
    <div
      className={`flex flex-col items-center relative w-full h-full overflow-hidden p-2  rounded-2xl shadow-lg 
        ${
          title === 'linkedin'
            ? 'bg-linkedin shadow-linkedin'
            : title === 'reddit'
              ? 'bg-reddit shadow-reddit'
              : title === 'medium'
                ? 'bg-white shadow-inherit'
                : title === 'bbc' || title === 'twitter'
                  ? 'bg-black shadow-black'
                  : ''
        }`}
    > 
      {title === 'bbc' && (
        <div className='w-1/4 py-2'>
          <img src={bbc}/>
        </div>
      )}
      {title === 'medium' && (
        <div className='w-1/2'>
          <img src={medium}/>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        className="w-full h-full"
        // style={{ paddingRight: '20px' }} // Add padding to account for scrollbar width
      ></iframe>
      {/* Overlay to hide scrollbar */}
      {/* <div className="absolute top-0 right-4 bottom-0 w-3 bg-base-grey pointer-events-none"></div> */}
    </div>
  );
};

export default CustomIframe;
