import React, { useEffect, useState } from "react";
import { darkenColorRGB } from "../../Utils";
import { ArrowRight } from "react-feather";

const MySignerTextComponent = ({
  item,
  handleInputChanged,
  handleDoubleClick,
  IsSigner,
  activeSignerId,
  RequiredActive,
  SignersWhoHaveCompletedSigning,
  onTouchEnd,
  zoomPercentage,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {IsSigner ? (
        <>
          {activeSignerId === item.signer_id ? (
            <div style={{ position: "relative" }} >
              {isHovered ||
                (item.text === " " && (
                  <>
                    {item.tooltip === "" ||
                    item.tooltip === null ||
                    item.tooltip === undefined ? null : (
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
                          whiteSpace: "nowrap", // Prevent text wrapping
                          overflow: "hidden", // Hide overflow
                          textOverflow: "ellipsis", // Truncate with ellipsis
                        }}
                      >
                        {/* <h4 style={{fontWeight: 600}}>{item.required ? 'Required' : 'Optional'}</h4> */}

                        <h4>{item.tooltip}</h4>
                      </div>
                    )}
                  </>
                ))}
              {/* {RequiredActive}
              {item.id} */}

              {RequiredActive === item.id ? (
                <div style={{ position: "absolute", top: "-15px", left: -55 }}>
                  <ArrowRight size={60} color="orange" />
                </div>
              ) : null}

              <input
                onClick={handleDoubleClick}
                  onTouchEnd={onTouchEnd}
                  onTouchStart={onTouchEnd}
                autoFocus
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                // onKeyDown={(event) => handleKeyPress(event)}
                value={item.text}
                // placeholder={item.text === '' ? item.placeholder : null}
                onChange={(e) => {
                  const element = e.target.value;
                  const characterLimit =
                    parseInt(item.characterLimit) + parseInt(1);
                  //console.log(element.length);
                  if (parseInt(element.length) <= parseInt(characterLimit)) {
                    handleInputChanged(e);
                  }
                }}
                style={{
                  fontSize: item.fontSize * zoomPercentage,
                  fontStyle: item.fontStyle,
                  fontWeight: item.fontWeight,
                  color: "black",
                  // backgroundColor: item.backgroundColor,
                  backgroundColor: item.required
                    ? darkenColorRGB("rgb(255 214 91 / 78%)")
                    : "rgb(255 214 91 / 78%)",
                  border: item.required ? "1px solid red" : "1px solid black",
                  padding: 4,
                  paddingLeft: 10,
                  width: `${item.width * zoomPercentage}px`,
                  height: `${item.height * zoomPercentage}px`,
                  borderRadius: item.borderRadius,
                  // borderBottom: '2px solid grey',
                  fontFamily: item.fontFamily,
                  resize: "none",
                }}
              />
            </div>
          ) : (
            <>
              {/* <button onClick={()=>{
            //console.log(SignersWhoHaveCompletedSigning)
          }}>
            jhhjdfdf
          </button> */}
              {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
                <>
                  <div
                    style={{
                      width: item.width * zoomPercentage,
                      height: item.height * zoomPercentage,
                      // backgroundColor: item.backgroundColor, // Light grey with opacity
                      borderRadius: "3px",
                      // backgr:item.required?1:0.7,
                      padding: 1,
                      //   opacity: 0.5,
                      // zIndex: 9999,
                      position: "relative",

                      color: item.color,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: item.fontSize * zoomPercentage,
                        fontStyle: item.fontStyle,
                        fontWeight: item.fontWeight,
                        textDecoration: item.textDecoration,
                        fontFamily: item.fontFamily,
                        // borderBottom: '2px solid grey',
                      }}
                    >
                      {item.text}
                    </h2>
                  </div>
                </>
              ) : null}
            </>
          )}
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchEnd}
          style={{
            width: `${item.width * zoomPercentage - 4}px`,
            height: `${item.height * zoomPercentage - 4}px`,
            // border: '1px solid rgba(98,188,221,1)',
            backgroundColor: item.required
              ? darkenColorRGB(item.backgroundColor)
              : item.backgroundColor,
            // backgroundColor: item.backgroundColor, // Light grey with opacity
            borderRadius: "3px",
            // backgr:item.required?1:0.7,
            padding: 1,
            //   opacity: 0.5,
            // zIndex: 9999,
            position: "relative",

            color: item.color,
          }}
        >
          <h2
            style={{
              fontSize: item.fontSize * zoomPercentage,
              fontStyle: item.fontStyle,
              fontWeight: item.fontWeight,
              textDecoration: item.textDecoration,
              fontFamily: item.fontFamily,
              paddingLeft: 10,
              borderBottom: "2px solid grey",
            }}
          >
            Text{" "}
          </h2>{" "}
        </div>
      )}
    </>
  );
};

export default MySignerTextComponent;
