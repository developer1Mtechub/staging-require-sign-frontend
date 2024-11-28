import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Row,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../views/StylesheetPhoneNo.css";
import { CountryDropdown } from "react-country-region-selector";
import { get, post } from "../apis/api";
import "@styles/react/pages/page-authentication.scss";
import toastAlert from "@components/toastAlert";
import visa1Image from "../assets/images/pages/req.png";
import cvcImage from "../assets/images/pages/cvc.png";
import visaImage from "../assets/images/pages/4.png";
import masterCard from "../assets/images/pages/1.png";
import americanExpress from "../assets/images/pages/3.png";
import discover from "../assets/images/pages/5.png";
import other from "../assets/images/pages/2.png";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
  Trash2,
} from "react-feather";

import ModalConfirmationAlert from "./ModalConfirmationAlert";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/navbar";
import { useSelector } from "react-redux";
const containerStyle = {
  border: "1px solid lightgray",
  borderRadius: "4px",
  height: "43px",
  width: "100%",
  padding: "5px 10px",
  boxShadow: "none",
};

const customStyle = {
  width: "60px",
  height: "auto",
  border: "1px solid lightGrey",
  borderRadius: "3px",
  padding: "2px",
};
const inputStyle = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: "12px",
};
const CARD_OPTIONS_No = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "black",
      fontWeight: 400,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "lightGrey" },
      "::placeholder": { color: "lightGrey" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "black",
    },
  },
};
const CARD_OPTIONS = {
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "black",
      fontWeight: 400,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "lightGrey" },
      "::placeholder": { color: "lightGrey" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "black",
    },
  },
};

