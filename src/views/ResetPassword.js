// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// ** Icons Imports

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Input,
  Button,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/two-steps-verification-illustration.png";
import illustrationsDark from "@src/assets/images/pages/two-steps-verification-illustration-dark.png";
import logoRemoveBg from "@src/assets/images/pages/logoRemoveBg.png";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { post, put } from "../apis/api";
import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";
import ModalReusable from "../components/ModalReusable";
import CustomButton from "../components/ButtonCustom";

const ResetPassword = () => {
  const [modal, setModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);

  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const validationSchema = Yup.object().shape({
    password: Yup.string().nullable().required("Password is required"),
    confirm_password: Yup.string()
      .nullable()
      .required("Please Confirm your Password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });
  // Resent Verification Link
  const [loadingResend, setLoadingResend] = useState(false);
  const [emailData, setEmailData] = useState("");
  const [emailField, setEmailField] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const email = urlParams.get("email");
  const company_id_route = urlParams.get("company_id");
  const handleResent = async () => {
    setLoadingResend(true);
    //console.log(emailData);
    const postData = {
      email: emailData,
    };
    const apiData = await post("user/resendRegistrationLink", postData); // Specify the endpoint you want to call
    //console.log(apiData);
    if (apiData.error) {
      toastAlert("error", apiData.message);
      setLoadingResend(false);
      setModal(false);
    } else {
      setLoadingResend(false);
      toastAlert("success", apiData.message);
      setModal(false);

    }
  };
  const [loaderData, setLoaderData] = useState(true);
  // const [emailData,setEmailData]=useState("")
  const handleCheckToken = async () => {
    // console.log("AAAAAAAAAAAAAAAAAAA");
    // console.log("token", token);
    if (token === null) {
      setLoaderData(false);
      //console.log("TOKEN NULL >> UPDATE COMPANY USER PASSWORD")
      //console.log(company_id_route)
      const postData = {
        company_id: company_id_route,
      };
      const apiData = await post(
        "user/checkTokenValidUpdatePassword",
        postData
      ); // Specify the endpoint you want to call
      //console.log(apiData);
      if (apiData.error) {
        window.location.href="/error"
      } else {
        setLoaderData(false);
      }
      // token not found
    } else {
      const postData = {
        verifyId: token,
      };
      const apiData = await post(
        "user/checkTokenValidUpdatePassword",
        postData
      ); // Specify the endpoint you want to call
      // console.log(apiData);
      if (apiData.error) {
        window.location.href="/error"
      } else {
        setEmailField(apiData.userData);
        setLoaderData(false);
      }
      // token not found
    }
  };
  useEffect(() => {
    handleCheckToken();
  }, []);
  return (
    <>
      {loaderData ? (
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"20px"}}><Spinner color="primary"/></div>
      ) : (
        <>
        {window.innerWidth>768?
        
        <div className="auth-wrapper auth-cover">
          <Row className="auth-inner m-0">
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              <img
                src={logoRemoveBg}
                alt="Login Cover"
                style={{ width: "200px", height: "auto" }}
              />
              {/* <h2 className='brand-text text-primary ms-1'>Vuexy</h2> */}
            </Link>
            <Col
              className="d-none d-lg-flex align-items-center p-5"
              lg="6"
              md="6"
              sm="12"
            >
              <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                <img className="img-fluid" src={source} alt="Login Cover" />
              </div>
            </Col>
            <Col
              className="d-flex align-items-center auth-bg px-2 p-lg-5"
              lg="6"
              sm="12"
            >
              <Col className="px-xl-2 mx-auto" sm="12" xs="12" md="8" lg="8">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <img  src={logoRemoveBg} alt="Login Cover" style={{width:'200px',height:'auto'}} /> */}
                </div>
                <CardTitle tag="h2" className="fw-bold mb-1">
                  {token === null ? "Reset Password" : " Update Password"}
                </CardTitle>
                {/* <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText> */}
                <Formik
                  initialValues={{
                    password: localStorage.getItem("userPasword") || "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    // Call your API here
                    //console.log(values);
                    setSubmitting(true);
                    if (token === null) {
                      const postData = {
                        email: email,
                        password: values.password,
                      };
                      const apiData = await put(
                        "user/updatePassword",
                        postData
                      ); // Specify the endpoint you want to call
                      //console.log('apixxsData');

                      //console.log(apiData);
                      if (apiData.error) {
                        // toastAlert("error", apiData.message)
                        setModalError(true);
                      } else {
                        setSubmitting(false);

                        setModalSuccess(true);
                        // toastAlert("success", apiData.message)
                        setTimeout(() => {
                          window.location.href = "/login";
                          // 5 seconds
                        }, 2000);
                      }
                    } else {
                      const postData = {
                        token: token,
                        password: values.password,
                      };
                      const apiData = await post(
                        "user/updatePasswordBytoken",
                        postData
                      ); // Specify the endpoint you want to call
                      //console.log('apixxsData');

                      //console.log(apiData);
                      if (apiData.error) {
                        // toastAlert("error", apiData.message)
                        setModalError(true);
                      } else {
                        setSubmitting(false);

                        setModalSuccess(true);
                        // toastAlert("success", apiData.message)
                        setTimeout(() => {
                          window.location.href = "/login";
                          // 5 seconds
                        }, 2000);
                      }
                    }
                  }}
                >
                  {({ getFieldProps, errors, touched, isSubmitting }) => (
                    <Form className="auth-login-form mt-2">
                      <div className="mb-1">
                        <Label className="form-label" for="register-email">
                          Email
                        </Label>
                        <Input
                          style={{ fontSize: "14px", boxShadow: "none" }}
                          value={emailField}
                          disabled
                          type="email"
                          id="register-email"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="mb-1">
                        <div className="d-flex justify-content-between">
                          <Label className="form-label" for="login-password">
                            Password
                          </Label>
                        </div>
                        <InputPasswordToggle
                          style={{ fontSize: "14px" }}
                          className={`input-group-merge ${
                            touched.password && errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                          {...getFieldProps("password")}
                          id="login-password"
                        />
                        {touched.password && errors.password ? (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        ) : null}
                      </div>
                      <div className="mb-1">
                        <div className="d-flex justify-content-between">
                          <Label className="form-label" for="login-password">
                            Confirm Password
                          </Label>
                        </div>
                        <InputPasswordToggle
                          style={{ fontSize: "14px" }}
                          className={`input-group-merge ${
                            touched.confirm_password && errors.confirm_password
                              ? "is-invalid"
                              : ""
                          }`}
                          {...getFieldProps("confirm_password")}
                          id="login-password"
                        />
                        {touched.confirm_password && errors.confirm_password ? (
                          <div className="invalid-feedback">
                            {errors.confirm_password}
                          </div>
                        ) : null}
                      </div>
                      <CustomButton
                          // color="primary"
                          size="md"
                          style={{
                            boxShadow: "none",
                            marginTop: "10px",
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          type="submit"
                          disabled={isSubmitting}
                          text={
                            <>
                              {isSubmitting ? (
                                <Spinner color="light" size="sm" />
                              ) : null}
                              <span className="align-middle ms-25" style={{fontSize:"15px",paddingBlock:"4px"}}>
                          {" "}
                          {token === null
                            ? "Reset Password"
                            : "Update Password"}
                        </span>
                            </>
                          }
                        />
                     
                    </Form>
                  )}
                </Formik>
                {/* Modal  */}
                <Modal
                  isOpen={modal}
                  toggle={() => setModal(false)}
                  className="modal-dialog-centered"
                  modalClassName="primary"
                  key="success"
                >
                  <ModalHeader toggle={() => setModal(false)}>
                    Non Verified Account
                  </ModalHeader>
                  <ModalBody>
                    Please verify your account by clicking the verification link
                    in your email to unlock benefits. If you didnot receive the
                    email, please click the button below to resend the
                    verification link.
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      disabled={loadingResend}
                      color="primary"
                      onClick={handleResent}
                    >
                      {loadingResend ? (
                        <Spinner color="light" size="sm" />
                      ) : null}
                      <span className="align-middle ms-25">
                        Resent Verification Link
                      </span>
                    </Button>
                  </ModalFooter>
                </Modal>
               
              </Col>
            </Col>
          </Row>
          {/* Success Send email Modal  */}
          <ModalReusable
            isOpen={modalSuccess}
            success={true}
            successMessageData={[
              "Password Updated Successfully .",
              "Now you can login with your new password.",
            ]}
            errorMessageData="Can't Update Password Right Now."
            toggleFunc={() => setModalSuccess(!modalSuccess)}
          />
          {/* Error success email modal  */}
          <ModalReusable
            isOpen={modalError}
            success={false}
            toggleFunc={() => setModalError(!modalError)}
          />
        </div>:
        <div className="auth-wrapper auth-cover" >
        <Row className="auth-inner m-0" >
        
            <Col className="px-xl-2 d-flex  my-auto auth-bg bg-white" sm="12" xs="12" md="8" lg="8" style={{flexDirection:"column"}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img  src={logoRemoveBg} alt="Login Cover" style={{width:'200px',height:'50px',objectFit:"contain",marginBottom: '20px',}} />
              </div>
             
              <CardTitle tag="h2" className="fw-bold mb-1" style={{textAlign:"center"}}>
                  <h1 style={{textAlign: 'center', fontWeight: 900, color: '#115fa7'}}> {token === null ? "Reset Password" : " Update Password"}</h1> 
                  <h3 style={{fontSize:"14px",marginTop:"15px"}}>Choose a new password to secure your account</h3> 
                  </CardTitle>
              {/* <CardText className="mb-2">
            Please sign-in to your account and start the adventure
          </CardText> */}
              <Formik
                initialValues={{
                  password: localStorage.getItem("userPasword") || "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  // Call your API here
                  //console.log(values);
                  setSubmitting(true);
                  if (token === null) {
                    const postData = {
                      email: email,
                      password: values.password,
                    };
                    const apiData = await put(
                      "user/updatePassword",
                      postData
                    ); // Specify the endpoint you want to call
                    //console.log('apixxsData');

                    //console.log(apiData);
                    if (apiData.error) {
                      // toastAlert("error", apiData.message)
                      setModalError(true);
                    } else {
                      setSubmitting(false);

                      setModalSuccess(true);
                      // toastAlert("success", apiData.message)
                      setTimeout(() => {
                        window.location.href = "/login";
                        // 5 seconds
                      }, 2000);
                    }
                  } else {
                    const postData = {
                      token: token,
                      password: values.password,
                    };
                    const apiData = await post(
                      "user/updatePasswordBytoken",
                      postData
                    ); // Specify the endpoint you want to call
                    //console.log('apixxsData');

                    //console.log(apiData);
                    if (apiData.error) {
                      // toastAlert("error", apiData.message)
                      setModalError(true);
                    } else {
                      setSubmitting(false);

                      setModalSuccess(true);
                      // toastAlert("success", apiData.message)
                      setTimeout(() => {
                        window.location.href = "/login";
                        // 5 seconds
                      }, 2000);
                    }
                  }
                }}
              >
                {({ getFieldProps, errors, touched, isSubmitting }) => (
                  <Form className="auth-login-form mt-2">
                    <div className="mb-1">
                      <Label className="form-label" for="register-email">
                        Email
                      </Label>
                      <Input
                        style={{ fontSize: "14px", boxShadow: "none" }}
                        value={emailField}
                        disabled
                        type="email"
                        id="register-email"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="mb-1">
                      <div className="d-flex justify-content-between">
                        <Label className="form-label" for="login-password">
                          Password
                        </Label>
                      </div>
                      <InputPasswordToggle
                        style={{ fontSize: "14px" }}
                        className={`input-group-merge ${
                          touched.password && errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("password")}
                        id="login-password"
                      />
                      {touched.password && errors.password ? (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-1">
                      <div className="d-flex justify-content-between">
                        <Label className="form-label" for="login-password">
                          Confirm Password
                        </Label>
                      </div>
                      <InputPasswordToggle
                        style={{ fontSize: "14px" }}
                        className={`input-group-merge ${
                          touched.confirm_password && errors.confirm_password
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("confirm_password")}
                        id="login-password"
                      />
                      {touched.confirm_password && errors.confirm_password ? (
                        <div className="invalid-feedback">
                          {errors.confirm_password}
                        </div>
                      ) : null}
                    </div>
                    <CustomButton
                        // color="primary"
                        size="md"
                        style={{
                          boxShadow: "none",
                          marginTop: "10px",
                          display: "flex",
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        type="submit"
                        disabled={isSubmitting}
                        text={
                          <>
                            {isSubmitting ? (
                              <Spinner color="light" size="sm" />
                            ) : null}
                            <span className="align-middle ms-25" style={{fontSize:"15px",paddingBlock:"4px"}}>
                        {" "}
                        {token === null
                          ? "Reset Password"
                          : "Update Password"}
                      </span>
                          </>
                        }
                      />
                   
                  </Form>
                )}
              </Formik>
              {/* Modal  */}
              <Modal
                isOpen={modal}
                toggle={() => setModal(false)}
                className="modal-dialog-centered"
                modalClassName="primary"
                key="success"
              >
                <ModalHeader toggle={() => setModal(false)}>
                  Non Verified Account
                </ModalHeader>
                <ModalBody>
                  Please verify your account by clicking the verification link
                  in your email to unlock benefits. If you didnot receive the
                  email, please click the button below to resend the
                  verification link.
                </ModalBody>
                <ModalFooter>
                  <Button
                    disabled={loadingResend}
                    color="primary"
                    onClick={handleResent}
                  >
                    {loadingResend ? (
                      <Spinner color="light" size="sm" />
                    ) : null}
                    <span className="align-middle ms-25">
                      Resent Verification Link
                    </span>
                  </Button>
                </ModalFooter>
              </Modal>
             
            </Col>
       
        </Row>
        {/* Success Send email Modal  */}
        <ModalReusable
          isOpen={modalSuccess}
          success={true}
          successMessageData={[
            "Password Updated Successfully .",
            "Now you can login with your new password.",
          ]}
          errorMessageData="Can't Update Password Right Now."
          toggleFunc={() => setModalSuccess(!modalSuccess)}
        />
        {/* Error success email modal  */}
        <ModalReusable
          isOpen={modalError}
          success={false}
          toggleFunc={() => setModalError(!modalError)}
        />
      </div>}
        </>
      )}
    </>
  );
};

export default ResetPassword;
