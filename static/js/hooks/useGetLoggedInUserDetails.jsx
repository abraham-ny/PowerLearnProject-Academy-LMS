import { useSelector } from 'react-redux';

const useGetLoggedInUser = () => {
  const loggedInUser = useSelector((state) => state?.auth?.userDetails);

  return loggedInUser;
};

export default useGetLoggedInUser;
