import React, { useState, useEffect } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Spinner from './spinner/Spinner';
import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';

const schema = yup
  .object({
    submission_url: yup.string().url('Please enter a valid url').required(),
  })
  .required();

function EditStudentAssignmentSubmission({
  submissionData,
  studentId,
  toggleModal,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setValue('submission_url', submissionData?.submission_url);
  }, [setValue, submissionData?.submission_url]);

  const queryClient = useQueryClient();

  const onSubmissionUpdateSuccess = () => {
    toast.success('Assignment submission successfully updated!');
    toggleModal();
    setIsSubmitting(false);
  };

  const onSubmissionUpdateFailure = () => {
    toast.error('Assignment submission update failed! Please try again');
    setIsSubmitting(false);
  };

  const mutation = useMutation(
    (data) =>
      axiosInterceptor.put(
        `/student-assignment-submission/${submissionData?.id}`,
        data
      ),
    {
      onSuccess: () => {
        onSubmissionUpdateSuccess();
        queryClient.invalidateQueries([
          'student-assignment-submission',
          studentId,
        ]);
      },
      onError: onSubmissionUpdateFailure,
    }
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const requestData = {
      ...data,
    };
    mutation.mutate(requestData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex flex-col space-y-1">
          <label htmlFor="submission_url" className="text-base">
            Submission URL
          </label>
          <input
            {...register('submission_url', {
              required: true,
            })}
            required
            type="url"
            id="submission_url"
            className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
              errors.submission_url ? 'border-red-600' : ''
            }`}
          />
          {errors.submission_url && (
            <span className="text-red-600 text-xs mt-2">
              {errors.submission_url?.message}
            </span>
          )}
        </div>
        <div>
          {isSubmitting ? (
            <div>
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-row justify-between">
              <button
                type="button"
                className="bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center"
                onClick={toggleModal}
              >
                <CancelIcon fontSize="inherit" />
                Cancel
              </button>
              <button
                className="bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center"
                type="submit"
              >
                <SaveIcon fontSize="inherit" />
                <p>Update</p>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditStudentAssignmentSubmission;
