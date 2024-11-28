import { DefaultRoute } from "../router/routes";
import {
  BASE_URL,
  IPGetUrl,
  IPGetUrl2,
  jpg_image1,
  post,
  postFormDataPdf,
  postFormDataPdfDb,
  postFormDataPdfReplace,
} from "../apis/api";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import logoRequireSign from "../assets/images/pages/logoRemoveBg.png";
import check from "../assets/images/pages/checkmark.png";

export const isObjEmpty = (obj) => Object.keys(obj).length === 0;
// const locationTimezone=await
// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num;

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
// export const formatDate = (value, formatting = {month: 'short', day: 'numeric', year: 'numeric'}) => {
//   if (!value) return value;
//   return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value));
// };
export const formatDate = (
  value,
  timeZone,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", {
    ...formatting,
    timeZone: timeZone || "Asia/Karachi", // Specify the desired time zone, e.g., UTC
  }).format(new Date(value));
};

export const formatDateTime = (
  value,
  timeZone,
  formatting = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    //  hour12: true
    hourCycle: "h12", // Ensure 12-hour clock format
  }
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", {
    ...formatting,
    timeZone: timeZone || "Asia/Karachi", // Specify the desired time zone, e.g., UTC
    // timeZone:  'Asia/Karachi', // Specify the desired time zone, e.g., UTC
  }).format(new Date(value));
};
export const getTimezone = async (ipData) => {
  try {
    let BaseurlTimesCheck = "";
    if (BASE_URL === "http://localhost:3000") {
      BaseurlTimesCheck = IPGetUrl;
    } else {
      BaseurlTimesCheck = IPGetUrl2;
    }
    const response1 = await axios.get(`${BaseurlTimesCheck}${ipData}`);
    //console.log('Localtion RESPONSE TIME ZONE ');
    //console.log(response1);

    return response1?.data?.timezone;
    // return response.data;
  } catch (error) {
    console.error("Error retrieving user location:", error);
    return null;
  }
};
export const formatDateTimeZone = async (
  value,
  ip,
  formatting = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }
) => {
  if (!value) return value;
  const data = await getTimezone(ip);
  //console.log('dsghdgshf');
  //console.log(data);
  const formattedDateTime = new Intl.DateTimeFormat("en-US", {
    ...formatting,
    timeZone: data, // Specify the desired time zone, e.g., UTC
  }).format(new Date(value));

  return { dateTime: formattedDateTime, timeZone: data };
  //   return new Intl.DateTimeFormat('en-US', {
  //     ...formatting,
  //     timeZone: data, // Specify the desired time zone, e.g., UTC
  //   }).format(new Date(value));
};

export const formatDateMMDDYYYY = (value) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

