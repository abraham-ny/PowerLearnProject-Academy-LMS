/* eslint-disable react/no-array-index-key */
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import useGetLoggedInUserId from '../hooks/useGetLoggedInUserId';
import MainContent from '../Components/MainContent';
import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';
import DashboardHeader from '../Components/dashboard/DashboardHeader';
import DashboardCards from '../Components/dashboard/DashboardCards';
import Spinner from '../Components/spinner/Spinner';
import PLPBadge from '../Components/PLPBadge';
import DashboardEnrolledModule from '../Components/dashboard/DashboardEnrolledModule';
import RightBar from '../Components/RightBar';
import Calendar from '../Components/calendar/Calendar';
import LeaderBoard from '../Components/LeaderBoard';
import useFetchAnalytics from '../hooks/useFetchAnalytics';
// import PLPBadge from '../Assets/icons/PLPBadge.svg';

// const module = {
//   category: 'Front-End',
//   courseId: '64e71b6ce86de10932b97528',
//   createdAt: '2023-08-24 09:41:50.413 +0000 UTC',
//   id: '64e725dee86de10932b9752a',
//   intro_video_url: 'https://www.youtube.com/watch?v=yZvFH7B6gKI',
//   moduleDescription:
//     '<ul><li>Basic principles and concepts of data analysis</li><li>Techniques for data cleaning and preprocessing</li><li>Statistical methods for analyzing data distributions and relationships</li><li>How to use programming languages like Python or R for data manipulation and analysis</li><li>Data visualization techniques to communicate findings effectively</li><li>Introduction to machine learning algorithms for predictive analysis</li><li>Exploring different types of data structures and databases</li><li>Hands-on experience with tools such as SQL for querying databases</li><li>Ethical considerations and best practices in data analysis</li><li>Real-world case studies and projects to apply learned concepts in practical scenarios</li></ul>',
//   moduleImage:
//     'https://s3.fr-par.scw.cloud/files.powerlearnprojectafrica.org/lms/staging/images/oqQCtQaKdywBhgxY?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=SCW1GD83Z2RS0PZEWJNW%2F20240226%2Ffr-par%2Fs3%2Faws4_request&X-Amz-Date=20240226T070238Z&X-Amz-Expires=518400&X-Amz-SignedHeaders=host&X-Amz-Signature=32e25a6dc1cdfb6e407c1393e580125e3490ad4d8224860be6bee24b09107078',
//   moduleName: 'Python',
//   moduleShortDescription: 'Python programming',
//   skillLevel: 'beginner',
//   what_to_be_learnt: 'Python',
// };

function MyDashboard() {
  const loggedInUserId = useGetLoggedInUserId();

  const fetchUserDetails = async () => {
    const data = await axiosInterceptor.get(
      `/users/student/${loggedInUserId}`,
      {
        params: { $limit: 50 },
      }
    );
    return data;
  };

  const { data: studentStats, isLoading: studentStatsLoading } =
    useFetchAnalytics(
      ['student-analytics', loggedInUserId],
      `/student`,
      {},
      "Couldn't fetch student dashboard analytics. Please try again"
    );

  const onFetchUserDetailsFailure = () => {
    // dispatch(updateDetailsWithPercentage(percentage));
    toast.error("Couldn't fetch user details. Please try again!");
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
        </div>
        <div className="bg-white px-4 py-5 mt-4 rounded-md space-y-8 ">
          {(isLoading || studentStatsLoading) && <Spinner />}
          {!isLoading && !studentStatsLoading && data && (
            <>
              <DashboardHeader
                image={data?.data?.student?.profile_image}
                fullname={`${data?.data?.student?.firstname} ${data?.data?.student?.lastname}`}
                email={data?.data?.student?.email}
                gender={data?.data?.student?.gender}
                country={data?.data?.student?.country}
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* <div className="bg-red-500/10 flex justify-between"> */}
                <DashboardCards
                  icon={
                    <PersonSearchIcon className=" bg-gradient-to-r from-[#8B173B] to-[#00999E] bg-clip-text" />
                  }
                  title="enrolled modules"
                  count={studentStats?.data?.total_enrolled_modules || 0}
                />
                <DashboardCards
                  icon={<BusinessCenterIcon />}
                  title="completed modules"
                  count={studentStats?.data?.total_completed_modules || 0}
                />
                <DashboardCards
                  icon={<MilitaryTechIcon />}
                  title="badges"
                  count={studentStats?.data?.total_badges || 0}
                />
              </div>
              <div className="">
                <div className=" pb-2 border-b-2 border-b-black ">
                  <h3 className="font-roboto text-xl font capitalize">
                    Enrolled Modules
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3">
                  {studentStats?.data?.student_modules_progress?.map(
                    (student_enrolled_module) => (
                      <DashboardEnrolledModule
                        key={student_enrolled_module.module_id}
                        enrolled_module={{
                          id: student_enrolled_module?.module_id,
                          name: student_enrolled_module?.module_name,
                          image: student_enrolled_module?.module_image,
                          category: student_enrolled_module.module_category,
                          completion: student_enrolled_module.completion,
                          is_paid_module:
                            student_enrolled_module?.is_paid_module ?? false,
                          start_date: student_enrolled_module?.start_date ?? '',
                        }}
                      />
                    )
                  )}
                </div>
              </div>
              {studentStats?.data?.student_badges?.length > 0 && (
                <div className="">
                  <div className=" pb-2 border-b-2 border-b-black ">
                    <h3 className="font-roboto text-xl font capitalize">
                      Badges
                    </h3>
                  </div>
                  <div className=" grid grid-cols-4 justify-between py-10 gap-2">
                    <PLPBadge />
                    <PLPBadge />
                    <PLPBadge />
                    <PLPBadge />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </MainContent>
      <RightBar>
        <LeaderBoard />
        <Calendar />
      </RightBar>
    </>
  );
}

export default MyDashboard;
