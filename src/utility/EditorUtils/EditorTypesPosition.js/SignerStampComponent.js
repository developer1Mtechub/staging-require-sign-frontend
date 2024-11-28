// import React, {useRef, useState} from 'react';
// import {darkenColorRGB} from '../../Utils';
// import { ArrowRight } from 'react-feather';
// const SignerStampComponent = ({
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
//                       backgroundColor: item.required ? darkenColorRGB('rgb(255 214 91 / 78%)') : 'rgb(255 214 91 / 78%)',

//                       height: item.height*zoomPercentage,
//                       border: item.required ? '1px solid red' : '1px solid black',
//                       borderRadius: '3px',
//                       // zIndex: 9999,
//                       position: 'relative',
//                     }}>
//                     {isHovered ||
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
//                     {RequiredActive===item.id? <div style={{position:'absolute',top:"-15px",left:-55}} >
//                 {/* <h5>Required field</h5> */}
//                 <ArrowRight size={60} color="orange" />
//               </div>:null }
//                     <input accept="image/*" type="file" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange} />
//                     <h3 style={{opacity: '1', color:"black"}}>Choose Stamp </h3>
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
//                         // backgroundColor: `${isEditingSignature && editingIndex === index ? "#e4e3e5" : "transparent"}`,
//                         width: `${(item.width*zoomPercentage) - 3}px`,
//                         cursor: 'pointer',
//                         objectFit:"contain",
//                         border: item.required ? '1px solid red' : '1px solid black',
//                         height: `${(item.height*zoomPercentage) - 3}px`,
//                         // height: `auto`,
//                         // border: '1px solid lightGray',
//                       }}
//                     />
//                     <input accept="image/*" type="file" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange} />
//                   </div>
//                 </>
//               )}{' '}
//             </>
//           ) : <>
//           {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
//                 <>
//                   <img
//                     alt="Stamp"
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
//           </>}
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
//           <h2 style={{opacity: '1',fontSize:12*zoomPercentage}}>Stamp</h2>
//         </div>
//       )}
//     </>
//   );
// };

// export default SignerStampComponent;
import React, { useRef, useState } from "react";
import { darkenColorRGB } from "../../Utils";
import { ArrowRight } from "react-feather";
import { Spinner } from "reactstrap";

const SignerStampComponent = ({
  item,
  handleInputChanged,
  handleDoubleClick,
  IsSigner,
  handleFileChange,
  activeSignerId,
  RequiredActive,
  SignersWhoHaveCompletedSigning,
  onTouchEnd,
  zoomPercentage,
}) => {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false); // State for loader

  // Function to handle file change
  const onFileChange = (event) => {
    setLoading(true); // Show loader
    handleFileChange(event); // Call the parent function
  };

  // Function to handle click on the div
  const handleDivClick = () => {
    // Trigger click event of the file input
    fileInputRef.current.click();
  };

  return (
    <>
      {IsSigner ? (
        <>
          {activeSignerId === item.signer_id ? (
            <>
              {item.url === null || item.url === undefined ? (
                <>
                  <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleDivClick}
                    style={{
                      display: "flex",
                      cursor: "pointer",
                      justifyContent: "center",
                      alignItems: "center",
                      width: item.width * zoomPercentage,
                      backgroundColor: item.required
                        ? darkenColorRGB("rgb(255 214 91 / 78%)")
                        : "rgb(255 214 91 / 78%)",
                      height: item.height * zoomPercentage,
                      border: item.required
                        ? "1px solid red"
                        : "1px solid black",
                      borderRadius: "3px",
                      position: "relative",
                    }}
                  >
                    {loading ? ( // Show loader if loading is true
                      <Spinner color="primary" />
                    ) : (
                      <>
                        {isHovered ||
                          (item.tooltip === "" ||
                          item.tooltip === null ||
                          item.tooltip === undefined ? null : (
                            <>
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-25px",
                                  height: "25px",
                                  width: "100px",
                                  padding: 1,
                                  border: "1px solid black",
                                  display: "flex",
                                  justifyContent: "left",
                                  alignItems: "center",
                                  left: 0,
                                  backgroundColor: "rgb(255 214 91 / 78%)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                <h4>{item.tooltip}</h4>
                              </div>
                            </>
                          ))}
                        {RequiredActive === item.id ? (
                          <div
                            style={{
                              position: "absolute",
                              top: "-15px",
                              left: -55,
                            }}
                          >
                            <ArrowRight size={60} color="orange" />
                          </div>
                        ) : null}
                        <input
                          accept="image/*"
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={onFileChange}
                        />
                        {window.innerWidth<730?
                          <h5 style={{ opacity: "1", color: "black" }}>
                          Choose Stamp
                        </h5>
                         :    <h3 style={{ opacity: "1", color: "black" }}>
                          Choose Stamp
                        </h3>}  
                     
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {isHovered && (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            top: "-25px",
                            height: "25px",
                            width: "auto",
                            padding: 1,
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            left: 0,
                            backgroundColor: "rgb(255 214 91 / 78%)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <h4 style={{ fontWeight: 600 }}>
                            {item.required ? "Required" : "Optional"}
                          </h4>
                          <div>-</div>
                          {item.tooltip === "" ||
                          item.tooltip === null ||
                          item.tooltip === undefined ? null : (
                            <h4>{item.tooltip}</h4>
                          )}
                        </div>
                      </>
                    )}
                    <img
                      onClick={handleDivClick}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      alt="Signature"
                      src={`${item.url}`}
                      style={{
                        width: `${item.width * zoomPercentage - 3}px`,
                        cursor: "pointer",
                        objectFit: "contain",
                        border: item.required
                          ? "1px solid red"
                          : "1px solid black",
                        height: `${item.height * zoomPercentage - 3}px`,
                      }}
                    />
                    <input
                      accept="image/*"
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={onFileChange}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
                <>
                  <img
                    alt="Stamp"
                    src={`${item.url}`}
                    style={{
                      width: `${item.width * zoomPercentage - 3}px`,
                      cursor: "pointer",
                      objectFit: "contain",
                      height: `${item.height * zoomPercentage - 3}px`,
                      border: "1px solid lightGrey",
                    }}
                  />
                </>
              ) : null}
            </>
          )}
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
          onTouchEnd={onTouchEnd}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: `${item.width * zoomPercentage - 4}px`,
            height: `${item.height * zoomPercentage - 4}px`,
            backgroundColor: item.required
              ? darkenColorRGB(item.backgroundColor)
              : item.backgroundColor,
            borderRadius: "3px",
            position: "relative",
          }}
        >
          <h2 style={{ opacity: "1", fontSize: 12 * zoomPercentage }}>Stamp</h2>
        </div>
      )}
    </>
  );
};

export default SignerStampComponent;
