import React from 'react';
import {BASE_URL} from '../../../../apis/api';

const SignerDrivinglicenseComponent = ({item}) => {
  return (
    <>
    {item.url===""||item.url===null?null
    :
      <img
        alt="Driving License"
        variant="square"
        src={`${BASE_URL}${item.url}`}
        style={{
          width: `${item.width - 3}px`,
          cursor: 'pointer',
          height: `${item.height - 3}px`,
          // height: `auto`,
          border: '1px solid lightGrey',
        }}
      />
}
    </>
  );
};

export default SignerDrivinglicenseComponent;