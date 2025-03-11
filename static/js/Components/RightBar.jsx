import React from 'react';

function RightBar({ children }) {
  return (
    <div className=" hidden h-screen top-32 right-0 fixed w-1/5 pr-6 overflow-y-auto xl:block bg-white">
      {children}
    </div>
  );
}

export default RightBar;
