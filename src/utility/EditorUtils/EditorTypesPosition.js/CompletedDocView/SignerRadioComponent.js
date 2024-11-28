import React from 'react';

const SignerRadioComponent = ({item}) => {
  return (
    <>
      <h3
        style={{
          color: 'black',
          fontWeight: 700,
          display: 'flex',
          padding: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {' '}
        {item.text ? '●' : ''}
      </h3>
    </>
  );
};

export default SignerRadioComponent;
