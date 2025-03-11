/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm, Controller, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Select from 'react-select';
import Spinner from './spinner/Spinner';
import useMutateData from '../hooks/useMutateData';
import countryOptions from '../utils/constants/countryOptions';

// get the current date
const today = new Date();

// validation schema for add work
const schema = yup.object({
  organisation: yup.string().required('This is a required field'),
  position: yup.string().required('This is a required field'),
  is_current: yup.bool(),
  start_date: yup
    .date()
    .max(new Date(), 'Start date cannot be after today')
    .required('Start date is required'),
  end_date: yup.mixed().when(['is_current'], {
    is: false,
    then: yup
      .date()
      .required('Date is required')
      .typeError('End date must be a valid date')
      .min(yup.ref('start_date'), 'End date cannot be before start date')
      .max(today, 'End date cannot be after today'),
    otherwise: yup.string().nullable().default(null),
  }),
  city: yup.string().required('This is a required field'),
  country: yup.string().required('This is a required field'),
});

function AddWork({ toggleModal }) {
  const { userId } = useParams();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const {
    field: {
      value: countryValue,
      onChange: countryOnChange,
      ...restCountryField
    },
  } = useController({ name: 'country', control });

  const isCurrent = watch('is_current');

  const [current, setCurent] = useState(false);

  const [endDate, setEndDate] = useState(null);

  const handleEndDateChange = (e) => {
    // eslint-disable-next-line no-unused-expressions
    if (endDate === '') {
      setEndDate(null);
    } else {
      setEndDate(new Date(e.target.value));
    }
  };

  const handleChange = (event) => {
    setCurent(event.target.checked);
  };

  // work experience mutation
  const { mutate, isLoading: isAddingEducation } = useMutateData({
    url: '/students/work-experience',
    onSuccessfullMutation: toggleModal,
    onError: toggleModal,
    successMessage: 'Work experience added successfully',
    errorMessage: "Couldn't add work experience, try again later!",
    queryKeysToInvalidate: [['user-details', userId]],
  });

  const onSubmit = async (data) => {
    const requestBody = {
      ...data,
      end_date: endDate === '' ? null : endDate,
    };

    mutate(requestBody);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-gray-700 space-y-2"
      >
        <div className="space-y-6">
          <div className="flex flex-col space-y-1">
            <label>Organisation</label>
            <input
              {...register('organisation')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.organisation ? 'border-red-600' : ''
              }`}
            />
            {errors.organisation && (
              <span className="text-red-600 text-xs mt-2">
                {errors.organisation?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Position</label>
            <input
              {...register('position')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.position ? 'border-red-600' : ''
              }`}
            />
            {errors.position && (
              <span className="text-red-600 text-xs mt-2">
                {errors.position?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>City</label>
            <input
              {...register('city')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.city ? 'border-red-600' : ''
              }`}
            />
            {errors.city && (
              <span className="text-red-600 text-xs mt-2">
                {errors.city?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  className="react-dropdown"
                  classNamePrefix="dropdown"
                  options={countryOptions}
                  value={
                    countryValue
                      ? countryOptions.find((x) => x.value === countryValue)
                      : countryValue
                  }
                  onChange={(option) =>
                    countryOnChange(option ? option.value : option)
                  }
                  {...restCountryField}
                />
              )}
            />
            {errors.country && (
              <span className="text-red-600 text-xs mt-2">
                {errors.country?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Start Date</label>
            <input
              type="date"
              {...register('start_date')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.start_date ? 'border-red-600' : ''
              }`}
            />
            {errors.start_date && (
              <span className="text-red-600 text-xs mt-2">
                {errors.start_date?.message}
              </span>
            )}
          </div>
          <div className="flex flex-row space-x-4">
            <input
              type="checkbox"
              onChange={handleChange}
              {...register('is_current')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.is_current ? 'border-red-600' : ''
              }`}
            />
            <label>Are you currently working here?</label>
            {errors.is_current && (
              <span className="text-red-600 text-xs mt-2">
                {errors.is_current?.message}
              </span>
            )}
          </div>
          {!isCurrent && (
            <div className="flex flex-col space-y-1">
              <label>End Date</label>
              <input
                type="date"
                {...register('end_date')}
                defaultValue={endDate || ''}
                onChange={handleEndDateChange}
                className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                  errors.end_date ? 'border-red-600' : ''
                }`}
              />

              {errors.end_date && (
                <span className="text-red-600 text-xs mt-2">
                  {errors.end_date?.message}
                </span>
              )}
            </div>
          )}

          <div className=" flex justify-between mt-8">
            {isAddingEducation ? (
              <div className="flex justify-center items-center w-full">
                <Spinner />
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <button
                  type="button"
                  onClick={toggleModal}
                  className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
                >
                  {' '}
                  <CancelIcon fontSize="inherit" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center `}
                >
                  <SaveIcon fontSize="inherit" />
                  Add Work
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddWork;
