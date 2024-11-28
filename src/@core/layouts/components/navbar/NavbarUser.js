// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";
// ** Third Party Components
import { Sun, Moon, ArrowUpCircle, X, Edit2 } from "react-feather";
import * as Yup from "yup";
// ** Reactstrap Imports
import {
  Button,
  ButtonGroup,
  NavLink,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import { useEffect, useState } from "react";
import useLogo from "@uselogo/useLogo";

import ModalConfirmationPlan from "../../../../components/ModalConfirmationPlan";
import { useTranslation } from "react-i18next";
import IntlDropdown from "@layouts/components/navbar/IntlDropdown";
import { useDispatch } from "react-redux";
import { decrypt } from "../../../../utility/auth-token";
import { getUser,selectUser,selectSubscription,selectPlan,selectCompanyProfile ,selectIsFreeTrialExpired,selectDaysLeftExpiredfreePlan,selectIsSubscriptionActive, selectLoading} from "../../../../redux/navbar";
import { useSelector } from "react-redux";
import { get } from "../../../../apis/api";
import IntlDropdownSx from "./IntlDropdownSx";

const NavbarUser = (props) => {
  const { skin, setSkin } = props;
  const [referalCodes, setReferalCodes] = useState([]);
  const [company_user_Logged_User, setCompany_User_Logged_User] =
  useState(null);
const [company_admin_Logged_User, setCompany_Admin_Logged_User] =
  useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const {
  //   user,
  //   plan,
  //   status,
  //   error,
  //   company_profile,
  //   loading,
  //   isFreeTrialExpired,
  //   daysLeftExpiredfreePlan,
  //   isSubscripitonActive,
  // } = useSelector((state) => state.navbar);
  const user = useSelector(selectUser);
  const subscription = useSelector(selectSubscription);
  const plan = useSelector(selectPlan);
  const loading = useSelector(selectLoading);
  const company_profile = useSelector(selectCompanyProfile);
  const isFreeTrialExpired = useSelector(selectIsFreeTrialExpired);
  const daysLeftExpiredfreePlan = useSelector(selectDaysLeftExpiredfreePlan);
  const isSubscripitonActive = useSelector(selectIsSubscriptionActive);
  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    return (
      <>
        {skin === "dark" ? (
          <Sun className="ficon" size={20} onClick={() => setSkin("light")} />
        ) : (
          <Moon className="ficon" size={20} onClick={() => setSkin("dark")} />
        )}
      </>
    );
  };
  const [completeProfile, setCompleteProfile] = useState(false);
  // const fetchData1 = async () => {
  //   const apiData1 = await get("pricing/get_all_pricing"); // Specify the endpoint you want to call
  //   console.log("----------Navbar -------------");

  //   console.log(apiData1);
  //   if (apiData1.error) {
  //     // toastAlert('error', apiData1.message);
  //   } else {
  //     // toastAlert('success', apiData1.message);
  //     // const freeItems = apiData1.result.filter(item => item.type === 'FREE');
  //     setReferalCodes(apiData1.result);
  //   }
  // };
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
  //         // fetchData1();
  //       }
  //     } catch (error) {
  //       console.error("Error processing token data:", error);
  //     }
  //   }
  // }, [dispatch, user]);
  useEffect(() => {
    const fetchData1 = async () => {
      const apiData1 = await get("pricing/get_all_pricing");
      if (!apiData1.error) {
        setReferalCodes(apiData1.result);
      } else {
        console.error("Error fetching referral codes:", apiData1.message);
      }
    };

    if (user) {
      fetchData1();
      setCompany_User_Logged_User(user?.company_user)
      setCompany_Admin_Logged_User(user?.company_admin)
    }
  }, [user]);
  return (
    <>
     {window.innerWidth < 786?null:<h1 style={{ color: "black", fontWeight: 600, margin: "10px" }}>
        {loading ? null : company_profile?.company_name}
      </h1>} 
      <ul className="nav navbar-nav align-items-center ms-auto d-flex">
        {/* not shown when plan other than FREE  */}
        {company_user_Logged_User === true ||
        (company_user_Logged_User === "true" &&
          company_admin_Logged_User === null) ? null :   <>{isSubscripitonActive ? null : (
          <>
            {window.innerWidth < 786 ? (
              <Button
                onClick={() => {
                  setCompleteProfile(true);
                }}
                style={{ boxShadow: "none", marginRight: "10px" }}
                color="success"
                size="sm"
              >
                <ArrowUpCircle size={20} />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  console.log("isFreeTrialExpired", isFreeTrialExpired);
                  console.log(
                    "daysLeftExpiredfreePlan",
                    daysLeftExpiredfreePlan
                  );
                  console.log("isSubscripitonActive", isSubscripitonActive);

                  setCompleteProfile(true);
                }}
                style={{ boxShadow: "none", marginRight: "10px" }}
                color="success"
              >
                <ArrowUpCircle size={20} />
                <span
                  className="align-middle ms-25"
                  style={{ fontSize: "14px" }}
                >
                  {(() => {
                    if (
                      isFreeTrialExpired === false &&
                      isSubscripitonActive === false
                    ) {
                      // Free trial is still active, show days left
                      return `${t(
                        "Free Trial"
                      )} - ${daysLeftExpiredfreePlan} ${t("Days Left")}`;
                    } else if (isFreeTrialExpired && isSubscripitonActive) {
                      // Free trial is expired, but subscription is active, show subscription days left
                      return `${t(
                        "Subscription"
                      )} - ${daysLeftExpiredfreePlan} ${t("Days Left")}`;
                    } else if (isFreeTrialExpired && !isSubscripitonActive) {
                      // Both free trial and subscription are expired
                      return t("UPGRADE PLAN");
                    }
                  })()}
                </span>
              </Button>
            )}
          </>
        )}
</>}
        {window.innerWidth < 786 ? <IntlDropdownSx /> : <IntlDropdown />}

        {/* <NavLink className="nav-link-style">
          {window.innerWidth < 786 ? null : <ThemeToggler />}
        </NavLink> */}
        <UserDropdown />
      </ul>

      <ModalConfirmationPlan
        planAll={referalCodes}
        isOpen={completeProfile}
        toggleFunc={() => setCompleteProfile(!completeProfile)}
      />
    </>
  );
};
export default NavbarUser;
