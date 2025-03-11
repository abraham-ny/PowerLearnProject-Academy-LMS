import React from 'react';
import { useForm } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import Spinner from '../spinner/Spinner';
import { fileToBase64 } from '../../utils/helpers/convertToBase64';
import useMutateData from '../../hooks/useMutateData';
import { updateDetails } from '../../features/auth/authSlice';

const schema = yup
  .object({
    profile_image: yup
      .mixed()
      .required('Please select an image')
      .test('fileSize', 'Please upload image less than 2MB', (value) => {
        return value && value[0]?.size <= 2000000;
      }),
  })
  .required();

function AddProfilePic({ toggleModal, userDetails }) {
  const { userId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const dispatch = useDispatch();

  const onProfileUpdateSuccess = () => {
    toggleModal();
  };

  const { mutate, isLoading } = useMutateData({
    url: `/users/student/me`,
    method: 'PUT',
    onSuccessfullMutation: (data) => {
      const update = data?.student;
      dispatch(updateDetails(update));
      onProfileUpdateSuccess();
    },
    successMessage: `Successfully updated ${userDetails?.firstname} ${userDetails?.lastname}'s profile picture!`,
    errorMessage: 'Profile update failed! Please try again',
    queryKeysToInvalidate: ['user-details', userId],
  });

  const onSubmit = async (data) => {
    const base64Url = await fileToBase64(data.profile_image[0]);
    const requestData = { ...data, profile_image: base64Url };
    mutate(requestData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="flex flex-col space-y-1 mb-7">
        <label htmlFor="profile_image" className="text-base">
          Profile Image
        </label>
        <input
          {...register('profile_image', {
            required: true,
          })}
          accept="image/jpg, image/jpeg"
          type="file"
          id="profile_image"
          className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
            errors.profile_image ? 'border-red-600' : ''
          }`}
        />
        {errors.profile_image && (
          <span className="text-red-600 text-xs mt-2">
            {errors.profile_image?.message}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center align-middle items-center">
          <Spinner />
        </div>
      ) : (
        <div className=" flex justify-between mt-8">
          <button
            className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
            type="button"
            onClick={toggleModal}
          >
            <CancelIcon fontSize="inherit" />
            <p>Cancel</p>
          </button>
          <button
            className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center `}
            type="submit"
          >
            <SaveIcon fontSize="inherit" />
            <p>Update Picture</p>
          </button>
        </div>
      )}
    </form>
  );
}

export default AddProfilePic;
