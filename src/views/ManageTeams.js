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
import {useDispatch} from 'react-redux';

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
import { getUser } from '../redux/navbar';

const ManageTeams = () => {
  const dispatch = useDispatch();

  const [profileSignature, setprofileSignature] = useState('');
  const [SignatureModal, setSignatureModal] = useState(false);
  const [active, setActive] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    // const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
    // const tokenString = localStorage.getItem('token');
    // if (tokenString) {
    //   const token = JSON.parse(tokenString);
    //   if (token && token.user_id && token.token) {
    //     const companyId = token.company_id;

    //     // Dispatch fetchLogo if token and companyId exist

    //     const action = await dispatch(getUser({user_id: token.user_id, token: token.token}));
    //     console.log('User data:', action.payload);
    //     //  if (token && companyId) {
    //     //    const actiona =await dispatch(fetchLogo())
    //     //   console.log("dsjhfjsfhjdghjg",actiona.payload)
    //     // }
    //     let user_profile = action.payload.result[0];
    //     let user_plan = null;
    //     if (action.payload.result2 === null || action.payload.result2 === undefined) {
    //       user_plan = null;
    //     } else {
    //       user_plan = action.payload.result2[0];
    //     }
    //     let userDocumentsUploaded = action.payload.userDocuments;
    //     setUserPlanCurrent(user_plan);
    //     setUserTotalDocCount(userDocumentsUploaded);

    //     console.log(user_profile);
    //     setUserDetailsCutrrent(user_profile);
    //   } else {
    //     console.error('Token or user_id is missing in the token object');
    //   }
    // } else {
    //   console.error('Token not found in localStorage');
    // }
    //console.log(items?.token?.user_id);
    // const postData = {
    //   user_id: userDetailsCurrent?.user_id,
    // };
    // const apiData = await post('user/getUserById', postData); // Specify the endpoint you want to call
    // //console.log('apixxsData');
    // if (apiData.error) {
    //   // toastAlert("error", "")
    // } else {
    //   //console.log('<<<<<<<<GET USER DETAILS DATA SETTINGS >>>>>>>');

    //   //console.log(apiData.result[0]);
    //   if (apiData.result[0].company_id === null || apiData.result[0].company_id === undefined) {
    //     setCompanyData(null);
    //   } else {
    //     let company_id = apiData.result[0].company_id;
    //     let company_admin_login = apiData.result[0].company_admin;
    //     setCompany_Admin_Logged_User(company_admin_login);
    //     setCompany_User_Logged_User(apiData.result[0].company_user);
    //     //console.log("-------------------------")
    //     //console.log("-------------------------")
    //     //console.log(apiData.result[0].company_id)

    //     //console.log("-------------------------")

    //     setCompanyUsersData(apiData.result[0].company_id);
        const postData1 = {
          company_id: companyUsersData,
        };
        const apiData1 = await post('company/get_company', postData1); // Specify the endpoint you want to call
        //console.log('<<<<<<<<<company details>>>>>>>>>');
        //console.log(apiData1.data);
        setCompanyData(apiData1?.data);
      // }
      // if (apiData.result[0].signature_image_url === null || apiData.result[0].signature_image_url === undefined) {
      // } else {
      //   setprofileSignature(apiData.result[0].signature_image_url);
      // }
      // if (apiData.result[0].avatar === null) {
      //   setSelectedFileImage(null);
      // } else {
      //   setSelectedImage(BASE_URL + apiData.result[0].avatar);
      //   let url_LINK = BASE_URL + apiData.result[0].avatar;
      //   //console.log(url_LINK);
      //   //console.log('BASE_URL + apiData.result[0].avatar');

      //   setSelectedFileImage('API');

      //   //console.log(apiData.result[0].avatar);
      // }

      // setemail(apiData.result[0].email);
      // setInitialValues({
      //   firstname: apiData.result[0].first_name, // Set first name fetched from API
      //   lastname: apiData.result[0].last_name,
      //   phoneNo: apiData.result[0].contact_no,
      // });
      // setfirst_name(apiData.result[0].first_name);
      // setlast_name(apiData.result[0].last_name);
      // setContactNo(apiData.result[0].contact_no);
    // }
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
  const [userDetailsCurrent, setUserDetailsCutrrent] = useState(null);

  const fetchUserData = async () => {
    try {
      const tokenString = localStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        if (token && token.user_id && token.token) {
          const companyId = token.company_id;

          // Dispatch fetchLogo if token and companyId exist

          const action = await dispatch(getUser({user_id: token.user_id, token: token.token}));
          console.log('User dataASD:', action.payload);
          //  if (token && companyId) {
          //    const actiona =await dispatch(fetchLogo())
          //   console.log("dsjhfjsfhjdghjg",actiona.payload)
          // }
          let user_profile = action.payload.result[0];
         
          // setUserPlanCurrent(user_plan);
          // setUserTotalDocCount(userDocumentsUploaded);

          console.log(user_profile);
          setUserDetailsCutrrent(user_profile);
          let company_admin_login = user_profile.company_admin;
          setCompany_Admin_Logged_User(company_admin_login);
          setCompany_User_Logged_User(user_profile.company_user);
          //console.log("-------------------------")
          //console.log("-------------------------")
          //console.log(apiData.result[0].company_id)
  
          //console.log("-------------------------")
  
          setCompanyUsersData(user_profile.company_id);
        } else {
          console.error('Token or user_id is missing in the token object');
        }
      } else {
        console.error('Token not found in localStorage');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };
  useEffect(() => {
    const fetchDataSequentially = async () => {
      await fetchUserData();
      // fetchlocationUrl and fetchAllFiles will now be called in a separate useEffect
      // that listens for changes on userDetailsCurrent
    };

    fetchDataSequentially();
  }, [dispatch]);
  useEffect(() => {
    if (userDetailsCurrent) {
      const fetchDataBasedOnUser = async () => {

        await getUserSignature();
        // await getUserPrevInitials();
        // await getUserPrevSignatures();
        // await getUserPlan();
        // await getLocatinIPn();
  };

  fetchDataBasedOnUser();
    }
  }, [userDetailsCurrent]);
  return (
    <div>
      <Row>
        <Col md="12" xs="12" className="d-flex justify-content-between">
          <h1>Manage Teams</h1>
          {/* <Button size='sm' style={{ marginLeft: '10px', fontSize: '16px', boxShadow: 'none', height: '40px' }}
          color='primary'
          onClick={() => {
            setSignatureModal(!SignatureModal)
          }}
        >
          Add Initials
        </Button> */}
        </Col>
        <Col xs={12} md={12} style={{padding: '10px'}}>
          <Card>
            {' '}
            <Row>
              <Col xs={12} md={12} style={{padding:"40px"}}>
                <CompanyUsers
                  companyUsersData={companyUsersData}
                  company_admin_Logged_User={company_admin_Logged_User}
                />
              </Col>

             
            </Row>{' '}
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

export default ManageTeams;
