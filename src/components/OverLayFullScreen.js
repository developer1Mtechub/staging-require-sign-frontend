import React from 'react';
import CustomButton from './ButtonCustom';
const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgb(0, 0, 0, 0.8)",
    color: "white",
    fontSize: "1em",
    display: "flex",
    flexDirection:"column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
  };
const OverLayFullScreen = () => {

    return (
        <div style={overlayStyle}>
        This feature is only accessible on desktop or laptop devices. <br />
        Please switch to a larger screen to continue.
      <CustomButton
      onClick={()=>window.location.href="/home"}
        padding={true}
        size="sm"
        style={{ boxShadow: "none", fontSize: "15px", marginTop: "5%" }}
        text={
          <>
            <span>Back to Home </span>
          </>
        }
      /> </div>
    );
};

export default OverLayFullScreen;