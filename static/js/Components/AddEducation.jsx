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

// get current date
const today = new Date();

// validation schema for adding education
const schema = yup
  .object({
    institution: yup.string().required('This is a required field'),
    course_taken: yup
      .string()
      .required('This is a required field')
      .max(1000, 'Title should be less than 1000 characters'),
    level_of_education: yup.string().required('This is a required field'),
    is_current: yup.bool().required('This is a required field'),
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
        .max(today, 'end date cannot be after today'),
      otherwise: yup.string().nullable().default(null),
    }),
    city: yup.string().required('This is a required field'),
    country: yup.string().required('This is a required field'),
  })
  .required();

function AddEducation({ toggleModal }) {
  // eslint-disable-next-line no-unused-vars
  const { userId } = useParams();
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const {
    field: { value: levelValue, onChange: levelOnChange, ...restLevelField },
  } = useController({ name: 'level_of_education', control });

  const {
    field: {
      value: countryValue,
      onChange: countryOnChange,
      ...restCountryField
    },
  } = useController({ name: 'country', control });

  const isCurrent = watch('is_current');

  // eslint-disable-next-line no-unused-vars
  const [current, setCurent] = useState(false);

  const [endDate, setEndDate] = useState(null);

  const handleEndDateChange = (e) => {
    // eslint-disable-next-line no-unused-expressions
    if (endDate === '') {
      setEndDate(null);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleChange = (event) => {
    setCurent(event.target.checked);
  };

  const levels = [
    { value: 'High School', label: 'High School' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'UnderGraduate', label: 'Undergraduate' },
    { value: 'PostGraduate', label: 'Postgraduate' },
  ];

  // work experience mutation
  const { mutate: addWork, isLoading: isPostingWork } = useMutateData({
    url: '/students/education-background',
    onSuccessfullMutation: toggleModal,
    onError: toggleModal,
    successMessage: 'Education background added successfully',
    errorMessage: "Couldn't add education background, try again later!",
    queryKeysToInvalidate: [['user-details', userId]],
  });

  const onSubmit = async (data) => {
    const requestBody = {
      ...data,
      end_date: endDate === '' ? null : data.end_date,
    };

    addWork(requestBody);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-gray-700 space-y-2"
      >
        <div className="space-y-6">
          <div className="flex flex-col space-y-1">
            <label>Institution</label>
            <input
              {...register('institution')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.institution ? 'border-red-600' : ''
              }`}
            />
            {errors.institution && (
              <span className="text-red-600 text-xs mt-2">
                {errors.institution?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Course Taken</label>
            <input
              {...register('course_taken')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.course_taken ? 'border-red-600' : ''
              }`}
            />
            {errors.course_taken && (
              <span className="text-red-600 text-xs mt-2">
                {errors.course_taken?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Level of Education</label>
            <Controller
              name="level_of_education"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  className="react-dropdown"
                  classNamePrefix="dropdown"
                  options={levels}
                  value={
                    levelValue
                      ? levels.find((x) => x.value === levelValue)
                      : levelValue
                  }
                  onChange={(option) =>
                    levelOnChange(option ? option.value : option)
                  }
                  {...restLevelField}
                />
              )}
            />
            {errors.level_of_education && (
              <span className="text-red-600 text-xs mt-2">
                {errors.level_of_education?.message}
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
          <div className="flex flex-row items-center space-x-4 justify-start">
            <input
              type="checkbox"
              onChange={handleChange}
              {...register('is_current')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.is_current ? 'border-red-600' : ''
              }`}
            />
            <label>Are you currently studying here?</label>
            {errors.is_current && (
              <span className="text-red-600 text-xs mt-2">
                {errors.is_current?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Start date</label>
            <input
              type="date"
              {...register('start_date', {
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
                  message: 'Please enter a valid date format',
                },
              })}
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
          {!isCurrent && (
            <div className="flex flex-col space-y-1">
              <label>End Date</label>
              <input
                type="date"
                {...register('end_date', {
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
                    message: 'Please enter a valid date format',
                  },
                })}
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
            {isPostingWork ? (
              <div className="flex justify-center items-center w-full">
                <Spinner />
              </div>
            ) : (
              <div className="flex justify-between w-full">
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
                  Add Education
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddEducation;
