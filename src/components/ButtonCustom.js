import React from "react";
import { selectPrimaryColor, selectSecondaryColor } from "../redux/navbar";
import { useSelector } from "react-redux";

const CustomButton = ({
  style,
  onClick,
  text,
  size,
  disabled,
  padding,
  type,
  className,
  color,
  useDefaultColor = true,
  secondary_color_data,
  compPrimaryColor,
}) => {
  // Retrieve the company object from localStorage
  const colorMap = {
    success: "#23b3e8", // Assuming success maps to this color
    error: "#ff4757", // Example color for error
    warning: "#b8b4b4", // Example color for default
    purple: " #CC99FF",
    orange: "#f9a44d",
    green: "#2ecc71",
    // Add more mappings as needed
  };
  const primary_color = useSelector(selectPrimaryColor);
  const secondary_color = useSelector(selectSecondaryColor);


  // Extract the primary_color value or use a default color
  let backgroundColor;
  if (!useDefaultColor && color) {
    backgroundColor = colorMap[color] || color;
  } else {
    backgroundColor =
      compPrimaryColor === undefined || compPrimaryColor === null
        ? primary_color
        : compPrimaryColor;
  }
  // Correctly set the fontSize based on the size prop
  const fontSize = size === "sm" ? "14px" : "20px";
  const paddingData = padding
    ? "0.8rem 1rem"
    : useDefaultColor === false
    ? "0.1rem 0.3rem"
    : "0.5rem 1rem";

  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        letterSpacing: "0.5px",
        fontWeight: "bold",
        lineHeight: 1,
        paddingTop: useDefaultColor === false ? 4 : 10,
        border: "none",
        color: "white",
        fontSize: fontSize,
        borderRadius: "5px",
        padding: paddingData,
        backgroundColor: secondary_color_data?secondary_color:backgroundColor,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CustomButton;
