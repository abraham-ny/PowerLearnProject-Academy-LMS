import React from 'react';
import { useNavigate } from 'react-router';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

function LandingPagePaidModule({ module, scholarship }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/module/${module.id}`);
  };

  return (
    <div className="border-[.1px] border-[#C8C8C8] w-56 mx-auto h-[330px] max-h-[330px] rounded-xl overflow-hidden flex flex-col justify-between relative">
      <div className="h-60 w-full overflow-hidden border-b-[.1px] border-[#C8C8C8]">
        <img
          src={module.moduleImage}
          alt={module.moduleName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex justify-between flex-col">
        {module.category && (
          <div className="">
            <p className="text-sm font-light text-gray-500/90">
              {module.category}
            </p>
          </div>
        )}
        {scholarship && !module.category && (
          <div className="">
            <p className="text-sm font-semibold uppercase text-claret-500/90">
              PLP Scholarship
            </p>
          </div>
        )}
        <p className="capitalize font-medium line-clamp-1">
          {module.moduleName}
        </p>
        {!scholarship && module.usd_principal_price ? (
          <div className="flex space-x-2 align-middle items-center">
            <p className="capitalize font-medium text-sm text-claret-500 my-1">
              {module.local_currency || 'USD'}{' '}
              {Math.ceil(Number(module.localised_price_after_discount)) ||
                Math.ceil(Number(module.usd_price_after_discount))}
            </p>
            {module.percentage_discount && (
              <p
                className={`capitalize font-light text-xs text-gray-500 my-2 ${
                  module.percentage_discount ? 'line-through' : ''
                }`}
              >
                {module.local_currency || 'USD'}{' '}
                {Math.ceil(Number(module.localised_principal_price)) ||
                  Math.ceil(Number(module.usd_principal_price))}
              </p>
            )}
          </div>
        ) : (
          <p className={`capitalize font-light text-sm text-claret-500 my-2 `}>
            Sponsored
          </p>
        )}
        {module.is_published}
        <button
          className={`${
            scholarship || module.is_published
              ? 'text-white bg-claret-500 cursor-pointer'
              : 'text-black bg-gray-400 cursor-not-allowed'
          }  text-sm  px-6 py-2 rounded-3xl flex items-center gap-2 mx-auto bottom w-full align-middle justify-center capitalize`}
          type="button"
          disabled={!module?.is_published}
          onClick={handleClick}
        >
          {scholarship || module.is_published ? (
            <>
              Enrol Now {module.is_published}
              <SchoolOutlinedIcon sx={{ fontSize: 18 }} className="" />
            </>
          ) : (
            <>
              coming soon
              <TimerOutlinedIcon sx={{ fontSize: 18 }} className="" />
            </>
          )}
        </button>
      </div>
      {module.percentage_discount && (
        <div className="text-xs h-6 w-fit p-1 bg-teal-600 rounded-tl-xl rounded-br-xl absolute top-0 left-0 text-white font-medium">
          -{module.percentage_discount}%
        </div>
      )}
    </div>
  );
}

export default LandingPagePaidModule;
