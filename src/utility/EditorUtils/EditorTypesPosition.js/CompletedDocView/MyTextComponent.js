import React from 'react';

const MyTextComponent = ({item}) => {
  return (
    <>
    
      <span
        style={{
          fontSize: item.fontSize,
          fontStyle: item.fontStyle,
          fontWeight: item.fontWeight,
          color: item.color,
          backgroundColor: 'transparent',
          textDecoration: item.textDecoration,
          // minWidth: item.width,
          padding: 0,
          border: 'none',
          // height: item.height,

          borderRadius: item.borderRadius,
          fontFamily: item.fontFamily,
        }}>
        {item.text}
      </span>
    </>
  );
};

export default MyTextComponent;
