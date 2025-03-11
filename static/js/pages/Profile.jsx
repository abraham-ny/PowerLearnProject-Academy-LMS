/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GroupIcon from '@mui/icons-material/Group';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavLink } from 'react-router-dom';
import { Avatar, Tooltip } from '@mui/material';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import { Edit, Save, Cancel } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import CancelIcon from '@mui/icons-material/Cancel';
import CopyIcon from '@mui/icons-material/CopyAll';
import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';
import MainContent from '../Components/MainContent';
import UpdateUserDetails from '../Components/UpdateUserDetails';
import Spinner from '../Components/spinner/Spinner';
import useFetchData from '../hooks/useFetchData';
import useMutateData from '../hooks/useMutateData';
import Modal from '../Components/Modal';
import AddWork from '../Components/AddWork';
import AddEducation from '../Components/AddEducation';
import EditEducation from '../Components/EditEducation';
import EditWork from '../Components/EditWork';
import logo from '../Assets/img/institution.png';
import AddProfilePic from '../Components/Modals/AddProfilePic';
import school from '../Assets/img/college.jpeg';

import 'react-circular-progressbar/dist/styles.css';
// import { useDispatch } from 'react-redux';
import { updateDetailsWithPercentage } from '../features/auth/authSlice';

function Profile() {
  const { userId } = useParams();
  const [oneUser, setOneUser] = useState({});
  const queryClient = useQueryClient();
  const [addWorkModalOpen, setAddWorkModalOpen] = useState(false);
  const [addEducationModalOpen, setAddEducationModalOpen] = useState(false);
  const [educationId, setEducationId] = useState('');
  const [workId, setWorkId] = useState('');
  const [deleteWorkModal, setDeleteWorkModal] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const toggleQr = () => {
    setQrOpen(!qrOpen);
  };

  const navigate = useNavigate();

  // const dispatch = useDispatch();

  const toggleDeleteWork = () => {
    setDeleteWorkModal(!deleteWorkModal);
  };

  const toggleAddWorkModal = () => {
    setAddWorkModalOpen(!addWorkModalOpen);
  };

  const toggleAddEducationModal = () => {
    setAddEducationModalOpen(!addEducationModalOpen);
  };

  // TODO: configure pagination with the table
  const fetchUserDetails = async () => {
    const data = await axiosInterceptor.get(`/users/student/${userId}`, {
      params: { $limit: 50, is_student: false },
    });
    return data;
  };

  // const percentage = '';

  const onFetchUserDetailsFailure = () => {
    // dispatch(updateDetailsWithPercentage(percentage));
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

  const percentage = data?.data?.student?.profile_completion;
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  // Add the new field 'percentage' to userDetails
  userDetails.percentage = percentage;

  // Store the updated userDetails object back into localStorage
  localStorage.setItem('userDetails', JSON.stringify(userDetails));
  const value = data?.data?.student?.profile_completion;

  const toggleProfileModal = () => {
    setProfileModalOpen(!profileModalOpen);
  };

  const onDeleteEducationSuccess = () => {};
  const onDeleteEducationFailure = () => {};

  const { mutate, isLoading: isDeletingEducation } = useMutateData({
    url: `/users/education-background/${educationId}`,
    method: 'DELETE',
    onSuccessfullMutation: () => onDeleteEducationSuccess(),
    onError: () => onDeleteEducationFailure(),
    successMessage: 'Successfully Deleted Education Background',
    errorMessage: 'Failed to delete Education background, please try again',
    queryKeysToInvalidate: ['user-details', userId],
  });

  const onDelete = async () => {
    mutate();
  };

  const onDeleteWorkSuccess = () => {
    toggleDeleteWork();
  };
  const onDeleteWorkFailure = () => {};

  const { mutate: deleteWork, isLoading: isDeletingWork } = useMutateData({
    url: `/users/work-experience/${workId}`,
    method: 'DELETE',
    onSuccessfullMutation: () => onDeleteWorkSuccess,
    onError: () => onDeleteWorkFailure(),
    successMessage: 'Successfully Deleted Work Expereince',
    errorMessage: 'Failed to delete work experience, please try again.',
    queryKeysToInvalidate: ['user-details', userId],
  });

  const onDeleteWork = async () => {
    deleteWork();
  };

  const did = data?.data?.student?.decentralized_id;

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
        </Breadcrumbs>
      </div>
      {isLoading ? (
        <div className="bg-white mt-4 flex justify-center items-center align-middle">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="bg-white px-4 py-5 mt-4 rounded-lg w-full flex space-y-4 md:space-y-0 flex-col md:flex-row justify-between align-middle items-start extraLarge:">
            <div className="flex flex-col md:flex-row gap-5 justify-center items-center md:items-start">
              <Tooltip
                title={<p className="capitalize text-sm">update picture</p>}
                className="text-lg"
              >
                <Avatar
                  sx={{ height: 150, width: 150 }}
                  src={data?.data?.student?.profile_image}
                  className="bg-center cursor-pointer"
                  onClick={toggleProfileModal}
                >
                  <p className="uppercase text-4xl">
                    {data?.data?.student?.firstname[0]}
                    {data?.data?.student?.lastname[0]}
                  </p>
                </Avatar>
              </Tooltip>
              <div className="space-y-2 px-2 w-full grid">
                <p className="text-xl capitalize font-semibold tracking-wide text-center md:text-start">
                  {data?.data?.student?.firstname}{' '}
                  {data?.data?.student?.lastname}
                </p>
                <p className="capitalize text-gray-600">
                  {data?.data?.student?.role}
                </p>
                <p className="text-gray-700">
                  {data?.data?.student?.profile_desc}
                </p>
                {data?.data?.student?.decentralized_id && (
                  <button
                    type="button"
                    onClick={toggleQr}
                    className="w-full bg-persian-500 text-white text-sm py-2 rounded-md cursor-pointer uppercase font-medium px-2"
                  >
                    View My DID
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white px-4 py-5 mt-4 rounded-md">
            <Typography variant="body1" color="text.secondary">
              {`${
                value < 100
                  ? `You have only completed ${value}% of your profile. Fill in the missing data`
                  : 'You have completed your profile!'
              }
              `}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: `100%`, mr: 1 }}>
                <LinearProgress variant="determinate" value={value} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >{`${Math.round(value)}%`}</Typography>
              </Box>
            </Box>
          </div>
          <UpdateUserDetails userDetails={data?.data?.student} />
          <div className="bg-white px-4 py-5 w-full mt-4 rounded-md">
            <div className=" flex align-middle justify-between">
              <p className="flex justify-center items-center py-6 text-2xl">
                Experience
              </p>
              <div className="space-x-4">
                <AddIcon
                  className="text-gray-600 font-bold cursor-pointer hover:bg-gray-300 rounded-full"
                  onClick={() => toggleAddWorkModal()}
                />
                <Edit
                  className="text-gray-600 font-bold cursor-pointer hover:bg-gray-300 rounded-full"
                  onClick={() => navigate('update-workExperience')}
                />
              </div>
            </div>
            <div className="space-y-4">
              {data?.data?.student?.work_experiences &&
                data?.data?.student?.work_experiences?.map((work) => (
                  <div key={work?.id}>
                    <div className="text-gray-500 text-sm flex flex-row w-full space-x-6">
                      <div>
                        <img src={logo} alt="" className="h-10" />
                      </div>
                      <div className="flex flex-col w-full">
                        <div className="">
                          <div className="flex justify-between items-center">
                            <p className="font-normal text-black text-lg">
                              {work?.position}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <p>{work?.organisation}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <p>
                            {' '}
                            {`${work?.city || ''}, ${work?.country || ''}`}
                          </p>
                        </div>
                        <div className="flex flex-row text-xs pb-4">
                          <p className="">
                            {new Date(work?.start_date).toLocaleDateString(
                              'en-us',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}{' '}
                            - &nbsp;
                          </p>
                          {work?.is_current === true ? (
                            <p>Present</p>
                          ) : (
                            <p>
                              {new Date(work?.end_date).toLocaleDateString(
                                'en-us',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white px-4 py-5 w-full mt-4 rounded-md">
            <div className="flex align-middle justify-between">
              <p className="flex justify-center items-center py-2 text-2xl">
                Education
              </p>
              <div className="space-x-4">
                <AddIcon
                  className="text-gray-600 font-bold"
                  onClick={() => toggleAddEducationModal()}
                />
                <Edit
                  className="text-gray-600 font-bold cursor-pointer hover:bg-gray-300 rounded-full"
                  onClick={() => navigate('update-educationalBackground')}
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
                              {education_background?.institution}
                            </p>
                          </div>
                          <p>{education_background?.course_taken}</p>
                          <p>
                            {education_background?.level_of_education
                              ?.split('_')
                              ?.join(' ')}
                          </p>
                          <p className="">
                            {`${education_background?.city || ''}, ${
                              education_background?.country || ''
                            }`}
                          </p>
                          <div className="flex flex-row text-xs pb-4">
                            <p className="">
                              {new Date(
                                education_background?.start_date
                              ).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              to &nbsp;
                            </p>
                            {education_background?.is_current === true ? (
                              <p>Present</p>
                            ) : (
                              <p>
                                {new Date(
                                  education_background?.end_date
                                )?.toLocaleDateString('en-us', {
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
            modalOpen={addWorkModalOpen}
            title="Add Work Experience"
            toggleModal={toggleAddWorkModal}
          >
            <AddWork toggleModal={toggleAddWorkModal} />
          </Modal>
          <Modal
            modalOpen={addEducationModalOpen}
            title="Add Education Background"
            toggleModal={toggleAddEducationModal}
          >
            <AddEducation toggleModal={toggleAddEducationModal} />
          </Modal>
          <Modal title="Add Profile Photo" modalOpen={profileModalOpen}>
            <AddProfilePic
              toggleModal={toggleProfileModal}
              userDetails={data?.data?.student}
            />
          </Modal>
          <Modal
            title={`${data?.data?.student?.firstname} ${data?.data?.student?.lastname}'s DID`}
            modalOpen={qrOpen}
          >
            <div className="flex flex-col space-y-4 justify-center items-center">
              <p className="md:text-xs text-sm font-roboto_light">
                A DID(Decentralized Identifier), enables verifiable,
                self-sovereign digital identity. Unlike traditional identifiers
                such as usernames or email addresses,{' '}
                <i className="font-semibold">
                  DIDs are not tied to any central authority, intermediary, or
                  centralized registry.
                </i>{' '}
                They are designed to be universal, persistent, and
                cryptographically verifiable.
              </p>
              {/* <div className="flex md:justify-between md:flex-row flex-col items-center space-x-4">
                <QRCode
                  value={did}
                  style={{ height: 'auto', maxWidth: '50%', width: '50%' }}
                />
                <p className="text-claret-500 text-lg px-4 font-roboto_light">
                  Scan to view your DID
                </p>
              </div> */}

              {/* <button
                type="button"
                onClick={toggleQr}
                className="bg-claret-500 text-white text-sm py-1 px-3 rounded-md cursor-pointer uppercase font-medium flex items-center align-middle space-x-3"
              >
                Close
              </button> */}
            </div>
            <div className=" mt-4 break-all max-w-full overflow-hidden">
              <p className="md:text-xs text-sm font-roboto_light">
                Your DID is: <strong>{did}</strong>
              </p>
            </div>
            <div className=" flex justify-between mt-8">
              <button
                className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
                type="button"
                // onClick={toggleModal}
                onClick={toggleQr}
              >
                <CancelIcon fontSize="inherit" />
                <p>Cancel</p>
              </button>
              <button
                className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center `}
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(did);
                  toast.success('DID successfully copied to clipboard');
                }}
              >
                <CopyIcon fontSize="inherit" />
                <p>Copy DID</p>
              </button>
            </div>
          </Modal>
        </>
      )}
    </MainContent>
  );
}

export default Profile;
