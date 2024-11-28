import React from 'react';

const SignerDropComponent = ({item}) => {
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

          }}>
          <h2
            style={{
              fontSize: item.fontSize,
            }}>
            {item.text}
          </h2>
          
        </div>
    </>
  );
};

export default SignerDropComponent;
