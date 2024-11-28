import React, { useRef, useState } from "react";
import {
  darkenColorRGB,
  formatDateCustom,
  formatDateInternational,
  formatDateUSA,
} from "../../Utils";

const MySignerDateComponent = ({
  item,
  handleInputChanged,
  handleInputChangedDate,
  handleDoubleClick,
  IsSigner,
  activeSignerId,
  SignersWhoHaveCompletedSigning,
  onTouchEnd,
  zoomPercentage,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const inputRef = useRef(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const handleDivClick = () => {
    setIsDatePickerVisible(true);
  };
  const handleDateSelected = (e) => {
    // setSelectedDate(e.target.value);
    setIsDatePickerVisible(false);
    handleInputChangedDate(e);
  };
  return (
    <>
      {IsSigner ? (
        <>
          {activeSignerId === item.signer_id ? (
            <div style={{ position: "relative" }}>
              {isHovered && (
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
                      {/* <h4 style={{fontWeight: 600}}>{item.required ? 'Required' : 'Optional'}</h4>
                    <div>-</div> */}
                      <h4>{item.tooltip}</h4>
                    </div>
                  )}
                </>
              )}
              {/* <div
           onClick={() => inputRef.current.click()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                fontSize: item.fontSize,
                border:'1px solid black',
                backgroundColor:'white',
                paddingLeft: '10px',
              }}>
              {item.format === 'm/d/y' ? formatDateUSA(item.text) : null}
              {item.format === 'd/m/y' ? formatDateInternational(item.text) : null}
              {item.format === 'm-d-y' ? formatDateCustom(item.text) : null}
            </div> */}
              {isDatePickerVisible ? (
                <input
                  type="date"
                  ref={inputRef}
                  style={{
                    width: "95%",
                    fontSize: window.innerWidth > 730 ? "16px" : "12px",
                  }}
                  autoFocus
                  // value={item.text}
                  value={
                    item.text instanceof Date
                      ? item.text.toISOString().split("T")[0]
                      : ""
                  }
                  min={new Date().toISOString().split("T")[0]} // Disables past dates
                  onChange={handleDateSelected}
                />
              ) : (
                <div
                  onClick={handleDivClick}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    fontSize: window.innerWidth<730?"9px":item.fontSize * zoomPercentage,
                    backgroundColor: item.required
                      ? darkenColorRGB("rgb(255 214 91 / 78%)")
                      : "rgb(255 214 91 / 78%)",
                    border: item.required ? "1px solid red" : "1px solid black",
                    // backgroundColor: 'white',
                    color: "black",
                    paddingLeft: "10px",
                  }}
                >
                  {item.format === "m/d/y" ? formatDateUSA(item.text) : null}
                  {item.format === "d/m/y"
                    ? formatDateInternational(item.text)
                    : null}
                  {item.format === "m-d-y" ? formatDateCustom(item.text) : null}
                </div>
              )}
              {/* <input
                type="date"
                ref={inputRef} 
                style={{width: '95%', fontSize: '16px' }}
                
                autoFocus
                // onBlur={() => setIsDatePicker(false)} // Close date picker on blur
                value={item.text instanceof Date ? item.text.toISOString().split('T')[0] : ''}
                // value={editedItem.text ? editedItem.text.toISOString().split('T')[0] : ''}
                onChange={e => handleInputChangedDate(e)}
              />  */}

              {/* // <textarea
        //   value={item.text}
        //   placeholder={item.text === '' ? item.placeholder : null}
        //   onChange={e => handleInputChanged(e)}
        //   onDoubleClick={handleDoubleClick}
          onTouchEnd={onTouchEnd}

        //   style={{
        //     fontSize: item.fontSize,
        //     fontStyle: item.fontStyle,
        //     fontWeight: item.fontWeight,
        //     color: item.color,
        //     backgroundColor: item.required ? darkenColorRGB(item.backgroundColor) : item.backgroundColor,
        //     border: 'none',
        //     width: item.width,
        //     height: item.height,
        //     borderRadius: item.borderRadius,
        //     fontFamily: item.fontFamily,
        //     resize: 'none',
        //   }}
        // /> */}
            </div>
          ) : (
            <>
              {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
                <>
                  <div
                    style={{
                      fontSize: item.fontSize * zoomPercentage,
                      paddingLeft: "10px",
                      width: `${item.width - 3}px`,
                      height: `${item.height - 3}px`,
                    }}
                  >
                    {item.format === "m/d/y" ? formatDateUSA(item.text) : null}
                    {item.format === "d/m/y"
                      ? formatDateInternational(item.text)
                      : null}
                    {item.format === "m-d-y"
                      ? formatDateCustom(item.text)
                      : null}
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
          style={{
            width: `${item.width * zoomPercentage - 4}px`,
            height: `${item.height * zoomPercentage - 2}px`,
            // border: '2px solid #6784a1',
            backgroundColor: item.required
              ? darkenColorRGB(item.backgroundColor)
              : item.backgroundColor,
            borderRadius: "3px",
            padding: 1,
            //   opacity: 0.5,
            // zIndex: 9999,
            // borderBottom: "2px solid grey",

            // position: 'relative',
          }}
        >
          <h2
            style={{
              paddingLeft: 10,
              fontSize: item.fontSize * zoomPercentage,

              borderBottom: "2px solid grey",
            }}
          >
            Date{" "}
          </h2>{" "}
        </div>
      )}
    </>
  );
};

export default MySignerDateComponent;
