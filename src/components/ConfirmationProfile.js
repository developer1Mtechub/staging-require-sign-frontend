// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/bootstrap.css';
// import "../views/StylesheetPhoneNo.css"
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {parsePhoneNumberFromString, isPossiblePhoneNumber} from 'libphonenumber-js';
import {Form, Formik} from 'formik';
import {BASE_URL, post, postFormData} from '../apis/api';
import toastAlert from '@components/toastAlert';
import './ImageCropper.css';
import * as Yup from 'yup';

// ** Steps
import logoRemoveBg from '@src/assets/images/pages/logoRemoveBg.png';

import {Button, Card, CardBody, Col, Input, Label, Row, Spinner} from 'reactstrap';
import {useEffect, useRef, useState} from 'react';
// ** Custom Components
import {get} from '../apis/api';
import getActivityLogUser from '../utility/IpLocation/MaintainActivityLogUser';
// import PhoneInput from 'react-phone-input-2';
const ConfirmationProfile = ({isOpen, toggleFunc, profileGet}) => {
  // const containerStyle = {
  //   // margin: '20px',
  //   // padding: '5px',
  //   // border: '1px solid #ccc',
  //   borderRadius: '5px',
  //   border:"none"
  //   // maxWidth: '300px'
  // };

  // const inputStyle = {
  //   width: '100%',
  //   padding: '7px',
  //   borderRadius: '5px',
  //   // border:"none",
  //   fontSize:"14px",
  //   border:"1px solid lightGrey",
  //   // border: isValid ? '1px solid #ccc' : '1px solid red',
  //   outline: 'none'
  // };
  const [value, setValue] = useState('');
  const [country, setCountry] = useState('US');
  const [isValid, setIsValid] = useState(true);
  const handlePhoneNumberChange = value => {
    setValue(value);
    if ((value = '')) {
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
  const [duration, setDuration] = useState('monthly');
  const onChange = e => {
    if (e.target.checked) {
      setDuration('yearly');
    } else {
      setDuration('monthly');
    }
  };
  const [referalCodes, setReferalCodes] = useState([]);
  const [completeProfile, setCompleteProfile] = useState(isOpen);
  const [planSelect, setPlanSelect] = useState(false);
  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [email, setemail] = useState('');
  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .nullable()
      .matches(/^[a-zA-Z -]+$/, 'First Name should contain only alphabets')
      .required('First Name is required'),
    lastname: Yup.string()
      .nullable()
      .matches(/^[a-zA-Z -]+$/, 'Last Name should contain only alphabets')
      .required('Last Name is required'),
    // phoneNo: Yup.string()
    //   .nullable()
    //   .matches(/^[0-9]+$/, 'Phone Number should contain only numbers')
    //   .required('Phone Number is required'),
  });
  const [initialValues, setInitialValues] = useState({
    firstname: '', // Initialize with empty string
    lastname: '',
    // phoneNo: '',
  });
  const fetchData1 = async () => {
    const apiData1 = await get('pricing/get_all_pricing'); // Specify the endpoint you want to call
    //console.log('Navbar');

    //console.log(apiData1);
    if (apiData1.error) {
      // toastAlert('error', apiData1.message);
    } else {
      // toastAlert('success', apiData1.message);
      setReferalCodes(apiData1.result);
    }
  };

  const [SelectedAmount, setSelectedAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const getUserSignature = async () => {
    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
    //console.log(items?.token?.user_id);
    //console.log('Navbar');
    //console.log('User Profile Signature UPGRADE SECTION');
    const postData = {
      user_id: items?.token?.user_id,
    };
    const apiData = await post('user/getUserById', postData); // Specify the endpoint you want to call
    //console.log('apixxsData NAVBAR');
    //console.log(apiData);

    if (apiData.error) {
      // toastAlert("error", "")
    } else {
      //console.log(apiData.result[0]);
      if (apiData.result[0].signature_image_url === null || apiData.result[0].signature_image_url === undefined) {
      } else {
        setprofileSignature(apiData.result[0].signature_image_url);
      }
      if (apiData.result[0].avatar === null) {
        setSelectedFileImage(null);
      } else {
        setSelectedImage(BASE_URL + apiData.result[0].avatar);
        let url_LINK = BASE_URL + apiData.result[0].avatar;

        setSelectedFileImage('API');

        //console.log(apiData.result[0].avatar);
      }
      if (apiData.result[0].first_name === '' || apiData.result[0].first_name === null) {
        setCompleteProfile(true);
        setPlanSelect(false);
      } else {
        setCompleteProfile(true);
        setPlanSelect(true);
        if (apiData.result1.length === 0) {
        } else {
          setSelectedPlan(apiData.result1[0].plan_id);
          setSelectedAmount(apiData.result1[0].amount);
          if (apiData.result1[0].type === 'yearly') {
            setDuration('yearly');
          } else {
            setDuration('monthly');
          }
        }
        setemail(apiData.result[0].email);
        setInitialValues({
          firstname: apiData.result[0].first_name, // Set first name fetched from API
          lastname: apiData.result[0].last_name,
          phoneNo: apiData.result[0].contact_no,
        });
      }
    }
  };
  const [active, setActive] = useState('1');

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);

  useEffect(() => {
    fetchData1();
    getUserSignature();
  }, []);
  return (
    <>
      <div className="auth-wrapper auth-cover">
        <Row className="auth-inner m-0">
          <Col xs={12} style={{margin: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <img src={logoRemoveBg} alt="Login Cover" style={{width: '200px', height: 'auto'}} />
            <h2
              style={{textDecoration: 'underline', color: 'blue', marginRight: '20px', cursor: 'pointer'}}
              onClick={async () => {
                // refresh page
                const user_id_local = JSON.parse(localStorage.getItem('@UserLoginRS'));
                const user_id = user_id_local.token.user_id;
                const email = user_id_local.token.email;

                localStorage.removeItem('@UserLoginRS');
                localStorage.removeItem('@Plan');
                window.location.href = '/login';
              }}>
              Logout
            </h2>
          </Col>
          <Col xs={12} md={4}></Col>
          <Col
            xs={12}
            md={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              height: '80vh',
            }}>
            <div
              style={{
                display: ' flex',

                justifyContent: 'center',
              }}>
              <h1 className="fw-bold mb-4" style={{fontSize: '25px'}}>
                Please Complete Your Profile
              </h1>
            </div>
            <Card
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CardBody>
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, {setSubmitting, resetForm}) => {
                    setSubmitting(true);
                    console.log(values);

                    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));

                    const postData = {
                      user_id: items?.token?.user_id,
                      first_name: values.firstname,
                      last_name: values.lastname,
                      contact_no: value,
                      // contact_no: values.phoneNo,
                    };
                    try {
                      const apiData = await post('user/update_profile', postData); // Specify the endpoint you want to call
                      //console.log('Signers ');
                      console.log(apiData);
                      if (apiData.error) {
                        setSubmitting(false);
                        toastAlert('error', "Can't Update Right Now!");
                      } else {
                        // getUserSignature();
                        const user_id_local = JSON.parse(localStorage.getItem('@UserLoginRS'));
                        const user_id = user_id_local.token.user_id;
                        const email = user_id_local.token.email;

                        let response_log = await getActivityLogUser({
                          user_id: user_id,
                          event: 'PROFILE-UPDATED',
                          description: `${email} updated profile  `,
                        });
                        if (response_log === true) {
                          //console.log('MAINTAIN LOG SUCCESS');
                        } else {
                          //console.log('MAINTAIN ERROR LOG');
                        }
                        // Get the current object from localStorage
                        let storedObject = JSON.parse(localStorage.getItem('@UserLoginRS'));

                        // Update the properties you want to change
                        // storedObject.token = newTokenValue;
                        storedObject.token.first_name = values.firstname;
                        storedObject.token.last_name = values.lastname;
                        storedObject.token.contact_no = values.phoneNo;

                        // Store the updated object back to localStorage
                        localStorage.setItem('@UserLoginRS', JSON.stringify(storedObject));
                        setPlanSelect(true);
                        toastAlert('success', 'Profile Updated Successfully!');
                        // toggleFunc();
                        // profileGet();
                        setTimeout(() => {
                          window.location.href = '/home';
                          setSubmitting(false);
                        }, 1000);
                      }
                    } catch (error) {
                      console.log(error);
                      toastAlert('error', "Can't Update Right Now!");

                      console.log('Error fetching data:', error);
                      setSubmitting(false);
                    }
                  }}>
                  {({getFieldProps, errors, touched, isSubmitting, values, handleChange}) => (
                    <Form className="auth-register-form mt-1 " style={{paddingBottom: '10px'}}>
                      <Row>
                        <Col xs={12} md={12} style={{display: 'flex', justifyContent: 'center'}}>
                          <Row style={{display: 'flex', justifyContent: 'center'}}>
                            <Col xs={12} md={12}>
                              <div className="mb-1">
                                <Label className="form-label" for="register-firstname">
                                  First Name
                                </Label>

                                <Input
                                  style={{boxShadow: 'none', fontSize: '16px'}}
                                  className={`form-control ${
                                    touched.firstname && errors.firstname ? 'is-invalid' : ''
                                  }`}
                                  {...getFieldProps('firstname')}
                                  onChange={handleChange('firstname')}
                                  value={values['firstname']}
                                  type="text"
                                  id="register-firstname"
                                  placeholder="John"
                                  autoFocus
                                />
                                {touched.firstname && errors.firstname ? (
                                  <div className="invalid-feedback">{errors.firstname}</div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xs={12} md={12}>
                              <div className="mb-1">
                                <Label className="form-label" for="register-lastname">
                                  Last Name
                                </Label>
                                <Input
                                  style={{boxShadow: 'none', fontSize: '16px'}}
                                  className={`form-control ${touched.lastname && errors.lastname ? 'is-invalid' : ''}`}
                                  onChange={handleChange('lastname')}
                                  {...getFieldProps('lastname')}
                                  value={values['lastname']}
                                  type="text"
                                  id="register-lastname"
                                  placeholder="Doe"
                                />
                                {touched.lastname && errors.lastname ? (
                                  <div className="invalid-feedback">{errors.lastname}</div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xs={12} md={12}>
                              <div className="mb-1">
                                <Label className="form-label" for="register-phone-no">
                                  Phone Number
                                </Label>
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
                                <div classNmae="containerStyle">
                                  <PhoneInput
                                   defaultCountry="US"
                                    country={country}
                                    value={value}
                                    onChange={handlePhoneNumberChange}
                                    className="inputStyle"
                                  />
                                </div>
                                {/* {!isValid && value && <div style={{ color: 'red' }}>Invalid phone number</div>} */}

                                {/* <PhoneInput
                                  className={`input-phone-number ${
                                    touched.phoneNo && errors.phoneNo ? 'is-invalid' : ''
                                  }`}
                                  value={values['phoneNo']}
                                  onChange={value => setFieldValue('phoneNo', value)}
                                  defaultCountry="US"
                                />

                                {touched.phoneNo && errors.phoneNo ? (
                                  <div className="invalid-feedback">{errors.phoneNo}</div>
                                ) : null} */}
                              </div>
                            </Col>

                            <Col xs={12} md={12}>
                              <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Button
                                  style={{boxShadow: 'none', marginTop: '20px', marginBottom: '10px'}}
                                  // onClick={() => updateProfile()}
                                  type="submit"
                                  color="primary"
                                  size="sm"
                                  disabled={isSubmitting}>
                                  {isSubmitting ? <Spinner color="light" size="sm" /> : null}
                                  <span className="align-middle ms-25">Continue </span>
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ConfirmationProfile;
