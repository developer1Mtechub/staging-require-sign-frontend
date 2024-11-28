// ** Reactstrap Imports
import {Row, Col, Input, Label, Button, Card, CardHeader, CardTitle, CardBody, FormFeedback, Spinner} from 'reactstrap';
import { parsePhoneNumberFromString } from "libphonenumber-js";

// ** Third Party Components
import Select from 'react-select';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.us';
import {useForm, Controller} from 'react-hook-form';
import PhoneInput from "react-phone-number-input";

import 'react-phone-input-2/lib/bootstrap.css';
import '../../views/StylesheetPhoneNo.css';
import {CountryDropdown} from 'react-country-region-selector';
// ** Utils
import {selectThemeColors} from '@utils/Utils';
import { useTranslation } from 'react-i18next';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import {Formik, Field, Form} from 'formik';
import * as Yup from 'yup';
import {useState} from 'react';
import {post} from '../../apis/api';
import CustomButton from '../ButtonCustom';

const countryOptions = [
  {value: 'uk', label: 'UK'},
  {value: 'usa', label: 'USA'},
  {value: 'france', label: 'France'},
  {value: 'russia', label: 'Russia'},
  {value: 'canada', label: 'Canada'},
];

const defaultValues = {
  companyName: '',
  billingEmail: '',
};

