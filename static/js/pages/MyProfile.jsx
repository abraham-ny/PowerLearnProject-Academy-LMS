import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import RightBar from '../Components/RightBar';
import Calendar from '../Components/calendar/Calendar';
import MainContent from '../Components/MainContent';
import useGetLoggedInUserId from '../hooks/useGetLoggedInUserId';
import AboutMe from '../Components/profile/AboutMe';
import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';
import DashboardHeader from '../Components/dashboard/DashboardHeader';
import Spinner from '../Components/spinner/Spinner';
import WorkAndEducation from '../Components/profile/WorkAndEducation';
// import useFetchAnalytics from '../hooks/useFetchAnalytics';

function MyProfile() {
  const loggedInUserId = useGetLoggedInUserId();
  const onFetchUserDetailsFailure = () => {
    // dispatch(updateDetailsWithPercentage(percentage));
    toast.error("Couldn't fetch user details. Please try again!");
  };

  // const { data: studentProgress, isLoading: studentProgressLoading } =
  //   useFetchAnalytics(
  //     ['student-progress', loggedInUserId],
  //     `/students-progress/${loggedInUserId}`,
  //     {},
  //     "Couldn't get your progress. Try again",
  //     true
  //   );

  const fetchUserDetails = async () => {
    const data = await axiosInterceptor.get(`/users/student/${loggedInUserId}`);
    return data;
  };

  const { data, isLoading } = useQuery(
    ['user-details', loggedInUserId],
    fetchUserDetails,
    {
      onError: onFetchUserDetailsFailure,
      enabled: !!loggedInUserId,
      staleTime: 3600 * 10000,
      cacheTime: 3600 * 10000,
    }
  );

  return (
    <>
      <MainContent>
        <div className="bg-white px-2 py-5 rounded-lg flex w-full justify-between">
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon />}>
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
          <Link
            className="bg-claret-500 text-white text-sm py-1 px-3 rounded-md cursor-pointer uppercase font-medium flex items-center align-middle space-x-3"
            to={`/user/${loggedInUserId}`}
          >
            Edit Profile
          </Link>
        </div>
        <div className="bg-white px-4 py-5 mt-4 rounded-md space-y-8">
          {isLoading && <Spinner />}
          {!isLoading && data && (
            <>
              <DashboardHeader
                image={data?.data?.student?.profile_image}
                fullname={`${data?.data?.student?.firstname} ${data?.data?.student?.lastname}`}
                email={data?.data?.student?.email}
                gender={data?.data?.student?.gender}
                country={data?.data?.student?.country}
              />
              <AboutMe bio={data?.data?.student?.profile_desc} />
              <div className="grid grid-cols-2 gap-5">
                {data?.data?.student?.work_experiences && (
                  <WorkAndEducation
                    work
                    items={data?.data?.student?.work_experiences}
                  />
                )}
                {data?.data?.student?.education_backgrounds && (
                  <WorkAndEducation
                    items={data?.data?.student?.education_backgrounds}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-[#EFEFEF]/50 py-5 pl-5 rounded-md pr-2">
                  <h3 className="font-roboto text-lg mb-2">Social media</h3>
                  <div className="flex gap-4">
                    {data?.data?.student?.github_account && (
                      <a
                        target="blank"
                        href={data?.data?.student?.github_account}
                        aria-label="GitHub"
                      >
                        <GitHubIcon className="text-claret-500 cursor-pointer" />
                      </a>
                    )}
                    {data?.data?.student?.linkedin && (
                      <a
                        target="blank"
                        href={data?.data?.student?.linkedin}
                        aria-label="Linkedin"
                      >
                        <LinkedInIcon className="text-claret-500 cursor-pointer" />
                      </a>
                    )}
                    {data?.data?.student?.twitter && (
                      <a
                        target="blank"
                        href={data?.data?.student?.twitter}
                        aria-label="Twitter"
                      >
                        <TwitterIcon className="text-claret-500 cursor-pointer" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </MainContent>
      <RightBar>
        <Calendar />
      </RightBar>
    </>
  );
}

export default MyProfile;
