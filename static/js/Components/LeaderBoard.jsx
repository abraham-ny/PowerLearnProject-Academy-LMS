import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import useGetLoggedInUserId from '../hooks/useGetLoggedInUserId';

const baseURL =
  process.env.REACT_APP_ANAYTICS_URL ||
  'https://api.lms.v2.powerlearnprojectafrica.org/analytics/api';

function LeaderBoard() {
  const loggedInUserId = useGetLoggedInUserId();

  const studentCohortId = useSelector(
    (state) => state?.auth?.userDetails?.cohort?.id
  );

  const onFetchUserStatsFailure = () => {
    // dispatch(updateDetailsWithPercentage(percentage));
    toast.error("Couldn't fetch user details. Please try again!");
  };

  const fetchUserStats = async () => {
    const data = await axios.get(
      `${baseURL}/leaderboard-stats/${loggedInUserId}`,
      {
        params: { cohort_id: studentCohortId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    return data;
  };

  const { data, isLoading } = useQuery(
    ['user-stats', loggedInUserId],
    fetchUserStats,
    {
      onError: onFetchUserStatsFailure,
      enabled: !!loggedInUserId,
      staleTime: 3600 * 10000,
      cacheTime: 3600 * 10000,
    }
  );

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg">Leaderboard</h3>
      <hr className="h-[2px] bg-black my-2" />
      <div className=" border-[0.5px] rounded-md overflow-hidden border-gray-500">
        <div className=" grid grid-cols-2 bg-gray-200 text-sm p-1 font-roboto capitalize">
          <p>Student Name</p>
          {/* <p>badges</p> */}
          <p className="w-12">points</p>
        </div>
        {!isLoading &&
          data &&
          data?.data?.data?.map((student, index) => (
            <div
              key={student.Id}
              className={`${
                index % 2 === 0 ? 'bg-[#D0EFED]' : ''
              } grid grid-cols-2 text-sm p-1`}
            >
              <div className="capitalize flex space-x-1">
                {student.Id === loggedInUserId ? (
                  <>
                    <p className="font-roboto font-medium">
                      {student.position}.
                    </p>
                    <p className="font-roboto font-medium">My Score</p>
                  </>
                ) : (
                  <>
                    <p>{student.position}.</p>
                    <p className="truncate capitalize">
                      <Tooltip
                        title={`${student.firstname} ${student.lastname}`}
                      >
                        {student.firstname} {student.lastname}
                      </Tooltip>
                    </p>
                  </>
                )}
              </div>
              <p
                className={`${
                  student.Id === loggedInUserId ? 'font-medium font-roboto' : ''
                } text-center w-12 `}
              >
                {student.points}
              </p>
            </div>
          ))}
        {/* <div className="grid grid-cols-3 text-sm p-1  bg-[#D0EFED]">
          <p>2. John</p>
          <p>3</p>
          <p>300</p>
        </div> */}
      </div>
    </div>
  );
}

export default LeaderBoard;
