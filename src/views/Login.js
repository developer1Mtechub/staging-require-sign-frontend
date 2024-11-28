// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// ** Icons Imports
import { Mail } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Spinner,
  Modal,
  ModalBody,
  CardBody,
  Card,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.png";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.png";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { post } from "../apis/api";
import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";
import ModalReusable from "../components/ModalReusable";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";
import { useDispatch } from "react-redux";
import { selectLoading, selectLogo, getUser } from "../redux/navbar";
import { useSelector } from "react-redux";

import { encrypt } from "../utility/auth-token";
import CustomButton from "../components/ButtonCustom";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
const Login = () => {
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);
  const [modal, setModal] = useState(false);
  // const {compNameAPI, loading, logo} = useLogo();

  const dispatch = useDispatch();
  const { skin } = useSkin();
  const [loaderData, setLoaderData] = useState(loading);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .nullable()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string().nullable().required("Password is required"),
  });
  // Resent Verification Link
  const [loadingResend, setLoadingResend] = useState(false);
  const [emailData, setEmailData] = useState("");

  const handleResent = async () => {
    setLoadingResend(true);
    //console.log(emailData);
    const postData = {
      email: emailData,
    };
    const apiData = await post("user/resendRegistrationLink", postData); // Specify the endpoint you want to call
    //console.log(apiData);
    if (apiData.error) {
      setModalError(true);
      // toastAlert("error", apiData.message)
      setLoadingResend(false);
      setModal(false);
    } else {
      setLoadingResend(false);
      // toastAlert("success", apiData.message)
      setModal(false);
      setModalSuccess(true);
    }
  };
  const [companyDetails, setCompanyDetails] = useState(null);
  const CheckSubdomainExistOrNotInUrl = async () => {
    const currentUrl = window.location.href;
    // Parse the URL
    const url = new URL(currentUrl);
    // Get the hostname (e.g., tsm.localhost)
    const hostname = url.hostname;
    // Split the hostname by '.' and get the first part (subdomain)
    const subdomain = hostname.split(".")[0];
    //console.log(subdomain);
    if (subdomain === "localhost") {
      // console.log("www");
      // localStorage.setItem('subdomain', 'www');
    } else {
      // console.log(subdomain);
      const postData = {
        subdomain_name: subdomain,
      };
      try {
        const apiData = await post(
          "company/get_company_by_subdomain",
          postData
        ); // Specify the endpoint you want to call
        //console.log('LOG');
        // console.log(apiData);
        if (apiData.error) {
          // console.log("ERROR");
        } else {
          // console.log("subdomain exist");
          // console.log(apiData.data);
          setCompanyDetails(apiData.data);
        }
      } catch (error) {
        // return null;
        console.log("ERROR", error);
      }
    }
  };
  useEffect(() => {
    const items = localStorage.getItem("user_data");
    getUserLocation();
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
        <div>
          <FullScreenLoader />
        </div>
      ) : (
        <>
          {window.innerWidth < 768 ? (
            <>
              <Row style={{ backgroundColor: "white" }}>
                <Col sm="12" md="12" lg="12">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100vh",
                      paddingInline: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      {loading ? (
                        <Spinner
                          color="primary"
                          size="sm"
                          style={{ marginTop: "20px" }}
                        />
                      ) : (
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
                    {/* <CardTitle tag="h1" className="fw-bold" style={{textAlign:"center"}}>
                   {loading ? null : (
                    <>
                      {compNameAPI === null ? ' Welcome to Require Sign!' : `Welcome to ${compNameAPI?.company_name}!`}
                    </>
                  )}                 </CardTitle> */}
                    <h1
                      style={{
                        textAlign: "center",
                        fontWeight: 900,
                        color: "#115fa7",
                      }}
                    >
                      LOGIN INTO ACCOUNT
                    </h1>
                    {/* <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText> */}
                    <Formik
                      initialValues={{
                        email: localStorage.getItem("userEmail") || "",
                        password: localStorage.getItem("userPasword") || "",
                        rememberMe:
                          localStorage.getItem("userEmail") ||
                          localStorage.getItem("userPasword")
                            ? true
                            : false,
                      }}
                      validationSchema={validationSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        // Call your API here
                        //console.log(values);
                        setSubmitting(true);
                        const emailD = values.email.trim().toLowerCase();

                        const postData = {
                          email: emailD,
                          password: values.password,
                        };
                        const apiData = await post("user/login", postData); // Specify the endpoint you want to call
                        // console.log("apixxsData");

                        // console.log(apiData);
                        if (apiData.error) {
                          if (apiData.errormsg === "NotVerifiedAccount") {
                            //console.log('NotVerifiedAccount');
                        const emailD = values.email.trim().toLowerCase();

                            setEmailData(emailD);
                            setModal(true);
                          } else if (apiData.errormsg === "invalid") {
                            //console.log('invalid');
                            setSubmitting(false);
                            toastAlert("error", apiData.message);
                          }
                          // setSubmitting(false);

                          // toastAlert("error", "No Images Selected")
                        } else {
                          // setSubmitting(false);
                          //console.log(values.rememberMe)
                          // If "Remember Me" is checked, store the user's email in localStorage
                          if (values.rememberMe === true) {
                        const emailD = values.email.trim().toLowerCase();

                            localStorage.setItem("userEmail", emailD);
                            localStorage.setItem(
                              "userPasword",
                              values.password
                            );
                          } else {
                            localStorage.removeItem("userEmail");
                            localStorage.removeItem("userPasword");
                          }
                          // redux add

                          // dispatch(getUser(apiData.data.user_id));
                          // localStorage.setItem(
                          //   '@UserLoginRS',
                          //   JSON.stringify({
                          //     token: apiData.data,
                          //     user_type: apiData.user_type,
                          //     password: values.password,
                          //   }),
                          // );
                          // localStorage.setItem(
                          //   'token',
                          //   JSON.stringify({user_id: apiData.data.user_id, token: apiData.token}),
                          // );
                          // const companyId = apiData.data.company_id;
                          // const action = await dispatch(getUser({user_id: apiData.data.user_id, token: apiData.token}));
                          // let user_profile = action.payload.result[0];
                          // console.log(user_profile);

                          // setSubmitting(false);
                          // Activity Log
                          const user_id = apiData.data.user_id;
                          const email = apiData.data.email;
                          const data = JSON.stringify({
                            token: apiData.token,
                            user_id: apiData.data.user_id,
                          });

                          // Encrypt the data
                          const encryptedData = encrypt(data);
                          // console.log("Encrypted:", encryptedData);
                          localStorage.setItem("user_data", encryptedData);

                          // console.log("apiData.data.user_id");
                          // console.log(apiData);
                          // const companyId = apiData.data.company_id;
                          const action = await dispatch(
                            getUser({
                              user_id: apiData.data.user_id,
                              token: apiData.token,
                            })
                          );
                          let response_log = await getActivityLogUser({
                            user_id: user_id,
                            event: "SIGN-IN",
                            description: `${email} signed in `,
                          });
                          if (response_log === true) {
                            //console.log("MAINTAIN LOG SUCCESS")
                          } else {
                            //console.log("MAINTAIN ERROR LOG")
                          }
                          // Activity Log End
                          window.location.href = "/home";

                          // toastAlert("success", "You can Edit document ")
                        }
                      }}
                    >
                      {({ getFieldProps, errors, touched, isSubmitting }) => (
                        <Form>
                          <div className="mb-1">
                            <Label className="form-label" for="login-email">
                              Email<span style={{ color: "red" }}> *</span>
                            </Label>
                            {/* <div class="max-w-sm space-y-3">
  <input type="text" class="py-0 px-1 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="This is placeholder"/>
</div> */}
                            <Input
                              style={{
                                // height: '50px',
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
                              id="login-email"
                              placeholder="john@example.com"
                              autoFocus
                            />
                            {touched.email && errors.email ? (
                              <div className="invalid-feedback">
                                {errors.email}
                              </div>
                            ) : null}
                          </div>
                          <div className="mb-1">
                            <div className="d-flex justify-content-between">
                              <Label
                                className="form-label"
                                for="login-password"
                              >
                                Password<span style={{ color: "red" }}> *</span>
                              </Label>
                            </div>
                            <InputPasswordToggle
                              style={{
                                // height: '50px',
                                boxShadow: "none",
                                fontSize: "14px",
                              }}
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
                          <div className="form-check mb-1 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <Input
                                style={{
                                  width: "15px",
                                  height: "15px",
                                }}
                                {...getFieldProps("rememberMe")}
                                type="checkbox"
                                id="remember-me"
                              />
                              <Label
                                style={{
                                  marginLeft: "10px",
                                  paddingTop: "2px",
                                }}
                                className="form-label"
                                for="remember-me"
                              >
                                <span>Remember Me</span>
                              </Label>
                            </div>

                            <div style={{ marginTop: "-10px" }}>
                              {window.innerWidth < 768 ? null : (
                                <Link to="/forgot-password">
                                  <small>Forgot Password?</small>
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* <div className="d-flex justify-content-center align-items-center">

                      <Input {...getFieldProps('rememberMe')} type="checkbox" id="remember-me" />

                      <Label style={{
                        marginLeft:'10px',
                      paddingTop:'2px'}} className="form-label" for="remember-me">
                        Remember Me
                      </Label>
                    </div>
                    <Link to="/forgot-password" >
                      <small>Forgot Password?</small>
                    </Link> */}
                          <CustomButton
                            // color="primary"
                            size="sm"
                            style={{
                              boxShadow: "none",
                              display: "flex",
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "red",
                            }}
                            type="submit"
                            disabled={isSubmitting}
                            text={
                              <>
                                {isSubmitting ? (
                                  <Spinner color="white" size="sm" />
                                ) : null}
                                <span
                                  className="align-middle ms-25"
                                  style={{ fontSize: "1rem" }}
                                >
                                  {" "}
                                  Sign in
                                </span>
                              </>
                            }
                          />
                          {/* <Button
                            style={{
                              boxShadow: "none",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "red",
                            }}
                            type="submit"
                            size="sm"
                            color="primary"
                            block
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Spinner color="white" size="sm" />
                            ) : null}
                            <span
                              className="align-middle ms-25"
                              style={{ fontSize: "1rem" }}
                            >
                              {" "}
                              Sign in
                            </span>
                          </Button> */}
                        </Form>
                      )}
                    </Formik>
                    {window.innerWidth < 768 ? (
                      <div style={{ marginBlock: "10px" }}>
                        <Link to="/forgot-password">
                          <small>Forgot Password?</small>
                        </Link>{" "}
                      </div>
                    ) : null}
                    {window.innerWidth < 768 ? (
                      <p className="text-center form-label justify-content-center ">
                        <span className="me-25">New on our platform? </span>
                        <br />
                        <Link to="/register" style={{ marginLeft: "5px" }}>
                          <span>Create an account</span>
                        </Link>
                      </p>
                    ) : null}
                    {window.innerWidth < 768 ? null : (
                      <p className="text-center mt-2 form-label d-flex justify-content-center">
                        <span className="me-25">New on our platform?</span>
                        <Link to="/register" style={{ marginLeft: "5px" }}>
                          <span>Create an account</span>
                        </Link>
                      </p>
                    )}
                  </div>
                </Col>{" "}
              </Row>{" "}
            </>
          ) : (
            <>
              <div className="auth-wrapper auth-cover">
                <Row className="auth-inner m-0">
                 
                  <Col
                    className="d-flex align-items-center auth-bg px-2 p-lg-3"
                    
                    // lg="4"
                    md="12"
                    sm="12"
                  >
                    <Col className="px-xl-2 mx-auto" sm="12" md="4" lg="4">
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
                            {loading ? (
                              <Spinner
                                color="primary"
                                size="sm"
                                style={{ marginTop: "20px" }}
                              />
                            ) : (
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

                          <h1
                            style={{
                              textAlign: "center",
                              fontWeight: 900,
                              color: "#115fa7",
                            }}
                          >
                            LOGIN INTO ACCOUNT
                          </h1>

                          <Formik
                            initialValues={{
                              email: localStorage.getItem("userEmail") || "",
                              password:
                                localStorage.getItem("userPasword") || "",
                              rememberMe:
                                localStorage.getItem("userEmail") ||
                                localStorage.getItem("userPasword")
                                  ? true
                                  : false,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                              // Call your API here
                              //console.log(values);
                              setSubmitting(true);
                            const emailD = values.email.trim().toLowerCase();

                              const postData = {
                                email: emailD,
                                password: values.password,
                              };
                              const apiData = await post(
                                "user/login",
                                postData
                              ); // Specify the endpoint you want to call
                              // console.log("apixxsData");

                              // console.log(apiData);
                              if (apiData.error) {
                                if (apiData.errormsg === "NotVerifiedAccount") {
                                  //console.log('NotVerifiedAccount');
                                  const emailD = values.email.trim().toLowerCase();

                                  setEmailData(emailD);
                                  setModal(true);
                                } else if (apiData.errormsg === "invalid") {
                                  //console.log('invalid');
                                  setSubmitting(false);
                                  toastAlert("error", apiData.message);
                                }
                                // setSubmitting(false);

                                // toastAlert("error", "No Images Selected")
                              } else {
                                if (values.rememberMe === true) {
                                  const emailD = values.email.trim().toLowerCase();

                                  localStorage.setItem(
                                    "userEmail",
                                    emailD
                                  );
                                  localStorage.setItem(
                                    "userPasword",
                                    values.password
                                  );
                                } else {
                                  localStorage.removeItem("userEmail");
                                  localStorage.removeItem("userPasword");
                                }
                                // redux add

                                // dispatch(getUser(apiData.data.user_id));
                                // localStorage.setItem(
                                //   '@UserLoginRS',
                                //   JSON.stringify({
                                //     token: apiData.data,
                                //     user_type: apiData.user_type,
                                //     password: values.password,
                                //   }),
                                // );
                                // localStorage.setItem(
                                //   'token',
                                //   JSON.stringify({user_id: apiData.data.user_id, token: apiData.token}),
                                // );
                                // Example data
                                const data = JSON.stringify({
                                  token: apiData.token,
                                  user_id: apiData.data.user_id,
                                });

                                // Encrypt the data
                                const encryptedData = encrypt(data);
                                localStorage.setItem(
                                  "user_data",
                                  encryptedData
                                );

                                // const companyId = apiData.data.company_id;
                                // const action = await dispatch(
                                //   getUser({
                                //     user_id: apiData.data.user_id,
                                //     token: apiData.token,
                                //   })
                                // );
                                // Activity Log
                                const user_id = apiData.data.user_id;
                                const email = apiData.data.email;

                                let response_log = await getActivityLogUser({
                                  user_id: user_id,
                                  event: "SIGN-IN",
                                  description: `${email} signed in `,
                                });
                                if (response_log === true) {
                                  //console.log("MAINTAIN LOG SUCCESS")
                                } else {
                                  //console.log("MAINTAIN ERROR LOG")
                                }
                                // Activity Log End
                                window.location.href = "/home";

                                // toastAlert("success", "You can Edit document ")
                              }
                            }}
                          >
                            {({
                              getFieldProps,
                              errors,
                              touched,
                              isSubmitting,
                            }) => (
                              <Form className="auth-login-form ">
                                <div className="mb-1">
                                  <Label
                                    className="form-label"
                                    for="login-email"
                                  >
                                    Email
                                    <span style={{ color: "red" }}> *</span>
                                  </Label>
                                  {/* <div class="max-w-sm space-y-3">
  <input type="text" class="py-0 px-1 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="This is placeholder"/>
</div> */}
                                  <Input
                                    style={{
                                      // height: '50px',
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
                                    id="login-email"
                                    placeholder="john@example.com"
                                    autoFocus
                                  />
                                  {touched.email && errors.email ? (
                                    <div className="invalid-feedback">
                                      {errors.email}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="mb-1">
                                  <div className="d-flex justify-content-between">
                                    <Label
                                      className="form-label"
                                      for="login-password"
                                    >
                                      Password
                                      <span style={{ color: "red" }}> *</span>
                                    </Label>
                                  </div>
                                  <InputPasswordToggle
                                    style={{
                                      // height: '50px',
                                      boxShadow: "none",
                                      fontSize: "14px",
                                    }}
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
                                <div className="form-check mb-1 d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-center">
                                    <Input
                                      style={{
                                        width: "15px",
                                        height: "15px",
                                        cursor: "pointer",
                                      }}
                                      {...getFieldProps("rememberMe")}
                                      type="checkbox"
                                      id="remember-me"
                                    />
                                    <Label
                                      style={{
                                        marginLeft: "10px",
                                        paddingTop: "2px",
                                        cursor: "pointer",
                                      }}
                                      className="form-label"
                                      for="remember-me"
                                    >
                                      <span>Remember Me</span>
                                    </Label>
                                  </div>

                                  <div style={{ marginTop: "-10px" }}>
                                    {window.innerWidth < 768 ? null : (
                                      <Link to="/forgot-password">
                                        <small>Forgot Password?</small>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                                <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                <CustomButton
                                padding={true}
                                  // color="primary"
                                  size="sm"
                                  style={{
                                    boxShadow: "none",
                                    display: "flex",
                                    width: "70%",
                                    // padding:"120px",
                                  
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "red",
                                  }}
                                  type="submit"
                                  disabled={isSubmitting}
                                  text={
                                    <>
                                      {isSubmitting ? (
                                        <Spinner color="white" size="sm" />
                                      ) : null}
                                      <span
                                        className="align-middle ms-25"
                                        style={{ fontSize: "1rem" }}
                                      >
                                        {" "}
                                        Sign in
                                      </span>
                                    </>
                                  }
                                /></div>{" "}
                              </Form>
                            )}
                          </Formik>
                          {window.innerWidth < 768 ? (
                            <div style={{ marginBlock: "10px" }}>
                              <Link to="/forgot-password">
                                <small>Forgot Password?</small>
                              </Link>{" "}
                            </div>
                          ) : null}
                          {window.innerWidth < 768 ? (
                            <p className="text-center form-label justify-content-center ">
                              <span className="me-25">
                                New on our platform?{" "}
                              </span>
                              <br />
                              <Link
                                to="/register"
                                style={{ marginLeft: "5px" }}
                              >
                                <span>Create an account</span>
                              </Link>
                            </p>
                          ) : null}
                          {window.innerWidth < 768 ? null : (
                            <p className="text-center mt-2 form-label d-flex justify-content-center">
                              <span className="me-25">
                                New on our platform?
                              </span>
                              <Link
                                to="/register"
                                style={{ marginLeft: "5px" }}
                              >
                                <span>Create an account</span>
                              </Link>
                            </p>
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </Col>
                  <Col
                    className="d-none d-lg-flex auth-bg align-items-center p-5"
                    // lg="4"
                    md="4"
                    sm="12"
                  ></Col>
                </Row>
              </div>
            </>
          )}

          <Modal
            isOpen={modal}
            toggle={() => setModal(false)}
            className="modal-dialog-centered"
            modalClassName="primary"
            key="success"
          >
            <ModalBody>
              <div className="d-flex flex-column justify-content-center align-items-center text-center">
                <Mail size={70} style={{ marginTop: "5%" }} />
                <h1
                  className="fw-bold"
                  style={{
                    paddingTop: "3%",
                    textAlign: "center",
                    fontWeight: 900,
                  }}
                >
                  Non Verified Account
                </h1>
                <h3
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    width: "80%",
                  }}
                >
                  <Label className="form-label">
                    Verify your account via email to unlock benefits.
                  </Label>
                  <Label
                    className="form-label"
                    style={{ marginBottom: "10px" }}
                  >
                    Resend the link if needed.
                  </Label>
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: "5%",
                }}
              >
                <Button
                  size="sm"
                  style={{ boxShadow: "none", cursor: "pointer" }}
                  disabled={loadingResend}
                  color="primary"
                  onClick={handleResent}
                >
                  {loadingResend ? <Spinner color="light" size="sm" /> : null}
                  <span
                    style={{ fontSize: "14px" }}
                    className="align-middle ms-25"
                  >
                    Resend Link
                  </span>
                </Button>
              </div>
            </ModalBody>
          </Modal>
          {/* Success Send email Modal  */}
          <ModalReusable
            isOpen={modalSuccess}
            successMessageData={[
              " Verification link resent.",
              " Activate your account by checking your email.",
            ]}
            errorMessageData="Can't send Verification Link Right Now."
            success={true}
            toggleFunc={() => setModalSuccess(!modalSuccess)}
          />
          {/* Error success email modal  */}
          <ModalReusable
            isOpen={modalError}
            success={false}
            successMessageData={[
              " Verification link resent.",
              " Activate your account by checking your email.",
            ]}
            errorMessageData="Can't send Verification Link Right Now."
            toggleFunc={() => setModalError(!modalError)}
          />
        </>
      )}
    </>
  );
};

export default Login;
