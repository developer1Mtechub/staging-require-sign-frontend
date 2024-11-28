// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Hooks
import * as Yup from "yup";
// ** Icons Imports
import { Formik, Form } from "formik";
import "./StylesheetPhoneNo.css";
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  // Form,
  Label,
  Input,
  Spinner,
  CardBody,
  Card,
} from "reactstrap";

// ** Illustrations Imports
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { post } from "../apis/api";
import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";
import ModalReusable from "../components/ModalReusable";
import IntlDropdown from "../@core/layouts/components/navbar/IntlDropdown";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectLoading, selectLogo, getUser } from "../redux/navbar";
import CustomButton from "../components/ButtonCustom";
import getUserLocation from "../utility/IpLocation/GetUserLocation";

const Register = () => {
  // ** Hooks
  const { t } = useTranslation();
  // const { compNameAPI, loading, logo } = useLogo();
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);
  const [referalCode, setReferalCode] = useState("");
  const [loaderData, setLoaderData] = useState(true);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .nullable()
      .email(t("Please enter a valid email address"))
      .required(t("Email is required")),

    password: Yup.string()
      .nullable()
      .required(t("Password is required"))
      .test("password-strength", "", function (value) {
        const password = value || "";
        const errors = [];
        if (password.length < 8)
          errors.push(t("Password must be at least 8 characters long"));
        if (!/[0-9]/.test(password))
          errors.push(t("Password requires a number"));
        if (!/[a-z]/.test(password))
          errors.push(t("Password requires a lowercase letter"));
        if (!/[A-Z]/.test(password))
          errors.push(t("Password requires an uppercase letter"));
        if (!/[^\w]/.test(password))
          errors.push(t("Password requires a symbol"));
        return (
          errors.length === 0 ||
          this.createError({ message: errors.join(", ") })
        );
      }),
  });

  const [modal, setModal] = useState(false);
  const [checkedCompany, setCheckedCompany] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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
      {loaderData || loading ? (
        <div></div>
      ) : (
        <>
          {window.innerWidth > 768 ? (
            <div className="auth-wrapper auth-cover">
              <Row className="auth-inner m-0">
               
                <Col
                  className="d-flex align-items-center auth-bg px-2 p-lg-5"
                  // lg="4"
                  md="12"
                  sm="12"
                >
                  <Col
                    className="px-xl-2 mx-auto"
                    xs="12"
                    sm="12"
                    md="4"
                    lg="4"
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
                            {t("CREATE AN ACCOUNT")}
                          </h1>
                        </CardTitle>
                        <Formik
                          initialValues={{
                            email: "",
                            password: "",
                          }}
                          validationSchema={validationSchema}
                          onSubmit={async (
                            values,
                            { setSubmitting, resetForm }
                          ) => {
                            if (!acceptedTerms) {
                              // Display an alert or set a state to show an error message in the UI
                              alert(
                                "You must agree to the terms and conditions to sign up."
                              );
                              return; // Prevent the form from being submitted
                            }
                            setSubmitting(true);

                            const locationData = await getUserLocation();
                            console.log(locationData);
                            const emailD = values.email.trim().toLowerCase();
                            const postData = {
                              email: emailD,
                              password: values.password,
                              companychecked: checkedCompany,
                              referal_code: referalCode,
                              registered_at: locationData.date,
                              registered_country: locationData.country,
                            };
                            const apiData = await post(
                              "user/registerV2",
                              postData
                            ); // Specify the endpoint you want to call
                            if (apiData.error) {
                              setSubmitting(false);

                              toastAlert("error", apiData.message);
                            } else {
                              // Activity Log
                              const user_id = apiData.data.user_id;

                              const email = values.email;

                              setSubmitting(false);
                              setModal(true);
                              setReferalCode("");
                              resetForm();
                              // toastAlert("success", "You can Edit document ")
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
                              <div className="mb-1">
                                <Label
                                  className="form-label"
                                  for="register-email"
                                >
                                  {t("Email")}
                                  <span style={{ color: "red" }}> *</span>
                                </Label>
                                <Input
                                  style={{
                                    boxShadow: "none",
                                    fontSize: "14px",
                                  }}
                                  className={`form-control ${
                                    touched.email && errors.email
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  onChange={handleChange("email")}
                                  value={values["email"]}
                                  {...getFieldProps("email")}
                                  type="text"
                                  id="register-email"
                                  placeholder="john@example.com"
                                />
                                {touched.email && errors.email ? (
                                  <div className="invalid-feedback">
                                    {errors.email}
                                  </div>
                                ) : null}
                              </div>

                              <div className="mb-1">
                                <Label
                                  className="form-label"
                                  for="register-password"
                                >
                                  {t("Password")}
                                  <span style={{ color: "red" }}> *</span>
                                </Label>
                                <InputPasswordToggle
                                  style={{
                                    fontSize: "14px",
                                  }}
                                  {...getFieldProps("password")}
                                  className={`input-group-merge ${
                                    touched.password && errors.password
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  onChange={handleChange("password")}
                                  value={values["password"]}
                                  //  className="input-group-merge"
                                  id="register-password"
                                />

                                <div className="password-criteria mt-1">
                                  <ul className="list-unstyled">
                                    {[
                                      {
                                        text: t("At least 8 characters"),
                                        fulfilled: values.password.length >= 8,
                                      },
                                      {
                                        text: t("Contains an uppercase letter"),
                                        fulfilled: /[A-Z]/.test(
                                          values.password
                                        ),
                                      },
                                      {
                                        text: t("Contains a lowercase letter"),
                                        fulfilled: /[a-z]/.test(
                                          values.password
                                        ),
                                      },
                                      {
                                        text: t("Contains a number"),
                                        fulfilled: /\d/.test(values.password),
                                      },
                                      {
                                        text: t("Contains a special character"),
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
                              </div>

                              <div className="mb-1">
                                <Label
                                  className="form-label"
                                  for="register-password"
                                >
                                  {t("Select Preferred Language")}
                                </Label>
                                <Col>
                                  <IntlDropdown widthD="100%" />
                                </Col>
                              </div>
                              <div className="mb-1">
                                <Label
                                  className="form-label"
                                  for="register-password"
                                >
                                  {t("Referral Code (Optional)")}
                                </Label>
                                <Col>
                                  <Input
                                    style={{
                                      boxShadow: "none",
                                      fontSize: "14px",
                                    }}
                                    className={`form-control`}
                                    onChange={(e) =>
                                      setReferalCode(e.target.value)
                                    }
                                    value={referalCode}
                                    type="text"
                                    // placeholder="Enter Referral Code"
                                  />
                                </Col>
                              </div>
                              <div
                                className="mb-1 d-flex"
                                style={{
                                  justifyContent: "left",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={acceptedTerms}
                                  onChange={(e) =>
                                    setAcceptedTerms(!acceptedTerms)
                                  }
                                />{" "}
                                <label
                                  className="form-label"
                                  style={{
                                    marginLeft: "5px",
                                    marginTop: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    setAcceptedTerms(!acceptedTerms)
                                  }
                                >
                                  {t("I agree to the")}{" "}
                                  <a
                                    href="/terms-and-conditions"
                                    target="_blank"
                                  >
                                    {t("Terms and Conditions")}
                                  </a>
                                </label>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CustomButton
                                  padding={true}
                                  // color="primary"
                                  size="sm"
                                  style={{
                                    boxShadow: "none",
                                    display: "flex",
                                    width: "70%",
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
                                      <span
                                        className="align-middle ms-25"
                                        style={{ fontSize: "1rem" }}
                                      >
                                        {t("Sign up")}
                                      </span>
                                    </>
                                  }
                                />
                              </div>
                            </Form>
                          )}
                        </Formik>
                        {/* Modal  */}
                        <p
                          style={{ fontSize: "14px", alignItems: "center" }}
                          className="text-center mt-2 form-label d-flex justify-content-center"
                        >
                          <span className="me-25">
                            {t("Already have an account?")}
                          </span>

                          <Link to="/login" style={{ marginLeft: "5px" }}>
                            <span>{t("Sign in instead")}</span>
                          </Link>
                        </p>{" "}
                      </CardBody>
                    </Card>
                  </Col>
                </Col>
                <Col
                  className="d-flex align-items-center auth-bg px-2 p-lg-5"
                  lg="4"
                  md="3"
                  sm="12"
                ></Col>
              </Row>
            </div>
          ) : (
            <div className="auth-wrapper auth-cover ">
              <Row className="auth-inner m-0">
                <Col
                  className="d-flex align-items-center auth-bg px-2 "
                  lg="4"
                  md="6"
                  sm="12"
                >
                  <Col
                    // className=" mx-auto"
                    xs="12"
                    sm="12"
                    md="12"
                    lg="12"
                  >
                    {/* <Card style={{ border: "1px solid #e7e6e6" }}>
                <CardBody className="p-4"> */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "40px",
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
                        {t("CREATE AN ACCOUNT")}
                      </h1>
                    </CardTitle>
                    <Formik
                      initialValues={{
                        email: "",
                        password: "",
                      }}
                      validationSchema={validationSchema}
                      onSubmit={async (
                        values,
                        { setSubmitting, resetForm }
                      ) => {
                        if (!acceptedTerms) {
                          // Display an alert or set a state to show an error message in the UI
                          alert(
                            "You must agree to the terms and conditions to sign up."
                          );
                          return; // Prevent the form from being submitted
                        }
                        setSubmitting(true);
                        const locationData = await getUserLocation();
                        console.log(locationData);
                            const emailD = values.email.trim().toLowerCase();


                        const postData = {
                          email: emailD,
                          password: values.password,
                          companychecked: checkedCompany,
                          referal_code: referalCode,
                          registered_at: locationData.date,
                          registered_country: locationData.country,
                        };
                        const apiData = await post("user/registerV2", postData); // Specify the endpoint you want to call
                        if (apiData.error) {
                          setSubmitting(false);

                          toastAlert("error", apiData.message);
                        } else {
                          localStorage.removeItem("companyLogo");
                          localStorage.removeItem("company_primary_color");
                          localStorage.removeItem("company_secondary_color");
                          // Activity Log
                          const user_id = apiData.data.user_id;

                          const email = values.email;

                          setSubmitting(false);
                          setModal(true);
                          setReferalCode("");
                          resetForm();
                          // toastAlert("success", "You can Edit document ")
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
                          <div className="mb-1">
                            <Label className="form-label" for="register-email">
                              {t("Email")}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                            <Input
                              style={{
                                boxShadow: "none",
                                fontSize: "14px",
                              }}
                              className={`form-control ${
                                touched.email && errors.email
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={handleChange("email")}
                              value={values["email"]}
                              {...getFieldProps("email")}
                              type="text"
                              id="register-email"
                              placeholder="john@example.com"
                            />
                            {touched.email && errors.email ? (
                              <div className="invalid-feedback">
                                {errors.email}
                              </div>
                            ) : null}
                          </div>

                          <div className="mb-1">
                            <Label
                              className="form-label"
                              for="register-password"
                            >
                              {t("Password")}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                            <InputPasswordToggle
                              style={{
                                fontSize: "14px",
                              }}
                              {...getFieldProps("password")}
                              className={`input-group-merge ${
                                touched.password && errors.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={handleChange("password")}
                              value={values["password"]}
                              //  className="input-group-merge"
                              id="register-password"
                            />

                            <div className="password-criteria mt-1">
                              <ul className="list-unstyled">
                                {[
                                  {
                                    text: t("At least 8 characters"),
                                    fulfilled: values.password.length >= 8,
                                  },
                                  {
                                    text: t("Contains an uppercase letter"),
                                    fulfilled: /[A-Z]/.test(values.password),
                                  },
                                  {
                                    text: t("Contains a lowercase letter"),
                                    fulfilled: /[a-z]/.test(values.password),
                                  },
                                  {
                                    text: t("Contains a number"),
                                    fulfilled: /\d/.test(values.password),
                                  },
                                  {
                                    text: t("Contains a special character"),
                                    fulfilled: /[!@#$%^&*(),.?":{}|<>]/.test(
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
                          </div>

                          <div className="mb-1">
                            <Label
                              className="form-label"
                              for="register-password"
                            >
                              {t("Select Preferred Language")}
                            </Label>
                            <Col>
                              <IntlDropdown widthD="100%" />
                            </Col>
                          </div>
                          <div className="mb-1">
                            <Label
                              className="form-label"
                              for="register-password"
                            >
                              {t("Referral Code (Optional)")}
                            </Label>
                            <Col>
                              <Input
                                style={{
                                  boxShadow: "none",
                                  fontSize: "14px",
                                }}
                                className={`form-control`}
                                onChange={(e) => setReferalCode(e.target.value)}
                                value={referalCode}
                                type="text"
                                // placeholder="Enter Referral Code"
                              />
                            </Col>
                          </div>
                          <div
                            className="mb-1 d-flex"
                            style={{
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={acceptedTerms}
                              onChange={(e) => setAcceptedTerms(!acceptedTerms)}
                            />{" "}
                            <label
                              className="form-label"
                              style={{
                                marginLeft: "5px",
                                marginTop: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => setAcceptedTerms(!acceptedTerms)}
                            >
                              {t("I agree to the")}{" "}
                              <a href="/terms-and-conditions" target="_blank">
                                {t("Terms and Conditions")}
                              </a>
                            </label>
                          </div>

                          <CustomButton
                            // color="primary"
                            size="sm"
                            style={{
                              boxShadow: "none",
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
                                <span
                                  className="align-middle ms-25"
                                  style={{ fontSize: "1rem" }}
                                >
                                  {t("Sign up")}
                                </span>
                              </>
                            }
                          />
                        </Form>
                      )}
                    </Formik>
                    {/* Modal  */}
                    <p
                      style={{ fontSize: "14px", alignItems: "center" }}
                      className="text-center mt-2 form-label d-flex justify-content-center"
                    >
                      <span className="me-25">
                        {t("Already have an account?")}
                      </span>

                      <Link to="/login" style={{ marginLeft: "5px" }}>
                        <span>{t("Sign in instead")}</span>
                      </Link>
                    </p>{" "}
                    {/* </CardBody>
              </Card> */}
                  </Col>
                </Col>
              </Row>
            </div>
          )}
        </>
      )}
      <ModalReusable
        buttonStart={true}
        isOpen={modal}
        success={true}
        successMessageData={[
          t("One quick step to get going with RequireSign."),
          t("Simply check your email to activate your account."),
          t("Remember also check spam folder."),
        ]}
        errorMessageData={t("Can't Update Password Right Now.")}
        sucessHeader={t("Please Verify")}
        toggleFunc={() => setModal(!modal)}
      />
    </>
  );
};

export default Register;
