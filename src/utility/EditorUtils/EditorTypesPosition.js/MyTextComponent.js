import React, { useEffect, useRef, useState } from 'react';

const MyTextComponent = ({ item, handleInputChanged, handleDoubleClick,handleWidthChanged ,IsSigner,signerFunctionalControls,activeSignerId,onTouchEnd,zoomPercentage,setCallbackWidth}) => {
  
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const [inputWidth, setInputWidth] = useState(item.width * zoomPercentage);
  const inputRef = useRef(null);
  const spanRef = useRef(null);

  // Update the input width based on the text width measured by the hidden span
  useEffect(() => {
    if (spanRef.current) {
      const spanWidth = spanRef.current.offsetWidth; // Get the width of the span containing the text
      const newWidth = Math.max(spanWidth, item.width * zoomPercentage); // Ensure the width doesn't shrink too much
      setInputWidth(newWidth);
      // console.log("eywtuyey")
      // console.log(newWidth)

      setCallbackWidth(newWidth)
    }
  }, [item.text, zoomPercentage,item.width]);
  // useEffect(()=>{
  //     setCallbackWidth(inputWidth)

  // },[item.width])
  return (
    <>
  {IsSigner?
  <>
  
  {signerFunctionalControls?<>
    {activeSignerId===item.signer_id_receive?
    <div
    onClick={handleDoubleClick}
    onTouchEnd={onTouchEnd}
    onTouchStart={onTouchEnd}
    style={{
      
      width: `${(item.width*zoomPercentage)-3}px`,
      height: item.height*zoomPercentage,
      // border: '2px solid rgba(98,188,221,1)',
      borderRadius: '3px',
      backgroundColor: 'rgba(98,188,221,.3)', // Light grey with opacity
      position: 'fixed',
     //  padding: 6,
      // zIndex: 9999,
      // pointerEvents: 'none', // Make sure the box doesn't interfere with mouse events
    }}>
    <h2  onTouchEnd={onTouchEnd}  onTouchStart={onTouchEnd}   onClick={handleDoubleClick} style={{fontSize: '15px',
      borderBottom:item.text===""?'2px solid grey':"none",
 
  }}><input
  autoFocus
    value={item.text}
    ref={inputRef}
    placeholder={item.text === '' ? item.placeholder : null}
    onChange={e => handleInputChanged(e)}
    onClick={handleDoubleClick}
    onTouchEnd={onTouchEnd}
    onTouchStart={onTouchEnd}
    // onFocus={handleFocus}
    // onBlur={handleBlur}
    style={{
      fontSize: item.fontSize * zoomPercentage,
              fontStyle: item.fontStyle,
              fontWeight: item.fontWeight,
              color: item.color,
              cursor: 'text',
              backgroundColor: 'transparent',
              textDecoration: item.textDecoration,
              padding: 0,
              paddingRight:"5px",
              margin: 0,
              border: 'none',
              width: `${inputWidth}px`, // Dynamically update the width
              height: `${(item.height * zoomPercentage) - 10}px`,
              borderRadius: item.borderRadius,
              fontFamily: item.fontFamily,
              whiteSpace: 'nowrap', // Prevents text wrapping to multiple lines
              overflow: 'hidden', // Prevents scrolling within the input
              textAlign: 'left', // Aligns the text to start from the left
              textOverflow: 'ellipsis',
              outline: 'none',
   
    }}
  /> </h2>
  </div>: 
  <span  ref={spanRef} style={{
    fontSize: item.fontSize*zoomPercentage,
    fontStyle: item.fontStyle,
    fontWeight: item.fontWeight,
    color: item.color,
    backgroundColor: 'transparent',
    textDecoration:item.textDecoration,
    // minWidth: item.width,
    padding:0,
    border: 'none',
    // height: item.height,
    
    borderRadius: item.borderRadius,
    fontFamily: item.fontFamily,
       whiteSpace: 'nowrap',
          overflow: 'hidden',
    textOverflow: 'ellipsis',
    outline: 'none',
   
    
  }}>{item.text}
    </span>}
  </>: <span  ref={spanRef} style={{
    fontSize: item.fontSize*zoomPercentage,
    fontStyle: item.fontStyle,
    fontWeight: item.fontWeight,
    color: item.color,
    backgroundColor: 'transparent',
    textDecoration:item.textDecoration,
    // minWidth: item.width,
    padding:0,
    border: 'none',
    // height: item.height,
    
    borderRadius: item.borderRadius,
    fontFamily: item.fontFamily,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    outline: 'none',
    
  }}>{item.text}
    </span>}
 </>:<>
  
   <div
        onClick={handleDoubleClick}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchEnd}
        style={{
          // width: `${inputWidth}px`,
          width: `${inputWidth}px`,

          // height: `${item.height * zoomPercentage}px`,
          borderRadius: '3px',
          // backgroundColor: 'rgba(98,188,221,.3)', // Light grey with opacity
          position: 'fixed',
        }}
      >
        <h2 style={{ fontSize: '15px',
          //  borderBottom: item.text === '' ? '2px solid grey' : 'none'
          //  ,
            // paddingInline: 10 
           }}>
          <input
            autoFocus
            ref={inputRef}
            value={item.text}
            placeholder={item.text === '' ? item.placeholder : null}
            onChange={e => handleInputChanged(e)}
            onClick={handleDoubleClick}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchEnd}
            style={{
              fontSize: item.fontSize * zoomPercentage,
              fontStyle: item.fontStyle,
              fontWeight: item.fontWeight,
              color: item.color,
              cursor: 'text',
              backgroundColor: 'transparent',
              textDecoration: item.textDecoration,
              padding: 0,
              paddingRight:"5px",
              margin: 0,
              border: 'none',
              paddingInline: 10 ,
              width: `${inputWidth}px`, // Dynamically update the width
              height:"auto",
              // height: `${(item.height * zoomPercentage) - 10}px`,
              borderRadius: item.borderRadius,
              fontFamily: item.fontFamily,
              // whiteSpace: 'nowrap', // Prevents text wrapping to multiple lines
              // overflow: 'hidden', // Prevents scrolling within the input
              // textAlign: 'left', // Aligns the text to start from the left
              // textOverflow: 'ellipsis',
              outline: 'none',
            }}
          />
        </h2>
      </div>
  <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          outline: 'none',
          fontSize: item.fontSize * zoomPercentage,
          fontWeight: item.fontWeight,
          fontStyle: item.fontStyle,
          fontFamily: item.fontFamily,
        }}
      >
        {item.text || item.placeholder}
      </span>
      </>
 }
   
   
    </>
  );
};

export default MyTextComponent;