import {useEffect, useState} from 'react';
import SignatureModalContent from '../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent';
import {
  Button,
  Card,
  Col,
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
} from 'reactstrap';
import {BASE_URL, post, postFormData, put} from '../apis/api';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import './StylesheetPhoneNo.css';
import toastAlert from '@components/toastAlert';
// import Avatar from '@components/avatar';
import image_dummy from '@assets/images/pages/images.jpg';
import {Edit, Edit2, Grid, PlusCircle, Trash2} from 'react-feather';
import InputPasswordToggle from '@components/input-password-toggle';
import ModalConfirmationAlert from '../components/ModalConfirmationAlert';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import getUserLocation from '../utility/IpLocation/GetUserLocation';
import getActivityLogUser from '../utility/IpLocation/MaintainActivityLogUser';
import BillingTabContent from '../components/account-settings/BillingTabContent';
import CompanyUsers from './CompanyUsers';
import CompprofileUpdate from '../components/CompprofileUpdate';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const {t} = useTranslation();

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().nullable()
      .matches(/^[a-zA-Z -]+$/, 'First Name should contain only alphabets')
      .required('First Name is required'),
    lastname: Yup.string().nullable()
      .matches(/^[a-zA-Z -]+$/, 'Last Name should contain only alphabets')
      .required('Last Name is required'),
    phoneNo: Yup.string().nullable()
      .matches(/^[0-9]+$/, 'Phone Number should contain only numbers')
      .required('Phone Number is required'),
  });
  const validationSchema1 = Yup.object().shape({
    old_password: Yup.string().nullable().required('Password is required'),
    password: Yup.string().nullable()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol'),
    confirm_password: Yup.string().nullable()
      .required('Please Confirm your Password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });
  const [profileSignature, setprofileSignature] = useState('');
  const [SignatureModal, setSignatureModal] = useState(false);
  const [active, setActive] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact_no, setContactNo] = useState('');
  const [first_name, setfirst_name] = useState('');
  const [last_name, setlast_name] = useState('');
  const [email, setemail] = useState('');
  // const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [itemDeleteConfirmation1, setItemDeleteConfirmation1] = useState(false);

  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);
  const [DeleteSignatureId, setDeleteSignatureId] = useState('');
  const DeleteSignature = async () => {
    setLoadingDeleteFile(true);
    //console.log(DeleteSignatureId);
    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
    //console.log(items?.token?.user_id);
    const postData = {
      user_id: items?.token?.user_id,
      user_signature_id: DeleteSignatureId,
    };
    try {
      const apiData = await post('user/DeleteSignature', postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert('error', apiData.message);
        // setFilesArray([])
      } else {
        const user_id_local = JSON.parse(localStorage.getItem('@UserLoginRS'));
        const user_id = user_id_local.token.user_id;
        const email = user_id_local.token.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: 'DELETED-PROFILE-SIGNATURE',
          description: `${email} deleted profile signature`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        toastAlert('succes', apiData.message);
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
    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
    //console.log(items?.token?.user_id);
    const postData = {
      user_id: items?.token?.user_id,
      user_signature_id: DeleteSignatureId,
    };
    try {
      const apiData = await post('user/DeleteSignature', postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert('error', apiData.message);
        // setFilesArray([])
      } else {
        const user_id_local = JSON.parse(localStorage.getItem('@UserLoginRS'));
        const user_id = user_id_local.token.user_id;
        const email = user_id_local.token.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: 'DELETED-PROFILE-SIGNATURE',
          description: `${email} deleted profile initials`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        toastAlert('succes', apiData.message);
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
  const toggle = tab => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const placeImage = async (url, prevSign, typeSign) => {
    if (initialBox) {
      setIsSubmitting(true);
      //console.log('Enbetrehb');
      setSignatureModal(!SignatureModal);
      const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
      //console.log(items?.token?.user_id);
      const user_id = items?.token?.user_id;
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
        type: 'profile_initils',
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
        const apiData = await post('user/AddUserSignaturesToDb', postData); // Specify the endpoint you want to call
        //console.log('Signers ');
        //console.log(apiData);
        if (apiData.error) {
          setIsSubmitting(false);
          toastAlert('error', "Can't Update Right Now!");
        } else {
          setIsSubmitting(false);
          getUserSignature();
          getUserPrevInitials();
          const user_id_local = JSON.parse(localStorage.getItem('@UserLoginRS'));
          const user_id = user_id_local.token.user_id;
          const email = user_id_local.token.email;

          let response_log = await getActivityLogUser({
            user_id: user_id,
            event: 'PROFILE-INITIALS-ADDED',
            description: `${email} profile initials added   `,
          });
          if (response_log === true) {
            //console.log('MAINTAIN LOG SUCCESS');
          } else {
            //console.log('MAINTAIN ERROR LOG');
          }
          toastAlert('success', 'Initials Updated Successfully!');
        }
      } catch (error) {
        toastAlert('error', "Can't Update Right Now!");

        //console.log('Error fetching data:', error);
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      //console.log('Enbetrehb');
      setSignatureModal(!SignatureModal);
      const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
      //console.log(items?.token?.user_id);
      const user_id = items?.token?.user_id;
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
        type: 'profile',
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
        const apiData = await post('user/AddUserSignaturesToDb', postData); // Specify the endpoint you want to call
        //console.log('Signers ');
        //console.log(apiData);
        if (apiData.error) {
          setIsSubmitting(false);
          toastAlert('error', "Can't Update Right Now!");
        } else {
          setIsSubmitting(false);
          getUserSignature();
          getUserPrevSignatures();
          const user_id_local = JSON.parse(localStorage.getItem('@UserLoginRS'));
          const user_id = user_id_local.token.user_id;
          const email = user_id_local.token.email;

          let response_log = await getActivityLogUser({
            user_id: user_id,
            event: 'PROFILE-SIGNATURE-ADDED',
            description: `${email} profile signature added   `,
          });
          if (response_log === true) {
            //console.log('MAINTAIN LOG SUCCESS');
          } else {
            //console.log('MAINTAIN ERROR LOG');
          }
          toastAlert('success', 'Signature Updated Successfully!');
        }
      } catch (error) {
        toastAlert('error', "Can't Update Right Now!");

        //console.log('Error fetching data:', error);
        setIsSubmitting(false);
      }
    }
  };

  const [initialValues, setInitialValues] = useState({
    firstname: '', // Initialize with empty string
    lastname: '',
    phoneNo: '',
  });
  const [initialValues1, setInitialValues1] = useState({
    old_password: '',
    password: '', // Initialize with empty string
    confirm_password: '',
  });
  const [companyData, setCompanyData] = useState(null);
  const [company_user_Logged_User, setCompany_User_Logged_User] = useState(null);
  const [company_admin_Logged_User, setCompany_Admin_Logged_User] = useState(null);
  const [companyUsersData, setCompanyUsersData] = useState(null);
  const getUserSignature = async () => {
    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
    //console.log(items?.token?.user_id);
    const postData = {
      user_id: items?.token?.user_id,
    };
    const apiData = await post('user/getUserById', postData); // Specify the endpoint you want to call
    //console.log('apixxsData');
    if (apiData.error) {
      // toastAlert("error", "")
    } else {
      //console.log('<<<<<<<<GET USER DETAILS DATA SETTINGS >>>>>>>');

      //console.log(apiData.result[0]);
      if (apiData.result[0].company_id === null || apiData.result[0].company_id === undefined) {
        setCompanyData(null);
      } else {
        let company_id = apiData.result[0].company_id;
        let company_admin_login = apiData.result[0].company_admin;
        setCompany_Admin_Logged_User(company_admin_login);
        setCompany_User_Logged_User(apiData.result[0].company_user);
        //console.log("-------------------------")
        //console.log("-------------------------")
        //console.log(apiData.result[0].company_id)

        //console.log("-------------------------")

        setCompanyUsersData(apiData.result[0].company_id);
        const postData1 = {
          company_id: company_id,
        };
        const apiData1 = await post('company/get_company', postData1); // Specify the endpoint you want to call
        //console.log('<<<<<<<<<company details>>>>>>>>>');
        //console.log(apiData1.data);
        setCompanyData(apiData1?.data);
      }
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

      setemail(apiData.result[0].email);
      setInitialValues({
        firstname: apiData.result[0].first_name, // Set first name fetched from API
        lastname: apiData.result[0].last_name,
        phoneNo: apiData.result[0].contact_no,
      });
      // setfirst_name(apiData.result[0].first_name);
      // setlast_name(apiData.result[0].last_name);
      // setContactNo(apiData.result[0].contact_no);
    }
  };

  const [initialBox, setInitialBox] = useState(null);
  const [PrevInitialArray, setPrevInitialArrayImage] = useState([]);

  const [PrevSignatureArray, setPrevSignatureArrayImage] = useState([]);
  const getUserPrevSignatures = async () => {
    //console.log('imageDataURL');
    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));

    const user_id = items?.token?.user_id;
    //console.log(user_id);

    const postData = {
      user_id: user_id,
      type: 'profile',
    };
    const apiData = await post('user/GetUserSignaturesToDb', postData); // Specify the endpoint you want to call
    //console.log('apiDatasdfsddsf');

    //console.log(apiData);
    if (apiData.error == true || apiData.error === 'true') {
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
    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));

    const user_id = items?.token?.user_id;
    //console.log(user_id);

    const postData = {
      user_id: user_id,
      type: 'profile_initils',
    };
    const apiData = await post('user/GetUserSignaturesToDb', postData); // Specify the endpoint you want to call
    //console.log('apiDatasdfsddsf');

    //console.log(apiData);
    if (apiData.error == true || apiData.error === 'true') {
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
  const [customerIdStripe, setCustomerIdStripe] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userCards, setUserCards] = useState(null);
  const [billingDetails, setBillingDetails] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [percentageRemaining, setPercentageRemaining] = useState(0);
  const [differenceInDays, setDifferenceInDays] = useState(0);
  const getUserPlan = async () => {
    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
    //console.log(items?.token?.user_id);
    // setemail(items?.token?.email);
    // //console.log('Navbar');
    // //console.log('User Profile Signature UPGRADE SECTION');
    const postData = {
      user_id: items?.token?.user_id,
    };
    const apiData = await post('plan/get_user_plan', postData); // Specify the endpoint you want to call
    console.log('USER PLAN GET ...');
    console.log(apiData);

    if (apiData.error) {
      // toastAlert("error", "")
    } else {
      console.log(apiData);
      if (apiData.result.length === 0) {
      } else {
        setCustomerIdStripe(apiData?.result[0]?.stripe_customer_id);
        setSelectedPlan(apiData?.result[0]);
        setUserCards(apiData?.cards);
        setBillingDetails(apiData?.billingDetails);
        setPlanDetails(apiData?.planDetails);
        setTotalDays(apiData?.totalDays);
        setDifferenceInDays(apiData?.differenceInDays);
        setPercentageRemaining(apiData?.percentageRemaining);
        // setSelectedPlan(apiData.result[0].plan_id);
        // // setSelectedPlanType(apiData.planDetails.type);
        // setSelectedAmount(apiData.result[0].amount);
        // setSelectedCustIdStripe(apiData.result[0].stripe_customer_id);
        // if (apiData.result[0].type === 'yearly') {
        //   setDuration('yearly');
        //   setSelectedDuration('yearly')
        // } else {
        //   setDuration('monthly');
        //    setSelectedDuration('monthly')
        // }
      }
    }
  };
  const [locationIP, setLocationIP] = useState('');
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  useEffect(() => {
    getUserSignature();
    getUserPrevInitials();
    getUserPrevSignatures();
    getUserPlan();
    getLocatinIPn();
  }, []);
  return (
    <div>
      <Row>
        <Col md="12" xs="12" className="d-flex justify-content-between">
          <h1>Settings</h1>
          {/* <Button size='sm' style={{ marginLeft: '10px', fontSize: '16px', boxShadow: 'none', height: '40px' }}
          color='primary'
          onClick={() => {
            setSignatureModal(!SignatureModal)
          }}
        >
          Add Initials
        </Button> */}
        </Col>
        <Col xs={12} md={12} style={{padding:"10px"}}>
           <Card> <Row >
          

          
            
          
        <Col md="2" xs="12" style={{display: 'flex', justifyContent: 'left'}}>
          <Nav tabs className="nav-left" vertical style={{textAlign:"left",fontSize:"18px"}}>
            {/* <NavItem>
              <NavLink
                active={active === '5'}
                onClick={() => {
                  toggle('5');
                }}>
                Company Profile
              </NavLink>
            </NavItem> */}
            <NavItem >
              <NavLink
                active={active === '1'}
                onClick={() => {
                  toggle('1');
                }} >
               {t("My Account")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '2'}
                onClick={() => {
                  toggle('2');
                }}>
               My Signature
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '4'}
                onClick={() => {
                  toggle('4');
                }}>
                My Initials
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                active={active === '3'}
                onClick={() => {
                  toggle('3');
                }}>
                Update Password
              </NavLink>
            </NavItem>
            {company_admin_Logged_User === true || company_admin_Logged_User === 'true' ? (
              <>
                <NavItem>
                  <NavLink
                    active={active === '5'}
                    onClick={() => {
                      toggle('5');
                    }}>
                    Billing
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '6'}
                    onClick={() => {
                      toggle('6');
                    }}>
                    Company Profile
                  </NavLink>
                </NavItem>
              </>
            ) : null}
{/* { */}
  {/* // company_user_Logged_User||company_admin_Logged_User===true|| company_admin_Logged_User === 'true' ? */}
  <NavItem>
              <NavLink
                active={active === '7'}
                onClick={() => {
                  toggle('7');
                }}>
                Company Users
              </NavLink>
            </NavItem>
            {/* // :null} */}

            
          </Nav>
        </Col>
        <Col md="10" xs="12" style={{padding:"10px"}}>
          <TabContent className="py-50" activeTab={active}>
            <TabPane tabId="1">
              <h2>{t("My Account")}</h2>
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
                        getUserSignature();
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
                          getUserSignature();
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
                          setTimeout(() => window.location.reload(), 500);
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
                      <Col xs={12} md={3}></Col>
                      <Col xs={12} md={6} style={{display: 'flex', justifyContent: 'center'}}>
                        <Row style={{display: 'flex', justifyContent: 'center'}}>
                          <Col xs={12} md={12} style={{display: 'flex', justifyContent: 'center'}}>
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
                          </Col>
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
                          <Col xs={12} md={12}>
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
                          </Col>
                          <Col xs={12} md={12}>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                              <Button
                                style={{boxShadow: 'none', marginTop: '1%'}}
                                // onClick={() => updateProfile()}
                                type="submit"
                                color="primary"
                                size="sm"
                                disabled={isSubmitting}>
                                {isSubmitting ? <Spinner color="light" size="sm" /> : null}
                                <span className="align-middle ms-25">Update </span>
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} md={3}></Col>
                    </Row>
                  </Form>
                )}
              </Formik>
              <h2>My Signature</h2>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col xs={12} md={3}></Col>
                <Col xs={12} md={6} style={{display: 'flex', justifyContent: 'center'}}>
                  <div className="mb-1">
                    <div
                      onClick={() => {
                        setInitialBox(false);
                        setSignatureModal(true);
                      }}
                      className="image-picker">
                      <div className="box1">
                        <PlusCircle size={30} />
                        <h5 style={{marginTop: '10px'}}>Upload Signature</h5>
                      </div>
                    </div>

                    <Row style={{maxHeight: '500px', overflowY: 'auto', marginBlock: '10px'}}>
                      {PrevSignatureArray.length === 0 ? null : (
                        <>
                          {PrevSignatureArray.map((item, index) => (
                            <>
                              <Col sm="4" key={index}>
                                <div
                                  style={{
                                    position: 'relative',
                                    height: 'auto',
                                    width: '100%',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid lightGrey',
                                    marginBottom: '10px',
                                  }}>
                                  <img
                                    width="100%"
                                    height="100px"
                                    src={`${BASE_URL}${item.signature_image_url}`}
                                    alt="Card image cap"
                                    // onClick={() => saveSignature(PrevSignatureArray, 'prevSign')}
                                  />
                                  <Trash2
                                    size={15}
                                    color="red"
                                    onClick={() => {
                                      setDeleteSignatureId(item.user_signature_id);
                                      setItemDeleteConfirmation(true);
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      position: 'absolute',
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
                  </div>
                </Col>
                <Col xs={12} md={3}></Col>
              </Row>
            </TabPane>
            <TabPane tabId="4">
              <Row>
                <Col xs={12} md={5}></Col>
                <Col xs={12} md={2} style={{display: 'flex', justifyContent: 'center'}}>
                  <div className="mb-1">
                    <div
                      onClick={() => {
                        setInitialBox(true);
                        setSignatureModal(true);
                      }}
                      className="image-picker">
                      <div className="box2">
                        <PlusCircle size={30} />
                        <h5 style={{marginTop: '10px'}}>Upload Initials</h5>
                      </div>
                    </div>

                    <Row style={{maxHeight: '500px', overflowY: 'auto', marginBlock: '10px'}}>
                      {PrevInitialArray.length === 0 ? null : (
                        <>
                          {PrevInitialArray.map((item, index) => (
                            <>
                              <Col sm="4" key={index}>
                                <div
                                  style={{
                                    position: 'relative',
                                    height: 'auto',
                                    width: '100%',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid lightGrey',
                                    marginBottom: '10px',
                                  }}>
                                  <img
                                    width="100%"
                                    height="100px"
                                    src={`${BASE_URL}${item.signature_image_url}`}
                                    alt="Card image cap"
                                    // onClick={() => saveSignature(PrevSignatureArray, 'prevSign')}
                                  />
                                  <Trash2
                                    size={15}
                                    color="red"
                                    onClick={() => {
                                      setDeleteSignatureId(item.user_signature_id);
                                      setItemDeleteConfirmation1(true);
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      position: 'absolute',
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
                  </div>
                </Col>
                <Col xs={12} md={5}></Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Col xs={12} md={4}></Col>
              <Col xs={12} md={4} className="mx-auto">
                <Formik
                  initialValues={initialValues1}
                  validationSchema={validationSchema1}
                  onSubmit={async (values, {setSubmitting}) => {
                    setSubmitting(true);
                    //console.log('Update Profile ');
                    const postData = {
                      email: email,
                      password: values.password,
                      old_password: values.old_password,
                    };
                    try {
                      const apiData = await put('user/passwordUpdateProf', postData); // Specify the endpoint you want to call
                      //console.log('Signers ');
                      //console.log(apiData);
                      if (apiData.error) {
                        setSubmitting(false);
                        toastAlert('error', apiData.message);
                      } else {
                        setSubmitting(false);
                        getUserSignature();
                        const user_id_local = JSON.parse(localStorage.getItem('@UserLoginRS'));
                        const user_id = user_id_local.token.user_id;
                        const email = user_id_local.token.email;

                        let response_log = await getActivityLogUser({
                          user_id: user_id,
                          event: 'PASSWORD-UPDATED',
                          description: `${email} updated account password from profile `,
                        });
                        if (response_log === true) {
                          //console.log('MAINTAIN LOG SUCCESS');
                        } else {
                          //console.log('MAINTAIN ERROR LOG');
                        }
                        toastAlert('success', 'Password Updated Successfully!');
                      }
                    } catch (error) {
                      toastAlert('error', "Can't Update Right Now!");

                      //console.log('Error fetching data:', error);
                      setSubmitting(false);
                    }
                  }}>
                  {({getFieldProps, errors, touched, isSubmitting}) => (
                    <Form className="auth-login-form mt-2">
                      <Row className="justify-content-center">
                        <Col xs={12} md={12}>
                          <div className="mb-1">
                            <Label className="form-label" for="register-lastname">
                              Old Password
                            </Label>
                            <InputPasswordToggle
                              style={{
                                fontSize: '16px',
                              }}
                              // value={password}
                              // onChange={e => {
                              //   setPassword(e.target.password);
                              // }}
                              // id="register-password"
                              className={`input-group-merge ${
                                touched.old_password && errors.old_password ? 'is-invalid' : ''
                              }`}
                              {...getFieldProps('old_password')}
                              id="login-password-1"
                            />
                            {touched.old_password && errors.old_password ? (
                              <div className="invalid-feedback">{errors.old_password}</div>
                            ) : null}
                          </div>
                          <div className="mb-1">
                            <Label className="form-label" for="register-lastname">
                              New Password
                            </Label>
                            <InputPasswordToggle
                              style={{
                                fontSize: '16px',
                              }}
                              // value={password}
                              // onChange={e => {
                              //   setPassword(e.target.password);
                              // }}
                              // id="register-password"
                              className={`input-group-merge ${touched.password && errors.password ? 'is-invalid' : ''}`}
                              {...getFieldProps('password')}
                              id="login-password-1"
                            />
                            {touched.password && errors.password ? (
                              <div className="invalid-feedback">{errors.password}</div>
                            ) : null}
                          </div>
                          <div className="mb-1">
                            <Label className="form-label" for="register-lastname">
                              Confirm Password
                            </Label>
                            <InputPasswordToggle
                              style={{
                                fontSize: '16px',
                              }}
                              // value={password}
                              // onChange={e => {
                              //   setPassword(e.target.password);
                              // }}
                              // id="register-password"
                              className={`input-group-merge ${
                                touched.confirm_password && errors.confirm_password ? 'is-invalid' : ''
                              }`}
                              {...getFieldProps('confirm_password')}
                              id="login-password-1"
                            />
                            {touched.confirm_password && errors.confirm_password ? (
                              <div className="invalid-feedback">{errors.confirm_password}</div>
                            ) : null}
                          </div>
                        </Col>

                        <Col xs={12} md={12}>
                          <div className="d-flex justify-content-center">
                            <Button
                              style={{boxShadow: 'none', marginTop: '1%'}}
                              // onClick={() => updatePassword()}
                              type="submit"
                              color="primary"
                              size="sm"
                              disabled={isSubmitting}>
                              {isSubmitting ? <Spinner color="light" size="sm" /> : null}
                              <span className="align-middle ms-25">Update Password</span>
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Col>
              <Col xs={12} md={4}></Col>
            </TabPane>
            <TabPane tabId="5">
              <BillingTabContent
                percentageRemaining={percentageRemaining}
                stripe_customer_id={customerIdStripe}
                selectedPlan={selectedPlan}
                userCards={userCards}
                billingDetails={billingDetails}
                planDetails={planDetails}
                locationIP={locationIP}
                totalDays={totalDays}
                differenceInDays={differenceInDays}
              />
            </TabPane>
            <TabPane tabId="6">
              <Row>
                <Col xs={12} md={2}></Col>
                <Col xs={12} md={8}>
                  
                  <CompprofileUpdate />
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
              <CompanyUsers companyUsersData={companyUsersData} company_admin_Logged_User={company_admin_Logged_User} />
            </TabPane>
          </TabContent>
        </Col>
        </Row>  </Card>
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
          <SignatureModalContent
            profile={true}
            modalClose={() => {
              setSignatureModal(!SignatureModal);
            }}
            returnedSignature={placeImage}
            initialsBox={initialBox}
            //  file_id={file_id}
          />
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDeleteFile}
        callBackFunc={DeleteSignature}
        alertStatusDelete={'delete'}
        text="Are you sure you want to delete this Signature?"
      />
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation1}
        toggleFunc={() => setItemDeleteConfirmation1(!itemDeleteConfirmation1)}
        loader={loadingDeleteFile}
        callBackFunc={DeleteSignature1}
        alertStatusDelete={'delete'}
        text="Are you sure you want to delete this Initials?"
      />
    </div>
  );
};

export default Settings;
