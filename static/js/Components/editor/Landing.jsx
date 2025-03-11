/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Breadcrumbs } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import CodeEditorWindow from './CodeEditorWindow';
import { classnames } from '../../utils/general';
import languageOptions from '../../utils/constants/languageOptions';

import { defineTheme } from '../../lib/defineTheme';
import useKeyPress from '../../hooks/useKeyPress';
import OutputWindow from './OutputWindow';
import CustomInput from './CustomInput';
import OutputDetails from './OutputDetails';
import ThemeDropdown from './ThemeDropdown';
import LanguagesDropdown from './LanguagesDropdown';
import MainContent from '../MainContent';
import CommonTopTab from '../CommonTopTab';
import useMutateData from '../../hooks/useMutateData';
import { axiosInterceptor } from '../../utils/Axios/axiosInterceptor';
import useFetchData from '../../hooks/useFetchData';
import { axiosInstanceCode } from '../../utils/Axios/axiosInstanceCode';

const javascriptDefault = `/**
* Problem: Create a functions that shows sum of two numbers
*/


const addNumbers = (a, b) => {
 return (a + b);
};


const a =10;
const b = 5;
console.log(addNumbers(a, b));
`;

const baseURL =
  process.env.REACT_APP_CODE_URL ||
  'https://api.lms.v2.powerlearnprojectafrica.org/code/compiler/api';

function Landing() {
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState('');
  const [outputDetails, setOutputDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [theme, setTheme] = useState('cobalt');
  // const [languageOptions, setLanguageOptions] = useState([]);
  const [language, setLanguage] = useState(languageOptions[0]);

  const navigate = useNavigate();

  const enterPress = useKeyPress('Enter');
  const ctrlPress = useKeyPress('Control');

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  const handleCompile = async () => {
    setIsLoading(true);
    const requestBody = {
      language_id: language?.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };

    try {
      const response = await axiosInterceptor.post(
        `${baseURL}/run-code`,
        requestBody
      );
      setIsLoading(false);

      setOutputDetails(response.data);
    } catch {
      setIsLoading(false);
      toast.error("Couldn't compile code");
    }
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      // eslint-disable-next-line no-use-before-define
      // handleCompile();
    }
  }, [ctrlPress, enterPress]);
  const onChange = (action, data) => {
    switch (action) {
      case 'code': {
        setCode(data);
        break;
      }
      default: {
        toast.error('An error occured while compiling your code. Try again');
      }
    }
  };

  function handleThemeChange(th) {
    // eslint-disable-next-line no-shadow
    const theme = th;

    if (['light', 'vs-dark'].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme('oceanic-next').then((_) =>
      setTheme({ value: 'oceanic-next', label: 'Oceanic Next' })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`);
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`);
  };

  return (
    <MainContent full>
      <CommonTopTab>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon />}>
          <NavLink
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            to="/"
            className="flex items-center"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            <p>Home</p>
          </NavLink>
          <NavLink
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            onClick={() => navigate(-1)}
            to={() => navigate(-1)}
            className="flex items-center"
          >
            <p>Lesson</p>
          </NavLink>
        </Breadcrumbs>
      </CommonTopTab>
      <div className="bg-white w-full rounded-md mt-4">
        <div className="flex flex-row">
          <div className="px-4 py-2">
            <LanguagesDropdown
              onSelectChange={onSelectChange}
              languageOptions={languageOptions}
            />
          </div>
          <div className="px-4 py-2">
            <ThemeDropdown
              handleThemeChange={handleThemeChange}
              theme={theme}
            />
          </div>
        </div>
        <div className="flex flex-row space-x-4 items-start px-4 py-4">
          <div className="flex flex-col w-full h-full justify-start items-end">
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.name}
              theme={theme?.value}
            />
          </div>

          <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
            <OutputWindow outputDetails={outputDetails} />
            <div className="flex flex-col items-end">
              {/* <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            /> */}
              <button
                type="button"
                onClick={handleCompile}
                disabled={!code}
                className={classnames(
                  'mt-4 border-2 border-gray-400 z-10 rounded-md px-4 py-2 hover:border-gray-600 transition duration-200 bg-white flex-shrink-0',
                  !code ? 'opacity-50' : ''
                )}
              >
                {isLoading ? 'Processing...' : 'Compile and Execute'}
              </button>
            </div>
            {outputDetails && <OutputDetails outputDetails={outputDetails} />}
          </div>
        </div>
      </div>
    </MainContent>
  );
}
export default Landing;
