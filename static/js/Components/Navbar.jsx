import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { NavLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import logo from '../Assets/img/logo.png';
import { logout } from '../features/auth/authSlice';
import NavPopover from './Popover';
import NotificationPopover from './NotificationPopover';
import useGetLoggedInUserId from '../hooks/useGetLoggedInUserId';
import SidebarData from '../utils/SideBarData';
import { getNotifications } from '../features/notification/NotificationSlice';
import BrowserSettings from './BrowserSettings';
import Modal from './Modal';

const notificationBaseUrl = `${
  process.env.REACT_APP_NOTIFICATION_SOCKET_URL ||
  'wss://api.lms.v2.powerlearnprojectafrica.org/notification/socket'
}/notification?Authorization=`;

const socketConnection = new WebSocket(
  `${notificationBaseUrl + localStorage.getItem('token')}`
);

const activeLink =
  'flex flex-row items-center p-2 mb-1.5 hover:bg-[#8B173B] hover:text-white focus:bg-[#8B173B] focus:text-white rounded-md cursor-pointer space-x-3';
const inactiveLink =
  'flex flex-row items-center p-2 mb-1.5  rounded-md cursor-pointer space-x-3';

function Navbar() {
  const userDetails = useSelector((state) => state.auth.userDetails);
  const userNotifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUserId = useGetLoggedInUserId();
  const [showSidebar, setShowSidebar] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const toggleSettingsModal = useCallback(() => {
    setSettingsModalOpen((prev) => !prev);
  }, []);

  const ref = useRef();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // eslint-disable-next-line no-unused-vars
  const [notifications, setNotifications] = useState({
    count: 0,
    messages: [],
  });

  useEffect(() => {
    socketConnection.onmessage = (event) => {
      setNotifications({
        count: JSON.parse(event.data)?.length || 0,
        messages: JSON.parse(event.data) || [],
      });
      dispatch(
        getNotifications({
          count: JSON.parse(event.data)?.length || 0,
          messages: JSON.parse(event.data) || [],
        })
      );
    };
  }, [dispatch]);

  useEffect(() => {
    const checkOutsideClick = (e) => {
      if (showSidebar && ref.current && !ref.current.contains(e.target)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener('mousedown', checkOutsideClick);
    return () => {
      document.removeEventListener('mousedown', checkOutsideClick);
    };
  }, [showSidebar]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.assign('/available-courses');
  };

  const readNotificationHandler = (ids) => {
    return socketConnection.send(JSON.stringify({ notification_ids: [ids] }));
  };

  return (
    <>
      <div className="z-10 py-6 fixed top-0 w-full px-6 bg-[#EFEFEF]  ">
        <nav className=" bg-white rounded-lg px-[2.8%] flex items-center justify-between h-20">
          <div className=" flex align-middle items-center space-x-10">
            <div onClick={() => navigate('/')}>
              <img
                className="w-14 h-20 object-contain cursor-pointer"
                src={logo}
                alt="logo"
              />
            </div>

            <p>{format(new Date(), 'dd/MM/yyy')}</p>
          </div>

          <div className="flex items-center space-x-5">
            <NotificationPopover
              count={userNotifications.count}
              messages={userNotifications.messages.slice(0, 3)}
              readNotification={readNotificationHandler}
              readNotifications={() => navigate('notifications')}
            />
            <div className="whitespace-normal cursor-pointer">
              <SettingsIcon
                sx={{ fontSize: 25 }}
                className=""
                onClick={() => toggleSettingsModal()}
              />
            </div>
            <div className="items-center space-x-5 hidden xl:flex ">
              <NavPopover
                firstName={userDetails?.firstname}
                lastName={userDetails?.lastname}
                profilePic={userDetails?.profile_image}
                logout={handleLogout}
                visitProfile={() => navigate(`/user/${loggedInUserId}`)}
              />
            </div>
          </div>
          <div
            onClick={() => {
              toggleSidebar();
            }}
            className="items-center space-x-5 block xl:hidden cursor-default"
          >
            {!showSidebar ? (
              <MenuIcon fontSize="medium" />
            ) : (
              <CloseIcon fontSize="medium" />
            )}
          </div>
        </nav>
      </div>
      <div
        className={`min-h-screen xl:hidden top-32 fixed w-3/5 lg:w-2/5 pl-6 bg-white  ${
          showSidebar ? '' : '-translate-x-full'
        } duration-300 ease-in-out z-10`}
      >
        <ul className="p-2 space-y-5 bg-white h-full rounded-lg" ref={ref}>
          <div
            className="ml-2 flex items-center space-x-5 cursor-pointer"
            onClick={() => {
              toggleSidebar();
              navigate(`/user/${loggedInUserId}`);
            }}
          >
            <Avatar src="" sx={{ width: 30, height: 30 }}>
              <div className="text-sm">
                {userDetails?.firstname[0].toUpperCase()}
                {userDetails?.lastname[0].toUpperCase()}
              </div>
            </Avatar>
            <small className="capitalize ">
              {userDetails?.firstname} {userDetails?.lastname}
            </small>
          </div>

          {SidebarData.map((val) => {
            return (
              <NavLink
                onClick={toggleSidebar}
                key={val.id}
                to={val.link}
                className={({ isActive }) =>
                  isActive ? activeLink : inactiveLink
                }
              >
                <div className="mr-1">{val.icon}</div>

                <div>
                  <small>{val.title}</small>
                </div>
              </NavLink>
            );
          })}
          <div
            className="ml-2 flex items-center space-x-5 cursor-pointer"
            onClick={() => {
              toggleSidebar();
              handleLogout();
            }}
          >
            <LogoutIcon />
            <small className="capitalize ">Logout</small>
          </div>
        </ul>
        <Modal
          title="Browser Settings"
          modalOpen={settingsModalOpen}
          toggleModal={toggleSettingsModal}
        >
          <BrowserSettings toggleModal={toggleSettingsModal} />
        </Modal>
      </div>
    </>
  );
}

export default Navbar;
