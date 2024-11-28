// import React, {useRef, useState} from 'react';
// import {darkenColorRGB} from '../../Utils';
// import {ArrowRight} from 'react-feather';
// const SignerPassportPhotoComponent = ({
//   item,
//   handleInputChanged,
//   handleDoubleClick,
//   IsSigner,
//   handleFileChange,
//   activeSignerId,
//   RequiredActive,
//   SignersWhoHaveCompletedSigning,
//   onTouchEnd,
//   zoomPercentage
// }) => {
//   const fileInputRef = useRef(null);

//   // Function to handle click on the div
//   const handleDivClick = () => {
//     // Trigger click event of the file input
//     fileInputRef.current.click();
//   };
//   const [isHovered, setIsHovered] = useState(false);
//   return (
//     <>
//       {IsSigner ? (
//         <>
//           {activeSignerId === item.signer_id ? (
//             <>
//               {item.url === null || item.url === undefined ? (
//                 <>
//                   <div
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                     onClick={handleDivClick}
//                     style={{
//                       display: 'flex',
//                       cursor: 'pointer',
//                       justifyContent: 'center',
//                       alignItems: 'center',

//                       width: item.width*zoomPercentage,
//                       // margin:0,
//                       // backgroundColor: 'white',
//                   backgroundColor: item.required ? darkenColorRGB('rgb(255 214 91 / 78%)') : 'rgb(255 214 91 / 78%)',

//                       height: item.height*zoomPercentage,
//                       border: item.required ? '1px solid red' : '1px solid black',
//                       borderRadius: '3px',
//                       // zIndex: 9999,
//                       position: 'relative',
//                     }}>
//                      {isHovered ||
//                       (item.tooltip === '' || item.tooltip === null || item.tooltip === undefined ? null : (
//                         <>
//                           <div
//                             style={{
//                               position: 'absolute',
//                               top: '-25px',
//                               height: '25px',
//                               width: '100px',
//                               padding: 1,
//                               border: '1px solid black',
//                               display: 'flex',
//                               justifyContent: 'left',
//                               alignItems: 'center',
//                               left: 0,
//                               backgroundColor: 'rgb(255 214 91 / 78%)',
//                               whiteSpace: 'nowrap', // Prevent text wrapping
//                               overflow: 'hidden', // Hide overflow
//                               textOverflow: 'ellipsis', // Truncate with ellipsis
//                             }}>
//                             {/* <h4 style={{fontWeight: 600}}>{item.required ? 'Required' : 'Optional'}</h4>
//                             <div>-</div> */}
//                               <h4>{item.tooltip}</h4>
//                           </div>
//                         </>
//                       ))}
                        
//                     {RequiredActive === item.id ? (
//                       <div style={{position: 'absolute', top: '-15px', left: -55}}>
//                         {/* <h5>Required field</h5> */}
//                         <ArrowRight size={60} color="orange" />
//                       </div>
//                     ) : null}
//                     <input type="file" accept="image/*" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange} />
//                     <h3 style={{opacity: '1', color:"black"}}>Choose Passport photo</h3>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div
//                   // style={{position:'relative'}}
//                   // onClick={handleDivClick}
//                   >
//                     {isHovered && (
//                       <>
//                         <div
//                           style={{
//                             position: 'absolute',
//                             top: '-25px',
//                             height: '25px',
//                             width: 'auto',
//                             padding: 1,
//                             border: '1px solid black',
//                             display: 'flex',
//                             justifyContent: 'left',
//                             alignItems: 'center',
//                             left: 0,
//                             backgroundColor: 'rgb(255 214 91 / 78%)',
//                             whiteSpace: 'nowrap', // Prevent text wrapping
//                             overflow: 'hidden', // Hide overflow
//                             textOverflow: 'ellipsis', // Truncate with ellipsis
//                           }}>
//                           <h4 style={{fontWeight: 600}}>{item.required ? 'Required' : 'Optional'}</h4>
//                           <div>-</div>
//                           {item.tooltip === '' || item.tooltip === null || item.tooltip === undefined ? null : (
//                             <h4>{item.tooltip}</h4>
//                           )}
//                         </div>
//                       </>
//                     )}
//                     <img
//                       onClick={handleDivClick}
//                       onMouseEnter={() => setIsHovered(true)}
//                       onMouseLeave={() => setIsHovered(false)}
//                       // className="drag-handle"
//                       // onClick={() => setEdit(!edit)}
//                       alt="Signature"
//                       // onClick={() => handleTextClick(index, "my_signature")}
//                       variant="square"
//                       src={`${item.url}`}
//                       style={{
//                         objectFit:"contain",
//                         // backgroundColor: `${isEditingSignature && editingIndex === index ? "#e4e3e5" : "transparent"}`,
//                         width: `${(item.width*zoomPercentage) - 3}px`,
//                         cursor: 'pointer',
//                         border: item.required ? '1px solid red' : '1px solid black',
//                         height: `${(item.height*zoomPercentage) - 3}px`,
//                         // border: '1px solid lightGray',
//                         // height: `auto`
//                       }}
//                     />
//                     <input accept="image/*" type="file" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange} />
//                   </div>
//                 </>
//               )}{' '}
//             </>
//           ) : (
//             <>
//               {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
//                 <>
//                   <img
//                     alt="Passport Photo"
//                     variant="square"
//                     src={`${item.url}`}
//                     style={{
//                       width: `${(item.width*zoomPercentage) - 3}px`,
//                       cursor: 'pointer',
//                       objectFit:"contain",
//                       height: `${(item.height*zoomPercentage) - 3}px`,
//                       // height: `auto`,
//                       border:'1px solid lightGrey'
//                     }}
//                   />
//                 </>
//               ) : null}
//             </>
//           )}
//         </>
//       ) : (
//         <div
//           onClick={handleDoubleClick}
//           onTouchEnd={onTouchEnd}
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',

