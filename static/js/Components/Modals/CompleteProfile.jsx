import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router';
import CancelIcon from '@mui/icons-material/Cancel';

function CompleteProfile({ percentage, userId, handleSkip }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <CircularProgressbar
        className="w-[150px] h-[150px] font-extrabold"
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={10}
        styles={buildStyles({
          trailColor: `#C6A85C40`,
          pathColor: `${
            // eslint-disable-next-line no-nested-ternary
            percentage < 50
              ? '#FF0000'
              : percentage < 93
              ? '#C6A85C'
              : '#7CFC00'
          }`,
          textColor: 'black',
          backgroundColor: '#C6A85C',
          strokeLinecap: 'round',
          pathTransitionDuration: 1,
        })}
      />
      <p> Complete your profile.</p>
      <span className="text-sm font-light">
        (Note that your education background and work experience count in the
        percentage calculation)
      </span>
      <div className="flex justify-between w-full md:px-16">
        <button
          type="button"
          onClick={handleSkip}
          className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
        >
          <CancelIcon fontSize="inherit" />
          <p>Skip Now</p>
        </button>
        <button
          type="button"
          onClick={() => navigate(`/user/${userId}`)}
          className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center `}
        >
          Complete profile
        </button>
      </div>
    </div>
  );
}

export default CompleteProfile;
