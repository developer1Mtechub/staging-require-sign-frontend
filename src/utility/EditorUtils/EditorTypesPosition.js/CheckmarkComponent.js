import React from "react";

const CheckmarkComponent = ({
  item,
  handleInputChecked,
  handleDoubleClick,
  IsSigner,
  activeSignerId,
  signerFunctionalControls,
  onTouchEnd,
  zoomPercentage,
}) => {
  return (
    <>
      {IsSigner ? (
        <>
          {signerFunctionalControls ? (
            <>
              {activeSignerId === item.signer_id_receive ? (
                // <h3
                //   onClick={handleDoubleClick}
                //   onTouchEnd={onTouchEnd}
                //   style={{
                //     color: 'black',
                //     fontWeight: 700,
                //     fontSize:12*zoomPercentage,
                //     display: 'flex',
                //     padding: 3,
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //   }}>
                //   {' '}
                //   ✔
                // </h3>
                <div
                  onClick={handleDoubleClick}
                  onTouchEnd={onTouchEnd}
                  style={{
                    width: window.innerWidth < 730 ? "20px" : "30px",
                    margin: 0,
                    height: window.innerWidth < 730 ? "20px" : "30px",
                    border: "2px solid rgba(98,188,221,1)",
                    backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
                    position: "fixed",
                    borderRadius: "3px",
                    // zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // pointerEvents: 'none',  // Make sure the box doesn't interfere with mouse events
                  }}
                >
                  {/* <Input style={{ marginLeft: '-1px', marginTop: '15px', backgroundColor: "black" }} ref={elementRefCursor}
                type='checkbox'
                checked={true}
      
                id='basic-cb-checked' /> */}
                  <input
                    value={false}
                    onChange={() => console.log("disable")}
                    type="checkbox"
                    checked={true}
                    style={{ transform: "scale(1.5)" }}
                    //  disabled
                    //  onClick={handleDoubleClick}
                    onTouchEnd={onTouchEnd}
                  />
                </div>
              ) : (
                // <h3
                //   style={{
                //     color: 'black',
                //     fontWeight: 700,
                //     display: 'flex',
                //     fontSize:12*zoomPercentage,
                //     padding: 3,
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //   }}>
                //   {' '}
                //   ✔
                // </h3>
                <div
                  style={{
                    width: window.innerWidth < 730 ? "20px" : "30px",
                    margin: 0,
                    height: window.innerWidth < 730 ? "20px" : "30px",
                    border: "2px solid rgba(98,188,221,1)",
                    backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
                    position: "fixed",
                    borderRadius: "3px",
                    // zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // pointerEvents: 'none',  // Make sure the box doesn't interfere with mouse events
                  }}
                >
                  {/* <Input style={{ marginLeft: '-1px', marginTop: '15px', backgroundColor: "black" }} ref={elementRefCursor}
                type='checkbox'
                checked={true}
      
                id='basic-cb-checked' /> */}
                  <input
                    value={true}
                    onChange={() => console.log("disable")}
                    type="checkbox"
                    checked
                    style={{ transform: `scale(${zoomPercentage})` }}
                    //  disabled
                    //  onClick={handleDoubleClick}
                    onTouchEnd={onTouchEnd}
                  />
                </div>
              )}
            </>
          ) : (
            // <h3
            //   style={{
            //     color: 'black',
            //     fontWeight: 700,
            //     display: 'flex',
            //     padding: 3,
            //     fontSize:12*zoomPercentage,
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //   }}>
            //   {' '}
            //   ✔
            // </h3>\
            <div
              style={{
                width: window.innerWidth < 730 ? "20px" : "30px",
                margin: 0,
                height: window.innerWidth < 730 ? "20px" : "30px",
                border: "2px solid rgba(98,188,221,1)",
                backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
                position: "fixed",
                borderRadius: "3px",
                // zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // pointerEvents: 'none',  // Make sure the box doesn't interfere with mouse events
              }}
            >
              {/* <Input style={{ marginLeft: '-1px', marginTop: '15px', backgroundColor: "black" }} ref={elementRefCursor}
            type='checkbox'
            checked={true}
  
            id='basic-cb-checked' /> */}
              <input
                value={true}
                checked
                onChange={() => console.log("disable")}
                type="checkbox"
                style={{ transform:  `scale(${zoomPercentage})`  }}
                //  disabled
                //  onClick={handleDoubleClick}
                onTouchEnd={onTouchEnd}
              />
            </div>
          )}
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
          onTouchEnd={onTouchEnd}
          style={{
            width: window.innerWidth < 730 ? "10px" : "30px",
            margin: 0,
            height: window.innerWidth < 730 ? "10px" : "30px",
            border: "2px solid rgba(98,188,221,1)",
            backgroundColor: "rgba(98,188,221,.3)", // Light grey with opacity
            position: "fixed",
            borderRadius: "3px",
            // zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // pointerEvents: 'none',  // Make sure the box doesn't interfere with mouse events
          }}
        >
          {/* <Input style={{ marginLeft: '-1px', marginTop: '15px', backgroundColor: "black" }} ref={elementRefCursor}
          type='checkbox'
          checked={true}

          id='basic-cb-checked' /> */}
          <input
            value={true}
            onChange={() => console.log("disable")}
            type="checkbox"
            checked
            style={{ transform: "scale(1.5)" }}
            //  disabled
            //  onClick={handleDoubleClick}
            onTouchEnd={onTouchEnd}
          />
        </div>
        // <h3
        //   onClick={handleDoubleClick}
        //   onTouchEnd={onTouchEnd}
        //   style={{
        //     color: 'black',
        //     fontWeight: 700,
        //     display: 'flex',
        //     fontSize:12*zoomPercentage,
        //     padding: 5,
        //     // marginTop: '1px',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //   }}>
        //   {' '}
        //   ✔
        // </h3>
      )}
    </>
  );
};

export default CheckmarkComponent;
