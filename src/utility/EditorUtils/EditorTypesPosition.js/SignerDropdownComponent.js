import React, { useState } from 'react';
import {darkenColorRGB} from '../../Utils';
import { ArrowRight } from 'react-feather';

const SignerDropComponent = ({item, handleSelectDropDownItem, handleDoubleClick, IsSigner, activeSignerId,RequiredActive,SignersWhoHaveCompletedSigning,
  onTouchEnd,
  zoomPercentage
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      {IsSigner ? (
        <>
          {activeSignerId === item.signer_id ? (
            <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
              style={{
                width: item.width*zoomPercentage,
                height: item.height*zoomPercentage,
                margin: 0,
                backgroundColor: item.required ? darkenColorRGB('rgb(255 214 91 / 78%)') : 'rgb(255 214 91 / 78%)',

                border: item.required ? '1px solid red' : '1px solid black',
                //  backgroundColor: item.required ? darkenColorRGB(item.backgroundColor) : item.backgroundColor,
                position: 'fixed',
                borderRadius: '3px',
                // zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // position: 'relative',
                // pointerEvents: 'none', // Make sure the box doesn't interfere with mouse events
              }}>
                 {isHovered ||
                 item.tooltip === '' || item.tooltip === null || item.tooltip === undefined ? null : (
                  <div
                  style={{
                    position: 'absolute',
                    top: '-25px',
                    height: '25px',
                    width: 'auto',
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
                     
                  {/* <h4 style={{fontWeight: 600}}>{item.required ? 'Required' : 'Optional'}</h4> */}
                
                  
                   
                  <h4>{item.tooltip}</h4>
                  
                </div>)}
                     {RequiredActive===item.id? <div style={{position:'absolute',top:"-15px",left:-55}} >
                {/* <h5>Required field</h5> */}
                <ArrowRight size={60} color="orange" />
              </div>:null }
              <select
                onChange={e => handleSelectDropDownItem(e.target.value)}
                style={{
                  width: item.width,
                  height: item.height,
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                }}>
               {/* <option value="">Select</option> */}
  {Array.isArray(item.options) && item.options.length > 0 && 
    item.options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))
  }
              </select>
              {/* <Input style={{ marginLeft: '-1px', marginTop: '15px', backgroundColor: "black" }} ref={elementRefCursor}
         type='checkbox'
         checked={true}

         id='basic-cb-checked' /> */}
            </div>
          ) : <>
          {SignersWhoHaveCompletedSigning.includes(item.signer_id)?(
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
          ):null}
          </>}
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
          onTouchEnd={onTouchEnd}
          style={{
            
            width:`${(item.width*zoomPercentage)-4}px`,
            height:`${(item.height*zoomPercentage)-4}px`,
            margin: 0,
            // border: '2px solid #6784a1',
            backgroundColor: item.required ? darkenColorRGB(item.backgroundColor) : item.backgroundColor,
            position: 'fixed',
            borderRadius: '3px',
            // zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // position: 'relative',
            // pointerEvents: 'none', // Make sure the box doesn't interfere with mouse events
          }}>
          <select
            style={{
              border: 'none',
              fontSize: 12*zoomPercentage,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              // width: item.width*zoomPercentage,
              // height: item.height*zoomPercentage,
            }}>
               {/* <option value="">Select</option> */}
             {Array.isArray(item.options) && item.options.length > 0 && 
    item.options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))
  }
          </select>
          {/* <Input style={{ marginLeft: '-1px', marginTop: '15px', backgroundColor: "black" }} ref={elementRefCursor}
          type='checkbox'
          checked={true}

          id='basic-cb-checked' /> */}
        </div>
      )}
    </>
  );
};

export default SignerDropComponent;
