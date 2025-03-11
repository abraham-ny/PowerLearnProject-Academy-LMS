import React from 'react';
import { useNavigate } from 'react-router';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

function LandingPageScholarshipCourse({ course }) {
  const navigate = useNavigate();
  return (
    <div className="border-[.2px] border-[#C8C8C8] w-56  mx-auto h-[330px] max-h-[330px] rounded-xl overflow-hidden flex flex-col justify-between  relative">
      <img
        src={course.courseImage}
        alt={course.courseName}
        className=" h-60 bg-cover bg-no-repeat bg-center object-cover border-b-[.2px] border-[#C8C8C8]"
      />
      <div className="p-4 flex-1 flex justify-between flex-col">
        <div className="">
          <p className="text-sm font-semibold uppercase text-claret-500/90">
            PLP Scholarship
          </p>
        </div>
        <p className="capitalize font-medium">{course.courseName}</p>
        <a
          href="https://powerlearnprojectafrica.org/applications"
          target="_blank"
          rel="noreferrer"
        >
          <button
            className="text-white text-sm bg-claret-500 px-6 py-2 rounded-3xl flex items-center gap-2 mx-auto bottom w-full align-middle justify-center"
            type="button"
          >
            Apply Now
            <SchoolOutlinedIcon sx={{ fontSize: 18 }} className="" />
          </button>
        </a>
        <button
          className="text-white text-sm bg-persian-500 px-6 py-2 rounded-3xl flex items-center gap-2 mx-auto mt-2 bottom w-full align-middle justify-center"
          type="button"
          onClick={() => navigate(`/scholarship-courses`)}
        >
          View Modules
          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} className="" />
        </button>
      </div>
      {course.percentage_discount && (
        <div className="text-xs h-6 w-fit p-1 bg-teal-600 rounded-tl-xl rounded-br-xl absolute top-0 left-0 text-white font-medium">
          -{course.percentage_discount}%
        </div>
      )}
    </div>
  );
}

export default LandingPageScholarshipCourse;
