import {AlertTriangle, CreditCard, Edit2, EyeOff, Home, Settings, User, X} from 'react-feather';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import '../views/StylesheetPhoneNo.css';
import {Form, Formik} from 'formik';
import image_dummy from '@assets/images/pages/images.jpg';
import {BASE_URL, post, postFormData} from '../apis/api';
import toastAlert from '@components/toastAlert';
import * as Yup from 'yup';
// ** Steps


import logoRemoveBg from '@assets/images/pages/logoRemoveBg.png';
import {
  Button,
  Card,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
  UncontrolledTooltip,
} from 'reactstrap';
import {useEffect, useRef, useState} from 'react';
// ** Custom Components
import Wizard from '@components/wizard';
import PricingCards from '../views/PricingCards';
import {get} from '../apis/api';
import getActivityLogUser from '../utility/IpLocation/MaintainActivityLogUser';
const ModalConfirmationProfileAndPlan = ({isOpen, toggleFunc}) => {
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
    phoneNo: Yup.string()
      .nullable()
      .matches(/^[0-9]+$/, 'Phone Number should contain only numbers')
      .required('Phone Number is required'),
  });
  const [initialValues, setInitialValues] = useState({
    firstname: '', // Initialize with empty string
    lastname: '',
    phoneNo: '',
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
  const handleImageSelect = event => {
    const file = event.target.files[0];
    setSelectedFileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
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
        //console.log(url_LINK);
        //console.log('BASE_URL + apiData.result[0].avatar');

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
          // setPlanSelect(false);
          // setCompleteProfile(false);
          // setPlanSelect(true);
          // setCompleteProfile(false);
        }
        // setCompleteProfile(false);
      }
      setemail(apiData.result[0].email);
      setInitialValues({
        firstname: apiData.result[0].first_name, // Set first name fetched from API
        lastname: apiData.result[0].last_name,
        phoneNo: apiData.result[0].contact_no,
      });
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
      <Modal
        className={planSelect ? 'modal-dialog-centered modal-fullscreen' : 'modal-dialog-centered modal-sm'}
        isOpen={isOpen}
        toggle={toggleFunc}
        centered>
        <ModalBody>
          {planSelect ? (
            <>
              <div
                style={{
                  display: ' flex',
                  justifyContent: 'space-between',
                  marginTop: '2%',
                }}>
                <div></div>
                <img src={logoRemoveBg} alt="logo" style={{width: '250px', height: 'auto'}} />
                <X id="positionLeft" size={26} onClick={toggleFunc} style={{cursor: 'pointer'}} />
                <UncontrolledTooltip placement="top" target="positionLeft">
                  Close
                </UncontrolledTooltip>
              </div>
              <Row>
                <Col md="12" xs="12" className="d-flex justify-content-center">
                  <div id="pricing-table">
                    <div className="text-center">
                      <h1
                        className="mt-1"
                        style={{
                          fontSize: '23px',
                          fontWeight: 400,
                          color: '#6d6b6b',
                        }}>
                        Upgrade Plan
                      </h1>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
                      </div>

                      {/* <div
                        className="d-flex align-items-center justify-content-center pb-2"
                        sgtyle={{margin: 0, padding: 0}}>
                        <h3 className="me-50 mb-0">Monthly</h3>
                        <div className="form-switch">
                          <Input id="plan-switch" type="switch" checked={duration === 'yearly'} onChange={onChange} />
                        </div>
                        <h3 className="ms-50 mb-0">Yearly</h3>
                      </div> */}
                      <h3 style={{fontWeight: 600}}>Pick a plan to continue using RequireSign</h3>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={12}>
                  <PricingCards
                    data={referalCodes}
                    duration={duration}
                    fetchData={() => fetchData1()}
                    selectedPlan={selectedPlan}
                    SelectedAmount={SelectedAmount}
                    email={email}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <>
              {' '}
              <div
                style={{
                  display: ' flex',
                  justifyContent: 'space-between',
                }}>
                <h1 className="fw-bold">Complete Your Profile.</h1>
                <X size={24} onClick={toggleFunc} style={{cursor: 'pointer'}} />
              </div>
              {/* formik  */}
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, {setSubmitting, resetForm}) => {
                  setSubmitting(true);
                  //console.log(values);
                  setSubmitting(true);
                  //console.log('Update Profile ');
                  const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
                  //console.log(items?.token?.user_id);
                  //console.log(selectedFileImage);
                  if (selectedFileImage === null || selectedFileImage === undefined || selectedFileImage === 'API') {
                    const postData = {
                      user_id: items?.token?.user_id,
                      first_name: values.firstname,
                      last_name: values.lastname,
                      contact_no: values.phoneNo,
                    };
                    try {
                      const apiData = await post('user/update_profile', postData); // Specify the endpoint you want to call
                      //console.log('Signers ');
                      //console.log(apiData);
                      if (apiData.error) {
                        setSubmitting(false);
                        toastAlert('error', "Can't Update Right Now!");
                      } else {
                        setSubmitting(false);
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
                        setPlanSelect(true);
                        toastAlert('success', 'Profile Updated Successfully!');
                      }
                    } catch (error) {
                      toastAlert('error', "Can't Update Right Now!");

                      //console.log('Error fetching data:', error);
                      setSubmitting(false);
                    }
                  } else {
                    // update avatar
                    const postData = {
                      image: selectedFileImage,
                    };
                    const apiData = await postFormData(postData); // Specify the endpoint you want to call
                    //console.log(apiData);
                    if (apiData.path === null || apiData.path === undefined || apiData.path === '') {
                      // toastAlert("error", "Error uploading Files")
                      toastAlert('error', 'Error uploading Files!');
                      setSubmitting(false);
                    } else {
                      const url = apiData.path;
                      //console.log(apiData);
                      // call api to update
                      const postData1 = {
                        user_id: items?.token?.user_id,
                        first_name: values.firstname,
                        last_name: values.lastname,
                        contact_no: values.phoneNo,
                        avatar: url,
                      };
                      try {
                        const apiData1 = await post('user/update_profile', postData1); // Specify the endpoint you want to call
                        //console.log('Signers ');
                        //console.log(apiData1);
                        if (apiData1.error) {
                          setSubmitting(false);
                          toastAlert('error', "Can't Update Right Now!");
                        } else {
                          setSubmitting(false);
                          setSelectedFileImage(null);
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
                          toastAlert('success', 'Profile Updated Successfully!');
                          setPlanSelect(true);
                          // setTimeout(() => window.location.reload(), 500);
                        }
                      } catch (error) {
                        toastAlert('error', "Can't Update Right Now!");

                        //console.log('Error fetching data:', error);
                        setSubmitting(false);
                      }
                    }
                  }
                }}>
                {({getFieldProps, errors, touched, isSubmitting, values, handleChange}) => (
                  <Form className="auth-register-form mt-2">
                    <Row>
                      <Col xs={12} md={1}></Col>
                      <Col xs={12} md={10} style={{display: 'flex', justifyContent: 'center'}}>
                        <Row style={{display: 'flex', justifyContent: 'center'}}>
                          {/* <Col xs={12} md={12} style={{display: 'flex', justifyContent: 'center'}}>
                            <div className="mb-1" style={{position: 'relative'}}>
                              {selectedFileImage === null ||
                              selectedFileImage === 'null' ||
                              selectedFileImage === 'undefined' ||
                              selectedFileImage === 'API' ? (
                                <>
                                  {selectedFileImage === 'API' ? (
                                    <img
                                      src={selectedImage}
                                      alt="image-data"
                                      style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        border: '1px solid lightGrey',
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={image_dummy}
                                      alt="image-data"
                                      style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        border: '1px solid lightGrey',
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
                                      width: '100px',
                                      height: '100px',
                                      borderRadius: '50%',
                                      border: '1px solid lightGrey',
                                    }}
                                  />
                                </>
                              )}

                              <label
                                htmlFor="image-upload"
                                style={{
                                  position: 'absolute',
                                  top: '-5px',
                                  right: '-5px',
                                  cursor: 'pointer',
                                  backgroundColor: 'transparent',
                                  color: '#23b3e8',
                                  borderRadius: '40%',
                                }}>
                                <Edit2 size={15} id="positionLeft" />
                                <UncontrolledTooltip placement="left" target="positionLeft">
                                  Change Image
                                </UncontrolledTooltip>
                              </label>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                style={{display: 'none'}}
                                onChange={handleImageSelect}
                              />
                            </div>
                          </Col> */}
                          <Col xs={12} md={12}>
                            <div className="mb-1">
                              <Label className="form-label" for="register-firstname">
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
                                style={{boxShadow: 'none', fontSize: '16px'}}
                                className={`form-control ${touched.firstname && errors.firstname ? 'is-invalid' : ''}`}
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
                              <PhoneInput
                                className={`input-phone-number  ${
                                  touched.phoneNo && errors.phoneNo ? 'is-invalid' : ''
                                }`}
                                {...getFieldProps('phoneNo')}
                                value={values['phoneNo']}
                                country={'us'}
                                enableSearch={true}
                                onChange={handleChange('phoneNo')}
                                defaultCountry={'us'}
                              />
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
                              {touched.phoneNo && errors.phoneNo ? (
                                <div className="invalid-feedback">{errors.phoneNo}</div>
                              ) : null}
                              {/* {touched.phoneNo && errors.phoneNo ? (
                      <div className="invalid-feedback">{errors.phoneNo}</div>
                    ) : null} */}
                            </div>
                          </Col>
                          {/* <Col xs={12} md={6}>
                            <div className="mb-1">
                              <Label className="form-label" for="register-email">
                                Email
                              </Label>
                              <Input
                                disabled
                                style={{boxShadow: 'none', fontSize: '16px'}}
                                value={email}
                                onChange={e => setemail(e.target.value)}
                              />
                            </div>
                          </Col> */}
                          <Col xs={12} md={12}>
                            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1%'}}>
                              <Button
                                style={{boxShadow: 'none', marginTop: '1%', marginBottom: '1%'}}
                                // onClick={() => updateProfile()}
                                type="submit"
                                color="primary"
                                size="sm"
                                disabled={isSubmitting}>
                                {isSubmitting ? <Spinner color="light" size="sm" /> : null}
                                <span className="align-middle ms-25">Complete Profile </span>
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} md={1}></Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};
export default ModalConfirmationProfileAndPlan;
