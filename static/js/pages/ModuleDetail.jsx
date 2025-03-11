/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-unescaped-entities */
import React, { startTransition, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ReactPlayer from 'react-player/youtube';

import { useSelector } from 'react-redux';
import useFetchData from '../hooks/useFetchData';
import SingleWeek from '../Components/SingleWeek';
import useParsedData from '../hooks/useParsedData';
import useGetLoggedInUserId from '../hooks/useGetLoggedInUserId';
import PreDashboardNavbar from '../Components/PreDashboardNavbar';

const baseURL =
  process.env.REACT_APP_BASE_URL ||
  'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

const getAvailableModuleDetail = async (id) => {
  const response = (await axios.get(`${baseURL}/course-modules/${id}`)).data;
  return response;
};

function ModuleDetail() {
  const [activeIndex, setActiveIndex] = useState({ index: null, id: null });
  const loggedInUserId = useGetLoggedInUserId();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery(
    ['available-modules', moduleId],
    () => getAvailableModuleDetail(moduleId),
    {
      staleTime: 3600000,
    }
  );

  const singleModule = data?.course_module;

  // get weeks
  const { data: moduleWeeks, isLoading } = useFetchData(
    ['module-weeks', moduleId],
    '/module-weeks',
    { params: { moduleId } },
    "Couldn't fetch module weeks. Please try again!",
    true
  );

  const activeIndexHandler = (index, id) => {
    if (index === activeIndex?.index) {
      setActiveIndex(null);
    } else {
      setActiveIndex({ index, id });
    }
  };

  // check if student is already enrolled in the module
  const { data: studentPaidModulesCheckData } = useFetchData(
    ['student-paid-module-check', loggedInUserId, moduleId],
    `/student-paid-modules/check`,
    { params: { student_id: loggedInUserId, module_id: moduleId } },
    isAuthenticated && "Couldn't get student paid module enrollment status.",
    isAuthenticated
  );

  const is_enrolled =
    studentPaidModulesCheckData?.data?.check?.is_enrolled ?? false;

  const is_sponsored_module = !(singleModule?.is_paid_module ?? false);

  const handleEnroll = () => {
    // eslint-disable-next-line no-unused-expressions
    isAuthenticated
      ? startTransition(() => navigate(`/course-module/${moduleId}/checkout`))
      : startTransition(() =>
          navigate(
            `/create-account?redirectTo=/course-module/${moduleId}/checkout`
          )
        );
  };

  return (
    <div className=" h-screen relative">
      <div className="flex justify-center">
        <PreDashboardNavbar />
      </div>

      <div className=" max-w-7xl mx-auto flex flex-col gap-5">
        <div className="mt-[8rem] pb-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  left-0 right-0 max-w-7xl mx-auto maxMd:px-4 h-fit ">
            <div className="bg-yellow-5 space-y-2">
              <h2 className="font-semibold text-2xl text-claret-500 overflow-auto">
                {singleModule?.moduleName}
              </h2>
              <p className="text-justify">
                {singleModule?.moduleShortDescription}
              </p>
              <div className="my-4 flex gap-2 items-center">
                <p className="font-roboto text-sm">
                  Category:{' '}
                  <span className="text-claret-500 font-medium">
                    {singleModule?.category}
                  </span>
                </p>
                <div className=" w-[2px] h-[14px] bg-black" />
                <p className="font-roboto text-sm">
                  Language:{' '}
                  <span className="text-claret-500 font-medium">English</span>
                </p>
              </div>
              {singleModule && singleModule?.usd_principal_price && (
                <div className="flex space-x-4 items-center">
                  <p className="font-roboto font-medium text-2xl">
                    {singleModule?.localised_price_after_discount
                      ? `${singleModule?.local_currency} ${Math.ceil(
                          Number(singleModule?.localised_price_after_discount)
                        )}`
                      : `USD ${Math.ceil(
                          Number(singleModule?.usd_price_after_discount)
                        )}`}
                  </p>
                  {singleModule?.percentage_discount &&
                    (singleModule?.localised_principal_price ? (
                      <p className="font-roboto font-normal text-gray-800/50 line-through text-sm ">
                        {singleModule?.local_currency}{' '}
                        {Math.ceil(
                          Number(singleModule?.localised_principal_price)
                        )}
                      </p>
                    ) : (
                      <p className="font-roboto font-normal text-gray-800/50 line-through text-sm ">
                        USD{' '}
                        {Math.ceil(Number(singleModule?.usd_principal_price))}
                      </p>
                    ))}
                </div>
              )}
              <div className="flex justify-center items-center h-fit">
                {is_enrolled || is_sponsored_module ? (
                  <button
                    className="text-white bg-claret-500 cursor-pointer font-roboto w-[80%] font-normal px-8 p-3 text-xl rounded-md capitalize hover:scale-110 ease-in-out duration-300 flex justify-center items-center space-x-2 m-2"
                    type="button"
                    onClick={() =>
                      isAuthenticated
                        ? startTransition(() => navigate('/'))
                        : startTransition(() => navigate(`/login`))
                    }
                  >
                    <p>View Content</p>
                    <VisibilityOutlinedIcon fontSize="inherit" />
                  </button>
                ) : (
                  <button
                    className={`${
                      singleModule?.is_published
                        ? 'text-white bg-claret-500 cursor-pointer'
                        : 'text-black bg-gray-400 cursor-not-allowed'
                    } font-roboto w-[80%] font-normal px-8 p-3 text-xl rounded-md capitalize hover:scale-110 ease-in-out duration-300 flex justify-center items-center space-x-2 mt-4`}
                    type="button"
                    disabled={!singleModule?.is_published}
                    onClick={handleEnroll}
                  >
                    <p>
                      {singleModule?.is_published
                        ? 'enroll now'
                        : 'registration begins shortly.'}
                    </p>
                    <SchoolOutlinedIcon fontSize="inherit" />
                  </button>
                )}
              </div>
            </div>
            {singleModule?.intro_video_url ? (
              <div className="bg-red-00 rounded-md overflow-hidden">
                <ReactPlayer
                  url={singleModule?.intro_video_url}
                  width="100%" // Set width to 100% of the parent div
                  height="100%" // Set height to 100% or adjust as necessary
                />
              </div>
            ) : (
              <div
                className="bg-red-00 rounded-md overflow-scroll"
                style={{
                  backgroundImage: `url(${singleModule?.moduleImage})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-full bg-white p-8  ">
        <div className=" maxMd:grid grid-cols-3 gap-2 flex justify-between max-w-7xl mx-auto ">
          {/* <div className="flex-wrap justify-between gap-4 flex max-w-7xl mx-auto"> */}
          <div className=" flex flex-col align-middle items-center">
            <p className="text-xl font-semibold capitalize">
              {singleModule?.skillLevel}
            </p>
            <p className="text-sm font-light">Skill Level</p>
          </div>
          <div className="flex flex-col align-middle items-center">
            <p className="text-xl font-semibold capitalize">
              {moduleWeeks?.data?.weeks?.length ?? 0}{' '}
              {moduleWeeks?.data?.weeks?.length === 1 ? 'week' : 'weeks'}
            </p>
            <p className="text-sm font-light">Duration</p>
          </div>

          <div className=" flex flex-col align-middle items-center">
            <p className="text-xl font-semibold capitalize">
              {singleModule?.learning_mode}
            </p>
            <p className="text-sm font-light">Learning Mode</p>
          </div>
          <div className=" flex flex-col align-middle items-center">
            <p className="text-xl font-semibold capitalize">
              {singleModule?.hours_of_learning}
            </p>
            <p className="text-sm font-light">Hours of Learning</p>
          </div>
          <div className=" flex flex-col align-middle items-center">
            <p className="text-xl font-semibold capitalize">Yes</p>
            <p className="text-sm font-light">Certificate</p>
          </div>
        </div>
      </div>
      <div className="w-full p-8">
        <div className="grid grid-cols-1 gap-7 max-w-7xl mx-auto text-justify ">
          <div className="space-y-2 shadow-md border border-5 p-5 bg-[#D0EFED]">
            <h3 className="capitalize text-xl font-semibold">
              Course Module Description
            </h3>
            {useParsedData(singleModule?.moduleDescription || '')}
          </div>
          <div className="space-y-2 shadow-md border border-5 p-5 bg-[#D0EFED]">
            <h3 className="capitalize text-xl font-semibold">Requirements</h3>
            {useParsedData(singleModule?.requirements || '')}
          </div>
        </div>
      </div>
      <div className="w-full bg-white p-6  space-y-6">
        <h3 className="font-semibold text-2xl capitalize text-center">
          What you'll learn
        </h3>
        <div className="bg-gray-100 border rounded-md p-3 flex justify-start max-w-7xl mx-auto flex-wrap items-start gap-5">
          {useParsedData(singleModule?.what_to_be_learnt || '')}
        </div>
      </div>
      <div className="w-full bg-white p-6 space-y-6">
        <h3 className="font-semibold text-2xl capitalize text-center">
          technologies mastered
        </h3>
        <div className="bg-gray-100 border rounded-md p-3 flex justify-start max-w-7xl mx-auto flex-wrap items-start gap-5">
          {useParsedData(singleModule?.technologies_to_be_mastered || '')}
        </div>
      </div>
      <div className="w-full  bg-white p-6  space-y-6">
        <h3 className="font-semibold text-2xl capitalize text-center">
          course curriculum
        </h3>
        <div className=" grid grid-cols-1  md:grid-cols-2 gap-4  max-w-7xl mx-auto ">
          {/* <div className="flex-wrap justify-between gap-4 flex max-w-7xl mx-auto"> */}
          {!moduleWeeks?.data?.weeks && !isLoading && (
            <h3 className="text-xl col-span-2 font-semibold text-center">
              Curriculum not uploaded yet
            </h3>
          )}
          {moduleWeeks?.data?.weeks?.map((week, index) => (
            <SingleWeek
              key={week.id}
              week={week}
              number={index + 1}
              isActive={activeIndex?.index === index + 1}
              activeIndexHandler={activeIndexHandler}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center bg-white">
        {is_enrolled || is_sponsored_module ? (
          <button
            className="text-white bg-claret-500 cursor-pointer font-roboto w-[40%] font-normal px-8 p-3 text-xl rounded-md capitalize hover:scale-110 ease-in-out duration-300 flex justify-center items-center space-x-2 mb-20"
            type="button"
            onClick={() =>
              isAuthenticated ? navigate('/') : navigate(`/login`)
            }
          >
            <p>View Content</p>
            <VisibilityOutlinedIcon fontSize="inherit" />
          </button>
        ) : (
          <button
            className={`${
              singleModule?.is_published
                ? 'text-white bg-claret-500 cursor-pointer'
                : 'text-black bg-gray-400 cursor-not-allowed'
            } font-roboto w-[40%] font-normal px-8 p-3 text-xl rounded-md capitalize hover:scale-110 ease-in-out duration-300 flex justify-center items-center space-x-2 mb-20`}
            type="button"
            disabled={!singleModule?.is_published}
            onClick={handleEnroll}
          >
            <p>
              {singleModule?.is_published
                ? 'enroll now'
                : 'registration begins shortly.'}
            </p>
            <SchoolOutlinedIcon fontSize="inherit" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ModuleDetail;
