import React from 'react';

const CheckmarkComponent = () => {
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
        ✓
      </h3>
    </>
  );
};

export default CheckmarkComponent;
