import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Modal,
  ModalBody,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
  UncontrolledTooltip,
} from "reactstrap";
import emptyImage from "@assets/images/pages/empty.png";
import { useDropzone } from "react-dropzone";

import ReactCountryFlag from "react-country-flag";

import { BASE_URL, post, postFormData, postHeaders, put } from "../apis/api";
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/bootstrap.css';
// import './StylesheetPhoneNo.css';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./StylesheetPhoneNo.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import toastAlert from "@components/toastAlert";
// import Avatar from '@components/avatar';
import image_dummy from "@assets/images/pages/images.jpg";
import {
  ArrowUp,
  AtSign,
  Check,
  Columns,
  Edit,
  Edit2,
  Globe,
  Grid,
  Image,
  Lock,
  PlusCircle,
  Trash2,
  User,
  Users,
  X,
} from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";
import CompanyUsers from "./CompanyUsers";
import CompprofileUpdate from "../components/CompprofileUpdate";
import { getUser, selectPrimaryColor } from "../redux/navbar";
import { useDispatch } from "react-redux";
import CustomButton from "../components/ButtonCustom";
import SpinnerCustom from "../components/SpinnerCustom";
import ImageCropperModal from "../components/ImageCropperModal";
import { useTranslation } from "react-i18next";
import SignatureModalContentProfile from "../utility/EditorUtils/SignatureModalContentProfile";

