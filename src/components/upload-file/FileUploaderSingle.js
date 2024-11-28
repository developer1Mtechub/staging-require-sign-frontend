// ** React Imports
import { useState, useEffect } from "react";
// ** Reactstrap Imports
import { Progress, Spinner } from "reactstrap";
import { PDFDocument, rgb, StandardFonts, degrees, PDFName } from "pdf-lib";
// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { ArrowUp, X } from "react-feather";
import { post, postFormDataPdf } from "../../apis/api";
import getUserLocation from "../../utility/IpLocation/GetUserLocation";
import getActivityLogUser from "../../utility/IpLocation/MaintainActivityLogUser";
import CustomButton from "../ButtonCustom";
import { useTranslation } from "react-i18next";
import toastAlert from "@components/toastAlert";
import { getUser, selectPrimaryColor } from "../../redux/navbar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { decrypt } from "../../utility/auth-token";
import SpinnerCustom from "../SpinnerCustom";

const UploadFile = ({ subFolder, setShow, onlySigner }) => {
  // ** State
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const primary_color = useSelector(selectPrimaryColor);

  const { user, plan, status, error } = useSelector((state) => state.navbar);

  const [FileNameDataD, setFileNameDataD] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedShow, setIsLoadedShow] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0); // New state for tracking upload progress
  const [isHovered, setIsHovered] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: async (acceptedFiles) => {
      // Pdf Upload
      const file = acceptedFiles[0];
      let user_id = user?.user_id;
      setIsLoaded(true);
      console.log(acceptedFiles[0]);
      console.log(user_id);

     
        const postData = {
          image: acceptedFiles[0],
          // image: newPdfFile,

          user_id: user_id,
        };

        try {
          let pageCount;
          const apiData = await postFormDataPdf(postData, (progress) => {
            setUploadProgress(progress);
            console.log(progress);
            // when progress is 100 then set loadershow trye 
            if (progress === 100) {
              setTimeout(() => {

              setIsLoadedShow(true);
              }, 1000);
            }

          }); // Specify the endpoint you want to call
          console.log(apiData);
          
          // uncomment codee
          if (apiData.error === true || apiData.error === "true") {
            //console.log('Error uploading Files');
            toastAlert("error", apiData.message);
          } else {

            // Get the number of pages in the selected PDF using pdf-lib
            const fileReader = new FileReader();
            fileReader.onload = async function (event) {
              const arrayBuffer = event.target.result;

              // Load the PDF using pdf-lib
              const pdfDoc = await PDFDocument.load(arrayBuffer, {
                      ignoreEncryption: true,
                    });
              pageCount = pdfDoc.getPageCount();

              console.log(`The selected PDF has ${pageCount} pages.`);
              const file_idData = await handlePageImages(
                apiData?.public_url,
                acceptedFiles[0]?.name,
                pageCount
              );

              // const user_id = user_id_local.token.user_id;
              const email = user?.email;
              // setUploadProgress(30)
              let response_log = await getActivityLogUser({
                user_id: user_id,
                event: "FILE-UPLOADED",
                description: `${email} uploaded file ${FileNameDataD} `,
              });
              if (response_log === true) {
                //console.log("MAINTAIN LOG SUCCESS")
              } else {
                //console.log("MAINTAIN ERROR LOG")
              }

              window.location.href = `/esign-setup/${file_idData}`;
            };

            // Read the PDF as an ArrayBuffer
            fileReader.readAsArrayBuffer(acceptedFiles[0]);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
     
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
    //console.log(fileNameData);
    setFileNameDataD(fileNameData);
    console.log("total_pages");

    console.log(total_pages);
    //console.log(user_id?.token?.user_id);
    const location = await getUserLocation();
    console.log(location);
    if (subFolder === null || subFolder === undefined || subFolder === "") {
      const postData = {
        user_id: user?.user_id,
        file_name: fileNameData,
        subfolder: "false",
        onlySigner: onlySigner,
        file_url: file_url,
        location_country: location.country,
        ip_address: location.ip,
        last_change: location.date,
        location_date: location.date,
        timezone: location?.timezone,
        total_pages: total_pages,
      };
      try {
        const apiData = await post("file/create-file-v1", postData);
        //console.log('Get By Folder Id');
        //console.log(apiData);
        if (apiData.error) {
          //console.log('error', apiData.message);
        } else {
          const file_idData = apiData.data.file_id;
          return file_idData;
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
    } else {
      const postData = {
        user_id: user?.user_id,
        file_name: fileNameData,
        subfolder: "true",
        onlySigner: onlySigner,
        subfolder_id: subFolder,
        file_url: file_url,
        location_country: location.country,
        ip_address: location.ip,
        location_date: location.date,
        last_change: location.date,
        timezone: location?.timezone,
        total_pages: total_pages,
      };
      try {
        const apiData = await post("file/create-file-v1", postData);
        //console.log('Get By Folder Id');
        //console.log(apiData);
        if (apiData.error) {
          //console.log('error', apiData.message);
        } else {
          const file_idData = apiData.data.file_id;
          return file_idData;
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
    }
  };
  useEffect(() => {
    if (status === "succeeded") {
      console.log("user ");
      console.log(user);
    }
  }, [user, status]);

  return (
    <>
      <div
        style={{
          border: isHovered ? `3px dashed ${primary_color}` : "3px dashed grey",
          cursor: isLoaded ? "default" : "pointer",
          borderRadius: "10px",
          padding: "30px",
          marginBottom: "50px",
          position: "relative",
          pointerEvents: isLoaded ? "none" : "auto",
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
              top: 10,
              right: 10,
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
          {isLoadedShow?
          <Spinner color="primary" size={50} style={{marginBlock:"20px"}}/>:
            <span
              style={{
                padding: "5%",
                borderRadius: "100px",
                border: "2px solid lightGrey",
              }}
            >
              <ArrowUp size={40} color={primary_color} />
            </span>}
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
             {isLoadedShow?t("Please wait..."):t("Click or drop file to upload")} 
            </h2>
       {isLoadedShow?null:<>
       {isLoaded ? (
              <div style={{ width: "100%", marginTop: "5%" }}>
                <Progress
                  // value={parseInt(uploadProgress) - parseInt(10)}
                  value={parseInt(uploadProgress)}
                  // color="info"
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
                  {/* {t("Uploading")} {parseInt(uploadProgress) - parseInt(10)}% */}
                  {t("Uploading")} {parseInt(uploadProgress)}%
                </Progress>
              </div>
            ) : (
              <CustomButton
                disabled={isLoaded}
                padding={true}
                size="sm"
                style={{ boxShadow: "none", fontSize: "15px", marginTop: "5%" }}
                text={
                  <>
                    {isLoaded
                      ? `${t("Uploading")} (${parseInt(uploadProgress)}%)...`
                      : t("Upload")}
                  </>
                }
              />
            )} </>}    
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFile;
