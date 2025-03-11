import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoIcon from '@mui/icons-material/Info';
import './Calendar.css';
import useFetchData from '../../hooks/useFetchData';
import months from '../../utils/constants/months';
import weekDays from '../../utils/constants/weekDays';

function Calendar() {
  const [startDate, setStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [eventsInDay, setEventsInDay] = useState([]);

  const { data } = useFetchData(
    ['events'],
    '/events',
    {},
    "Couldn't get Event. Please try again!",
    true
  );

  const extractDayFromTimestamp = (eventDate) => {
    return new Date(eventDate).toLocaleDateString();
  };

  useEffect(() => {
    const getDay = new Date(startDate).toLocaleDateString();

    const events = data?.data?.events;

    if (events) {
      const eventsInADay = events.filter((event) => {
        return extractDayFromTimestamp(event.eventStartDate) === getDay;
      });
      return setEventsInDay(eventsInADay);
    }
    return setEventsInDay([]);
  }, [data?.data?.events, startDate]);

  const toggleCalendar = () => setShowCalendar(!showCalendar);
  const toggleEvents = () => setShowEvents(!showEvents);

  return (
    <div className=" h-screen bg-white flex-2 flex flex-col  rounded-md p-3 static no-scrollbar overflow-auto items-center pb-60">
      <div
        className="flex justify-between w-full cursor-pointer"
        onClick={toggleCalendar}
      >
        <div className="flex space-x-2 mb-3">
          <InsertInvitationIcon />
          <p className="font-semibold">Events</p>
        </div>
        {showCalendar ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </div>
      <div className={`${showCalendar ? '' : 'hidden'}`}>
        <ReactDatePicker
          inline
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          wrapperClassName="datePickerWrapper"
        />
      </div>
      <div className="mt-3 cursor-pointer w-full">
        <div
          className="flex justify-between items-center w-full"
          onClick={toggleEvents}
        >
          <div className="flex flex-col justify-center">
            <div className="font-semibold">
              {`${months[new Date(startDate).getMonth()].slice(0, 3)}`}{' '}
              {`${new Date(startDate).getDate()}`}
            </div>
            <div className="text-xs">
              {`${weekDays[new Date(startDate).getDay()]} `}
            </div>
          </div>
          {/* <div className="flex space-x-2 mb-3 ">
              <EventAvailableIcon />
              <p className="font-semibold">Events</p>
            </div> */}
          {showEvents ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
        <div className={`${showEvents ? '' : 'hidden'} space-y-5 `}>
          {/* <p className="tracking-wide font-medium mb-1">{`${
            weekDays[new Date(startDate).getDay()]
          } ${new Date(startDate).getDate()}`}</p> */}
          {/* event */}
          {eventsInDay.length > 0 ? (
            eventsInDay.map((event) => {
              return (
                <div key={event.id}>
                  <div className=" border-l-2 border-[#8b173b] pl-3 space-y-1">
                    <p className="text-sm tracking-wide font-semibold text-[#8b173b]">
                      {event.eventName}
                    </p>
                    <p className="text-sm tracking-wide font-semibold ">
                      {event.eventDescription}
                    </p>
                    <p>{new Date(event.eventStartDate).toDateString()}</p>
                    <p>
                      <small>
                        {new Date(event.eventStartDate).toLocaleTimeString()} -{' '}
                        {event.eventEndDate &&
                          new Date(
                            event.eventEndDate
                          ).toLocaleTimeString()}{' '}
                        EAT{' '}
                      </small>
                    </p>
                    <div className=" flex text-xs align-middle items-center ">
                      {/* <LocationOnIcon fontSize="inherit" className="h-5 w-5" /> */}
                      <a
                        className="text-blue-700"
                        target="_blank"
                        href={event.eventVenue}
                        rel="noreferrer"
                      >
                        Join Meeting Here
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center gap-x-1 py-10 text-sm">
              <InfoIcon className="text-orange-300" />
              No events on this date
            </div>
          )}
          {/* event */}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
