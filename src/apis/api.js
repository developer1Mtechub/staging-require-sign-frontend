import axios from "axios";
import toastAlert from "@components/toastAlert";

export const BASE_URL ="https://staging-require-sign.caprover-demo.mtechub.com/"; // Your API base URL BACKEND

// export const BASE_URL = "http://localhost:3006/"; // Your API base URL BACKEND
export const bulkLinkTermsAndConditionLink = "/terms-and-conditions"; // Bulk link response pAGE TERMS AND CONDITION
// export const BASE_URL = 'https://server.requiresign.com/'; // Your API base URL BACKEND
export const FrontendBaseUrl = "https://portal.requiresign.com/"; // Your API base URL FRONTEND+
// export const FrontendBaseUrl = "http://localhost:3000/"; // Your API base URL FRONTEND+
// export const FrontendBaseUrl = "https://animated-yeot-9e2c1e.netlify.app/"; // Your API base URL FRONTEND+
// https://boisterous-praline-59adf0.netlify.app/login
export const PrimaryKey =
  "pk_test_51Ml3wJGui44lwdb4K6apO4rnFrF2ckySwM1TfDcj0lVdSekGOVGrB1uHNlmaO7wZPxwHfRZani73KlHQKOiX4JmK00E0l7opJO";
export const IPGetUrl2 = "https://worldtimeapi.org/api/ip/"; // GET TIME ZONE

export const IPGetUrl = "https://worldtimeapi.org/api/ip/"; // GET TIME ZONE
export const bulkLiverifyEmailnkTermsAndConditionLink = "/terms-and-conditions"; // Bulk link response pAGE TERMS AND CONDITION

// using it
export const GetCurrentIPCountry =
  "https://api.ipgeolocation.io/ipgeo?apiKey=a8cc5ab42a5045278fbe3833f4f6f1b1"; //paid
// export const GetCurrentIPCountry =
//   "https://api.ipgeolocation.io/ipgeo?apiKey=7823ef87b57f402c91d6b6d3e5f15cda"; // LOCATIOM GET
// Requiresign logo on download pdf
export const jpg_image1 =
  "https://res.cloudinary.com/dlm56y4v4/image/upload/v1714458748/logoRemoveBg_i9gwty.png";
export const get = async (url = {}) => {
  console.log("url get");

  console.log(url);
  const response = await fetch(`${BASE_URL}${url}`);

  if (!response.ok) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
export const universalLinkPost = async (url, data) => {
  // const queryParams = new URLSearchParams(params);
  try {
    console.log("url universL POST");

    console.log(url);
    const response = await axios.post(`${url}`, data);
    return response.data;
  } catch (error) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error posting data: ${error.message}`);
  }
};

export const post = async (url, data) => {
  try {
    console.log("url POST");

    console.log(url);
    const response = await axios.post(`${BASE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    console.log(error.message)
    console.log(error)
    toastAlert("error", "Something went wrong. Please try again !");
    // if (error.message.includes("ERR_CONNECTION_REFUSED")) {
    //   // Backend server is down
    //   toastAlert("error","The server is currently unavailable. Please try again later.");
    // } else if (error.message.includes("Network Error")) {
    //   // Internet issue
    //  toastAlert("error","You are offline. Please check your internet connection.");
    // } else {
    //   // Other errors (like 404, 500, etc.)
    //  toastAlert("error",`An error occurred: ${error.message}`);
    // }
    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const postHeaders = async (url, data, headers) => {
  try {
    console.log("url POST HEADER");

    console.log(url);
    const response = await axios.post(`${BASE_URL}${url}`, data, { headers });
    return response.data;
  } catch (error) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const put = async (url, data) => {
  try {
    console.log("url PUT");

    console.log(url);
    const response = await axios.put(`${BASE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const deleteReq = async (url, data) => {
  try {
    console.log("url DELETE");

    console.log(url);
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error posting data: ${error.message}`);
  }
};
// export const postFormData = async (data) => {
//   //console.log(data)
//   console.log("url data post form")

//   console.log(data)
//   const formData = new FormData();
//   formData.append("image", data.image);

//   try {
//     const response = await axios.post(`${BASE_URL}upload-image`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     // toastAlert("error", "Something went wrong!");

//     throw new Error(`Error posting data: ${error.message}`);
//   }
// };
// idrive upload image
export const postFormData = async (data) => {
  //console.log(data)
  console.log("url data post form");

  console.log(data);
  const formData = new FormData();
  formData.append("file", data.image);
  formData.append("user_id", data.user_id);

  try {
    const response = await axios.post(`${BASE_URL}uploadidrive`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const postFormDataPdfDb = async (data, progressCallback) => {
  //console.log(data)
  console.log("url data post form");

  console.log(data);
  const formData = new FormData();
  formData.append("file", data.image);

  try {
    const response = await axios.post(`${BASE_URL}upload-pdf`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        progressCallback(progress);
      },
    });

    return response.data;
  } catch (error) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error posting data: ${error.message}`);
  }
};
// upload file
export const postFormDataPdf = async (data, progressCallback) => {
  console.log("url data post form pdf");

  console.log(data);
  //console.log(data)
  const formData = new FormData();
  formData.append("file", data.image);
  formData.append("user_id", data.user_id);

  try {
    const response = await axios.post(`${BASE_URL}uploadidrive`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        progressCallback(progress);
      },
    });

    return response.data;
  } catch (error) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error posting data: ${error.message}`);
  }
};
//replace file
export const postFormDataPdfReplace = async (data, progressCallback) => {
  console.log("url data post form pdf replace");

  console.log(data);
  //console.log(data)

  const formData = new FormData();
  formData.append("file", data.image);
  formData.append("user_id", data.user_id);
  formData.append("file_id", data.file_id);

  // formData.append("publicUrl", data.publicUrl);

  try {
    const response = await axios.post(`${BASE_URL}replace`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        progressCallback(progress);
      },
    });

    return response.data;
  } catch (error) {
    // toastAlert("error", "Something went wrong!");

    throw new Error(`Error posting data: ${error.message}`);
  }
};