const BillingAddress = ({billingDetails,recallCards}) => {
  // ** Hooks
  const [selectedCountryError, setSelectedCountryError] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [editBillingInfo, setEditBillingInfo] = useState(false);
  const [value, setValue] = useState("");
  const [country, setCountry] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handlePhoneNumberChange = (value) => {
    setValue(value);
    if ((value = "")) {
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
  const [initialValues, setInitialValues] = useState({
    address: '',
    city: '',
    // country: '',
    province: '',
    zip_code: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const { t } = useTranslation();
  const inputStyle = {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "12px",
  };
  const containerStyle = {
    border: "1px solid lightgray",
    borderRadius: "4px",
    height: "43px",
    width: "100%",
    padding: "5px 10px",
    boxShadow: "none",
  };
  const validationSchema = Yup.object().shape({
    address: Yup.string().nullable().required('Address is required'),
    city: Yup.string().nullable().required('City is required'),
    // country: Yup.string().nullable().required('Country is required'),
    province: Yup.string().nullable().required('Province is required'),
    zip_code: Yup.string().nullable().required('Zip code is required'),
    first_name: Yup.string().nullable().required('First Name is required'),
    last_name: Yup.string().nullable().required('Last Name is required'),
    phone: Yup.string().nullable().required('Phone Number is required'),
  });
  return (
    <Card>
      <CardHeader className="border-bottom">
        <CardTitle tag="h4">{t("Billing Details")}</CardTitle>
      </CardHeader>
      <CardBody>
        {billingDetails === null ||billingDetails.length === 0 || editBillingInfo === true ? (
          <>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, {setSubmitting}) => {
                const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
                let emailcust = items?.token?.email;
                // Call your API here
                if (selectedCountry === null || selectedCountry === '') {
                  setSelectedCountryError(true);
                } else {
                  //console.log(values);
                  setSubmitting(true);
                  let details = {
                    address: {
                      line1: values.address,
                      city: values.city,
                      country: selectedCountry,
                      state: values.province,
                      postal_code: values.zip_code,
                    },
                    email: emailcust,
                    name: values.first_name + ' ' + values.last_name,
                    // first_name: values.first_name,
                    // last_name: values.last_name,
                    phone: values.phone,
                  };
                  const postData = {
                    billingInfo: details,
                  };
                  const response = await post('update-customer-billing', postData);
                  // billingInfoSet(details);
                  console.log(response);
                  if (response.error === 'false'||response.error===false) {
                    toastAlert('success', 'Billing Information Updated Successfully');
                    recallCards()
                  }

                  setEditBillingInfo(false);
                }
              }}>
              {({getFieldProps, errors, touched, isSubmitting, values, handleChange}) => (
                <Form className="auth-login-form mt-2">
                  {/* <h2 style={{fontWeight: 600}}>Billing Information</h2> */}

                  <Row>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="first-name">
                        {t("First name")}
                      </Label>
                      <Input
                        style={{marginBottom: '1rem', height: '40px', fontSize: '16px', width: '100%'}}
                        // value={first_name}
                        // onChange={e => setFirst_Name(e.target.value)}
                        className={`form-control ${touched.first_name && errors.first_name ? 'is-invalid' : ''}`}
                        {...getFieldProps('first_name')}
                        type="text"
                        id="first-name"
                        autoFocus
                      />
                      {touched.first_name && errors.first_name ? (
                        <div className="invalid-feedback">{errors.first_name}</div>
                      ) : null}
                    </Col>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="last-name">
                        {t("Last name")}
                      </Label>
                      <Input
                        style={{marginBottom: '1rem', height: '40px', fontSize: '16px', width: '100%'}}
                        // value={last_name}
                        // onChange={e => setLast_Name(e.target.value)}
                        className={`form-control ${touched.last_name && errors.last_name ? 'is-invalid' : ''}`}
                        {...getFieldProps('last_name')}
                        type="text"
                        id="last-name"
                      />
                      {touched.last_name && errors.last_name ? (
                        <div className="invalid-feedback">{errors.last_name}</div>
                      ) : null}
                    </Col>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="phone-number">
                        {t("Phone Number")}
                      </Label>
                      <div
                        style={containerStyle}
                        className="phone-input-container"
                      >
                        <PhoneInput
                          defaultCountry="US"
                          international
                          value={value}
                          onChange={handlePhoneNumberChange}
                          style={inputStyle}
                          className="input-phone-number"
                        />
                      </div>
                      {/* <PhoneInput
                        className={`input-phone-number  ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                        {...getFieldProps('phone')}
                        value={values['phone']}
                        // value={phone}
                        country={'us'}
                        enableSearch={true}
                        onChange={handleChange('phone')}
                        // onChange={e => setPhone_Number(e)}
                        defaultCountry={'us'}
                      /> */}
                      {/* {touched.phone && errors.phone ? <div className="invalid-feedback">{errors.phone}</div> : null} */}
                    </Col>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="address" style={{marginTop: '10px'}}>
                        {t("Street Address")}
                      </Label>
                      <Input
                        style={{marginBottom: '1rem', fontSize: '16px', width: '100%'}}
                        // value={address}
                        // onChange={e => setAddress(e.target.value)}
                        className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`}
                        {...getFieldProps('address')}
                        type="text"
                        id="address"
                      />
                      {touched.address && errors.address ? (
                        <div className="invalid-feedback">{errors.address}</div>
                      ) : null}
                    </Col>

                    <Col xs={12} md={6}>
                      <Label className="form-label" for="city">
                        {t("City")}
                      </Label>
                      <Input
                        style={{marginBottom: '1rem', height: '40px', fontSize: '16px', width: '100%'}}
                        // value={city}
                        // onChange={e => setCity(e.target.value)}
                        className={`form-control ${touched.city && errors.city ? 'is-invalid' : ''}`}
                        {...getFieldProps('city')}
                        type="text"
                        id="city"
                      />
                      {touched.city && errors.city ? <div className="invalid-feedback">{errors.city}</div> : null}
                    </Col>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="province">
                        {t("Province")} / {t("State")}
                      </Label>
                      <Input
                        style={{marginBottom: '1rem', height: '40px', fontSize: '16px', width: '100%'}}
                        // value={province}
                        // onChange={e => setProvince(e.target.value)}
                        className={`form-control ${touched.province && errors.province ? 'is-invalid' : ''}`}
                        {...getFieldProps('province')}
                        type="text"
                        id="province"
                      />
                      {touched.province && errors.province ? (
                        <div className="invalid-feedback">{errors.province}</div>
                      ) : null}
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="zip-code">
                        {t("Postal Code")}
                      </Label>
                      <Input
                        style={{marginBottom: '1rem', height: '40px', fontSize: '16px', width: '100%'}}
                        // value={zip_code}
                        // onChange={e => setZip_Code(e.target.value)}
                        className={`form-control ${touched.zip_code && errors.zip_code ? 'is-invalid' : ''}`}
                        {...getFieldProps('zip_code')}
                        type="text"
                        id="zip-code"
                      />
                      {touched.zip_code && errors.zip_code ? (
                        <div className="invalid-feedback">{errors.zip_code}</div>
                      ) : null}
                    </Col>
                    <Col xs={12} md={6}>
                      {' '}
                      <Label className="form-label" for="login-email">
                        {t("Country")} / {t("Region")}
                      </Label>
                      <CountryDropdown
                        style={{
                          border: selectedCountryError ? '1px solid red' : '1px solid lightGrey', // change border color
                          fontSize: '16px',
                          width: '100%',
                          height: '40px', // change height
                          borderRadius: '5px',
                          marginBottom: '10px',
                          // add other styles as needed
                        }}
                        value={selectedCountry}
                        onChange={val => {
                          setSelectedCountryError(false);
                          setSelectedCountry(val);
                        }}
                      />
                      {selectedCountryError ? (
                        <div style={{color: 'red', fontSize: '14px'}}>Country is Required</div>
                      ) : null}
                    </Col>
                    <Col xs={12} md={12} style={{display: 'flex', justifyContent: 'center'}}>
                     <CustomButton
                     style={{marginBlock:"20px",height:"40px"}}
                     size="sm"
                        text={<> 
                        {isSubmitting ? <Spinner color="light" size="sm" /> : null}
                        <span className="align-middle ms-25"> {t("Save")}</span></>}
disabled={isSubmitting} 
 type="submit" 
/>
                      {/* // <Button disabled={isSubmitting} size="sm" type="submit" style={{height: '40px'}} color="primary">
                      //   {' '}
                      //   {isSubmitting ? <Spinner color="light" size="sm" /> : null}
                      //   <span className="align-middle ms-25"> {t("Save")}</span>
                      // </Button> */}
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <>
        
              <div style={{display: 'flex', justifyContent: 'space-between', marginBlock: '10px'}}>
               <h1></h1> 
               <Button
                  onClick={() => {
                    //console.log('EDIT');
                    setInitialValues({
                      address: billingDetails?.address?.line1,
                      city: billingDetails?.address.city,
                      // country: billingDetails?.address.country,
                      province: billingDetails?.address.state,
                      zip_code: billingDetails?.address.postal_code,
                      first_name: billingDetails?.name.split(' ')[0],
                      last_name: billingDetails?.name.split(' ')[1],
                      phone: billingDetails?.phone,
                    });
                    setSelectedCountry(billingDetails?.address?.country);
                    // setFirst_Name(billingDetails?.name.split(' ')[0])
                    // setLast_Name(billingDetails?.name.split(' ')[1])
                    // setPhone_Number(billingDetails?.phone)
                    // setAddress(billingDetails?.address?.line1)
                    // setCity(billingDetails?.address.city)
                    // setProvince(billingDetails?.address.state)
                    // setZip_Code(billingDetails?.address.postal_code)
                    // setSelectedCountry(billingDetails?.address.country)
                    setEditBillingInfo(true);
                    // let details = {
                    //   address:{
                    //    line1: billingDetails?.address?.line1,
                    //    city:billingDetails?F.address.city,
                    //    country: selectedCountry,
                    //    state: billingDetails?.address.state,
                    //    postal_code: billingDetails?.address.postal_code,
                    //   } ,

                    //   name: billingDetails?.name,
                    //    // first_name: billingDetails.first_name,
                    //    // last_name: billingDetails.last_name,
                    //    phone: billingDetails.phone,
                    //  };
                    // billingInfoSet(details)
                  }}
                  outline
                  size="sm"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}>
                  {t("Edit")}
                </Button>
              </div>
              <h2 style={{fontWeight: 600, marginBlock: '10px'}}>{billingDetails?.name}</h2>
              <h3 style={{fontWeight: 500, marginBlock: '10px'}}>{billingDetails?.phone}</h3>
              <h3 style={{fontWeight: 500, marginBlock: '10px'}}>{billingDetails?.address?.line1}</h3>
              <h3 style={{fontWeight: 500, marginBlock: '10px'}}>
                {billingDetails?.address.city} {billingDetails?.address?.state} {billingDetails?.address?.postal_code}
              </h3>
              <h3 style={{fontWeight: 500, marginBlock: '10px'}}>{billingDetails?.address?.country}</h3>
      
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default BillingAddress;
