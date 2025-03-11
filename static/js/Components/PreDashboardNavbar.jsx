import React from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../Assets/img/logo.png';
import NavPopover from './Popover';
import { logout } from '../features/auth/authSlice';
import useGetLoggedInUserId from '../hooks/useGetLoggedInUserId';
import SignupLoginNavbar from './SignupLoginNavbar';

function PreDashboardNavbar() {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.auth.userDetails);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loggedInUserId = useGetLoggedInUserId();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.assign('/available-courses');
  };

  return (
    <div className="bg-[#efefef] z-10 fixed flex w-full py-3">
      <div className="bg-white py-3 px-6 justify-between items-center rounded-md z-10 flex w-full max-w-7xl mx-3 xl:mx-auto">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} className="object-contain" width={90} alt="logo" />
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <NavPopover
              width={50}
              height={50}
              firstName={userDetails?.firstname}
              lastName={userDetails?.lastname}
              profilePic={userDetails?.profile_image}
              logout={handleLogout}
              visitProfile={() => navigate(`/user/${loggedInUserId}`)}
            />
          ) : (
            <SignupLoginNavbar />
          )}
        </div>
      </div>
    </div>
  );
}

export default PreDashboardNavbar;
