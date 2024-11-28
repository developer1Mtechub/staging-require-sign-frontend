
import React, { useState, useEffect } from "react";
import { Spinner } from "reactstrap";

const StampComponent = ({
  item,
  handleInputChanged,
  handleDoubleClick,
  IsSigner,
  signerFunctionalControls,
  activeSignerId,
  onTouchEnd,
  zoomPercentage,
}) => {
  const [loading, setLoading] = useState(true);

  // Image preloading to handle loading state
  useEffect(() => {
    setLoading(true); // Reset loading state when the URL changes
    const img = new Image();
    img.src = item.url;
    img.onload = () => setLoading(false);
  }, [item.url]);

  return (
    <>
      {IsSigner ? (
        <>
          {signerFunctionalControls ? (
            <>
              {activeSignerId === item.signer_id_receive ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    width: `${item.width * zoomPercentage}px`,
                    height: `${item.height * zoomPercentage}px`,
                  }}
                >
                  {loading && (
                    <div
                      style={{
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <div ><Spinner color="primary"/></div>
                    </div>
                  )}
                  <div
                    onClick={handleDoubleClick}
                    onTouchEnd={onTouchEnd}
                    style={{
                      backgroundImage: `url(${item.url})`,
                      width: "100%",
                      height: "100%",
                      border: "1px solid lightGrey",
                      cursor: "pointer",
                      objectFit: "contain",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      display: loading ? "none" : "block",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    backgroundImage: `url(${item.url})`,
                    width: `${item.width * zoomPercentage}px`,
                    height: `${item.height * zoomPercentage}px`,
                    cursor: "pointer",
                    objectFit: "contain",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                />
              )}
            </>
          ) : (
            <div
              style={{
                backgroundImage: `url(${item.url})`,
                width: `${item.width * zoomPercentage}px`,
                height: `${item.height * zoomPercentage}px`,
                cursor: "pointer",
                objectFit: "contain",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: `${item.width * zoomPercentage}px`,
            height: `${item.height * zoomPercentage}px`,
          }}
        >
          {loading && (
            <div
              style={{
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <div ><Spinner color="primary"/></div>
            </div>
          )}
          <div
            onClick={handleDoubleClick}
            onTouchEnd={onTouchEnd}
            style={{
              backgroundImage: `url(${item.url})`,
              width: "100%",
              height: "100%",
              cursor: "pointer",
              objectFit: "contain",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              display: loading ? "none" : "block",
            }}
          />
        </div>
      )}
    </>
  );
};

export default StampComponent;
