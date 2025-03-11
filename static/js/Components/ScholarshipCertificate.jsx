import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useSelector } from 'react-redux';
import useGetLoggedInUser from '../hooks/useGetLoggedInUserDetails';
import Spinner from './spinner/Spinner';
import useFetchDataV2 from '../hooks/useFetchDataV2';

function ScholarShipCertificate({ scholarshipCohortCertSetting }) {
  const user = useGetLoggedInUser();

  const studentId = useSelector((state) => state.auth.userDetails.id);

  const { data: student, isLoading: isStudentLoading } = useFetchDataV2(
    [studentId, 'userId'],
    `/users/student/${studentId}`,
    {},
    'We could not get your details, try again later',
    !!studentId
  );

  const arrayToString = (arr) => {
    if (arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr.join(' and ');
    return `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`;
  };

  const modulesSpecialized =
    student?.data?.student?.modules_specialised &&
    Array.isArray(JSON.parse(student?.data?.student?.modules_specialised))
      ? arrayToString(JSON.parse(student?.data?.student?.modules_specialised))
      : student?.data?.student?.modules_specialised;

  const certificationDate = student?.data?.student?.cohort?.certification_date
    ? new Date(
        student?.data?.student?.cohort?.certification_date
      ).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  const home_url =
    process.env.REACT_APP_HOME_URL ||
    'https://academy.powerlearnprojectafrica.org';

  const verify = `${home_url}/verify-cert/${user.id}`;

  console.log(
    'scholarshipCohortCertSetting?.certification_date_style_classnames: ',
    scholarshipCohortCertSetting?.certification_date_style_classnames
  );

  return (
    <div>
      {}
      <div className="relative font-bauer text-lg h-full">
        {isStudentLoading ? (
          <div className="h-screen flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <img
              src={scholarshipCohortCertSetting?.cert_template}
              alt="certificate"
              className="object-contain"
            />
            <>
              <div
                className={
                  scholarshipCohortCertSetting?.name_style_classnames ?? ''
                }
                // className="absolute top-[41%] left-[25.5%] w-1/2 font-light font-poppins text-white text-4xl"
              >
                <p className="capitalize">
                  {user?.firstname ?? user.firstname}{' '}
                  {user?.middlename ?? user.middlename}{' '}
                  {user?.lastname ?? user.lastname}
                </p>
              </div>
              <div
                className={
                  scholarshipCohortCertSetting?.specialization_style_classnames ??
                  ''
                }
                // className="absolute top-[48%] left-[25.5%] text-white font-poppins text-[16px] font-light max-w-xl"
              >
                <p className="">
                  Successfully completed a 16 -week program in Software
                  Development covering Python, Web Technologies, Database
                  Management, Dart With Flutter and Soft Skills
                  {modulesSpecialized ? (
                    <>
                      , with specialisation in&nbsp;
                      <span className="font-light">{modulesSpecialized}</span>.
                    </>
                  ) : (
                    <>.</>
                  )}
                </p>
              </div>
              {certificationDate && (
                <div
                  className={
                    scholarshipCohortCertSetting?.certification_date_style_classnames ??
                    ''
                  }
                  // className="absolute bottom-[34%] left-[25.5%] text-white font-poppins"
                >
                  <p>{certificationDate}</p>
                </div>
              )}
              <div
                className={
                  scholarshipCohortCertSetting?.valid_cert_qr_code_style_classnames ??
                  ''
                } // example "absolute bottom-[40%] left-[4%] w-fit space-y-1 text-xs"
              >
                <p className="text-xs text-white w-[35%] font-poppins">
                  Valid Certificate<span className="ml-1">ID</span>
                </p>
                <QRCodeCanvas
                  value={verify}
                  size={128}
                  level="H"
                  includeMargin
                />
              </div>
            </>
          </>
        )}
      </div>
    </div>
  );
}

export default ScholarShipCertificate;
