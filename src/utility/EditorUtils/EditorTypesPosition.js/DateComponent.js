import React from 'react';
import { formatDate, formatDateCustom, formatDateInternational, formatDateUSA } from '../../Utils';
// ** Third Party Components
const DateComponent = ({item, handleDoubleClick,IsSigner,signerFunctionalControls,activeSignerId,onTouchEnd,zoomPercentage}) => {
  return (
    <>
   {IsSigner?
   <>
    {signerFunctionalControls?<>
    {activeSignerId===item.signer_id_receive?
     <div
     onClick={handleDoubleClick}
     onTouchEnd={onTouchEnd}
      style={{
       fontSize: item.fontSize*zoomPercentage,
       paddingLeft:'15px',
      //  backgroundColor: item.backgroundColor,
       width: `${(item.width*zoomPercentage)-3}px`,
       height: `${(item.height*zoomPercentage)-3}px`,
       color:'black',
     }}>
       {item.format==="m/d/y"?formatDateUSA(item.text):null}
       {item.format==="d/m/y"?formatDateInternational(item.text):null}
       {item.format==="m-d-y"?formatDateCustom(item.text):null}
 
 
     </div>: 
  <div
  style={{
   fontSize: item.fontSize*zoomPercentage,
   color:'black',
   paddingLeft:'15px',
 }}>
   {item.format==="m/d/y"?formatDateUSA(item.text):null}
   {item.format==="d/m/y"?formatDateInternational(item.text):null}
   {item.format==="m-d-y"?formatDateCustom(item.text):null}


 </div>}
  </>:<div
     style={{
      fontSize: item.fontSize*zoomPercentage,
      color:'black',
      paddingLeft:'15px',
    }}>
      {item.format==="m/d/y"?formatDateUSA(item.text):null}
      {item.format==="d/m/y"?formatDateInternational(item.text):null}
      {item.format==="m-d-y"?formatDateCustom(item.text):null}


    </div>}
   
    </>
    :
     <div
    onClick={handleDoubleClick}
    onTouchEnd={onTouchEnd}
     style={{
      fontSize: item.fontSize*zoomPercentage,
      paddingLeft:'15px',
      // backgroundColor: item.backgroundColor,
      width: `${(item.width*zoomPercentage)}px`,
      height: `${(item.height*zoomPercentage)}px`,
      color:'black',
    }}>
      {item.format==="m/d/y"?formatDateUSA(item.text):null}
      {item.format==="d/m/y"?formatDateInternational(item.text):null}
      {item.format==="m-d-y"?formatDateCustom(item.text):null}


    </div>}
   
    
   </>);
};

export default DateComponent;
