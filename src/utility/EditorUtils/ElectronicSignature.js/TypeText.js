import { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { BASE_URL, post, postFormData } from "../../../apis/api";
import html2canvas from "html2canvas";
import { Check } from "react-feather";
import toastAlert from "@components/toastAlert";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { base64toFile } from "../../Utils";
import getActivityLogUser from "../../IpLocation/MaintainActivityLogUser";
import CustomButton from "../../../components/ButtonCustom";
import { selectPrimaryColor } from "../../../redux/navbar";
const TypeText = ({
  user_id_user,
  user_email,
  user_first_name,
  user_last_name,
  lengthPrevsign,
  lengthPrevInitial,
  initialsBox,
  profile,
  onSaveText,
  PrevSignatureArray,
}) => {
  const [text, setText] = useState(initialsBox ? "Initials" : "Signature");
  const [selectedFont, setSelectedFont] = useState("Brush Script MT");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };
  const { t } = useTranslation();

  const [initialBoxData, setInitialBoxData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };
  const [loaderButtonSave, setLoaderButtonSave] = useState(false);
  const primary_color = useSelector(selectPrimaryColor);

  // fonts
  const [FontsArray, setFontsArray] = useState([
    "Brush Script MT",
    "Edwardian Script ITC",
    '"Lobster", sans-serif',
    '"Playwrite ES", cursive',
    '"Great Vibes", cursive',
    '"Dancing Script", cursive',
    '"Allura", cursive',
    '"Pacifico", cursive',
  ]);
  // input as text

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(
    initialsBox ? "Initials" : "Signature"
  );

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };
  // start
  //  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(30);

  const previewRef = useRef(null);

  // const generateImage = () => {
  //   setLoaderButtonSave(true);
  //   html2canvas(previewRef.current).then(canvas => {
  //     const imgData = canvas.toDataURL('image/png');
  //     onSaveText(imgData, null);
  //     setLoaderButtonSave(false);
  //     //   const link = document.createElement("a");
  //     //   link.href = imgData;
  //     //   link.download = "generated-image.png";
  //     //   link.click();
  //   });
  // };
  const generateImage = () => {
    setLoaderButtonSave(true);
    setTimeout(() => {
      // Temporarily set the background color to transparent
      const originalBackgroundColor = previewRef.current.style.backgroundColor;
      previewRef.current.style.backgroundColor = "transparent";
      const originalFontSize = previewRef.current.style.fontSize;
      // previewRef.current.style.fontSize = "60px"; // Set a larger font size
      previewRef.current.style.fontSize = initialsBox?"150px":"60px"; // Set a larger font size

      const lineHeightAdjustment = selectedFont.includes("Script") ? 1.4 : 1.4;
      previewRef.current.style.lineHeight = `${lineHeightAdjustment}em`;

      html2canvas(previewRef.current, {
        // fontSize: 100,
        backgroundColor: null, // Ensures the canvas has a transparent background
      }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        console.log("imgData");

        console.log(imgData);
        if (initialBoxData) {
          console.log("dataURL");
          console.log(imgData);
          const filename = "image.png";
          const fileObject = base64toFile(imgData, filename);
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
            //console.log(items?.token?.user_id);
            const user_id = user_id_user;
            const ImageUrl = apiData.public_url;
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
            onSaveText(imgData, null);
          }
        } else {
          onSaveText(imgData, null);
        }
        setLoaderButtonSave(false);

        // Restore the original background color
        previewRef.current.style.backgroundColor = originalBackgroundColor;
        previewRef.current.style.fontSize = originalFontSize; // Set a larger font size
      });
    }, 0);
  };

  useEffect(() => {
    console.log("initialsBox");
    console.log(initialsBox);
    if (
      user_first_name &&
      user_first_name !== "null" &&
      user_first_name !== undefined
    ) {
      if (initialsBox) {
        // Set text and inputValue to initials
        const firstInitial = user_first_name[0].toUpperCase();
        // Extract the first letter of the last name and capitalize it
        const lastInitial = user_last_name[0].toUpperCase();
        // Combine the initials
        const initials = `${firstInitial}${lastInitial} `;
        setText(initials);
        setInputValue(initials);
      } else {
        setText(`${user_first_name} ${user_last_name} `);
        setInputValue(`${user_first_name} ${user_last_name}`);
      }
    }
  }, []);
  return (
    <>
      <div className="d-flex flex-column">
        <Row>
          <Col sm={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ color: "grey" }}>{t("Type Here")}</h4>
              {text === "Signature" || text === "Initials" ? null : (
                <h5
                  style={{ color: primary_color, cursor: "pointer" }}
                  onClick={() => {
                    setText(initialsBox ? "Initials" : "Signature");
                    setInputValue(initialsBox ? "Initials" : "Signature");
                    setSelectedFont("Brush Script MT");
                    setSelectedColor("#000");
                  }}
                >
                  {initialsBox ? t("Clear Initial") : t("Clear Signature")}
                </h5>
              )}
            </div>
          </Col>
          <Col sm={12}>
            <Row>
              <Col sm="12">
                {isEditing ? (
                  <Input
                    autoFocus
                    style={{
                      maxWidth: "100%",
                      width: "100%",
                      padding: "5px 5px 5px 30px",
                      boxShadow: "none",
                      marginBottom: "3%",
                      textAlign: "center",
                      borderRadius: "5px",
                      border: "1px solid #2293fb",
                      // fontFamily: selectedFont,
                      fontSize: "20px",
                      // color: selectedColor
                    }}
                    placeholder={initialsBox ? t("Initials") : t("Signature")}
                    value={
                      inputValue === "Signature" || inputValue === "Initials"
                        ? ""
                        : inputValue
                    }
                    onChange={(e) => {
                      const { value } = e.target;
                  
                      // Common validation for both initials and signatures
                      const characterLimit = initialsBox ? 5 : 50; // Max length for initials is 5, for signatures is 50
                      const validCharacterRegex = /^[A-Za-z .'-]*$/; // Allows alphabets, spaces, dots, apostrophes, and hyphens
                  
                      // Prevent invalid characters
                      if (value.length <= characterLimit && validCharacterRegex.test(value)) {
                        handleChange(e); // Proceed only if value is valid
                      }
                    }}
                    onBlur={handleBlur}
                    // maxLength={20}
                    maxLength={initialsBox ? 5 : 20}
                  />
                ) : (
                  <p
                    onClick={handleClick}
                    style={{
                      borderBottom: "1px solid #2293fb",
                      padding: "11px 5px 11px 30px",
                      width: "100%",
                      textAlign: "center",
                      // borderRadius: '5px',
                      // fontFamily: selectedFont,
                      fontSize: "20px",
                      // maxWidth: '100px', // limit the width of the text
                      overflow: 'hidden', // hide the overflow
                      textOverflow: 'ellipsis', // add an ellipsis when the text overflows
                      whiteSpace: 'nowrap',
                      // borderBottom: '1px solid lightGray'
                    }}
                  >
                    {inputValue}
                  </p>
                )}
              </Col>
              {window.innerWidth < 781 ? (
                 <Col sm="12">
                 <div
                   ref={previewRef}
                   style={{
                     display: "flex",
                     justifyContent: "center",
                     // border: '1px solid #f0f0f0',
                     fontFamily: selectedFont,
                     background: "transparent",
                     width: "auto",
                     height: "auto",
                     fontSize,
                     color: selectedColor,
                     // lineHeight: height + "px",
                     whiteSpace: "nowrap",
                     overflow: "hidden",
                     padding: "20px", // Consistent padding for all sides
                     lineHeight: "1.2em",
                     // padding: "20 20px", // Add left and right padding
                   }}
                 >
                   {text}
                 </div>
               </Col>
              ) : (
                <Col sm="12">
                  <div
                    ref={previewRef}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      // border: '1px solid #f0f0f0',
                      fontFamily: selectedFont,
                      background: "transparent",
                      width: "auto",
                      height: "auto",
                      fontSize,
                      color: selectedColor,
                      // lineHeight: height + "px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      padding: "20px", // Consistent padding for all sides
                      lineHeight: "1.2em",
                      // padding: "20 20px", // Add left and right padding
                    }}
                  >
                    {text}
                  </div>
                </Col>
              )}
            </Row>
          </Col>
          {window.innerWidth < 781 ?  <Col sm={12} md={12}>
              <Row>
                {FontsArray.map((font, index) => (
                  <Col sm={12}>
                    <div className="flexWidth ">
                      <FormGroup
                        check
                        inline
                        // style={{
                        //   // maxWidth: '200px',
                        //   display: 'flex',
                        //   justifyContent: 'left',
                        //   alignItems: 'center',
                        // }}
                      >
                        <Row>
                          <Col
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Input
                              id={`fontCheckbox-${index}`}
                              style={{
                                marginInline: "10px",
                              }}
                              type="checkbox"
                              checked={selectedFont === font}
                              onChange={handleFontChange}
                              value={font}
                            />
                            <Label
                              check
                              htmlFor={`fontCheckbox-${index}`}
                              // onClick={handleFontChange}
                              style={{
                                fontFamily: font,
                                // color: selectedColor,
                                fontSize: "23px",

                                maxWidth: '100px', // limit the width of the text
                                overflow: 'hidden', // hide the overflow
                                textOverflow: 'ellipsis', // add an ellipsis when the text overflows
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {text === "Signature" ||
                              text === "Initials" ||
                              text === ""
                                ? initialsBox
                                  ? t("Initials")
                                  : t("Signature")
                                : text}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col> : (
            <Col sm={12} md={12}>
              <Row>
                {FontsArray.map((font, index) => (
                  <Col sm={6}>
                    <div className="flexWidth ">
                      <FormGroup
                        check
                        inline
                        // style={{
                        //   // maxWidth: '200px',
                        //   display: 'flex',
                        //   justifyContent: 'left',
                        //   alignItems: 'center',
                        // }}
                      >
                        <Row>
                          <Col
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Input
                              id={`fontCheckbox-${index}`}
                              style={{
                                marginInline: "10px",
                              }}
                              type="checkbox"
                              checked={selectedFont === font}
                              onChange={handleFontChange}
                              value={font}
                            />
                            <Label
                              check
                              htmlFor={`fontCheckbox-${index}`}
                              // onClick={handleFontChange}
                              style={{
                                fontFamily: font,
                                // color: selectedColor,
                                fontSize: "23px",

                                maxWidth: '100px', // limit the width of the text
                                overflow: 'hidden', // hide the overflow
                                textOverflow: 'ellipsis', // add an ellipsis when the text overflows
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {text === "Signature" ||
                              text === "Initials" ||
                              text === ""
                                ? initialsBox
                                  ? t("Initials")
                                  : t("Signature")
                                : text}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          )}
          

          {window.innerWidth < 781 ? ( <>
              <Col xs={12}>
                {profile === false ? (
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
                      id="initialsr"
                      name="initialsr"
                      value="initials"
                      onChange={() => setInitialBoxData(!initialBoxData)}
                    />
                    <label
                      htmlFor="initialsr"
                      style={{ marginLeft: "10px", fontSize: "14px" }}
                    >
                      {t("Save as Profile")}{" "}
                      {initialsBox ? t("Initials") : t("Signature")}
                    </label>
                  </div>
                ) : null}
              </Col>
              <Col
                sm={12}
                style={{
                  display: "flex",
                  flexDirection:"column",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                {/* <div style={{display:"flex",justifyContent:"right"}}>
                 <CustomButton
                  padding={true}
                  size="sm"
                  type="submit"
                  color="primary"
                  block
                  disabled={loaderButtonSave}
                  onClick={generateImage}
                  style={{
                    maxWidth: "50%",
                    marginBlock: "2%",
                    boxShadow: "none",
                  }}
                  text={
                    <>
                      {loaderButtonSave ? (
                        <Spinner color="white" size="sm" />
                      ) : null}
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
                </div> */}
               

                <div className="demo-inline-spacing mb-1 d-flex justify-content-around">
                  <span
                    onClick={() => handleColorChange("#000000")}
                    style={{
                      width: "40px",
                      height: "30px",
                      backgroundColor: "#000000",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border:
                        selectedColor === "#000000"
                          ? `1px solid ${primary_color}`
                          : "1px solid #000000",
                    }}
                  >
                    {selectedColor === "#000000" && (
                      <Check size={20} style={{ color: "white" }} />
                    )}{" "}
                    {/* Add this to show the check icon */}
                  </span>

                  <span
                    onClick={() => handleColorChange("#00008B")}
                    style={{
                      width: "40px",
                      height: "30px",
                      backgroundColor: "#00008B",
                      border:
                        selectedColor === "#00008B"
                          ? `1px solid ${primary_color}`
                          : "1px solid #00008B",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedColor === "#00008B" && (
                      <Check size={20} style={{ color: "white" }} />
                    )}{" "}
                    {/* Add this to show the check icon */}
                  </span>
                  <span
                    onClick={() => handleColorChange("#53bdeb")}
                    style={{
                      width: "40px",
                      height: "30px",
                      backgroundColor: "#53bdeb",
                      border:
                        selectedColor === "#53bdeb"
                          ? `1px solid ${primary_color}`
                          : "1px solid #53bdeb",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedColor === "#53bdeb" && (
                      <Check size={20} style={{ color: "white" }} />
                    )}{" "}
                    {/* Add this to show the check icon */}
                  </span>
                </div>
              </Col>
            </>) : (
            <>
              <Col xs={12}>
                {profile === false ? (
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
                      id="initialsr"
                      name="initialsr"
                      value="initials"
                      onChange={() => setInitialBoxData(!initialBoxData)}
                    />
                    <label
                      htmlFor="initialsr"
                      style={{ marginLeft: "10px", fontSize: "14px" }}
                    >
                      {t("Save as Profile")}{" "}
                      {initialsBox ? t("Initials") : t("Signature")}
                    </label>
                  </div>
                ) : null}
              </Col>
              <Col
                sm={12}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <CustomButton
                  padding={true}
                  size="sm"
                  type="submit"
                  color="primary"
                  block
                  disabled={loaderButtonSave}
                  onClick={generateImage}
                  style={{
                    maxWidth: "20%",
                    marginBlock: "2%",
                    boxShadow: "none",
                  }}
                  text={
                    <>
                      {loaderButtonSave ? (
                        <Spinner color="white" size="sm" />
                      ) : null}
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

                <div className="demo-inline-spacing mb-1">
                  <span
                    onClick={() => handleColorChange("#000000")}
                    style={{
                      width: "40px",
                      height: "30px",
                      backgroundColor: "#000000",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border:
                        selectedColor === "#000000"
                          ? `1px solid ${primary_color}`
                          : "1px solid #000000",
                    }}
                  >
                    {selectedColor === "#000000" && (
                      <Check size={20} style={{ color: "white" }} />
                    )}{" "}
                    {/* Add this to show the check icon */}
                  </span>

                  <span
                    onClick={() => handleColorChange("#00008B")}
                    style={{
                      width: "40px",
                      height: "30px",
                      backgroundColor: "#00008B",
                      border:
                        selectedColor === "#00008B"
                          ? `1px solid ${primary_color}`
                          : "1px solid #00008B",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedColor === "#00008B" && (
                      <Check size={20} style={{ color: "white" }} />
                    )}{" "}
                    {/* Add this to show the check icon */}
                  </span>
                  <span
                    onClick={() => handleColorChange("#53bdeb")}
                    style={{
                      width: "40px",
                      height: "30px",
                      backgroundColor: "#53bdeb",
                      border:
                        selectedColor === "#53bdeb"
                          ? `1px solid ${primary_color}`
                          : "1px solid #53bdeb",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedColor === "#53bdeb" && (
                      <Check size={20} style={{ color: "white" }} />
                    )}{" "}
                    {/* Add this to show the check icon */}
                  </span>
                </div>
              </Col>
            </>
          )}

          <Col
            sm={12}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <h5 style={{ lineHeight: 1.5 }}>
              {t("By selecting")} {initialsBox ? t("Inital") : t("Signature")} ,
              {t("I agree that the")}{" "}
              {initialsBox ? t("inital") : t("signature")}{" "}
              {t("will be the electronic representation of my")}{" "}
              {initialsBox ? t("inital") : t("signature")}
              {t(
                "for all purposes when I use them on documents, including legally binding contracts."
              )}
            </h5>
          </Col>
          {window.innerWidth < 781 ? (
            <Col
              xs={12}
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: "10px",
              }}
            >
              <Button
                size="sm"
                disabled={loaderButtonSave}
                style={{
                  boxShadow: "none",
                  fontSize: "16px",
                  height: "35px",
                  // width:"25%"
                }}
                color="primary"
                onClick={generateImage}
              >
                {loaderButtonSave ? <Spinner size="sm" color="light" /> : null}
                <span className="align-middle ms-25">{t("Done")} </span>
              </Button>
            </Col>
          ) : null}
        </Row>
      </div>
    </>
  );
};

export default TypeText;