//             width:`${(item.width*zoomPercentage)-4}px`,
//             height:`${(item.height*zoomPercentage)-4}px`,
//             backgroundColor: item.required ? darkenColorRGB(item.backgroundColor) : item.backgroundColor,
//             borderRadius: '3px',
//             // zIndex: 9999,
//             position: 'relative',
//           }}>
//           <h2 style={{opacity: '1',fontSize:12*zoomPercentage}}>Passport Photo</h2>
//         </div>
//       )}
//     </>
//   );
// };

// export default SignerPassportPhotoComponent;
import React, { useRef, useState } from 'react';
import { darkenColorRGB } from '../../Utils';
import { ArrowRight } from 'react-feather';
import { Spinner } from 'reactstrap';

const SignerPassportPhotoComponent = ({
  item,
  handleInputChanged,
  handleDoubleClick,
  IsSigner,
  handleFileChange,
  activeSignerId,
  RequiredActive,
  SignersWhoHaveCompletedSigning,
  onTouchEnd,
  zoomPercentage
}) => {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading status

  // Function to handle click on the div
  const handleDivClick = () => {
    // Trigger click event of the file input
    fileInputRef.current.click();
  };

  const handleImageLoad = () => {
    setLoading(false); // Set loading to false when the image loads
  };

  const handleFileInputChange = async (event) => {
    setLoading(true); // Set loading to true when a file is selected
    await handleFileChange(event); // Handle the file change
  };

  return (
    <>
      {IsSigner ? (
        <>
          {activeSignerId === item.signer_id ? (
            <>
              {item.url === null || item.url === undefined ? (
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handleDivClick}
                  style={{
                    display: 'flex',
                    cursor: 'pointer',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: item.width * zoomPercentage,
                    backgroundColor: item.required ? darkenColorRGB('rgb(255 214 91 / 78%)') : 'rgb(255 214 91 / 78%)',
                    height: item.height * zoomPercentage,
                    border: item.required ? '1px solid red' : '1px solid black',
                    borderRadius: '3px',
                    position: 'relative',
                  }}>
                  {isHovered ||
                    (item.tooltip === '' || item.tooltip === null || item.tooltip === undefined ? null : (
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
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                        <h4>{item.tooltip}</h4>
                      </div>
                    ))}
                  {RequiredActive === item.id ? (
                    <div style={{ position: 'absolute', top: '-15px', left: -55 }}>
                      <ArrowRight size={60} color="orange" />
                    </div>
                  ) : null}
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} />
                  {window.innerWidth<730?
                         <h5 style={{ opacity: '1', color: "black" }}>Choose Passport photo</h5>
                         :    <h3 style={{ opacity: '1', color: "black" }}>Choose Passport photo</h3>} 
                  
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  {loading && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                    }}>
                      {/* Loader can be a spinner or any loading indicator */}
                      <div ><Spinner color='primary'/></div>
                    </div>
                  )}
                  <img
                    onClick={handleDivClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    alt="Passport"
                    src={`${item.url}`}
                    onLoad={handleImageLoad} // Set loading to false when the image loads
                    style={{
                      objectFit: "contain",
                      width: `${(item.width * zoomPercentage) - 3}px`,
                      cursor: 'pointer',
                      border: item.required ? '1px solid red' : '1px solid black',
                      height: `${(item.height * zoomPercentage) - 3}px`,
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
                <img
                  alt="Passport Photo"
                  src={`${item.url}`}
                  style={{
                    width: `${(item.width * zoomPercentage) - 3}px`,
                    cursor: 'pointer',
                    objectFit: "contain",
                    height: `${(item.height * zoomPercentage) - 3}px`,
                    border: '1px solid lightGrey'
                  }}
                />
              ) : null}
            </>
          )}
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
          onTouchEnd={onTouchEnd}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: `${(item.width * zoomPercentage) - 4}px`,
            height: `${(item.height * zoomPercentage) - 4}px`,
            backgroundColor: item.required ? darkenColorRGB(item.backgroundColor) : item.backgroundColor,
            borderRadius: '3px',
            position: 'relative',
          }}>
          <h2 style={{ opacity: '1', fontSize: 12 * zoomPercentage }}>Passport Photo</h2>
        </div>
      )}
    </>
  );
};

export default SignerPassportPhotoComponent;
