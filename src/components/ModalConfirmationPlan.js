import { CheckCircle, X, XCircle, Minus, Plus } from "react-feather";
import "./ImageCropper.css";
// ** Steps

import logoRemoveBg from "@assets/images/pages/logoRemoveBg.png";
import {
  Col,
  Input,
  Modal,
  ModalBody,
  Row,
  UncontrolledTooltip,
} from "reactstrap";

import { useEffect, useRef, useState } from "react";
// ** Custom Components
import Wizard from "@components/wizard";
import PricingCards from "../views/PricingCards";
import { get, post } from "../apis/api";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { decrypt } from "../utility/auth-token";
import { useSelector } from "react-redux";
import { getUser } from "../redux/navbar";
import ModalConfirmationAlert from "./ModalConfirmationAlert";
import toastAlert from "@components/toastAlert";

const ModalConfirmationPlan = ({ planAll, isOpen, toggleFunc }) => {
  const [duration, setDuration] = useState("yearly");
  const dispatch = useDispatch();
  const [numberMembers, setNumberMembers] = useState(2);
  const [total, setTotal] = useState(0);
  const [max_user, setMaxUser] = useState(0);
  const [amount, setAmount] = useState(null);
  const [min, setMin] = useState(2);

  const [planidfree, setplanIdfree] = useState(null);
  const [confirmationfreePlan, setconfirmationfreePlan] = useState(false);
  const [loadingConfirmation, setloadingConfirmation] = useState(false);
  const {
    user,
    plan,
    subscription,
    status,
    error,
    isFreeTrialExpired,
    daysLeftExpiredfreePlan,
    isSubscripitonActive,
  } = useSelector((state) => state.navbar);

  const onChange = (e) => {
    if (e.target.checked) {
      setDuration("yearly");
    } else {
      setDuration("monthly");
    }
  };

  const [active, setActive] = useState("1");
  const availFreePlan = async () => {
    setloadingConfirmation(true);

    const postData = {
      user_id: user?.user_id,
      pricing_id: planidfree,
      members: numberMembers,
    };
    try {
      const apiData = await post("user/upgradeToFree", postData); // Specify the endpoint you want to call
      console.log("GET Files BY USER ID ");
      console.log(apiData);

      if (apiData.error === true || apiData.error === "true") {
        setconfirmationfreePlan(false);
        toastAlert("error", apiData.message);
      } else {
        toastAlert("success", apiData.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const { t } = useTranslation();

  // ** State
  const [selectedPlan, setSelectedPlan] = useState(null);
  useEffect(() => {
    if (status === "succeeded") {
      console.log("plansdjhb");
      console.log(plan);
      setSelectedPlan(plan);
      console.log(subscription);
      console.log(planAll);
    }
  }, [user, status, plan]);
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

  //   fetchData1();
  //   getUserSignature();
  //   checkProfileCompleted();
  // }, []);
  return (
    <>
      <Modal
        className={"modal-dialog-centered modal-fullscreen"}
        isOpen={isOpen}
        toggle={toggleFunc}
        centered
      >
        <ModalBody>
          {/* <div style={{backgroundColor:"red",color:"white",display:"flex",
            justifyContent:"center"
          }}>Under-Development</div> */}
          <div
            style={{
              display: " flex",
              justifyContent: "space-between",
              marginTop: "1%",
            }}
          >
            <img
              src={logoRemoveBg}
              alt="logo"
              style={{ width: "200px", height: "auto" }}
            />
            <X
              id="positionLeft"
              size={26}
              onClick={toggleFunc}
              style={{ cursor: "pointer" }}
            />
            <UncontrolledTooltip placement="top" target="positionLeft">
              {t("Close")}
            </UncontrolledTooltip>
          </div>
          <Row>
            <Col xs={12}>
              <div className="pricing-plans">
                <h2 className="header">{t("Pricing Plans")}</h2>
                <h3
                  className="subheader"
                  style={{
                    fontWeight: 600,
                    marginBlock: "5px",
                    marginBottom: "10px",
                  }}
                >
                  {t("Pick a plan to continue using")} RequireSign
                </h3>
                <div
                  className="d-flex align-items-center justify-content-center pb-2"
                  sgtyle={{ margin: 0, padding: 0 }}
                >
                  <h3 className="me-50 mb-0">{t("Monthly")}</h3>
                  <div className="form-switch">
                    <Input
                      id="plan-switch"
                      type="switch"
                      checked={duration === "yearly"}
                      onChange={onChange}
                    />
                  </div>
                  <h3 className="ms-50 mb-0">{t("Yearly")}</h3>
                </div>
                {window.innerWidth < 730 ? (
                  <>
                    {planAll === null || planAll === undefined ? null : (
                      <>
                        {" "}
                        {planAll.map((plan) => (
                          <table
                            className="pricing-table"
                            style={{ marginBottom: "10px" }}
                          >
                            <thead>
                              <tr>
                                <th
                                  colSpan="2"
                                  className="header-plan-name"
                                  key={plan.pricing_id}
                                >
                                  {plan.name}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Team Size Row */}
                              <tr>
                                <td>
                                  <strong className="bold-column">
                                    {t("Team Size")}
                                  </strong>
                                </td>
                                <td
                                  className="table-fonts"
                                  key={`team_size_${plan.pricing_id}`}
                                >
                                  {plan.team_size} User
                                  {plan.team_size > 1 ? "s (minimum)" : ""}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong className="bold-column">
                                    {t("Price")}
                                  </strong>
                                </td>
                                {plan.name === "Team" ? (
                                  <td
                                    className="table-fonts"
                                    key={`price_${plan.pricing_id}`}
                                  >
                                    {duration === "monthly" ? (
                                      <>
                                        {plan.monthly_price ===
                                        "Not Available" ? (
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            {plan.monthly_price * numberMembers}
                                          </span>
                                        ) : (
                                          <span>
                                            {" "}
                                            $
                                            {plan.monthly_price *
                                              numberMembers}{" "}
                                            /month per user{" "}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span style={{ fontSize: "15px" }}>
                                          {" "}
                                          $
                                          {
                                            plan.monthly_price_year
                                            //  *
                                            //   numberMembers
                                          }
                                          /month per user{" "}
                                        </span>
                                        <br />

                                        <span
                                          style={{ color: "rgb(22, 98, 167)" }}
                                        >
                                          {" "}
                                          ${plan.yearly_price * numberMembers} (
                                          {t("billed annually")})
                                        </span>
                                      </>
                                    )}
                                  </td>
                                ) : (
                                  <td
                                    className="table-fonts"
                                    key={`price_${plan.pricing_id}`}
                                  >
                                    {duration === "monthly" ? (
                                      <>
                                        {plan.monthly_price ===
                                        "Not Available" ? (
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            {plan.monthly_price}
                                          </span>
                                        ) : (
                                          <span>
                                            {" "}
                                            ${plan.monthly_price} /month per
                                            user{" "}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span style={{ fontSize: "15px" }}>
                                          {" "}
                                          ${plan.monthly_price_year} /month per
                                          user{" "}
                                        </span>
                                        <br />

                                        <span
                                          style={{ color: "rgb(22, 98, 167)" }}
                                        >
                                          {" "}
                                          ${plan.yearly_price} (
                                          {t("billed annually")})
                                        </span>
                                      </>
                                    )}
                                  </td>
                                )}
                              </tr>
                              <tr>
                                <td></td>
                                <td
                                  className="table-fonts"
                                  key={`cta_${plan.pricing_id}`}
                                >
                                  {plan.name === "Enterprise" ||
                                  plan.name === "On-Prem Hosting" ? (
                                    <button
                                      size="sm"
                                      style={{
                                        height: "30px",
                                        width: "120px",
                                        padding: 0,
                                      }}
                                      onClick={() => {
                                        // Handle contact us action, e.g., opening a contact form or mailto link
                                        window.location.href = "/contact_us";
                                      }}
                                      className="cta-button"
                                    >
                                      {t("Contact sales")}
                                    </button>
                                  ) : (
                                    <>
                                      {plan?.pricing_id ===
                                        selectedPlan?.pricing_id &&
                                      isFreeTrialExpired ? (
                                        <>
                                          <button
                                            disabled={true}
                                            size="sm"
                                            style={{
                                              height: "30px",
                                              width: "130px",
                                              padding: 0,
                                              backgroundColor: "rgb(0, 190, 0)",
                                            }}
                                            // disabled={!isFreeTrialExpired}
                                            onClick={() => {
                                              localStorage.setItem(
                                                "@selectedprice",
                                                JSON.stringify({
                                                  priceId: plan?.pricing_id,
                                                  duration: duration,
                                                  email: user?.email,
                                                })
                                              );
                                              window.location.href =
                                                "/stripe_checkout";
                                            }}
                                            // onClick={() => {
                                            //   localStorage.setItem(
                                            //     "@selectedprice",
                                            //     JSON.stringify({ priceId: planc, duration: duration, email: user?.email })
                                            //   );
                                            //   window.location.href = "/stripe_checkout";
                                            // }}
                                            className="cta-button"
                                          >
                                            {t("Subscribed")}
                                          </button>{" "}
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              padding: 0,
                                            }}
                                          >
                                            {plan?.name === "Professional" ? (
                                              <div
                                                style={{ height: "30px" }}
                                              ></div>
                                            ) : (
                                              <span
                                                style={{
                                                  fontSize: "18px",
                                                  fontWeight: 500,
                                                  color: "black",
                                                }}
                                              >
                                                <Minus
                                                  onClick={() => {
                                                    if (numberMembers > min) {
                                                      const no =
                                                        numberMembers - 1;
                                                      setNumberMembers(
                                                        numberMembers - 1
                                                      );
                                                      setTotal(amount * no);
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
                                                    setNumberMembers(
                                                      e.target.value
                                                    );
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
                                                    border:
                                                      "1px solid lightGrey",
                                                    textAlign: "center",
                                                  }}
                                                />
                                                <Plus
                                                  onClick={() => {
                                                    if (
                                                      numberMembers === max_user
                                                    ) {
                                                    } else {
                                                      setNumberMembers(
                                                        numberMembers + 1
                                                      );
                                                      const no =
                                                        numberMembers + 1;
                                                      setTotal(amount * no);
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
                                            )}
                                            {selectedPlan?.name === "Team" &&
                                            plan?.name === "Professional" ? (
                                              <div>-</div>
                                            ) : (
                                              <button
                                                size="sm"
                                                style={{
                                                  height: "30px",
                                                  width: "130px",
                                                  padding: 0,
                                                }}
                                                onClick={() => {
                                                  if (
                                                    plan?.name ===
                                                    "Professional"
                                                  ) {
                                                    localStorage.setItem(
                                                      "@selectedprice",
                                                      JSON.stringify({
                                                        priceId: plan,
                                                        team_size: 1,
                                                        duration: duration,
                                                        email: user?.email,
                                                      })
                                                    );
                                                    window.location.href =
                                                      "/stripe_checkout";
                                                  } else {
                                                    localStorage.setItem(
                                                      "@selectedprice",
                                                      JSON.stringify({
                                                        priceId: plan,
                                                        team_size:
                                                          numberMembers,
                                                        duration: duration,
                                                        email: user?.email,
                                                      })
                                                    );
                                                    window.location.href =
                                                      "/stripe_checkout";
                                                  }
                                                }}
                                                className="cta-button"
                                              >
                                                {t("Subscribe Now")}
                                              </button>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                                  <br />
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong className="bold-column">
                                    {t("Free Trial")}
                                  </strong>
                                </td>
                                <td
                                  className="table-fonts"
                                  key={`cta_${plan.pricing_id}`}
                                >
                                  {plan?.free_trial ? (
                                    <>
                                      {plan?.pricing_id ===
                                      selectedPlan?.pricing_id ? (
                                        <span
                                          style={{
                                            color: "rgb(0, 190, 0)",
                                            fontWeight: 700,
                                          }}
                                        >
                                          {(() => {
                                            if (
                                              isFreeTrialExpired === false &&
                                              isSubscripitonActive === false
                                            ) {
                                              // Free trial is still active, show days left
                                              return (
                                                <>
                                                  {t("Free Trial")} <br />
                                                  {daysLeftExpiredfreePlan}{" "}
                                                  {t("Days Left")}
                                                </>
                                              );
                                            } else if (
                                              isFreeTrialExpired &&
                                              isSubscripitonActive
                                            ) {
                                              // Free trial is expired, but subscription is active, show subscription days left
                                              return `  ${t(
                                                "Free 30-Day trial"
                                              )}`;
                                            } else if (
                                              isFreeTrialExpired &&
                                              !isSubscripitonActive
                                            ) {
                                              // Both free trial and subscription are expired
                                              return t("UPGRADE PLAN");
                                            }
                                          })()}
                                        </span>
                                      ) : (
                                        <>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              padding: 0,
                                            }}
                                          >
                                            {selectedPlan?.name === "Team" ? (
                                              <div>-</div>
                                            ) : (
                                              <>
                                                <span
                                                  style={{
                                                    color: "rgb(0, 190, 0)",
                                                    fontWeight: 700,
                                                  }}
                                                >
                                                  {t(
                                                    `Free ${daysLeftExpiredfreePlan}-Day trial`
                                                  )}
                                                </span>{" "}
                                                <span
                                                  style={{
                                                    fontSize: "18px",
                                                    fontWeight: 500,
                                                    color: "black",
                                                  }}
                                                >
                                                  <Minus
                                                    onClick={() => {
                                                      if (numberMembers > min) {
                                                        const no =
                                                          numberMembers - 1;
                                                        setNumberMembers(
                                                          numberMembers - 1
                                                        );
                                                        setTotal(amount * no);
                                                      }
                                                    }}
                                                    size={20}
                                                    style={{
                                                      backgroundColor:
                                                        "#23b3e8",
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
                                                      setNumberMembers(
                                                        e.target.value
                                                      );
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
                                                      border:
                                                        "1px solid lightGrey",
                                                      textAlign: "center",
                                                    }}
                                                  />
                                                  <Plus
                                                    onClick={() => {
                                                      if (
                                                        numberMembers ===
                                                        max_user
                                                      ) {
                                                      } else {
                                                        setNumberMembers(
                                                          numberMembers + 1
                                                        );
                                                        const no =
                                                          numberMembers + 1;
                                                        setTotal(amount * no);
                                                      }
                                                    }}
                                                    size={20}
                                                    style={{
                                                      backgroundColor:
                                                        "#23b3e8",
                                                      color: "white",
                                                      width: "30px",
                                                      height: "30px",
                                                      borderRadius: "5px",
                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                </span>
                                                <div>
                                                  <button
                                                    size="sm"
                                                    style={{
                                                      height: "30px",
                                                      width: "110px",

                                                      padding: 0,
                                                      backgroundColor:
                                                        "rgb(0, 190, 0)",
                                                    }}
                                                    onClick={async () => {
                                                      console.log(
                                                        "Free traisl active user"
                                                      );
                                                      setplanIdfree(
                                                        plan.pricing_id
                                                      );

                                                      setconfirmationfreePlan(
                                                        true
                                                      );
                                                    }}
                                                    className="cta-button"
                                                  >
                                                    {t("Try for Free")}
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <span
                                      style={{
                                        color: "red",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {t("Trial not available")}
                                    </span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong className="bold-column">
                                    {t("Documents Included")}
                                  </strong>
                                </td>
                                <td
                                  className="table-fonts"
                                  key={`documents_${plan.pricing_id}`}
                                >
                                  {plan.document_limit}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong className="bold-column">
                                    {t("Templates")}
                                  </strong>
                                </td>
                                <td
                                  className="table-fonts"
                                  key={`templates_${plan.pricing_id}`}
                                >
                                  {plan.template_count}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong className="bold-column">
                                    {t("Public Forms")}
                                  </strong>
                                </td>
                                <td
                                  className="table-fonts"
                                  key={`public_forms_${plan.pricing_id}`}
                                >
                                  {plan.public_forms_count}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong className="bold-column">
                                    {t("Branding")}
                                  </strong>
                                </td>
                                <td
                                  className="table-fonts"
                                  key={`branding_${plan.pricing_id}`}
                                >
                                  {plan.branding ? (
                                    <CheckCircle style={{ color: "green" }} />
                                  ) : (
                                    <XCircle style={{ color: "red" }} />
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong className="bold-column">
                                    {t("Web Address")}
                                  </strong>
                                </td>
                                <td
                                  className="table-fonts"
                                  key={`web_address_${plan.pricing_id}`}
                                >
                                  {plan.custom_web_address ? (
                                    <>
                                      {plan.name === "Team" ? (
                                        <h3>{t("Subdomain Only")}</h3>
                                      ) : (
                                        <h3>{t("Your Domain")}</h3>
                                      )}
                                      {/* <CheckCircle style={{ color: "green" }} /> */}
                                    </>
                                  ) : (
                                    <XCircle style={{ color: "red" }} />
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* <div className="plan-table"> */}
                    {planAll === null || planAll === undefined ? null : (
                      <table className="pricing-table">
                        <thead>
                          <tr>
                            <th></th>{" "}
                            {/* Empty header for the leftmost column */}
                            {planAll.map((plan) => (
                              <th
                                className="header-plan-name"
                                key={plan.pricing_id}
                              >
                                {plan.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Team Size Row */}
                          <tr>
                            <td>
                              <strong className="bold-column">
                                {t("Team Size")}
                              </strong>
                            </td>
                            {planAll.map((plan) => (
                              <td
                                className="table-fonts"
                                key={`team_size_${plan.pricing_id}`}
                              >
                                {plan.team_size} User
                                {plan.team_size > 1 ? "s (minimum)" : ""}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td>
                              <strong className="bold-column">
                                {t("Price")}
                              </strong>
                            </td>
                            {planAll.map((plan) => (
                              <>
                                {plan.name === "Team" ? (
                                  <td
                                    className="table-fonts"
                                    key={`price_${plan.pricing_id}`}
                                  >
                                    {duration === "monthly" ? (
                                      <>
                                        {plan.monthly_price ===
                                        "Not Available" ? (
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            {plan.monthly_price * numberMembers}
                                          </span>
                                        ) : (
                                          <span>
                                            {" "}
                                            $
                                            {plan.monthly_price *
                                              numberMembers}{" "}
                                            /month per user{" "}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span style={{ fontSize: "15px" }}>
                                          {" "}
                                          $
                                          {plan.monthly_price_year 
                                          // *
                                          //   numberMembers
                                            }{" "}
                                          /month per user{" "}
                                        </span>
                                        <br />

                                        <span
                                          style={{ color: "rgb(22, 98, 167)" }}
                                        >
                                          {" "}
                                          ${plan.yearly_price * numberMembers} (
                                          {t("billed annually")})
                                        </span>
                                      </>
                                    )}
                                  </td>
                                ) : (
                                  <td
                                    className="table-fonts"
                                    key={`price_${plan.pricing_id}`}
                                  >
                                    {duration === "monthly" ? (
                                      <>
                                        {plan.monthly_price ===
                                        "Not Available" ? (
                                          <span style={{ color: "red" }}>
                                            {" "}
                                            {plan.monthly_price}
                                          </span>
                                        ) : (
                                          <span>
                                            {" "}
                                            ${plan.monthly_price} /month per
                                            user{" "}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span style={{ fontSize: "15px" }}>
                                          {" "}
                                          ${plan.monthly_price_year} /month per
                                          user{" "}
                                        </span>
                                        <br />

                                        <span
                                          style={{ color: "rgb(22, 98, 167)" }}
                                        >
                                          {" "}
                                          ${plan.yearly_price} (
                                          {t("billed annually")})
                                        </span>
                                      </>
                                    )}
                                  </td>
                                )}
                              </>
                            ))}
                          </tr>

                          <tr>
                            <td></td>
                            {planAll.map((planc) => (
                              <td
                                className="table-fonts"
                                key={`cta_${planc.pricing_id}`}
                              >
                                {planc.name === "Enterprise" ||
                                planc.name === "On-Prem Hosting" ? (
                                  <button
                                    size="sm"
                                    style={{
                                      height: "30px",
                                      width: "120px",
                                      padding: 0,
                                    }}
                                    onClick={() => {
                                      // Handle contact us action, e.g., opening a contact form or mailto link
                                      window.location.href = "/contact_us";
                                    }}
                                    className="cta-button"
                                  >
                                    {t("Contact sales")}
                                  </button>
                                ) : (
                                  <>
                                    {plan?.pricing_id === planc.pricing_id &&
                                    isFreeTrialExpired ? (
                                      <>
                                        <button
                                          disabled={true}
                                          size="sm"
                                          style={{
                                            height: "30px",
                                            width: "130px",
                                            padding: 0,
                                            backgroundColor: "rgb(0, 190, 0)",
                                          }}
                                          // disabled={!isFreeTrialExpired}
                                          onClick={() => {
                                            localStorage.setItem(
                                              "@selectedprice",
                                              JSON.stringify({
                                                priceId: planc,
                                                duration: duration,
                                                email: user?.email,
                                              })
                                            );
                                            window.location.href =
                                              "/stripe_checkout";
                                          }}
                                          // onClick={() => {
                                          //   localStorage.setItem(
                                          //     "@selectedprice",
                                          //     JSON.stringify({ priceId: planc, duration: duration, email: user?.email })
                                          //   );
                                          //   window.location.href = "/stripe_checkout";
                                          // }}
                                          className="cta-button"
                                        >
                                          {t("Subscribed")}
                                        </button>{" "}
                                      </>
                                    ) : (
                                      <>
                                        {" "}
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: 0,
                                          }}
                                        >
                                          {planc?.name === "Professional" ? (
                                            <div
                                              style={{ height: "30px" }}
                                            ></div>
                                          ) : (
                                            <span
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: 500,
                                                color: "black",
                                              }}
                                            >
                                              <Minus
                                                onClick={() => {
                                                  if (numberMembers > min) {
                                                    const no =
                                                      numberMembers - 1;
                                                    setNumberMembers(
                                                      numberMembers - 1
                                                    );
                                                    setTotal(amount * no);
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
                                                  setNumberMembers(
                                                    e.target.value
                                                  );
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
                                                  if (
                                                    numberMembers === max_user
                                                  ) {
                                                  } else {
                                                    setNumberMembers(
                                                      numberMembers + 1
                                                    );
                                                    const no =
                                                      numberMembers + 1;
                                                    setTotal(amount * no);
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
                                          )}
                                          {selectedPlan?.name === "Team" &&
                                          planc?.name === "Professional" ? (
                                            <div>-</div>
                                          ) : (
                                            <button
                                              size="sm"
                                              style={{
                                                height: "30px",
                                                width: "130px",
                                                padding: 0,
                                              }}
                                              onClick={() => {
                                                if (
                                                  planc?.name === "Professional"
                                                ) {
                                                  localStorage.setItem(
                                                    "@selectedprice",
                                                    JSON.stringify({
                                                      priceId: planc,
                                                      team_size: 1,
                                                      duration: duration,
                                                      email: user?.email,
                                                    })
                                                  );
                                                  window.location.href =
                                                    "/stripe_checkout";
                                                } else {
                                                  localStorage.setItem(
                                                    "@selectedprice",
                                                    JSON.stringify({
                                                      priceId: planc,
                                                      team_size: numberMembers,
                                                      duration: duration,
                                                      email: user?.email,
                                                    })
                                                  );
                                                  window.location.href =
                                                    "/stripe_checkout";
                                                }
                                              }}
                                              className="cta-button"
                                            >
                                              {t("Subscribe Now")}
                                            </button>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                                <br />
                              </td>
                            ))}
                          </tr>
                          {isSubscripitonActive ? null : (
                            <tr>
                              <td>
                                <strong className="bold-column">
                                  {t("Free Trial")}
                                </strong>
                              </td>
                              {planAll.map((planc) => (
                                <td
                                  className="table-fonts"
                                  key={`cta_${planc.pricing_id}`}
                                >
                                  {planc.free_trial ? (
                                    <>
                                      {plan?.pricing_id === planc.pricing_id ? (
                                        <span
                                          style={{
                                            color: "rgb(0, 190, 0)",
                                            fontWeight: 700,
                                          }}
                                        >
                                          {(() => {
                                            if (
                                              isFreeTrialExpired === false &&
                                              isSubscripitonActive === false
                                            ) {
                                              // Free trial is still active, show days left
                                              return (
                                                <>
                                                  {t("Free Trial")} <br />
                                                  {daysLeftExpiredfreePlan}{" "}
                                                  {t("Days Left")}
                                                </>
                                              );
                                            } else if (
                                              isFreeTrialExpired &&
                                              isSubscripitonActive
                                            ) {
                                              // Free trial is expired, but subscription is active, show subscription days left
                                              return `  ${t(
                                                "Free 30-Day trial"
                                              )}`;
                                            } else if (
                                              isFreeTrialExpired &&
                                              !isSubscripitonActive
                                            ) {
                                              // Both free trial and subscription are expired
                                              return t("UPGRADE PLAN");
                                            }
                                          })()}
                                        </span>
                                      ) : (
                                        <>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              padding: 0,
                                            }}
                                          >
                                            {plan?.name === "Team" ? (
                                              <div>-</div>
                                            ) : (
                                              <>
                                                <span
                                                  style={{
                                                    color: "rgb(0, 190, 0)",
                                                    fontWeight: 700,
                                                  }}
                                                >
                                                  {t(
                                                    `Free ${daysLeftExpiredfreePlan}-Day trial`
                                                  )}
                                                </span>{" "}
                                                <span
                                                  style={{
                                                    fontSize: "18px",
                                                    fontWeight: 500,
                                                    color: "black",
                                                  }}
                                                >
                                                  <Minus
                                                    onClick={() => {
                                                      if (numberMembers > min) {
                                                        const no =
                                                          numberMembers - 1;
                                                        setNumberMembers(
                                                          numberMembers - 1
                                                        );
                                                        setTotal(amount * no);
                                                      }
                                                    }}
                                                    size={20}
                                                    style={{
                                                      backgroundColor:
                                                        "#23b3e8",
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
                                                      setNumberMembers(
                                                        e.target.value
                                                      );
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
                                                      border:
                                                        "1px solid lightGrey",
                                                      textAlign: "center",
                                                    }}
                                                  />
                                                  <Plus
                                                    onClick={() => {
                                                      if (
                                                        numberMembers ===
                                                        max_user
                                                      ) {
                                                      } else {
                                                        setNumberMembers(
                                                          numberMembers + 1
                                                        );
                                                        const no =
                                                          numberMembers + 1;
                                                        setTotal(amount * no);
                                                      }
                                                    }}
                                                    size={20}
                                                    style={{
                                                      backgroundColor:
                                                        "#23b3e8",
                                                      color: "white",
                                                      width: "30px",
                                                      height: "30px",
                                                      borderRadius: "5px",
                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                </span>
                                                <div>
                                                  <button
                                                    size="sm"
                                                    style={{
                                                      height: "30px",
                                                      width: "110px",

                                                      padding: 0,
                                                      backgroundColor:
                                                        "rgb(0, 190, 0)",
                                                    }}
                                                    onClick={async () => {
                                                      console.log(
                                                        "Free traisl active user"
                                                      );
                                                      setplanIdfree(
                                                        planc.pricing_id
                                                      );

                                                      setconfirmationfreePlan(
                                                        true
                                                      );
                                                    }}
                                                    className="cta-button"
                                                  >
                                                    {t("Try for Free")}
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <span
                                      style={{
                                        color: "red",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {t("Trial not available")}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          )}
                          {/* Price Row */}

                          {/* Documents Row */}
                          <tr>
                            <td>
                              <strong className="bold-column">
                                {t("Documents Included")}
                              </strong>
                            </td>
                            {planAll.map((plan) => (
                              <td
                                className="table-fonts"
                                key={`documents_${plan.pricing_id}`}
                              >
                                {plan.document_limit}
                              </td>
                            ))}
                          </tr>

                          {/* Templates Row */}
                          <tr>
                            <td>
                              <strong className="bold-column">
                                {t("Templates")}
                              </strong>
                            </td>
                            {planAll.map((plan) => (
                              <td
                                className="table-fonts"
                                key={`templates_${plan.pricing_id}`}
                              >
                                {plan.template_count}
                              </td>
                            ))}
                          </tr>

                          {/* Public Forms Row */}
                          <tr>
                            <td>
                              <strong className="bold-column">
                                {t("Public Forms")}
                              </strong>
                            </td>
                            {planAll.map((plan) => (
                              <td
                                className="table-fonts"
                                key={`public_forms_${plan.pricing_id}`}
                              >
                                {plan.public_forms_count}
                              </td>
                            ))}
                          </tr>

                          {/* Branding Row */}
                          <tr>
                            <td>
                              <strong className="bold-column">
                                {t("Branding")}
                              </strong>
                            </td>
                            {planAll.map((plan) => (
                              <td
                                className="table-fonts"
                                key={`branding_${plan.pricing_id}`}
                              >
                                {plan.branding ? (
                                  <CheckCircle style={{ color: "green" }} />
                                ) : (
                                  <XCircle style={{ color: "red" }} />
                                )}
                              </td>
                            ))}
                          </tr>

                          {/* Custom Web Address Row */}
                          <tr>
                            <td>
                              <strong className="bold-column">
                                {t("Web Address")}
                              </strong>
                            </td>
                            {planAll.map((plan) => (
                              <td
                                className="table-fonts"
                                key={`web_address_${plan.pricing_id}`}
                              >
                                {plan.custom_web_address ? (
                                  <>
                                    {plan.name === "Team" ? (
                                      <h3>{t("Subdomain Only")}</h3>
                                    ) : (
                                      <h3>{t("Your Domain")}</h3>
                                    )}
                                    {/* <CheckCircle style={{ color: "green" }} /> */}
                                  </>
                                ) : (
                                  <XCircle style={{ color: "red" }} />
                                )}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </>
                )}
                {/* </div> */}
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={confirmationfreePlan}
        toggleFunc={() => setconfirmationfreePlan(!confirmationfreePlan)}
        loader={loadingConfirmation}
        callBackFunc={availFreePlan}
        text={t(
          "Please confirm you would like to upgrade from Professional to Team plan?"
        )}
      />
    </>
  );
};
export default ModalConfirmationPlan;
