import React, { useState } from 'react';
import { useForm, Controller, useController } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import Modal from './Modal';
import useGetLoggedInUserId from '../hooks/useGetLoggedInUserId';
import Spinner from './spinner/Spinner';
import ChangePassword from './ChangePassword';
import useMutateData from '../hooks/useMutateData';
// import useFetchData from '../hooks/useFetchData';
import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';
import { updateDetailsWithPercentage } from '../features/auth/authSlice';
// import { updateDetails } from '../features/auth/authSlice';

const schema = yup.object({
  firstname: yup.string(),
  lastname: yup.string(),
  email: yup.string(),
  age: yup.string().nullable(),
  country: yup.string(),
  town: yup.string().nullable(),
  modules_specialised: yup.string().nullable(),
  interests: yup.string().nullable(),
  phone_number: yup.string().nullable(),
  gender: yup.string(),
  github_account: yup.string().url('please enter a valid url'),
  linkedin: yup.string().url('please enter a valid url').nullable(),
  project_link: yup.string().url('please enter a valid url').nullable(),
  level_of_education: yup.string().nullable(),
});

function UpdateUserDetails({ userDetails }) {
  const { userId } = useParams();
  const loggedInUserId = useGetLoggedInUserId();
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  const toggleChangePasswordModal = () => {
    setChangePasswordModalOpen(!changePasswordModalOpen);
  };

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: userDetails?.firstname,
      lastname: userDetails?.lastname,
      email: userDetails?.email,
      github_account: userDetails?.github_account,
      profile_desc: userDetails?.profile_desc,
      country: userDetails?.country,
      town: userDetails?.town,
      interests: userDetails?.interests,
      linkedin: userDetails?.linkedin,
      project_link: userDetails?.project_link,
      level_of_education: userDetails?.level_of_education,
      phone_number: userDetails?.phone_number,
      gender: userDetails?.gender,
      age: userDetails?.age,
    },
  });

  const dispatch = useDispatch();

  // const {
  //   field: { value: levelValue, onChange: levelOnChange, ...restLevelField },
  // } = useController({ name: 'modules_specialised', control });

  const {
    field: { value: ageValue, onChange: ageOnChange, ...restageField },
  } = useController({ name: 'age', control });

  const baseURL =
    process.env.REACT_APP_BASE_URL ||
    'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

  const onProfileUpdateSuccess = async () => {
    const updatedPercentage = await axiosInterceptor.get(
      `${baseURL}/users/student/${userId}`
    );

    const percentage = updatedPercentage?.data?.student?.profile_completion;

    dispatch(updateDetailsWithPercentage(percentage));
  };

  const mutationUrl = `/users/student/me`;

  const { mutate: updateProfile, isLoading } = useMutateData({
    url: mutationUrl,
    method: 'PUT',
    onSuccessfullMutation: onProfileUpdateSuccess,

    successMessage: `Successfully updated ${userDetails?.firstname} ${userDetails?.lastname}'s details!`,
    errorMessage: 'Profile update failed! Please try again',
    queryKeysToInvalidate: ['user-details', userId],
  });

  const canUpdate = () => {
    if (loggedInUserId === userId) {
      return true;
    }
    return false;
  };

  const onSubmit = async (requestData) => {
    const requestBody = {
      ...requestData,
    };
    updateProfile(requestBody);
  };

  const ageOptions = [
    { value: '18-25', label: '18-25' },
    { value: '25-30', label: '25-30' },
    { value: '30-35', label: '30-35' },
    { value: '35-40', label: '35-40' },
    { value: '40-50', label: '40-50' },
    { value: '50+', label: '50+' },
  ];

  const highestLevelOfEducationOptions = [
    { value: 'HighSchool', label: 'High School' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'UnderGraduate', label: 'Under Graduate' },
    { value: 'PostGraduate', label: 'Post Graduate' },
  ];

  return (
    <>
      <form
        className="bg-white px-4 py-5 mt-4 rounded-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h4 className="mb-2 font-medium">Basic Information</h4>
        <div className=" xl:grid grid-cols-3 gap-4 extraLarge:space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="firstname" className="text-base">
              First Name
            </label>
            <input
              {...register('firstname', { required: true })}
              readOnly
              type="text"
              id="firstname"
              name="firstname"
              placeholder="First Name"
              className={`border-[#CBCBCB] bg-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.firstname ? 'border-red-600' : ''
              }`}
            />
            {errors.firstname && (
              <span className="text-red-600 text-xs mt-2">
                {errors.firstname?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="lastname" className="text-base">
              Last Name
            </label>
            <input
              {...register('lastname', { required: true })}
              readOnly
              type="text"
              id="lastname"
              placeholder="Last Name"
              className={`border-[#CBCBCB] bg-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.lastname ? 'border-red-600' : ''
              }`}
            />
            {errors.lastname && (
              <span className="text-red-600 text-xs mt-2">
                {errors.lastname?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="Email" className="text-base">
              Email
            </label>
            <input
              readOnly
              {...register('email', { required: true })}
              type="email"
              id="Email"
              placeholder="Email Address"
              className={`border-[#CBCBCB] bg-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.lastname ? 'border-red-600' : ''
              }`}
            />
            {errors.Email && (
              <span className="text-red-600 text-xs mt-2">
                {errors.Email?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="country" className="text-base">
              Country
            </label>
            <input
              readOnly
              {...register('country', { required: true })}
              type="text"
              id="country"
              placeholder="Country of Origin"
              className={`border-[#CBCBCB] bg-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.country ? 'border-red-600' : ''
              }`}
            />
            {errors.country && (
              <span className="text-red-600 text-xs mt-2">
                {errors.country?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="town" className="text-base">
              Town
            </label>
            <input
              readOnly={!canUpdate()}
              {...register('town', { required: true })}
              type="text"
              id="town"
              placeholder="Nearest Town"
              className={`border-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.town ? 'border-red-600' : ''
              }`}
            />
            {errors.town && (
              <span className="text-red-600 text-xs mt-2">
                {errors.town?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="age" className="text-base">
              Age
            </label>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={ageOptions}
                  className="react-dropdown"
                  classNamePrefix="dropdown"
                  isClearable
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : null;
                    field.onChange(value);
                  }}
                  value={ageOptions.find(
                    (option) => option.value === watch('age')
                  )}
                  {...restageField}
                />
              )}
            />

            {errors?.age && (
              <span className="text-red-600 text-xs mt-2">
                {errors.age?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="age" className="text-base">
              Highest Level of Education Achieved
            </label>
            <Controller
              name="level_of_education"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={highestLevelOfEducationOptions}
                  className="react-dropdown"
                  classNamePrefix="dropdown"
                  isClearable
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : null;
                    field.onChange(value);
                  }}
                  value={highestLevelOfEducationOptions.find(
                    (option) => option.value === watch('level_of_education')
                  )}
                  {...restageField}
                />
              )}
            />

            {errors?.age && (
              <span className="text-red-600 text-xs mt-2">
                {errors.age?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="interests" className="text-base">
              Interests
            </label>
            <input
              readOnly={!canUpdate()}
              {...register('interests', { required: true })}
              type="text"
              id="interests"
              placeholder="Interests"
              className={`border-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.interests ? 'border-red-600' : ''
              }`}
            />
            {errors.interests && (
              <span className="text-red-600 text-xs mt-2">
                {errors.interests?.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="phone_ number" className="text-base">
              Phone Number
            </label>
            <input
              readOnly={!canUpdate()}
              {...register('phone_number', { required: true })}
              type="text"
              id="phone_number"
              placeholder="Phone Number"
              className={`border-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.phone_number ? 'border-red-600' : ''
              }`}
            />
            {errors.phone_number && (
              <span className="text-red-600 text-xs mt-2">
                {errors.phone_number?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="github_account" className="text-base">
              Github Account
            </label>
            <input
              readOnly={!canUpdate()}
              {...register('github_account', { required: true })}
              type="text"
              id="github_account"
              placeholder="Github Account"
              className={`border-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.github_account ? 'border-red-600' : ''
              }`}
            />
            {errors.github_account && (
              <span className="text-red-600 text-xs mt-2">
                {errors.github_account?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="linkedin" className="text-base">
              LinkedIn
            </label>
            <input
              readOnly={!canUpdate()}
              {...register('linkedin', { required: true })}
              type="text"
              id="linkedin"
              placeholder="LinkedIn Account"
              className={`border-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.linkedin ? 'border-red-600' : ''
              }`}
            />
            {errors.linkedin && (
              <span className="text-red-600 text-xs mt-2">
                {errors.linkedin?.message}
              </span>
            )}
          </div>
          {!userDetails?.cohort?.is_system_generated && (
            <div className="flex flex-col space-y-1">
              <label htmlFor="project_link" className="text-base">
                Final Project Link
              </label>
              <input
                readOnly={!canUpdate()}
                {...register('project_link', { required: true })}
                type="text"
                id="project_link"
                placeholder="Final Project link"
                className={`border-[#CBCBCB] ${
                  canUpdate() ? '' : 'bg-[#CBCBCB]'
                } border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                  errors.project_link ? 'border-red-600' : ''
                }`}
              />
              {errors.project_link && (
                <span className="text-red-600 text-xs mt-2">
                  {errors.project_link?.message}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col col-span-3 space-y-1">
            <label htmlFor="profile_desc" className="text-base">
              About
            </label>
            <textarea
              rows={5}
              readOnly={!canUpdate()}
              {...register('profile_desc', { required: true })}
              type="profile_desc"
              id="profile_desc"
              placeholder="Enter Bio"
              className={`border-[#CBCBCB] ${
                canUpdate() ? '' : 'bg-[#CBCBCB]'
              } h-fit border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.profile_desc ? 'border-red-600' : ''
              }`}
            />
            {errors.profile_desc && (
              <span className="text-red-600 text-xs mt-2">
                {errors.profile_desc?.message}
              </span>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center align-middle items-center">
            <Spinner />
          </div>
        ) : (
          canUpdate() && (
            <div className="mt-4 flex gap-4 flex-col sm:flex-row justify-between">
              <button
                type="button"
                className="bg-claret-500 text-white text-sm py-1 px-4 rounded-md cursor-pointer uppercase font-semibold flex items-center justify-center space-x-3"
                onClick={toggleChangePasswordModal}
              >
                <p>Change Password</p>
                <LockIcon fontSize="inherit" />
              </button>
              <button
                type="submit"
                className="bg-claret-500 text-white text-sm py-1 px-4 rounded-md cursor-pointer uppercase font-semibold flex items-center justify-center space-x-3"
              >
                <p>Update Profile</p>
                <SaveIcon fontSize="inherit" />
              </button>
            </div>
          )
        )}
      </form>
      <Modal
        modalOpen={changePasswordModalOpen}
        toggleModal={toggleChangePasswordModal}
        title="Change Password"
      >
        <ChangePassword toggleModal={toggleChangePasswordModal} />
      </Modal>
    </>
  );
}

export default UpdateUserDetails;
