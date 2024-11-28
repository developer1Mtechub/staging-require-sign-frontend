import React from 'react';
import { Alert } from 'reactstrap';
import { useTranslation } from "react-i18next";

const FreeTrialAlert = ({ isSubscripitonActive,isFreeTrialExpired, daysleftExpired }) => {
const { t } = useTranslation();

  // Display alert if trial has expired
  if (isFreeTrialExpired && !isSubscripitonActive) {
    return (
      <Alert color="danger">
        <h2 className="alert-body">
        { t("Your free trial has expired! Please upgrade to continue using premium features.")}
        </h2>
      </Alert>
    );
  } 
  // Display alert if trial is expiring within 3 days
  else if (!isSubscripitonActive&& !isFreeTrialExpired &&daysleftExpired <= 3 && daysleftExpired > 0) {
    return (
      <Alert color="warning">
        <h2 className="alert-body">
          Your free trial is expiring in {daysleftExpired} day{daysleftExpired > 1 ? 's' : ''}! Please upgrade to avoid interruption.
        </h2>
      </Alert>
    );
  } else  // Free trial or subscription has expired (0 days left)
  if (daysleftExpired === 0 && isSubscripitonActive) {
    return (
      <Alert color="danger">
        <h2 className="alert-body">
          {t(`Your ${isSubscripitonActive ? "subscription" : "free trial"} has expired! Please upgrade to continue using premium features.`)}
        </h2>
      </Alert>
    );
  }
  else  // Free trial or subscription has expired (0 days left)
  if ( isSubscripitonActive&& isFreeTrialExpired && daysleftExpired <= 3 ) {
    return (
      <Alert color="danger">
        <h2 className="alert-body">
        Your subscription is expiring in {daysleftExpired} day{daysleftExpired > 1 ? 's' : ''}! Please upgrade to avoid interruption.
        </h2>
      </Alert>
    );
  }
  // else  if (!isFreeTrialExpired && !isSubscripitonActive) {
  //   return (
  //     <Alert color="danger">
  //       <h2 className="alert-body">
  //         {t("Your subscription has expired! Please upgrade to continue using premium features.")}
  //       </h2>
  //     </Alert>
  //   );
  // }
  // else if (isSubscripitonActive) {
  //   return null
  // }
  // else if(isFreeTrialExpired===false && isSubscripitonActive===false){
  //   return (
  //     <Alert color="danger">
  //       <h2 className="alert-body">
  //      { t("Your subscription has expired! Please upgrade to continue using premium features.")}
  //       </h2>
  //     </Alert>
  //   );
  // }

  // If none of the conditions are met, return null (don't show anything)
  return null;
};

export default FreeTrialAlert;
