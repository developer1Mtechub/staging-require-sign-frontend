import React from 'react';
import {BASE_URL} from '../../../../apis/api';

const StampComponent = ({item}) => {
  return (
    <>
      <img
        alt="Stamp"
        variant="square"
        src={`${BASE_URL}${item.url}`}
        style={{
          // filter: 'grayscale(100%)',
          width: `${item.width - 3}px`,
          height: `${item.height - 3}px`,
        }}
      />
    </>
  );
};

export default StampComponent;
