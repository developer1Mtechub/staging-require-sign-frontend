import React, { useState } from 'react';
import { darkenColorRGB } from '../../Utils';

const SignerCheckmarkComponent = ({item, handleInputChecked, handleDoubleClick, IsSigner,activeSignerId,SignersWhoHaveCompletedSigning,
  onTouchEnd,
  zoomPercentage
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      {IsSigner ? (
        <>
        {activeSignerId===item.signer_id?  <div style={{position: 'relative'}}>
        {isHovered ||
                      (item.tooltip === '' || item.tooltip === null || item.tooltip === undefined ? null : (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              top: '-25px',
                              height: '25px',
                              width: '100px',
                              padding: 1,
                              border: '1px solid black',
                              display: 'flex',
                              justifyContent: 'left',
                              alignItems: 'center',
                              left: 0,
                              backgroundColor: 'rgb(255 214 91 / 78%)',
                              whiteSpace: 'nowrap', // Prevent text wrapping
                              overflow: 'hidden', // Hide overflow
                              textOverflow: 'ellipsis', // Truncate with ellipsis
                            }}>
                            {/* <h4 style={{fontWeight: 600}}>{item.required ? 'Required' : 'Optional'}</h4>
                            <div>-</div> */}
                              <h4>{item.tooltip}</h4>
                          </div>
                        </>
                      ))}
            <div style={{
              border:item.required?'1px solid red':'none',
              backgroundColor: item.required ? darkenColorRGB('rgb(255 214 91 / 78%)') : 'rgb(255 214 91 / 78%)',

              display:'flex',
              justifyContent:'center',
              // height: item.height*zoomPercentage,
              height: window.innerWidth<730?'20px':'30px',
              width:  window.innerWidth<730?'20px':'30px',
              alignItems:'center'
            }}>

            <input
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
              checked={item.text}
              onChange={(e) =>handleInputChecked(e) }
              type="checkbox"
              style={{transform: `scale(${zoomPercentage})`}}
              //  disabled
              //  onClick={handleDoubleClick}
                onTouchEnd={onTouchEnd}
            />     </div>
          </div>:<>
          {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
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
         {item.text?"✓":""}
        </h3>
                </>
              ) : null}
          </>}
         
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
            onTouchEnd={onTouchEnd}
          style={{
            width: window.innerWidth<730?'20px': '30px',
            margin: 0,
            height:  window.innerWidth<730?'20px':'30px',
            border: '2px solid rgba(98,188,221,1)',
            backgroundColor: item.backgroundColor, // Light grey with opacity
            position: 'fixed',
            borderRadius: '3px',
            // zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // pointerEvents: 'none',  // Make sure the box doesn't interfere with mouse events
          }}>
          {/* <Input style={{ marginLeft: '-1px', marginTop: '15px', backgroundColor: "black" }} ref={elementRefCursor}
          type='checkbox'
          checked={true}

          id='basic-cb-checked' /> */}
          <input
            value={false}
            onChange={() => console.log('disable')}
            type="checkbox"
            style={{transform: `scale(${zoomPercentage})`}}
            //  disabled
            //  onClick={handleDoubleClick}
              onTouchEnd={onTouchEnd}
          />
        </div>
      )}
    </>
  );
};

export default SignerCheckmarkComponent;
