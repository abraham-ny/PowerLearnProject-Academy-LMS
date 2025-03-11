import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GroupIcon from '@mui/icons-material/Group';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import { Edit } from '@mui/icons-material';
import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';
import MainContent from '../Components/MainContent';
import Spinner from '../Components/spinner/Spinner';
import Modal from '../Components/Modal';
import AddEducation from '../Components/AddEducation';
import EditEducation from '../Components/EditEducation';
import school from '../Assets/img/college.jpeg';
import ProfileModal from '../Components/ProfileModal';
// import useFetchData from '../hooks/useFetchData';

function EditEducationalBackground() {
  const { userId } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [oneUser, setOneUser] = useState({});
  const queryClient = useQueryClient();
  const [eduMOdal, setEduModal] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [educationId, setEducationId] = useState('');

  const navigate = useNavigate();

  const toggleEduModal = () => {
    setEduModal(!eduMOdal);
  };

  // TODO: configure pagination with the table
  const fetchUserDetails = async () => {
    const data = await axiosInterceptor.get(`/users/student/${userId}`, {
      params: { $limit: 50, is_student: false },
    });
    return data;
  };

  const onFetchUserDetailsFailure = () => {
    toast.error("Couldn't fetch user details. Please try again!");
  };

  const { data, isLoading } = useQuery(
    ['user-details', userId],
    fetchUserDetails,
    {
      onSuccess: (user) => {
        setOneUser(user.data.data);
      },
      onError: onFetchUserDetailsFailure,
      initialData: () => {
        return setOneUser(
          queryClient
            .getQueryData(['users'])
            ?.data?.data?.student?.find((user) => user.id === userId)
        );
      },
      enabled: !!userId,
      staleTime: 3600 * 10000,
      cacheTime: 3600 * 10000,
    }
  );

  const toggleEditEducation = () => {
    setEditEducation(!editEducation);
  };

  const fetchEducationBackground = async () => {
    // Make the API request using the educationId if it's not empty
    // eslint-disable-next-line no-use-before-define
    if (educationId !== '' && !education) {
      try {
        const response = await axiosInterceptor.get(
          `/students/education-background/${educationId}`
        );

        return response.data;
      } catch (error) {
        throw new Error('Could not get user education background');
      }
    }
    return null;
  };

  const { data: education, isLoading: isEducation } = useQuery(
    ['education-background', educationId],
    fetchEducationBackground,
    {
      enabled: educationId !== '',
    }
  );

  const level = education?.student_education_background?.level_of_education;
  const institution = education?.student_education_background?.institution;
  const course = education?.student_education_background?.course_taken;
  const current = education?.student_education_background?.is_current;
  const start = education?.student_education_background?.start_date;
  const end = education?.student_education_background?.end_date;

  const city = education?.student_education_background?.city;
  const country = education?.student_education_background?.country;

  return (
    <MainContent full>
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
          <NavLink
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            onClick={() => navigate(-1)}
            to={() => navigate(-1)}
            className="flex items-center"
          >
            <GroupIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            <p>Profile</p>
          </NavLink>
        </Breadcrumbs>
      </div>
      {isLoading ? (
        <div className="bg-white mt-4 flex justify-center items-center align-middle">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="bg-white px-4 py-5 w-full mt-4 rounded-md">
            <div className="flex align-middle justify-between">
              <p className="flex justify-center items-center py-2 text-2xl">
                Education
              </p>
              <div className="space-x-4">
                <AddIcon
                  className="text-gray-600 font-bold"
                  onClick={() => toggleEduModal()}
                />
              </div>
            </div>
            <div className="space-y-4">
              {data?.data?.student?.education_backgrounds &&
                data?.data?.student?.education_backgrounds?.map(
                  (education_background) => (
                    <div
                      key={education_background.id}
                      className="text-gray-500 text-sm "
                    >
                      <div className="w-full flex flex-row space-x-6">
                        <div>
                          <img src={school} alt="" className="h-10" />
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row justify-between items-center">
                            <p className="text-black font-normal text-lg">
                              {education_background.institution}
                            </p>
                            <div>
                              <div className="flex justify-end flex-row space-x-4">
                                <div
                                  onClick={() => {
                                    setEducationId(education_background.id);
                                    toggleEditEducation();
                                  }}
                                >
                                  <Edit className="hover:bg-gray-300 rounded-full cursor-pointer" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <p>{education_background.course_taken}</p>
                          <p>
                            {education_background.level_of_education
                              .split('_')
                              .join(' ')}
                          </p>
                          <p>
                            {`${education_background?.city || ''}, ${
                              education_background?.country || ''
                            }`}
                          </p>
                          {/* Display start and end dates */}
                          <div className="flex flex-row text-xs pb-4">
                            <p className="">
                              {new Date(
                                education_background.start_date
                              ).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              to &nbsp;
                            </p>
                            {education_background.is_current === true ? (
                              <p>Present</p>
                            ) : (
                              <p>
                                {new Date(
                                  education_background.end_date
                                ).toLocaleDateString('en-us', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <hr />
                    </div>
                  )
                )}
            </div>
          </div>

          <Modal
            modalOpen={eduMOdal}
            title="Add Education Background"
            toggleModal={toggleEduModal}
          >
            <AddEducation toggleModal={toggleEduModal} />
          </Modal>
          <ProfileModal
            title="Edit Educational Background"
            modalOpen={editEducation}
            toggleModal={toggleEditEducation}
            modalClose={toggleEditEducation}
          >
            {isEducation ? (
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              <EditEducation
                toggleModal={toggleEditEducation}
                educationId={educationId}
                userId={userId}
                level={level}
                current={current}
                institution={institution}
                course={course}
                start={start}
                end={end}
                city={city}
                country={country}
              />
            )}
          </ProfileModal>
        </>
      )}
    </MainContent>
  );
}

export default EditEducationalBackground;
