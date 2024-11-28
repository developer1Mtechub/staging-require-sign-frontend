import React from "react";
import { Badge } from "reactstrap";

const CustomBadge = ({ text, onClick, color = "primary" }) => (
  <Badge
    style={{
      cursor: "pointer",
      marginLeft: "10px",
      fontSize: "15px",
      letterSpacing: "1px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "27px", // Adjust the height as needed
      //   width: '45px', // Adjust the width as needed
      borderRadius: "4px", // Adjust the border radius as needed
    }}
    color={color}
    onClick={onClick}
    className={`badge-${color}`}
  >
    {text}
  </Badge>
);

export default CustomBadge;
