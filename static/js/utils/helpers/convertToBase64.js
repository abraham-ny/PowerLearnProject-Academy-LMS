/* eslint-disable import/prefer-default-export */
// Convert file to base64 string
export const fileToBase64 = (dat) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(dat);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
};
