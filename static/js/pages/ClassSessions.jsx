import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MainContent from '../Components/MainContent';
import CommonTopTab from '../Components/CommonTopTab';
import Spinner from '../Components/spinner/Spinner';
import useGetLoggedInUser from '../hooks/useGetLoggedInUserDetails';
import useFetchDataV2 from '../hooks/useFetchDataV2';
import ClassSessionCalendarSchedule from '../Components/ClassSessionCalendarSchedule';

function ClassSessions() {
  const cohortId = useGetLoggedInUser().cohort.id;
  const { data, isLoading } = useFetchDataV2(
    ['class-sessions', cohortId],
    '/class-sessions',
    {
      params: { cohort_id: cohortId },
    },
    "Couldn't get class sessions. Please try again!",
    !!cohortId
  );

  return (
    <MainContent full>
      <CommonTopTab>
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
      </CommonTopTab>
      {isLoading && cohortId ? (
        <div className="mt-5 bg-white py-5">
          <Spinner />
        </div>
      ) : (
        <ClassSessionCalendarSchedule
          classSessions={data?.data?.class_sessions || []}
        />
      )}
    </MainContent>
  );
}

export default ClassSessions;
