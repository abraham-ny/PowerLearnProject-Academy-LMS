import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const items = [
  {
    id: 1,
    heading: 'Training Duration',
    text: '16 weeks of self-paced, online training in a variety of programming languages.',
  },
  {
    id: 2,
    heading: 'Program Features',
    text: 'Fully-funded, virtual, and self-paced training covering technical modules, entrepreneurship, and personal development.',
  },
  {
    id: 3,
    heading: 'Flexibility',
    text: "Learning delivered entirely online, anytime, anywhere, and at the learner's pace.",
  },
];

function AuthCarousel() {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    if (index < 1) {
      return;
    }
    setIndex((prevIndex) => prevIndex - 1);
  };
  const handleNext = () => {
    if (index === items.length - 1) {
      return;
    }
    setIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="bg-[#040707] text-white p-[2.5rem] rounded-2xl relative max-w-xl">
      {index > 0 && (
        <button
          onClick={handlePrev}
          className="h-12 w-12 bg-claret-500 text-white rounded-full grid place-items-center absolute top-1/2 -left-[1.5rem] "
          type="button"
          aria-label="Previous"
        >
          <ArrowBackIcon />
        </button>
      )}
      <p className="text-4xl font-semibold font-poppins mb-5 ">
        Learn. Code. Grow
      </p>
      <p className="mb-2 font-semibold">{items[index].heading}</p>
      <p>{items[index].text}</p>
      <div className="flex space-x-2 justify-center mt-[2.5rem]">
        {items.map((item) => (
          <div
            key={item.id}
            className={`h-2 w-2  rounded-full ${
              index + 1 === item.id ? ' bg-claret-500' : 'bg-[#FCFCFC]'
            }`}
          />
        ))}
      </div>
      {index < items.length - 1 && (
        <button
          onClick={handleNext}
          className="h-12 w-12 bg-claret-500 text-white rounded-full grid place-items-center absolute top-1/2 -right-[1.5rem]"
          type="button"
          aria-label="Next"
        >
          <ArrowForwardIcon />
        </button>
      )}
    </div>
  );
}

export default AuthCarousel;
