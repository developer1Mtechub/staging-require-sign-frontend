// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// ** Icons Imports
import { ArrowLeft, CreditCard, Home, Minus, Plus, X } from "react-feather";
import Wizard from "@components/wizard";
import classnames from "classnames";

// ** Custom Components
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CardImages from "../assets/images/pages/CardImages.png";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  Label,
  Input,
  Button,
  Spinner,
  UncontrolledTooltip,
  Card,
  CardBody,
  CardText,
  Badge,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/pp.png";
import illustrationsDark from "@src/assets/images/pages/pp.png";
import logoRemoveBg from "@src/assets/images/pages/logoRemoveBg.png";
import PaymentIcon from "@src/assets/images/pages/pp.png";
import InputNumber from "rc-input-number";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
// import { post } from "../apis/api";
// import toastAlert from "@components/toastAlert";
import { useEffect, useRef, useState } from "react";
// import { PrimaryKey } from "../apis/stripe_keys";
import PaymentForm from "../components/PaymentForm";
import { PrimaryKey, post } from "../apis/api";
import CustomButton from "../components/ButtonCustom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { decrypt } from "../utility/auth-token";
import { getUser } from "../redux/navbar";
import SpinnerCustom from "../components/SpinnerCustom";

const StripeCheckout = () => {
  const { skin } = useSkin();
  const stripePromise = loadStripe(PrimaryKey);
  const { t } = useTranslation();
  const [couponLoader, setCouponLoader] = useState(false);
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [loaderData, setLoaderData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCoupon, setErrorCoupon] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [discountType, setDiscounteType] = useState("");
  const [coupon_applied, setCouponApplied] = useState(false);

  const validateCoupon = async () => {
    if (!coupon) return;
    try {
      setCouponLoader(true);
      const postData = {
        couponId: coupon,
      };
      const apiData = await post("validate-coupon", postData);
      console.log("apiData");
      console.log(apiData);
      setCouponLoader(false);
      if (apiData.error === true) {
        setErrorCoupon(true);
        setErrorMessage(apiData.message);
      } else {
        setCouponApplied(true);
        console.log(apiData.data);
        setErrorCoupon(false);

        if (apiData.data.type === "amount") {
          setDiscounteType("Fixed");
          const discountAmount = (apiData.data.amount || 0) / 100;
          setDiscountedAmount(discountAmount);
          const total_amount = total - discountAmount;
          setTotal(total_amount);
        } else {
          setDiscounteType("Percentage");

          setDiscountedAmount(apiData.data.amount);
          console.log(total);
          const total_amount = total - (total * apiData.data.amount) / 100;
          setTotal(total_amount);
          console.log(total_amount);
        }
        setCoupon(coupon1);
        setErrorCoupon(false);
      }
    } catch (error) {
      console.error("Error processing token data:", error);
      setCouponLoader(false);
    }
  };
  const validateCoupon1 = async (coupon1) => {
    if (!coupon1) return;
    try {
      setCouponLoader(true);
      const postData = {
        couponId: coupon1,
      };
      const apiData = await post("validate-coupon", postData);
      console.log("apiData");
      console.log(apiData);
      setCouponLoader(false);
      if (apiData.error === true) {
        setErrorCoupon(true);
        setErrorMessage(apiData.message);
      } else {
        setErrorCoupon(false);

        setCouponApplied(true);
        console.log(apiData.data);
        if (apiData.data.type === "amount") {
          setDiscounteType("Fixed");
          const discountAmount = (apiData.data.amount || 0) / 100;
          setDiscountedAmount(discountAmount);
          const total_amount = total - discountAmount;
          setTotal(total_amount);
        } else {
          setDiscounteType("Percentage");

          setDiscountedAmount(apiData.data.amount);
          console.log(total);
          const total_amount = total - (total * apiData.data.amount) / 100;
          setTotal(total_amount);
          console.log(total_amount);
        }
        setCoupon(coupon1);
        setErrorCoupon(false);
      }
    } catch (error) {
      console.error("Error processing token data:", error);
      setCouponLoader(false);
    }
  };
  const { user, status, error } = useSelector((state) => state.navbar);
  const [selectedPriceId, setSelectedPriceId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [amountyear, setAmountyear] = useState(null);

  const [nickname, setnickname] = useState(null);
  // Stripe
  const loader = "auto";
  const appearance = {
    theme: "stripe",
  };
  const [Lookup, setLookup] = useState("");
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const validationSchema = Yup.object().shape({
    company_email: Yup.string()
      .nullable()
      .email("Invalid email")
      .required("company_email is required"),
    company_name: Yup.string().nullable().required("Company Name is required"),
    contact_no: Yup.string().nullable().required("Contact No is required"),
    description: Yup.string().nullable().required("Description is required"),
    max_user_limit: Yup.string()
      .nullable()
      .required("Maximum User Limit is required"),
  });

  // const [email, setEmail] = useState(items.email);
  const [planName, setPlanName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");

  const [total, setTotal] = useState(0);
  const [cards, setCards] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [loaderCards, setLoaderCards] = useState(false);
  const getUserCards = async () => {
    const items = JSON.parse(localStorage.getItem("@selectedprice"));
    //console.log(items.customer_id_stripe);
    // if (items.customer_id_stripe === null) {
    //   setLoaderCards(false);
    // } else {
    //   const postData = {
    //     customerId: items?.customer_id_stripe,
    //   };
    //   const apiData = await post('get-customer-cards', postData); // Specify the endpoint you want to call
    //   //console.log('apixxsData');
    //   //console.log(apiData);
    //   setLoaderCards(false);
    //   setCards(apiData.cards);
    //   setBillingInfo(apiData.billingDetails);
    // }
  };
  const getUserPlan = async () => {
    // Retrieve user's plan information
    const postData = { user_id: user?.user_id };
    const apiData = await post("plan/get_user_plan", postData);

    console.log("USER PLAN GET ...", apiData);

    if (apiData.error) {
      // Handle error if apiData returns an error
      setLoaderData(false);
      return;
    }

    // Set billing and card info if available
    if (apiData?.billingDetails?.length > 0) {
      setBillingInfo(apiData?.billingDetails[0]);
    }
    if (apiData?.cards?.length > 0) {
      setCards(apiData.cards);
    }

    // Get selected price details from localStorage
    const items = JSON.parse(localStorage.getItem("@selectedprice"));
    if (!items) return; // Exit if no items found in localStorage
    console.log("IOTEMDBVS HJDHJD");
    console.log(items);
    // Set basic details for the plan
    setSelectedPriceId(items.priceId.pricing_id);
    setPlanName(items.priceId.name);
    setMin(items.team_size);
    setNumberMembers(items.team_size);
    setMaxUser(49);

    // Calculate the total based on duration (monthly or yearly)
    let baseAmount = 0;
    if (items.duration === "monthly") {
      baseAmount =
        parseInt(items.team_size) * parseInt(items.priceId.monthly_price);
      setAmount(items.priceId.monthly_price);
    } else {
      baseAmount =
        parseInt(items.team_size) * parseInt(items.priceId.yearly_price);
      setAmount(items.priceId.yearly_price);
      setAmountyear(items.priceId.monthly_price_year);
    }
    setTotal(baseAmount);

    // Apply any referral discount if available
    console.log("~SAODHGDGCHG");
    // await applyReferralDiscount(user?.referal_code, baseAmount);
    await validateCoupon1(user?.referal_code);

    // Finalize loader state
    setLoaderData(false);
  };

  // Function to handle the referral discount
  const applyReferralDiscount = async (referalCode, currentTotal) => {
    if (!referalCode) return;
    console.log("~SAODHGDGCHG-25434523");
    let discountAmount = 0;
    let discounted_amiunt_actual = 0;
    const postData = { couponId: referalCode };

    const apiData = await post("validate-coupon", postData);
    console.log("apiData");
    console.log(apiData);

    if (apiData.error) {
      setCouponApplied(false);
      return;
    }

    // Calculate the discount based on coupon type
    setCouponApplied(true);

    if (apiData.data.type === "percentage") {
      // Fixed discount
      setDiscounteType("Fixed");
      discountAmount = (apiData.data.amount || 0) / 100;
      discounted_amiunt_actual = discountAmount;
    } else {
      // Percentage discount
      setDiscounteType("Percentage");
      discounted_amiunt_actual = apiData.data.amount;
      discountAmount = currentTotal * (apiData.data.amount / 100);
    }

    // setDiscountedAmount(discountAmount);
    setDiscountedAmount(discounted_amiunt_actual);
    setTotal(currentTotal - discountAmount);
  };
  // const getUserPlan = async () => {
  //   //console.log(items?.token?.user_id);
  //   // setemail(items?.token?.email);
  //   // //console.log('Navbar');
  //   // //console.log('User Profile Signature UPGRADE SECTION');
  //   const postData = {
  //     user_id: user?.user_id,
  //   };
  //   const apiData = await post("plan/get_user_plan", postData); // Specify the endpoint you want to call
  //   console.log("USER PLAN GET ...");
  //   console.log("USER PLAN GET ...");

  //   console.log(apiData);

  //   if (apiData.error) {
  //     // toastAlert("error", "")
  //     // setLoaderData(false);
  //   } else {
  //     console.log(apiData);
  //     if (apiData.error===true) {

  //     } else {
  //       if(apiData.billingDetails.length>0){
  //         setBillingInfo(apiData.billingDetails[0])

  //       }
  //       if(apiData.cards.length>0){
  //         setCards(apiData.cards)

  //       }
  //       const items = JSON.parse(localStorage.getItem("@selectedprice"));
  //   console.log(items)
  //             setSelectedPriceId(items.priceId.pricing_id);
  //             setPlanName(items.priceId.name);
  //             setMin(items.team_size);
  //             setNumberMembers(items.team_size);
  //             setMaxUser(49);
  //             if (items.duration === "monthly") {
  //               let amount_data =
  //                 parseInt(items.team_size) * parseInt(items.priceId.monthly_price);
  //               setAmount(items.priceId.monthly_price);
  //               setTotal(amount_data);
  //             } else {
  //               console.log("Yesrly pricve ");
  //               console.log(
  //                 parseInt(items.team_size) * parseInt(items.priceId.yearly_price)
  //               );
  //               let amount_data_year =
  //                 parseInt(items.team_size) * parseInt(items.priceId.yearly_price);
  //               let amount_data_year_m =
  //                 parseInt(items.team_size) *
  //                 parseInt(items.priceId.monthly_price_year);
  //               console.log(amount_data_year);

  //               setAmount(items.priceId.yearly_price);
  //               setAmountyear(items.priceId.monthly_price_year);
  //               setTotal(amount_data_year);
  //             }
  //             // }
  //             setEmail(items.email);
  //             setLookup(items.duration);

  //             setnickname(items.priceId.name);

  //             let ReferalCode=user.referal_code
  //             console.log("Referal Code",ReferalCode)
  //             const postData = {
  //               couponId: ReferalCode,
  //             };
  //             const apiData = await post(
  //               "validate-coupon",
  //               postData
  //             );
  //             console.log("apiData");
  //             console.log(apiData);
  //             if(apiData.error===true){
  //               console.log("NO REFERAL CODE")
  //               setCouponApplied(false)

  //             }else{
  //               console.log(" REFERAL CODE")
  //               setCouponApplied(true)
  //               console.log(apiData.data)
  //               if(apiData.data.percent_off===null){
  //                 setDiscounteType("Fixed")
  //                 const discountAmount = (apiData.data.amount_off || 0) / 100;
  //                 setDiscountedAmount(discountAmount)
  //                 const total_amount=total-discountAmount
  //                 setTotal(total_amount)
  //               }else{
  //                 setDiscounteType("Percentage")

  //                 setDiscountedAmount(apiData.data.percent_off)
  //                 console.log(total)
  //                 const total_amount=total-(total*apiData.data.percent_off/100)
  //                 setTotal(total_amount)
  //                 console.log(total_amount)

  //               }

  //             }

  //             setLoaderData(false);

  //     }
  //   }
  // };
  const [min, setMin] = useState(1);
  const [max_user, setMaxUser] = useState(49);
  const [CustomerStripeId, setCustomerStripeId] = useState(null);
  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem('@selectedprice'));
  //   if (items === null || items === undefined || items.priceId === null || items.priceId === undefined) {
  //     window.location.href = '/home';
  //   } else {
  //     getUserPlan()
  //     // customer_id_stripe
  //     // setCustomerStripeId(items.customer_id_stripe);
  //     // getUserCards();
  //     //console.log(items.priceId);
  //     // setType(items.priceId.type);
  //     setSelectedPriceId(items.priceId.pricing_id);
  //     setPlanName(items.priceId.name);
  //     //console.log('items.priceId.type');

  //     //console.log(items.priceId.type);
  //     // if (items.priceId.type === 'BIZ') {
  //     //   //console.log('biz');
  //     //   setMin(2);
  //     //   setNumberMembers(2);
  //     //   if (items.duration === 'monthly') {
  //     //     setAmount(items.priceId.monthly_price);
  //     //     setTotal(items.priceId.monthly_price * 2);
  //     //   } else {
  //     //     setAmount(items.priceId.yearly_price);
  //     //     setTotal(items.priceId.yearly_price * 2);
  //     //   }
  //     // } else {
  //       // setMin(items.priceId.team_size);
  //       // setNumberMembers(items.priceId.team_size);
  //       setMin(items.team_size);
  //       setNumberMembers(items.team_size);
  //       setMaxUser(49)
  //       if (items.duration === 'monthly') {
  //         let amount_data=parseInt(items.team_size) * parseInt(items.priceId.monthly_price)
  //         setAmount(items.priceId.monthly_price);
  //         setTotal(amount_data);
  //       } else {
  //         console.log("Yesrly pricve ")
  //         console.log(
  //           parseInt(items.team_size) * parseInt(items.priceId.yearly_price)
  //         )
  //         let amount_data_year=parseInt(items.team_size) * parseInt(items.priceId.yearly_price)
  //         let amount_data_year_m=parseInt(items.team_size) * parseInt(items.priceId.monthly_price_year)
  //         console.log(amount_data_year)

  //         setAmount(items.priceId.yearly_price);
  //         setAmountyear(items.priceId.monthly_price_year)
  //         setTotal(amount_data_year);
  //       }
  //     // }
  //     setEmail(items.email);
  //     setLookup(items.duration);

  //     setnickname(items.priceId.name);
  //   }
  // }, []);
  // ** State
  const [numberMembers, setNumberMembers] = useState(1);
  const [successPayment, setSuccessPayment] = useState(false);
  // const [email, setEmail] = useState(() => {
  //   const selectedPrice = localStorage.getItem("@selectedprice");
  //   const parsedPrice = JSON.parse(selectedPrice);
  //   return parsedPrice ? parsedPrice.email : "";
  // });
  // const getReferalCodeCheck = async () => {
  //   let ReferalCode = user.referal_code;
  //   console.log("Referal Code", ReferalCode);
  //   const postData = {
  //     couponId: ReferalCode,
  //   };
  //   const apiData = await post("validate-coupon", postData);
  //   console.log("apiData");
  //   console.log(apiData);
  //   if (apiData.error === true) {
  //     console.log("NO REFERAL CODE");
  //     setCouponApplied(false);
  //   } else {
  //     console.log(" REFERAL CODE");
  //     setCouponApplied(true);
  //     console.log(apiData.data);
  //     if (apiData.data.percent_off === null) {
  //       setDiscounteType("Fixed");
  //       const discountAmount = (apiData.data.amount_off || 0) / 100;
  //       setDiscountedAmount(discountAmount);
  //       const total_amount = total - discountAmount;
  //       setTotal(total_amount);
  //     } else {
  //       setDiscounteType("Percentage");

  //       setDiscountedAmount(apiData.data.percent_off);
  //       console.log(total);
  //       const total_amount = total - (total * apiData.data.percent_off) / 100;
  //       setTotal(total_amount);
  //       console.log(total_amount);
  //     }
  //   }
  // };
  const [localItem,setLocalItem]=useState(null)
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("@selectedprice"));
    setEmail(items.email);
    setLocalItem(items)
    let baseAmount =
      items?.duration === "monthly"
        ? items.priceId.monthly_price
        : items.priceId.yearly_price;
    setLookup(items?.duration);
    // Calculate total based on team members
    let calculatedTotal = baseAmount * numberMembers;

    // Apply discount if coupon is applied
    if (coupon_applied) {
      if (discountType === "Fixed") {
        calculatedTotal -= discountedAmount;
      } else if (discountType === "Percentage") {
        calculatedTotal -= (calculatedTotal * discountedAmount) / 100;
      }
    }

    setTotal(calculatedTotal);
  }, [coupon_applied, numberMembers, Lookup, discountedAmount]);
  // const localstorageItemfuc = () => {
  //   const items = JSON.parse(localStorage.getItem("@selectedprice"));
  //   console.log(items);
  //   setSelectedPriceId(items.priceId.pricing_id);
  //   setPlanName(items.priceId.name);
  //   setMin(items.team_size);
  //   setNumberMembers(items.team_size);
  //   setMaxUser(49);
  //   if (items.duration === "monthly") {
  //     let amount_data =
  //       parseInt(items.team_size) * parseInt(items.priceId.monthly_price);
  //     setAmount(items.priceId.monthly_price);
  //     setTotal(amount_data);
  //   } else {
  //     console.log("Yesrly pricve ");
  //     console.log(
  //       parseInt(items.team_size) * parseInt(items.priceId.yearly_price)
  //     );
  //     let amount_data_year =
  //       parseInt(items.team_size) * parseInt(items.priceId.yearly_price);
  //     let amount_data_year_m =
  //       parseInt(items.team_size) * parseInt(items.priceId.monthly_price_year);
  //     console.log(amount_data_year);

  //     setAmount(items.priceId.yearly_price);
  //     setAmountyear(items.priceId.monthly_price_year);
  //     setTotal(amount_data_year);
  //   }
  //   // }
  //   setEmail(items.email);
  //   setLookup(items.duration);

  //   setnickname(items.priceId.name);
  //   //         console.log(isFreeTrialExpired);
  //   //         if (isFreeTrialExpired === "true" || isFreeTrialExpired === true) {
  //   //           console.log("FREE TRIAl TRUE");
  //   //           setFreeTrailExpiredAlert(true);

  //   //         } else {
  //   //           setFreeTrailExpiredAlert(true);
  //   //           console.log("dfgdfgdg")
  //   //           console.log(daysLeftExpiredfreePlan)
  //   // setdaysleftExpired(daysLeftExpiredfreePlan);

  //   //         }
  //   // console.log(docuemntsCount);
  //   setLoaderData(false);
  // };
  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            getUserPlan(),
            // ,getReferalCodeCheck()
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoaderData(false);
        } finally {
          setLoaderData(false);
        }
      };
      fetchDataBasedOnUser();
      // localstorageItemfuc()
    }
  }, [user, status]);
  useEffect(() => {
    const encryptedData = localStorage.getItem("user_data");
    console.log("encryptedData");

    console.log(encryptedData);
    if (encryptedData) {
      try {
        const decryptedData = JSON.parse(decrypt(encryptedData));
        const { token, user_id } = decryptedData;
        console.log(decryptedData);

        // Fetch user data if not already available in Redux state
        if (token && user_id && !user) {
          dispatch(getUser({ user_id, token }));
        }
      } catch (error) {
        console.error("Error processing token data:", error);
      }
    }
  }, [dispatch, user]);
  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem('@selectedprice'));
  //   console.log("itemns nsdh")
  //   console.log(items.priceId)
  //   console.log(items)

  //   if (items.priceId.type === 'Team') {
  //     //console.log('biz');
  //     // setMin(2)
  //     // setNumberMembers(2)
  //     if (Lookup === 'monthly') {
  //       setAmount(items.priceId.monthly_price);
  //       setTotal(items.priceId.monthly_price * numberMembers);
  //     } else {
  //       setAmount(items.priceId.yearly_price);
  //       setTotal(items.priceId.yearly_price * numberMembers);
  //     }
  //   } else {
  //     // setMin(1)
  //     // setNumberMembers(1)
  //     if (Lookup === 'monthly') {
  //       setAmount(items.priceId.monthly_price);
  //       setTotal(items.priceId.monthly_price * numberMembers);
  //     } else {
  //       setAmount(items.priceId.yearly_price);
  //       setTotal(items.priceId.yearly_price * numberMembers);
  //     }
  //   }
  // }, [Lookup]);
  const ref = useRef(null);

  return (
    <>
      <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
        {loaderData ? (
          <div style={{ padding: "20px" }}>
            <SpinnerCustom
              color="primary"
              style={{ width: "3rem", height: "3rem" }}
            />
          </div>
        ) : (
          <>
            {successPayment ? (
              <>
                <div className="misc-wrapper">
                  <Link
                    className="brand-logo"
                    to="/"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img
                      src={logoRemoveBg}
                      alt="Login Cover"
                      style={{ width: "200px", height: "auto" }}
                    />
                    {/* <h2 className='brand-text text-primary ms-1'>Vuexy</h2> */}
                  </Link>
                  <div className="misc-inner p-2 p-sm-3">
                    <div className="w-100 text-center">
                      <h1 className="mb-1 fw-bold">
                        {t("Payment Successful")}!
                      </h1>
                      <p className="mb-2" style={{ fontSize: "16px" }}>
                        {t(
                          "Thank you for your purchase. Your transaction has been completed, and a receipt for your purchase has been emailed to you."
                        )}
                      </p>
                      <Button
                        style={{ boxShadow: "none" }}
                        tag={Link}
                        to="/"
                        color="primary"
                        className="btn-sm-block mb-2"
                      >
                        {t("Back to home")}
                      </Button>
                      <img
                        className="img-fluid"
                        src={source}
                        alt="Not authorized page"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Elements
                  stripe={stripePromise}
                  options={{ appearance, loader }}
                >
                  <Row>
                    {window.innerWidth < 786 ? (
                      <>
                        <Col xs={12} md={12} style={{ paddingInline: "10%" }}>
                          <Row>
                            <Col
                              xl={12}
                              md={12}
                              sm={12}
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "left",
                                marginBlock: "0.2%",
                                paddingInline: "2%",
                              }}
                            >
                              {/* back button
                               */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CustomButton
                                  padding={true}
                                  useDefaultColor={true}
                                  size="sm"
                                  // disabled={saveLoading}
                                  color="primary"
                                  // disabled={downloadLoader}
                                  onClick={async () => {
                                    window.location.href = "/home";
                                  }}
                                  style={{
                                    display: "flex",
                                    boxShadow: "none",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  className="btn-icon d-flex"
                                  text={
                                    <>
                                      {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                                      <span className="align-middle ms-25">
                                        {t("Back")}
                                      </span>
                                    </>
                                  }
                                />

                                <img
                                  src={
                                    // logoFromApi ||
                                    // logoFromLocalStorage ||
                                    //  logoURL
                                    logoRemoveBg
                                  }
                                  style={{
                                    width: "160px",
                                    height: "auto",
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                          <div
                            style={{
                              // backgroundColor: '#f6f7f8',
                              // border: '1px solid #d6d6d6',
                              textAlign: "left",
                              borderRadius: "5px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <h2
                                style={{
                                  fontSize: "18px",
                                  fontWeight: 600,
                                  color: "black",
                                  marginTop: "20px",
                                }}
                              >
                                {t("Order Summary")}
                              </h2>

                              {/* <Badge color="success" pill > */}
                              {/* <div
                 style={{
                   backgroundColor: "#28c76f ",
                   color: "white",
                   padding: "5px",
                   borderRadius: "30px",
                   fontWeight: 600,
                   fontSize: "16px",
                 }}
               >
                 {Lookup}
               </div> */}
                              {/* <span >{Lookup}</span>
           </Badge> */}
                            </div>

                            {/* <h4 style={{fontWeight: 500, color: 'black', fontSize: '18px'}}>Plan</h4> */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "16px",
                                  color: "black",
                                  fontWeight: 600,
                                }}
                              >
                                {t("Plan Name")}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "black",
                                }}
                              >
                                {planName}
                              </span>
                            </div>
                            {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{ fontSize: "16px", fontWeight: 600 }}
                              >
                                {t("Billing Option")}
                              </span>
                              <select
                                value={Lookup}
                                style={{
                                  fontSize: "16px",
                                  padding: "3px",
                                  borderRadius: "5px",
                                  border: "1px solid lightGrey",
                                  cursor: "pointer",
                                  // width:'100%',
                                }}
                                onChange={(e) => {
                                  setLookup(e.target.value);
                                  const items = JSON.parse(
                                    localStorage.getItem("@selectedprice")
                                  );

                                  let local_lookup = e.target.value;
                                  if (items.priceId.type === "Team") {
                                    //console.log('biz');
                                    // setMin(2)
                                    // setNumberMembers(2)
                                    if (local_lookup === "monthly") {
                                      setAmount(items.priceId.monthly_price);
                                      setTotal(
                                        items.priceId.monthly_price *
                                          numberMembers
                                      );
                                    } else {
                                      setAmount(items.priceId.yearly_price);
                                      setTotal(
                                        items.priceId.yearly_price *
                                          numberMembers
                                      );
                                    }
                                  } else {
                                    // setMin(1)
                                    // setNumberMembers(1)
                                    if (local_lookup === "monthly") {
                                      setAmount(items.priceId.monthly_price);
                                      setTotal(
                                        items.priceId.monthly_price *
                                          numberMembers
                                      );
                                    } else {
                                      setAmount(items.priceId.yearly_price);
                                      setTotal(
                                        items.priceId.yearly_price *
                                          numberMembers
                                      );
                                    }
                                  }

                                  // Get the current @selectedprice object from localStorage
                                  const selectedPrice = JSON.parse(
                                    localStorage.getItem("@selectedprice")
                                  );

                                  // Update the duration value with the new value from the input
                                  if (selectedPrice) {
                                    selectedPrice.duration = e.target.value;

                                    // Save the updated object back to localStorage
                                    localStorage.setItem(
                                      "@selectedprice",
                                      JSON.stringify(selectedPrice)
                                    );
                                  }
                                  // change values
                                }}
                              >
                                <option
                                  value="monthly"
                                  style={{
                                    cursor: "pointer",
                                    padding: "3px",
                                    fontSize: "16px",
                                  }}
                                >
                                  {t("Monthly")}
                                </option>
                                <option value="yearly">{t("Yearly")}</option>
                              </select>

                            </div> */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  }}
>
  <span
    style={{ fontSize: "16px", fontWeight: 600, marginBottom: "10px" }}
  >
    {t("Billing Option")}
  </span>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "20px",
    }}
  >
    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <input
        type="checkbox"
        checked={Lookup === "monthly"}
        onChange={() => {
          const items = JSON.parse(localStorage.getItem("@selectedprice"));

          if (Lookup !== "monthly") {
            setLookup("monthly");
            setAmount(items.priceId.monthly_price);
            setTotal(items.priceId.monthly_price * numberMembers);

            // Update localStorage with new duration
            const selectedPrice = JSON.parse(
              localStorage.getItem("@selectedprice")
            );
            if (selectedPrice) {
              selectedPrice.duration = "monthly";
              localStorage.setItem(
                "@selectedprice",
                JSON.stringify(selectedPrice)
              );
            }
          }
        }}
      />
      <span>
        {t("Monthly")} - ${localItem?.priceId?.monthly_price || "0"}
      </span>
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <input
        type="checkbox"
        checked={Lookup === "yearly"}
        onChange={() => {
          const items = JSON.parse(localStorage.getItem("@selectedprice"));

          if (Lookup !== "yearly") {
            setLookup("yearly");
            setAmount(items.priceId.yearly_price);
            setTotal(items.priceId.yearly_price * numberMembers);

            // Update localStorage with new duration
            const selectedPrice = JSON.parse(
              localStorage.getItem("@selectedprice")
            );
            if (selectedPrice) {
              selectedPrice.duration = "yearly";
              localStorage.setItem(
                "@selectedprice",
                JSON.stringify(selectedPrice)
              );
            }
          }
        }}
      />
      <span>
        {t("Yearly")} - ${localItem?.priceId?.yearly_price || "0"}
      </span>
    </label>
  </div>
</div>

                            {Lookup === "yearly" ? (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span style={{ fontSize: "18px" }}>
                                    {t("Monthly price")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 500,
                                      color: "black",
                                    }}
                                  >
                                    $ {amountyear}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {t("Amount")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: 500,
                                      color: "black",
                                    }}
                                  >
                                    $ {amount}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {t("Amount")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 500,
                                      color: "black",
                                    }}
                                  >
                                    $ {amount}
                                  </span>
                                </div>
                              </>
                            )}
                            <hr />

                            {planName === "Team" ? (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {t("Team Members")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 500,
                                      color: "black",
                                    }}
                                  >
                                    <Minus
                                      onClick={() => {
                                        const items = JSON.parse(
                                          localStorage.getItem("@selectedprice")
                                        );

                                        if (numberMembers > min) {
                                          const no = numberMembers - 1;

                                          if (Lookup === "monthly") {
                                            setAmount(
                                              items.priceId.monthly_price
                                            );
                                            setTotal(
                                              items.priceId.monthly_price * no
                                            );
                                          } else {
                                            setAmount(
                                              items.priceId.yearly_price
                                            );
                                            setTotal(
                                              items.priceId.yearly_price * no
                                            );
                                          }

                                          setNumberMembers(numberMembers - 1);
                                          // setTotal(amount * no);
                                        }
                                      }}
                                      size={20}
                                      style={{
                                        backgroundColor: "#23b3e8",
                                        color: "white",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                    />
                                    <input
                                      value={numberMembers}
                                      onChange={(e) => {
                                        setNumberMembers(e.target.value);
                                        const no = e.target.value;
                                        setTotal(amount * no);
                                      }}
                                      type="number"
                                      id="quantity"
                                      name="quantity"
                                      min="1"
                                      style={{
                                        marginInline: "10px",
                                        width: "50px",
                                        borderRadius: "5px",
                                        border: "1px solid lightGrey",
                                        textAlign: "center",
                                      }}
                                    />
                                    <Plus
                                      onClick={() => {
                                        const items = JSON.parse(
                                          localStorage.getItem("@selectedprice")
                                        );

                                        if (numberMembers < max_user) {
                                          // } else {
                                          setNumberMembers(numberMembers + 1);
                                          const no = numberMembers + 1;
                                          // setTotal(amount * no);
                                          if (Lookup === "monthly") {
                                            setAmount(
                                              items.priceId.monthly_price
                                            );
                                            setTotal(
                                              items.priceId.monthly_price * no
                                            );
                                          } else {
                                            setAmount(
                                              items.priceId.yearly_price
                                            );
                                            setTotal(
                                              items.priceId.yearly_price * no
                                            );
                                          }
                                        }
                                      }}
                                      size={20}
                                      style={{
                                        backgroundColor: "#23b3e8",
                                        color: "white",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </span>
                                </div>
                              
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {t("Total Amount")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: 500,
                                      color: "black",
                                    }}
                                  >
                                    $ {amount}/user/
                                    {Lookup === "yearly" ? "year" : "month"}
                                  </span>
                                </div>
                                {/* <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {t("Tax Amount")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 500,
                                      color: "black",
                                    }}
                                  >
                                    $ 0
                                  </span>
                                </div> */}
                                <hr />{" "}
                              </>
                            ) : null}
                             <span
                              style={{
                                fontSize: "16px",
                                color: "black",
                                fontWeight: 400,
                              }}
                            >
                              {t("Apply Referal Code")}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <Input
                                disabled={coupon_applied}
                                value={coupon}
                                onChange={(e) => {
                                  setCoupon(e.target.value);
                                }}
                                style={{
                                  fontSize: "16px",
                                  padding: "3px",
                                  width: "100%",
                                  boxShadow: "none",

                                  borderRadius: "5px",
                                  textAlign: "center",
                                  border: "1px solid lightGrey",
                                  cursor: "pointer",
                                  // width:'100%',
                                }}
                                placeholder={t("Enter Referal Code")}
                              />
                              {coupon_applied ? null : (
                                <CustomButton
                                  padding={true}
                                  disabled={couponLoader}
                                  useDefaultColor={true}
                                  size="sm"
                                  // disabled={saveLoading}
                                  color="primary"
                                  // disabled={downloadLoader}
                                  onClick={async () => {
                                    if (coupon === "") {
                                    } else {
                                      await validateCoupon();
                                    }

                                    // window.location.href = "/home";
                                  }}
                                  style={{
                                    marginLeft: "10px",
                                    display: "flex",
                                    boxShadow: "none",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  className="btn-icon d-flex"
                                  text={
                                    <>
                                      {couponLoader ? (
                                        <Spinner color="white" size="sm" />
                                      ) : null}
                                      <span className="align-middle ms-25">
                                        {t("Apply")}
                                      </span>
                                    </>
                                  }
                                />
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {errorCoupon ? (
                                <p
                                  style={{
                                    color: "red",
                                    fontSize: "14px",
                                    marginBlock: "5px",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  {errorMessage}
                                </p>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>
                                {t("Discount")}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  color: "black",
                                }}
                              >
                                {discountType === "Percentage" ? "" : "$ "}
                                {discountType === "Percentage"
                                  ? discountedAmount
                                  : discountedAmount.toFixed(2)}
                                {discountType === "Percentage" ? "%" : ""}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>
                                {t("SubTotal")}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  color: "black",
                                }}
                              >
                                $ {total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {/* <div style={{display: 'flex', justifyContent: 'center'}}>
         <img src={CardImages} style={{width: '60%', height: 'auto'}} />
       </div> */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          ></div>
                        </Col>
                        <Col
                          className="d-flex flex-column align-items-left"
                          xs={12}
                          md={12}
                          style={{
                            paddingInline: "10%",
                            position: "relative",
                            backgroundColor: "white",
                            height: "100%",
                            overFlowY: "auto",
                            paddingBottom: "110px",
                            // padding:"50px"
                          }}
                        >
                          <Row
                            style={{ position: "absolute", top: 20, left: 50 }}
                          >
                            <Col
                              xl={12}
                              md={12}
                              sm={12}
                              style={{
                                // position: 'fixed',
                                // top: 0,
                                // left: 0,
                                width: "100%",
                                zIndex: 999,
                              }}
                            ></Col>
                          </Row>
                          <h1
                            style={{
                              fontSize: "18px",
                              color: "black",
                              fontWeight: 600,
                              marginBlock: "20px",
                            }}
                          >
                            {t("Enter Payment Details")}
                          </h1>
                          {loaderCards === true ? (
                            <h4>{t("Loading Please Wait")}...</h4>
                          ) : null}
                          <PaymentForm
                            priceId={total}
                            selectedPriceId={selectedPriceId}
                            emailD={email}
                            // previousStep={previousStep}
                            teamMembers={numberMembers}
                            SuccessData={(data) => {
                              if (data === true) {
                                //console.log('Payment Success');
                                setSuccessPayment(true);
                              }
                            }}
                            cards={cards}
                            recallCards={getUserCards}
                            billingInfo={billingInfo}
                            CustomerStripeId={CustomerStripeId}
                            coupon={coupon}
                            coupon_applied={coupon_applied}
                            billingInfoSet={(data) => {
                              //console.log('Data');
                              //console.log(data);
                              setBillingInfo(data);
                            }}
                          />
                        </Col>{" "}
                      </>
                    ) : (
                      <>
                        <Col
                          xs={12}
                          md={2}
                          // style={{ backgroundColor: "#f7f7f8" }}
                        >
                          <Row
                            style={{ position: "absolute", top: 20, left: 50 }}
                          >
                            <Col
                              xl={12}
                              md={12}
                              sm={12}
                              style={{
                                // position: 'fixed',
                                // top: 0,
                                // left: 0,
                                width: "100%",
                                zIndex: 999,
                              }}
                            >
                              <Row>
                                <Col
                                  xl={12}
                                  md={12}
                                  sm={12}
                                  style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    alignItems: "left",
                                    marginBlock: "0.2%",
                                    paddingInline: "2%",
                                  }}
                                >
                                  {/* back button
                                   */}
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CustomButton
                                      padding={true}
                                      useDefaultColor={true}
                                      size="sm"
                                      // disabled={saveLoading}
                                      color="primary"
                                      // disabled={downloadLoader}
                                      onClick={async () => {
                                        window.location.href = "/home";
                                      }}
                                      style={{
                                        display: "flex",
                                        boxShadow: "none",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                      className="btn-icon d-flex"
                                      text={
                                        <>
                                          {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                                          <span className="align-middle ms-25">
                                            {t("Back")}
                                          </span>
                                        </>
                                      }
                                    />

                                    <img
                                      src={
                                        // logoFromApi ||
                                        // logoFromLocalStorage ||
                                        //  logoURL
                                        logoRemoveBg
                                      }
                                      style={{
                                        width: "160px",
                                        height: "auto",
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                      }}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          className="d-flex flex-column align-items-left"
                          xs={12}
                          md={4}
                          style={{
                            // paddingInline: "10%",
                            position: "relative",
                            backgroundColor: "white",
                            height: "100%",
                            overFlowY: "auto",
                            paddingBottom: "110px",
                            // padding:"50px"
                          }}
                        >
                          <h1
                            style={{
                              fontSize: "24px",
                              color: "black",
                              fontWeight: 300,
                              marginBlock: "20px",
                              marginTop: "100px",
                            }}
                          >
                            {t("Add Billing Details")}
                          </h1>
                          {loaderCards === true ? (
                            <h4>{t("Loading Please Wait")}...</h4>
                          ) : null}
                          <PaymentForm
                            priceId={total}
                            selectedPriceId={selectedPriceId}
                            emailD={email}
                            // previousStep={previousStep}
                            teamMembers={numberMembers}
                            SuccessData={(data) => {
                              if (data === true) {
                                //console.log('Payment Success');
                                setSuccessPayment(true);
                              }
                            }}
                            cards={cards}
                            recallCards={getUserCards}
                            billingInfo={billingInfo}
                            CustomerStripeId={CustomerStripeId}
                            coupon={coupon}
                            coupon_applied={coupon_applied}
                            billingInfoSet={(data) => {
                              //console.log('Data');
                              //console.log(data);
                              setBillingInfo(data);
                            }}
                          />
                        </Col>
                        <Col
                          xs={12}
                          md={4}
                          style={{ backgroundColor: "#F8F3F0" }}
                        >
                          <div
                            style={{
                              // backgroundColor: '#f6f7f8',
                              // border: '1px solid #d6d6d6',
                              textAlign: "left",
                              borderRadius: "5px",
                              paddingInline: "10%",

                              marginTop: "100px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <h2
                                style={{
                                  // fontSize: "20px",
                                  // fontWeight: 600,
                                  // color: "black",
                                  fontSize: "24px",
                                  color: "black",
                                  fontWeight: 300,
                                }}
                              >
                                {t("Order Summary")}
                              </h2>

                              {/* <Badge color="success" pill > */}
                              {/* <div
                        style={{
                          backgroundColor: "#28c76f ",
                          color: "white",
                          padding: "5px",
                          borderRadius: "30px",
                          fontWeight: 600,
                          fontSize: "16px",
                        }}
                      >
                        {Lookup}
                      </div> */}
                              {/* <span >{Lookup}</span>
                  </Badge> */}
                            </div>

                            {/* <h4 style={{fontWeight: 500, color: 'black', fontSize: '18px'}}>Plan</h4> */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "16px",
                                  // color: "black",
                                  fontWeight: 400,
                                }}
                              >
                                {t("Plan Name")}
                                {/* {planName} */}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 400,
                                  color: "black",
                                }}
                              >
                                {planName}
                              </span>
                            </div>
                            {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{ fontSize: "16px", fontWeight: 400 }}
                              >
                                {t("Billing Period")}
                              </span>
                            
                              <select
                                value={Lookup}
                                style={{
                                  fontSize: "16px",
                                  padding: "3px",
                                  borderRadius: "5px",
                                  border: "1px solid lightGrey",
                                  cursor: "pointer",
                                  // width:'100%',
                                }}
                                onChange={(e) => {
                                  setLookup(e.target.value);
                                  const items = JSON.parse(
                                    localStorage.getItem("@selectedprice")
                                  );

                                  let local_lookup = e.target.value;
                                  if (items.priceId.type === "Team") {
                                    //console.log('biz');
                                    // setMin(2)
                                    // setNumberMembers(2)
                                    if (local_lookup === "monthly") {
                                      setAmount(items.priceId.monthly_price);
                                      setTotal(
                                        items.priceId.monthly_price *
                                          numberMembers
                                      );
                                    } else {
                                      setAmount(items.priceId.yearly_price);
                                      setTotal(
                                        items.priceId.yearly_price *
                                          numberMembers
                                      );
                                    }
                                  } else {
                                    // setMin(1)
                                    // setNumberMembers(1)
                                    if (local_lookup === "monthly") {
                                      setAmount(items.priceId.monthly_price);
                                      setTotal(
                                        items.priceId.monthly_price *
                                          numberMembers
                                      );
                                    } else {
                                      setAmount(items.priceId.yearly_price);
                                      setTotal(
                                        items.priceId.yearly_price *
                                          numberMembers
                                      );
                                    }
                                  }

                                  // Get the current @selectedprice object from localStorage
                                  const selectedPrice = JSON.parse(
                                    localStorage.getItem("@selectedprice")
                                  );

                                  // Update the duration value with the new value from the input
                                  if (selectedPrice) {
                                    selectedPrice.duration = e.target.value;

                                    // Save the updated object back to localStorage
                                    localStorage.setItem(
                                      "@selectedprice",
                                      JSON.stringify(selectedPrice)
                                    );
                                  }
                                  // change values
                                }}
                              >
                                <option
                                  value="monthly"
                                  style={{
                                    cursor: "pointer",
                                    padding: "3px",
                                    fontSize: "16px",
                                  }}
                                >
                                  {t("Monthly")}
                                </option>
                                <option value="yearly">{t("Yearly")}</option>
                              </select>

                             
                            </div> */}
                            <div
  style={{
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  }}
>
  <span
    style={{ fontSize: "16px", fontWeight: 600, marginBottom: "10px" }}
  >
    {t("Billing Option")}
  </span>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent:"space-between",
      gap: "20px",
    }}
  >
    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <input
        type="checkbox"
        checked={Lookup === "monthly"}
        onChange={() => {
          const items = JSON.parse(localStorage.getItem("@selectedprice"));

          if (Lookup !== "monthly") {
            setLookup("monthly");
            setAmount(items.priceId.monthly_price);
            setTotal(items.priceId.monthly_price * numberMembers);

            // Update localStorage with new duration
            const selectedPrice = JSON.parse(
              localStorage.getItem("@selectedprice")
            );
            if (selectedPrice) {
              selectedPrice.duration = "monthly";
              localStorage.setItem(
                "@selectedprice",
                JSON.stringify(selectedPrice)
              );
            }
          }
        }}
      />
      <span style={{fontSize:"16px"}}>
        {t("Monthly")} - ${localItem?.priceId?.monthly_price || "0"}
      </span>
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <input
        type="checkbox"
        checked={Lookup === "yearly"}
        onChange={() => {
          const items = JSON.parse(localStorage.getItem("@selectedprice"));

          if (Lookup !== "yearly") {
            setLookup("yearly");
            setAmount(items.priceId.yearly_price);
            setTotal(items.priceId.yearly_price * numberMembers);

            // Update localStorage with new duration
            const selectedPrice = JSON.parse(
              localStorage.getItem("@selectedprice")
            );
            if (selectedPrice) {
              selectedPrice.duration = "yearly";
              localStorage.setItem(
                "@selectedprice",
                JSON.stringify(selectedPrice)
              );
            }
          }
        }}
      />
      <span style={{fontSize:"16px"}}>
        {t("Yearly")}  - ${localItem?.priceId?.yearly_price || "0"}
      </span>
    </label>
  </div>
</div>


                            {/* {Lookup === "yearly" ? (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span style={{ fontSize: "16px" }}>
                                    {t("Monthly price")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                      color: "black",
                                    }}
                                  >
                                    $ {amountyear}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {t("Amount")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                      color: "black",
                                    }}
                                  >
                                    $ {amount}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {t("Amount")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                      color: "black",
                                    }}
                                  >
                                    $ {amount}
                                  </span>
                                </div>
                              </>
                            )} */}
                            <hr />

                            {planName === "Team" ? (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {t("Team Members")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 500,
                                      color: "black",
                                    }}
                                  >
                                    <Minus
                                      onClick={() => {
                                        const items = JSON.parse(
                                          localStorage.getItem("@selectedprice")
                                        );

                                        if (numberMembers > min) {
                                          const no = numberMembers - 1;

                                          if (Lookup === "monthly") {
                                            setAmount(
                                              items.priceId.monthly_price
                                            );
                                            setTotal(
                                              items.priceId.monthly_price * no
                                            );
                                          } else {
                                            setAmount(
                                              items.priceId.yearly_price
                                            );
                                            setTotal(
                                              items.priceId.yearly_price * no
                                            );
                                          }

                                          setNumberMembers(numberMembers - 1);
                                          // setTotal(amount * no);
                                        }
                                      }}
                                      size={20}
                                      style={{
                                        backgroundColor: "#23b3e8",
                                        color: "white",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                    />
                                    <input
                                      value={numberMembers}
                                      onChange={(e) => {
                                        // setNumberMembers(e.target.value);
                                        // const no = e.target.value;
                                        // setTotal(amount * no);
                                        const inputValue = parseInt(
                                          e.target.value,
                                          10
                                        );

                                        if (
                                          inputValue >= 2 &&
                                          inputValue <= 49
                                        ) {
                                          // Ensure the input stays in range
                                          setNumberMembers(inputValue);
                                          setTotal(amount * inputValue);
                                        }
                                      }}
                                      type="number"
                                      id="quantity"
                                      name="quantity"
                                      min="1"
                                      style={{
                                        marginInline: "10px",
                                        width: "50px",
                                        borderRadius: "5px",
                                        border: "1px solid lightGrey",
                                        textAlign: "center",
                                      }}
                                    />
                                    <Plus
                                      onClick={() => {
                                        const items = JSON.parse(
                                          localStorage.getItem("@selectedprice")
                                        );

                                        if (numberMembers < max_user) {
                                          // } else {
                                          setNumberMembers(numberMembers + 1);
                                          const no = numberMembers + 1;
                                          // setTotal(amount * no);
                                          if (Lookup === "monthly") {
                                            setAmount(
                                              items.priceId.monthly_price
                                            );
                                            setTotal(
                                              items.priceId.monthly_price * no
                                            );
                                          } else {
                                            setAmount(
                                              items.priceId.yearly_price
                                            );
                                            setTotal(
                                              items.priceId.yearly_price * no
                                            );
                                          }
                                        }
                                      }}
                                      size={20}
                                      style={{
                                        backgroundColor: "#23b3e8",
                                        color: "white",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </span>
                                </div>
                                {/* team Members end */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {t("Total Amount")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                      color: "black",
                                    }}
                                  >
                                    $ {amount}/user/
                                    {Lookup === "yearly" ? "year" : "month"}
                                  </span>
                                </div>
                                {/* <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {t("Tax Amount")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: 400,
                                      color: "black",
                                    }}
                                  >
                                    $ 0
                                  </span>
                                </div> */}
                                <hr />{" "}
                              </>
                            ) : null}
                            <span
                              style={{
                                fontSize: "16px",
                                color: "black",
                                fontWeight: 400,
                              }}
                            >
                              {t("Apply Referal Code")}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <Input
                                disabled={coupon_applied}
                                value={coupon}
                                onChange={(e) => {
                                  setCoupon(e.target.value);
                                }}
                                style={{
                                  fontSize: "16px",
                                  padding: "3px",
                                  width: "100%",
                                  boxShadow: "none",

                                  borderRadius: "5px",
                                  textAlign: "center",
                                  border: "1px solid lightGrey",
                                  cursor: "pointer",
                                  // width:'100%',
                                }}
                                placeholder="Enter Referal Code"
                              />
                              {coupon_applied ? null : (
                                <CustomButton
                                  padding={true}
                                  disabled={couponLoader}
                                  useDefaultColor={true}
                                  size="sm"
                                  // disabled={saveLoading}
                                  color="primary"
                                  // disabled={downloadLoader}
                                  onClick={async () => {
                                    if (coupon === "") {
                                    } else {
                                      await validateCoupon();
                                    }

                                    // window.location.href = "/home";
                                  }}
                                  style={{
                                    marginLeft: "10px",
                                    display: "flex",
                                    boxShadow: "none",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  className="btn-icon d-flex"
                                  text={
                                    <>
                                      {couponLoader ? (
                                        <Spinner color="white" size="sm" />
                                      ) : null}
                                      <span className="align-middle ms-25">
                                        {t("Apply")}
                                      </span>
                                    </>
                                  }
                                />
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {errorCoupon ? (
                                <p
                                  style={{
                                    color: "red",
                                    fontSize: "14px",
                                    marginBlock: "5px",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  {errorMessage}
                                </p>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>
                                {t("Discount")}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 400,
                                  color: "black",
                                }}
                              >
                                {discountType === "Percentage" ? "" : "$ "}
                                {discountType === "Percentage"
                                  ? discountedAmount
                                  : discountedAmount.toFixed(2)}
                                {discountType === "Percentage" ? "%" : ""}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>
                                {t("Subtotal")}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 400,
                                  color: "black",
                                }}
                              >
                                $ {total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {/* <div style={{display: 'flex', justifyContent: 'center'}}>
                <img src={CardImages} style={{width: '60%', height: 'auto'}} />
              </div> */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          ></div>
                        </Col>{" "}
                        <Col xs={12} md={2}></Col>
                      </>
                    )}
                  </Row>
                </Elements>
              </>
            )}
          </>
        )}
      </div>{" "}
    </>
  );
};

export default StripeCheckout;
