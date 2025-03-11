import React from 'react';
import Select from 'react-select';
import { customStyles } from '../../utils/constants/customStyles';
import languageOptions from '../../utils/constants/languageOptions';

function LanguagesDropdown({ onSelectChange }) {
  return (
    <Select
      placeholder="Filter"
      options={languageOptions}
      styles={customStyles}
      defaultValue={languageOptions[0]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
}

export default LanguagesDropdown;