import { useSelector } from "react-redux";
import { decrypt } from "../utility/auth-token";
import FreeTrialAlert from "../components/FreeTrailAlert";
const MyAccount = () => {
  const dispatch = useDispatch();
  const languages = [
    { name: "English", code: "en", countryCodes: ["us", "gb"] },
    { name: "French", code: "fr", countryCode: "fr" },
    { name: "German", code: "de", countryCode: "de" },
    { name: "Portuguese", code: "pt", countryCode: "br" },
    { name: "Spanish", code: "es", countryCode: "es" },
  ];
  const primary_color = useSelector(selectPrimaryColor);

  const { t } = useTranslation();
  const {
    user,
    subscription,
    isSubscripitonActive,
    isFreeTrialExpired,
    daysLeftExpiredfreePlan,
    plan,
    status,
    error,
    company_profile,
    company_admin,
  } = useSelector((state) => state.navbar);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguageName") || "English"
  );
  // Extract the primary_color value or use a default color
  // const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [country, setCountry] = useState("US");
  const [isValid, setIsValid] = useState(true);

  const containerStyle = {
    border: "1px solid lightgray",
    borderRadius: "4px",
    // height: "43px",
    width: "100%",
    // padding: "5px 10px",
    boxShadow: "none",
  };

  const inputStyle = {
    border: "none",
    outline: "none",
    width: "100%",
  };
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
  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .nullable()
      .matches(
        /^[a-zA-Z-'’\s]+$/,
        "First Name should contain only alphabets, hyphens, and spaces"
      )
      .min(2, "First Name must be at least 2 characters")
      .max(50, "First Name cannot exceed 50 characters")
      .required("First Name is required"),

    lastname: Yup.string()
      .nullable()
      .matches(
        /^[a-zA-Z-'’\s]+$/,
        "Last Name should contain only alphabets, hyphens, and spaces"
      )
      .min(2, "Last Name must be at least 2 characters")
      .max(50, "Last Name cannot exceed 50 characters")
      .required("Last Name is required"),
  });

  const validationSchema1 = Yup.object().shape({
    old_password: Yup.string().nullable().required("Password is required"),

    password: Yup.string()
      .nullable()
      .required("Password is required")
      .test("password-strength", "", function (value) {
        const password = value || "";
        const errors = [];
        if (password.length < 8)
          errors.push("Password must be at least 8 characters long");
        if (!/[0-9]/.test(password)) errors.push("Password requires a number");
        if (!/[a-z]/.test(password))
          errors.push("Password requires a lowercase letter");
        if (!/[A-Z]/.test(password))
          errors.push("Password requires an uppercase letter");
        if (!/[^\w]/.test(password)) errors.push("Password requires a symbol");
        return (
          errors.length === 0 ||
          this.createError({ message: errors.join(", ") })
        );
      }),
    confirm_password: Yup.string()
      .nullable()
      .required("Please Confirm your Password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Profile");
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const handleItemClick = (item, id) => {
    toggle(id);
    setSelectedItem(item);
  };
  const [userDetailsCurrent, setUserDetailsCutrrent] = useState(null);

  const [profileSignature, setprofileSignature] = useState("");
  const [SignatureModal, setSignatureModal] = useState(false);
  const [active, setActive] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact_no, setContactNo] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  // const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [itemDeleteConfirmation1, setItemDeleteConfirmation1] = useState(false);

  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);
  const [DeleteSignatureId, setDeleteSignatureId] = useState("");
  const DeleteSignature = async () => {
    setLoadingDeleteFile(true);
    //console.log(DeleteSignatureId);
    //console.log(items?.token?.user_id);
    const postData = {
      user_id: user?.user_id,
      user_signature_id: DeleteSignatureId,
    };
    try {
      const apiData = await post("user/DeleteSignature", postData); // Specify the endpoint you want to call
      console.log("DELETE File BY File-ID ");

      console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "DELETED-PROFILE-SIGNATURE",
          description: `${email} deleted profile signature`,
        });
        console.log(response_log);
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        toastAlert("succes", apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation(false);
        setLoadingDeleteFile(false);
        getUserPrevSignatures();
        getUserPrevInitials();
        // refreshPrev();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const DeleteSignature1 = async () => {
    setLoadingDeleteFile(true);
    //console.log(DeleteSignatureId);
    const postData = {
      user_id: user?.user_id,
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
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "DELETED-PROFILE-SIGNATURE",
          description: `${email} deleted profile initials`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        toastAlert("succes", apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation1(false);
        setLoadingDeleteFile(false);
        getUserPrevSignatures();
        getUserPrevInitials();
        // refreshPrev();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const [modalOpen1, setModalOpen1] = useState(false);
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setModalOpen1(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const placeImage = async (url, prevSign, typeSign) => {
    if (initialBox) {
      setIsSubmitting(true);
      //console.log('Enbetrehb');
      setSignatureModal(!SignatureModal);
      //console.log(items?.token?.user_id);
      const user_id = user?.user_id;
      //console.log('url', url);
      //console.log('prevSign', prevSign);
      //console.log('typeSign', typeSign);
      setprofileSignature(url);

      // const postData = {
      //   user_id: user_id,
      //   signature_image_url: url

      // };
      const postData = {
        user_id: user_id,
        signature_image_url: url,
        type: "profile_initils",
      };
      try {
        // const apiData = await post('user/update_profile', postData); // Specify the endpoint you want to call
        // //console.log("Signers ")
        // //console.log(apiData)
        // if (apiData.error) {
        //   setIsSubmitting(false)
        //   toastAlert("error", "Can't Update Right Now!")
        // } else {
        //   setIsSubmitting(false)
        //   getUserSignature()
        //   toastAlert("success", "Signature Updated Successfully!")
        // }
        const apiData = await post("user/AddUserSignaturesToDb", postData); // Specify the endpoint you want to call
        //console.log('Signers ');
        //console.log(apiData);
        if (apiData.error) {
          setIsSubmitting(false);
          toastAlert("error", "Can't Update Right Now!");
        } else {
          setIsSubmitting(false);
          // getUserSignature();
          getUserPrevInitials();
          const user_id = user?.user_id;
          const email = user?.email;

          let response_log = await getActivityLogUser({
            user_id: user_id,
            event: "PROFILE-INITIALS-ADDED",
            description: `${email} profile initials added   `,
          });
          if (response_log === true) {
            //console.log('MAINTAIN LOG SUCCESS');
          } else {
            //console.log('MAINTAIN ERROR LOG');
          }
          toastAlert("success", "Initials Updated Successfully!");
        }
      } catch (error) {
        toastAlert("error", "Can't Update Right Now!");

        //console.log('Error fetching data:', error);
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      //console.log('Enbetrehb');
      setSignatureModal(!SignatureModal);
      //console.log(items?.token?.user_id);
      const user_id = user?.user_id;
      //console.log('url', url);
      //console.log('prevSign', prevSign);
      //console.log('typeSign', typeSign);
      setprofileSignature(url);

      // const postData = {
      //   user_id: user_id,
      //   signature_image_url: url

      // };
      const postData = {
        user_id: user_id,
        signature_image_url: url,
        type: "profile",
      };
      try {
        // const apiData = await post('user/update_profile', postData); // Specify the endpoint you want to call
        // //console.log("Signers ")
        // //console.log(apiData)
        // if (apiData.error) {
        //   setIsSubmitting(false)
        //   toastAlert("error", "Can't Update Right Now!")
        // } else {
        //   setIsSubmitting(false)
        //   getUserSignature()
        //   toastAlert("success", "Signature Updated Successfully!")
        // }
        const apiData = await post("user/AddUserSignaturesToDb", postData); // Specify the endpoint you want to call
        //console.log('Signers ');
        //console.log(apiData);
        if (apiData.error) {
          setIsSubmitting(false);
          toastAlert("error", "Can't Update Right Now!");
        } else {
          setIsSubmitting(false);
          // getUserSignature();
          getUserPrevSignatures();
          const user_id = user?.user_id;
          const email = user?.email;

          let response_log = await getActivityLogUser({
            user_id: user_id,
            event: "PROFILE-SIGNATURE-ADDED",
            description: `${email} profile signature added   `,
          });
          if (response_log === true) {
            //console.log('MAINTAIN LOG SUCCESS');
          } else {
            //console.log('MAINTAIN ERROR LOG');
          }
          toastAlert("success", "Signature Updated Successfully!");
        }
      } catch (error) {
        toastAlert("error", "Can't Update Right Now!");

        //console.log('Error fetching data:', error);
        setIsSubmitting(false);
      }
    }
  };

  const [initialValues, setInitialValues] = useState({
    firstname: "", // Initialize with empty string
    lastname: "",
    // phoneNo: '',
  });
  const [initialValues1, setInitialValues1] = useState({
    old_password: "",
    password: "", // Initialize with empty string
    confirm_password: "",
  });
  const { i18n } = useTranslation();
  const [companyData, setCompanyData] = useState(null);
  const [company_user_Logged_User, setCompany_User_Logged_User] =
    useState(null);
  const [company_admin_Logged_User, setCompany_Admin_Logged_User] =
    useState(null);
  const [companyUsersData, setCompanyUsersData] = useState(null);
  const handleLanguageChange = (language, ln) => {
    i18n.changeLanguage(ln);
    localStorage.setItem("selectedLanguage", ln);
    localStorage.setItem("selectedLanguageName", language);
    setSelectedLanguage(language);
  };

  const [initialBox, setInitialBox] = useState(null);
  const [PrevInitialArray, setPrevInitialArrayImage] = useState([]);

  const [PrevSignatureArray, setPrevSignatureArrayImage] = useState([]);
  const getUserPrevSignatures = async () => {
    const postData = {
      user_id: user?.user_id,
      type: "profile",
    };
    const apiData = await post("user/GetUserSignaturesToDb", postData); // Specify the endpoint you want to call
    //console.log('apiDatasdfsddsf');

    //console.log(apiData);
    if (apiData.error == true || apiData.error === "true") {
      setPrevSignatureArrayImage([]);
    } else {
      //console.log('Signature Prev');

      //console.log(apiData);
      // setPrevSignatureArrayImage('');
      setPrevSignatureArrayImage(apiData.data);
      //console.log('Prev Sig');
      // //console.log(apiData.result[0].signature_image_url);
    }
  };
  const getUserPrevInitials = async () => {
    //console.log('imageDataURL');

    //console.log(user_id);

    const postData = {
      user_id: user?.user_id,
      type: "profile_initils",
    };
    const apiData = await post("user/GetUserSignaturesToDb", postData); // Specify the endpoint you want to call
    //console.log('apiDatasdfsddsf');

    //console.log(apiData);
    if (apiData.error == true || apiData.error === "true") {
      setPrevInitialArrayImage([]);
    } else {
      //console.log('Signature Prev');

      //console.log(apiData);
      // setPrevInitialArrayImage('');
      setPrevInitialArrayImage(apiData.data);
      //console.log('Prev Sig');
      // //console.log(apiData.result[0].signature_image_url);
    }
  };
  const [loaderData, setLoaderData] = useState(true);

  const toggleModal = () => setModalOpen1(!modalOpen1);
  const handleImageCropped = async (croppedFile) => {
    console.log("Cropped File:", croppedFile);
    setSelectedFileImage(croppedFile);
    if (croppedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
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
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageFileData, setImageFileData] = useState(null);
  const [modalOpen2, setModalOpen2] = useState(false);
  const toggleModal2 = () => setModalOpen2(!modalOpen2);
  const handleImageCropped2 = async (croppedFile) => {
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
    const file = e;

    setImageFile(file);
    setImageFileData(URL.createObjectURL(file));
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setModalOpen2(true);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageChange(acceptedFiles[0]);
      }
    },
  });
  const [daysleftExpired, setdaysleftExpired] = useState(0);
  const [freeTrailExpiredAlert, setFreeTrailExpiredAlert] = useState(false);
  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            getUserPrevInitials(),
            getUserPrevSignatures(),
            setLoaderData(false),
          ]);
          console.log("PLAN DATA ");

          setUserDetailsCutrrent(user);
          console.log("companyExist");

          if (company_profile === null || company_profile === undefined) {
            setCompanyData(null);
          } else {
            setCompany_Admin_Logged_User(company_admin);
            setCompany_User_Logged_User(user?.company_user);
            setCompanyUsersData(user?.company_id);
          }

          if (user?.avatar === null) {
            setSelectedFileImage(null);
          } else {
            setSelectedImage(user?.avatar);
            setSelectedFileImage("API");
          }
          if (user?.logo === null) {
            setImageFileData(null);
          } else {
            setImageFileData(user?.logo);
          }

          setemail(user?.email);
          // setImage(user?.logo);
          setInitialValues({
            firstname: user?.first_name, // Set first name fetched from API
            lastname: user?.last_name,
            // phoneNo: user_profile.contact_no,
          });
          setValue(user?.contact_no);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoaderData(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, subscription, plan, status, company_profile, company_admin]);

  return (
    <div>
      <FreeTrialAlert
        isSubscripitonActive={isSubscripitonActive}
        subscription={subscription}
        isFreeTrialExpired={isFreeTrialExpired}
        daysleftExpired={daysLeftExpiredfreePlan}
      />

      <ImageCropperModal
        cropSrc={selectedImage}
        isOpen={modalOpen1}
        toggle={toggleModal}
        onImageCropped={handleImageCropped}
      />
      <ImageCropperModal
        cropSrc={imageFileData}
        isOpen={modalOpen2}
        toggle={toggleModal2}
        onImageCropped={handleImageCropped2}
      />
      <Row>
        <Col md="12" xs="12" className="d-flex justify-content-between">
          <h1 style={{ fontSize: "18px", marginTop: "10px" }}>
            {t("My Account")}
          </h1>
        </Col>
        <Col xs={12} md={12} style={{ padding: "10px" }}>
          <Card>
            <CardBody>
              {loaderData ? (
                <div style={{ padding: "20px" }}>
                  <SpinnerCustom
                    color="primary"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                </div>
              ) : (
                <Row>
                  <Col
                    md="12"
                    xs="12"
                    //  style={{display: 'flex', justifyContent: 'left', marginBlock: '10px'}}
                  >
                    {window.innerWidth < 768 ? (
                      <>
                        <Dropdown
                          style={{ width: "100%" }}
                          isOpen={dropdownOpen}
                          toggle={toggleDropdown}
                          color="primary"
                        >
                          <DropdownToggle
                            caret
                            style={{ fontSize: "14px", color: "#0d6efd" }}
                          >
                            {selectedItem}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              style={{ width: "100%" }}
                              active={active === "1"}
                              onClick={() => handleItemClick("Profile", "1")}
                            >
                              <User
                                size={20}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              {t("Profile")}
                            </DropdownItem>
                            {company_admin_Logged_User === true ||
                            company_admin_Logged_User === "true" ? (
                              <>
                                {" "}
                                <DropdownItem
                                  style={{ width: "100%" }}
                                  active={active === "6"}
                                  onClick={() =>
                                    handleItemClick("Company Profile", "6")
                                  }
                                >
                                  <Columns
                                    size={20}
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  />
                                  {t("Company Profile")}
                                </DropdownItem>
                                <DropdownItem
                                  style={{ width: "100%" }}
                                  active={active === "7"}
                                  onClick={() =>
                                    handleItemClick("Company Users", "7")
                                  }
                                >
                                  <Users
                                    size={20}
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  />
                                  {t("Company Users")}
                                </DropdownItem>
                              </>
                            ) : null}
                            <DropdownItem
                              style={{ width: "100%" }}
                              active={active === "2"}
                              onClick={() =>
                                handleItemClick("Signature & Initials", "2")
                              }
                            >
                              <AtSign
                                size={20}
                                style={{
                                  marginRight: "10px",
                                }}
                              />{" "}
                              {t("Signature & Initials")}
                            </DropdownItem>
                            <DropdownItem
                              style={{ width: "100%" }}
                              active={active === "3"}
                              onClick={() =>
                                handleItemClick("Manage Password", "3")
                              }
                            >
                              <Lock
                                size={20}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              {t("Manage Password")}
                            </DropdownItem>

                            <DropdownItem
                              style={{ width: "100%" }}
                              active={active === "9"}
                              onClick={() =>
                                handleItemClick("Manage Languages", "9")
                              }
                            >
                              <Globe
                                size={20}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              {t("Manage Languages")}
                            </DropdownItem>
                            {company_admin_Logged_User === true ||
                            company_admin_Logged_User === "true" ||
                            company_user_Logged_User === true ||
                            company_user_Logged_User === "true" ? (
                              <></>
                            ) : (
                              <DropdownItem
                                style={{ width: "100%" }}
                                active={active === "10"}
                                onClick={() =>
                                  handleItemClick("Branding", "10")
                                }
                              >
                                <Image
                                  size={20}
                                  style={{
                                    marginRight: "10px",
                                  }}
                                />
                                {t("Branding")}
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </>
                    ) : (
                      <>
                        {" "}
                        <Nav
                          className="nav-center"
                          horizontal
                          style={{
                            textAlign: "left",
                            fontSize: "14px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <NavItem>
                            <NavLink
                              active={active === "1"}
                              onClick={() => {
                                toggle("1");
                              }}
                              style={
                                active === "1"
                                  ? {
                                      color: primary_color,
                                      borderBottom: `3px solid ${primary_color}`,
                                    }
                                  : {}
                              }
                            >
                              <User
                                size={20}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              {t("Profile")}
                            </NavLink>
                          </NavItem>
                          {company_admin_Logged_User === true ||
                          company_admin_Logged_User === "true" ? (
                            <>
                              <NavItem>
                                <NavLink
                                  active={active === "6"}
                                  onClick={() => {
                                    toggle("6");
                                  }}
                                  style={
                                    active === "6"
                                      ? {
                                          color: primary_color,
                                          borderBottom: `3px solid ${primary_color}`,
                                        }
                                      : {}
                                  }
                                >
                                  <Columns
                                    size={20}
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  />
                                  {t("Company Profile")}
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  active={active === "7"}
                                  onClick={() => {
                                    toggle("7");
                                  }}
                                  style={
                                    active === "7"
                                      ? {
                                          color: primary_color,
                                          borderBottom: `3px solid ${primary_color}`,
                                        }
                                      : {}
                                  }
                                >
                                  <Users
                                    size={20}
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  />
                                  {t("Company Users")}
                                </NavLink>
                              </NavItem>
                            </>
                          ) : null}
                          <NavItem>
                            <NavLink
                              style={
                                active === "2"
                                  ? {
                                      color: primary_color,
                                      borderBottom: `3px solid ${primary_color}`,
                                    }
                                  : {}
                              }
                              active={active === "2"}
                              onClick={() => {
                                toggle("2");
                              }}
                            >
                              <AtSign
                                size={20}
                                style={{
                                  marginRight: "10px",
                                }}
                              />{" "}
                              {t("Signature & Initials")}
                            </NavLink>
                          </NavItem>

                          <NavItem>
                            <NavLink
                              style={
                                active === "3"
                                  ? {
                                      color: primary_color,
                                      borderBottom: `3px solid ${primary_color}`,
                                    }
                                  : {}
                              }
                              active={active === "3"}
                              onClick={() => {
                                toggle("3");
                              }}
                            >
                              <Lock
                                size={20}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              {t("Manage Password")}
                            </NavLink>
                          </NavItem>

                          <NavItem>
                            <NavLink
                              style={
                                active === "9"
                                  ? {
                                      color: primary_color,
                                      borderBottom: `3px solid ${primary_color}`,
                                    }
                                  : {}
                              }
                              active={active === "9"}
                              onClick={() => {
                                toggle("9");
                              }}
                            >
                              <Globe
                                size={20}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              {t("Manage Languages")}
                            </NavLink>
                          </NavItem>
                          {company_admin_Logged_User === true ||
                          company_admin_Logged_User === "true" ||
                          company_user_Logged_User === true ||
                          company_user_Logged_User === "true" ? (
                            <></>
                          ) : (
                            <NavItem>
                              <NavLink
                                style={
                                  active === "10"
                                    ? {
                                        color: primary_color,
                                        borderBottom: `3px solid ${primary_color}`,
                                      }
                                    : {}
                                }
                                active={active === "10"}
                                onClick={() => {
                                  toggle("10");
                                }}
                              >
                                <Image
                                  size={20}
                                  style={{
                                    marginRight: "10px",
                                  }}
                                />
                                {t("Branding")}
                              </NavLink>
                            </NavItem>
                          )}
                        </Nav>{" "}
                      </>
                    )}
                  </Col>
                  <Col md="12" xs="12" style={{ padding: "10px" }}>
                    <TabContent className="py-50" activeTab={active}>
                      {/* logo  */}
                      <TabPane tabId="10">
                        <Row>
                          {/* <h2>My Account</h2> */}
                          <Col xs={12} md={2}></Col>
                          <Col xs={12} md={8}>
                            <div>
                              <div className="mb-1">
                                <Label
                                  className="form-label"
                                  for="register-lastname"
                                >
                                  Logo (Resolution 300x100px, Formats PNG
                                  (preffered) or JPEG)
                                </Label>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  {imageFileData === null ? (
                                    <>
                                      <div className="image-picker">
                                        <div
                                          {...getRootProps()}
                                          style={{
                                            border: "2px dashed lightGrey",
                                            borderRadius: "10px",
                                            // padding: "20px",
                                            padding: "60px",
                                            width: "500px",
                                            height: "200px",
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
                                                <ArrowUp
                                                  size={40}
                                                  color="#23b3e8"
                                                />
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
                                          alignItems: "center",
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
                                              style={{
                                                width: "200px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
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
                                              style={{
                                                width: "200px",
                                                height: "50px",
                                                objectFit: "contain",
                                              }}
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

                              <div className="d-flex justify-content-center">
                                <CustomButton
                                  padding={true}
                                  size="sm"
                                  onClick={async () => {
                                    if (
                                      imageFileData === null ||
                                      image === null
                                    ) {
                                      toastAlert(
                                        "error",
                                        "Please Upload Image"
                                      );
                                    } else {
                                      const postData = {
                                        image: imageFile,
                                        user_id: user?.user_id,
                                      };
                                      try {
                                        setIsSubmitting(true);
                                        const apiData = await postFormData(
                                          postData
                                        ); // Specify the endpoint you want to call
                                        console.log(apiData);
                                        if (
                                          apiData.public_url === null ||
                                          apiData.public_url === undefined ||
                                          apiData.public_url === ""
                                        ) {
                                          //console.log('Error uploading Files');
                                          toastAlert(
                                            "error",
                                            "Error uploading File"
                                          );
                                        } else {
                                          // call api to update
                                          let file_url = apiData.public_url;
                                          const postData2 = {
                                            user_id: user?.user_id,

                                            logo: file_url,
                                          };
                                          const apiData2 = await post(
                                            "user/update-logo",
                                            postData2
                                          ); // Specify the endpoint you want to call
                                          //console.log('apixxsData');

                                          //console.log(apiData2);
                                          if (apiData2.error) {
                                            toastAlert(
                                              "error",
                                              "Something went wrong"
                                            );
                                            //console.log('error', apiData2.errorMessage);
                                            setIsSubmitting(false);
                                          } else {
                                            // toggleFunc();
                                            toastAlert(
                                              "success",
                                              "Logo updated successfully"
                                            );
                                            setTimeout(() => {
                                              setIsSubmitting(false);

                                              window.location.reload();
                                            }, 1000);
                                            // setShow(true)
                                          }
                                        }
                                      } catch (error) {
                                        setIsSubmitting(false);
                                        toastAlert(
                                          "error",
                                          "Something went wrong"
                                        );

                                        console.error(
                                          "Error uploading file:",
                                          error
                                        );
                                      }
                                    }
                                  }}
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
                            </div>
                          </Col>
                          <Col xs={12} md={2}></Col>
                        </Row>

                        {/* <h2>My Signature</h2> */}
                      </TabPane>
                      <TabPane tabId="1">
                        {/* <h2>My Account</h2> */}
                        <Formik
                          enableReinitialize
                          initialValues={initialValues}
                          validationSchema={validationSchema}
                          onSubmit={async (
                            values,
                            { setSubmitting, resetForm }
                          ) => {
                            setSubmitting(true);
                            //console.log(values);
                            setSubmitting(true);
                            //console.log('Update Profile ');
                            //console.log(selectedFileImage);
                            if (
                              selectedFileImage === null ||
                              selectedFileImage === undefined ||
                              selectedFileImage === "API"
                            ) {
                              const postData = {
                                user_id: user?.user_id,
                                first_name: values.firstname,
                                last_name: values.lastname,
                                contact_no: value,
                              };
                              try {
                                const apiData = await post(
                                  "user/update_profile",
                                  postData
                                ); // Specify the endpoint you want to call
                                //console.log('Signers ');
                                //console.log(apiData);
                                if (apiData.error) {
                                  setSubmitting(false);
                                  toastAlert(
                                    "error",
                                    "Can't Update Right Now!"
                                  );
                                } else {
                                  setSubmitting(false);
                                  // getUserSignature();
                                  const user_id = user?.user_id;
                                  const email = user?.email;

                                  let response_log = await getActivityLogUser({
                                    user_id: user_id,
                                    event: "PROFILE-UPDATED",
                                    description: `${email} updated profile  `,
                                  });
                                  if (response_log === true) {
                                    //console.log('MAINTAIN LOG SUCCESS');
                                  } else {
                                    //console.log('MAINTAIN ERROR LOG');
                                  }
                                  // redux refresh
                                  console.log(user);
                                  // console.log()
                                  dispatch(
                                    getUser({
                                      user_id: user?.user_id,
                                      token: user?.token,
                                    })
                                  );

                                  toastAlert(
                                    "success",
                                    "Profile Updated Successfully!"
                                  );
                                }
                              } catch (error) {
                                toastAlert("error", "Can't Update Right Now!");

                                //console.log('Error fetching data:', error);
                                setSubmitting(false);
                              }
                            } else {
                              // update avatar
                              const postData = {
                                image: selectedFileImage,
                                user_id: user?.user_id,
                              };
                              const apiData = await postFormData(postData); // Specify the endpoint you want to call
                              //console.log(apiData);
                              if (
                                apiData.public_url === null ||
                                apiData.public_url === undefined ||
                                apiData.public_url === ""
                              ) {
                                // toastAlert("error", "Error uploading Files")
                                toastAlert("error", "Error uploading Files!");
                                setSubmitting(false);
                              } else {
                                const url = apiData?.public_url;
                                //console.log(apiData);
                                // call api to update
                                const postData1 = {
                                  user_id: user?.user_id,
                                  first_name: values.firstname,
                                  last_name: values.lastname,
                                  contact_no: value,
                                  avatar: url,
                                };
                                try {
                                  const apiData1 = await post(
                                    "user/update_profile",
                                    postData1
                                  ); // Specify the endpoint you want to call
                                  //console.log('Signers ');
                                  //console.log(apiData1);
                                  if (apiData1.error) {
                                    setSubmitting(false);
                                    toastAlert(
                                      "error",
                                      "Can't Update Right Now!"
                                    );
                                  } else {
                                    setSubmitting(false);
                                    setSelectedFileImage(null);
                                    // getUserSignature();
                                    const user_id = user?.user_id;
                                    const email = user?.email;

                                    let response_log = await getActivityLogUser(
                                      {
                                        user_id: user_id,
                                        event: "PROFILE-UPDATED",
                                        description: `${email} updated profile  `,
                                      }
                                    );
                                    if (response_log === true) {
                                      //console.log('MAINTAIN LOG SUCCESS');
                                    } else {
                                      //console.log('MAINTAIN ERROR LOG');
                                    }
                                    // redux refresh
                                    dispatch(
                                      getUser({
                                        user_id: user?.user_id,
                                        token: user?.token,
                                      })
                                    );

                                    toastAlert(
                                      "success",
                                      "Profile Updated Successfully!"
                                    );
                                    setTimeout(
                                      () => window.location.reload(),
                                      500
                                    );
                                  }
                                } catch (error) {
                                  toastAlert(
                                    "error",
                                    "Can't Update Right Now!"
                                  );

                                  //console.log('Error fetching data:', error);
                                  setSubmitting(false);
                                }
                              }
                            }
                          }}
                        >
                          {({
                            getFieldProps,
                            errors,
                            touched,
                            isSubmitting,
                            values,
                            handleChange,
                          }) => (
                            <Form className="auth-register-form mt-2">
                              <Row>
                                <Col xs={12} md={3}></Col>
                                <Col
                                  xs={12}
                                  md={6}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Row
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Col
                                      xs={12}
                                      md={12}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <div
                                        className="mb-1"
                                        style={{ position: "relative" }}
                                      >
                                        {selectedFileImage === null ||
                                        selectedFileImage === "null" ||
                                        selectedFileImage === "undefined" ||
                                        selectedFileImage === "API" ? (
                                          <>
                                            {selectedFileImage === "API" ? (
                                              <img
                                                src={selectedImage}
                                                alt="image-data"
                                                style={{
                                                  width: "150px",
                                                  height: "150px",
                                                  borderRadius: "50%",
                                                  objectFit: "contain",
                                                  border: "1px solid lightGrey",
                                                }}
                                              />
                                            ) : (
                                              <img
                                                src={image_dummy}
                                                alt="image-data"
                                                style={{
                                                  width: "150px",
                                                  height: "150px",
                                                  objectFit: "contain",
                                                  borderRadius: "50%",
                                                  border: "1px solid lightGrey",
                                                }}
                                              />
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            <img
                                              src={selectedImage}
                                              alt="image-data"
                                              style={{
                                                width: "150px",
                                                height: "150px",
                                                borderRadius: "50%",
                                                border: "1px solid lightGrey",
                                              }}
                                            />
                                          </>
                                        )}

                                        <label
                                          htmlFor="image-upload"
                                          style={{
                                            position: "absolute",
                                            top: "-5px",
                                            right: "5px",
                                            cursor: "pointer",
                                            backgroundColor: primary_color, // Background color of the circle
                                            color: "white", // Icon color
                                            borderRadius: "50%", // Makes the background circular
                                            width: "30px", // Set width and height to make a circle
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",

                                            // position: 'absolute',
                                            // top: '-5px',
                                            // right: '5px',
                                            // cursor: 'pointer',
                                            // backgroundColor: 'transparent',

                                            // borderRadius: '40%',
                                          }}
                                        >
                                          <Edit2 size={15} id="positionLeft" />
                                          <UncontrolledTooltip
                                            placement="left"
                                            target="positionLeft"
                                          >
                                            {t("Change Image")}
                                          </UncontrolledTooltip>
                                        </label>
                                        <input
                                          id="image-upload"
                                          type="file"
                                          accept="image/*"
                                          style={{ display: "none" }}
                                          onChange={handleImageSelect}
                                        />
                                      </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                      <div className="mb-1">
                                        <Label
                                          className="form-label"
                                          for="register-firstname"
                                        >
                                          {t("First Name")}
                                        </Label>
                                        {/* <Input
                          style={{boxShadow: 'none', fontSize: '16px'}}
                          value={first_name}
                          onChange={e => setfirst_name(e.target.value)}
                          type="text"
                          id="register-firstname"
                          placeholder="John"
                          autoFocus
                        /> */}
                                        <Input
                                          style={{
                                            boxShadow: "none",
                                            fontSize: "16px",
                                          }}
                                          className={`form-control ${
                                            touched.firstname &&
                                            errors.firstname
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          {...getFieldProps("firstname")}
                                          onChange={handleChange("firstname")}
                                          value={values["firstname"]}
                                          type="text"
                                          id="register-firstname"
                                          placeholder="John"
                                          autoFocus
                                        />
                                        {touched.firstname &&
                                        errors.firstname ? (
                                          <div className="invalid-feedback">
                                            {errors.firstname}
                                          </div>
                                        ) : null}
                                      </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                      <div className="mb-1">
                                        <Label
                                          className="form-label"
                                          for="register-lastname"
                                        >
                                          {t("Last Name")}
                                        </Label>
                                        <Input
                                          style={{
                                            boxShadow: "none",
                                            fontSize: "16px",
                                          }}
                                          className={`form-control ${
                                            touched.lastname && errors.lastname
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          onChange={handleChange("lastname")}
                                          {...getFieldProps("lastname")}
                                          value={values["lastname"]}
                                          type="text"
                                          id="register-lastname"
                                          placeholder="Doe"
                                        />
                                        {touched.lastname && errors.lastname ? (
                                          <div className="invalid-feedback">
                                            {errors.lastname}
                                          </div>
                                        ) : null}
                                      </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                      <div className="mb-1">
                                        <Label
                                          className="form-label"
                                          for="register-phone-no"
                                        >
                                          {t("Phone Number")}
                                        </Label>
                                        <div
                                          style={containerStyle}
                                          className="phone-input-container"
                                        >
                                          {/* <PhoneInput
                                            country={country}
                                            value={value}
                                            onChange={handlePhoneNumberChange}
                                            style={inputStyle}
                                          /> */}
                                          <PhoneInput
                                            defaultCountry="US"
                                            international
                                            value={value}
                                            onChange={handlePhoneNumberChange}
                                            style={inputStyle}
                                            className="input-phone-number"
                                          />
                                        </div>
                                        {/* <PhoneInput
                                        className={`input-phone-number  ${
                                          touched.phoneNo && errors.phoneNo ? 'is-invalid' : ''
                                        }`}
                                        {...getFieldProps('phoneNo')}
                                        value={values['phoneNo']}
                                        country={'us'}
                                        enableSearch={true}
                                        onChange={handleChange('phoneNo')}
                                        defaultCountry={'us'}
                                      /> */}
                                        {/* <Input
                                style={{boxShadow: 'none', fontSize: '16px'}}
                                className={`form-control ${touched.phoneNo && errors.phoneNo ? 'is-invalid' : ''}`}
                                onChange={handleChange('phoneNo')}
                                value={values['phoneNo']}
                                {...getFieldProps('phoneNo')}
                                type="number"
                                id="register-phone-no"
                                placeholder="00000000000"
                              /> */}
                                        {/* {touched.phoneNo && errors.phoneNo ? (
                                        <div className="invalid-feedback">{errors.phoneNo}</div>
                                      ) : null} */}
                                        {/* {touched.phoneNo && errors.phoneNo ? (
                      <div className="invalid-feedback">{errors.phoneNo}</div>
                    ) : null} */}
                                      </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                      <div className="mb-1">
                                        <Label
                                          className="form-label"
                                          for="register-email"
                                        >
                                          {t("Email")}
                                        </Label>
                                        <Input
                                          disabled
                                          style={{
                                            boxShadow: "none",
                                            fontSize: "16px",
                                          }}
                                          value={email}
                                          onChange={(e) =>
                                            setemail(e.target.value)
                                          }
                                        />
                                      </div>
                                    </Col>
                                    <Col xs={12} md={12}>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <CustomButton
                                          padding={true}
                                          style={{
                                            boxShadow: "none",
                                            marginTop: "2%",
                                          }}
                                          // onClick={() => updateProfile()}
                                          type="submit"
                                          color="primary"
                                          size="sm"
                                          disabled={isSubmitting}
                                          text={
                                            <>
                                              {" "}
                                              {isSubmitting ? (
                                                <Spinner
                                                  color="light"
                                                  size="sm"
                                                />
                                              ) : null}
                                              <span className="align-middle ms-25">
                                                {t("Update")}
                                              </span>
                                            </>
                                          }
                                        />
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={12} md={3}></Col>
                              </Row>
                            </Form>
                          )}
                        </Formik>
                        {/* <h2>My Signature</h2> */}
                      </TabPane>
                      <TabPane tabId="2">
                        <Row>
                          <Col
                            xs={12}
                            md={6}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Row>
                              <Col xs={12} md={12}>
                                <h2
                                  style={{
                                    fontSize: "16px",
                                    textAlign: "left",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {t("My Signature")}
                                </h2>
                                <CustomButton
                                  onClick={() => {
                                    console.log("Signature length");
                                    console.log(PrevSignatureArray.length);
                                    if (PrevSignatureArray.length >= 5) {
                                      toastAlert(
                                        "error",
                                        "You can't upload more than 5 signatures"
                                      );
                                    } else {
                                      setInitialBox(false);
                                      setSignatureModal(true);
                                    }
                                  }}
                                  padding={true}
                                  size="sm"
                                  style={{
                                    boxShadow: "none",
                                    fontSize: "15px",
                                    marginBlock: "2%",
                                  }}
                                  text={
                                    <>
                                      {isSubmitting ? (
                                        <>
                                          <Spinner color="light" size="sm" />{" "}
                                          <span style={{ marginLeft: "10px" }}>
                                            {t("Uploading")} ...
                                          </span>
                                        </>
                                      ) : (
                                        <>{t("Upload Signature")}</>
                                      )}
                                    </>
                                  }
                                />{" "}
                              </Col>
                              <Col xs={12} md={12}>
                                <Row>
                                  {/* <Col xs={12} md={3}></Col> */}
                                  <Col
                                    xs={12}
                                    md={12}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Row
                                      style={{
                                        maxHeight:
                                          window.innerWidth < 760
                                            ? "100%"
                                            : "500px",
                                        overflowY: "auto",
                                        marginBlock: "10px",
                                      }}
                                    >
                                      {PrevSignatureArray.length === 0 ? (
                                        <>
                                          <Col sm="12" xs="12">
                                            <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                                              <Col
                                                md="12"
                                                xs="12"
                                                className="d-flex justify-content-center align-items-center"
                                              >
                                                <img
                                                  src={emptyImage}
                                                  alt="empty"
                                                  style={{
                                                    width: "100px",
                                                    height: "auto",
                                                  }}
                                                />
                                                <Label
                                                  className="form-label"
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {t("No Signature Exist")}
                                                </Label>
                                              </Col>
                                            </Row>{" "}
                                          </Col>
                                        </>
                                      ) : (
                                        <>
                                          {PrevSignatureArray.map(
                                            (item, index) => (
                                              <>
                                                <Col
                                                  xs="12"
                                                  md={2}
                                                  sm="12"
                                                ></Col>
                                                <Col
                                                  sm="12"
                                                  md={8}
                                                  xs="12"
                                                  key={index}
                                                >
                                                  <div
                                                    style={{
                                                      position: "relative",
                                                      height: "80px",
                                                      width: "100%",
                                                      backgroundColor:
                                                        "#f9f7f7",
                                                      border:
                                                        "1px solid lightGrey",
                                                      marginBottom: "10px",
                                                      display: "flex",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <img
                                                      style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "100%",
                                                        objectFit: "contain",
                                                      }}
                                                      // width="100%"
                                                      // height="auto"
                                                      src={`${item.signature_image_url}`}
                                                      alt="Card image cap"
                                                      // onClick={() => saveSignature(PrevSignatureArray, 'prevSign')}
                                                    />
                                                    <Trash2
                                                      size={15}
                                                      color="red"
                                                      onClick={() => {
                                                        setDeleteSignatureId(
                                                          item.user_signature_id
                                                        );
                                                        setItemDeleteConfirmation(
                                                          true
                                                        );
                                                      }}
                                                      style={{
                                                        cursor: "pointer",
                                                        position: "absolute",
                                                        top: 5,
                                                        right: 5,
                                                      }}
                                                    />
                                                  </div>
                                                </Col>
                                                <Col
                                                  xs="12"
                                                  md={2}
                                                  sm="12"
                                                ></Col>
                                              </>
                                            )
                                          )}
                                        </>
                                      )}
                                    </Row>
                                  </Col>
                                  {/* <Col xs={12} md={3}></Col> */}
                                </Row>{" "}
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={12} md={6}>
                            <Row>
                              <Col xs={12}>
                                <h2
                                  style={{
                                    fontSize: "16px",
                                    textAlign: "left",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {t("My Initials")}
                                </h2>
                                <CustomButton
                                  onClick={() => {
                                    if (PrevInitialArray.length >= 5) {
                                      toastAlert(
                                        "error",
                                        "You can't upload more than 5 initials"
                                      );
                                    } else {
                                      setInitialBox(true);
                                      setSignatureModal(true);
                                    }
                                  }}
                                  padding={true}
                                  size="sm"
                                  style={{
                                    boxShadow: "none",
                                    fontSize: "15px",
                                    marginBlock: "3%",
                                  }}
                                  text={
                                    isSubmitting ? (
                                      <>
                                        <Spinner color="light" size="sm" />{" "}
                                        <span style={{ marginLeft: "10px" }}>
                                          {t("Uploading")} ...
                                        </span>
                                      </>
                                    ) : (
                                      <>{t("Upload Initials")}</>
                                    )
                                  }
                                />
                              </Col>
                              <Col xs={12}>
                                <Row
                                  style={{
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                    marginBlock: "5px",
                                  }}
                                >
                                  {PrevInitialArray.length === 0 ? (
                                    <Col sm="12" xs="12">
                                      <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                                        <Col
                                          md="12"
                                          xs="12"
                                          className="d-flex justify-content-center align-items-center"
                                        >
                                          <img
                                            src={emptyImage}
                                            alt="empty"
                                            style={{
                                              width: "100px",
                                              height: "auto",
                                            }}
                                          />
                                          <Label
                                            className="form-label"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {t("No Initials Exist")}
                                          </Label>
                                        </Col>
                                      </Row>{" "}
                                    </Col>
                                  ) : (
                                    <>
                                      {PrevInitialArray.map((item, index) => (
                                        <>
                                          <Col sm="4" xs="4" md="2" key={index}>
                                            <div
                                              style={{
                                                position: "relative",
                                                height: "100px",
                                                width: "100%",
                                                backgroundColor: "#f9f7f7",
                                                border: "1px solid lightGrey",
                                                marginBottom: "10px",
                                              }}
                                            >
                                              <img
                                                // width="100%"
                                                // height="100px"
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                  objectFit: "contain",
                                                }}
                                                src={`${item.signature_image_url}`}
                                                alt="Card image cap"
                                                // onClick={() => saveSignature(PrevSignatureArray, 'prevSign')}
                                              />
                                              <Trash2
                                                size={15}
                                                color="red"
                                                onClick={() => {
                                                  setDeleteSignatureId(
                                                    item.user_signature_id
                                                  );
                                                  setItemDeleteConfirmation1(
                                                    true
                                                  );
                                                }}
                                                style={{
                                                  cursor: "pointer",
                                                  position: "absolute",
                                                  top: 5,
                                                  right: 5,
                                                }}
                                              />
                                            </div>
                                          </Col>
                                        </>
                                      ))}
                                    </>
                                  )}
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </TabPane>

                      <TabPane tabId="3">
                        <Col xs={12} md={4}></Col>
                        <Col xs={12} md={4} className="mx-auto">
                          <Formik
                            initialValues={initialValues1}
                            validationSchema={validationSchema1}
                            onSubmit={async (
                              values,
                              { setSubmitting, resetForm }
                            ) => {
                              setSubmitting(true);
                              //console.log('Update Profile ');
                              const postData = {
                                email: email,
                                password: values.password,
                                old_password: values.old_password,
                              };
                              try {
                                const apiData = await put(
                                  "user/passwordUpdateProf",
                                  postData
                                ); // Specify the endpoint you want to call
                                //console.log('Signers ');
                                //console.log(apiData);
                                if (apiData.error) {
                                  setSubmitting(false);
                                  toastAlert("error", apiData.message);
                                } else {
                                  setSubmitting(false);
                                  // getUserSignature();
                                  const user_id = user?.user_id;
                                  const email = user?.email;

                                  let response_log = await getActivityLogUser({
                                    user_id: user_id,
                                    event: "PASSWORD-UPDATED",
                                    description: `${email} updated account password from profile `,
                                  });
                                  if (response_log === true) {
                                    //console.log('MAINTAIN LOG SUCCESS');
                                  } else {
                                    //console.log('MAINTAIN ERROR LOG');
                                  }
                                  resetForm();

                                  toastAlert(
                                    "success",
                                    "Password Updated Successfully!"
                                  );
                                }
                              } catch (error) {
                                toastAlert("error", "Can't Update Right Now!");

                                //console.log('Error fetching data:', error);
                                setSubmitting(false);
                              }
                            }}
                          >
                            {({
                              getFieldProps,
                              errors,
                              touched,
                              isSubmitting,
                              values,
                              handleChange,
                            }) => (
                              <Form className="auth-login-form mt-2">
                                <Row className="justify-content-center">
                                  <Col xs={12} md={12}>
                                    <div className="mb-1">
                                      <Label
                                        className="form-label"
                                        for="register-lastname"
                                      >
                                        {t("Old Password")}
                                      </Label>
                                      <InputPasswordToggle
                                        style={{
                                          fontSize: "16px",
                                        }}
                                        // value={password}
                                        // onChange={e => {
                                        //   setPassword(e.target.password);
                                        // }}
                                        // id="register-password"

                                        className={`input-group-merge ${
                                          touched.old_password &&
                                          errors.old_password
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        {...getFieldProps("old_password")}
                                        id="login-password-1"
                                      />
                                      {touched.old_password &&
                                      errors.old_password ? (
                                        <div className="invalid-feedback">
                                          {errors.old_password}
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="mb-1">
                                      <Label
                                        className="form-label"
                                        for="register-lastname"
                                      >
                                        {t("New Password")}
                                      </Label>
                                      <InputPasswordToggle
                                        style={{
                                          fontSize: "16px",
                                        }}
                                        // value={password}
                                        // onChange={e => {
                                        //   setPassword(e.target.password);
                                        // }}
                                        // id="register-password"
                                        onChange={handleChange("password")}
                                        className={`input-group-merge ${
                                          touched.password && errors.password
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        {...getFieldProps("password")}
                                        id="login-password-1"
                                      />
                                      {/* {touched.password && errors.password ? (
                                        <div className="invalid-feedback">{errors.password}</div>
                                      ) : null} */}
                                    </div>
                                    <div className="password-criteria mt-1">
                                      <ul className="list-unstyled">
                                        {[
                                          {
                                            text: t("At least 8 characters"),
                                            fulfilled:
                                              values.password.length >= 8,
                                          },
                                          {
                                            text: t(
                                              "Contains an uppercase letter"
                                            ),
                                            fulfilled: /[A-Z]/.test(
                                              values.password
                                            ),
                                          },
                                          {
                                            text: t(
                                              "Contains a lowercase letter"
                                            ),
                                            fulfilled: /[a-z]/.test(
                                              values.password
                                            ),
                                          },
                                          {
                                            text: t("Contains a number"),
                                            fulfilled: /\d/.test(
                                              values.password
                                            ),
                                          },
                                          {
                                            text: t(
                                              "Contains a special character"
                                            ),
                                            fulfilled:
                                              /[!@#$%^&*(),.?":{}|<>]/.test(
                                                values.password
                                              ),
                                          },
                                        ].map((criterion, index) => (
                                          <li
                                            key={index}
                                            className="d-flex align-items-center"
                                            style={{ fontSize: "14px" }}
                                          >
                                            <span
                                              className={`me-2 ${
                                                criterion.fulfilled
                                                  ? "text-success"
                                                  : "text-danger"
                                              }`}
                                            >
                                              {criterion.fulfilled ? (
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 48 48"
                                                >
                                                  <defs>
                                                    <mask id="ipSCheckOne0">
                                                      <g
                                                        fill="none"
                                                        stroke-linejoin="round"
                                                        stroke-width="4"
                                                      >
                                                        <path
                                                          fill="#fff"
                                                          stroke="#fff"
                                                          d="M24 44a19.937 19.937 0 0 0 14.142-5.858A19.937 19.937 0 0 0 44 24a19.938 19.938 0 0 0-5.858-14.142A19.937 19.937 0 0 0 24 4A19.938 19.938 0 0 0 9.858 9.858A19.938 19.938 0 0 0 4 24a19.937 19.937 0 0 0 5.858 14.142A19.938 19.938 0 0 0 24 44Z"
                                                        />
                                                        <path
                                                          stroke="#000"
                                                          stroke-linecap="round"
                                                          d="m16 24l6 6l12-12"
                                                        />
                                                      </g>
                                                    </mask>
                                                  </defs>
                                                  <path
                                                    fill="#28c76f"
                                                    d="M0 0h48v48H0z"
                                                    mask="url(#ipSCheckOne0)"
                                                  />
                                                </svg>
                                              ) : (
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <g fill="none">
                                                    <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                                    <path
                                                      fill="grey"
                                                      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2M9.879 8.464a1 1 0 0 0-1.498 1.32l.084.095l2.12 2.12l-2.12 2.122a1 1 0 0 0 1.32 1.498l.094-.083L12 13.414l2.121 2.122a1 1 0 0 0 1.498-1.32l-.083-.095L13.414 12l2.122-2.121a1 1 0 0 0-1.32-1.498l-.095.083L12 10.586z"
                                                    />
                                                  </g>
                                                </svg>
                                              )}
                                            </span>
                                            <span
                                              className={
                                                criterion.fulfilled
                                                  ? "text-success"
                                                  : "null"
                                              }
                                            >
                                              {criterion.text}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="mb-1">
                                      <Label
                                        className="form-label"
                                        for="register-lastname"
                                      >
                                        {t("Confirm Password")}
                                      </Label>
                                      <InputPasswordToggle
                                        style={{
                                          fontSize: "16px",
                                        }}
                                        // value={password}
                                        // onChange={e => {
                                        //   setPassword(e.target.password);
                                        // }}
                                        // id="register-password"
                                        className={`input-group-merge ${
                                          touched.confirm_password &&
                                          errors.confirm_password
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        {...getFieldProps("confirm_password")}
                                        id="login-password-1"
                                      />
                                      {touched.confirm_password &&
                                      errors.confirm_password ? (
                                        <div className="invalid-feedback">
                                          {errors.confirm_password}
                                        </div>
                                      ) : null}
                                    </div>
                                  </Col>

                                  <Col xs={12} md={12}>
                                    <div className="d-flex justify-content-center">
                                      <CustomButton
                                        padding={true}
                                        style={{
                                          boxShadow: "none",
                                          marginTop: "1%",
                                        }}
                                        // onClick={() => updatePassword()}
                                        type="submit"
                                        color="primary"
                                        size="sm"
                                        disabled={isSubmitting}
                                        text={
                                          <>
                                            {isSubmitting ? (
                                              <Spinner
                                                color="light"
                                                size="sm"
                                              />
                                            ) : null}
                                            <span className="align-middle ms-25">
                                              {" "}
                                              {t("Update Password")}{" "}
                                            </span>
                                          </>
                                        }
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </Form>
                            )}
                          </Formik>
                        </Col>
                        <Col xs={12} md={4}></Col>
                      </TabPane>

                      <TabPane tabId="6">
                        <Row>
                          <Col xs={12} md={2}></Col>
                          <Col xs={12} md={8}>
                            <CompprofileUpdate
                              company_profile={company_profile}
                              user_id_log={user?.user_id}
                            />
                            {/* {companyData?.company_email}
                  <CompanyProfileForm
                    getCompanyData={companyData}
                    initialValues1={{
                      name: companyData?.company_name,
                      company_email: companyData?.company_email,
                      website_link: companyData?.website_link,
                      phone_no: companyData?.contact_no,
                      address: companyData?.address,
                      company_admin_email: companyData?.company_admin_email,
                      branding: '',
                      subdomain_name: companyData?.subdomain_name,
                      primary_color: companyData?.primary_color,
                      secondary_color: companyData?.secondary_color,
                    }}
                  /> */}
                          </Col>
                          <Col xs={12} md={2}></Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="7">
                        <CompanyUsers
                          companyUsersData={companyUsersData}
                          company_admin_Logged_User={company_admin_Logged_User}
                        />
                      </TabPane>
                      <TabPane tabId="8">
                        <div
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "10px",
                          }}
                        >
                          Under-Development
                        </div>
                      </TabPane>
                      <TabPane tabId="9">
                        <Row>
                          <Col
                            xs={12}
                            md={4}
                            style={{ textAlign: "center", padding: "10px" }}
                          >
                            {/* <IntlDropdown /> */}
                          </Col>
                          <Col
                            xs={12}
                            md={4}
                            style={{ textAlign: "center", padding: "10px" }}
                          >
                            {languages.map((language) => (
                              <Button
                                key={language.code}
                                color={
                                  selectedLanguage === language.name
                                    ? primary_color
                                    : "none"
                                }
                                onClick={() =>
                                  handleLanguageChange(
                                    language.name,
                                    language.code
                                  )
                                }
                                style={{
                                  width: "100%",
                                  marginBottom: "10px",
                                  fontSize: "16px",
                                  color:
                                    selectedLanguage === language.name
                                      ? "white"
                                      : "grey",

                                  backgroundColor:
                                    selectedLanguage === language.name
                                      ? primary_color
                                      : "white",
                                  padding: "10px",
                                  border:
                                    selectedLanguage === language.name
                                      ? "none"
                                      : "1px solid lightGrey",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  {Array.isArray(language.countryCodes) ? (
                                    language.countryCodes.map((countryCode) => (
                                      <ReactCountryFlag
                                        key={countryCode}
                                        className="country-flag"
                                        countryCode={countryCode}
                                        svg
                                      />
                                    ))
                                  ) : (
                                    <ReactCountryFlag
                                      className="country-flag"
                                      countryCode={language.countryCode}
                                      svg
                                    />
                                  )}
                                </div>
                                {language.name}
                                {selectedLanguage === language.name ? (
                                  <Check size={20} />
                                ) : (
                                  <div></div>
                                )}
                              </Button>
                            ))}
                          </Col>
                        </Row>
                        <Row style={{ textAlign: "center", marginTop: "20px" }}>
                          <Col>
                            {/* <h4>Selected Language: {selectedLanguage}</h4> */}
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={SignatureModal}
        toggle={() => setSignatureModal(!SignatureModal)}
        className="modal-dialog-centered modal-lg"
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!SignatureModal)}></ModalHeader> */}
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <SignatureModalContentProfile
            user_id_user={user?.user_id}
            user_email={user?.email}
            user_first_name={user?.first_name}
            user_last_name={user?.last_name}
            initialsBox={initialBox}
            profile={true}
            returnedSignature={placeImage}
            modalClose={() => {
              setSignatureModal(!SignatureModal);
            }} //  file_id={file_id}
          />
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDeleteFile}
        callBackFunc={DeleteSignature}
        alertStatusDelete={"delete"}
        text="Are you sure you want to delete this Signature?"
      />
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation1}
        toggleFunc={() => setItemDeleteConfirmation1(!itemDeleteConfirmation1)}
        loader={loadingDeleteFile}
        callBackFunc={DeleteSignature1}
        alertStatusDelete={"delete"}
        text="Are you sure you want to delete this Initials?"
      />
    </div>
  );
};

export default MyAccount;
