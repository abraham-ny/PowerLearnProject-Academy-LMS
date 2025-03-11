/* eslint-disable no-unused-vars */
import React from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Spinner from './spinner/Spinner';
import useMutateData from '../hooks/useMutateData';

const schema = yup
  .object({
    current_password: yup.string().required('This is a required field'),
    new_password: yup
      .string()
      .required('This is a required field')
      .min(6, 'Password must be at least 6 characters')
      .max(15, 'Password must be less than 15 characters')
      .matches(
        /^.*(?=.{6,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Password must contain at least 6 characters, one uppercase and one number'
      ),
    confirmPassword: yup
      .string()
      .required('This is a required field')
      .oneOf([yup.ref('new_password'), null], 'Passwords must match'),
  })
  .required();

function ChangePassword({ toggleModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onPasswordChangeSuccess = () => {
    toggleModal();
  };

  const mutationOptions = {
    onSuccessfullMutation: onPasswordChangeSuccess,
    onError: () => {},
    successMessage: 'Password successfully changed!',
    errorMessage: 'Unable to change password! Please try again',
    queryKeysToInvalidate: ['user'],
  };

  const { mutate, isLoading } = useMutateData({
    url: '/users/change-my-password',
    method: 'PUT',
    ...mutationOptions,
  });

  const onSubmit = (data) => {
    const requestBody = {
      current_password: data?.current_password,
      new_password: data?.new_password,
    };
    mutate(requestBody);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col mb-5">
        <label
          htmlFor="current_password"
          className="text-xs text-mine-shaft-500 mb-1 pl-1"
        >
          Current Password
        </label>
        <input
          id="current_password"
          {...register('current_password', { required: true, maxLength: 15 })}
          className={`border border-silver-500 rounded-md py-2 pl-3 text-xs focus:outline-gray-600 ${
            errors.current_password
              ? 'border-red-600 focus:outline-red-600'
              : ''
          }`}
          type="password"
          placeholder="Current Password"
        />
        {errors.current_password && (
          <span className="text-red-600 text-xs mt-1">
            {errors.current_password?.message}
          </span>
        )}
      </div>
      <div className="flex flex-col mb-5">
        <label
          htmlFor="new_password"
          className="text-xs text-mine-shaft-500 mb-1 pl-1"
        >
          New Password
        </label>
        <input
          id="new_password"
          {...register('new_password', { required: true, maxLength: 15 })}
          className={`border border-silver-500 rounded-md py-2 pl-3 text-xs focus:outline-gray-600 ${
            errors.new_password ? 'border-red-600 focus:outline-red-600' : ''
          }`}
          type="password"
          placeholder="New Password"
        />
        {errors.new_password && (
          <span className="text-red-600 text-xs mt-1">
            {errors.new_password?.message}
          </span>
        )}
      </div>
      <div className="flex flex-col mb-5">
        <label
          htmlFor="confirmPassword"
          className="text-xs text-mine-shaft-500 mb-1 pl-1"
        >
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          {...register('confirmPassword', { required: true, maxLength: 15 })}
          className={`border border-silver-500 rounded-md py-2 pl-3 text-xs focus:outline-gray-600 ${
            errors.confirmPassword ? 'border-red-600 focus:outline-red-600' : ''
          }`}
          type="password"
          placeholder="Confirm New Password"
        />
        {errors.confirmPassword && (
          <span className="text-red-600 text-xs mt-1">
            {errors.confirmPassword?.message}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="grid place-items-center">
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
            <p>Change Password</p>
          </button>
        </div>
      )}
    </form>
  );
}

export default ChangePassword;
