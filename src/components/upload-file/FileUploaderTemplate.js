// ** React Imports
import { useState, useEffect } from "react";
// ** Reactstrap Imports
import { Progress, Spinner } from "reactstrap";

// ** Third Party Imports
import toastAlert from "@components/toastAlert";
import { PDFDocument } from "pdf-lib";

import { useDropzone } from "react-dropzone";
import { ArrowUp, X } from "react-feather";
import { post, postFormDataPdf } from "../../apis/api";
import { useTranslation } from "react-i18next";
import CustomButton from "../ButtonCustom";
import getUserLocation from "../../utility/IpLocation/GetUserLocation";
import getActivityLogUser from "../../utility/IpLocation/MaintainActivityLogUser";
import { selectPrimaryColor } from "../../redux/navbar";

import { useSelector } from "react-redux";

const UploadFileTemp = ({ onDataReceived, user, setShow }) => {
  // ** State
  const primary_color = useSelector(selectPrimaryColor);

  const [isHovered, setIsHovered] = useState(false);

  const { t } = useTranslation();
  const [isLoadedShow, setIsLoadedShow] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Extract the primary_color value or use a default color
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: async (acceptedFiles) => {
      // setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      // Pdf Upload
      let user_id = user?.user_id;

      setIsLoaded(true);
      const postData = {
        image: acceptedFiles[0],
        user_id: user_id,
      };
      try {
        let pageCount;
        const apiData = await postFormDataPdf(postData, (progress) => {
          setUploadProgress(progress);
          if (progress === 100) {
            setTimeout(() => {
              setIsLoadedShow(true);
            }, 1000);
          }
        }); // Specify the endpoint you want to call
        // //console.log(apiData)
        if (apiData.error === true || apiData.error === "true") {
          //console.log('Error uploading Files');
          toastAlert("error", apiData.message);
        } else {
          // Get the number of pages in the selected PDF using pdf-lib
          const fileReader = new FileReader();
          fileReader.onload = async function (event) {
            const arrayBuffer = event.target.result;

            // Load the PDF using pdf-lib
            // const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pdfDoc = await PDFDocument.load(arrayBuffer, {
              ignoreEncryption: true,
            });
            pageCount = pdfDoc.getPageCount();

            console.log(`The selected PDF has ${pageCount} pages.`);
            //console.log('apiData.path');
            //console.log(apiData.path);
            const file_idData = await handlePageImages(
              apiData?.public_url,
              acceptedFiles[0].name,
              pageCount
            );
            console.log(file_idData);
            // setTimeout(() => {
            // localStorage.setItem('@images', JSON.stringify({ type: "pdf", file_id: file_idData }));
            window.location.href = `/template-builder/${file_idData}`;
          };
          // Read the PDF as an ArrayBuffer
          fileReader.readAsArrayBuffer(acceptedFiles[0]);
          // }, 2000);
          // if pushed
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
  });

  // Disable the file input and other controls while converting to images
  const [isConverting, setIsConverting] = useState(false);

  const checkFileNameExist = async (file_name) => {
    //console.log(file_name);

    const postData = {
      user_id: user?.user_id,
      // user_id: 100617,
      subFolder: false,
    };
    try {
      const apiData = await post("file/files_by_user_id", postData); // Specify the endpoint you want to call
      //console.log('GET Files BY USER ID Subfolder');

      if (apiData.error === true || apiData.error === undefined) {
        // toastAlert("error", apiData.message)
        //console.log('44444');

        let fileNameWithoutExtension = file_name.replace(/\.pdf$/, "");

        let uniqueFileName = fileNameWithoutExtension;
        //console.log(fileNameWithoutExtension);
        return fileNameWithoutExtension;
      } else {
        // toastAlert("succes", apiData.message)
        //console.log('AAAAAAAAAAAAAAA');
        let filesArray = apiData.result;
        let count = 1;
        let fileNameWithoutExtension = file_name.replace(/\.pdf$/, "");

        let uniqueFileName = fileNameWithoutExtension;
        while (filesArray.some((file) => file.name === uniqueFileName)) {
          uniqueFileName = `${fileNameWithoutExtension} (${count++})`;
        }
        return uniqueFileName;
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const handlePageImages = async (file_url, file_name, total_pages) => {
    let fileNameData = await checkFileNameExist(file_name);
    //console.log('ashhjdsadsadsk');
    const location = await getUserLocation();

    //console.log(fileNameData);
    //console.log(user_id?.token?.user_id);
    const postData = {
      user_id: user?.user_id,
      file_name: fileNameData,
      email: user?.email,

      file_url: file_url,
      time: location.date,
      total_pages: total_pages,
    };
    try {
      let apiData = await post("template/template", postData);
      console.log("Get By Folder Id");
      console.log(apiData);
      if (apiData.error === true) {
        //console.log('error', apiData.message);
      } else {
        console.log("else");
        let response_log = await getActivityLogUser({
          user_id: user?.user_id,
          // file_id: apiData.template_id,
          event: "TEMPLATE-CREATED",
          description: `${user?.email} created template ${fileNameData}`,
        });
        if (response_log === true) {
          console.log("MAINTAIN LOG SUCCESS");
        } else {
          console.log("MAINTAIN ERROR LOG");
        }
        // setTimeout(() => {
        // let template_id = apiData?.data?.template_id;
        //     // localStorage.setItem('@images', JSON.stringify({urls: pageImages, type: 'pdf', file_id: template_id}));
        //     window.location.href = `/template-builder/${template_id}`;

        // }, 2000);

        const file_idData = apiData.data.template_id;
        console.log("file_idData");

        console.log(apiData.data);
        return file_idData;
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };

  return (
    <>
      <div
        style={{
          cursor: isLoaded ? "default" : "pointer",
          pointerEvents: isLoaded ? "none" : "auto",

          border: isHovered ? `3px dashed ${primary_color}` : "3px dashed grey",

          borderRadius: "10px",
          padding: "30px",
          marginBottom: "50px",
          position: "relative",
          //  backgroundColor: isHovered ? '#eeeeee' : 'transparent',
          transition: "border 0.3s ease",
        }}
        onMouseEnter={() => !isLoaded && setIsHovered(true)}
        onMouseLeave={() => !isLoaded && setIsHovered(false)}
      >
        {isLoaded ? null : (
          <X
            size={16}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              cursor: "pointer",
            }}
            onClick={() => setShow(false)}
          />
        )}
        {/* {isLoaded ? <FullScreenLoader /> : null} */}
        <div
          {...getRootProps({
            className: "dropzone",
            disabled: isConverting || isLoaded,
          })}
        >
          <input {...getInputProps()} disabled={isConverting || isLoaded} />
          <div className="d-flex align-items-center justify-content-center flex-column">
            {isLoadedShow ? (
              <Spinner
                color="primary"
                size={50}
                style={{ marginBlock: "20px" }}
              />
            ) : (
              <span
                style={{
                  padding: "5%",
                  borderRadius: "100px",
                  border: "2px solid lightGrey",
                }}
              >
                <ArrowUp size={40} color={primary_color} />
              </span>
            )}
            <h2
              style={{
                fontSize: "14px",
                textAlign: "center",
                marginTop: "5%",
                color: isHovered ? primary_color : "grey",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isLoadedShow
                ? t("Please wait...")
                : t("Click or drop file to upload")}
            </h2>
            {isLoadedShow ? null : (
              <>
                {isLoaded ? (
                  <div style={{ width: "100%", marginTop: "5%" }}>
                    <Progress
                      value={parseInt(uploadProgress)}
                      style={{
                        backgroundColor: "#E0E0E0", // Background of the empty bar
                        height: "20px",
                        fontSize: "12px",
                        color: "white", // Text color inside the progress bar
                      }}
                      barStyle={{
                        backgroundColor: primary_color, // Custom color for the filled progress
                      }}
                    >
                      {t("Uploading")} {parseInt(uploadProgress)}%
                    </Progress>
                  </div>
                ) : (
                  <CustomButton
                    padding={true}
                    size="sm"
                    style={{
                      boxShadow: "none",
                      fontSize: "15px",
                      marginTop: "5%",
                    }}
                    text={
                      <>
                        {isLoaded
                          ? `  ${t("Uploading")} (${parseInt(
                              uploadProgress
                            )}%)...`
                          : t("Upload")}
                      </>
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFileTemp;
