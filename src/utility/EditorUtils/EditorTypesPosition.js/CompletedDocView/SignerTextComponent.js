import React from 'react';

const MySignerTextComponent = ({
  item,
}) => {

  return (
    <>
      <div
        style={{
          width: item.width,
          height: item.height,
          // backgroundColor: item.backgroundColor, // Light grey with opacity
          borderRadius: '3px',
          // backgr:item.required?1:0.7,
          padding: 4,
          //   opacity: 0.5,
          // zIndex: 9999,
          position: 'relative',

          color: item.color,
        }}>
        <h2
          style={{
            fontSize: item.fontSize,
            fontStyle: item.fontStyle,
            fontWeight: item.fontWeight,
            textDecoration: item.textDecoration,
            fontFamily: item.fontFamily,
            // borderBottom: '2px solid grey',
          }}>
          {item.text}
        </h2>
      </div>
    </>
  );
};

export default MySignerTextComponent;
