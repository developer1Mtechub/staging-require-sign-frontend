// ** React Imports
import { useState, Fragment, useEffect } from "react";
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import html2canvas from "html2canvas";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud, ArrowUp } from "react-feather";
import {
  BASE_URL,
  FrontendBaseUrl,
  post,
  postFormData,
  postFormDataPdf,
} from "../../apis/api";
import { useSelector } from "react-redux";

import toastAlert from "@components/toastAlert";
import { selectPrimaryColor } from "../../redux/navbar";
import { useTranslation } from "react-i18next";

const FileUploaderBulkLink = ({
  subFolder,
  onDataReceived,
  onlySigner,
  formikValues,
}) => {
  // ** State
  const { t } = useTranslation();

  const primary_color = useSelector(selectPrimaryColor);
  const [isHovered, setIsHovered] = useState(false);

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: async (acceptedFiles) => {
      // setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      setIsLoaded(true);
      setTimeout(() => {
        setIsLoaded(false);
        onDataReceived(acceptedFiles[0]);
      }, 500);

      // const postData = {
      //   image: acceptedFiles[0],
      // };
      // try {
      //   const apiData = await postFormDataPdf(postData); // Specify the endpoint you want to call
      //   // //console.log(apiData)
      //   if (apiData.path === null || apiData.path === undefined || apiData.path === '') {
      //     //console.log('Error uploading Files');
      //   } else {
      //     //console.log('apiData.path');

      //     //console.log(apiData.path);
      //     const file_idData = await handlePageImages(apiData.path, acceptedFiles[0].name);
      //     setTimeout(() => {
      //       //console.log('dshjdsh');
      //       // localStorage.setItem('@images', JSON.stringify({ type: "pdf", file_id: file_idData }));
      //       // window.location.href = `/esign-setup/${file_idData}`;
      //     }, 2000);
      //     // if pushed
      //   }
      // } catch (error) {
      //   console.error('Error uploading file:', error);
      // }
    },
  });

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    } else {
      return <FileText size="28" />;
    }
  };

  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };
  const [isLoaded, setIsLoaded] = useState(false);

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <h3 className="file-name mb-0">{file.name}</h3>
          <h4 className="file-size mb-0">{renderFileSize(file.size)}</h4>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
    setIsSubmitting(false);
    onDataReceived("modal-lg");
  };

  // Disable the file input and other controls while converting to images
  const [isConverting, setIsConverting] = useState(false);
  const capturePageAsImage = async (pageNumber) => {
    const page = document.querySelector(
      `.react-pdf__Page[data-page-number="${pageNumber}"]`
    );
    const pageSelector = `.react-pdf__Page[data-page-number="${pageNumber}"]`;
    const pages = document.querySelectorAll(pageSelector);
    //console.log('pages lentn');

    //console.log(pages);
    if (pages.length === 0) {
      //console.log('pages null');

      return null; // Return null if the page with the specified number is not found.
    }
    //console.log('pages');

    //console.log(pages); //getting null someti9mes
    // Add a delay before capturing the page.
    //  await new Promise((resolve) => setTimeout(resolve, 3000));

    const canvas = await html2canvas(pages[0]); // Capture the first matching page.

    const imageBlob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
    //  create Image file
    const fileName = `page_${pageNumber}.png`;
    const imageUrl = new File([imageBlob], fileName, { type: "image/png" });
    //console.log('imageUrl');
    //console.log(imageUrl);
    //  const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  };
  const [pageImages, setPageImages] = useState([]);

  const convertToImages = async () => {
    setIsConverting(true); // Start converting
    setIsSubmitting(true);

    // const images = [];
    // code aded
    // Use Promise.all to wait for all pages to be converted into images
    const images = await Promise.all(
      Array.from({ length: numPages }, (_, i) => capturePageAsImage(i + 1))
    );
    //console.log('numPages');
    //console.log(numPages);
    // const numPages = 1;

    // for (let i = 1; i <= numPages; i++) {
    //   const imageUrl = await capturePageAsImage(i);
    //   images.push(imageUrl);
    // }
    // logic to upload images
    //console.log('IIII');
    //console.log(images);

    //console.log(images.length);
    let ArrayData = [];
    for (let i = 0; i < images.length; i++) {
      //console.log('images[i]');

      //console.log(images[i]);
      const postData = {
        image: images[i],
      };
      try {
        const apiData = await postFormData(postData); // Specify the endpoint you want to call
        // //console.log(apiData)
        if (
          apiData.path === null ||
          apiData.path === undefined ||
          apiData.path === ""
        ) {
          // toastAlert("error", "Error uploading Files")
          //console.log('Error uploading Files');
        } else {
          // toastAlert("success", "Successfully Upload Files")
          ArrayData.push(apiData.path);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
      // ArrayData.push()
    }
    //console.log('ArrayData');

    //console.log(ArrayData);

    // Upload images and store responses
    // end
    setIsConverting(false); // Finish converting
    setPageImages(ArrayData);
    // setIsSubmitting(false)
  };
  const [numPages, setNumPages] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    //console.log('loaded success s');
    //console.log(numPages);
    //console.log(pageImages);

    onDataReceived("modal-xl");

    //   setTimeout(() => {

    //     convertToImages();
    //    //  10 sec
    //  }, 10000);
  };
  const handlePageImages = async (file_url, file_name) => {
    //console.log(numPages);
    // if (pageImages.length === numPages) {
    //console.log('subFolder');
    //console.log(subFolder); //id given
    //console.log('pageImages');
    //console.log(pageImages);
    // get localstorage user id
    // Json stringify localstorage item
    //console.log('user_id');
    //console.log(file_name);
    //console.log(user_id?.token?.user_id);
    //console.log('sdfjhhh');
    const postData = {
      user_id: formikValues.user_id,
      title: formikValues.title,
      welcome_message: formikValues.welcome_message,
      acknowledgement_message: formikValues.acknowledgement_message,
      limit_responses: formikValues.selectedOption,
      link_response_limit: formikValues.responseLimit,
      // total_responses:formikValues. values.total_responses,
      expires_option: formikValues.expiresInOption,
      expiry_date: formikValues.picker,
      signer_functional_controls: formikValues.signerFunctionalControlsR,
      user_email_verification: formikValues.userEmailVerification,
      allow_download_after_submission:
        formikValues.allowDownloadAfterSubmission,
      users_receive_copy_in_email: formikValues.receivePdfCopy,
    };
    const apiData = await post("bulk_links/bulk_link", postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
    // setSubmitting(false);

    if (apiData.error) {
      toastAlert("error", "Something went wrong");
      //console.log('error', apiData.errorMessage);
    } else {
      // //console.log('success', apiData?.result?.bulk_link_id)
      // setBulk_link_id(apiData?.result?.bulk_link_id)
      let bulk_link_id = apiData?.result?.bulk_link_id;
      // toastAlert("success", "Bulk Link Added Successfully")
      // setShow(true)
      // calling File Upload
      const postData = {
        bulk_link_id: bulk_link_id,
        images: pageImages,
        file_name: file_name,
        file_url: file_url,
        url: `${FrontendBaseUrl}public-form/esign/${bulk_link_id}`,
      };
      try {
        const apiData = await post("bulk_links/addBulkLinksBgImgs", postData);
        //console.log('Get By Bulk Link ');
        //console.log(apiData);
        if (apiData.error) {
          //console.log('error', apiData.message);
        } else {
          // const file_idData = apiData.data.file_id;
          setTimeout(() => {
            //console.log('dshjdsh');
            localStorage.setItem(
              "@images",
              JSON.stringify({
                urls: pageImages,
                type: "pdf",
                file_id: bulk_link_id,
              })
            );
            window.location.href = `/e-sign-form-create/${bulk_link_id}`;
          }, 1000);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    if (pageImages.length === numPages) {
      handlePageImages();
      //console.log('useEffect');
    } else {
      //console.log('pageImages');
      //console.log(pageImages);
    }
  }, [pageImages, numPages]);

  return (
    <>
      {/* {isLoaded ? <FullScreenLoader /> : null} */}
      <div {...getRootProps({ className: "dropzone", disabled: isConverting })}>
        <input {...getInputProps()} disabled={isConverting} />
        <div className="d-flex align-items-center justify-content-center flex-column">
        <span
            style={{
              padding: "5%",
              borderRadius: "100px",
              border: "2px solid lightGrey",
            }}
          >
            <ArrowUp size={40} color={primary_color} />
          </span>
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
            {t("Click or drop file to upload")}
          </h2>
          </div>  {/* <div
          className="d-flex align-items-center justify-content-center flex-column"
          style={{
            border: "1px solid lightGrey",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              padding: "4%",
              borderRadius: "100px",
              border: "2px solid lightGrey",
            }}
          >
            <ArrowUp size={50} color={primary_color} />
          </span>
          <h2
            style={{
              fontSize: "16px",
              textAlign: "center",
              marginTop: "5%",
              color: "grey",
            }}
          >
            Click or drop file to upload
          </h2> */}
        
        {/* </div> */}
      </div>
      
   
    </>
  );
};

export default FileUploaderBulkLink;
