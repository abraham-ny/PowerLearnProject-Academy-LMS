import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GroupIcon from '@mui/icons-material/Group';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import { Edit } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';
import MainContent from '../Components/MainContent';
import Spinner from '../Components/spinner/Spinner';
// import useMutateData from '../hooks/useMutateData';
import Modal from '../Components/Modal';
import AddWork from '../Components/AddWork';
import EditWork from '../Components/EditWork';
import logo from '../Assets/img/institution.png';
import ProfileModal from '../Components/ProfileModal';
import { updateDetailsWithPercentage } from '../features/auth/authSlice';
// import useFetchData from '../hooks/useFetchData';

function EditWorkExperience() {
  const { userId } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [oneUser, setOneUser] = useState({});
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [workId, setWorkId] = useState('');
  const [editWork, setEditWork] = useState(false);
  const [deleteWorkModal, setDeleteWorkModal] = useState(false);

  const navigate = useNavigate();

  const toggleDeleteWork = () => {
    setDeleteWorkModal(!deleteWorkModal);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditWork = () => {
    setEditWork(!editWork);
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
            ?.data?.data?.find((user) => user.id === userId)
        );
      },
      enabled: !!userId,
      staleTime: 3600 * 10000,
      cacheTime: 3600 * 10000,
    }
  );

  const dispatch = useDispatch();

  const baseURL =
    process.env.REACT_APP_BASE_URL ||
    'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

  const onDeleteWorkSuccess = async () => {
    setWorkId('');
    const updatedPercentage = await axiosInterceptor.get(
      `${baseURL}/users/student/${userId}`
    );

    const percentage = updatedPercentage?.data?.student?.profile_completion;
    dispatch(updateDetailsWithPercentage(percentage));

    toggleDeleteWork();
  };

  const onDeleteWorkFailure = () => {
    // Handle the failure scenario
  };

  // const queryClient = useQueryClient

  // const queryClient = useQueryClient();
  const deleteWorkMutation = useMutation(
    () => axiosInterceptor.delete(`/students/work-experience/${workId}`),
    {
      onSuccess: onDeleteWorkSuccess,
      onError: onDeleteWorkFailure,
      onSettled: () => {
        queryClient.invalidateQueries(['user-details', userId]);
      },
    }
  );

  const onDeleteWork = () => {
    deleteWorkMutation.mutate();
  };

  const isDeletingWork = deleteWorkMutation.isLoading;

  // get work by id
  const fetchWorkExperience = async () => {
    // Make the API request using the workId if it's not empty
    // eslint-disable-next-line no-use-before-define
    if (workId !== '' && !workData && !isDeletingWork) {
      try {
        const response = await axiosInterceptor.get(
          `/students/work-experience/${workId}`
        );
        return response.data;
      } catch (error) {
        toast.error('Could not get user work experience');
      }
    }
    return null;
  };

  const { data: workData, isLoading: isWorkLoading } = useQuery(
    ['work-experience', workId],
    fetchWorkExperience,
    {
      enabled: workId !== '',
    }
  );

  const organisation = workData?.student_work_experience?.organisation;
  const position = workData?.student_work_experience?.position;
  const current = workData?.student_work_experience?.is_current;
  const start = workData?.student_work_experience?.start_date;
  const end = workData?.student_work_experience?.end_date || null;
  const city = workData?.student_work_experience?.city || null;
  const country = workData?.student_work_experience?.country || null;

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
            <div className=" flex align-middle mt-4 justify-between">
              <p className="flex justify-center items-center py-6 text-2xl">
                Experience
              </p>
              <div className="space-x-4">
                <AddIcon
                  className="text-gray-600 font-bold cursor-pointer hover:bg-gray-300 rounded-full"
                  onClick={() => toggleModal()}
                />
              </div>
            </div>
            <div className="space-y-4">
              {data?.data?.student?.work_experiences &&
                data?.data?.student?.work_experiences?.map((work) => (
                  <div key={work.id}>
                    <div className="text-gray-500 text-sm flex flex-row w-full space-x-6">
                      <div>
                        <img src={logo} alt="" className="h-10" />
                      </div>
                      <div className="flex flex-col w-full">
                        <div className="">
                          <div className="flex justify-between items-center">
                            <p className="font-normal text-black text-lg">
                              {work.position}
                            </p>
                            <div className="flex flex-row justify-end items-center space-x-4">
                              <div
                                onClick={() => {
                                  setWorkId(work.id);
                                  toggleEditWork();
                                }}
                              >
                                <Edit className="hover:bg-gray-300 rounded-full cursor-pointer" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <p>{work.organisation}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <p className="">
                            {`${work?.city || ''}, ${work?.country || ''}`}
                          </p>
                        </div>
                        <div className="flex flex-row text-xs pb-4">
                          <p className="">
                            {new Date(work.start_date).toLocaleDateString(
                              'en-us',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}{' '}
                            - &nbsp;
                          </p>
                          {work.is_current === true ? (
                            <p>Present</p>
                          ) : (
                            <p>
                              {new Date(work.end_date).toLocaleDateString(
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

          <Modal
            modalOpen={modalOpen}
            title="Add Work Experience"
            toggleModal={toggleModal}
          >
            <AddWork toggleModal={toggleModal} />
          </Modal>

          <ProfileModal
            title="Edit Work Experience"
            modalOpen={editWork}
            toggleModal={toggleEditWork}
            modalClose={toggleEditWork}
          >
            {isWorkLoading ? (
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              <EditWork
                toggleModal={toggleEditWork}
                workId={workId}
                userId={userId}
                organisation={organisation}
                position={position}
                start={start}
                end={end}
                curr={current}
                isDeletingWork={isDeletingWork}
                deleteWork={onDeleteWork}
                city={city}
                country={country}
              />
            )}
          </ProfileModal>

          {/* <Modal
            title="Delete Work Entry"
            modalOpen={deleteWorkModal}
            toggleModal={toggleDeleteWork}
          >
            <p>Are you sure you want to delete Work Experience?</p>
            {isDeletingWork ? (
              <Spinner />
            ) : (
              <div className=" flex justify-between mt-8">
                <button
                  className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
                  type="button"
                  onClick={toggleDeleteWork}
                >
                  <Cancel fontSize="inherit" />
                  <p>Cancel</p>
                </button>
                <button
                  className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center `}
                  type="button"
                  onClick={() => {
                    onDeleteWork();
                    toggleDeleteWork();
                    toggleEditWork();
                  }}
                >
                  <Save fontSize="inherit" />
                  <p>Delete Work</p>
                </button>
              </div>
            )}
          </Modal> */}
        </>
      )}
    </MainContent>
  );
}

export default EditWorkExperience;
