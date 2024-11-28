import { formatDate, formatDateCustom } from "../utility/Utils";

const SidebarTypes = ({
  type,
  elementRefCursor,
  selectedSigner,
  stateMemory,
  zoomPercentage,
}) => {
  if (!stateMemory) {
    console.warn("stateMemory is no longer available");
    return null;
  }
  return (
    <>
      {type === "my_text" && (
        <>
          <div
            ref={elementRefCursor}
            style={{
              // width: '120px',
              width: 120, // Adjust width based on zoom
              // marginTop: '3px',
              // height: `${
              //   parseInt(stateMemory.fontSize) >= parseInt(18)
              //     ? 40 * (zoomPercentage / 100)
              //     : 30 * (zoomPercentage / 100)
              // }`,
              
              height:"auto",
              //  height:zoomPercentage>1.0 ?40*zoomPercentage: 30*zoomPercentage,
              border: "2px solid rgba(98,188,221,1)",
              borderRadius: "3px",
              backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
              position: "fixed",
              padding: 1,
              // padding: `${1 * (zoomPercentage / 100)}px`, // Adjust padding based on zoom
              zIndex: 9999,
              pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
              // transform: `scale(${zoomPercentage / 100})`, // Scale the entire cursor based on zoom
              // transformOrigin: 'top left',
            }}
          >
            <h2
              style={{
                // fontSize: stateMemory.fontSize,
                fontSize: stateMemory.fontSize * zoomPercentage,
                fontFamily: stateMemory.fontFamily,
                fontWeight: stateMemory.fontWeight,
                fontStyle: stateMemory.fontStyle,
                paddingLeft: 10,
                // paddingLeft: `${10 * (zoomPercentage / 100)}px`, // Adjust padding based on zoom
                // borderBottom: "2px solid grey",
              }}
            >
              Text{" "}
            </h2>
          </div>
        </>
      )}
      {type === "signer_text" && (
        <div
          ref={elementRefCursor}
          style={{
            width: 120 * zoomPercentage,
            // height: `${parseInt(stateMemory.fontSize)>=parseInt(18)?'40px':'30px'}`,
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: selectedSigner.color, // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",

            padding: 1,
            zIndex: 9999,
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <h2
            style={{
              fontSize: stateMemory.fontSize * zoomPercentage,
              fontFamily: stateMemory.fontFamily,
              fontWeight: stateMemory.fontWeight,
              fontStyle: stateMemory.fontStyle,
              borderBottom: "2px solid grey",
              paddingLeft: 10,
            }}
          >
            Text{" "}
          </h2>{" "}
        </div>
      )}
      {type === "checkmark" && (
        <div
          ref={elementRefCursor}
          style={{
            width: "30px",
            padding: 5,
            margin: 0,
            height: "30px",
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          {/* <h3
            style={{
              color: "black",
              fontWeight: 700,
              paddingTop: "5px",
              fontSize: 18,
              display: "flex",
              padding: 5,
              marginTop: "9px",

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            ✔
          </h3> */}
           <div
          style={{
            width: '30px',
            margin: 0,
            height: '30px',
            // border: '2px solid rgba(98,188,221,1)',
            // backgroundColor:"rgba(98,188,221,.3)", // Light grey with opacity
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
            value={true}
            onChange={() => console.log('disable')}
            type="checkbox"
            checked
            style={{transform: 'scale(1.5)'}}
            //  disabled
            //  onClick={handleDoubleClick}
          />
        </div>
          {/* <input type="checkbox" 
          style={{transform: 'scale(1.5)'}} /> */}
        </div>
      )}
      {type === "signer_checkmark" && (
        <div
          ref={elementRefCursor}
          style={{
            width: 30,
            margin: 0,
            height: 30,
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: selectedSigner.color, // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <input type="checkbox" style={{ transform: "scale(1.5)" }} />
        </div>
      )}
      {type === "date" && (
        <div
          ref={elementRefCursor}
          style={{
            width: "150px",
            // margin:0,
            height: "30px",
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            color: "black",
            fontSize: "15px",
            zIndex: 9999,
            borderBottom: "2px solid grey",
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              paddingTop: "5px",

              borderBottom: "2px solid grey",
              // paddingLeft: 10,
            }}
          >
            {formatDateCustom(new Date())}
          </h2>{" "}
        </div>
      )}
      {type === "signer_date" && (
      //   <div
      //   ref={elementRefCursor}
      //   style={{
      //     width: "150px",
      //     // margin:0,
      //     height: "30px",
      //     border: "2px solid rgba(98,188,221,1)",
      //     backgroundColor:  selectedSigner.color, // Light grey with opacity
      //     position: "fixed",
      //     borderRadius: "3px",
      //     color: "black",
      //     fontSize: 18,
      //     zIndex: 9999,
      //     paddingBottom:"5px",
      //     borderBottom: "2px solid grey",
      //     pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
      //   }}
      // >
      //   <h2
      //     style={{
      //       fontSize: 18,
      //       paddingTop: "5px",

      //       borderBottom: "2px solid grey",
      //       // paddingLeft: 10,
      //     }}
      //   >
      //    Date
      //   </h2>{" "}
      // </div>
      <div
            ref={elementRefCursor}
            style={{
              // width: '120px',
              width: 120, // Adjust width based on zoom
              // marginTop: '3px',
              height: `${
                parseInt(stateMemory.fontSize) >= parseInt(18)
                  ? 40 * (zoomPercentage / 100)
                  : 30 * (zoomPercentage / 100)
              }`,
              // height:zoomPercentage>1.0?45/zoomPercentage: 30/zoomPercentage,
              //  height:zoomPercentage>1.0 ?40*zoomPercentage: 30*zoomPercentage,
              border: "2px solid rgba(98,188,221,1)",
              borderRadius: "3px",
              backgroundColor: selectedSigner.color, // Light grey with opacity
              position: "fixed",
              padding: 1,
              // padding: `${1 * (zoomPercentage / 100)}px`, // Adjust padding based on zoom
              zIndex: 9999,
              pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
              // transform: `scale(${zoomPercentage / 100})`, // Scale the entire cursor based on zoom
              // transformOrigin: 'top left',
            }}
          >
            <h2
              style={{
                // fontSize: stateMemory.fontSize,
                fontSize: 12 * zoomPercentage,
                paddingLeft: 10,
                // paddingLeft: `${10 * (zoomPercentage / 100)}px`, // Adjust padding based on zoom
                borderBottom: "2px solid grey",
              }}
            >
              Date
            </h2>
          </div>
        // <div
        //   ref={elementRefCursor}
        //   style={{
        //     width: 80 * zoomPercentage,
        //     // margin:0,
        //     height: 20 * zoomPercentage,
        //     border: "2px solid rgba(98,188,221,1)",
        //     backgroundColor: selectedSigner.color, // Light grey with opacity
        //     position: "fixed",
        //     borderRadius: "3px",
        //     fontSize: "12px",
        //     padding: 4,
        //     paddingLeft: 10,
        //     zIndex: 9999,
        //     pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
        //   }}
        // >
        //   <h2 style={{ fontSize: 12 * zoomPercentage }}>Date </h2>
        // </div>
      )}
      {type === "highlight" && (
        <div
          ref={elementRefCursor}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid rgba(98,188,221,1)",
            width: "200px",
            height: "40px",
            backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <h2 style={{ opacity: "1" }}>Highlight</h2>
        </div>
      )}
      {type === "stamp" && (
        <div
          ref={elementRefCursor}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "120px",
            height: "120px",
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <h2 style={{ opacity: "1" }}>Stamp</h2>
        </div>
      )}
      {type === "my_signature" && (
        <div
          ref={elementRefCursor}
          style={{
            display: "flex",
            justifyContent: "center",
            // alignItems: 'center',
            alignItems: "center", // Align content at the bottom
            flexDirection: "column",
            width: 200 * zoomPercentage, // Adjust width based on zoom
            height: 60 * zoomPercentage, // Adjust height based on zoom
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            // borderBottom: '2px solid grey', // Existing border-bottom
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
            zIndex: 9999,
            paddingBottom: "20px",
            paddingTop:"20px",
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          {/* <h2 style={{opacity: '1',

          }}>Signature</h2> */}
          <h2
            style={{
              marginBottom: "auto", // Pushes the text upwards
              opacity: "1",
            }}
          >
            Signature
          </h2>

          {/* Border at the bottom */}
          <div
            style={{
              width: "100%",
              height: "2px",
              backgroundColor: "grey",
              borderRadius: "2px",
            }}
          ></div>
        </div>
      )}
      {type === "my_initials" && (
         <div
         ref={elementRefCursor}
         style={{
           display: "flex",
           justifyContent: "center",
           // alignItems: 'center',
           alignItems: "center", // Align content at the bottom
           flexDirection: "column",
           width: 60 * zoomPercentage, // Adjust width based on zoom
           height: 60 * zoomPercentage, // Adjust height based on zoom
           border: "2px solid rgba(98,188,221,1)",
           backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
           position: "fixed",
           borderRadius: "3px",
           // borderBottom: '2px solid grey', // Existing border-bottom
           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
           zIndex: 9999,
           paddingBottom: "20px",
           paddingTop:"20px",
           pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
         }}
       >
         {/* <h2 style={{opacity: '1',

         }}>Signature</h2> */}
         <h2
           style={{
             marginBottom: "auto", // Pushes the text upwards
             opacity: "1",
           }}
         >
           Initials
         </h2>

         {/* Border at the bottom */}
         <div
           style={{
             width: "100%",
             height: "2px",
             backgroundColor: "grey",
             borderRadius: "2px",
           }}
         ></div>
       </div>
        // <div
        //   ref={elementRefCursor}
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     width: "60px",
        //     height: "60px",
        //     border: "2px solid rgba(98,188,221,1)",
        //     backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
        //     position: "fixed",
        //     borderRadius: "3px",
        //     zIndex: 9999,
        //     pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
        //   }}
        // >
        //   <h2 style={{ opacity: "1" }}>Initials</h2>
        // </div>
      )}
      {type === "signer_initials" && (
         <div
         ref={elementRefCursor}
         style={{
           display: "flex",
           justifyContent: "center",
           // alignItems: 'center',
           alignItems: "center", // Align content at the bottom
           flexDirection: "column",
           width: `${(180*zoomPercentage)-3}px`, // Adjust width based on zoom
           height: `${(60*zoomPercentage)-3}px`, // Adjust height based on zoom
           border: "2px solid rgba(98,188,221,1)",
           backgroundColor: selectedSigner.color, // Light grey with opacity
           position: "fixed",
           borderRadius: "3px",
           // borderBottom: '2px solid grey', // Existing border-bottom
           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
           zIndex: 9999,
          //  paddingBottom: "20px",
          //  paddingTop:"22px",
          padding:"20px",
           pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
         }}
       >
         {/* <h2 style={{opacity: '1',

         }}>Signature</h2> */}
         <h2
           style={{
             marginBottom: "auto", // Pushes the text upwards
             opacity: "1",
          //  marginTop:"20px"
           }}
         >
           Signature
         </h2>

         {/* Border at the bottom */}
         <div
           style={{
             width: "100%",
             height: "2px",
             backgroundColor: "grey",
             borderRadius: "2px",
           }}
         ></div>
       </div>
        // <div
        //   ref={elementRefCursor}
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     width: "280px",
        //     height: "90px",
        //     border: "2px solid rgba(98,188,221,1)",
        //     backgroundColor: selectedSigner.color, // Light grey with opacity
        //     position: "fixed",
        //     borderRadius: "3px",
        //     zIndex: 9999,
        //     pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
        //   }}
        // >
        //   <h2 style={{ opacity: "1", fontSize: 18 }}>Signature</h2>
        // </div>
      )}
      {type === "signer_initials_text" && (
        // <div
        //   ref={elementRefCursor}
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     width: 50 * zoomPercentage,
        //     height: 50 * zoomPercentage,
        //     border: "2px solid rgba(98,188,221,1)",
        //     backgroundColor: selectedSigner.color, // Light grey with opacity
        //     position: "fixed",
        //     borderRadius: "3px",
        //     zIndex: 9999,
        //     pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
        //   }}
        // >
        //   <h2 style={{ opacity: "1", fontSize: 16 }}>Initials</h2>
        // </div>
         <div
         ref={elementRefCursor}
         style={{
           display: "flex",
           justifyContent: "center",
           // alignItems: 'center',
           alignItems: "center", // Align content at the bottom
           flexDirection: "column",
           width:`${(55*zoomPercentage)-4}px`,
           height:`${(55*zoomPercentage)-4}px`, // Adjust height based on zoom
           border: "2px solid rgba(98,188,221,1)",
           backgroundColor: selectedSigner.color, // Light grey with opacity
           position: "fixed",
           borderRadius: "3px",
           // borderBottom: '2px solid grey', // Existing border-bottom
           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
           zIndex: 9999,
           paddingBottom: "20px",
           paddingTop:"20px",
           pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
         }}
       >
         {/* <h2 style={{opacity: '1',

         }}>Signature</h2> */}
         <h2
           style={{
             marginBottom: "auto", // Pushes the text upwards
             opacity: "1",
             fontSize:10*zoomPercentage
           }}
         >
           Initials
         </h2>

         {/* Border at the bottom */}
         <div
           style={{
             width: "100%",
             height: "2px",
             backgroundColor: "grey",
             borderRadius: "2px",
           }}
         ></div>
       </div>
      )}
      {type === "signer_chooseImgDrivingL" && (
        <div
          ref={elementRefCursor}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 250 * zoomPercentage,
            height: 100 * zoomPercentage,
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: selectedSigner.color, // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <h2 style={{ opacity: "1", fontSize: 12 * zoomPercentage }}>
            Driving License
          </h2>
        </div>
      )}
      {type === "signer_chooseImgPassportPhoto" && (
        <div
          ref={elementRefCursor}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 250 * zoomPercentage,
            height: 150 * zoomPercentage,
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: selectedSigner.color, // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <h2 style={{ opacity: "1", fontSize: 12 * zoomPercentage }}>
            Passport Photo
          </h2>
        </div>
      )}
      {type === "signer_chooseImgStamp" && (
        <div
          ref={elementRefCursor}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 90 * zoomPercentage,
            height: 90 * zoomPercentage,
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: selectedSigner.color, // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <h2 style={{ opacity: "1", fontSize: 12 * zoomPercentage }}>Stamp</h2>
        </div>
      )}
      {type === "signer_radio" && (
        <div
          ref={elementRefCursor}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30px",
            height: "30px",
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: selectedSigner.color, // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <input type="radio" style={{ transform: "scale(1.5)" }} />
        </div>
      )}
      {type === "signer_dropdown" && (
        <div
          ref={elementRefCursor}
          style={{
            display: "flex",
            // justifyContent: 'center',
            alignItems: "center",
            width: 90 * zoomPercentage,
            height: 20 * zoomPercentage,
            border: "2px solid #6784a1",
            backgroundColor: selectedSigner.color, // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            zIndex: 9999,
            pointerEvents: "none", // Make sure the box doesn't interfere with mouse events
          }}
        >
          <select
            style={{
              border: "none",
              // width: 100*zoomPercentage,
              // height: 40*zoomPercentage,
              marginLeft: "5px",
              fontSize: 12 * zoomPercentage,
              cursor: "pointer",
              backgroundColor: "transparent",
            }}
          >
            <option value="">Select</option>
          </select>
        </div>
      )}
    </>
  );
};
export default SidebarTypes;
