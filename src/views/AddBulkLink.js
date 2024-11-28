// ** React Imports
import { Fragment, useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toastAlert from "@components/toastAlert";

// ** Third Party Components
import "@styles/react/libs/flatpickr/flatpickr.scss";
import pdfIcon from "../assets/images/pages/pdfIcon.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// ** Utils

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardBody,
  Spinner,
  Button,
  Modal,
  ModalBody,
  UncontrolledTooltip,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
// import SidebarNewUsers from './Sidebar'
// import { columns } from './columns'
import { ArrowLeft, ArrowUp, HelpCircle, Info, X } from "react-feather";
import { FrontendBaseUrl, post, postFormDataPdf } from "../apis/api";
import FileUploaderBulkLink from "../components/upload-file/FileUploaderBulkLink";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import getActivityLogUserBulk from "../utility/IpLocation/MaintainActivityLogBulkLink";
import { selectPrimaryColor } from "../redux/navbar";
import { decrypt } from "../utility/auth-token";
import CustomButton from "../components/ButtonCustom";
import OverLayFullScreen from "../components/OverLayFullScreen";
import { useTranslation } from "react-i18next";
const AddBulkLink = () => {
  const dispatch = useDispatch();
  const { user, plan, docuemntsCount, status, error } = useSelector(
    (state) => state.navbar
  );
  const primary_color = useSelector(selectPrimaryColor);

  const [selectedOption, setSelectedOption] = useState("Unlimited");
  const [responseLimit, setResponseLimit] = useState(1);
  const [formikValues, setFormikValues] = useState(null);
  const [FileSelected, setFileSelected] = useState(null);
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [modalSize, setModalSize] = useState("md");

  const [signerFunctionalControlsR, setSignerFunctionalControlsR] =
    useState(false);
  const [userEmailVerification, setUserEmailVerification] = useState(false);
  const [allowDownloadAfterSubmission, setAllowDownloadAfterSubmission] =
    useState(true);
  const [receivePdfCopy, setReceivePdfCopy] = useState(true);
  const [expiresInOption, setExpiresInOption] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bulk_link_id, setBulk_link_id] = useState("");

  const [picker, setPicker] = useState(new Date());
  // Function to format the date as "22 September 2023"

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ** Function to toggle sidebar
  const validationSchema = Yup.object().shape({
    title: Yup.string().nullable().required("Please enter title "),
    welcome_message: Yup.string()
      .nullable()
      .required("Please enter welcome message"),
    acknowledgement_message: Yup.string()
      .nullable()
      .required("Please enter acknowledgement message"),
    // // response: Yup.string().required('response is required'),
    // link_response_limit: Yup.string().required('link_response_limit is required'),
    // // total_responses: Yup.string().required('total_responses is required'),
    // // date: Yup.string().required('date is required'),
    // expiry_date: Yup.string().required('expiry_date is required'),
    // file_name: Yup.string().required('file_name is required'),
    // url: Yup.string().required('url is required'),
    // status: Yup.string().required('status is required'),
  });
  // useEffect(() => {
  //   const encryptedData = localStorage.getItem("user_data");
  //   console.log("encryptedData");

  //   console.log(encryptedData);
  //   if (encryptedData) {
  //     try {
  //       const decryptedData = JSON.parse(decrypt(encryptedData));
  //       const { token, user_id } = decryptedData;
  //       console.log(decryptedData);

  //       // Fetch user data if not already available in Redux state
  //       if (token && user_id && !user) {
  //         dispatch(getUser({ user_id, token }));
  //       }
  //     } catch (error) {
  //       console.error("Error processing token data:", error);
  //     }
  //   }
  // }, [dispatch, user]);

  return (
    <Fragment>
      {/* {window.innerWidth < 730 ? (
        
        <OverLayFullScreen/>
       
    ) : (
      <> */}
      <Card>
        <CardBody className="invoice-list-table">
          <div style={{ display: "flex" }}>
            <ArrowLeft
              size={20}
              onClick={() => {
                window.location.href = "/public_forms";
              }}
              style={{ cursor: "pointer" }}
            />
            <h1 style={{ marginLeft: "20px", fontWeight: 700 }}>
              Add Public Form
            </h1>
          </div>

          <Formik
            initialValues={{
              title: "",
              welcome_message: "Welcome to RequireSign",
              acknowledgement_message:
                "By proceeding, I agree to sign electronically, with my e-signature carrying legal validity.",
              // response: '',
              link_response_limit: "",
              // total_responses: '',
              // date: new Date(),
              // expiry_date: new Date(),
              // file_name: '',
              // url: '',
              // status: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              // Call your API here
              console.log(values);
              setSubmitting(true);

              let user_id = user?.user_id;
              let email_d = user?.email;
              if (FileSelected === null || FileSelected === undefined) {
                toastAlert("error", "Please upload file to continue!");
                return;
              }
              const postData = {
                image: FileSelected,
                user_id: user_id,
              };
              try {
                const apiData = await postFormDataPdf(postData, (progress) => {
                  console.log(progress);
                }); // Specify the endpoint you want to call
                //console.log(apiData);
                if (apiData.error === true || apiData.error === "true") {
                  //console.log('Error uploading Files');
                  toastAlert("error", "Error uploading File");
                } else {
                  //console.log('apiData.path');

                  //console.log(apiData.path);
                  let file_url = apiData.public_url;
                  const locationD = await getUserLocation();
                  const postData2 = {
                    user_id: user_id,
                    title: values.title,
                    welcome_message: values.welcome_message,
                    acknowledgement_message: values.acknowledgement_message,
                    limit_responses: selectedOption,
                    link_response_limit: responseLimit,
                    // total_responses: values.total_responses,
                    expires_option: expiresInOption,
                    expiry_date: picker,
                    signer_functional_controls: signerFunctionalControlsR,
                    user_email_verification: userEmailVerification,
                    allow_download_after_submission:
                      allowDownloadAfterSubmission,
                    users_receive_copy_in_email: receivePdfCopy,
                    location_date: locationD.date,
                  };
                  const apiData2 = await post(
                    "bulk_links/bulk_link",
                    postData2
                  ); // Specify the endpoint you want to call
                  //console.log('apixxsData');

                  //console.log(apiData2);
                  setSubmitting(false);

                  if (apiData2.error) {
                    toastAlert("error", "Something went wrong");
                    //console.log('error', apiData2.errorMessage);
                  } else {
                    const bulk_link_id = apiData2?.result?.bulk_link_id;
                    //console.log('success', apiData2?.result?.bulk_link_id);
                    setBulk_link_id(apiData2?.result?.bulk_link_id);
                    toastAlert("success", "Public Form Added Successfully");
                    const location = await getUserLocation();
                    const postData = {
                      bulk_link_id: bulk_link_id,
                      // images: pageImages,
                      file_name: values.title,
                      file_url: file_url,
                      url: `${FrontendBaseUrl}public-form/esign/${bulk_link_id}`,
                      location_country: location.country,
                      ip_address: location.ip,
                      location_date: location.date,
                      timezone: location?.timezone,
                      email: email_d,
                    };
                    try {
                      const apiData3 = await post(
                        "bulk_links/addBulkLinksBgImgs",
                        postData
                      );
                      //console.log('Get By Bulk Link ');
                      //console.log(apiData3);
                      if (apiData3.error) {
                        //console.log('error', apiData3.message);
                      } else {
                        // const file_idData = apiData3.data.file_id;
                        const user_id = user?.user_id;
                        const email = user?.email;

                        let response_log = await getActivityLogUserBulk({
                          user_id: user_id,
                          file_id: bulk_link_id,
                          email: email,
                          event: "PUBLIC-FORM-CREATED",
                          description: `${email} created Public Form  ${values.title}`,
                        });
                        if (response_log === true) {
                          //console.log('MAINTAIN LOG SUCCESS');
                        } else {
                          //console.log('MAINTAIN ERROR LOG');
                        }
                        setTimeout(() => {
                          //console.log('dshjdsh');
                          localStorage.setItem(
                            "@images",
                            JSON.stringify({
                              urls: file_url,
                              type: "pdf",
                              file_id: bulk_link_id,
                            })
                          );
                          window.location.href = `/e-sign-form-create/${bulk_link_id}`;
                        }, 1000);
                      }
                    } catch (error) {
                      //console.log('Error fetching data:', error);
                    }
                    // setShow(true)
                  }
                  // if pushed
                }
              } catch (error) {
                console.error("Error uploading file:", error);
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
                    <Col md="3"></Col>
                    <Col md="6">
                      {FileSelected === null ? (
                        <div
                          style={{
                            border: isHovered
                              ? `3px dashed ${primary_color}`
                              : "3px dashed grey",
                            cursor: "pointer",
                            borderRadius: "10px",
                            padding: "30px",
                            marginBottom: "20px",
                            position: "relative",
                            //  backgroundColor: isHovered ? '#eeeeee' : 'transparent',
                            transition: "border 0.3s ease",
                          }}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          <FileUploaderBulkLink
                            // bulk_link_id={bulk_link_id}
                            formikValues={formikValues}
                            // subFolder={subFolderId}
                            //  onlySigner={onlySigner}
                            onDataReceived={(item) => {
                              // setModalSize(item)
                              console.log(item);
                              setFileSelected(item);
                              const title = item.name
                                .toLowerCase()
                                .endsWith(".pdf")
                                ? item.name.slice(0, -4) // Remove last 4 characters (".pdf")
                                : item.name;
                              setFieldValue("title", title);
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center flex-column"
                          style={{
                            border: "3px dashed grey",
                            borderRadius: "10px",
                            padding: "10px",
                            marginBottom: "10px",
                            position: "relative",
                          }}
                        >
                          <img
                            src={pdfIcon}
                            alt="pdf icon"
                            style={{ width: "100px", height: "auto" }}
                          />
                          <X
                            id="close"
                            onClick={() => setFileSelected(null)}
                            size={15}
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              top: 5,
                              right: 5,
                            }}
                          />
                          <UncontrolledTooltip placement="top" target="close">
                            {t("Remove File")}
                          </UncontrolledTooltip>
                          <h2
                            style={{
                              fontSize: "16px",
                              textAlign: "center",
                              marginTop: "5%",
                              color: "grey",
                            }}
                          >
                            {FileSelected?.name}
                          </h2>
                        </div>
                      )}

                      <h3 for="title">
                        {t("Title")}
                        <span style={{ color: "red" }}>*</span>
                      </h3>
                      <Input
                        style={{ fontSize: "16px", boxShadow: "none" }}
                        className={`form-control ${
                          touched.title && errors.title ? "is-invalid" : ""
                        }`}
                        {...getFieldProps("title")}
                        id="title"
                        placeholder={t("Enter Title")}
                      />
                      {touched.title && errors.title ? (
                        <div className="invalid-feedback">{errors.title}</div>
                      ) : null}
                      <h3 for="welcome_message" style={{ marginTop: "15px" }}>
                        {t("Welcome Message")}
                        <span style={{ color: "red" }}>*</span>
                      </h3>

                      <Input
                        style={{ fontSize: "16px", boxShadow: "none" }}
                        className={`form-control ${
                          touched.welcome_message && errors.welcome_message
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("welcome_message")}
                        type="textarea"
                        id="welcome_message"
                        name="welcome_message"
                        rows="3"
                        placeholder={t("Enter Welcome Message")}
                      />
                      {touched.welcome_message && errors.welcome_message ? (
                        <div className="invalid-feedback">
                          {errors.welcome_message}
                        </div>
                      ) : null}
                      <h3
                        for="acknowledgement_message"
                        style={{ marginTop: "15px" }}
                      >
                        {t("Acknowledgement Message")}
                        <span style={{ color: "red" }}>*</span>
                      </h3>

                      <Input
                        style={{ fontSize: "16px", boxShadow: "none" }}
                        className={`form-control ${
                          touched.acknowledgement_message &&
                          errors.acknowledgement_message
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("acknowledgement_message")}
                        type="textarea"
                        id="acknowledgement_message"
                        name="acknowledgement_message"
                        rows="3"
                        placeholder={t("Enter Acknowledgement Message")}
                      />
                      {touched.acknowledgement_message &&
                      errors.acknowledgement_message ? (
                        <div className="invalid-feedback">
                          {errors.acknowledgement_message}
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "15px" }}>
                    <Col md="3"></Col>
                    <Col md="6">
                      <h2 className="fw-bold">Settings</h2>
                      <Row>
                        <Col md="8">
                          <h3 for="response" style={{ marginTop: "15px" }}>
                            {t("Link Response Limit")}{" "}
                            <span style={{ color: "red" }}>*</span>
                            <HelpCircle
                              size={20}
                              id="InfoResponseLimit"
                              style={{ marginLeft: "10px", cursor: "pointer" }}
                            />
                            <UncontrolledTooltip
                              placement="top"
                              target="InfoResponseLimit"
                            >
                              {t("Set as unlimited or limit # of responses.")}
                            </UncontrolledTooltip>
                          </h3>
                        </Col>
                        <Col md="4" xs={12}>
                          {/* Radio button for unlimited and limited option for response */}

                          <div
                            style={{
                              display: "flex",
                              flexDirection:
                                window.innerWidth < 730 ? "column" : "row",
                            }}
                          >
                            <div className="form-check">
                              <Input
                                type="radio"
                                id="ex1-active"
                                name="ex1"
                                value="Limited"
                                checked={selectedOption === "Limited"}
                                onChange={handleOptionChange}
                              />
                              <h3
                                onClick={() =>
                                  handleOptionChange({
                                    target: { value: "Limited" },
                                  })
                                }
                                style={{ fontSize: "16px" }}
                                className="form-check-label"
                                for="ex1-active"
                              >
                                {t("Limited")}
                              </h3>
                            </div>
                            <div
                              className="form-check"
                              style={{
                                marginLeft:
                                  window.innerWidth < 730 ? 0 : "10px",
                              }}
                            >
                              <Input
                                type="radio"
                                name="ex1"
                                id="ex1-inactive"
                                value="Unlimited"
                                checked={selectedOption === "Unlimited"}
                                onChange={handleOptionChange}
                                defaultChecked
                              />
                              <h3
                                onClick={() =>
                                  handleOptionChange({
                                    target: { value: "Unlimited" },
                                  })
                                }
                                style={{ fontSize: "16px" }}
                                className="form-check-label"
                                for="ex1-inactive"
                              >
                                {t("Unlimited")}
                              </h3>
                            </div>
                          </div>
                          {selectedOption === "Limited" ? (
                            <Input
                              size="sm"
                              style={{
                                fontSize: "16px",
                                boxShadow: "none",
                              }}
                              type="number"
                              id="response"
                              value={responseLimit}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (value < 1) {
                                  setResponseLimit(1);
                                } else {
                                  setResponseLimit(value);
                                }
                              }}
                              name="response"
                              placeholder={t("Enter Maximum Limit")}
                              min="1" // HTML attribute to set minimum input value
                            />
                          ) : null}
                        </Col>
                        {/* <Col md='10'>
                          <h3 style={{ marginBlock: '3%' }}>Signer Functional Controls</h3>
                        </Col>
                        <Col md='2'>
                          <div style={{ marginBlock: '3%' }} className='form-switch form-check-success'>
                            <Input type='switch' id='switch-success' name='success' checked={signerFunctionalControlsR} onChange={() => setSignerFunctionalControlsR(!signerFunctionalControlsR)} />
                          </div>
                        </Col> */}
                        <Col xs={12}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ display: "flex" }}>
                              <h3 style={{ marginBlock: "3%" }}>
                                {t("User Email Verification")}
                              </h3>
                              <HelpCircle
                                size={20}
                                id="InfoEmailVerify"
                                style={{
                                  marginLeft: "10px",
                                  cursor: "pointer",
                                }}
                              />
                              <UncontrolledTooltip
                                placement="top"
                                target="InfoEmailVerify"
                              >
                                {t(
                                  "Turn on if you would like OTP sent for signer to verify before accessing document."
                                )}
                              </UncontrolledTooltip>
                            </div>
                            <div className="form-switch form-check-success">
                              <Input
                                type="switch"
                                id="switch-success"
                                name="success"
                                checked={userEmailVerification}
                                onChange={() =>
                                  setUserEmailVerification(
                                    !userEmailVerification
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>

                        <Col
                          md="6"
                          style={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                          }}
                        >
                          <h3 style={{ marginBlock: "3%" }}>
                            {t("Expired in")}
                          </h3>
                          <HelpCircle
                            size={20}
                            id="InfoExpiration"
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                          <UncontrolledTooltip
                            placement="top"
                            target="InfoExpiration"
                          >
                            {t(
                              "Turn on to set date expiration for this document."
                            )}
                          </UncontrolledTooltip>
                        </Col>
                        {expiresInOption ? (
                          <>
                            {/* <Col md='8'>
                          </Col> */}
                            <Col md="4">
                              <DatePicker
                                selected={picker} // The selected date
                                onChange={(date) => setPicker(date)} // Set the selected date
                                dateFormat="dd MMMM yyyy" // Format of the date in the picker UI
                                customInput={
                                  <input
                                    style={{
                                      fontSize: "16px",
                                      boxShadow: "none",
                                    }}
                                    className="form-control"
                                    value={formatDate(picker)} // Display formatted date
                                    readOnly // Make the input field read-only
                                  />
                                }
                                minDate={new Date()} // Set the minimum date to today
                              />
                              {/* <input
                                style={{
                                  fontSize: "16px",
                                  boxShadow: "none",
                                }}
                                type="date"
                                value={picker.toISOString().substring(0, 10)}
                                onChange={(event) => {
                                  setPicker(new Date(event.target.value));
                                  //console.log(event.target.value);
                                }}
                                min={new Date().toISOString().substring(0, 10)}
                                className="form-control"
                                id="expiry_date"
                              /> */}
                              {/* <Flatpickr
                                style={{
                                  fontSize: '16px',
                                  bosShadow: 'none',
                                }}
                                value={picker}
                                onChange={date => {
                                  setPicker(new Date(date));
                                  //console.log(date);
                                }}
                                minDate="today"
                                // {...getFieldProps('expiry_date')}
                                className={`form-control `}
                                id="expiry_date"
                              /> */}
                            </Col>
                          </>
                        ) : (
                          <Col md="4"></Col>
                        )}
                        <Col
                          md="2"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div className="form-switch form-check-success">
                            <Input
                              type="switch"
                              id="switch-success"
                              name="success"
                              checked={expiresInOption}
                              onChange={() =>
                                setExpiresInOption(!expiresInOption)
                              }
                            />
                            {/* <Input style={{ marginBlock: '1%' }} className={`form-control ${touched.expiry_date && errors.expiry_date ? 'is-invalid' : ''}`}
                        {...getFieldProps('expiry_date')}
                        id='expiry_date' placeholder='Enter Expires' /> */}
                          </div>
                        </Col>

                        <Col md="10">
                          <h3 style={{ marginBlock: "3%" }}>
                            {t(
                              "Allow users to download document after submission"
                            )}
                          </h3>
                        </Col>
                        <Col
                          md="2"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div className="form-switch form-check-success">
                            <Input
                              type="switch"
                              id="switch-success"
                              name="success"
                              checked={allowDownloadAfterSubmission}
                              onChange={() =>
                                setAllowDownloadAfterSubmission(
                                  !allowDownloadAfterSubmission
                                )
                              }
                            />
                          </div>
                        </Col>
                        <Col md="10">
                          <h3 style={{ marginBlock: "3%" }}>
                            {t(
                              "Users to receive the copy of the PDF in the email"
                            )}
                          </h3>
                        </Col>
                        <Col
                          md="2"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div className="form-switch form-check-success">
                            <Input
                              type="switch"
                              id="switch-success"
                              name="success"
                              checked={receivePdfCopy}
                              onChange={() =>
                                setReceivePdfCopy(!receivePdfCopy)
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-center">
                    <CustomButton
                      padding={true}
                      size="sm"
                      disabled={isSubmitting}
                      type="submit"
                      color="primary"
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
                            {t("Save")}
                          </span>
                        </>
                      }
                      style={{
                        height: "40px",
                        fontSize: "16px",
                        boxShadow: "none",
                        marginLeft: "10px",
                        marginBottom: "1%",
                        marginTop: "1%",
                      }}
                    />
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </CardBody>
      </Card>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className={`modal-dialog-centered ${modalSize}`}
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' ></ModalHeader> */}
        <ModalBody className="px-sm-5 mx-50 pb-2 pt-2">
          {/* <h1 className='text-center mb-1 fw-bold'>Upload Document</h1>
          <h4 className='text-center'>Add pdf file to continue</h4> */}
          <Row tag="form" className="gy-1 gx-1 mt-75">
            <Col xs={12}>
              {/* Upload Document  */}

              <FileUploaderBulkLink
                // bulk_link_id={bulk_link_id}
                formikValues={formikValues}
                // subFolder={subFolderId}
                //  onlySigner={onlySigner}
                onDataReceived={(item) => {
                  setModalSize(item);
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5%",
                }}
              >
                {/* {modalSize==="modal-xl"?null :<Button size="sm"  style={{boxShadow:'none',fontSize:'16px'}} color='danger'  
            onClick={()=>{
              setShow(!show)
              window.location.href = '/bulklinks'
            

            }}
            >
                  Upload Later
                </Button>} */}
              </div>
            </Col>

            {/* <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary'>
                Submit
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setShow(!show)
                  reset()
                }}
              >
                Cancel
              </Button>
            </Col> */}
          </Row>
        </ModalBody>
      </Modal>

      {/* <SidebarNewUsers open={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
    </Fragment>
  );
};

export default AddBulkLink;
