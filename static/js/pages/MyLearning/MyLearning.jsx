/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import './MyLearning.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RightBar from '../../Components/RightBar';
import Calendar from '../../Components/calendar/Calendar';
import MainContent from '../../Components/MainContent';
import useFetchDataV2 from '../../hooks/useFetchDataV2';
import Modal from '../../Components/Modal';
import CompleteProfile from '../../Components/Modals/CompleteProfile';
import LoadingSkeleton from '../../utils/helpers/LoadingSkeleton';
import useGetLoggedInUserId from '../../hooks/useGetLoggedInUserId';

const today = new Date();

const renderStartDate = (moduleStartDate) => {
  const startDate = new Date(moduleStartDate);
  if (today < startDate) {
    return (
      <div className="m-3">
        Learning starts on{' '}
        <span className="font-bold text-sm">
          {startDate.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>{' '}
        at{' '}
        <span className="text-claret-500">
          {startDate.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'long',
          })}
        </span>
      </div>
    );
  }
  return null;
};

function MyLearning() {
  const navigate = useNavigate();

  const cohortCourseId = useSelector(
    (state) => state?.auth?.userDetails?.cohort?.course_id
  );

  const sponsorshipCohortModules = useSelector(
    (state) => state?.auth?.userDetails?.cohort?.modules || []
  );

  const sponsorshipCohortName = useSelector(
    (state) => state?.auth?.userDetails?.cohort?.name || []
  );

  const percentage =
    useSelector((state) => state.auth.percentage) ||
    parseInt(localStorage.getItem('percentage'), 10);

  const [modalOpen, setModalOpen] = useState(false);
  const [skipModal, setSkipModal] = useState(() =>
    JSON.parse(localStorage.getItem('skipModal') || 'false')
  );
  const [hoveredModule, setHoveredModule] = useState(null);

  const loggedInUserId = useGetLoggedInUserId();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!skipModal && parseInt(percentage, 10) < 93) {
      setModalOpen(true);
    }
  }, [percentage, skipModal]);

  const handleSkipModal = () => {
    setSkipModal(true);
    localStorage.setItem('skipModal', JSON.stringify(true));
    setModalOpen(false);
  };

  const { data: courseData } = useFetchDataV2(
    ['courses', cohortCourseId],
    `/courses/${cohortCourseId}`,
    {},
    !!cohortCourseId && "Couldn't fetch course details. Please try again!",
    cohortCourseId
  );

  const { data: scholarshipModules, isLoading: isLoadingScholarshipModules } =
    useFetchDataV2(
      ['modules', cohortCourseId, false],
      `/course-modules`,
      { params: { courseId: cohortCourseId, is_paid_module: false } },
      "Couldn't fetch course scholarship modules. Please try again!",
      cohortCourseId
    );

  const {
    data: studentPaidModulesData,
    isLoading: isLoadingStudentPaidModules,
  } = useFetchDataV2(
    ['student-paid-modules', loggedInUserId],
    `/student-paid-modules/${loggedInUserId}`,
    {},
    isAuthenticated && "Couldn't fetch student paid modules.",
    loggedInUserId
  );

  const { data: paidModulesData, isLoading: isLoadingPaidModules } =
    useFetchDataV2(
      ['paid-modules', true, true],
      `/course-modules`,
      { params: { is_paid_module: true, is_published: true } },
      "Couldn't fetch available paid modules. Please try again!",
      true
    );

  const availablePaidModules = paidModulesData?.data?.course_modules?.filter(
    (paidModule) =>
      paidModule?.is_published && // Check if the module is published
      !studentPaidModulesData?.data?.student_paid_modules?.some(
        (studentPaidModule) => studentPaidModule?.module?.id === paidModule?.id
      )
  );

  return (
    <>
      <MainContent>
        {(!!cohortCourseId && isLoadingScholarshipModules) ||
        (!!loggedInUserId && isLoadingStudentPaidModules) ||
        isLoadingPaidModules ? (
          <LoadingSkeleton />
        ) : (
          <div>
            {courseData && (
              <div className="middle flex flex-col">
                <div className="bg-white rounded-md w-full p-2 h-auto flex flex-row justify-between items-center">
                  <div className="text-lg">
                    <h4 className="text-mine-shaft-500 font-bold">
                      {courseData?.data?.course?.courseName} -{' '}
                      {sponsorshipCohortName}
                    </h4>
                    <small className="text-mine-shaft-500">
                      {courseData?.data?.course?.courseDescription}
                    </small>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 my-4 md:grid-cols-2 lg:grid-cols-3 place-items-center xl:grid-cols-3">
                  {scholarshipModules?.data?.course_modules?.map(
                    (module) =>
                      module.courseId === cohortCourseId &&
                      sponsorshipCohortModules.includes(module.id) && (
                        <div
                          key={module.id}
                          className="bg-white rounded-md w-60 mt-5 cursor-pointer hover:scale-110 ease-in-out duration-300 hover:drop-shadow-lg"
                          onClick={() => navigate(`course-module/${module.id}`)}
                        >
                          <img
                            src={module.moduleImage}
                            alt=""
                            className="w-full h-40 object-cover object-top rounded-md shadow-lg"
                          />
                        </div>
                      )
                  )}
                </div>
                <br />
              </div>
            )}
            {studentPaidModulesData?.data?.student_paid_modules?.length > 0 && (
              <>
                <div className="bg-white rounded-md w-full p-2 h-auto flex flex-row justify-between items-center">
                  <div className="text-lg">
                    <h4 className="text-mine-shaft-500 font-bold">
                      My Advanced Modules
                    </h4>
                    <small className="text-mine-shaft-500 capitalize">
                      Level up your skills
                    </small>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 my-4 md:grid-cols-2 lg:grid-cols-3 place-items-center xl:grid-cols-3">
                  {studentPaidModulesData?.data?.student_paid_modules?.map(
                    (student_paid_module) => (
                      <div
                        key={student_paid_module?.module?.id}
                        className="relative"
                        onMouseEnter={() =>
                          setHoveredModule(student_paid_module)
                        }
                        onMouseLeave={() => setHoveredModule(null)}
                      >
                        <div
                          className="bg-white rounded-md w-60 mt-5 cursor-pointer hover:scale-110 ease-in-out duration-300 hover:drop-shadow-lg"
                          onClick={() =>
                            today >= new Date(student_paid_module.start_date) &&
                            navigate(
                              `course-module/${student_paid_module?.module?.id}`
                            )
                          }
                        >
                          <img
                            src={student_paid_module?.module?.moduleImage}
                            alt=""
                            className="w-full h-40 object-cover object-top rounded-md shadow-lg"
                          />
                          {renderStartDate(student_paid_module.start_date)}
                        </div>
                        {hoveredModule === student_paid_module && (
                          <div className="absolute font-sans bottom-0 right-0 translate-x-full bg-claret-500 text-white text-sm rounded-md p-4 shadow-md z-10">
                            <p>
                              {
                                student_paid_module?.module
                                  ?.moduleShortDescription
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </>
            )}
            {availablePaidModules?.length > 0 && (
              <>
                <div className="bg-white rounded-md w-full p-2 h-auto flex flex-row justify-between items-center">
                  <div className="text-lg">
                    <h4 className="text-mine-shaft-500 font-bold">
                      {studentPaidModulesData?.data?.student_paid_modules
                        ?.length > 0
                        ? 'Other Advanced Modules We Offer'
                        : 'Advanced Modules We Offer'}
                    </h4>
                    <small className="text-mine-shaft-500 capitalize">
                      Level up your skills
                    </small>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 my-4 md:grid-cols-2 lg:grid-cols-3 place-items-center xl:grid-cols-3">
                  {availablePaidModules?.map((paid_module) => (
                    <div key={paid_module.id} className="relative">
                      <div className="bg-white rounded-md w-60  mt-5 cursor-pointer hover:scale-110 ease-in-out duration-300 hover:drop-shadow-lg relative">
                        <img
                          src={paid_module.moduleImage}
                          alt={paid_module.moduleName}
                          className="w-full h-40 object-cover object-top rounded-md shadow-lg"
                          onMouseEnter={() => setHoveredModule(paid_module)}
                          onMouseLeave={() => setHoveredModule(null)}
                        />
                        <p className="mt-2 ml-2 capitalize font-bold line-clamp-1">
                          {paid_module.moduleName}
                        </p>
                        <div className="flex space-x-2 align-middle items-center">
                          <p className="m-2 capitalize font-medium text-sm text-claret-500">
                            {paid_module.local_currency &&
                            paid_module.localised_price_after_discount
                              ? `${paid_module.local_currency} ${Number(
                                  paid_module.localised_price_after_discount
                                )}`
                              : `USD ${Math.ceil(
                                  Number(paid_module.usd_price_after_discount)
                                )}`}
                          </p>
                          {paid_module.percentage_discount && (
                            <p className="capitalize font-light text-xs text-gray-500 my-2 line-through">
                              {paid_module.local_currency &&
                              paid_module.localised_principal_price
                                ? `${paid_module.local_currency} ${Math.ceil(
                                    Number(
                                      paid_module.localised_principal_price
                                    )
                                  )}`
                                : `USD ${Math.ceil(
                                    Number(paid_module.usd_principal_price)
                                  )}`}
                            </p>
                          )}
                        </div>
                        <div className="m-2 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="bg-persian-500 hover:bg-persian-600 px-4 py-1 rounded-lg text-white text-sm flex items-center"
                            onClick={() =>
                              navigate(`/module/${paid_module.id}`)
                            }
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            className="bg-claret-500 hover:bg-claret-700 px-4 py-1 rounded-lg text-white text-sm flex items-center"
                            onClick={() =>
                              navigate(
                                `/course-module/${paid_module.id}/checkout`
                              )
                            }
                          >
                            Enroll Now
                          </button>
                        </div>
                        {paid_module.percentage_discount && (
                          <div className="text-xs h-6 w-fit p-1 bg-teal-600 rounded-tl-xl rounded-br-xl absolute top-0 left-0 text-white font-medium">
                            -{paid_module.percentage_discount}%
                          </div>
                        )}
                      </div>
                      {hoveredModule === paid_module && (
                        <div className="absolute font-sans bottom-0 right-0 translate-x-full bg-claret-500 text-white text-sm rounded-md p-4 shadow-md z-10">
                          <p>{paid_module.moduleShortDescription}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </MainContent>
      <RightBar>
        <Calendar />
      </RightBar>
      {modalOpen && (
        <Modal modalOpen={modalOpen} title="Profile Incomplete">
          <CompleteProfile
            userId={loggedInUserId}
            percentage={percentage}
            handleSkip={handleSkipModal}
          />
        </Modal>
      )}
    </>
  );
}

export default MyLearning;
