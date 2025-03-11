import React from 'react';
import logoSVG from '../../Assets/img/Power Learn Project - Logo 1.svg';
import './AuthSkeleton.css';
import AuthCarousel from './AuthCarousel';

function AuthSketeton({ heading, children }) {
  return (
    <div className="img-container min-h-screen flex flex-col justify-between">
      <div className="flex flex-1  w-full max-w-7xl mx-auto lg:justify-around items-center px-10 gap-16 justify-center">
        <div className="hidden lg:block">
          <AuthCarousel />
        </div>
        <div className="  bg-white auth-card w-full px-5 py-[5rem] rounded-lg max-w-lg">
          <div className="space-y-4">
            <img
              src={logoSVG}
              alt=""
              className="object-contain mx-auto w-48 "
            />
            <p className="text-center font-semibold">{heading}</p>
            {children}
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-white py-2">
        Copyright © {new Date().getFullYear()} Power Learn Project. All Rights
        Reserved.
      </p>
    </div>
  );
}

export default AuthSketeton;
