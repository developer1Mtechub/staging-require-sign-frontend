import React from 'react';
import { formatDateCustom, formatDateInternational, formatDateUSA } from '../../../Utils';
// ** Third Party Components
const DateComponent = ({item}) => {
  return (
    <>
        <div
          style={{
            fontSize: item.fontSize,
            paddingLeft: '10px',
          }}>
          {item.format === 'm/d/y' ? formatDateUSA(item.text) : null}
          {item.format === 'd/m/y' ? formatDateInternational(item.text) : null}
          {item.format === 'm-d-y' ? formatDateCustom(item.text) : null}
        </div>
      
    </>
  );
};

export default DateComponent;
