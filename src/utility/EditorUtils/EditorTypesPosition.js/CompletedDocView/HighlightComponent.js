import React from 'react';

const HighlightComponent = ({item}) => {
  return (
    <>
      <div
        // onClick={() => handleTextClick(index, 'signer_chooseImgStamp')}
        style={{
          backgroundColor: `${item.backgroundColor}`,
          width: `${item.width - 3}px`,
          height: `${item.height - 3}px`,
          border: '1px solid lightGray',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: '0.5',
        }}></div>
    </>
  );
};

export default HighlightComponent;
