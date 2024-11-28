// api.js
import React from "react";
import axios from "axios";
import { GetCurrentIPCountry } from "../../apis/api";

const getUserLocation = async () => {
  try {
    const response = await fetch(`${GetCurrentIPCountry}`);

    if (!response.ok) {
      throw new Error(`Error retrieving user location: ${response.statusText}`);
    }

    const responseData = await response.json();

    console.log("ip data");
    console.log(responseData);

    let data = {
      ip: responseData?.ip || "N/A", // Handle both IPv4 and IPv6
      country: responseData?.country_code2 || "N/A",
      date: responseData?.time_zone?.current_time || "N/A",
      timezone: responseData?.time_zone?.name || "N/A",
    };
    // let data = {
    //   ip: "-",
    //   country: "-",
    //   date: "-",
    //   timezone: "-",
    //   };
    return data;
  } catch (error) {
    console.error("Error retrieving user location:", error);
    let data1 = {
      ip: "-",
      country: "-",
      date: "-",
      timezone: "-",
    };
    return data1;
  }
  // usage
};
export default getUserLocation;
