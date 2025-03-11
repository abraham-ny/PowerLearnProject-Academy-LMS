import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';

const useMutateData = ({
  url,
  method = 'POST',
  onSuccessfullMutation,
  // onError,
  successMessage,
  errorMessage,
  queryKeysToInvalidate = [],
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => {
      if (method === 'POST') {
        return axiosInterceptor.post(url, data);
      }
      if (method === 'PUT') {
        return axiosInterceptor.put(url, data);
      }
      if (method === 'DELETE') {
        return axiosInterceptor.delete(url, data);
      }
      throw new Error(`Invalid HTTP method: ${method}`);
    },
    {
      onSuccess: ({ data, variables }) => {
        onSuccessfullMutation(data, variables);
        toast.success(successMessage);
        queryKeysToInvalidate.forEach((key) =>
          queryClient.invalidateQueries(key)
        );
      },
      onError: (error) => {
        if (error?.response?.status === 409) {
          toast.error(error?.response?.data?.error);
        } else {
          toast.error(errorMessage);
        }
      },
    }
  );

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isLoading,
  };
};

export default useMutateData;
