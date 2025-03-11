import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { communityInterceptor } from '../utils/Axios/communityInterceptor';

const useFetchCommunityData = (
  queryKey,
  url,
  config,
  errorMessage,
  dependecy,
  noCache
) => {
  const queryFunction = async () => {
    const response = await communityInterceptor.get(url, config);
    return response;
  };

  const { data, isLoading, error } = useQuery(queryKey, queryFunction, {
    staleTime: noCache ? '' : 3600 * 1000,
    cacheTime: noCache ? '' : 3600 * 1000,
    enabled: !!dependecy,
    onError: () => {
      toast.error(errorMessage);
    },
  });

  return { data, isLoading, error };
};

export default useFetchCommunityData;
