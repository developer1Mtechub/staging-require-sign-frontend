import React, { useState, useEffect } from "react";
import { Spinner } from "reactstrap";

const MySignatureComponent = ({
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

  useEffect(() => {
    setLoading(true); // Reset loading state when the image URL changes
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
                    flexDirection: "column",
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
                      <div>
                        <Spinner color="primary" />
                      </div>
                    </div>
                  )}

                  {/* Hidden image to detect load */}
                  <img
                    src={item.url}
                    alt="hidden preloader"
                    style={{ display: "none" }}
                    onLoad={() => setLoading(false)}
                  />

                  {/* Div with background image */}
                  <div
                    onClick={handleDoubleClick}
                    onTouchEnd={onTouchEnd}
                    style={{
                      backgroundImage: `url(${item.url})`,
                      width: "100%",
                      height: "100%",
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
                    display: "flex",
                    flexDirection: "column",
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
                      <div>
                        <Spinner color="primary" />
                      </div>
                    </div>
                  )}

                  {/* Hidden image to detect load */}
                  <img
                    src={item.url}
                    alt="hidden preloader"
                    style={{ display: "none" }}
                    onLoad={() => setLoading(false)}
                  />

                  <div
                    style={{
                      backgroundImage: `url(${item.url})`,
                      width: "100%",
                      height: "100%",
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
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
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
                  <div>
                    <Spinner color="primary" />
                  </div>
                </div>
              )}

              {/* Hidden image to detect load */}
              <img
                src={item.url}
                alt="hidden preloader"
                style={{ display: "none" }}
                onLoad={() => setLoading(false)}
              />

              <div
                style={{
                  backgroundImage: `url(${item.url})`,
                  width: "100%",
                  height: "100%",
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
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: `${item.width * zoomPercentage - 4}px`,
            height: `${item.height * zoomPercentage - 4}px`,
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
              <div>
                <Spinner color="primary" />
              </div>
            </div>
          )}

          {/* Hidden image to detect load */}
          <img
            src={item.url}
            alt="hidden preloader"
            style={{ display: "none" }}
            onLoad={() => setLoading(false)}
          />

          <div
            onClick={handleDoubleClick}
            onTouchEnd={onTouchEnd}
            style={{
              backgroundImage: `url(${item.url})`,
              width: "100%",
              height: "100%",
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

export default MySignatureComponent;
