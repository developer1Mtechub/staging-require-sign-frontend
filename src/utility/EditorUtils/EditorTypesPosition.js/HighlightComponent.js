import React from 'react';

const HighlightComponent = ({item, handleInputChanged, handleDoubleClick, IsSigner,activeSignerId,signerFunctionalControls,onTouchEnd,zoomPercentage}) => {
  return (
    <>
      {IsSigner ? (
        <>
          {signerFunctionalControls ? (
            <>
              {activeSignerId === item.signer_id_receive ? (
                <div
                  onClick={handleDoubleClick}
                   onTouchEnd={onTouchEnd}
                  // onClick={() => handleTextClick(index, 'signer_chooseImgStamp')}
                  style={{
                    backgroundColor: `${item.backgroundColor}`,

                    width: `${(item.width*zoomPercentage) - 3}px`,
                    height: `${(item.height*zoomPercentage) - 3}px`,
                    border: '1px solid lightGray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: '0.5',
                  }}></div>
              ) : (
                <div
                  // onClick={() => handleTextClick(index, 'signer_chooseImgStamp')}
                  style={{
                    backgroundColor: `${item.backgroundColor}`,

                    width: `${(item.width*zoomPercentage) - 3}px`,
                    height: `${(item.height*zoomPercentage) - 3}px`,
                    border: '1px solid lightGray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: '0.5',
                  }}></div>
              )}
            </>
          ) : (
            <div
              // onClick={() => handleTextClick(index, 'signer_chooseImgStamp')}
              style={{
                backgroundColor: `${item.backgroundColor}`,

                width: `${(item.width*zoomPercentage) - 3}px`,
                height: `${(item.height*zoomPercentage) - 3}px`,
                border: '1px solid lightGray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: '0.5',
              }}></div>
          )}
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
          // onClick={() => handleTextClick(index, 'signer_chooseImgStamp')}
          style={{
            backgroundColor: `${item.backgroundColor}`,

            width: `${(item.width*zoomPercentage) - 3}px`,
            height: `${(item.height*zoomPercentage) - 3}px`,
            border: '1px solid lightGray',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: '0.5',
          }}></div>
      )}
    </>
  );
};

export default HighlightComponent;
