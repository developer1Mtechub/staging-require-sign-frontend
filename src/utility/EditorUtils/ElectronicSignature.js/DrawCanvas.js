import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
} from "reactstrap";
import { BASE_URL, post, postFormData } from "../../../apis/api";
import { Check, Trash, X } from "react-feather";
import SignatureCanvas from "react-signature-canvas";
import ModalConfirmationAlert from "../../../components/ModalConfirmationAlert";
import toastAlert from "@components/toastAlert";
import CustomButton from "../../../components/ButtonCustom";
import getActivityLogUser from "../../IpLocation/MaintainActivityLogUser";
import { base64toFile } from "../../Utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectPrimaryColor } from "../../../redux/navbar";
const DrawCanvas = ({
  user_id_user,
  user_email,
  lengthPrevsign,
  lengthPrevInitial,
  SaveAsProfile,
  initialsBox,
  profile,
  saveSignature,
  PrevSignatureArray,
  modalClose,
  refreshPrev,
}) => {
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState("black");
  const primary_color = useSelector(selectPrimaryColor);
  const { t } = useTranslation();

  const [thickness, setThickness] = useState(2); // Initial thickness value
  const [imageDataURL, setImageDataURL] = useState(null); // State to hold the generated image
  const signatureRef = useRef();
  const sigCanvas = useRef(null);

  const handleSave = () => {
    // saveSignature(lines);
    //console.log('dfhjdfhjdf');
    setLoader(true);
    const imageDataURL = convertLinesToImage();
    // //console.log(convert to image )
    //console.log('imageDataURL');
    //console.log('imageDataURL');
  };

  const convertLinesToImage = async () => {
    const canvas = sigCanvas.current.getCanvas();
    const ctx = canvas.getContext("2d");

    // Save the current canvas state
    ctx.save();

    // Make the canvas transparent by setting its background color to fully transparent
    canvas.style.backgroundColor = "rgba(0, 0, 0, 0)";

    // Get the signature data URL
    const dataURL = canvas.toDataURL();

    // Restore the canvas state (optional)
    ctx.restore();

    // Set the canvas background color back to its original color (if needed)
    canvas.style.backgroundColor = "white"; // or any other color

    // Set the generated image data URL as the state
    setImageDataURL(dataURL);

    // Save or process the image data URL as needed
    // saveSignature(dataURL, null);
    if (initialBoxData) {
      console.log("dataURL");
      console.log(dataURL);
      const filename = "image.png";
      const fileObject = base64toFile(dataURL, filename);
      const postData = {
        image: fileObject,
        user_id: user_id_user,
      };
      const apiData = await postFormData(postData); // Specify the endpoint you want to call
      if (
        apiData.public_url === null ||
        apiData.public_url === undefined ||
        apiData.public_url === ""
      ) {
        toastAlert("error", "Error uploading Files");
      } else {
        console.log("asjghsdfjhgsdfjhg");
        console.log(apiData.public_url);

        //console.log(items?.token?.user_id);
        const user_id = user_id_user;
        let ImageUrl = apiData.public_url;
        const TypeCeck = initialsBox ? "profile_initils" : "profile";
        const event = initialsBox
          ? "PROFILE-INITIALS-ADDED"
          : "PROFILE-SIGNATURE-ADDED";
        const textData = initialsBox
          ? "profile initials added"
          : "profile signature added";
        const postData = {
          user_id: user_id,
          signature_image_url: ImageUrl,
          type: TypeCeck,
        };
        const apiData1 = await post("user/AddUserSignaturesToDb", postData); // Specify the endpoint you want to call
        if (apiData1.error) {
          setIsSubmitting(false);
          toastAlert("error", "Can't Update Right Now!");
        } else {
          const user_id = user_id_user;
          const email = user_email;

          let response_log = await getActivityLogUser({
            user_id: user_id,
            event: event,
            description: `${email} ${textData}  `,
          });
          if (response_log === true) {
            //console.log('MAINTAIN LOG SUCCESS');
          } else {
            //console.log('MAINTAIN ERROR LOG');
          }
        }
        saveSignature(dataURL, null);
      }
    } else {
      saveSignature(dataURL, null);
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    // const updatedLines = lines.map(line => ({...line, color: newColor}));
    // setLines(updatedLines);
    // redrawLines(newColor);
    const canvas = sigCanvas.current.getCanvas();
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Change only the sig÷nature color, leave background untouched
    // for (let i = 0; i < data.length; i += 4) {
    //     // Check if the pixel is part of the signature (not fully transparent)
    //     if (data[i + 3] !== 0) {
    //         data[i] = newColor === 'red' ? 255 : 0; // Red channel
    //         data[i + 1] = newColor === 'green' ? 255 : 0; // Green channel
    //         data[i + 2] = newColor === 'blue' ? 255 : 0; // Blue channel
    //     }
    // }
    let r, g, b;

    // Convert color names to RGB
    if (newColor === "black") {
      r = 0;
      g = 0;
      b = 0;
    } else if (newColor === "blue") {
      r = 0;
      g = 0;
      b = 255;
    } else if (newColor === "#23b3e8") {
      // RGB for light blue
      r = 83;
      g = 189;
      b = 235;
      // set color to the above rgb color
      // setColor('#23b3e8')
    } else {
      // Default to black if color not recognized
      r = 0;
      g = 0;
      b = 0;
    }

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] !== 0) {
        // Check if pixel is not fully transparent
        data[i] = r; // Red channel
        data[i + 1] = g; // Green channel
        data[i + 2] = b; // Blue channel
      }
    }

    // Put the modified image data back to the canvas
    ctx.putImageData(imageData, 0, 0);
  };

  // modal
  const [loader, setLoader] = useState(false);
  const [PrevModal, setPrevModal] = useState(false);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);
  const [DeleteSignatureId, setDeleteSignatureId] = useState(null);
  const DeleteSignature = async () => {
    setLoadingDeleteFile(true);
    //console.log(DeleteSignatureId);
    const postData = {
      user_signature_id: DeleteSignatureId,
    };
    try {
      const apiData = await post("user/DeleteSignature", postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation(false);
        setLoadingDeleteFile(false);
        refreshPrev();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const handleThicknessChange = (event) => {
    setThickness(event.target.value);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialBoxData, setInitialBoxData] = useState(false);
  useEffect(() => {
    console.log("SaveAsProfile");

    setInitialBoxData(SaveAsProfile);
  }, [SaveAsProfile]);
  
  return (
    <>
      <div>
        <Row>
          <Col sm={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ color: "grey" }}>{t("Draw Here")}</h4>

              <h5
                style={{ color: primary_color, cursor: "pointer" }}
                onClick={() => {
                  const canvas = sigCanvas.current.getCanvas();
                  const ctx = canvas.getContext("2d");
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  setLines([]); // Clear the lines state
                  // sigCanvas
                }}
              >
                {initialsBox ? t("Clear initials") : t("Clear Signature")}
              </h5>
            </div>
          </Col>
          {initialsBox ? (
            <>
              <Col sm="4" xs="3">
                {" "}
              </Col>{" "}
              <Col sm="4" xs="6">
                <div
                  style={{
                    border: "1px solid lightGray",
                    cursor: "crosshair",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "center",
                      position: "absolute",
                      bottom: 50,
                      left: "10%",
                      borderBottom: "2px solid lightGray",
                      width: "80%",
                    }}
                  ></div>
                  <SignatureCanvas
                    dotSize={2}
                    // minWidth={2}
                    maxWidth={thickness}
                    penColor={color}
                    canvasProps={{
                      width: window.innerWidth < 781 ? 95 : 143,
                      height: 160,
                      className: "sigCanvas",
                    }}
                    // ref={signatureRef}
                    ref={sigCanvas}

                    // onEnd={handleEnd}
                  />
                </div>
              </Col>
            </>
          ) : (
            <Col sm="12">
              <div
                style={{
                  border: "1px solid lightGray",
                  cursor: "crosshair",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    alignSelf: "center",
                    position: "absolute",
                    bottom: 50,
                    left: "10%",
                    borderBottom: "2px solid lightGrey",
                    width: "80%",
                  }}
                ></div>
                <SignatureCanvas
                  dotSize={2}
                  // minWidth={2}
                  maxWidth={thickness}
                  penColor={color}
                  canvasProps={{
                    width:
                      window.innerWidth < 781 ?  (window.innerWidth > 730?(window.innerWidth - 500):(window.innerWidth - 100)) : 440,
                    // width: window.innerWidth-100,

                    height: 160,
                    className: "sigCanvas",
                  }}
                  // ref={signatureRef}
                  ref={sigCanvas}

                  // onEnd={handleEnd}
                />
              </div>
            </Col>
          )}

          <Col sm="12">
            {profile === false ? (
              <>
                {initialsBox
                  ? lengthPrevInitial < 5 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="initials"
                          name="initials"
                          value={initialBoxData}
                          onChange={() => setInitialBoxData(!initialBoxData)}
                        />
                        <label
                          htmlFor="initials"
                          style={{ marginLeft: "10px", fontSize: "14px" }}
                        >
                          {t("Save as Profile Initials")}
                        </label>
                      </div>
                    )
                  : lengthPrevsign < 5 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="signature"
                          name="signature"
                          value={initialBoxData}
                          onChange={() => setInitialBoxData(!initialBoxData)}
                        />
                        <label
                          htmlFor="signature"
                          style={{ marginLeft: "10px", fontSize: "14px" }}
                        >
                          {t("Save as Profile Signature")}
                        </label>
                      </div>
                    )}
              </>
            ) : null}

            <div
              style={{
                display: "flex",
                flexDirection: window.innerWidth > 786 ? "row" : "column",

                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              {window.innerWidth > 781 ? (
                <CustomButton
                  padding={true}
                  size="sm"
                  type="submit"
                  color="primary"
                  block
                  disabled={loader}
                  onClick={handleSave}
                  style={{
                    maxWidth: "20%",
                    marginBlock: "2%",
                    boxShadow: "none",
                  }}
                  text={
                    <>
                      {loader ? <Spinner color="white" size="sm" /> : null}
                      <span
                        style={{ fontSize: "16px" }}
                        className="align-middle ms-25"
                      >
                        {" "}
                        {t("Done")}
                      </span>
                    </>
                  }
                />
              ) : null}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h5> {thickness}</h5>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={thickness}
                  onChange={handleThicknessChange}
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    width: "100px",
                  }}
                />
              </div>

              <div className="demo-inline-spacing mb-1">
                <span
                  onClick={() => handleColorChange("black")}
                  style={{
                    width: "40px",
                    height: "30px",
                    backgroundColor: "black",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border:
                      color === "black"
                        ? `1px solid ${primary_color} `
                        : "1px solid black",
                  }}
                >
                  {color === "black" && (
                    <Check size={20} style={{ color: "white" }} />
                  )}{" "}
                  {/* Add this to show the check icon */}
                </span>

                <span
                  onClick={() => handleColorChange("blue")}
                  style={{
                    width: "40px",
                    height: "30px",
                    backgroundColor: "blue",
                    border:
                      color === "blue"
                        ? `1px solid ${primary_color} `
                        : "1px solid blue",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {color === "blue" && (
                    <Check size={20} style={{ color: "white" }} />
                  )}{" "}
                  {/* Add this to show the check icon */}
                </span>
                <span
                  onClick={() => handleColorChange("#23b3e8")}
                  style={{
                    width: "40px",
                    height: "30px",
                    backgroundColor: "#53bdeb",
                    border:
                      color === "#23b3e8"
                        ? `1px solid ${primary_color} `
                        : "1px solid #53bdeb",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {color === "#23b3e8" && (
                    <Check size={20} style={{ color: "white" }} />
                  )}{" "}
                  {/* Add this to show the check icon */}
                </span>
              </div>
            </div>
          </Col>
          <Col sm="12">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5px",
              }}
            >
              <h5 style={{ lineHeight: 1.5 }}>
                {t("By selecting")} {initialsBox ? t("Inital") : t("Signature")}{" "}
                ,{t("I agree that the")}{" "}
                {initialsBox ? t("inital") : t("signature")}{" "}
                {t("will be the electronic representation of my")}{" "}
                {initialsBox ? t("inital") : t("signature")}
                {t(
                  "for all purposes when I use them on documents, including legally binding contracts."
                )}
              </h5>
            </div>
          </Col>
          {window.innerWidth < 781 ? (
            <Col
              sm="12"
              style={{
                display: "flex",
                justifyContent: "right",
              }}
            >
              <Button
                disabled={loader}
                size="sm"
                color="primary"
                style={{ boxShadow: "none", fontSize: "16px" }}
                onClick={handleSave}
              >
                {loader ? <Spinner color="light" size="sm" /> : null}
                <span className="align-middle ms-25">{t("Done")}</span>
              </Button>{" "}
            </Col>
          ) : null}
        </Row>
      </div>
      <Modal
        isOpen={PrevModal}
        toggle={() => setPrevModal(!PrevModal)}
        className="modal-dialog-centered modal-lg"
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setPrevModal(!PrevModal)}></ModalHeader> */}
        <ModalBody className="px-sm-4 pb-1">
          <Row>
            <Col
              sm="12"
              style={{
                marginBlock: "2%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h1 className="fw-bold" style={{ marginBottom: "30px" }}>
                {t("Select Previous Signature")}
              </h1>
              <X
                size={24}
                style={{ cursor: "pointer" }}
                onClick={() => setPrevModal(!PrevModal)}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDeleteFile}
        callBackFunc={DeleteSignature}
        text={t("Are you sure you want to delete this Signature?")}
        alertStatusDelete={"delete"}
      />
    </>
  );
};

export default DrawCanvas;
