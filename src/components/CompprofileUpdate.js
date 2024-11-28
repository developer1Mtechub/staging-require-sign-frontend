import { ArrowUp, X } from "react-feather";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../views/StylesheetPhoneNo.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { Form, Formik } from "formik";
import { BASE_URL, post, postFormData } from "../apis/api";
import toastAlert from "@components/toastAlert";
import * as Yup from "yup";
// ** Steps
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
  Spinner,
} from "reactstrap";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import CustomButton from "./ButtonCustom";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/navbar";
import ImageCropperModal from "./ImageCropperModal";
// ** Custom Components

const CompprofileUpdate = ({ company_profile ,user_id_log}) => {
  const [hexInput, setHexInput] = useState(company_profile?.primary_color||"#23b3e8");
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    company_admin_email: Yup.string()
      .nullable()
      .email("Invalid email")
      .required("Email is required"),
    company_email: Yup.string()
      .nullable()
      .email("Invalid email")
      .required("Company Email is required"),
    subdomain_name: Yup.string().nullable().matches(
      /^(?!-|_)[A-Za-z0-9-_]{1,61}(?<!-|_)$/,
      "Subdomain must be 1-63 characters long, may contain letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_), but cannot start or end with a hyphen or underscore."
    ),
  });
  const [value, setValue] = useState("");
  const [country, setCountry] = useState("US");
  const [isValid, setIsValid] = useState(true);
  const [color, setColor] = useState(company_profile?.primary_color||"#23b3e8");
  const [secondaryColor, setSecondaryColor] = useState(company_profile?.secondary_color||"#0e5fa4");
  const handlePhoneNumberChange = (value) => {
    setValue(value);
    if ((value = "")) {
    } else {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber) {
        setCountry(phoneNumber.country);
        // setIsValid(isPossiblePhoneNumber(value));  // Validate the phone number
      } else {
        setIsValid(false);
      }
    }
  };
  // const handleColorChange = (event) => {
  //   setColor(event.target.value);
  // };
   // Validate Hex format
   const isValidHex = (hex) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);

   // Validate RGB format
   const isValidRgb = (rgb) => {
     const regex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
     const result = rgb.match(regex);
     return result && result.every((val, index) => (index === 0 || (val >= 0 && val <= 255)));
   };
 
   // Convert RGB to Hex
   const rgbToHex = (rgb) => {
     const result = rgb
       .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
       .slice(1)
       .map((n) => parseInt(n).toString(16).padStart(2, "0"))
       .join("");
     return `#${result}`;
   };
  const handleColorChange = (e) => {
    const pickedColor = e.target.value;
    setColor(pickedColor); // Update the color input
    setHexInput(pickedColor); // Update the hex input
  };
    // Handler when hex value is entered manually
    const handleHexChange = (e) => {
      const enteredColor = e.target.value;
      setHexInput(enteredColor);
  
      // Check if entered value is a valid hex or rgb color
      if (isValidHex(enteredColor)) {
        setColor(enteredColor);
      } else if (isValidRgb(enteredColor)) {
        const hexFromRgb = rgbToHex(enteredColor);
        setColor(hexFromRgb);
        setHexInput(hexFromRgb); // Update to hex equivalent
      }
    };
  // const handleHexChange = (event) => {
  //   const hex = event.target.value;
  //   setHexInput(hex);
  //   if (/^#[0-9A-F]{6}$/i.test(hex)) {
  //     setColor(hex);
  //   }
  // };
  const handleSecondaryColorChange = (event) => {
    // setSecondaryColor(event.target.value);
    const pickedColor = e.target.value;
    setSecondaryColor(pickedColor); // Update the color input
    setSecondaryColorHex(pickedColor); // Update the hex input
  };
  const containerStyle = {
    border: "1px solid lightgray",
    borderRadius: "4px",
    height: "43px",
    width: "100%",
    padding: "5px 10px",
    boxShadow: "none",
  };

  const inputStyle = {
    border: "none",
    outline: "none",
    width: "100%",
  };
  const [secondaryColorHex, setSecondaryColorHex] = useState(company_profile?.secondary_color||"#0e5fa4");
  const handleSecondaryHexChange = (e) => {
    const enteredColor = e.target.value;
    setSecondaryColorHex(enteredColor);

    // Check if entered value is a valid hex or rgb color
    if (isValidHex(enteredColor)) {
      setSecondaryColor(enteredColor);
    } else if (isValidRgb(enteredColor)) {
      const hexFromRgb = rgbToHex(enteredColor);
      setSecondaryColor(hexFromRgb);
      setSecondaryColorHex(hexFromRgb); // Update to hex equivalent
    }

    // const hex = event.target.value;
    // setSecondaryColorHex(hex);
    // if (/^#[0-9A-F]{6}$/i.test(hex)) {
    //   setSecondaryColor(hex);
    // }
  };
  // Image Picker
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [branding, setBranding] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const toggleModal = () => setModalOpen1(!modalOpen1);
  const handleImageCropped = async (croppedFile) => {
    console.log("Cropped File:", croppedFile);
    setImageFile(croppedFile);
    if (croppedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        // setModalOpen1(true);
      };
      reader.readAsDataURL(croppedFile);
    }
    // const postData = {
    //   image: croppedFile,
    // };
    // const apiData = await postFormData(postData); // Specify the endpoint you want to call
    // if (apiData.path === null || apiData.path === undefined || apiData.path === '') {
    // } else {
    //   const url = apiData.path;
    //   setSelectedImage(url);

    // }
  };
  const handleImageChange = (e) => {
    // const file = e.target.files[0];
    const file = e

    setImageFile(file);
    setImageFileData(URL.createObjectURL(file));
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setModalOpen1(true);

    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };
  const handleBrandingChange = () => {
    console.log(branding)
    setBranding(!branding);
  };
  const [dataCompany, setDataComp] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  // const [initialValues, setInitialValues] = useState(null);
  const [imageFileData, setImageFileData] = useState(null);

  const getCompanyData1 = async () => {
    if (company_profile) {
    } else {
      console.log("ERROR");
    }
    // const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
    setCompanyId(company_profile?.company_id);
    // const postData1 = {
    //   company_id: items?.token?.company_id,
    // };
    // const apiData1 = await post('company/get_company', postData1);
    // console.log(apiData1);
    // console.log('apiData1');

    // let dataCompany = apiData1.data;
    // if (
    //   company_profile.branding === "true" ||
    //   company_profile.branding === true
    // ) {
      setBranding(company_profile?.branding);
    // }

    if (company_profile?.company_logo === null) {
      setImageFileData(null);
    } else {
      setImageFileData(company_profile?.company_logo);
    }

    // console.log(dataCompany);
    // console.log(`dataCompany`);

    setDataComp(company_profile);
    handlePhoneNumberChange(company_profile?.contact_no);
    setHexInput(company_profile?.primary_color);
    setColor(company_profile?.primary_color);
    setSecondaryColorHex(company_profile?.secondary_color);
    setSecondaryColor(company_profile?.secondary_color);
    // setInitialValues({
    //   name: dataCompany.company_name,
    //   company_email: dataCompany.company_email,
    //   company_admin_email: dataCompany.company_admin_email,
    //   website_link: dataCompany.website_link,
    //   phone_no: dataCompany.contact_no,
    //   address: dataCompany.address,
    //   subdomain_name: dataCompany.subdomain_name,
    //   primary_color: dataCompany.primary_color,
    //   secondary_color: dataCompany.secondary_color,
    // });
  };
  useEffect(() => {
    getCompanyData1();
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageChange(acceptedFiles[0]);
      }
    },
  });
  return (
    <>
    <ImageCropperModal
        cropSrc={imageFileData}
        isOpen={modalOpen1}
        toggle={toggleModal}
        onImageCropped={handleImageCropped}
      />
      <div>
        <Formik
          enableReinitialize
          initialValues={{
            name: dataCompany?.company_name,
            company_email: dataCompany?.company_email,
            company_admin_email: dataCompany?.company_admin_email,
            website_link: dataCompany?.website_link,
            phone_no: dataCompany?.contact_no,
            address: dataCompany?.address,
            subdomain_name: dataCompany?.subdomain_name,
            primary_color: dataCompany?.primary_color,
            secondary_color: dataCompany?.secondary_color,
            billingAddress: dataCompany?.billingAddress,

          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            // Call your API here
            //console.log(values);
            //console.log(companyId);
            setSubmitting(true);
            if (image === null) {
              //console.log('apiData.path');
              const postData2 = {
                company_name: values.name,
                company_id: companyId,
                company_email: values.company_email,
                website_link: values.website_link,
                contact_no: values.phone_no,
                address: values.address,
                company_admin_email: values.company_admin_email,
                branding: branding,
                // status: 'inactive',
                subdomain_name: values.subdomain_name,
                primary_color: color,
                secondary_color: secondaryColor,
              };
              const apiData2 = await post("company/update_company", postData2); // Specify the endpoint you want to call
              //console.log('apixxsData');
              // const tokenData = JSON.parse(
              //   localStorage.getItem("token") || "{}"
              // );
              // tokenData.company_name = values.name;
              // // tokenData.logo = file_url;
              // tokenData.primary_color = color;
              // tokenData.secondary_color = secondaryColor;
              //console.log(apiData2);
              if (apiData2.error) {
                toastAlert("error", "Something went wrong");
                //console.log('error', apiData2.errorMessage);
                setSubmitting(false);
              } else {
                toastAlert("success", "Company Profile Updated Successfully");
                // toggleFunc();
                setSubmitting(false);
                dispatch(
                  getUser({
                    user_id: user_id_log,
                  })
                );
                // setTimeout(() => {
                //   setSubmitting(false);
                //   window.location.href = '/company';
                // }, 1000);
                // setShow(true)
              }
              // if pushed
            } else {
              const postData = {
                image: imageFile,
                user_id:user_id_log
              };
              try {
                const apiData = await postFormData(postData); // Specify the endpoint you want to call
                //console.log(apiData);
                if (
                  apiData.public_url === null ||
                  apiData.public_url === undefined ||
                  apiData.public_url === ""
                ) {
                  //console.log('Error uploading Files');
                  toastAlert("error", "Error uploading File");
                } else {
                  //console.log('apiData.public_url');

                  //console.log(apiData.public_url);
                  let file_url = apiData.public_url;
                  const postData2 = {
                    company_name: values.name,
                    company_id: companyId,
                    company_email: values.company_email,
                    website_link: values.website_link,
                    contact_no: values.phone_no,
                    address: values.address,
                    company_admin_email: values.company_admin_email,
                    branding: branding,
                    // status: 'inactive',
                    subdomain_name: values.subdomain_name,
                    primary_color: color,
                    secondary_color: secondaryColor,
                    company_logo: file_url,
                  };
                  const apiData2 = await post(
                    "company/update_company",
                    postData2
                  ); // Specify the endpoint you want to call
                  //console.log('apixxsData');

                  //console.log(apiData2);
                  if (apiData2.error) {
                    toastAlert("error", "Something went wrong");
                    //console.log('error', apiData2.errorMessage);
                    setSubmitting(false);
                  } else {
                    // toggleFunc();
                    toastAlert(
                      "success",
                      "Company Profile Updated Successfully"
                    );
                    setTimeout(() => {
                      setSubmitting(false);
                      // const tokenData = JSON.parse(
                      //   localStorage.getItem("token") || "{}"
                      // );
                      // tokenData.company_name = values.name;
                      // tokenData.logo = file_url;
                      // tokenData.primary_color = color;
                      // tokenData.secondary_color = secondaryColor;

                      //   setSubmitting(false);
                      window.location.reload();
                    }, 1000);
                    // setShow(true)
                  }
                  // if pushed
                }
              } catch (error) {
                setSubmitting(false);
                toastAlert("error", "Something went wrong");

                console.error("Error uploading file:", error);
              }
            }
          }}
        >
          {({
            getFieldProps,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
          }) => (
            <>
              <Form className="auth-login-form mt-2">
                <Row>
                  <Col md="1"></Col>

                  <Col md="10">
                    <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                        Company Logo (Resolution 300x100px, Formats PNG (preffered) or JPEG)
                      </Label>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {imageFileData === null ? (
                          <>
                            {/* <div className="image-picker">
                            <input
                              type="file"
                              // accept="image/*"
                              // ACCEPT IMAGE FORMAT PNG
                              accept="image/*"
                              id="fileInput"
                              onChange={handleImageChange}
                            />
                            <label htmlFor="fileInput">
                              <div className="box_picker d-flex align-items-center justify-content-center flex-column">
                                <span
                                  style={{
                                    padding: '2%',
                                    borderRadius: '100px',
                                    border: '2px solid lightGrey',
                                  }}>
                                  <ArrowUp size={40} color="#23b3e8" />
                                </span>
                                <h2
                                  style={{
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    marginTop: '5%',
                                    color: 'grey',
                                  }}>
                                  Click or drop file to upload
                                </h2>
                              </div>
                            </label>
                          </div> */}
                            <div className="image-picker">
                            <div
            {...getRootProps()}
            style={{
              border: "2px dashed lightGrey",
              borderRadius: "10px",
              // padding: "20px",
              padding: "60px",
              width:"500px",
              height:"200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
                              {/* <input
                                type="file"
                                accept="image/*"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                              /> */}
                              <label htmlFor="fileInput">
                                <div className=" d-flex align-items-center justify-content-center flex-column">
                                  <span
                                    style={{
                                      padding: "6%",
                                      borderRadius: "100px",
                                      border: "2px solid lightGrey",
                                    }}
                                  >
                                    <ArrowUp size={40} color="#23b3e8" />
                                  </span>
                                  <h2
                                    style={{
                                      fontSize: "16px",
                                      textAlign: "center",
                                      marginTop: "5%",
                                      color: "grey",
                                    }}
                                  >
                                    Click or drop file to upload
                                  </h2>
                                </div>
                              </label>
                            </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems:"center",
                                justifyContent: "center",
                              }}
                            >
                              {image === null ? (
                                <div
                                  className="image_box2"
                                  // style={{ position: "relative" }}
                                  //  onClick={handleReplaceImage}
                                  style={{ 
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%", // Adjust as needed
                                    height: "100%", // Adjust as needed
                                  }}
                                >
                                  <img
                                    src={imageFileData}
                                    alt="Selected"
                                    // height="100%"
                                    style={{ width: '200px', height: '50px' ,objectFit:"contain"}}
                                    // onClick={() => document.getElementById('fileInput').click()}
                                  />
                                  <X
                                    size={20}
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "10px",
                                    
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setImageFile(null);
                                      setImageFileData(null);
                                      setImage(null);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="image_box2"
                                  style={{ 
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%", // Adjust as needed
                                    height: "100%", // Adjust as needed
                                  }}
                                  //  onClick={handleReplaceImage}
                                >
                                  
                                  <img
                                    src={image}
                                    alt="Selected"
                                    style={{ width: '200px', height: '50px' ,objectFit:"contain"}}
                                    // onClick={() => document.getElementById('fileInput').click()}
                                  />
                                  <X
                                    size={20}
                                    style={{
                                      position: "absolute",
                                      top: "0",
                                      right: "0",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setImageFile(null);
                                      setImageFileData(null);

                                      setImage(null);
                                    }}
                                  />
                                </div>
                              )}

                              {/* <h4 style={{textAlign: 'center', marginTop: '10px'}}>Click to Replace Image</h4> */}
                            </div>{" "}
                          </>
                        )}

                        {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
                        {/* {image && } */}
                      </div>
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                        Name
                      </Label>
                      <Input
                        style={{
                          marginBottom: "10px",
                          fontSize: "16px",
                          boxShadow: "none",
                        }}
                        className={`form-control ${
                          touched.name && errors.name ? "is-invalid" : ""
                        }`}
                        {...getFieldProps("name")}
                        id="name"
                        placeholder="Enter Company Name"
                      />
                      {touched.name && errors.name ? (
                        <div className="invalid-feedback">{errors.name}</div>
                      ) : null}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                        Email<span style={{ color: "red" }}> *</span>
                      </Label>

                      <Input
                        style={{
                          marginBottom: "10px",
                          fontSize: "16px",
                          boxShadow: "none",
                        }}
                        className={`form-control ${
                          touched.company_email && errors.company_email
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("company_email")}
                        id="company_email"
                        placeholder="Enter Company Email"
                      />
                      {touched.company_email && errors.company_email ? (
                        <div className="invalid-feedback">
                          {errors.company_email}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                        Company Admin Email
                        <span style={{ color: "red" }}> *</span>
                      </Label>

                      <Input
                        disabled
                        // onChange={handleCompanyEmailChange}
                        style={{
                          marginBottom: "10px",
                          fontSize: "16px",
                          boxShadow: "none",
                        }}
                        className={`form-control ${
                          touched.company_admin_email &&
                          errors.company_admin_email
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("company_admin_email")}
                        id="company_admin_email"
                        placeholder="Enter Company Admin Email"
                      />
                      {touched.company_admin_email &&
                      errors.company_admin_email ? (
                        <div className="invalid-feedback">
                          {errors.company_admin_email}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                        Company Website
                      </Label>

                      <Input
                        // onChange={handleCompanyEmailChange}
                        style={{
                          marginBottom: "10px",
                          fontSize: "16px",
                          boxShadow: "none",
                        }}
                        className={`form-control ${
                          touched.website_link && errors.website_link
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("website_link")}
                        id="website_link"
                        placeholder="Enter Company Website"
                      />
                      {touched.website_link && errors.website_link ? (
                        <div className="invalid-feedback">
                          {errors.website_link}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                        Street Address
                      </Label>
                      <Input
                        style={{
                          marginBottom: "10px",
                          fontSize: "16px",
                          boxShadow: "none",
                        }}
                        className={`form-control ${
                          touched.address && errors.address ? "is-invalid" : ""
                        }`}
                        {...getFieldProps("address")}
                        id="address"
                        type="text"
                        placeholder="Enter Address"
                      />
                      {touched.address && errors.address ? (
                        <div className="invalid-feedback">{errors.address}</div>
                      ) : null}
                    </div>

                    <div className="d-flex justify-content-left align-items-center mb-1">
                      <Input
                        {...getFieldProps("billingAddress")}
                        type="checkbox"
                        id="remember-me"
                        // checked={values.billingAddress}
                        // onChange={() => {
                        //   setFieldValue('billingAddress', !values.billingAddress);
                        // }}
                      />

                      <Label
                        style={{
                          marginLeft: "10px",
                          paddingTop: "2px",
                          fontSize: "13px",
                        }}
                        className="form-label"
                        for="remember-me"
                      >
                        Same as Billing Address
                      </Label>
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                        Phone Number
                      </Label>
                      <div
                        style={containerStyle}
                        className="phone-input-container"
                      >
                        <PhoneInput
                          defaultCountry="US"
                          international
                          value={value}
                          onChange={handlePhoneNumberChange}
                          style={inputStyle}
                          className="input-phone-number"
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                        <Label className="form-label" for="register-lastname">
                          Branding
                        </Label>
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            value={branding}
                            checked={branding}
                            onChange={handleBrandingChange}
                            name="customSwitch"
                            id="exampleCustomSwitch"
                          />
                        </div>
                    </div>
                    {branding ? (
                      <>
                        {" "}
                        <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                      Subdomain (e.g., yourcompany, without .com, .net, etc.)
                      </Label>
                        <Input
                          style={{
                            marginBottom: "10px",
                            fontSize: "16px",
                            boxShadow: "none",
                          }}
                          className={`form-control ${
                            touched.subdomain_name && errors.subdomain_name
                              ? "is-invalid"
                              : ""
                          }`}
                          {...getFieldProps("subdomain_name")}
                          id="subdomain_name"
                          placeholder="Enter Subdomain Name"
                        />
                        {touched.subdomain_name && errors.subdomain_name ? (
                          <div className="invalid-feedback">
                            {errors.subdomain_name}
                          </div>
                        ) : null}
                        </div>
                        <Row>
                          <Col xs={6}>
                          <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                      Primary Color
                      </Label>
                            <div style={{ display: "flex" }}>
                              <input
                                type="color"
                                style={{
                                  marginBottom: "10px",
                                  fontSize: "16px",
                                  boxShadow: "none",
                                  width: "70px",
                                  height: "50px",
                                }}
                                className={`form-control `}
                                value={color}
                                onChange={handleColorChange}
                                placeholder="Enter Subdomain Primary Color"
                              />
                              <input
                                type="text"
                                style={{
                                  marginBottom: "10px",
                                  fontSize: "16px",
                                  boxShadow: "none",
                                }}
                                className={`form-control `}
                                value={hexInput}
                                onChange={handleHexChange}
                                placeholder="Enter Hex or RGB"
                              />
                            </div>
                            </div>

                           
                          </Col>
                          <Col xs={6}>
                          <div className="mb-1">
                      <Label className="form-label" for="register-lastname">
                      Secondary Color
                      </Label>
                          
                            <div style={{ display: "flex" }}>
                              <input
                                type="color"
                                style={{
                                  marginBottom: "10px",
                                  fontSize: "16px",
                                  boxShadow: "none",
                                  width: "70px",
                                  height: "50px",
                                }}
                                className={`form-control ${
                                  touched.subdomain_secondary_color &&
                                  errors.subdomain_secondary_color
                                    ? "is-invalid"
                                    : ""
                                }`}
                                value={secondaryColorHex}
                                onChange={handleSecondaryHexChange}
                                placeholder="Enter Subdomain Secondary Color"
                              />
                              <input
                                type="text"
                                style={{
                                  marginBottom: "10px",
                                  fontSize: "16px",
                                  boxShadow: "none",
                                }}
                                className={`form-control ${
                                  touched.subdomain_secondary_color &&
                                  errors.subdomain_secondary_color
                                    ? "is-invalid"
                                    : ""
                                }`}
                                value={secondaryColorHex}
                                onChange={handleSecondaryHexChange}
                                placeholder="Enter Hex or RGB"
                              />{" "}
                            </div>
                            {touched.subdomain_secondary_color &&
                            errors.subdomain_secondary_color ? (
                              <div className="invalid-feedback">
                                {errors.subdomain_secondary_color}
                              </div>
                            ) : null}
                            </div>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <></>
                    )}
                  </Col>
                  <Col md="6"></Col>
                </Row>

                <div className="d-flex justify-content-center">
                  <CustomButton
                    padding={true}
                    size="sm"
                    type="submit"
                    color="primary"
                    block
                    disabled={isSubmitting}
                    text={
                      <>
                        {isSubmitting ? (
                          <Spinner color="white" size="sm" />
                        ) : null}
                        <span
                          style={{ fontSize: "16px" }}
                          className="align-middle ms-25"
                        >
                          {" "}
                          Save
                        </span>
                      </>
                    }
                    style={{
                      maxWidth: "20%",
                      marginBlock: "2%",
                      boxShadow: "none",
                    }}
                  />
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};
export default CompprofileUpdate;
