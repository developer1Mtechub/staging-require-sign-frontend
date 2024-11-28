import React from 'react';

const SignerInitialsComponent = ({item, handleInputChanged, handleDoubleClick, IsSigner}) => {
  return (
    <>
      {IsSigner ? (
        <textarea
          value={item.text}
          placeholder={item.text === '' ? item.placeholder : null}
          onChange={e => handleInputChanged(e)}
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: item.fontSize,
            fontStyle: item.fontStyle,
            fontWeight: item.fontWeight,
            color: item.color,
            backgroundColor: item.backgroundColor,
            border: 'none',
            width: item.width,
            height: item.height,
            borderRadius: item.borderRadius,
            fontFamily: item.fontFamily,
            resize: 'none',
          }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            width: item.width,
            // margin:0,
            height: item.height,
            backgroundColor: item.backgroundColor, // Light grey with opacity
            borderRadius: '3px',
            zIndex: 9999,
          }}
        >
          <h2 style={{ opacity: "1" }}>Checkmark</h2>

        </div>
    
      )}
    </>
  );
};

export default SignerInitialsComponent;