/// Function to format the date as MM/DD/YYYY (USA format)
export const formatDateUSA = (date, timeZoneOffset = 0) => {
  const dateFormat = new Date(date);
  const utcTime = dateFormat.getTime() + dateFormat.getTimezoneOffset() * 60000;
  const convertedDate = new Date(utcTime + timeZoneOffset * 60000);
  const month = (convertedDate.getMonth() + 1).toString().padStart(2, "0");
  const day = convertedDate.getDate().toString().padStart(2, "0");
  const year = convertedDate.getFullYear();
  return `${month}/${day}/${year}`;
};
export const formatDateUSATime = (date, timeZoneOffset = 0) => {
  const dateFormat = new Date(date);
  const utcTime = dateFormat.getTime() + dateFormat.getTimezoneOffset() * 60000;
  const convertedDate = new Date(utcTime + timeZoneOffset * 60000);
  const month = (convertedDate.getMonth() + 1).toString().padStart(2, "0");
  const day = convertedDate.getDate().toString().padStart(2, "0");
  const year = convertedDate.getFullYear();
  let hours = convertedDate.getHours();
  const minutes = convertedDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${day}/${month}/${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Function to format the date as DD/MM/YYYY (International format)
export const formatDateInternational = (date, timeZoneOffset = 0) => {
  const dateFormat = new Date(date);
  const utcTime = dateFormat.getTime() + dateFormat.getTimezoneOffset() * 60000;
  const convertedDate = new Date(utcTime + timeZoneOffset * 60000);
  const day = convertedDate.getDate().toString().padStart(2, "0");
  const month = (convertedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = convertedDate.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format the date as Mon-DD-YYYY
export const formatDateCustom = (date, timeZoneOffset = 0) => {
  const dateFormat = new Date(date);
  const utcTime = dateFormat.getTime() + dateFormat.getTimezoneOffset() * 60000;
  const convertedDate = new Date(utcTime + timeZoneOffset * 60000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[convertedDate.getMonth()];
  const day = convertedDate.getDate().toString().padStart(2, "0");
  const year = convertedDate.getFullYear();
  return `${month}-${day}-${year}`;
};

export const formatDateCustomTime = (date, timeZoneOffset = 0) => {
  const dateFormat = new Date(date);
  const utcTime = dateFormat.getTime() + dateFormat.getTimezoneOffset() * 60000;
  const convertedDate = new Date(utcTime + timeZoneOffset * 60000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[convertedDate.getMonth()];
  const day = convertedDate.getDate().toString().padStart(2, "0");
  const year = convertedDate.getFullYear();
  let hours = convertedDate.getHours();
  const minutes = convertedDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${month} ${day},${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

// end
export const formatDateTimeActivityLog = (dateString) => {
  const date = new Date(dateString); // Create a Date object from the string

  // Use toLocaleString to format the date in your desired format
  const formattedDate = date.toLocaleString("en-US", {
    weekday: "short", // "Mon"
    year: "numeric", // "2024"
    month: "short", // "Nov"
    day: "numeric", // "25"
    hour: "2-digit", // "05"
    minute: "2-digit", // "20"
    hour12: true, // Use 12-hour clock format
  });

  return formattedDate;
};
export const formatDateCustomTimelastActivity = (dateTimeString) => {
  // Parse the date string
  const date = new Date(dateTimeString);

  // Options for formatting the date part
  const dateOptions = { month: "short", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);

  // Options for formatting the time part
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  // Combine the formatted date and time
  return `${formattedDate} ${formattedTime}`;
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData");
export const getUserData = () => JSON.parse(localStorage.getItem("userData"));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "admin") return DefaultRoute;
  if (userRole === "client") return "/access-control";
  return "/login";
};
export const highlightText = (text, query) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: "yellow" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};
// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});
export function getRandomLightColor() {
  const r = Math.floor(Math.random() * 156) + 100; // Random between 100-255
  const g = Math.floor(Math.random() * 156) + 100; // Random between 100-255
  const b = Math.floor(Math.random() * 156) + 100; // Random between 100-255
  return "rgb(" + r + "," + g + "," + b + ")"; // Collect all to a string
}
export function darkenColor(colorHex) {
  // Remove the "#" from the beginning of the hex color code
  colorHex = colorHex.slice(1);

  // Convert the hex color to RGB values
  let r = parseInt(colorHex.substring(0, 2), 16);
  let g = parseInt(colorHex.substring(2, 4), 16);
  let b = parseInt(colorHex.substring(4, 6), 16);

  // Darken the color by reducing each RGB component
  const darknessFactor = 0.8; // You can adjust this factor to control the darkness
  r = Math.floor(r * darknessFactor);
  g = Math.floor(g * darknessFactor);
  b = Math.floor(b * darknessFactor);

  // Convert the darkened RGB values back to hex format
  let darkenedColorHex =
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

  return darkenedColorHex;
}
export function darkenColorRGB(color) {
  // Assuming color is in hexadecimal format (e.g., "#ffffff")
  // Convert it to RGB
  // Assuming color is in RGB format (e.g., "rgb(255, 214, 91, 78%)")

  // Extract RGB values
  // const rgbValues = color.match(/\d+/g).map(Number);

  // // Reduce each RGB component to darken the color
  // const darkenedRgb = rgbValues.map(component => Math.round(component * 0.7)); // You can adjust the factor (0.7) as needed

  // // Construct the new RGB string
  // const darkenedColor = `rgb(${darkenedRgb[0]}, ${darkenedRgb[1]}, ${darkenedRgb[2]}, ${rgbValues[3]})`;

  // return darkenedColor;
  const matches = color.match(/\d+/g);
  const alpha = matches.pop(); // Extract and remove alpha value
  const rgbValues = matches.map(Number);

  // Reduce each RGB component to darken the color
  const darkenedRgb = rgbValues.map((component) => Math.round(component * 0.9)); // Adjusted factor (0.7)

  // Construct the new RGB string
  const darkenedColor = `rgb(${darkenedRgb[0]}, ${darkenedRgb[1]}, ${darkenedRgb[2]}, ${alpha})`;

  return darkenedColor;
}
export function lightenColor(colorHex) {
  // Remove the "#" from the beginning of the hex color code
  colorHex = colorHex.slice(1);

  // Convert the hex color to RGB values
  let r = parseInt(colorHex.substring(0, 2), 16);
  let g = parseInt(colorHex.substring(2, 4), 16);
  let b = parseInt(colorHex.substring(4, 6), 16);

  // Lighten the color by increasing each RGB component
  const lightnessFactor = 1.2; // You can adjust this factor to control the lightness
  r = Math.min(Math.floor(r * lightnessFactor), 255);
  g = Math.min(Math.floor(g * lightnessFactor), 255);
  b = Math.min(Math.floor(b * lightnessFactor), 255);

  // Convert the lightened RGB values back to hex format
  let lightenedColorHex =
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

  return lightenedColorHex;
}

export function getColorByIndex(index) {
  // Light Blue: #ADD8E6
  // Light Green: #90EE90
  // Light Yellow: #FFFFE0
  // Light Pink: #FFB6C1
  // Lavender: #E6E6FA
  // Peach: #FFDAB9
  // Light Gray: #D3D3D3
  // Mint: #F5FFFA
  // const colors = ['#ffd65b', '#c0a5cf', ' #97c9bf', '#f7b994', '#cfdb7f', '#ff9980', '#ffb3c6', '#e6c6e6'];
  const colors = [
    "rgb(255 214 91 / 78%)",
    "rgb(192 165 207 / 78%)",
    " rgb(151 201 191 / 78%)",
    "rgb(247 185 148 / 78%)",
    "rgb(207 219 127 / 78%)",
    "rgb(255 153 128 / 78%)",
    "rgb(255 179 198 / 78%)",
    "rgb(230 198 230 / 78%)",
  ];

  // Ensure index is within range
  index %= colors.length;

  return colors[index];
}
const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
// base64to image
export function base64toFile(base64URL, filename) {
  // Split the base64 data from the URL
  const splitDataURL = base64URL.split(",");

  // Get the content type of the image (e.g., "image/png")
  const contentType = splitDataURL[0].split(":")[1].split(";")[0];

  // Decode the base64 data
  const byteCharacters = atob(splitDataURL[1]);

  // Create a typed array to hold the binary data
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  // Create a Blob from the binary data
  const blob = new Blob(byteArrays, { type: contentType });

  // Create a File object from the Blob
  const file = new File([blob], filename, { type: contentType });

  return file;
}

// end
export const handleDownloadPDFApp = async (pdfUrl, pdfName) => {
  const response = await fetch(`${pdfUrl}`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${pdfName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
// if (doc_completed === true) {
//   // Add the first activity log page
//   let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

//   const fontSize = 10;
//   const margin = 20;
//   const lineHeight = 20;
//   const tableTopY = pageHeight - margin - 50;

//   const availablePageWidth = pageWidth - margin * 2;
//   const columnProportions = {
//     event: 0.27,
//     email: 0.24,
//     ip_address: 0.17,
//     location_date: 0.20,
//     location_country: 0.1,
//   };

//   const columns = [
//     {
//       header: "Event",
//       key: "event",
//       width: columnProportions.event * availablePageWidth,
//     },
//     {
//       header: "Email",
//       key: "email",
//       width: columnProportions.email * availablePageWidth,
//     },
//     {
//       header: "IP Address",
//       key: "ip_address",
//       width: columnProportions.ip_address * availablePageWidth,
//     },
//     {
//       header: "Date",
//       key: "location_date",
//       width: columnProportions.location_date * availablePageWidth,
//     },
//     {
//       header: "Country",
//       key: "location_country",
//       width: columnProportions.location_country * availablePageWidth,
//     },
//   ];

//   // Function to wrap text within a specified width
//   const wrapText = (
//     text,
//     font,
//     fontSize,
//     maxWidth,
//     isIPAddress = false,
//     isDate = false
//   ) => {
//     if (isIPAddress || isDate) {
//       // For IP and Date, don't wrap the text, return it as a single array
//       return [text]; // Just return the text as a single element array
//     }

//     const words = text.split(" ");
//     let lines = [];
//     let currentLine = "";
//     for (const word of words) {
//       const testLine = currentLine + word + " ";
//       const testWidth = font.widthOfTextAtSize(testLine, fontSize);
//       if (testWidth > maxWidth) {
//         lines.push(currentLine.trim());
//         currentLine = word + " ";
//       } else {
//         currentLine = testLine;
//       }
//     }
//     lines.push(currentLine.trim());
//     return lines;
//   };

//   // Function to draw headers
//   const drawTableHeaders = async (page, currentY) => {
//     let currentX = margin;

//     // Draw Activity Log Title
//     page.drawText("Audit Log", {
//       x: pageWidth - 100 - margin,
//       y: currentY + fontSize + 10,
//       size: fontSize + 6,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // Draw Document ID
//     page.drawText(`Document ID: ${uniqId}`, {
//       x: pageWidth - 240 - margin,
//       y: currentY + fontSize + 10 - (fontSize + 6 + 10),
//       size: 9,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // Embed the image
//     // Ensure 'logoRequireSign' is defined and accessible
//     const drawLogo = async () => {
//       const imageBytes = await fetch(logoRequireSign).then((res) =>
//         res.arrayBuffer()
//       );
//       const image = await pdfDoc.embedPng(imageBytes);
//       page.drawImage(image, {
//         x: margin,
//         y: currentY,
//         width: 170,
//         height: 50,
//       });
//     };

//     await drawLogo();

//     currentY -= lineHeight + 50;

//     // Draw header row
//     columns.forEach((col) => {
//       page.drawText(col.header, {
//         x: currentX,
//         y: currentY,
//         size: fontSize,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       currentX += col.width;
//     });

//     return currentY - lineHeight; // Update currentY after headers
//   };

//   let currentY = tableTopY;

//   // Draw the initial headers
//   currentY = await drawTableHeaders(currentPage, currentY);

//   // Function to add a new page when needed
//   const addNewPage = async () => {
//     currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
//     currentY = tableTopY;
//     currentY = await drawTableHeaders(currentPage, currentY);
//   };

//   // Define bottom margin
//   const bottomMargin = margin;

//   // Draw table rows
//   for (let rowIndex = 0; rowIndex < ActivityLogData.length; rowIndex++) {
//     const log = ActivityLogData[rowIndex];
//     let currentX = margin;
//     let rowHeight = 0;

//     const cellLines = columns.map((col) => {
//       const text =
//         col.key === "location_date"
//           ? formatDateCustomTimelastActivity(log[col.key])
//           : String(log[col.key]);
//       return wrapText(
//         text,
//         font,
//         fontSize,
//         col.width,
//         col.key === "ip_address",
//         col.key === "location_date"
//       );
//     });

//     // Calculate row height
//     cellLines.forEach((lines) => {
//       rowHeight = Math.max(rowHeight, lines.length * lineHeight);
//     });

//     // Check if we need a new page
//     if (currentY - rowHeight < bottomMargin) {
//       await addNewPage();
//     }

//     // Draw the row
//     columns.forEach((col, colIndex) => {
//       const lines = cellLines[colIndex];
//       lines.forEach((line, i) => {
//         currentPage.drawText(line, {
//           x: currentX,
//           y: currentY - i * lineHeight,
//           size: fontSize,
//           font,
//           color: rgb(0, 0, 0),
//         });
//       });
//       currentX += col.width;
//     });

//     currentY -= rowHeight;
//   }

// }
// Audit trail table

// const wrapText = (text, font, fontSize, maxWidth, columnD) => {
//   const words = text.split(" ");
//   let lines = [];
//   let currentLine = "";
//   console.log("columnD", columnD);
//   let max_length = columnD === "email" ? 35 : 38;
//   // Check if the text is too long (for emails, specifically)
//   if (text.length > max_length) {
//     const maxChars = max_length; // Max characters before wrapping
//     while (text.length > maxChars) {
//       let part = text.slice(0, maxChars);
//       lines.push(part);
//       text = text.slice(maxChars);
//     }
//     if (text.length > 0) lines.push(text);
//   } else {
//     for (const word of words) {
//       const testLine = currentLine + word + " ";
//       const testWidth = font.widthOfTextAtSize(testLine, fontSize);
//       if (testWidth > maxWidth) {
//         lines.push(currentLine.trim());
//         currentLine = word + " ";
//       } else {
//         currentLine = testLine;
//       }
//     }
//     lines.push(currentLine.trim());
//   }

//   return lines;
// };
const wrapText = (text, font, fontSize, maxWidth, columnKey) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  // Estimate character width ratio based on font size, typically around 0.5 to 0.6 of the font size
  const charWidthRatio = 0.5;

  // Calculate max characters based on column width and font size
  const maxCharsPerLine = Math.floor(maxWidth / (fontSize * charWidthRatio));

  // Determine max length dynamically based on column key
  const max_length =
    columnKey === "email" ? maxCharsPerLine : maxCharsPerLine + 3;

  // Wrapping logic based on max_length
  if (text.length > max_length) {
    while (text.length > max_length) {
      let part = text.slice(0, max_length);
      lines.push(part);
      text = text.slice(max_length);
    }
    if (text.length > 0) lines.push(text);
  } else {
    for (const word of words) {
      const testLine = currentLine + word + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
  }

  return lines;
};
const columnProportions = {
  event: 0.24, // 1/3 of the available space
  email: 0.25, // 1/3 of the available space
  ip_details: 0.61, // Combine IP address, Date, and Country into one column
};

const fontSize = 9;
const margin = 20;
const lineHeight = 20;

const formatEventText = (eventText) => {
  return eventText
    .toLowerCase()
    .replace(/-/g, " ") // Replace dashes with spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
// Function to validate height
const validateHeight = (height) => {
  return typeof height === "number" && !isNaN(height) ? height : 40; // fallback to 50 if invalid
};
// end
export const handleDownloadPDFHere = async ({
  setDownloadPdfLoader,
  imageUrls,
  textItems,
  canvasWidth,
  UniqIdDoc,
  ActivityLogData,
  fileName,
  file_id,
  statusData,
  imageUrlsCount,
  user_id,
  doc_completed,
  logo_data,
}) => {
  // console.log(ActivityLogData)
  try {
    setDownloadPdfLoader(true);
    console.log("ActivityLogData");
    console.log(ActivityLogData);
    const response = await fetch(`${imageUrls}`);
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height: pageHeight, width: pageWidth } = pages[0].getSize();
    const xOffset = 10;
    const yOffset = pageHeight - 20;
    const uniqId = UniqIdDoc;
    // start

    // end
    if (UniqIdDoc !== "null") {
      pages.forEach((page) => {
        page.drawText(`Document ID: ${uniqId}`, {
          x: xOffset,
          y: yOffset,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        });
      });
    }

    if (doc_completed === true) {
      // Add the first activity log page
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

      const tableTopY = pageHeight - margin - 50;
      const availablePageWidth = pageWidth - margin * 2;
      const columns = [
        {
          header: "Event",
          key: "event",
          width: columnProportions.event * availablePageWidth,
        },
        {
          header: "User",
          key: "email",
          width: columnProportions.email * availablePageWidth,
        },
        {
          header: "IP & Timestamp",
          key: "ip_details",
          width: columnProportions.ip_details * availablePageWidth,
        },
      ];

      // Function to draw headers
      const drawTableHeaders = async (page, currentY) => {
        let currentX = margin;
        const headerFontSize = fontSize + 2; // Increase font size for headers
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        // Draw Activity Log Title

        page.drawText("Audit Log", {
          x: pageWidth - 100 - margin,
          y: currentY + headerFontSize + 10,
          size: headerFontSize + 4, // Make title even larger
          font: boldFont, // Apply bold font
          color: rgb(0, 0, 0),
        });
        // Draw Document ID
        page.drawText(`Document ID: ${uniqId}`, {
          x: margin,
          y: currentY + fontSize + 10 - (fontSize + 6 + 20),
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Title : ${fileName}.pdf`, {
          x: margin,
          y: currentY + fontSize + 30 - (fontSize + 60),
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });

        // Embed the image
        let img;

        // const drawLogo = async () => {
        //   let imageBytes = null;
        //   if (logo_data === null || logo_data === undefined) {
        //     const imgUrl = `${logoRequireSign}`;
        //     const imgResponse = await fetch(imgUrl);
        //     const imgBytes = await imgResponse.arrayBuffer();
        //     const contentType = imgResponse.headers.get("content-type");
        //     if (contentType === "image/png") {
        //       img = await pdfDoc.embedPng(imgBytes);
        //     } else if (
        //       contentType === "image/jpeg" ||
        //       contentType === "image/jpg"
        //     ) {
        //       img = await pdfDoc.embedJpg(imgBytes);
        //     } else {
        //       throw new Error("Unsupported image type: " + contentType);
        //     }
        //   } else {
        //     const imgUrl = `${logo_data}`;
        //     const imgResponse = await fetch(imgUrl);
        //     const imgBytes = await imgResponse.arrayBuffer();
        //     const contentType = imgResponse.headers.get("content-type");
        //     if (contentType === "image/png") {
        //       img = await pdfDoc.embedPng(imgBytes);
        //     } else if (
        //       contentType === "image/jpeg" ||
        //       contentType === "image/jpg"
        //     ) {
        //       img = await pdfDoc.embedJpg(imgBytes);
        //     } else {
        //       throw new Error("Unsupported image type: " + contentType);
        //     }
        //   }
        //   const logoWidth = 120; // fixed width for logo
        //   const logoHeight = validateHeight(50 * (logoWidth / 150)); // calculate height proportionally

        //   page.drawImage(img, {
        //     x: margin,
        //     y: currentY,
        //     width: logoWidth,
        //     height: logoHeight,
        //   });
        // };
        const drawLogo = async () => {
          let imageBytes = null;
          let imgWidth = 0;
          let imgHeight = 0;

          if (logo_data === null || logo_data === undefined) {
            const imgUrl = `${logoRequireSign}`;
            const imgResponse = await fetch(imgUrl);
            const imgBytes = await imgResponse.arrayBuffer();
            const contentType = imgResponse.headers.get("content-type");

            if (contentType === "image/png") {
              img = await pdfDoc.embedPng(imgBytes);
            } else if (
              contentType === "image/jpeg" ||
              contentType === "image/jpg"
            ) {
              img = await pdfDoc.embedJpg(imgBytes);
            } else {
              throw new Error("Unsupported image type: " + contentType);
            }

            // Get the original image dimensions
            const { width, height } = img;

            // Set the fixed height (e.g., 50px)
            const fixedHeight = 40;
            // Calculate the proportional width to maintain aspect ratio
            imgWidth = (width * fixedHeight) / height;
            imgHeight = fixedHeight;
          } else {
            const imgUrl = `${logo_data}`;
            const imgResponse = await fetch(imgUrl);
            const imgBytes = await imgResponse.arrayBuffer();
            const contentType = imgResponse.headers.get("content-type");

            if (contentType === "image/png") {
              img = await pdfDoc.embedPng(imgBytes);
            } else if (
              contentType === "image/jpeg" ||
              contentType === "image/jpg"
            ) {
              img = await pdfDoc.embedJpg(imgBytes);
            } else {
              throw new Error("Unsupported image type: " + contentType);
            }

            // Get the original image dimensions
            const { width, height } = img;

            // Set the fixed height (e.g., 50px)
            const fixedHeight = 40;
            // Calculate the proportional width to maintain aspect ratio
            imgWidth = (width * fixedHeight) / height;
            imgHeight = fixedHeight;
          }

          // Draw the image on the page
          page.drawImage(img, {
            x: margin,
            y: currentY,
            width: imgWidth, // Use calculated width to maintain aspect ratio
            height: imgHeight, // Fixed height
          });
        };

        await drawLogo();
        currentY -= lineHeight + 50;

        // Draw header row columns
        columns.forEach((col) => {
          let headerX = currentX;
          if (col.key === "email") {
            // Remove centering for email, left-align instead
            headerX = currentX; // Left-aligned email header
          }
          page.drawText(col.header, {
            x: headerX,
            y: currentY,
            size: headerFontSize,
            font: boldFont, // Use bold font for headers
            color: rgb(0, 0, 0),
          });
          //   page.drawText(col.header, {
          //     x: headerX,
          //     y: currentY,
          //     size: fontSize,
          //     font,
          //     color: rgb(0, 0, 0),
          //   });
          currentX += col.width;
        });

        return currentY - lineHeight; // Update currentY after headers
      };

      let currentY = tableTopY;

      // Draw the initial headers
      currentY = await drawTableHeaders(currentPage, currentY);

      // Function to add a new page when needed
      const addNewPage = async () => {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = tableTopY;
        currentY = await drawTableHeaders(currentPage, currentY);
      };

      // Define bottom margin
      const bottomMargin = margin;

      // Draw table rows
      for (let rowIndex = 0; rowIndex < ActivityLogData.length; rowIndex++) {
        const log = ActivityLogData[rowIndex];
        let currentX = margin;
        let rowHeight = 0;

        // Combine IP address, Date, and Country into separate lines
        const ip =
          log["ip_address"] && log["ip_address"] !== "-"
            ? log["ip_address"]
            : "-";
        const date =
          log["location_date"] && log["location_date"] !== "-"
            ? formatDateTimeActivityLog(log["location_date"])
            : "-";
        const country =
          log["location_country"] && log["location_country"] !== "-"
            ? log["location_country"]
            : "-";
        const ipDetails = ip !== "-" ? `${ip}` : "-";
        const additionalDetails =
          date !== "-" && country !== "-" ? `${date} (${country})` : "-";

        const cellLines = columns.map((col) => {
          const text =
            col.key === "event"
              ? formatEventText(String(log[col.key]))
              : col.key === "ip_details"
              ? ipDetails
              : String(log[col.key]);
          return wrapText(text, font, fontSize, col.width, col.key);
        });

        if (columns[2].key === "ip_details" && additionalDetails !== "-") {
          const additionalLines = wrapText(
            additionalDetails,
            font,
            fontSize,
            columns[2].width,
            "ip_details"
          );
          cellLines[2].push(...additionalLines);
        }

        cellLines.forEach((lines) => {
          rowHeight = Math.max(rowHeight, lines.length * lineHeight);
        });

        if (currentY - rowHeight < bottomMargin) {
          await addNewPage();
        }

        columns.forEach((col, colIndex) => {
          const lines = cellLines[colIndex];
          let textX = currentX;

          lines.forEach((line, i) => {
            currentPage.drawText(line, {
              x: col.key === "email" ? textX : currentX,
              y: currentY - i * lineHeight,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
          });
          currentX += col.width;
        });

        currentY -= validateHeight(rowHeight);
      }
    }

    const pdfWidth = pages[0].getWidth();
    const scaleFactor = pdfWidth / canvasWidth;
    if (!Array.isArray(textItems)) {
      throw new Error("textItems is not an array or is undefined");
    }
    await embedImages(pdfDoc, pages, textItems, scaleFactor);
    await drawText(pdfDoc, pages, textItems, scaleFactor, UniqIdDoc);

    const modifiedPdfBytes = await pdfDoc.save();
    console.log("textItems");

    console.log(textItems);
    if (statusData === "receiver") {
      await uploadModifiedPdfReceiver(
        modifiedPdfBytes,
        file_id,
        user_id,
        fileName
      );
    } else {
      await uploadModifiedPdf(modifiedPdfBytes, file_id, user_id, fileName);
    }
    // downloadPDF(modifiedPdfBytes, fileName);
    // setDownloadPdfLoader(false);
  } catch (error) {
    // setDownloadPdfLoader(false);

    console.log("Error downloading PDF:", error);

    return {
      error: true,
    };
    // setDownloadPdfLoader(false);
    // console.log("Error downloading PDF:", error);
  }
};

// template
export const handleDownloadPDFHereTemp = async ({
  setDownloadPdfLoader,
  imageUrls,
  textItems,
  canvasWidth,
  UniqIdDoc,
  ActivityLogData,
  fileName,
  file_id,
  statusData,
  imageUrlsCount,
  user_id,
  doc_completed,
  logo_data,
}) => {
  try {
    setDownloadPdfLoader(true);
    console.log("ActivityLogData");
    console.log(ActivityLogData);
    const response = await fetch(`${imageUrls}`);
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    // draw uniq id on top left corner on each page of pdf doc
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height: pageHeight, width: pageWidth } = pages[0].getSize();
    const xOffset = 10;
    // const yOffset = 26;
    const yOffset = pageHeight - 20;
    const uniqId = UniqIdDoc;
    if (UniqIdDoc === "null") {
    } else {
      pages.forEach((page) => {
        page.drawText(`Document ID: ${uniqId}`, {
          x: xOffset,
          // y: pageHeight - yOffset,
          y: yOffset,

          size: 10,
          font,
          color: rgb(0, 0, 0),
        });
      });
    }

    if (doc_completed === true) {
      // Add the first activity log page
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

      const tableTopY = pageHeight - margin - 50;
      const availablePageWidth = pageWidth - margin * 2;
      const columns = [
        {
          header: "Event",
          key: "event",
          width: columnProportions.event * availablePageWidth,
        },
        {
          header: "User",
          key: "email",
          width: columnProportions.email * availablePageWidth,
        },
        {
          header: "IP & Timestamp",
          key: "ip_details",
          width: columnProportions.ip_details * availablePageWidth,
        },
      ];

      // Function to draw headers
      const drawTableHeaders = async (page, currentY) => {
        let currentX = margin;
        const headerFontSize = fontSize + 2; // Increase font size for headers
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        // Draw Activity Log Title

        page.drawText("Audit Log", {
          x: pageWidth - 100 - margin,
          y: currentY + headerFontSize + 10,
          size: headerFontSize + 4, // Make title even larger
          font: boldFont, // Apply bold font
          color: rgb(0, 0, 0),
        });
        // Draw Document ID
        page.drawText(`Document ID: ${uniqId}`, {
          x: margin,
          y: currentY + fontSize + 10 - (fontSize + 6 + 20),
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Title : ${fileName}.pdf`, {
          x: margin,
          y: currentY + fontSize + 30 - (fontSize + 60),
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });

        // Embed the image
        let img;

        // const drawLogo = async () => {
        //   let imageBytes = null;
        //   if (logo_data === null || logo_data === undefined) {
        //     const imgUrl = `${logoRequireSign}`;
        //     const imgResponse = await fetch(imgUrl);
        //     const imgBytes = await imgResponse.arrayBuffer();
        //     const contentType = imgResponse.headers.get("content-type");
        //     if (contentType === "image/png") {
        //       img = await pdfDoc.embedPng(imgBytes);
        //     } else if (
        //       contentType === "image/jpeg" ||
        //       contentType === "image/jpg"
        //     ) {
        //       img = await pdfDoc.embedJpg(imgBytes);
        //     } else {
        //       throw new Error("Unsupported image type: " + contentType);
        //     }
        //   } else {
        //     const imgUrl = `${logo_data}`;
        //     const imgResponse = await fetch(imgUrl);
        //     const imgBytes = await imgResponse.arrayBuffer();
        //     const contentType = imgResponse.headers.get("content-type");
        //     if (contentType === "image/png") {
        //       img = await pdfDoc.embedPng(imgBytes);
        //     } else if (
        //       contentType === "image/jpeg" ||
        //       contentType === "image/jpg"
        //     ) {
        //       img = await pdfDoc.embedJpg(imgBytes);
        //     } else {
        //       throw new Error("Unsupported image type: " + contentType);
        //     }
        //   }
        //   const logoWidth = 120; // fixed width for logo
        //   const logoHeight = validateHeight(50 * (logoWidth / 150)); // calculate height proportionally

        //   page.drawImage(img, {
        //     x: margin,
        //     y: currentY,
        //     width: logoWidth,
        //     height: logoHeight,
        //   });
        // };
        const drawLogo = async () => {
          let imageBytes = null;
          let imgWidth = 0;
          let imgHeight = 0;

          if (logo_data === null || logo_data === undefined) {
            const imgUrl = `${logoRequireSign}`;
            const imgResponse = await fetch(imgUrl);
            const imgBytes = await imgResponse.arrayBuffer();
            const contentType = imgResponse.headers.get("content-type");

            if (contentType === "image/png") {
              img = await pdfDoc.embedPng(imgBytes);
            } else if (
              contentType === "image/jpeg" ||
              contentType === "image/jpg"
            ) {
              img = await pdfDoc.embedJpg(imgBytes);
            } else {
              throw new Error("Unsupported image type: " + contentType);
            }

            // Get the original image dimensions
            const { width, height } = img;

            // Set the fixed height (e.g., 50px)
            const fixedHeight = 40;
            // Calculate the proportional width to maintain aspect ratio
            imgWidth = (width * fixedHeight) / height;
            imgHeight = fixedHeight;
          } else {
            const imgUrl = `${logo_data}`;
            const imgResponse = await fetch(imgUrl);
            const imgBytes = await imgResponse.arrayBuffer();
            const contentType = imgResponse.headers.get("content-type");

            if (contentType === "image/png") {
              img = await pdfDoc.embedPng(imgBytes);
            } else if (
              contentType === "image/jpeg" ||
              contentType === "image/jpg"
            ) {
              img = await pdfDoc.embedJpg(imgBytes);
            } else {
              throw new Error("Unsupported image type: " + contentType);
            }

            // Get the original image dimensions
            const { width, height } = img;

            // Set the fixed height (e.g., 50px)
            const fixedHeight = 40;
            // Calculate the proportional width to maintain aspect ratio
            imgWidth = (width * fixedHeight) / height;
            imgHeight = fixedHeight;
          }

          // Draw the image on the page
          page.drawImage(img, {
            x: margin,
            y: currentY,
            width: imgWidth, // Use calculated width to maintain aspect ratio
            height: imgHeight, // Fixed height
          });
        };

        await drawLogo();
        currentY -= lineHeight + 50;

        // Draw header row columns
        columns.forEach((col) => {
          let headerX = currentX;
          if (col.key === "email") {
            // Remove centering for email, left-align instead
            headerX = currentX; // Left-aligned email header
          }
          page.drawText(col.header, {
            x: headerX,
            y: currentY,
            size: headerFontSize,
            font: boldFont, // Use bold font for headers
            color: rgb(0, 0, 0),
          });
          //   page.drawText(col.header, {
          //     x: headerX,
          //     y: currentY,
          //     size: fontSize,
          //     font,
          //     color: rgb(0, 0, 0),
          //   });
          currentX += col.width;
        });

        return currentY - lineHeight; // Update currentY after headers
      };

      let currentY = tableTopY;

      // Draw the initial headers
      currentY = await drawTableHeaders(currentPage, currentY);

      // Function to add a new page when needed
      const addNewPage = async () => {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = tableTopY;
        currentY = await drawTableHeaders(currentPage, currentY);
      };

      // Define bottom margin
      const bottomMargin = margin;

      // Draw table rows
      for (let rowIndex = 0; rowIndex < ActivityLogData.length; rowIndex++) {
        const log = ActivityLogData[rowIndex];
        let currentX = margin;
        let rowHeight = 0;

        // Combine IP address, Date, and Country into separate lines
        const ip =
          log["ip_address"] && log["ip_address"] !== "-"
            ? log["ip_address"]
            : "-";
        const date =
          log["location_date"] && log["location_date"] !== "-"
            ? formatDateTimeActivityLog(log["location_date"])
            : "-";
        const country =
          log["location_country"] && log["location_country"] !== "-"
            ? log["location_country"]
            : "-";
        const ipDetails = ip !== "-" ? `${ip}` : "-";
        const additionalDetails =
          date !== "-" && country !== "-" ? `${date} (${country})` : "-";

        const cellLines = columns.map((col) => {
          const text =
            col.key === "event"
              ? formatEventText(String(log[col.key]))
              : col.key === "ip_details"
              ? ipDetails
              : String(log[col.key]);
          return wrapText(text, font, fontSize, col.width, col.key);
        });

        if (columns[2].key === "ip_details" && additionalDetails !== "-") {
          const additionalLines = wrapText(
            additionalDetails,
            font,
            fontSize,
            columns[2].width,
            "ip_details"
          );
          cellLines[2].push(...additionalLines);
        }

        cellLines.forEach((lines) => {
          rowHeight = Math.max(rowHeight, lines.length * lineHeight);
        });

        if (currentY - rowHeight < bottomMargin) {
          await addNewPage();
        }

        columns.forEach((col, colIndex) => {
          const lines = cellLines[colIndex];
          let textX = currentX;

          lines.forEach((line, i) => {
            currentPage.drawText(line, {
              x: col.key === "email" ? textX : currentX,
              y: currentY - i * lineHeight,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
          });
          currentX += col.width;
        });

        currentY -= validateHeight(rowHeight);
      }
    }
    const pdfWidth = pages[0].getWidth();
    const scaleFactor = pdfWidth / canvasWidth;
    if (!Array.isArray(textItems)) {
      throw new Error("textItems is not an array or is undefined");
    }
    await embedImages(pdfDoc, pages, textItems, scaleFactor);
    await drawText(pdfDoc, pages, textItems, scaleFactor, UniqIdDoc);

    const modifiedPdfBytes = await pdfDoc.save();
    console.log("textItems");

    console.log(textItems);
    // if (statusData === "receiver") {
    //   await uploadModifiedPdfReceiver(modifiedPdfBytes, file_id);
    // } else {
    //   await uploadModifiedPdf(modifiedPdfBytes, file_id);
    // }
    let returningdata;
    // uncomment this code
    if (statusData === "receiver") {
      console.log("receibver data ");
      returningdata = await updateTemplatePositionsReceiver(
        modifiedPdfBytes,
        file_id,
        user_id,
        fileName
      );
      return returningdata;
    } else {
      await updateTemplatePositions(
        modifiedPdfBytes,
        file_id,
        user_id,
        fileName
      );
    }
    // downloadPDF(modifiedPdfBytes, fileName);
    // setDownloadPdfLoader(false);
  } catch (error) {
    setDownloadPdfLoader(false);
    console.log("Error downloading PDF:", error);
  }
};
// bulk link
export const handleDownloadPDFHereBulk = async ({
  setDownloadPdfLoader,
  imageUrls,
  textItems,
  canvasWidth,
  UniqIdDoc,
  ActivityLogData,
  fileName,
  file_id,
  statusData,
  imageUrlsCount,
  user_id,
  doc_completed,
  logo_data,
}) => {
  try {
    setDownloadPdfLoader(true);
    console.log("ActivityLogData");
    console.log(ActivityLogData);
    const response = await fetch(`${imageUrls}`);
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    // draw uniq id on top left corner on each page of pdf doc
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height: pageHeight, width: pageWidth } = pages[0].getSize();
    const xOffset = 10;
    // const yOffset = 26;
    const yOffset = pageHeight - 20;
    const uniqId = UniqIdDoc;
    if (UniqIdDoc === "null") {
    } else {
      pages.forEach((page) => {
        page.drawText(`Document ID: ${uniqId}`, {
          x: xOffset,
          // y: pageHeight - yOffset,
          y: yOffset,

          size: 10,
          font,
          color: rgb(0, 0, 0),
        });
      });
    }

    if (doc_completed === true) {
      // Add the first activity log page
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

      const tableTopY = pageHeight - margin - 50;
      const availablePageWidth = pageWidth - margin * 2;
      const columns = [
        {
          header: "Event",
          key: "event",
          width: columnProportions.event * availablePageWidth,
        },
        {
          header: "User",
          key: "email",
          width: columnProportions.email * availablePageWidth,
        },
        {
          header: "IP & Timestamp",
          key: "ip_details",
          width: columnProportions.ip_details * availablePageWidth,
        },
      ];

      // Function to draw headers
      const drawTableHeaders = async (page, currentY) => {
        let currentX = margin;
        const headerFontSize = fontSize + 2; // Increase font size for headers
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        // Draw Activity Log Title

        page.drawText("Audit Log", {
          x: pageWidth - 100 - margin,
          y: currentY + headerFontSize + 10,
          size: headerFontSize + 4, // Make title even larger
          font: boldFont, // Apply bold font
          color: rgb(0, 0, 0),
        });
        // Draw Document ID
        page.drawText(`Document ID: ${uniqId}`, {
          x: margin,
          y: currentY + fontSize + 10 - (fontSize + 6 + 20),
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Title : ${fileName}.pdf`, {
          x: margin,
          y: currentY + fontSize + 30 - (fontSize + 60),
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });

        // Embed the image
        let img;

        // const drawLogo = async () => {
        //   let imageBytes = null;
        //   if (logo_data === null || logo_data === undefined) {
        //     const imgUrl = `${logoRequireSign}`;
        //     const imgResponse = await fetch(imgUrl);
        //     const imgBytes = await imgResponse.arrayBuffer();
        //     const contentType = imgResponse.headers.get("content-type");
        //     if (contentType === "image/png") {
        //       img = await pdfDoc.embedPng(imgBytes);
        //     } else if (
        //       contentType === "image/jpeg" ||
        //       contentType === "image/jpg"
        //     ) {
        //       img = await pdfDoc.embedJpg(imgBytes);
        //     } else {
        //       throw new Error("Unsupported image type: " + contentType);
        //     }
        //   } else {
        //     const imgUrl = `${logo_data}`;
        //     const imgResponse = await fetch(imgUrl);
        //     const imgBytes = await imgResponse.arrayBuffer();
        //     const contentType = imgResponse.headers.get("content-type");
        //     if (contentType === "image/png") {
        //       img = await pdfDoc.embedPng(imgBytes);
        //     } else if (
        //       contentType === "image/jpeg" ||
        //       contentType === "image/jpg"
        //     ) {
        //       img = await pdfDoc.embedJpg(imgBytes);
        //     } else {
        //       throw new Error("Unsupported image type: " + contentType);
        //     }
        //   }
        //   const logoWidth = 120; // fixed width for logo
        //   const logoHeight = validateHeight(50 * (logoWidth / 150)); // calculate height proportionally

        //   page.drawImage(img, {
        //     x: margin,
        //     y: currentY,
        //     width: logoWidth,
        //     height: logoHeight,
        //   });
        // };
        const drawLogo = async () => {
          let imageBytes = null;
          let imgWidth = 0;
          let imgHeight = 0;

          if (logo_data === null || logo_data === undefined) {
            const imgUrl = `${logoRequireSign}`;
            const imgResponse = await fetch(imgUrl);
            const imgBytes = await imgResponse.arrayBuffer();
            const contentType = imgResponse.headers.get("content-type");

            if (contentType === "image/png") {
              img = await pdfDoc.embedPng(imgBytes);
            } else if (
              contentType === "image/jpeg" ||
              contentType === "image/jpg"
            ) {
              img = await pdfDoc.embedJpg(imgBytes);
            } else {
              throw new Error("Unsupported image type: " + contentType);
            }

            // Get the original image dimensions
            const { width, height } = img;

            // Set the fixed height (e.g., 50px)
            const fixedHeight = 40;
            // Calculate the proportional width to maintain aspect ratio
            imgWidth = (width * fixedHeight) / height;
            imgHeight = fixedHeight;
          } else {
            const imgUrl = `${logo_data}`;
            const imgResponse = await fetch(imgUrl);
            const imgBytes = await imgResponse.arrayBuffer();
            const contentType = imgResponse.headers.get("content-type");

            if (contentType === "image/png") {
              img = await pdfDoc.embedPng(imgBytes);
            } else if (
              contentType === "image/jpeg" ||
              contentType === "image/jpg"
            ) {
              img = await pdfDoc.embedJpg(imgBytes);
            } else {
              throw new Error("Unsupported image type: " + contentType);
            }

            // Get the original image dimensions
            const { width, height } = img;

            // Set the fixed height (e.g., 50px)
            const fixedHeight = 40;
            // Calculate the proportional width to maintain aspect ratio
            imgWidth = (width * fixedHeight) / height;
            imgHeight = fixedHeight;
          }

          // Draw the image on the page
          page.drawImage(img, {
            x: margin,
            y: currentY,
            width: imgWidth, // Use calculated width to maintain aspect ratio
            height: imgHeight, // Fixed height
          });
        };

        await drawLogo();
        currentY -= lineHeight + 50;

        // Draw header row columns
        columns.forEach((col) => {
          let headerX = currentX;
          if (col.key === "email") {
            // Remove centering for email, left-align instead
            headerX = currentX; // Left-aligned email header
          }
          page.drawText(col.header, {
            x: headerX,
            y: currentY,
            size: headerFontSize,
            font: boldFont, // Use bold font for headers
            color: rgb(0, 0, 0),
          });
          //   page.drawText(col.header, {
          //     x: headerX,
          //     y: currentY,
          //     size: fontSize,
          //     font,
          //     color: rgb(0, 0, 0),
          //   });
          currentX += col.width;
        });

        return currentY - lineHeight; // Update currentY after headers
      };

      let currentY = tableTopY;

      // Draw the initial headers
      currentY = await drawTableHeaders(currentPage, currentY);

      // Function to add a new page when needed
      const addNewPage = async () => {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = tableTopY;
        currentY = await drawTableHeaders(currentPage, currentY);
      };

      // Define bottom margin
      const bottomMargin = margin;

      // Draw table rows
      for (let rowIndex = 0; rowIndex < ActivityLogData.length; rowIndex++) {
        const log = ActivityLogData[rowIndex];
        let currentX = margin;
        let rowHeight = 0;

        // Combine IP address, Date, and Country into separate lines
        const ip =
          log["ip_address"] && log["ip_address"] !== "-"
            ? log["ip_address"]
            : "-";
        const date =
          log["location_date"] && log["location_date"] !== "-"
            ? formatDateTimeActivityLog(log["location_date"])
            : "-";
        const country =
          log["location_country"] && log["location_country"] !== "-"
            ? log["location_country"]
            : "-";
        const ipDetails = ip !== "-" ? `${ip}` : "-";
        const additionalDetails =
          date !== "-" && country !== "-" ? `${date} (${country})` : "-";

        const cellLines = columns.map((col) => {
          const text =
            col.key === "event"
              ? formatEventText(String(log[col.key]))
              : col.key === "ip_details"
              ? ipDetails
              : String(log[col.key]);
          return wrapText(text, font, fontSize, col.width, col.key);
        });

        if (columns[2].key === "ip_details" && additionalDetails !== "-") {
          const additionalLines = wrapText(
            additionalDetails,
            font,
            fontSize,
            columns[2].width,
            "ip_details"
          );
          cellLines[2].push(...additionalLines);
        }

        cellLines.forEach((lines) => {
          rowHeight = Math.max(rowHeight, lines.length * lineHeight);
        });

        if (currentY - rowHeight < bottomMargin) {
          await addNewPage();
        }

        columns.forEach((col, colIndex) => {
          const lines = cellLines[colIndex];
          let textX = currentX;

          lines.forEach((line, i) => {
            currentPage.drawText(line, {
              x: col.key === "email" ? textX : currentX,
              y: currentY - i * lineHeight,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
          });
          currentX += col.width;
        });

        currentY -= validateHeight(rowHeight);
      }
    }
    const pdfWidth = pages[0].getWidth();
    const scaleFactor = pdfWidth / canvasWidth;

    if (!Array.isArray(textItems)) {
      throw new Error("textItems is not an array or is undefined");
    }
    await embedImages(pdfDoc, pages, textItems, scaleFactor);
    await drawText(pdfDoc, pages, textItems, scaleFactor, UniqIdDoc);

    const modifiedPdfBytes = await pdfDoc.save();
    console.log("textItems");

    console.log(textItems);
    // if (statusData === "receiver") {
    //   await uploadModifiedPdfReceiver(modifiedPdfBytes, file_id);
    // } else {
    //   await uploadModifiedPdf(modifiedPdfBytes, file_id);
    // }
    let returningdata;
    // uncomment this code
    if (statusData === "receiver") {
      console.log("receibver data ");
      returningdata = await updateBulkLinkPositionsReceiver(
        modifiedPdfBytes,
        file_id,
        user_id,
        fileName
      );
      return returningdata;
    } else {
      await updateBulkLinkPositions(
        modifiedPdfBytes,
        file_id,
        user_id,
        fileName
      );
    }
    // downloadPDF(modifiedPdfBytes, fileName);
    // setDownloadPdfLoader(false);
  } catch (error) {
    setDownloadPdfLoader(false);
    console.log("Error downloading PDF:", error);
  }
};

const uploadModifiedPdfReceiver = async (
  pdfBytes,
  file_id,
  user_id,
  fileName
) => {
  console.log("uploadModifiedPdfReceiver");
  const file = new File([pdfBytes], `${fileName}.pdf`, {
    type: "application/pdf",
  });
  console.log(file);
  const postData = {
    image: file,
    user_id: user_id,
    file_id: file_id,
  };

  try {
    const apiData = await postFormDataPdfReplace(postData, (progress) => {
      console.log(progress);
    });
    console.log(apiData);
    if (apiData.error === true || apiData.error === "true") {
      console.log("Error Downloading and uploading Files");
    } else {
      const postData1 = {
        file_id: file_id,
        image: apiData.public_url,
      };
      console.log("apiData.path");

      console.log(apiData.public_url);
      const apiData2 = await post("file/updatebgimgsReceiver", postData1);
      console.log("apiData2");

      console.log(apiData2);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
const uploadModifiedPdf = async (pdfBytes, file_id, user_id, fileName) => {
  const file = new File([pdfBytes], `${fileName}.pdf`, {
    type: "application/pdf",
  });
  console.log(file);
  const postData = {
    image: file,
    user_id: user_id,
  };

  try {
    const apiData = await postFormDataPdf(postData, (progress) => {
      console.log(progress);
    });
    console.log(apiData);
    if (apiData.error === true || apiData.error === "true") {
      console.log("Error Downloading and uploading Files");
    } else {
      const postData1 = {
        file_id: file_id,
        image: apiData?.public_url,
      };
      console.log("apiData.path");

      console.log(apiData.public_url);
      const apiData2 = await post("file/updatebgimgs", postData1);
      console.log("apiData2");

      console.log(apiData2);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
  // const formData = new FormData();
  // formData.append('file', blob, 'modified.pdf');

  // // Assuming you have an API endpoint to upload the file
  // const response = await fetch(`${BASE_URL}/upload`, {
  //   method: 'POST',
  //   body: formData,
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to upload the modified PDF');
  // }
};
const updateTemplatePositions = async (
  pdfBytes,
  file_id,
  user_id,
  fileName
) => {
  const file = new File([pdfBytes], `${fileName}.pdf`, {
    type: "application/pdf",
  });
  console.log(file);
  const postData = {
    image: file,
    user_id: user_id,
  };

  try {
    const apiData = await postFormDataPdf(postData, (progress) => {
      console.log(progress);
    });
    console.log(apiData);
    if (apiData.error === true || apiData.error === "true") {
      console.log("Error Downloading and uploading Files");
    } else {
      const postData1 = {
        file_id: file_id,
        image: apiData.public_url,
      };
      console.log("apiData.public_url");

      console.log(apiData.public_url);
      const apiData2 = await post("template/updatebgimgs", postData1);
      console.log("apiData2");

      console.log(apiData2);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
  // const formData = new FormData();
  // formData.append('file', blob, 'modified.pdf');

  // // Assuming you have an API endpoint to upload the file
  // const response = await fetch(`${BASE_URL}/upload`, {
  //   method: 'POST',
  //   body: formData,
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to upload the modified PDF');
  // }
};
const updateTemplatePositionsReceiver = async (
  pdfBytes,
  file_id,
  user_id,
  fileName
) => {
  console.log("uploadModifiedPdfReceiver");

  const file = new File([pdfBytes], `${fileName}.pdf`, {
    type: "application/pdf",
  });
  console.log("file RECEIUVER");

  console.log(file);
  const postData = {
    image: file,
    user_id: user_id,
    // file_id: file_id,
  };

  try {
    const apiData = await postFormDataPdf(postData, (progress) => {
      console.log(progress);
    });
    console.log(apiData);
    if (apiData.error === true || apiData.error === "true") {
      console.log("Error Downloading and uploading Files");
    } else {
      const postData1 = {
        file_id: file_id,
        image: apiData.public_url,
      };
      console.log("apiData.public_url");

      console.log(apiData.public_url);
      return apiData.public_url;
      // const apiData2 = await post("template/updatebgimgs", postData1);
      // console.log("apiData2");

      // console.log(apiData2);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
const updateBulkLinkPositions = async (
  pdfBytes,
  file_id,
  user_id,
  fileName
) => {
  const file = new File([pdfBytes], `${fileName}.pdf`, {
    type: "application/pdf",
  });
  console.log(file);
  const postData = {
    image: file,
    user_id: user_id,
  };

  try {
    const apiData = await postFormDataPdf(postData, (progress) => {
      console.log(progress);
    });
    console.log(apiData);
    if (apiData.error === true || apiData.error === "true") {
      console.log("Error Downloading and uploading Files");
    } else {
      const postData1 = {
        bulk_link_id: file_id,
        url: apiData.public_url,
        file_name: fileName,
      };
      console.log("apiData.public_url");

      console.log(apiData.public_url);
      const apiData2 = await post("bulk_links/updateBulkLink", postData1);
      console.log("apiData2");

      console.log(apiData2);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
  // const formData = new FormData();
  // formData.append('file', blob, 'modified.pdf');

  // // Assuming you have an API endpoint to upload the file
  // const response = await fetch(`${BASE_URL}/upload`, {
  //   method: 'POST',
  //   body: formData,
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to upload the modified PDF');
  // }
};
const updateBulkLinkPositionsReceiver = async (
  pdfBytes,
  file_id,
  user_id,
  fileName
) => {
  const file = new File([pdfBytes], `${fileName}.pdf`, {
    type: "application/pdf",
  });
  console.log(file);
  const postData = {
    image: file,
    user_id: user_id,
  };

  try {
    const apiData = await postFormDataPdf(postData, (progress) => {
      console.log(progress);
    });
    console.log(apiData);
    if (apiData.error === true || apiData.error === "true") {
      console.log("Error Downloading and uploading Files");
    } else {
      const postData1 = {
        file_id: file_id,
        image: apiData.public_url,
      };
      console.log("apiData.public_url");

      console.log(apiData.public_url);
      return apiData.public_url;
      // const apiData2 = await post("template/updatebgimgs", postData1);
      // console.log("apiData2");

      // console.log(apiData2);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
const embedImages = async (pdfDoc, pages, textItems, scaleFactor) => {
  console.log(textItems);
  const imagePromises = textItems.map(async (field) => {
    if (
      [
        "my_signature",

        "stamp",
        "my_initials",
        "signer_initials",
        "signer_initials_text",
        "signer_chooseImgDrivingL",
        "signer_chooseImgPassportPhoto",
        "signer_chooseImgStamp",
      ].includes(field.type)
    ) {
      const imgUrl = `${field.url}`;
      const imgResponse = await fetch(imgUrl);
      const imgBytes = await imgResponse.arrayBuffer();
      const contentType = imgResponse.headers.get("content-type");
      let img;
      if (contentType === "image/png") {
        img = await pdfDoc.embedPng(imgBytes);
      } else if (contentType === "image/jpeg" || contentType === "image/jpg") {
        img = await pdfDoc.embedJpg(imgBytes);
      } else {
        throw new Error("Unsupported image type: " + contentType);
      }

      return { img, field };
    }
    return null;
  });

  const images = await Promise.all(imagePromises);
  for (const image of images) {
    if (image) {
      const { img, field } = image;
      const { x, y, width, height, page_no } = field;
      const page = pages[page_no - 1];

      // Calculate aspect ratio and fit within the specified width and height
      const imgDims = img.scale(1);
      const aspectRatio = imgDims.width / imgDims.height;
      let imgWidth = width;
      let imgHeight = height;

      if (imgWidth / imgHeight > aspectRatio) {
        imgWidth = imgHeight * aspectRatio;
      } else {
        imgHeight = imgWidth / aspectRatio;
      }

      // const adjustedX = x * scaleFactor + (width * scaleFactor - imgWidth) / 2;
      // const adjustedY = page.getHeight() - y * scaleFactor - imgHeight;
      const adjustedX = x + (width - imgWidth) / 2;
      const adjustedY = page.getHeight() - y - imgHeight;

      page.drawImage(img, {
        x: adjustedX,
        y: adjustedY,
        width: imgWidth,
        height: imgHeight,
      });
    }
  }
};

const drawText = async (pdfDoc, pages, textItems, scaleFactor, UniqIdDoc) => {
  console.log("T~Est");
  for (const field of textItems) {
    const {
      x,
      y,
      width,
      height,
      text,
      fontSize,
      fontFamily,
      fontStyle,
      textDecoration,
      page_no,
    } = field;
    const page = pages[page_no - 1];
    const textSize = fontSize;
    // console.log("field", field);
    const xOffset = 12; // Adjust this value as needed for horizontal alignment
    const yOffset = -12;
    let FontText = await getFont(pdfDoc, fontFamily, fontStyle);
    // console.log("FontText", FontText);
    if (["my_text", "signer_text"].includes(field.type)) {
      // Adjust y-coordinate for baseline alignment
      const textY =
        page.getHeight() - y * scaleFactor - textSize * 0.3 + yOffset;
      const { height: pageHeight } = page.getSize();
      page.drawText(text, {
        x: x + xOffset,
        y: pageHeight - y - fontSize,

        size: textSize,
        color: rgb(0, 0, 0),
        font: FontText,
      });
      if (field.fontWeight === 600) {
        page.drawText(text, {
          x: x + xOffset,
          y: pageHeight - y - fontSize,
          size: textSize,
          color: rgb(0, 0, 0), // Assuming color is in RGB format
          font: FontText,
        });
      }
      // const underlineY = pageHeight - y - fontSize + yOffset - 2;
      // page.drawLine({
      //   start: { x: x + xOffset, y: underlineY },
      //   end: { x: x + xOffset + width, y: underlineY },
      //   thickness: 0.5,
      //   color: rgb(0, 0, 0),
      // });
      if (textDecoration === "underline") {
        const underlineoffset = -3;
        const underlineY = pageHeight - y - fontSize + underlineoffset - 2;
        page.drawLine({
          start: { x: x + xOffset, y: underlineY },
          end: { x: x + xOffset + width, y: underlineY },
          thickness: 0.5,
          color: rgb(0, 0, 0),
        });
        //   const underlineY = textY - 2;
        //   page.drawLine({
        //     start: {x: x * scaleFactor, y: underlineY},
        //     end: {x: (x + width) * scaleFactor, y: underlineY},
        //     thickness: 0.5,
        //     color: rgb(0, 0, 0),
        //   });
      }
    } else if (
      ["checkmark", "signer_checkmark"].includes(field.type) &&
      field.text === true
    ) {
      const imgUrl = `${check}`;
      const imgResponse = await fetch(imgUrl);
      const imgBytes = await imgResponse.arrayBuffer();
      let img = await pdfDoc.embedPng(imgBytes);
      let imgWidth = 10;
      let imgHeight = 10;
      const adjustedX = x + (width - imgWidth) / 2;
      const adjustedY = page.getHeight() - y - imgHeight;
      const xOffsetC = 7;
      const { height: pageHeight } = page.getSize();
      page.drawImage(img, {
        // x: adjustedX,
        // y: adjustedY,
        x: x + xOffsetC,

        y: pageHeight - y - fontSize,
        width: imgWidth,
        height: imgHeight,
      });
      // const zapfDingbatsFont = await pdfDoc.embedFont(
      //   StandardFonts.ZapfDingbats
      // );
      // // const checkmarkY = page.getHeight() - y * scaleFactor - textSize * 0.75 + 5;
      // const { height: pageHeight } = page.getSize();
      // const xOffsetC = 7;
      // const adjustedY = pageHeight - y - fontSize * 0.5 + yOffset;
      // // page.drawText('✔', {
      // //   x: x * scaleFactor + 4,
      // //   y: checkmarkY,
      // page.drawText("✓", {
      //   x: x + xOffsetC,
      //   // y: pageHeight - y - fontSize + yOffset,
      //   // y: adjustedY,
      //   y: pageHeight - y - fontSize,

      //   size: textSize,
      //   color: rgb(0, 0, 0),
      //   font: zapfDingbatsFont,
      // });
    } else if (["date", "signer_date"].includes(field.type)) {
      const formattedDate = formatDateEditor(field.text, field.format);
      const timesRomanBoldFont = await pdfDoc.embedFont(
        StandardFonts.TimesRomanBold
      );
      // const dateY = page.getHeight() - y * scaleFactor - textSize * 0.3;

      // page.drawText(formattedDate, {
      //   x: x * scaleFactor,
      //   y: dateY,
      const { height: pageHeight } = page.getSize();
      page.drawText(formattedDate, {
        x: x + xOffset,
        y: pageHeight - y - fontSize,
        // y: pageHeight - y - fontSize + yOffset,
        size: textSize,
        color: rgb(0, 0, 0),
        font: timesRomanBoldFont,
      });
    } else if (field.type === "highlight") {
      const xOffsetHighlifht = 2;
      const yOffsetHighlight = -1;

      const { height: pageHeight } = page.getSize();

      const adjustedY = pageHeight - y - height + yOffsetHighlight;
      // const highlightY = page.getHeight() - y * scaleFactor - height * scaleFactor;

      // page.drawRectangle({
      //   x: x * scaleFactor,
      //   y: highlightY,
      page.drawRectangle({
        x: x + xOffsetHighlifht,
        // y: pageHeight - y - height + yOffset,
        y: adjustedY,
        width: width,
        height: height,
        color: rgb(255 / 255, 255 / 255, 0),
        borderWidth: 0,
        opacity: 0.3,
      });
    }
  }
};
const formatDateEditor = (dateString, format) => {
  let formattedDate = "";
  switch (format) {
    case "m/d/y":
      formattedDate = formatDateUSA(dateString);
      break;
    case "d/m/y":
      formattedDate = formatDateInternational(dateString);
      break;
    case "m-d-y":
      formattedDate = formatDateCustom(dateString);
      break;
    default:
      formattedDate = formatDateUSA(dateString); // Default format
      break;
  }
  return formattedDate;
};
const getFont = async (pdfDoc, fontFamily, fontStyle) => {
  if (fontFamily === "Times New Roman") {
    return fontStyle === "italic"
      ? await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)
      : await pdfDoc.embedFont(StandardFonts.TimesRoman);
  } else if (fontFamily === "Courier New") {
    return fontStyle === "italic"
      ? await pdfDoc.embedFont(StandardFonts.CourierOblique)
      : await pdfDoc.embedFont(StandardFonts.Courier);
  } else if (fontFamily === "Helvetica") {
    return fontStyle === "italic"
      ? await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
      : await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
  return fontStyle === "italic"
    ? await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
    : await pdfDoc.embedFont(StandardFonts.Helvetica);
};

const downloadPDF = (pdfBytes, fileName) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
