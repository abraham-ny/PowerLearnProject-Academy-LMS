import { useSelector } from 'react-redux';

const useGetLoggedInUserId = () => {
  const loggedInUserId = useSelector((state) => state.auth.userDetails.id);

  return loggedInUserId;
};

export default useGetLoggedInUserId;
