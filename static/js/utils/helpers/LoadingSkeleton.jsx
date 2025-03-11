/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';

function LoadingSkeleton() {
  return (
    <div className="flex justify-start w-[100%] flex-col">
      <div className="animate-pulse bg-gray-200 rounded-md w-full p-2 h-auto flex flex-row justify-between">
        <div className="text-lg">
          <div>
            <h4 className="bg-gray-300 h-6 w-2/3 mb-2 rounded" />
            <small className="bg-gray-400 h-4 w-1/2 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 my-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 space-x-4">
        {/* Render multiple loading modules */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-300 rounded-md w-60 mt-5 hover:scale-110 ease-in-out duration-300 hover:drop-shadow-lg "
          >
            <div className="flex items-center justify-center rounded-md h-3/3">
              <div className="bg-gray-400 w-full h-40 rounded-md shadow-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
