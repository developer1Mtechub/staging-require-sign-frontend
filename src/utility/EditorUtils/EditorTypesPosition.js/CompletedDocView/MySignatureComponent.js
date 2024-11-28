import React from 'react';
import {BASE_URL} from '../../../../apis/api';

const MySignatureComponent = ({item}) => {
  return (
    <>
    
    <div style={{display: 'flex', flexDirection: 'column'}}>
       
        <img
          // className="drag-handle"
          // onClick={() => setEdit(!edit)}
          alt="Signature"
          // onClick={() => handleTextClick(index, "my_signature")}
          variant="square"
          src={`${BASE_URL}${item.url}`}
          style={{
            // backgroundColor: 'rgba(98,188,221,.3)',
            // backgroundColor: `${isEditingSignature && editingIndex === index ? "#e4e3e5" : "transparent"}`,
            width: `${item.width-3}px`,
            height: `${item.height-3}px`,
            // width:'auto',
            
            // height:'auto',
            resize:'cover',
            // height:'auto'
            // maxHeight: item.height==="auto"?item.height:`${item.height-3}px`,
            // border: '1px solid lightGray',
          }}
        />
      </div>
      
    </>
  );
};

export default MySignatureComponent;