function PaymentForm({
  priceId,
  selectedPriceId,
  // previousStep,
  teamMembers,
  SuccessData,
  cards,
  recallCards,
  billingInfo,
  CustomerStripeId,
  billingInfoSet,
  coupon,
  coupon_applied,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.navbar);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [DetachId, setDetachId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation();

  const [phone_number, setPhone_Number] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const validationSchema = Yup.object().shape({
    address: Yup.string().nullable().required("Address is required"),
    city: Yup.string().nullable().required("City is required"),
    // country: Yup.string().nullable().required('Country is required'),
    province: Yup.string().nullable().required("Province is required"),
    zip_code: Yup.string().nullable().required("Zip code is required"),
    first_name: Yup.string().nullable().required("First Name is required"),
    last_name: Yup.string().nullable().required("Last Name is required"),
    // phone: Yup.string().nullable().required("Phone Number is required"),
  });
  const [zip_code, setZip_Code] = useState("");
  const [email, setEmail] = useState(() => {
    const selectedPrice = localStorage.getItem("@selectedprice");
    const parsedPrice = JSON.parse(selectedPrice);
    return parsedPrice ? parsedPrice.email : "";
  });
  const [loadingStripe, setloadingStripe] = useState(false);
  const DeleteFolder = async () => {
    setLoadingDelete(true);
    const postData = {
      paymentMethodId: DetachId,
    };
    const response = await post("detach-payment-method", postData);

    //console.log(response);
    if (response.error === true) {
      setLoadingDelete(false);
      toastAlert("error", "An error occured while deleting card");
    } else {
      setItemDeleteConfirmation(false);
      setLoadingDelete(false);
      recallCards();
      toastAlert("success", "Card deleted successfully");
    }
  };
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async () => {
    // e.preventDefault();
    // if (

    // ) {
    //   toastAlert('error', 'Please fill all the fields');
    // } else {
    setloadingStripe(true);

    if (PaymentmMethodIdPrev === null) {
      let items = JSON.parse(localStorage.getItem("@selectedprice"));
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        // card: elements.getElement(
        //   CardCvcElement,
        //   CardExpiryElement,
        //   CardNumberElement
        // ),
      });

      if (error) {
        //console.log('error.message');
        setloadingStripe(false);

        toastAlert("error", error.message);
      } else {
        try {
          const id = paymentMethod.id;
          console.log("paymentMethod.id");

          console.log(paymentMethod.id);
          console.log("coupon", coupon);
          let postData;
          console.log(coupon_applied);
          console.log(coupon);

          if (coupon_applied === true) {
            postData = {
              paymentMethodId: id,
              customeremail: email,
              price: priceId,
              price_id: selectedPriceId,
              duration: items.duration,
              teamMembers: teamMembers,
              billingInfo,
              coupon,
            };
          } else {
            postData = {
              paymentMethodId: id,
              customeremail: email,
              price: priceId,
              price_id: selectedPriceId,
              duration: items.duration,
              teamMembers: teamMembers,
              billingInfo,
            };
          }
          console.log(postData);
          const response = await post("create-payment-intent", postData);
          console.log("response");

          console.log(response);
          setloadingStripe(false);

          if (response.error) {
            toastAlert("error", response.message);
            setloadingStripe(false);
          } else {
            setloadingStripe(false);
            // get user local storage
            //console.log(response)
            //console.log("response")

            // localStorage.setItem(
            //   "@UserLoginRS",
            //   JSON.stringify({ token: response.userData })
            // );
            SuccessData(true);
          }
        } catch (error) {
          console.log("Error", error);
          setloadingStripe(false);
        }
      }
    } else {
      let items = JSON.parse(localStorage.getItem("@selectedprice"));
      // const {error, paymentMethod} = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement),
      // });

      // if (error) {
      //   //console.log('error.message');
      //   setloadingStripe(false);

      //   toastAlert('error', error.message);
      // } else {
      try {
        const id = PaymentmMethodIdPrev;
        //console.log(PaymentmMethodIdPrev);
        console.log("coupon", coupon);
        let postData;
        console.log(coupon_applied);
        console.log(coupon);

        if (coupon_applied === true) {
          postData = {
            paymentMethodId: id,
            customeremail: email,
            price: priceId,
            price_id: selectedPriceId,
            duration: items.duration,
            teamMembers: teamMembers,
            billingInfo,

            prevCard: true,
            coupon,
          };
        } else {
          postData = {
            paymentMethodId: id,
            customeremail: email,
            price: priceId,
            price_id: selectedPriceId,
            duration: items.duration,
            teamMembers: teamMembers,
            billingInfo,

            prevCard: true,
          };
        }
        const response = await post("create-payment-intent", postData);

        console.log(response);
        if (response.error) {
          toastAlert("error", response.message);
          setloadingStripe(false);
        } else {
          setloadingStripe(false);
          localStorage.setItem(
            "@UserLoginRS",
            JSON.stringify({ token: response.userData })
          );
          SuccessData(true);
        }
      } catch (error) {
        console.log("Error", error);
        setloadingStripe(false);
      }
      // }
    }
    // }
  };
  const [selectedCountryError, setSelectedCountryError] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [CardDigits, setCardDigits] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
 
  const [cardError, setCardError] = useState(null);
  const [editBillingInfo, setEditBillingInfo] = useState(
    billingInfo === null ? true : false
  );
  const [cardsAdd, setCardsAdd] = useState(cards === null ? true : false);
  const [PaymentmMethodIdPrev, setPaymentmMethodIdPrev] = useState(null);
  const [initialValues, setInitialValues] = useState({
    address: "",
    city: "",
    // country: '',
    province: "",
    zip_code: "",
    first_name: user?.first_name,
    last_name:user?.last_name,
    // phone: storedObject?.token?.contact_no || "",
  });
  const [value, setValue] = useState(user?.contact_no);
  const [countryFilter, setCountryFilter] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [cardNumberError, setCardNumberError] = useState(null);
  const [cardExpiryError, setCardExpiryError] = useState(null);
  const [cardCvcError, setCardCvcError] = useState(null);

 

  const handlePhoneNumberChange = (value) => {
    setValue(value);
    console.log("sfdjhsfhsdf")
    if ((value = "")) {
    } else {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber) {
        setCountry(phoneNumber.country);
        console.log("phoneNumber.country",phoneNumber.country);
        // setIsValid(isPossiblePhoneNumber(value));  // Validate the phone number
      } else {
        console.log("phoneNumber.country",phoneNumber.country);

        setIsValid(false);
      }
    }
  };
  return (
    <div style={{ width: "100%" }}>
      {/* Your code here */}
      {!success ? (
        <div>
          {/* {cardsAdd ? ( */}

          {/* // ) : null} */}
          {/* // <form onSubmit={handleSubmit} style={{display: 'flex', justifyContent: 'left', flexDirection: 'column'}}> */}

          {/* {billingInfo === null || editBillingInfo === true ? (
            <> */}

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              // Call your API here
              if (selectedCountry === null || selectedCountry === "") {
                setSelectedCountryError(true);
              } else {
                setCardNumberError(null);
                setCardExpiryError(null);
                setCardCvcError(null);

                setloadingStripe(true);

                // if (PaymentmMethodIdPrev === null) {
                let items = JSON.parse(localStorage.getItem("@selectedprice"));
                const cardNumberElement =
                  elements.getElement(CardNumberElement);
                const cardExpiryElement =
                  elements.getElement(CardExpiryElement);
                const cardCvcElement = elements.getElement(CardCvcElement);
                const { error, paymentMethod } =
                  await stripe.createPaymentMethod({
                    type: "card",
                    card: cardNumberElement,
                    // card: elements.getElement(
                    //   CardCvcElement,
                    //   CardExpiryElement,
                    //   CardNumberElement
                    // ),
                  });

                if (error) {
                  console.log(error);
                  if (error.code === "incomplete_number") {
                    setCardNumberError(error.message);
                  } else if (
                    error.code === "incomplete_expiry" ||
                    error.param === "exp_year"
                  ) {
                    setCardExpiryError(error.message);
                  } else if (error.code === "incomplete_cvc") {
                    setCardCvcError(error.message);
                  }
                  console.error("Payment Error:", error.message);
                  // setCardError(error.message); // Display the error

                  //console.log('error.message');
                  setloadingStripe(false);

                  toastAlert("error", error.message);
                } else {
                  setCardError(null);
                  try {
                    let details = {
                      address: {
                        line1: values.address,
                        city: values.city,
                        country: selectedCountry,
                        state: values.province,
                        postal_code: values.zip_code,
                      },

                      // name: values.first_name + " " + values.last_name,
                      first_name: values.first_name,
                      last_name: values.last_name,
                      phone: value,
                    };
                    const id = paymentMethod.id;
                    console.log("paymentMethod.id");
                    console.log("coupon", coupon);
                    console.log(paymentMethod.id);
                    let postData;
                    console.log(coupon_applied);
                    console.log(coupon);

                    if (coupon_applied === true) {
                      postData = {
                        paymentMethodId: id,
                        customeremail: email,
                        price: priceId,
                        price_id: selectedPriceId,
                        duration: items.duration,
                        teamMembers: teamMembers,
                        billingInfo: details,
                        coupon: coupon,
                      };
                    } else {
                      postData = {
                        paymentMethodId: id,
                        customeremail: email,
                        price: priceId,
                        price_id: selectedPriceId,
                        duration: items.duration,
                        teamMembers: teamMembers,
                        billingInfo: details,
                      };
                    }

                    console.log(postData);
                    const response = await post(
                      "create-payment-intent",
                      postData
                    );
                    console.log("response");

                    console.log(response);
                    setloadingStripe(false);

                    if (response.error) {
                      toastAlert("error", response.message);
                      setloadingStripe(false);
                    } else {
                      setloadingStripe(false);
                      dispatch(
                        getUser({
                          user_id: user?.user_id,
                        })
                      );
                      // get user local storage
                      //console.log(response)
                      //console.log("response")

                      // localStorage.setItem(
                      //   "@UserLoginRS",
                      //   JSON.stringify({ token: response.userData })
                      // );
                      SuccessData(true);
                    }
                  } catch (error) {
                    console.log("Error", error);
                    setloadingStripe(false);
                  }
                }
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
              <Form className="auth-login-form">
                <>
                  {cards === null || cards.length === 0 ? null : (
                    <div
                      style={{
                        display: "flex",
                        cursor: "pointer",
                        marginBlock: "10px",
                      }}
                      onClick={() => {
                        setCardsAdd(true);
                        setPaymentmMethodIdPrev(null);
                      }}
                    >
                      <Plus size={20} style={{ cursor: "pointer" }} />
                      <h2 style={{ fontWeight: 600, marginLeft: "10px" }}>
                        Card
                      </h2>
                    </div>
                  )}
                  {/* <h2 style={{ fontWeight: 600, marginBlock: "10px" }}>Add Card</h2> */}
                  {cards === null || (cards.length === 0 && cardsAdd) ? null : (
                    <>
                      {cards.map((card, index) => (
                        <>
                          {" "}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                fontWeight: 500,
                                justifyContent: "left",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                if (selectedCard === index) {
                                  setSelectedCard(null);
                                  setPaymentmMethodIdPrev(null);
                                  setCardDigits(null);
                                } else {
                                  setSelectedCard(index);
                                  setPaymentmMethodIdPrev(card.id);
                                  setCardDigits(card.card.last4);
                                }
                                // setSelectedCard(index);
                                // setPaymentmMethodIdPrev(card.id);
                                // setCardDigits(card.card.last4);
                              }}
                            >
                              <input
                                type="radio"
                                checked={selectedCard === index}
                                style={{
                                  marginRight: "10px",
                                }}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCard(index);
                                  } else {
                                    setSelectedCard(null);
                                  }
                                }}
                              />
                              {card.card.brand === "visa" ? (
                                <img src={visaImage} style={customStyle} />
                              ) : card.card.brand === "mastercard" ? (
                                <img src={masterCard} style={customStyle} />
                              ) : card.card.brand === "amex" ? (
                                <img
                                  src={americanExpress}
                                  style={customStyle}
                                />
                              ) : card.card.brand === "discover" ? (
                                <img src={discover} style={customStyle} />
                              ) : (
                                <img src={other} style={customStyle} />
                              )}
                              <h3
                                style={{
                                  fontWeight: 700,
                                  fontSize: "16px",
                                  marginLeft: "20px",
                                  wordSpacing: "2px",
                                }}
                              >
                                .... {card.card.last4}
                              </h3>
                            </div>
                            <div>
                              {/* <Trash2  onClick={() => {
                                    setItemDeleteConfirmation(true);
                                    setDetachId(card.id);
                                  }} size={16} className="me-75" style={{color: 'red',cursor:"pointer"}} /> */}
                              {/* <UncontrolledDropdown className="dropdown-user nav-item">
                      <DropdownToggle
                        href="/"
                        tag="a"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical size={20} style={{ cursor: "pointer" }} />
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem
                          onClick={() => {
                            setItemDeleteConfirmation(true);
                            setDetachId(card.id);
                          }}
                          className="d-flex w-100"
                        >
                          <Trash2
                            size={14}
                            className="me-75"
                            style={{ color: "red" }}
                          />
                          <h3 className="align-middle">{t("Delete")}</h3>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown> */}
                            </div>
                          </div>
                          <hr />
                        </>
                      ))}
                    </>
                  )}
                  {cardsAdd ? (
                    <Row>
                       <Col xs={12} md={12}>
                    <h5
                            style={{
                              fontSize: "16px",
                              color: "black",
                              fontWeight: 600,
                              marginBlock: "10px",
                            }}
                          >
                            {t("Payment Details")}
                          </h5></Col>
                      <Col xs={12} md={12}>
                        <fieldset className="FormGroup">
                          {/* Card Number */}
                          <Label className="form-label" for="register-password">
                            {t("Card Number")}
                          </Label>

                          {/* <div className="FormRow">
                  <CardNumberElement options={CARD_OPTIONS} />
                </div> */}
                          <div className="FormRow d-flex align-items-center">
                            {/* Card Logos */}

                            {/* Stripe Card Input */}
                            <CardNumberElement options={CARD_OPTIONS_No} />
                            <div className="card-logos mr-2 d-flex">
                              <img
                                src={visa1Image}
                                alt="Visa"
                                width="150px"
                                className="mr-2"
                              />
                            </div>
                          </div>
                          {/* Error Message */}
                          {cardNumberError && (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {cardNumberError}
                            </div>
                          )}
                          {/* {cardError && <div className="error-message text-danger">{cardError}</div>} */}
                        </fieldset>
                      </Col>
                      <Col xs={6} md={6}>
                        <fieldset className="FormGroup">
                          <Label className="form-label" for="register-password">
                            {t("Card Expiry")}
                          </Label>
                          <div className="FormRow">
                            <CardExpiryElement options={CARD_OPTIONS} />
                          </div>
                          {cardExpiryError && (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {cardExpiryError}
                            </div>
                          )}
                        </fieldset>
                      </Col>
                      <Col xs={6} md={6}>
                        <fieldset className="FormGroup">
                          <Label className="form-label" for="register-password">
                            {t("CVC")}
                          </Label>

                          <div className="FormRow position-relative">
                            {/* Stripe CVC Input */}
                            <CardCvcElement options={CARD_OPTIONS} />
                            {/* CVC Icon */}
                            <img
                              src={cvcImage}
                              alt="CVC Icon"
                              className="cvc-icon"
                              width="50"
                            />
                          </div>
                          {cardCvcError && (
                            <div
                              className="error-message"
                              style={{ color: "red" }}
                            >
                              {cardCvcError}
                            </div>
                          )}
                        </fieldset>{" "}
                      </Col>
                    </Row>
                  ) : (
                    false
                  )}
                </>
                {editBillingInfo === true ? (
                  <Row>
                    <Col xs={12} md={12}>
                    <h5
                            style={{
                              fontSize: "16px",
                              color: "black",
                              fontWeight: 600,
                              marginBlock: "10px",
                            }}
                          >
                            {t("Personal Details")}
                          </h5></Col>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="first-name">
                        {t("First Name")}
                      </Label>
                      <Input
                        style={{
                          marginBottom: "1rem",
                          height: "40px",
                          fontSize: "16px",
                          width: "100%",
                        }}
                        // value={first_name}
                        // onChange={e => setFirst_Name(e.target.value)}
                        className={`form-control ${
                          touched.first_name && errors.first_name
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("first_name")}
                        type="text"
                        id="first-name"
                        autoFocus
                      />
                      {touched.first_name && errors.first_name ? (
                        <div className="invalid-feedback">
                          {errors.first_name}
                        </div>
                      ) : null}
                    </Col>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="last-name">
                        {t("Last Name")}
                      </Label>
                      <Input
                        style={{
                          marginBottom: "1rem",
                          height: "40px",
                          fontSize: "16px",
                          width: "100%",
                        }}
                        // value={last_name}
                        // onChange={e => setLast_Name(e.target.value)}
                        className={`form-control ${
                          touched.last_name && errors.last_name
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("last_name")}
                        type="text"
                        id="last-name"
                      />
                      {touched.last_name && errors.last_name ? (
                        <div className="invalid-feedback">
                          {errors.last_name}
                        </div>
                      ) : null}
                    </Col>
                    {/* <Col xs={12} md={6}>
                      <Label className="form-label" for="login-email">
                        {t("Billing email")}
                      </Label>
                      <Input
                        disabled
                        style={{
                          marginBottom: "1rem",
                          height: "40px",
                          fontSize: "16px",
                          width: "100%",
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`form-control`}
                        type="email"
                        id="login-email"
                        placeholder="john@example.com"
                        autoFocus
                      />
                    </Col> */}
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
                          {/* <PhoneInput
        value={value}
        onChange={handlePhoneNumberChange}
        defaultCountry="US"
        international
        countries={filteredCountries}
        countrySelectComponent={({ onChange, value, labels, ...props }) => (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search country..."
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <select
              {...props}
              value={value}
              onChange={(e) => {
                setCountryFilter("");
                onChange(e.target.value);
              }}
            >
              {filteredCountries.map((country) => (
                <option key={country} value={country}>
                  {labels[country]} (+{getCountryCallingCode(country)})
                </option>
              ))}
            </select>
          </div>
        )}
      /> */}
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
                        />
                        {touched.phone && errors.phone ? <div className="invalid-feedback">{errors.phone}</div> : null} */}
                    </Col>
                    <Col xs={12} md={6}>
                      <Label
                        className="form-label"
                        for="address"
                        style={{ marginTop: "10px" }}
                      >
                        {t("Street Address")}
                      </Label>
                      <Input
                        style={{
                          marginBottom: "1rem",
                          fontSize: "16px",
                          width: "100%",
                        }}
                        // value={address}
                        // onChange={e => setAddress(e.target.value)}
                        className={`form-control ${
                          touched.address && errors.address ? "is-invalid" : ""
                        }`}
                        {...getFieldProps("address")}
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
                        style={{
                          marginBottom: "1rem",
                          height: "40px",
                          fontSize: "16px",
                          width: "100%",
                        }}
                        // value={city}
                        // onChange={e => setCity(e.target.value)}
                        className={`form-control ${
                          touched.city && errors.city ? "is-invalid" : ""
                        }`}
                        {...getFieldProps("city")}
                        type="text"
                        id="city"
                      />
                      {touched.city && errors.city ? (
                        <div className="invalid-feedback">{errors.city}</div>
                      ) : null}
                    </Col>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="province">
                        {t("Province")} / {t("State")}
                      </Label>
                      <Input
                        style={{
                          marginBottom: "1rem",
                          height: "40px",
                          fontSize: "16px",
                          width: "100%",
                        }}
                        // value={province}
                        // onChange={e => setProvince(e.target.value)}
                        className={`form-control ${
                          touched.province && errors.province
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("province")}
                        type="text"
                        id="province"
                      />
                      {touched.province && errors.province ? (
                        <div className="invalid-feedback">
                          {errors.province}
                        </div>
                      ) : null}
                    </Col>
                    <Col xs={12} md={6}>
                      <Label className="form-label" for="zip-code">
                        {t("Postal Code")}
                      </Label>
                      <Input
                        style={{
                          marginBottom: "1rem",
                          height: "40px",
                          fontSize: "16px",
                          width: "100%",
                        }}
                        // value={zip_code}
                        // onChange={e => setZip_Code(e.target.value)}
                        className={`form-control ${
                          touched.zip_code && errors.zip_code
                            ? "is-invalid"
                            : ""
                        }`}
                        {...getFieldProps("zip_code")}
                        type="text"
                        id="zip-code"
                      />
                      {touched.zip_code && errors.zip_code ? (
                        <div className="invalid-feedback">
                          {errors.zip_code}
                        </div>
                      ) : null}
                    </Col>
                    <Col xs={12} md={6}>
                      {" "}
                      <Label className="form-label" for="login-email">
                        {t("Country")} / {t("Region")}
                      </Label>
                      <CountryDropdown
                        style={{
                          border: selectedCountryError
                            ? "1px solid red"
                            : "1px solid lightGrey", // change border color
                          fontSize: "16px",
                          width: "100%",
                          height: "40px", // change height
                          borderRadius: "5px",
                          marginBottom: "10px",
                          // add other styles as needed
                        }}
                        value={selectedCountry}
                        onChange={(val) => {
                          setSelectedCountryError(false);
                          setSelectedCountry(val);
                        }}
                      />
                      
                       
   

                      {selectedCountryError ? (
                        <div style={{ color: "red", fontSize: "14px" }}>
                          Country is Required
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                ) : (
                  <Card style={{ border: "1px solid #d6d6d6" }}>
                    <CardBody>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBlock: "10px",
                        }}
                      >
                        <h2 style={{ fontWeight: 600 }}>
                          {t("Billing Information")}
                        </h2>
                        <Button
                          onClick={() => {
                            console.log("EDIT");
                            console.log(billingInfo);
                            setInitialValues({
                              address: billingInfo?.address?.line1,
                              city: billingInfo?.address.city,
                              // country: billingInfo?.address.country,
                              province: billingInfo?.address.state,
                              zip_code: billingInfo?.address.postal_code,
                              first_name: billingInfo?.name?.split(" ")[0],
                              last_name: billingInfo?.name?.split(" ")[1],
                              phone: value,
                            });
                            // billingInfoSet()
                            setSelectedCountry(billingInfo?.address?.country);
                            // setFirst_Name(billingInfo?.name.split(' ')[0])
                            // setLast_Name(billingInfo?.name.split(' ')[1])
                            // setPhone_Number(billingInfo?.phone)
                            // setAddress(billingInfo?.address?.line1)
                            // setCity(billingInfo?.address.city)
                            // setProvince(billingInfo?.address.state)
                            // setZip_Code(billingInfo?.address.postal_code)
                            // setSelectedCountry(billingInfo?.address.country)
                            setEditBillingInfo(true);
                            // let details = {
                            //   address:{
                            //    line1: billingInfo?.address?.line1,
                            //    city:billingInfo?F.address.city,
                            //    country: selectedCountry,
                            //    state: billingInfo?.address.state,
                            //    postal_code: billingInfo?.address.postal_code,
                            //   } ,

                            //   name: billingInfo?.name,
                            //    // first_name: billingInfo.first_name,
                            //    // last_name: billingInfo.last_name,
                            //    phone: billingInfo.phone,
                            //  };
                            // billingInfoSet(details)
                          }}
                          outline
                          size="sm"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          {t("Edit")}
                        </Button>
                      </div>
                      <h3 style={{ fontWeight: 500, marginBlock: "10px" }}>
                        {billingInfo?.first_name} {billingInfo?.last_name}
                      </h3>
                      <h3 style={{ fontWeight: 500, marginBlock: "10px" }}>
                        {billingInfo?.phone}
                      </h3>
                      <h3 style={{ fontWeight: 500, marginBlock: "10px" }}>
                        {billingInfo?.address?.line1}
                      </h3>
                      <h3 style={{ fontWeight: 500, marginBlock: "10px" }}>
                        {billingInfo?.address.city}{" "}
                        {billingInfo?.address?.state}{" "}
                        {billingInfo?.address?.postal_code}
                      </h3>
                      <h3 style={{ fontWeight: 500, marginBlock: "10px" }}>
                        {billingInfo?.address?.country}
                      </h3>
                    </CardBody>
                  </Card>
                )}

                {/* <Row> */}

                {/* <Col
                    xs={12}
                    md={12}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      disabled={isSubmitting}
                      size="sm"
                      type="submit"
                      style={{ height: "40px" }}
                      color="primary"
                    >
                      {" "}
                      {isSubmitting ? (
                        <Spinner color="white" size="sm" />
                      ) : null}
                      <span className="align-middle ms-25"> {t("Save")}</span>
                    </Button> */}
                {/* </Col> */}
                {/* </Row> */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {PaymentmMethodIdPrev === null ? (
                    <>
                      {" "}
                      {/* {billingInfo !== null && cardsAdd ? (
                  <> */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h3 style={{ marginTop: "2%", textAlign: "center",color:"red" }}>
                          {loadingStripe
                            ? "Please wait while we process your payment"
                            : null}
                        </h3>
                        <Button
                          size="sm"
                          style={{ height: "40px", marginTop: "10px" }}
                          type="submit"
                          // onClick={handleSubmit}
                          color="primary"
                          disabled={loadingStripe}
                        >
                          {" "}
                          {loadingStripe ? (
                            <Spinner color="white" size="sm" />
                          ) : null}
                          <span className="align-middle ms-25">
                            {t("Pay Now")}
                          </span>
                        </Button>
                      </div>
                     
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h3 style={{ marginTop: "2%", textAlign: "center" ,color:"red"}}>
                          {loadingStripe
                            ? t("Please wait while we process your payment")
                            : null}
                        </h3>
                        <Button
                          size="sm"
                          style={{ height: "40px", marginTop: "20px" }}
                          onClick={handleSubmit}
                          color="success"
                          disabled={loadingStripe}
                        >
                          {" "}
                          {loadingStripe ? (
                            <Spinner color="white" size="sm" />
                          ) : null}
                          <span className="align-middle ms-25">
                            {" "}
                            {t("Use")} **** {CardDigits}
                          </span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            )}
          </Formik>
          {/* </>
          ) : ( */}

          {/* )} */}
          {/* {
          cardsData.length === 0 ? */}
          {/* // ||
          //  cardsAdd === true ?
            ( */}

          {/* ) : ( */}
          {/* {cards.length === 0 ? null : ( */}
          <>
            {/* {cardsAdd ? null : (
              <>
                <hr />

                <div
                  style={{display: 'flex', cursor: 'pointer', marginBlock: '10px'}}
                  onClick={() => {
                    setCardsAdd(true);
                    setPaymentmMethodIdPrev(null);
                  }}>
                  <Plus size={20} style={{cursor: 'pointer'}} />
                  <h2 style={{fontWeight: 600, marginLeft: '10px'}}>Add Payment method</h2>
                </div>
              </>
            )} */}
          </>
          {/* )} */}

          {/* <h3 style={{marginTop: '2%', textAlign: 'center'}}>
            {loadingStripe ? 'Please wait while we process your payment' : null}
          </h3>
              <Button size="sm" style={{height: '40px'}} type="submit" color="primary" disabled={loadingStripe}>
                  {' '}
                  {loadingStripe ? <Spinner color="white" size="sm" /> : null}
                  <span className="align-middle ms-25"> Pay Now</span>
                </Button> */}
          {/* // )} */}

          {/* // </form> */}
        </div>
      ) : (
        <>
          <div className="payment-success" style={{ marginBlock: "2%" }}>
            <h1 style={{ fontWeight: 700 }}>{t("Payment successful")}</h1>
            <h3 className="Thank-you">{t("Thank you for your patronage")}</h3>
          </div>
        </>
      )}
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteFolder}
        text={t(
          "Deleting this card will prevent us from charging you. Continue?"
        )}
        alertStatusDelete={"delete"}
      />
    </div>
  );
}

export default PaymentForm;
