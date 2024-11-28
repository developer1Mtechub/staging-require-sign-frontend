import React, { useState } from "react";
import { ListGroup } from "reactstrap";
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  Edit2,
  FileText,
  Image,
  Italic,

  Type,
  Zap,
} from "react-feather";
import { useSelector } from "react-redux";
import { selectPrimaryColor } from "../redux/navbar";
import { useTranslation } from "react-i18next";

const ForOthers = ({ type, selectedSigner, typeData, handleCanvasClick2 }) => {
  // List
  const { t } = useTranslation();

  const [activeList, setActiveLIst] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const primary_color = useSelector(selectPrimaryColor);

  const toggleList = (list) => {
    if (activeList !== list) {
      setActiveLIst(list);
    }
  };
  // Tooltip

  const [tooltipOpen, setTooltipOpen] = useState({});

  const toggleTooltip = (i) => {
    setTooltipOpen({ ...tooltipOpen, [i]: !tooltipOpen[i] });
  };
  const styleText1 = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    alignItems: "center",

    alignContent: "center",
    // paddingInline: '20px',
    cursor: "pointer",
    width: "85%",
    paddingBlock: 5,
    borderRadius: "5px",

    // marginTop: '2%',
    alignSelf: "center",
  };
  const styleText = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
    alignItems: "center",
    alignContent: "center",
    paddingInline: "2%",
    cursor: "pointer",
    width: "85%",
    paddingBlock: 3,
    fontWeight: 900,
    borderRadius: "5px",
  
    marginTop: "2%",
    alignSelf: "center",
  };
  const styleh2 = {
    fontSize: "12px",
    fontWeight: 600,
    marginTop: "10px",
    // marginLeft: '15px',
  };
  const styleh22 = {
    fontSize: "15px",
    fontWeight: 600,
    marginTop: "10px",
    marginLeft: "15px",
  };
  const forOtherItems = [
    {
      name: t("Text"),
      type: "signer_text",
      icon: (
        <Type
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "TEXT",
    },

    {
      name: t("Signature"),
      type: "signer_initials",
      icon: (
        <Edit2
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "TEXT",
    },
    {
      name: t("Initials"),
      type: "signer_initials_text",
      icon: (
        <Italic
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "TEXT",
    },
    {
      name: t("Date"),
      type: "signer_date",
      icon: (
        <Calendar
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "TEXT",
    },
    {
      name:t("Checkmark"),
      type: "signer_checkmark",
      icon: (
        <CheckCircle
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "TEXT",
    },
    {
      name: t("Stamp"),
      type: "signer_chooseImgStamp",
      icon: (
        <Zap
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "TEXT",
    },
    {
      name: t("Driving License"),
      type: "signer_chooseImgDrivingL",
      icon: (
        <FileText
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "PassportPhoto",
    },
    {
      name: t("Passport Photo"),
      type: "signer_chooseImgPassportPhoto",
      icon: (
        <Image
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "TEXT",
    },

    {
      name: t("Dropdown"),
      type: "signer_dropdown",
      icon: (
        <ChevronDown
          // style={{
          //   marginLeft: '15px',
          // }}
          size={15}
          // color={selectedSigner.color}
        />
      ),
      actionType: "TEXT",
    },
  ];
  const forOtherItems1 = [
    {
      name: t("Text"),
      type: "signer_text",
      icon: <Type size={15} />,
      actionType: "TEXT",
    },
    {
      name: t("Signature"),
      type: "signer_initials",
      icon: <Edit2 size={15} />,
      actionType: "TEXT",
    },
    {
      name: t("Initials"),
      type: "signer_initials_text",
      icon: <Italic size={15} />,
      actionType: "TEXT",
    },
    {
      name: t("Date"),
      type: "signer_date",
      icon: <Calendar size={15} />,
      actionType: "TEXT",
    },
    {
      name: t("Checkmark"),
      type: "signer_checkmark",
      icon: <CheckCircle size={15} />,
      actionType: "TEXT",
    },
    {
      name: t("Stamp"),
      type: "signer_chooseImgStamp",
      icon: <Zap size={15} />,
      actionType: "TEXT",
    },
    {
      name: t("License"),
      type: "signer_chooseImgDrivingL",
      icon: <FileText size={15} />,
      actionType: "PassportPhoto",
    },
    {
      name: t("Passport"),
      type: "signer_chooseImgPassportPhoto",
      icon: <Image size={15} />,
      actionType: "TEXT",
    },
    {
      name: t("Dropdown"),
      type: "signer_dropdown",
      icon: <ChevronDown size={15} />,
      actionType: "TEXT",
    },
  ];
  return (
    <div>
      <ListGroup style={{ width: "100%" }} className="list-group-vertical-sm">
        {window.innerWidth > 768 ? (
          <>
            {forOtherItems.map((item, i) => (
              <>
                <div
                  key={i}
                  // onClick={() => {
                  //   alert('hello');
                  // }}
                  onClick={() => {
                    toggleList(i + 1);
                    type(item.type);
                    // setTypeSelected(item.type);
                    // handleCanvasClick2(item.type)
                  }}
                  onMouseEnter={() => setHoveredItem(i)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    ...styleText,
                    border:
                      typeData === item.type
                        ? `1px solid ${selectedSigner?.color}`
                        : "1px solid #e0e0e0",
                    backgroundColor:
                      hoveredItem === i ? "#f5f5f5" : "transparent",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: `${selectedSigner?.color}`,
                      display: "flex",
                      justifyContent: "center",
                      padding: 6,
                      borderRadius: "4px",
                      color: "white",
                    }}
                  >
                    {item.icon}
                  </div>

                  <h2 style={styleh22}>{item.name}</h2>
                </div>
              </>
            ))}
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                minWidth: "590px",
                overflowY: "scroll",
              }}
            >
              {forOtherItems1.map((item, i) => (
                <>
                  <div
                    key={i}
                    // onClick={() => {
                    //   alert('hello');
                    // }}
                    onClick={() => {
                      toggleList(i + 1);
                      type(item.type);
                      // setTypeSelected(item.type);
                      // handleCanvasClick2(item.type)
                    }}
                    style={{
                      ...styleText1,
                      border:
                        typeData === item.type
                          ? `1px solid ${selectedSigner.color}`
                          : "none",
                    }}
                  >
                    {/* gff{selectedSigner.color} */}
                    <span
                      style={{
                        backgroundColor:
                          selectedSigner.color === null ||
                          selectedSigner.color === undefined
                            ? primary_color
                            : selectedSigner.color,
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        // paddingRight: '15px',
                        alignItems: "center",
                        fontSize: "20px",
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      {item.icon}
                    </span>

                    <h5 style={styleh2}>{item.name}</h5>
                  </div>
                </>
              ))}
            </div>
          </>
        )}
      </ListGroup>
    </div>
  );
};

export default ForOthers;
