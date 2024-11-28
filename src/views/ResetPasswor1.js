// ** React Imports
import {useSkin} from '@hooks/useSkin';
import {Link} from 'react-router-dom';
import {Formik, Field, Form} from 'formik';
import * as Yup from 'yup';
// ** Icons Imports
import {Facebook, Twitter, Mail, GitHub} from 'react-feather';

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle';

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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/two-steps-verification-illustration.png';
import illustrationsDark from '@src/assets/images/pages/two-steps-verification-illustration-dark.png';
import logoRemoveBg from '@src/assets/images/pages/logoRemoveBg.png';

// ** Styles
import '@styles/react/pages/page-authentication.scss';
import {post, put} from '../apis/api';
import {useEffect, useState} from 'react';
import toastAlert from '@components/toastAlert';
import ModalReusable from '../components/ModalReusable';
import IntlDropdown from '../@core/layouts/components/navbar/IntlDropdown';
import ButtonCustomLogin from '../components/ButtonCustomLogin';

const ResetPassword1 = () => {
  const [modal, setModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);

  const {skin} = useSkin();

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight;
  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
    .nullable()
    .matches(/^[a-zA-Z -]+$/, "First Name should contain only alphabets")
    .required("First Name is required"),
  lastname: Yup.string()
    .nullable()
    .matches(/^[a-zA-Z -]+$/, "Last Name should contain only alphabets")
    .required("Last Name is required"),
    password: Yup.string()
      .nullable()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });
  // Resent Verification Link
  const [loadingResend, setLoadingResend] = useState(false);
  const [emailData, setEmailData] = useState('');
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  // const email = urlParams.get('email');
  const company_id_route = urlParams.get('company_id');
  const handleResent = async () => {
    setLoadingResend(true);
    //console.log(emailData);
    const postData = {
      email: emailData,
    };
    const apiData = await post('user/resendRegistrationLink', postData); // Specify the endpoint you want to call
    //console.log(apiData);
    if (apiData.error) {
      toastAlert('error', apiData.message);
      setLoadingResend(false);
      setModal(false);
    } else {
      setLoadingResend(false);
      toastAlert('success', apiData.message);
      setModal(false);

      // setresendverification(true)
      // setTimeout(async () => {
      //   setresendverification(false)
      //   setModalOpenInvite(false)

      // }, 2000)
      // //console.log(apiData)
      // toastAlert("success",apiData.message)
      // setModalOpenInvite(true)
      // navigate('/reset_password')
    }
  };
  const [loaderData, setLoaderData] = useState(true);
  const [companyLogo,setCompanyLogo]=useState("")
  const [companyPrimaryColor,setCompanyPrimaryColor]=useState("")
  const handleCheckToken = async () => {
    console.log("AAAAAAAAAAAAAAAAAAA")
    console.log(token)
    if (token === null) {
      setLoaderData(false);
      window.location.href="/error"
      //console.log("TOKEN NULL >> UPDATE COMPANY USER PASSWORD")
      //console.log(company_id_route)
      // const postData = {
      //   verifyId:token,
      //   company_id: company_id_route,
      // };
      // const apiData = await post('user/check_company_token_invitation', postData); // Specify the endpoint you want to call
      // console.log(apiData);
      // if (apiData.error) {
      //   // window.location.href="/error"
      // } else {
      //   setLoaderData(false);
      // }
      // token not found
    } else {
      const postData = {
        verifyId:token,
        company_id: company_id_route,
      };
      const apiData = await post('user/check_company_token_invitation', postData); // Specify the endpoint you want to call
      console.log(apiData);
      if (apiData.error===true) {

        window.location.href="/error"
      } else {
        setLoaderData(false);
        setEmailData(apiData.userData)
        setCompanyPrimaryColor(apiData.company_primary_color)
        setCompanyLogo(apiData.company_logo)
      }
      // const postData = {
      //   verifyId: token,
      // };
      // const apiData = await post('user/checkTokenValidUpdatePassword', postData); // Specify the endpoint you want to call
      // //console.log(apiData);
      // if (apiData.error) {
      //   // window.location.href="/error"
      // } else {
      //   setLoaderData(false);
      // }
      // token not found
    }
  };
  useEffect(() => {
    handleCheckToken();
  }, []);
  return (
    <>
      {loaderData ? (
        <div></div>
      ) : (
        <div className="auth-wrapper auth-cover">
          <Row className="auth-inner m-0">
            <Link className="brand-logo" to="/" onClick={e => e.preventDefault()}>
              <img src={companyLogo} alt="Login Cover" style={{width: '200px', height: '50px',objectFit:"contain"}} />
              {/* <h2 className='brand-text text-primary ms-1'>Vuexy</h2> */}
            </Link>
            <Col className="d-none d-lg-flex align-items-center p-5" lg="6" md="6" sm="12">
              <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                <img className="img-fluid" src={source} alt="Login Cover" />
              </div>
            </Col>
            <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="6" sm="12">
              <Col className="px-xl-2 mx-auto" sm="8" md="8" lg="8">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  {/* <img  src={logoRemoveBg} alt="Login Cover" style={{width:'200px',height:'auto'}} /> */}
                </div>
                <CardTitle tag="h2" className="fw-bold mb-1">
                  {token === null ? 'Create Password' : ' Update Profile Details'}
                </CardTitle>
                {/* <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText> */}
                <Formik
                  initialValues={{
                    password: '',
                    firstname:"",
                    lastname:"",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, {setSubmitting}) => {
                    // Call your API here
                    //console.log(values);
                    setSubmitting(true);
                    // if (token === null) {
                      const postData = {
                        email: emailData,
                        password: values.password,
                        firstname: values.firstname,
                        lastname:values.lastname
                      };
                      const apiData = await put('user/updatePasswordProfComp', postData); // Specify the endpoint you want to call
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
                          window.location.href = '/login';
                          // 5 seconds
                        }, 2000);
                      }
                    // } else {
                    //   const postData = {
                    //     token: token,
                    //     password: values.password,
                    //   };
                    //   const apiData = await post('user/updatePasswordBytoken', postData); // Specify the endpoint you want to call
                    //   //console.log('apixxsData');

                    //   //console.log(apiData);
                    //   if (apiData.error) {
                    //     // toastAlert("error", apiData.message)
                    //     setModalError(true);
                    //   } else {
                    //     setSubmitting(false);


                    //     setModalSuccess(true);
                    //     // toastAlert("success", apiData.message)
                    //     setTimeout(() => {
                    //       window.location.href = '/login';
                    //       // 5 seconds
                    //     }, 2000);
                    //   }
                    // }
                  }}>
                  {({getFieldProps, errors, touched, isSubmitting,values,handleChange}) => (
                    <Form className="auth-login-form mt-2">
                     <div className="mb-1">
                                        <Label
                                          className="form-label"
                                          for="register-firstname"
                                        >
                                          First Name
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
                                      <div className="mb-1">
                                        <Label
                                          className="form-label"
                                          for="register-lastname"
                                        >
                                    Last Name
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
                                      <div className="mb-1">
                                        <Label
                                          className="form-label"
                                          for="register-lastname"
                                        >
                                    Email
                                        </Label>
                                        <Input
                                          style={{
                                            boxShadow: "none",
                                            fontSize: "16px",
                                          }}
                                          disabled={true}
                                          value={emailData}
                                          type="text"
                                          id="register-lastname"
                                          placeholder="john@gmail.com"
                                        />
                                        
                                      </div>
                      <div className="mb-1">
                        <div className="d-flex justify-content-between">
                          <Label className="form-label" for="login-password">
                            Password
                          </Label>
                        </div>
                        <InputPasswordToggle
                          style={{fontSize: '16px'}}
                          className={`input-group-merge ${touched.password && errors.password ? 'is-invalid' : ''}`}
                          {...getFieldProps('password')}
                          id="login-password"
                        />
                        {touched.password && errors.password ? (
                          <div className="invalid-feedback">{errors.password}</div>
                        ) : null}
                      </div>
                      <div className="mb-1">
                        <div className="d-flex justify-content-between">
                          <Label className="form-label" for="confirm-password">
                            Confirm Password
                          </Label>
                        </div>
                        <InputPasswordToggle
                          style={{fontSize: '16px'}}
                          className={`input-group-merge ${
                            touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''
                          }`}
                          {...getFieldProps('confirmPassword')}
                          id="confirm-password"
                        />
                        {touched.confirmPassword && errors.confirmPassword ? (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        ) : null}
                      </div>
                      <div className="mb-1">
                                <Label
                                  className="form-label"
                                  for="register-password"
                                >
                                 Select Preferred Language
                                </Label>
                                <Col>
                                  <IntlDropdown widthD="100%" />
                                </Col>
                              </div>
                              <ButtonCustomLogin
                                      size="sm"
                                      // disabled={isSubmitting}
                                      text={
                                        <>
                                          {isSubmitting ? <Spinner color="white" size="sm" /> : null}
                        <span className="align-middle ms-25"  style={{fontSize: '16px'}}>
                          {' '}
                          {token === null ? 'Reset Password' : 'Update Password'}
                        </span>
                                        </>
                                      }
                                      padding={true}
                                      backgroundColor={
                                        companyPrimaryColor
                                      }
                                    />
                      {/* <Button style={{boxShadow: 'none'}} type="submit" color="primary" block disabled={isSubmitting}>
                        {isSubmitting ? <Spinner color="white" size="sm" /> : null}
                        <span className="align-middle ms-25"  style={{fontSize: '16px'}}>
                          {' '}
                          {token === null ? 'Reset Password' : 'Update Password'}
                        </span> */}
                      {/* </Button> */}
                    </Form>
                  )}
                </Formik>
                {/* Modal  */}
                <Modal
                  isOpen={modal}
                  toggle={() => setModal(false)}
                  className="modal-dialog-centered"
                  modalClassName="primary"
                  key="success">
                  <ModalHeader toggle={() => setModal(false)}>Non Verified Account</ModalHeader>
                  <ModalBody>
                    Please verify your account by clicking the verification link in your email to unlock benefits. If
                    you didnot receive the email, please click the button below to resend the verification link.
                  </ModalBody>
                  <ModalFooter>
                    <Button disabled={loadingResend} color="primary" onClick={handleResent}>
                      {loadingResend ? <Spinner color="light" size="sm" /> : null}
                      <span className="align-middle ms-25">Resent Verification Link</span>
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* <p className="text-center mt-2">
              <span className="me-25">New on our platform?</span>
              <Link to="/register">
                <span>Create an account</span>
              </Link>
            </p> */}
                {/* <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google">
                <Mail size={14} />
              </Button>
              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div> */}
              </Col>
            </Col>
          </Row>
          {/* Success Send email Modal  */}
          <ModalReusable
            isOpen={modalSuccess}
            success={true}
            successMessageData={["Password Updated Successfully .","Now you can login with your new password."]}
            errorMessageData="Can't Update Password Right Now."
            toggleFunc={() => setModalSuccess(!modalSuccess)}
          />
          {/* Error success email modal  */}
          <ModalReusable isOpen={modalError} success={false} toggleFunc={() => setModalError(!modalError)} />
        </div>
      )}
    </>
  );
};

export default ResetPassword1;
