import {ArrowUp, X} from 'react-feather';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import '../views/StylesheetPhoneNo.css';
import {Form, Formik} from 'formik';
import {BASE_URL, post, postFormData} from '../apis/api';
import toastAlert from '@components/toastAlert';
import * as Yup from 'yup';
// ** Steps
import {Button, Col, Input, Label, Modal, ModalBody, Row, Spinner} from 'reactstrap';
import {useEffect, useState} from 'react';
import CustomButton from './ButtonCustom';
// ** Custom Components

const CompanyProfileForm = ({
  isOpen,
  toggleFunc,
  profileGet,
  companyId,
  companyData,
  getCompanyData,
  initialValues1,
}) => {
  const validationSchema = Yup.object().shape({
    // name: Yup.string().nullable().required('Name is required'),
    company_admin_email: Yup.string().nullable().email('Invalid email').required('Email is required'),
    company_email: Yup.string().nullable().email('Invalid email').required('Company Email is required'),
  });
  const [color, setColor] = useState('#23b3e8 ');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');

  const handleColorChange = event => {
    setColor(event.target.value);
  };

  const handleHexChange = event => {
    const hex = event.target.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setColor(hex);
    }
  };
  const handleSecondaryColorChange = event => {
    setSecondaryColor(event.target.value);
  };

  const handleSecondaryHexChange = event => {
    const hex = event.target.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setSecondaryColor(hex);
    }
  };
  // Image Picker
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [branding, setBranding] = useState(false);

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };
  const handleBrandingChange = () => {
    setBranding(!branding);
  };
  const [initialValues, setInitialValues] = useState(initialValues1===null||initialValues1===undefined?null:initialValues1);
  const getCompanyData1 = async () => {
    const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
    const postData1 = {
      company_id: items?.token?.company_id,
    };
    const apiData1 = await post('company/get_company', postData1);
    console.log(apiData1)
    let dataCompany = apiData1.data;
    console.log(dataCompany)
    setInitialValues({
      name: dataCompany.company_name,
      company_email: dataCompany.company_email,
      company_admin_email: dataCompany.company_admin_email,
      website_link: dataCompany.website_link,
      phone_no: dataCompany.contact_no,
      address: dataCompany.address,
      subdomain_name: dataCompany.subdomain_name,
      primary_color: dataCompany.primary_color,
      secondary_color: dataCompany.secondary_color,

    });
  };
  useEffect(() => {
    console.log(initialValues1);
    getCompanyData1();
  }, []);
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, {setSubmitting}) => {
          // Call your API here
          //console.log(values);
          //console.log(companyId);
          setSubmitting(true);
          if (image === null) {
            //console.log('apiData.path');
            const postData2 = {
              company_name: values.name,
              company_id: companyId,
              company_email: values.company_email,
              website_link: values.website_link,
              contact_no: values.phone_no,
              address: values.address,
              company_admin_email: values.company_admin_email,
              branding: branding,
              // status: 'inactive',
              subdomain_name: values.subdomain_name,
              primary_color: color,
              secondary_color: secondaryColor,
            };
            const apiData2 = await post('company/update_company', postData2); // Specify the endpoint you want to call
            //console.log('apixxsData');

            //console.log(apiData2);
            if (apiData2.error) {
              toastAlert('error', 'Something went wrong');
              //console.log('error', apiData2.errorMessage);
              setSubmitting(false);
            } else {
              toastAlert('success', 'Company Profile Updated Successfully');
              toggleFunc();
              setSubmitting(false);
              // setTimeout(() => {
              //   setSubmitting(false);
              //   window.location.href = '/company';
              // }, 1000);
              // setShow(true)
            }
            // if pushed
          } else {
            const postData = {
              image: imageFile,
            };
            try {
              const apiData = await postFormData(postData); // Specify the endpoint you want to call
              //console.log(apiData);
              if (apiData.path === null || apiData.path === undefined || apiData.path === '') {
                //console.log('Error uploading Files');
                toastAlert('error', 'Error uploading File');
              } else {
                //console.log('apiData.path');

                //console.log(apiData.path);
                let file_url = apiData.path;
                const postData2 = {
                  company_name: values.name,
                  company_id: companyId,
                  company_email: values.company_email,
                  website_link: values.website_link,
                  contact_no: values.phone_no,
                  address: values.address,
                  company_admin_email: values.company_admin_email,
                  branding: branding,
                  // status: 'inactive',
                  subdomain_name: values.subdomain_name,
                  primary_color: color,
                  secondary_color: secondaryColor,
                  company_logo: file_url,
                };
                const apiData2 = await post('company/update_company', postData2); // Specify the endpoint you want to call
                //console.log('apixxsData');

                //console.log(apiData2);
                if (apiData2.error) {
                  toastAlert('error', 'Something went wrong');
                  //console.log('error', apiData2.errorMessage);
                  setSubmitting(false);
                } else {
                  toggleFunc();
                  toastAlert('success', 'Company Profile Updated Successfully');
                  // setTimeout(() => {
                  setSubmitting(false);
                  //   setSubmitting(false);
                  //   window.location.href = '/company';
                  // }, 1000);
                  // setShow(true)
                }
                // if pushed
              }
            } catch (error) {
              setSubmitting(false);
              toastAlert('error', 'Something went wrong');

              console.error('Error uploading file:', error);
            }
          }
        }}>
        {({getFieldProps, errors, touched, isSubmitting, setFieldValue}) => (
          <>
            <Form className="auth-login-form mt-2">
              <Row>
                <Col md="1"></Col>

                <Col md="10">
                  <h3 style={{marginBlock:"10px"}}>Company Logo (Resolution 300x100px, Format PNG)</h3>
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    {image === null ? (
                      <>
                        <div className="image-picker">
                          <input
                            type="file"
                            // accept="image/*"
                            // ACCEPT IMAGE FORMAT PNG
                            accept="image/png"
                            id="fileInput"
                            onChange={handleImageChange}
                          />
                          <label htmlFor="fileInput">
                            <div className="box_picker d-flex align-items-center justify-content-center flex-column">
                              <span
                                style={{
                                  padding: '2%',
                                  borderRadius: '100px',
                                  border: '2px solid lightGrey',
                                }}>
                                <ArrowUp size={40} color="#23b3e8" />
                              </span>
                              <h2
                                style={{
                                  fontSize: '16px',
                                  textAlign: 'center',
                                  marginTop: '5%',
                                  color: 'grey',
                                }}>
                                Click or drop file to upload
                              </h2>
                            </div>
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <div
                            className="image_box2"
                            style={{position: 'relative'}}
                            //  onClick={handleReplaceImage}
                          >
                            <img
                              src={image}
                              alt="Selected"
                              height="100%"
                              // onClick={() => document.getElementById('fileInput').click()}
                            />
                            <X
                              size={20}
                              style={{position: 'absolute', top: '0', right: '0', cursor: 'pointer'}}
                              onClick={() => {
                                setImageFile(null);
                                setImage(null);
                              }}
                            />
                          </div>

                          {/* <h4 style={{textAlign: 'center', marginTop: '10px'}}>Click to Replace Image</h4> */}
                        </div>{' '}
                      </>
                    )}

                    {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
                    {/* {image && } */}
                  </div>
                  <h3 for="name">
                    Name
                  </h3>
                  <Input
                    style={{marginBottom: '10px', fontSize: '16px', boxShadow: 'none'}}
                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                    {...getFieldProps('name')}
                    id="name"
                    placeholder="Enter Company Name"
                  />
                  {touched.name && errors.name ? <div className="invalid-feedback">{errors.name}</div> : null}
                  <h3 for="company_email">
                    Email<span style={{color: 'red'}}> *</span>
                  </h3>
                  <Input
                    style={{marginBottom: '10px', fontSize: '16px', boxShadow: 'none'}}
                    className={`form-control ${touched.company_email && errors.company_email ? 'is-invalid' : ''}`}
                    {...getFieldProps('company_email')}
                    id="company_email"
                    placeholder="Enter Company Email"
                  />
                  {touched.company_email && errors.company_email ? (
                    <div className="invalid-feedback">{errors.company_email}</div>
                  ) : null}
                  <h3 for="company_admin_email" style={{marginTop: '10px'}}>
                    Company Admin Email<span style={{color: 'red'}}> *</span>
                  </h3>
                  <Input
                    disabled
                    // onChange={handleCompanyEmailChange}
                    style={{marginBottom: '10px', fontSize: '16px', boxShadow: 'none'}}
                    className={`form-control ${
                      touched.company_admin_email && errors.company_admin_email ? 'is-invalid' : ''
                    }`}
                    {...getFieldProps('company_admin_email')}
                    id="company_admin_email"
                    placeholder="Enter Company Admin Email"
                  />
                  {touched.company_admin_email && errors.company_admin_email ? (
                    <div className="invalid-feedback">{errors.company_admin_email}</div>
                  ) : null}
                  <h3 for="website" style={{marginTop: '10px'}}>
                    Website Link
                  </h3>
                  <Input
                    // onChange={handleCompanyEmailChange}
                    style={{marginBottom: '10px', fontSize: '16px', boxShadow: 'none'}}
                    className={`form-control ${touched.website_link && errors.website_link ? 'is-invalid' : ''}`}
                    {...getFieldProps('website_link')}
                    id="website_link"
                    placeholder="Enter Website Link"
                  />
                  {touched.website_link && errors.website_link ? (
                    <div className="invalid-feedback">{errors.website_link}</div>
                  ) : null}
                  <h3 for="address">Address</h3>
                  <Input
                    style={{marginBottom: '10px', fontSize: '16px', boxShadow: 'none'}}
                    className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`}
                    {...getFieldProps('address')}
                    id="address"
                    type="textarea"
                    rows="3"
                    placeholder="Enter Address"
                  />
                  {touched.address && errors.address ? <div className="invalid-feedback">{errors.address}</div> : null}
                  <h3 for="phone_no">Phone Number</h3>
                  <Input
                    type="number"
                    style={{marginBottom: '10px', fontSize: '16px', boxShadow: 'none'}}
                    className={`form-control ${touched.phone_no && errors.phone_no ? 'is-invalid' : ''}`}
                    {...getFieldProps('phone_no')}
                    id="phone_no"
                    placeholder="Enter Phone Number"
                  />
                  {touched.phone_no && errors.phone_no ? (
                    <div className="invalid-feedback">{errors.phone_no}</div>
                  ) : null}
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h2 className="fw-bold">Subdomain</h2>
                    <div className="form-check form-switch">
                      <Input
                        type="switch"
                        value={branding}
                        onChange={handleBrandingChange}
                        name="customSwitch"
                        id="exampleCustomSwitch"
                      />
                    </div>
                  </div>
                  {branding ? (
                    <>
                      {' '}
                      <h3 for="subdomain_name">Name</h3>
                      <Input
                        style={{marginBottom: '10px', fontSize: '16px', boxShadow: 'none'}}
                        className={`form-control ${
                          touched.subdomain_name && errors.subdomain_name ? 'is-invalid' : ''
                        }`}
                        {...getFieldProps('subdomain_name')}
                        id="subdomain_name"
                        placeholder="Enter Subdomain Name"
                      />
                      {touched.subdomain_name && errors.subdomain_name ? (
                        <div className="invalid-feedback">{errors.subdomain_name}</div>
                      ) : null}
                      <Row>
                        <Col xs={6}>
                          <h3 for="subdomain_primary_color">Primary Color</h3>
                          <div style={{display: 'flex'}}>
                            <input
                              type="color"
                              style={{
                                marginBottom: '10px',
                                fontSize: '16px',
                                boxShadow: 'none',
                                width: '70px',
                                height: '50px',
                              }}
                              className={`form-control `}
                              value={color}
                              onChange={handleColorChange}
                              placeholder="Enter Subdomain Primary Color"
                            />
                            <input
                              type="text"
                              style={{
                                marginBottom: '10px',
                                fontSize: '16px',
                                boxShadow: 'none',
                              }}
                              className={`form-control `}
                              value={color}
                              onChange={handleHexChange}
                              placeholder="Enter Subdomain Primary Color"
                            />
                          </div>

                          {/* <Input
                            type="color"
                            style={{
                              marginBottom: '10px',
                              fontSize: '16px',
                              boxShadow: 'none',
                              width: '50px',
                              height: '50px',
                            }}
                            className={`form-control ${
                              touched.subdomain_primary_color && errors.subdomain_primary_color ? 'is-invalid' : ''
                            }`}
                            {...getFieldProps('subdomain_primary_color')}
                            id="subdomain_primary_color"
                            placeholder="Enter Subdomain Primary Color"
                          /> */}
                        </Col>
                        <Col xs={6}>
                          <h3 for="subdomain_secondary_color">Secondary Color</h3>
                          <div style={{display: 'flex'}}>
                            <input
                              type="color"
                              style={{
                                marginBottom: '10px',
                                fontSize: '16px',
                                boxShadow: 'none',
                                width: '70px',
                                height: '50px',
                              }}
                              className={`form-control ${
                                touched.subdomain_secondary_color && errors.subdomain_secondary_color
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              value={secondaryColor}
                              onChange={handleSecondaryColorChange}
                              placeholder="Enter Subdomain Secondary Color"
                            />
                            <input
                              type="text"
                              style={{
                                marginBottom: '10px',
                                fontSize: '16px',
                                boxShadow: 'none',
                              }}
                              className={`form-control ${
                                touched.subdomain_secondary_color && errors.subdomain_secondary_color
                                  ? 'is-invalid'
                                  : ''
                              }`}
                              value={secondaryColor}
                              onChange={handleSecondaryHexChange}
                              placeholder="Enter Subdomain Secondary Color"
                            />{' '}
                          </div>
                          {touched.subdomain_secondary_color && errors.subdomain_secondary_color ? (
                            <div className="invalid-feedback">{errors.subdomain_secondary_color}</div>
                          ) : null}
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <></>
                  )}
                </Col>
                <Col md="6"></Col>
              </Row>

              <div className="d-flex justify-content-center">
                  <CustomButton
                                        padding={true}
                  size="sm"
                  type="submit"
                  color="primary"
                  block
                  disabled={isSubmitting}
                  style={{maxWidth: '20%', marginBlock: '2%', boxShadow: 'none'}}
                  text={<>
                  {isSubmitting ? <Spinner color="white" size="sm" /> : null}
                  <span style={{fontSize: '16px'}} className="align-middle ms-25">
                    {' '}
                    Save
                  </span>
                  </>}
                  />
                  
                
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default CompanyProfileForm;
