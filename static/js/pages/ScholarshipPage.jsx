import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ModuleSkeleton from '../Components/ModuleSkeleton';
import LandingPageScholarshipModule from '../Components/LandingPageScholarshipModule';
import PreDashboardNavbar from '../Components/PreDashboardNavbar';

const baseURL =
  process.env.REACT_APP_BASE_URL ||
  'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

const courseFilterId =
  process.env.REACT_APP_LANDING_PAGE_COURSE_ID || '62fbec0d28ac4762bc524f91';

const getScholarshipModules = async () => {
  const response = (
    await axios.get(`${baseURL}/course-modules`, {
      params: {
        courseId: courseFilterId,
      },
    })
  ).data;
  return response;
};

function LandingPage() {
  const { data, isLoading } = useQuery(
    ['scholarship-modules', courseFilterId],
    getScholarshipModules,
    {
      staleTime: 3600000,
    }
  );

  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [visibleModules, setVisibleModules] = useState([]);

  const categoriesOptions = [
    { value: 'All Categories', label: 'All Categories' },
    { value: 'Front-End', label: 'Front-End' },
    { value: 'Back-End', label: 'Back-End' },
    { value: 'Data Analytics', label: 'Data Analytics' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
    { value: 'Cyber Security', label: 'Cyber Security' },
    { value: 'Entrepreneurship', label: 'Entrepreneurship' },
  ];

  useEffect(() => {
    if (selectedCategory === 'All Categories' || selectedCategory === null) {
      setVisibleModules(data?.course_modules);
    } else {
      setVisibleModules(
        data?.course_modules.filter(
          (course_module) => course_module.category === selectedCategory
        )
      );
    }
  }, [data?.course_modules, selectedCategory]);

  return (
    <div className=" max-w-7xl h-screen mx-auto flex flex-col gap-5  relative  ">
      <div className="flex justify-center">
        <PreDashboardNavbar />
      </div>
      <div className="flex flex-col gap-3 justify-center mt-24">
        <div className="mx-3 xl:mx-0 mb-1 rounded-md text-center flex justify-between items-center bg-persian-500">
          <h2 className="font-bold text-xl text-white px-4 py-4">
            SCHOLARSHIP MODULES
          </h2>
          <button
            className="border-[1px] border-claret-500 bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center mr-3"
            type="button"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon className="inherit" />
            <p className="hidden md:flex">Go Back</p>
          </button>
        </div>
        <div className="w-full">
          <Select
            isClearable
            placeholder="Filter by Category"
            className="react-dropdown mx-3 xl:mx-0"
            classNamePrefix="dropdown"
            options={categoriesOptions}
            onChange={(event) => {
              setSelectedCategory(event?.value || null);
            }}
          />
        </div>
        {isLoading ? (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-40 justify-center items-center">
            {Array.from(new Array(8)).map((item) => (
              <ModuleSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 justify-center items-center mb-40">
            {visibleModules?.length >= 1 ? (
              visibleModules?.map((module) => (
                <LandingPageScholarshipModule
                  scholarship
                  key={module.id}
                  module={module}
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-5">
                <h3 className="text-xl text-center font-semibold capitalize">
                  {selectedCategory === 'All Categories'
                    ? ' Paid courses coming soon'
                    : ` Courses on ${selectedCategory} coming soon`}
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
