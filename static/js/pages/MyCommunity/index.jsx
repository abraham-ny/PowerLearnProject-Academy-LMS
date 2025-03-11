import React, { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import MainContent from '../../Components/MainContent';
// import CommunityLanding from '../Components/community/CommunityLanding';
// import CommunityPostItem from '../../Components/community/CommunityPostItem';
import RightBar from '../../Components/RightBar';
import Calendar from '../../Components/calendar/Calendar';
import CreatePost from '../../Components/community/CreatePost';
import Modal from '../../Components/Modal';
// import useFetchCommunityData from '../../hooks/useFetchCommunityData';
// import Spinner from '../../Components/spinner/Spinner';
import FeedPosts from './components/FeedPosts';
import MyPosts from './components/MyPosts';

const postNotificationBaseUrl = `${
  process.env.REACT_APP_COMMUNITY_SOCKET_URL ||
  'wss://api.lms.v2.powerlearnprojectafrica.org/community/api'
}/new_post_event?Authorization=`;

// const socketConnection = new WebSocket(
//   `${postNotificationBaseUrl + localStorage.getItem('token')}`
// );

function MyCommunity() {
  const [newPosts, setNewPosts] = useState(false);
  const [activePostsTab, setActivePostsTab] = useState('feed'); // feed/ my posts
  const [postAction, setPostAction] = useState(); // update, delete, getNew
  const [page, setPage] = useState(1);
  const pageLimit = 20;
  // const [socket, setSocket] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const token = localStorage.getItem('token');
    const ws =
      token &&
      new WebSocket(
        `${postNotificationBaseUrl + localStorage.getItem('token')}`
      );

    ws.onopen = () => {
      // setIsLoading(true);
    };

    ws.onmessage = () => {
      // const res = JSON.parse(event.data) || [];
      setNewPosts(true);
      // setIsLoading(false); // Set loading state to false when messages are received
    };

    ws.onerror = () => {
      // toast.error("Couldn't get messages. Please try again!");
      // self(false); // Set loading state to false when there's an error
    };

    // setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // const state = queryClient.getQueryState(['community-posts']);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleNewPosts = () => {
    queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    setPage(1);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setNewPosts(false);
  };

  return (
    <>
      <MainContent>
        <div className="fixed w-full xl:w-3/5 pr-10 px-2 z-10 rounded-lg">
          <div className="bg-white px-2 py-5 rounded-lg flex flex-col w-full shadow-xl">
            <div className="flex justify-between w-full">
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextIcon />}
              >
                <NavLink
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color="inherit"
                  to="/"
                  className="flex items-center"
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  <p>Home</p>
                </NavLink>
              </Breadcrumbs>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleModal}
                  type="button"
                  className="px-4 py-1 bg-claret-500 rounded-md text-white font-roboto text-sm"
                >
                  Create Post
                </button>
              </div>
            </div>
            {/* Feed and My posts tab */}
            <div className="flex gap-x-3 items-center pr-10 px-2 pt-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setActivePostsTab('feed');
                  setPage(1);
                }}
                className={`${
                  activePostsTab === 'feed'
                    ? 'border-claret-500'
                    : 'border-[white]'
                } px-4 py-1 border-b-4 font-roboto text-sm`}
              >
                Feed
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePostsTab('my posts');
                  setPage(1);
                }}
                className={`${
                  activePostsTab === 'my posts'
                    ? 'border-claret-500'
                    : 'border-[white]'
                } px-4 py-1 border-b-4 font-roboto text-sm`}
              >
                My Posts
              </button>
            </div>
          </div>

          {newPosts && (
            <button
              onClick={handleNewPosts}
              className=" w-full -mt-2 text-white animate animate-pulse"
              style={{ zIndex: 100000 }}
              type="button"
            >
              <p className="bg-claret-500 w-fit px-4 py-1 rounded-full mx-auto z-50">
                New Posts
              </p>
            </button>
          )}
        </div>
        <div className="w-full relative">
          <div className="mt-24 pt-5">
            {/* {pos} */}
            {/* <CommunityLanding /> */}
            {activePostsTab === 'feed' ? (
              <FeedPosts
                pageLimit={pageLimit}
                setPostAction={setPostAction}
                postAction={postAction}
                page={page}
                setPage={setPage}
              />
            ) : (
              <MyPosts
                pageLimit={pageLimit}
                setPostAction={setPostAction}
                page={page}
                setPage={setPage}
              />
            )}
          </div>
        </div>
      </MainContent>
      <RightBar>
        <Calendar />
      </RightBar>
      <Modal
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        title="Create Post"
      >
        <CreatePost toggleModal={toggleModal} />
      </Modal>
    </>
  );
}

export default MyCommunity;
