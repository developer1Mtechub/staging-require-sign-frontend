import React from 'react';
import { formatDateCustom, formatDateInternational, formatDateUSA } from '../../../Utils';

const MySignerDateComponent = ({
  item,

}) => {
 
  return (
    <>
    {item.text===""||item.url===null?null
    :
      <div
        style={{
          fontSize: item.fontSize,
          paddingLeft: '10px',
          width: `${item.width - 3}px`,
          height: `${item.height - 3}px`,
        }}>
        {item.format === 'm/d/y' ? formatDateUSA(item.text) : null}
        {item.format === 'd/m/y' ? formatDateInternational(item.text) : null}
        {item.format === 'm-d-y' ? formatDateCustom(item.text) : null}
      </div>}
    </>
  );
};

export default MySignerDateComponent;
