// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Hooks
import * as Yup from "yup";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Label,
  Input,
  Button,
  Spinner,
  Card,
  CardBody,
} from "reactstrap";
import { post } from "../apis/api";

// ** Illustrations Imports

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import ModalReusable from "../components/ModalReusable";
import useLogo from "@uselogo/useLogo";
import ButtonCustomLogin from "../components/ButtonCustomLogin";
import CustomButton from "../components/ButtonCustom";

const ForgotPassword = () => {
  // ** Hooks
  const { compNameAPI, loading, logo } = useLogo();

  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaderData, setLoaderData] = useState(true);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .nullable()
      .email("Please enter a valid email address")
      .required("Email is required"),
  });
  useEffect(() => {
    const items = localStorage.getItem("user_data");
    if (items === "" || items === undefined || items === null) {
      // window.location.href = '/login'
      setLoaderData(false);
    } else {
      window.location.href = "/home";
    }
  }, []);
  return (
    <>
      {loaderData ? (
        <div></div>
      ) : (
        <>
          {window.innerWidth > 768 ? (
            <div className="auth-wrapper auth-cover">
              <Row className="auth-inner m-0">
                {/* <Link className="brand-logo" to="/" onClick={e => e.preventDefault()}>
             {loading ? null : <img src={logo} alt="Login Cover" style={{width: '200px', height: 'auto'}} />}
             </Link> */}
                {/* <Col className="d-none d-lg-flex align-items-center p-5" lg="6" sm="12">
               <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                 <img className="img-fluid" src={source} alt="Login Cover" />
               </div>
             </Col> */}
                
                <Col
                  className="d-flex align-items-center auth-bg px-2 p-lg-5"
                  lg="12"
                  sm="12"
                >
                  <Col
                    className="px-xl-2 mx-auto"
                    sm="12"
                    md="4"
                    lg="4"
                    xs="12"
                  >
                    <Card style={{ border: "1px solid #e7e6e6" }}>
                      <CardBody className="p-4">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "20px",
                          }}
                        >
                          {loading ? null : (
                            <img
                              src={logo}
                              alt="Login Cover"
                              style={{
                                width: "200px",
                                height: "auto",
                                marginBottom: 10,
                              }}
                            />
                          )}
                        </div>
                        <CardTitle
                          tag="h2"
                          className="fw-bold mb-1"
                          style={{ textAlign: "center" }}
                        >
                          <h1
                            style={{
                              textAlign: "center",
                              fontWeight: 900,
                              color: "#115fa7",
                            }}
                          >
                            {" "}
                            FORGOT PASSWORD? 🔒
                          </h1>
                          <h3 style={{ fontSize: "14px", marginTop: "15px" }}>
                            Please Enter your verified email
                          </h3>
                        </CardTitle>
                        {/* <CardText className="mb-2 form-label">
               Enter your email and we'll send you instructions to reset your
               password
             </CardText> */}
                        <Formik
                          initialValues={{
                            email: "",
                          }}
                          validationSchema={validationSchema}
                          onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            //console.log(values);
                        const emailD = values.email.trim().toLowerCase();

                            const postData = {
                              email: emailD,
                            };
                            const apiData = await post(
                              "user/forget-password",
                              postData
                            ); // Specify the endpoint you want to call
                            // console.log("apixxsData");

                            // console.log(apiData);
                            if (apiData.error) {
                              setSubmitting(false);
                              setModalError(true);
                              setErrorMessage(apiData.message);

                              // toastAlert("error", apiData.message)
                            } else {
                              setSubmitting(false);
                              // set localStorage
                              localStorage.setItem(
                                "otp",
                                JSON.stringify(apiData)
                              );
                              setModalSuccess(true);
                              // toastAlert("success", apiData.message)
                            }
                          }}
                        >
                          {({
                            getFieldProps,
                            errors,
                            touched,
                            isSubmitting,
                          }) => (
                            <Form
                              className="auth-forgot-password-form mt-2"
                              // onSubmit={(e) => e.preventDefault()}
                            >
                              <div className="mb-1">
                                <Label
                                  className="form-label"
                                  for="register-email"
                                >
                                  Email
                                </Label>
                                <Input
                                  style={{
                                    //  height: '50px',
                                    boxShadow: "none",
                                    fontSize: "14px",
                                  }}
                                  className={`form-control ${
                                    touched.email && errors.email
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  {...getFieldProps("email")}
                                  type="email"
                                  id="register-email"
                                  placeholder="john@example.com"
                                />
                                {touched.email && errors.email ? (
                                  <div className="invalid-feedback">
                                    {errors.email}
                                  </div>
                                ) : null}
                              </div>
                              {loading ? null : (
                                <>
                                <div style={{display:"flex",
                                justifyContent:"center",
                                alignItems:"center",
                                }}>

                              
                                  {compNameAPI === null ? (
                                    <CustomButton
                                    padding={true}
                                      style={{
                                        boxShadow: "none",
                                        display: "flex",
                                        justifyContent: "center",
                                        width:"70%",
                                        alignItems: "center",
                                        backgroundColor: "red",
                                      }}
                                      size="sm"
                                      type="submit"
                                      color="primary"
                                      block
                                      disabled={isSubmitting}
                                    text={<>
                                    {isSubmitting ? (
                                        <Spinner color="white" size="sm" />
                                      ) : null}
                                      <span
                                        className="align-middle ms-25"
                                        style={{ fontSize: "14px" }}
                                      >
                                        Send Verification Email
                                      </span> </>}
                                      />
                                     
                                  ) : (
                                    <ButtonCustomLogin
                                      size="sm"
                                      disabled={isSubmitting}
                                      text={
                                        <>
                                          {isSubmitting ? (
                                            <Spinner color="white" size="sm" />
                                          ) : null}
                                          <span className="align-middle ms-25">
                                            {" "}
                                            Send Verification Email
                                          </span>
                                        </>
                                      }
                                      padding={true}
                                      backgroundColor={
                                        compNameAPI?.primary_color
                                      }
                                    />
                                  )}
                                  </div></>
                              )}
                            </Form>
                          )}
                        </Formik>
                        <p className="text-center mt-2">
                          <Link to="/login">
                            <ChevronLeft
                              className="rotate-rtl me-25"
                              size={14}
                            />
                            <span className="align-middle form-label">
                              Back to login
                            </span>
                          </Link>
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                </Col>
                <Col
                  className="d-flex align-items-center auth-bg px-2 p-lg-5"
                  lg="3"
                  sm="12"
                ></Col>
              </Row>
              {/* Success Send email Modal  */}
            </div>
          ) : (
            <div className="auth-wrapper auth-cover ">
              <Row className="auth-inner m-0">
                {/* <Link className="brand-logo" to="/" onClick={e => e.preventDefault()}>
             {loading ? null : <img src={logo} alt="Login Cover" style={{width: '200px', height: 'auto'}} />}
             </Link> */}
                {/* <Col className="d-none d-lg-flex align-items-center p-5" lg="6" sm="12">
               <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                 <img className="img-fluid" src={source} alt="Login Cover" />
               </div>
             </Col> */}

                <Col
                  className=" d-flex  my-auto"
                  sm="12"
                  md="12"
                  lg="12"
                  xs="12"
                  style={{ flexDirection: "column" }}
                >
                  {/* <Card style={{border: '1px solid #e7e6e6'}}>
               <CardBody  className="p-4"> */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {loading ? null : (
                      <img
                        src={logo}
                        alt="Login Cover"
                        style={{
                          width: "200px",
                          height: "50px",
                          objectFit: "contain",
                          marginBottom: 10,
                        }}
                      />
                    )}
                  </div>
                  <CardTitle
                    tag="h2"
                    className="fw-bold mb-1"
                    style={{ textAlign: "center" }}
                  >
                    <h1
                      style={{
                        textAlign: "center",
                        fontWeight: 900,
                        color: "#115fa7",
                      }}
                    >
                      {" "}
                      FORGOT PASSWORD? 🔒
                    </h1>
                    <h3 style={{ fontSize: "14px", marginTop: "15px" }}>
                      Please Enter your verified email
                    </h3>
                  </CardTitle>

                  <Formik
                    initialValues={{
                      email: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      setSubmitting(true);
                      //console.log(values);
                      const emailD = values.email.trim().toLowerCase();

                      const postData = {
                        email:emailD,
                      };
                      const apiData = await post(
                        "user/forget-password",
                        postData
                      ); // Specify the endpoint you want to call
                      // console.log("apixxsData");

                      // console.log(apiData);
                      if (apiData.error) {
                        setSubmitting(false);
                        setModalError(true);
                        setErrorMessage(apiData.message);

                        // toastAlert("error", apiData.message)
                      } else {
                        setSubmitting(false);
                        // set localStorage
                        localStorage.setItem("otp", JSON.stringify(apiData));
                        setModalSuccess(true);
                        // toastAlert("success", apiData.message)
                      }
                    }}
                  >
                    {({ getFieldProps, errors, touched, isSubmitting }) => (
                      <Form className="auth-forgot-password-form mt-2">
                        <div className="mb-1">
                          <Label className="form-label" for="register-email">
                            Email
                          </Label>
                          <Input
                            style={{
                              //  height: '50px',
                              boxShadow: "none",
                              fontSize: "14px",
                            }}
                            className={`form-control ${
                              touched.email && errors.email ? "is-invalid" : ""
                            }`}
                            {...getFieldProps("email")}
                            type="email"
                            id="register-email"
                            placeholder="john@example.com"
                          />
                          {touched.email && errors.email ? (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          ) : null}
                        </div>
                        {loading ? null : (
                          <>
                            {compNameAPI === null ? (
                              <Button
                                style={{
                                  boxShadow: "none",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "red",
                                }}
                                size="sm"
                                type="submit"
                                color="primary"
                                block
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Spinner color="white" size="sm" />
                                ) : null}
                                <span
                                  className="align-middle ms-25"
                                  style={{ fontSize: "14px" }}
                                >
                                  Send Verification Email
                                </span>
                              </Button>
                            ) : (
                              <ButtonCustomLogin
                                size="sm"
                                disabled={isSubmitting}
                                text={
                                  <>
                                    {isSubmitting ? (
                                      <Spinner color="white" size="sm" />
                                    ) : null}
                                    <span className="align-middle ms-25">
                                      {" "}
                                      Send Verification Email
                                    </span>
                                  </>
                                }
                                padding={true}
                                backgroundColor={compNameAPI?.primary_color}
                              />
                            )}
                          </>
                        )}
                      </Form>
                    )}
                  </Formik>
                  <p className="text-center mt-2">
                    <Link to="/login">
                      <ChevronLeft className="rotate-rtl me-25" size={14} />
                      <span className="align-middle form-label">
                        Back to login
                      </span>
                    </Link>
                  </p>
                </Col>
              </Row>
              {/* Success Send email Modal  */}
            </div>
          )}
        </>
      )}
      <ModalReusable
        isOpen={modalSuccess}
        successMessageData={[
          "Please check your email",
          "for the link to update your password.",
        ]}
        errorMessageData="Can't send Update Password Link Right Now."
        success={true}
        toggleFunc={() => setModalSuccess(!modalSuccess)}
      />
      {/* Error success email modal  */}
      <ModalReusable
        isOpen={modalError}
        success={false}
        successMessageData={[
          "Please check your email",
          "for the link to update your password.",
        ]}
        errorMessageData={errorMessage}
        toggleFunc={() => setModalError(!modalError)}
      />
    </>
  );
};

export default ForgotPassword;
