// import React from 'react';
// import {Clock, Users, User, CheckCircle} from 'react-feather';
// import { useTranslation } from 'react-i18next';

// const MobileSelect = ({active, handleSelectChange}) => {
//   const {t} = useTranslation();

//   return(
//   <select
//     style={{
//       padding: '8px',
//       border: '.5px solid lightGrey',
//       borderRadius: '5px',
//       fontSize: '14px',
//     }}
//     className="nav-left"
//     onChange={e => handleSelectChange(e)}>
//     <option value="1" selected={active === '1'}>
//       <Clock size={14} style={{marginTop: '-5px'}} />
//       {t("New File")} |{("In Progress")}
//     </option>
//     <option value="2" selected={active === '2'}>
//       <Users size={14} style={{marginTop: '-5px'}} />
//       {t("Waiting for Others")}
//     </option>
//     <option value="3" selected={active === '3'}>
//       <User size={14} style={{marginTop: '-5px'}} />
//      {t("Waiting for Me")}
//     </option>
//     <option value="4" selected={active === '4'}>
//       <CheckCircle size={14} style={{marginTop: '-5px'}} />
//       {t("Completed")}
//     </option>
//   </select>
// );
// }
// export default MobileSelect;

import React from "react";
import { Clock, Users, User, CheckCircle } from "react-feather";
import { useTranslation } from "react-i18next";

const MobileSelect = ({
  active,
  handleSelectChange,
  toggle,
  pcolorFromLocalStorage,
  setFolderLoader,
  setStatusData,
  setCurrentPage,
}) => {
  const { t } = useTranslation();

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (active !== selectedValue) {
      console.log("selectedValue", selectedValue);
      toggle(selectedValue);
      localStorage.setItem("tabActive", selectedValue);
      setFolderLoader(true);

      // Update status data and reset current page after a short delay to mimic loading
      setTimeout(() => {
        switch (selectedValue) {
          case "1":
            setStatusData("InProgress");
            break;
          case "2":
            setStatusData("WaitingForOthers");
            break;
          case "3":
            setStatusData("WaitingForMe");
            break;
          case "4":
            setStatusData("Completed");
            break;
          default:
            break;
        }
      }, 500);
      setCurrentPage(1);
    }
  };

  return (
    <select
      style={{
        padding: "8px",
        border: "0.5px solid lightGrey",
        borderRadius: "5px",
        fontSize: "14px",
        color: pcolorFromLocalStorage, // Add color for active styling
      }}
      className="nav-left"
      onChange={handleChange}
      value={active} // Set the current active value
    >
      <option value="1">
        <Clock size={14} style={{ marginTop: "-5px" }} />
        {t("New File")} | {t("In Progress")}
      </option>
      <option value="2">
        <Users size={14} style={{ marginTop: "-5px" }} />
        {t("Waiting for Others")}
      </option>
      <option value="3">
        <User size={14} style={{ marginTop: "-5px" }} />
        {t("Waiting For Me")}
      </option>
      <option value="4">
        <CheckCircle size={14} style={{ marginTop: "-5px" }} />
        {t("Completed")}
      </option>
    </select>
  );
};

export default MobileSelect;
