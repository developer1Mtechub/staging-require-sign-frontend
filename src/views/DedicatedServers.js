// ** React Imports
import {useSkin} from '@hooks/useSkin';
import {Link} from 'react-router-dom';
import {Formik, Form} from 'formik';
import * as Yup from 'yup';
// ** Icons Imports
import {ArrowLeft} from 'react-feather';

// ** Custom Components

// ** Reactstrap Imports
import {Row, Col, CardTitle, Label, Input, Button, Spinner} from 'reactstrap';

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/login-v2.svg';
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg';
import logoRemoveBg from '@src/assets/images/pages/logoRemoveBg.png';

// ** Styles
import '@styles/react/pages/page-authentication.scss';
import {post} from '../apis/api';
import toastAlert from '@components/toastAlert';

const DedicatedServers = () => {
  const {skin} = useSkin();

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight;
  const validationSchema = Yup.object().shape({
    company_email: Yup.string().nullable().email('Invalid email').required('company_email is required'),
    company_name: Yup.string().nullable().required('Company Name is required'),
    contact_no: Yup.string().nullable().required('Contact No is required'),
    description: Yup.string().nullable().required('Description is required'),
    max_user_limit: Yup.string().nullable().required('Maximum User Limit is required'),
  });

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={e => e.preventDefault()}>
          <img src={logoRemoveBg} alt="Login Cover" style={{width: '200px', height: 'auto'}} />
          {/* <h2 className='brand-text text-primary ms-1'>Vuexy</h2> */}
        </Link>

        <Col className="d-none d-lg-flex align-items-center p-5" lg="6" md="6" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="6" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="8" lg="8">
            {/* Need a back button to navigate to some page  */}
            <div className="d-flex justify-content-between align-items-center">
              <Button.Ripple tag={Link} to="/stripe_plan" color="primary" className="btn-icon rounded-circle">
                <ArrowLeft size={24} />
              </Button.Ripple>
              <div className="text-center ">
                <CardTitle tag="h2" className="fw-bold mb-1 mt-1">
                  Dedicated Server Request
                </CardTitle>
              </div>
            </div>

            {/* <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText> */}
            <Formik
              initialValues={{
                company_email: '',
                company_name: '',
                contact_no: '',
                description: '',
                max_user_limit: '',
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, {setSubmitting, resetForm}) => {
                // Call your API here
                //console.log(values);
                setSubmitting(true);
                const postData = {
                  company_email: values.company_email,
                  company_name: values.company_name,
                  contact_no: values.contact_no,
                  description: values.description,
                  max_user_limit: values.max_user_limit,
                };
                const apiData = await post('dedicated_server/createReq', postData); // Specify the endpoint you want to call
                //console.log("apixxsData")

                //console.log(apiData)
                if (apiData.error) {
                  setSubmitting(false);

                  toastAlert('error', apiData.message);
                } else {
                  setSubmitting(false);
                  // If "Remember Me" is checked, store the user's email in localStorage
                  toastAlert('success', 'Your Request has been submitted .You will be contacted soon.');
                  // Reset the form
                  resetForm();

                  // toastAlert("success", "You can Edit document ")
                }
              }}>
              {({getFieldProps, errors, touched, isSubmitting}) => (
                <Form className="auth-login-form mt-2">
                  <div className="mb-1">
                    <Label className="form-label" for="login-email">
                      Company Email
                    </Label>
                    <Input
                      className={`form-control ${touched.company_email && errors.company_email ? 'is-invalid' : ''}`}
                      {...getFieldProps('company_email')}
                      type="email"
                      id="login-email"
                      placeholder="john@example.com"
                      autoFocus
                    />
                    {touched.company_email && errors.company_email ? (
                      <div className="invalid-feedback">{errors.company_email}</div>
                    ) : null}
                  </div>
                  <div className="mb-1">
                    <Label className="form-label" for="login-email">
                      Company Name
                    </Label>
                    <Input
                      className={`form-control ${touched.company_name && errors.company_name ? 'is-invalid' : ''}`}
                      {...getFieldProps('company_name')}
                      type="text"
                      id="login-email"
                      placeholder=""
                      autoFocus
                    />
                    {touched.company_name && errors.company_name ? (
                      <div className="invalid-feedback">{errors.company_name}</div>
                    ) : null}
                  </div>
                  <div className="mb-1">
                    <Label className="form-label" for="login-email">
                      Contact Number
                    </Label>
                    <Input
                      className={`form-control ${touched.contact_no && errors.contact_no ? 'is-invalid' : ''}`}
                      {...getFieldProps('contact_no')}
                      type="text"
                      id="login-email"
                      placeholder="00000000000"
                      autoFocus
                    />
                    {touched.contact_no && errors.contact_no ? (
                      <div className="invalid-feedback">{errors.contact_no}</div>
                    ) : null}
                  </div>

                  <div className="mb-1">
                    <Label className="form-label" for="login-email">
                      Description
                    </Label>

                    <Input
                      className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                      {...getFieldProps('description')}
                      type="textarea"
                      id="login-email"
                      placeholder=""
                      autoFocus
                    />
                    {touched.description && errors.description ? (
                      <div className="invalid-feedback">{errors.description}</div>
                    ) : null}
                  </div>
                  <div className="mb-1">
                    <Label className="form-label" for="login-email">
                      Maximum User Limit
                    </Label>
                    <Input
                      className={`form-control ${touched.max_user_limit && errors.max_user_limit ? 'is-invalid' : ''}`}
                      {...getFieldProps('max_user_limit')}
                      type="number"
                      id="login-email"
                      placeholder=""
                      autoFocus
                    />
                    {touched.max_user_limit && errors.max_user_limit ? (
                      <div className="invalid-feedback">{errors.max_user_limit}</div>
                    ) : null}
                  </div>

                  <Button type="submit" color="primary" block disabled={isSubmitting}>
                    {isSubmitting ? <Spinner color="white" size="sm" /> : null}
                    <span className="align-middle ms-25"> Submit</span>
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default DedicatedServers;
