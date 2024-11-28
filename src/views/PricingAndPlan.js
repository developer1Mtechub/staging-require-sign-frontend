import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
  UncontrolledTooltip,
} from "reactstrap";
import { BASE_URL, get, post, postFormData, put } from "../apis/api";
import "react-phone-input-2/lib/bootstrap.css";
import "./StylesheetPhoneNo.css";

import getUserLocation from "../utility/IpLocation/GetUserLocation";
import BillingTabContent from "../components/account-settings/BillingTabContent";
import BillingHistory from "../components/account-settings/BillingHistory";
import SpinnerCustom from "../components/SpinnerCustom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { decrypt } from "../utility/auth-token";
import { getUser, selectPrimaryColor } from "../redux/navbar";
import FreeTrialAlert from "../components/FreeTrailAlert";
const PricingAndPlan = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const primary_color = useSelector(selectPrimaryColor);

  const {
    user,
    plan,
    subscription,
    isSubscripitonActive,
    isFreeTrialExpired,
    daysLeftExpiredfreePlan,
    docuemntsCount,
    status,
    error,
  } = useSelector((state) => state.navbar);
  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Payment Methods");

  const handleItemClick = (item, id) => {
    toggle(id);
    setSelectedItem(item);
  };

  const [customerIdStripe, setCustomerIdStripe] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userCards, setUserCards] = useState(null);
  const [billingDetails, setBillingDetails] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [percentageRemaining, setPercentageRemaining] = useState(0);
  const [differenceInDays, setDifferenceInDays] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loaderData, setLoaderData] = useState(true);
  const [referalCodes, setReferalCodes] = useState([]);

  const fetchData1 = async () => {
    const apiData1 = await get('pricing/get_all_pricing'); // Specify the endpoint you want to call
    console.log('----------Navbar -------------');

    console.log(apiData1);
    if (apiData1.error) {
      // toastAlert('error', apiData1.message);
    } else {
      // toastAlert('success', apiData1.message);
      // const freeItems = apiData1.result.filter(item => item.type === 'FREE');
      setReferalCodes(apiData1.result);
    }
  };
  const getUserPlan = async () => {
    //console.log(items?.token?.user_id);
    // setemail(items?.token?.email);
    // //console.log('Navbar');
    // //console.log('User Profile Signature UPGRADE SECTION');
    const postData = {
      user_id: user?.user_id,
    };
    const apiData = await post("plan/get_user_plan", postData); // Specify the endpoint you want to call
    console.log("USER PLAN GET ...");
    console.log("USER PLAN GET ...");

    console.log(apiData);

    if (apiData.error) {
      // toastAlert("error", "")
      setLoaderData(false);

    } else {
      console.log(apiData);
      if (apiData.result.length === 0) {
        setLoaderData(false);
      } else {
        setCustomerIdStripe(apiData?.result[0]?.stripe_customer_id);
        setSelectedPlan(apiData?.result[0]);
        setUserCards(apiData?.cards);
        setBillingDetails(apiData?.billingDetails[0]);
        setPlanDetails(apiData?.planDetails);
        setTotalDays(apiData?.totalDays);
        setDifferenceInDays(apiData?.differenceInDays);
        setPercentageRemaining(apiData?.percentageRemaining);
        setTransactionHistory(apiData?.TransactionHistory);
        setLoaderData(false);
      }
    }
  };
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  // useEffect(() => {
  //   const fetchDataAsync = async () => {
  //     await getUserPlan();
  //     await getLocatinIPn();
  //   };

  //   fetchDataAsync();
  // }, []);
  const [daysleftExpired,setdaysleftExpired]=useState(0)
  const [freeTrailExpiredAlert, setFreeTrailExpiredAlert] = useState(false);

  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            getUserPlan(),
          //   fetchAllFiles(StatusData),
            fetchData1(),
          //   fetchAllCardsDashboard(),
          //   fetchAllFoldersForModalMove(),
          ]);
          console.log("REDUC SH ~HOMe");

          console.log("PLAN DATA ");
  //         console.log(isFreeTrialExpired);
  //         if (isFreeTrialExpired === "true" || isFreeTrialExpired === true) {
  //           console.log("FREE TRIAl TRUE");
  //           setFreeTrailExpiredAlert(true);
         

      
  //         } else {
  //           setFreeTrailExpiredAlert(true);
  //           console.log("dfgdfgdg")
  //           console.log(daysLeftExpiredfreePlan)
  // setdaysleftExpired(daysLeftExpiredfreePlan);

  //         }
          console.log(docuemntsCount);
          setLoaderData(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoaderData(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, status]);
  // useEffect(() => {
  //   const encryptedData = localStorage.getItem("user_data");
  //   console.log("encryptedData");

  //   console.log(encryptedData);
  //   if (encryptedData) {
  //     try {
  //       const decryptedData = JSON.parse(decrypt(encryptedData));
  //       const { token, user_id } = decryptedData;
  //       console.log(decryptedData);

  //       // Fetch user data if not already available in Redux state
  //       if (token && user_id && !user) {
  //         dispatch(getUser({ user_id, token }));
  //       }
  //     } catch (error) {
  //       console.error("Error processing token data:", error);
  //     }
  //   }
  // }, [dispatch, user]);
  return (
    <div>
       {/* {freeTrailExpiredAlert ? (
        <> */}
        
              <FreeTrialAlert  isSubscripitonActive={isSubscripitonActive} subscription={subscription} isFreeTrialExpired={isFreeTrialExpired} daysleftExpired={daysLeftExpiredfreePlan}/>
        {/* </>
      ) : null} */}
      {/* <div style={{backgroundColor:"red",color:"white",display:"flex",
            justifyContent:"center",marginBottom:"10px"
          }}>Under-Development</div> */}
      <Row>
        <Col md="12" xs="12" className="d-flex justify-content-between">
          <h1 style={{ fontSize: "18px", marginTop: "10px" }}>
            {t("Subscription & Plan")}
          </h1>
        </Col>
        <Col xs={12} md={12} style={{ padding: "10px" }}>
          <Card>
            <CardBody>
              {loaderData ? (
                <div style={{ padding: "20px" }}>
                  <SpinnerCustom
                    color="primary"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                </div>
              ) : (
                <Row>
                  <Col
                    md="12"
                    xs="12"
                    // style={{display: 'flex', justifyContent: 'left'}}
                  >
                    {window.innerWidth < 760 ? (
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <DropdownToggle caret>{selectedItem}</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            active={active === "1"}
                            onClick={() =>
                              handleItemClick("Payment Methods", "1")
                            }
                          >
                            {t("Payment Methods")}
                          </DropdownItem>
                          <DropdownItem
                            active={active === "2"}
                            onClick={() =>
                              handleItemClick("Transaction History", "2")
                            }
                          >
                            {t("Transaction History")}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    ) : (
                      <Nav
                        // tabs
                        className="nav-center"
                        horizontal
                        style={{
                         

                          textAlign: "left",
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <NavItem>
                          <NavLink
                           style={
                            active === "1"
                              ? {
                                  color: primary_color,
                                  borderBottom: `3px solid ${primary_color}`,
                                  fontSize: "16px",
                                }
                              : { fontSize: "16px" }
                          }
                            active={active === "1"}
                            onClick={() => {
                              toggle("1");
                            }}
                          >
                            {t("Payment Methods")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink  style={
                          active === "2"
                            ? {
                                color: primary_color,
                                borderBottom: `3px solid ${primary_color}`,
                                fontSize: "16px",
                              }
                            : { fontSize: "16px" }
                        }
                            active={active === "2"}
                            onClick={() => {
                              toggle("2");
                            }}
                          >
                            {t("Transaction History")}
                          </NavLink>
                        </NavItem>
                      </Nav>
                    )}
                  </Col>
                  <Col md="12" xs="12" style={{ padding: "10px" }}>
                    <TabContent className="py-50" activeTab={active}>
                      <TabPane tabId="1">
                        {/* <h2>Payment Methods</h2> */}
                        <BillingTabContent
                          percentageRemaining={percentageRemaining}
                          stripe_customer_id={customerIdStripe}
                          recallCards={() => getUserPlan()}
                          selectedPlan={selectedPlan}
                          referalCodes={referalCodes}
                          userCards={userCards}
                          billingDetails={billingDetails}
                          planDetails={planDetails}
                          locationIP={locationIP}
                          totalDays={totalDays}
                          differenceInDays={differenceInDays}
                        />
                      </TabPane>
                      <TabPane tabId="2">
                        <BillingHistory
                          transactionHistory={transactionHistory}
                        />
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PricingAndPlan;
