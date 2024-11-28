// ** React Imports
import {Link, useParams} from 'react-router-dom';

// ** Custom Hooks
import {useSkin} from '@hooks/useSkin';

// ** Reactstrap Imports
import {Row, Col, CardTitle, CardText, Button, Form, Input, Spinner, Label} from 'reactstrap';

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/two-steps-verification-illustration.png';
import illustrationsDark from '@src/assets/images/pages/two-steps-verification-illustration-dark.png';
import illustrationsLight1 from '@src/assets/images/pages/error.png';
import illustrationsDark1 from '@src/assets/images/pages/error-dark.svg';
import logoRemoveBg from '@src/assets/images/pages/logoRemoveBg.png';
import {useLocation} from 'react-router-dom';
// ** Styles
import '@styles/react/pages/page-authentication.scss';
import '@styles/base/pages/page-misc.scss';
import {useEffect, useState} from 'react';
import {post} from '../apis/api';
import getUserLocation from '../utility/IpLocation/GetUserLocation';
import getActivityLogUser from '../utility/IpLocation/MaintainActivityLogUser';
import { CheckCircle } from 'react-feather';
import ModalReusable from '../components/ModalReusable';
import { encrypt } from '../utility/auth-token';
import { getUser } from '../redux/navbar';
import {useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';

// import toastAlert from '@components/toastAlert';

const TwoStepsCover = () => {
  // states
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [tokenExpired, settokenExpired] = useState(false);
  const [emailData, setEmailData] = useState('');
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get('company_id');
  // ** Hooks
  const {skin} = useSkin();

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight;
  const source1 = skin === 'dark' ? illustrationsDark1 : illustrationsLight1;

  // get params token
  const {token} = useParams();
  const [userData, setUserData] = useState(null);
  // Activate account check
  const [tokenuser,setTokenUser]=useState(null)
  const ActivateAccount = async () => {
    //console.log(token);
    // //console.log(location)
    try {
    const postData = {
      verify_id: token,
    };
    // try {
    const apiData = await post('user/activateAccount', postData); // Specify the endpoint you want to call
    // setData(apiData);
    console.log(apiData);
    if (apiData.error) {
      if (apiData.errormsg === 'tokenexpired') {
        settokenExpired(true);
        setEmailData(apiData.data.email);
      } else if (apiData.errormsg === 'invalid') {
        console.log('dfjhdfdf');
        window.location.href = '/error';
        // setInvalid(true)
      }
    } else {
      console.log("dvsdgdfgsdg")

      console.log(apiData)
      setTokenUser(apiData.token)
      settokenExpired(false);
      // setverificationSuccess(true)
      // Activity Log
      const user_id = apiData.userDataID.user_id;
      const email = apiData.userDataID.email;
      setUserData(apiData.userDataID);
      

      let response_log = await getActivityLogUser({
        user_id: user_id,
        event: 'ACCOUNT-ACTIVATED',
        description: `${email} account activated `,
      });
      if (response_log === true) {
        //console.log('MAINTAIN LOG SUCCESS');
      } else {
        //console.log('MAINTAIN ERROR LOG');
      }
      if (companyId === null || undefined) {
      } else {
        console.log("Company Id ")
        console.log(companyId)
        window.location.href = `/update_password1?company_id=${companyId}&token=${token}`;

        // navigate to password set
      }
    }
  } catch (error) {
    console.error("An error occurred during account activation:", error);
  } finally {
    setSkeletonLoading(false);
  }
  };
  // Resent Verification Link
  const [loadingResend, setLoadingResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const handleResent = async () => {
    setLoadingResend(true);
    console.log(emailData);
    const postData = {
      email: emailData,
    };
    const apiData = await post('user/resendRegistrationLink', postData); // Specify the endpoint you want to call
    //console.log(apiData);
    if (apiData.error) {
      setModalError(true);
      setLoadingResend(false);
    } else {
      setLoadingResend(false);
      setModalSuccess(true);
    }
  };
  useEffect(() => {
    //console.log(token);
    ActivateAccount();
  }, []);
  return (
    <>
      {skeletonLoading  ? (
        // align center

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <Spinner className="me-25" size="lg" color="primary" />
        </div>
      ) : (
        <>
        {companyId === null || undefined ? <>
          {tokenExpired ? (
            <>
              <div className="misc-wrapper">
                <Link className="brand-logo" to="/" onClick={e => e.preventDefault()}>
                  <img src={logoRemoveBg} alt="Login Cover" style={{width: '200px', height: 'auto'}} />
                  {/* <h2 className='brand-text text-primary ms-1'>Vuexy</h2> */}
                </Link>

                <div className="misc-inner p-2 p-sm-3">
                  <div className="w-100 text-center">
                    <h1 className="mb-1 fw-bold">Token Expired 🚫🔑</h1>
                    <p className="mb-2" style={{fontSize: '16px'}}>
                      Oops! 😖 Looks like your previous token has expired as it's valid for 1 hours. Consequently, your
                      account is currently inactive. To swiftly reactivate your account, just click the button below.
                    </p>
                    <Button
                      style={{boxShadow: 'none',cursor:"pointer"}}
                      // tag={Link}
                      // to="/"
                      onClick={handleResent}
                      disabled={loadingResend}
                      color="primary"
                      className="btn-sm-block mb-2">
                      {loadingResend ? <Spinner color="light" size="sm" /> : null}
                      <span style={{fontSize: '16px'}} className="align-middle ms-25">
                        Resent Verification Link
                      </span>
                    </Button>
                    <img className="img-fluid" src={source1} alt="Not authorized page" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="auth-wrapper auth-cover">
                <Row className="auth-inner m-0">
                  <Link className="brand-logo" to="/" onClick={e => e.preventDefault()}>
                    <img src={logoRemoveBg} alt="Login Cover" style={{width: '200px', height: 'auto'}} />
                    {/* <h2 className='brand-text text-primary ms-1'>Vuexy</h2> */}
                  </Link>
                  <Col className="d-none d-lg-flex align-items-center p-5" lg="6" sm="12">
                    <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                      <img className="img-fluid" src={source} alt="Login Cover" />
                    </div>
                  </Col>
                  <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" style={{backgroundColor:"white"}} lg="6" sm="12">
                    <Col className="px-xl-1 mx-auto d-flex flex-column justify-content-center align-items-center text-justify" sm="8" md="8" lg="8">
                    <CheckCircle size={70} style={{color: '#4BB543'}} />
                      <CardTitle tag="h2" className="fw-bolder mb-1 mt-1">
                      <h1 className="fw-bold" style={{paddingTop: '3%',textAlign: 'center', fontWeight: 900, color: '#115fa7'}}>   {t("Congratulations")}! 🎉</h1>  
                      </CardTitle>
                      <CardText className="mb-75" style={{lineHeight: 1.5, fontSize: '16px',textAlign: 'justify'}}>
                     <Label  className="form-label" for="register-email">
 {t("Your account has been successfully activated.")}
                       
                         </Label> 
                      </CardText>

                      <Button size='sm'
                        style={{fontSize: '16px', boxShadow: 'none',width:"200px",marginTop:"10px"}}
                        // block
                        // tag={Link}
                        onClick={async () => {
                          setIsSubmitting(true);
                          // localStorage.setItem('@UserLoginRS', JSON.stringify({token: userData}));
                          const user_id = userData.user_id;
                          const email = userData.email;
                          const data = JSON.stringify({ token: tokenuser, user_id:userData.user_id });
                          const encryptedData = encrypt(data);
                          console.log('Encrypted:', encryptedData);
                          localStorage.setItem(
                            'user_data',encryptedData
                          );
                          const action = await dispatch(
                            getUser({user_id: userData.user_id, token: tokenuser}),
                          );
                          // localStorage.setItem(
                          //   'token',
                          //   JSON.stringify({user_id: user_id,
                          //     token:tokenuser

                          //   }),
                          // );
                          let response_log = await getActivityLogUser({
                            user_id: user_id,
                            event: 'SIGN-IN',
                            description: `${email} signed in `,
                          });
                          if (response_log === true) {
                            //console.log('MAINTAIN LOG SUCCESS');
                          } else {
                            //console.log('MAINTAIN ERROR LOG');
                          }
                          // Activity Log End
                          setTimeout(() => {
                            setIsSubmitting(false);
                            window.location.href = '/home?infoTab=true';
                            // window.location.href = '/complete_profile';

                          }, 1000);

                          // toastAlert("success", "You can Edit document ")
                        }}
                        // to="/login"
                        color="primary"
                        disabled={isSubmitting}>
                        {isSubmitting ? <Spinner color="white" size="sm" /> : null}
                        <span className="align-middle ms-25"  style={{fontSize: '1rem'}}> Take me Home</span>
                      </Button>
                    </Col>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </> : 
        <>
        </>}
          
        </>
      )}
        <ModalReusable
                  isOpen={modalSuccess}
                  successMessageData={[" Verification link resent.",
                    " Activate your account by checking your email."]}
                  errorMessageData="Can't send Verification Link Right Now."
                  success={true}
                  toggleFunc={() => setModalSuccess(!modalSuccess)}
                />
                {/* Error success email modal  */}
                <ModalReusable
                  isOpen={modalError}
                  success={false}
                  successMessageData={[" Verification link resent.",
                    " Activate your account by checking your email."]}
                  errorMessageData="Can't send Verification Link Right Now."
                  toggleFunc={() => setModalError(!modalError)}
                />
    </>
  );
};

export default TwoStepsCover;
