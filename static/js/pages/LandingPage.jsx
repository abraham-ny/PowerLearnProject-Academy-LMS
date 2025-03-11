import React, { useEffect, useState } from 'react';
// import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import LandingPagePaidModule from '../Components/LandingPagePaidModule';
import LandingPageScholarshipCourse from '../Components/LandingPageScholarshipCourse';
import ModuleSkeleton from '../Components/ModuleSkeleton';
import PreDashboardNavbar from '../Components/PreDashboardNavbar';

const baseURL =
  process.env.REACT_APP_BASE_URL ||
  'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

const courseFilterId =
  process.env.REACT_APP_LANDING_PAGE_COURSE_ID || '62fbec0d28ac4762bc524f91';

function LandingPage() {
  const getScholarshipCourse = async () => {
    const response = await axios.get(`${baseURL}/courses/${courseFilterId}`);

    return response;
  };

  const categoriesOptions = [
    { value: 'All Categories', label: 'All Categories' },
    { value: 'Front-End', label: 'Front-End' },
    { value: 'Back-End', label: 'Back-End' },
    { value: 'Data Analytics', label: 'Data Analytics' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
    { value: 'Cyber Security', label: 'Cyber Security' },
    { value: 'Entrepreneurship', label: 'Entrepreneurship' },
  ];

  const getPaidModules = async () => {
    const response = (
      await axios.get(`${baseURL}/course-modules`, {
        params: { is_paid_module: true },
      })
    ).data;
    return response;
  };
  // const navigate = useNavigate();
  const { data: courseData, isLoading } = useQuery(
    ['courses', courseFilterId],
    getScholarshipCourse,
    {
      staleTime: 3600 * 10000,
      cacheTime: 3600 * 10000,
      enabled: !!courseFilterId,
    }
  );

  const { data: paidModules, isLoading: isLoadingPaidModules } = useQuery(
    ['paid-modules'],
    getPaidModules,
    {
      staleTime: 3600 * 10000,
      cacheTime: 3600 * 10000,
    }
  );

  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [visiblePaidModules, setVisiblePaidModules] = useState([]);

  useEffect(() => {
    if (selectedCategory === 'All Categories' || selectedCategory === null) {
      setVisiblePaidModules(paidModules?.course_modules);
    } else {
      setVisiblePaidModules(
        paidModules?.course_modules.filter(
          (course_module) => course_module.category === selectedCategory
        )
      );
    }
  }, [paidModules?.course_modules, selectedCategory]);

  return (
    <div className=" max-w-7xl h-screen mx-auto flex flex-col gap-5 relative  ">
      <div className="flex justify-center">
        <PreDashboardNavbar />
      </div>
      <div className="flex flex-col gap-3 justify-center mt-24">
        <div className="mx-3 xl:mx-0 mb-1 rounded-md text-center justify-center items-center bg-persian-500">
          <h2 className="font-bold text-xl text-white px-4 py-4">
            AVAILABLE COURSES
          </h2>
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

        {isLoading || isLoadingPaidModules ? (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-40 justify-center items-center">
            {Array.from(new Array(8)).map((item) => (
              <ModuleSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 justify-center items-center mb-40">
            {!isLoading &&
              !isLoadingPaidModules &&
              courseData?.data?.course && (
                <LandingPageScholarshipCourse
                  course={courseData?.data?.course}
                />
              )}
            {!isLoading &&
            !isLoadingPaidModules &&
            visiblePaidModules?.length >= 1 ? (
              visiblePaidModules?.map((module) => (
                <LandingPagePaidModule key={module.id} module={module} />
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
