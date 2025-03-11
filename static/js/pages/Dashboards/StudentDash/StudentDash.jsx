import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../../Components/Navbar';
import LeftBar from '../../../Components/LeftBar';

function StudentDash() {
  return (
    <div>
      <div className="bg-lms-custom-50 min-h-screen text-black font-roboto_light font-medium">
        <Navbar />
        <div className="flex">
          <LeftBar />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentDash;
