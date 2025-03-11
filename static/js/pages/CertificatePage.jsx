import React, { useRef, useCallback, useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import ScholarShipCertificate from '../Components/ScholarshipCertificate';
import MainContent from '../Components/MainContent';
import RightBar from '../Components/RightBar';
import Calendar from '../Components/calendar/Calendar';
import LeaderBoard from '../Components/LeaderBoard';
import useFetchDataV2 from '../hooks/useFetchDataV2';
import Spinner from '../Components/spinner/Spinner';

function CertificatePage() {
  const certificateRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const { cohortType, cohortId } = useParams();

  const studentCertificateType = useSelector(
    (state) => state?.auth?.userDetails?.certificate_type
  );

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
  });

  const handleResize = useCallback(() => {
    if (window.innerWidth <= 768) {
      setIsMobileView(true);
    } else {
      setIsMobileView(false);
    }
  }, []);

  const {
    data: scholarShipCohortCertSettingsData,
    isLoading: isScholarShipCohortCertSettingsDataLoading,
  } = useFetchDataV2(
    ['cohort-cert-settings', cohortId, studentCertificateType],
    `/cohorts/${cohortId}/cert-settings/${studentCertificateType}`,
    {},
    'Could not fetch cohort certificate settings. Please try again later',
    !!(cohortId && studentCertificateType)
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <>
      <MainContent>
        <div className="bg-white px-2 py-5 rounded-lg flex w-full justify-between">
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
              to="/certificates"
              className="flex items-center"
            >
              <SchoolIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              <p>Certificates</p>
            </NavLink>
          </Breadcrumbs>
        </div>

        {isMobileView ? (
          <div className="bg-white my-4 justify-center align-middle max-h-[100vh] py-6">
            <h1 className="text-xl text-justify px-4 font-semibold">
              To ensure a great user experience and avoid any issues with your
              certificate, please access this page from a desktop or laptop.
            </h1>
          </div>
        ) : (
          <div className="my-4">
            {!isScholarShipCohortCertSettingsDataLoading ? (
              <div>
                {scholarShipCohortCertSettingsData &&
                scholarShipCohortCertSettingsData?.data?.cert_setting ? (
                  <>
                    <div className="w-auto bg-white text-black px-4 py-2">
                      <h2 className="font-semibold uppercase underline underline-offset-2 text-lg">
                        How to Download Your Certificate:
                      </h2>
                      <ol className="space-y-2">
                        {scholarShipCohortCertSettingsData?.data?.cert_setting
                          ?.feedback_survey_link && (
                          <li>
                            <p>
                              Stay connected and unlock opportunities! Complete
                              our Alumni Check-In Survey to update your details,
                              share feedback, and help us tailor programs,
                              events, and opportunities for your growth.
                              <a
                                href={
                                  scholarShipCohortCertSettingsData?.data
                                    ?.cert_setting?.feedback_survey_link
                                }
                                className="text-white bg-claret-500 underline font-semibold px-3 py-1 rounded-md"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Access Alumni Check-In Survey Here
                              </a>
                              . Already done? Proceed to the next steps.
                            </p>
                          </li>
                        )}
                        <li>
                          In the print settings, select the{' '}
                          <span className="font-semibold">destination</span> you
                          prefer: choose &quot;Save as PDF&quot; if you want to
                          save a digital copy, or select your printer if you
                          wish to print the certificate.
                        </li>
                        <li>
                          Ensure that the{' '}
                          <span className="font-semibold">paper size</span> is
                          set to A4 in the print settings.
                        </li>
                        <li>
                          Set the layout to{' '}
                          <span className="font-semibold">landscape</span>{' '}
                          instead of portrait.
                        </li>
                        <li>Click save to download your certificate.</li>
                      </ol>
                    </div>

                    <div className="flex justify-center w-full">
                      <button
                        type="button"
                        onClick={() => handlePrint()}
                        className="bg-claret-500 text-white w-1/3 text-xs rounded-md py-2 my-8 font-semibold"
                      >
                        DOWNLOAD {studentCertificateType.replaceAll('_', ' ')}
                      </button>
                    </div>
                    <div style={{ visibility: 'hidden' }} className="">
                      <div
                        ref={certificateRef}
                        className="h-full overflow-hidden bg-white"
                      >
                        {cohortType === 'scholarship' ? (
                          <ScholarShipCertificate
                            scholarshipCohortCertSetting={
                              scholarShipCohortCertSettingsData?.data
                                ?.cert_setting
                            }
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-auto bg-white text-black px-4 py-2 text-xl text-center flex items-center justify-center gap-2">
                    <p>
                      Oops! We couldn&apos;t fetch your cohort certificate
                      settings. But don&apos;t worry, help is just a click away!
                      Tap the <strong>ticket icon</strong>{' '}
                      <QuestionMarkIcon className="text-claret-500 inherit" />{' '}
                      at the bottom-right of your screen to contact support and
                      get assistance.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        )}
      </MainContent>
      <RightBar>
        <LeaderBoard />
        <Calendar />
      </RightBar>
    </>
  );
}

export default CertificatePage;
