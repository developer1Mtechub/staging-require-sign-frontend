import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import logoWelcome from "@src/assets/images/pages/pbFormWelcom.png";
import {
  Button,
  Col,
  Input,
  Modal,
  ModalBody,
  Row,
  Spinner,
  ModalHeader,
  Label,
} from "reactstrap";
import bgImg from "@src/assets/images/pages/bg-img.png";

import { ArrowLeft, CheckCircle, Image, Menu } from "react-feather";
import accessDenied from "@src/assets/images/pages/accessDenied.png";
import linkExpired from "@src/assets/images/pages/linkExpired.png";
import toastAlert from "@components/toastAlert";
// import {getColorByIndex} from '../utility/Utils';
import "react-resizable/css/styles.css";
import SignatureModalContent from "../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import ComponentForItemType from "../utility/EditorUtils/EditorTypesPosition.js/ComponentForItemType";
import { useSelector } from "react-redux";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// usama import
import { Rnd } from "react-rnd";

import {
  bulkLinkTermsAndConditionLink,
  FrontendBaseUrl,
  post,
  postFormData,
} from "../apis/api";
import { Link } from "react-router-dom";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import { handleDownloadPDFHereBulk } from "../utility/Utils";
import getActivityLogUserBulk from "../utility/IpLocation/MaintainActivityLogBulkLink";
import { selectPrimaryColor } from "../redux/navbar";
import CustomButton from "../components/ButtonCustom";
import Confetti from "react-confetti";

const BulkLinkDocViewN = () => {
  const [initialBox, setInitialBox] = useState(false);
  const primary_color = useSelector(selectPrimaryColor);

  // Split the path into parts

  // The encrypted IDs are the last two parts of the path
  const file_id = window.location.pathname.split("/")[3];
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState("100%");
  // states

  const [imageUrls, setImageUrls] = useState([]);
  // const file_id = window.location.pathname.split('/')[2];
  const [type, setType] = useState("");
  const [selectedSigner, setSelectedSigner] = useState({
    color: "rgb(255 214 91 / 78%)",
    signer_id: 123,
    name: "Rim",
    email: "rim",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [statusFile, setStatusFile] = useState("");
  const [SignatureModal, setSignatureModal] = useState(false);

  const [isResizing, setIsResizing] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [resizingIndex, setResizingIndex] = useState(null);
  const [expiredLink, setExpiredLink] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [verificationOTP, setVerificationOTP] = useState(false);
  const [code, setCode] = useState("");

  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  const [endPage, setEndPage] = useState(5);
  const [startPage, setStartPage] = useState(0);
  const colRef = useRef(null);
  // items list append end
  const [loadedPages, setLoadedPages] = useState([1, 2, 3, 4, 5]); // Manage loaded pages
  const [loadingP, setLoadingP] = useState(false); // Loading state
  const scrollContainerRefCol2 = useRef(null); // Ref for the scrollable container inside col 2 (thumbnails)

  const [loadingP8, setLoadingP8] = useState(false); // Loading state
  const [loadedPages8, setLoadedPages8] = useState([1]); // Manage loaded pages
  const observer = useRef(null);

  const loadMorePages8 = () => {
    if (loadedPages8.length >= numPages || loadingP8) return;

    setLoadingP8(true);
    setTimeout(() => {
      setLoadedPages8((prevPages) => {
        const nextPages = Array.from(
          { length: Math.min(5, numPages - prevPages.length) },
          (_, i) => prevPages.length + i + 1
        );

        // Update endPage to reflect the last page of the newly loaded pages
        const newEndPage = prevPages.length + nextPages.length;

        setLoadingP8(false);

        // Return the updated list of pages
        return [...prevPages, ...nextPages];
      });

      // Update the endPage after loading new pages (can be tracked in state)
      setEndPage((prevEndPage) => prevEndPage + 5);
    }, 1000);
  };
  const loadMorePages = () => {
    if (loadedPages.length >= numPages || loadingP) return;

    setLoadingP(true);
    setTimeout(() => {
      setLoadedPages((prevPages) => {
        const nextPages = Array.from(
          { length: Math.min(5, numPages - prevPages.length) },
          (_, i) => prevPages.length + i + 1
        );
        setLoadingP(false);
        return [...prevPages, ...nextPages];
      });
    }, 200);
  };
  const handleScrollCol2 = () => {
    if (!scrollContainerRefCol2.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRefCol2.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMorePages(); // This could be a separate load function if you want to treat it differently
    }
  };
  const loadPagesUntil = (page) => {
    setLoadingP(true);
    setLoadedPages((prevPages) => {
      const newPages = Array.from({ length: page }, (_, i) => i + 1);
      setLoadingP(false);
      return newPages;
    });
  };
  const handleJumpToPage = async (e) => {
    const selectedPage = Number(e.target.value); // Get the selected page
    if (selectedPage > loadedPages[loadedPages.length - 1]) {
      // Load pages up to the selected page if necessary
      await loadPagesUntil(selectedPage);
    }
    setActivePage(selectedPage);
    // handlePageClick(selectedPage);
    setPageNumber(selectedPage);
    if (selectedPage < startPage) {
      setStartPage(selectedPage);
      setEndPage(selectedPage + 4); // Load a new range of pages
    } else if (selectedPage > endPage) {
      setStartPage(selectedPage - 4);
      setEndPage(selectedPage);
    }
    const fullPageElement = document.getElementById(
      `full-page-${selectedPage}`
    );
    if (fullPageElement) {
      fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Scroll the main Col element to the clicked page
    setTimeout(() => {
      const canvasPageElement = canvasRefs.current[selectedPage - 1];
      if (canvasPageElement && colRef.current) {
        const colScrollTop = colRef.current.scrollTop;
        const colOffsetTop = colRef.current.getBoundingClientRect().top;
        const elementOffsetTop = canvasPageElement.getBoundingClientRect().top;
        const scrollToPosition = colScrollTop + elementOffsetTop - colOffsetTop;

        colRef.current.scrollTo({ top: scrollToPosition, behavior: "smooth" });
      }
    }, 1000);
    // const pageNumber = Number(e.target.value); // Get the selected page number
    // setActivePage(pageNumber); // Update the selected page in the state
    // handlePageClick(pageNumber); // Trigger the page click action

    // scrollToPage(pageNumber); // Scroll to the selected page if needed
  };
  const handleZoomChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setScale(newScale);

    // Adjust font sizes of existing elements based on the new scale
    // setElements((prevElements) =>
    //   prevElements.map((element) => ({
    //     ...element,
    //     fontSize: (element.fontSize / scale) * newScale, // Adjust font size proportionally
    //   }))
    // );
    setTextItems((prevElements) =>
      prevElements.map((element) => {
        // Check if the element type needs font size adjustment
        const needsAdjustment = [
          "my_text",
          "signer_text",
          "checkmark",
          "signer_checkmark",
        ].includes(element.type);

        return {
          ...element,
          fontSize: needsAdjustment
            ? (element.fontSize / scale) * newScale
            : element.fontSize,
          // width: needsAdjustment ? element.width / scale * newScale : element.width,
          // height: needsAdjustment ? element.height / scale * newScale : element.height,
        };
      })
    );
  };
  const handlePageClick = (page) => {
    // setIsLoadingDoc(true);
    // setTimeout(() => {
    setPageNumber(page);

    setPageNumber(page);
    if (page < startPage) {
      setStartPage(page);
      setEndPage(page + 4); // Load a new range of pages
    } else if (page > endPage) {
      setStartPage(page - 4);
      setEndPage(page);
    }
    const fullPageElement = document.getElementById(`full-page-${page}`);
    if (fullPageElement) {
      fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Scroll the main Col element to the clicked page
    const canvasPageElement = canvasRefs.current[page - 1];
    if (canvasPageElement && colRef.current) {
      const colScrollTop = colRef.current.scrollTop;
      const colOffsetTop = colRef.current.getBoundingClientRect().top;
      const elementOffsetTop = canvasPageElement.getBoundingClientRect().top;
      const scrollToPosition = colScrollTop + elementOffsetTop - colOffsetTop;

      colRef.current.scrollTo({ top: scrollToPosition, behavior: "smooth" });
    }
  };
  const [acknowledgement_messageCheck, setacknowledgement_messageCheck] =
    useState(false);
  const handleFileChange = async (e, index) => {
    const files = e.target.files[0];
    // upload image
    const postData = {
      image: files,
      user_id: userIdFile,
    };
    const apiData = await postFormData(postData); // Specify the endpoint you want to call
    if (
      apiData.public_url === null ||
      apiData.public_url === undefined ||
      apiData.public_url === ""
    ) {
    } else {
      //console.log('result');
      //console.log(apiData.public_url);

      const url = apiData.public_url;
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[index].url = url;
      setTextItems(newSavedCanvasData);
    }
  };
  const [resendOTPButton, setResendOTPButton] = useState(false);
  const placeImage = async (url, prevSign, typeSign) => {
    //console.log(url);
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[editedIndex].url = url;
    setTextItems(newSavedCanvasData);

    setSignatureModal(false);
    // setTextItems([...textItems, resultingData]);
  };

  const saveData = async () => {
    setLoadingComplete(true);
    setsaveLoading(true);
    let response_log1;

    let response_log = await getActivityLogUserBulk({
      file_id: file_id,
      email: emailMessage,
      event: "FORM-COMPLETED",
      description: `${emailMessage} completed a document ${fileName} `,
    });
    if (response_log === null) {
      console.log("MAINTAIN ERROR LOG");
    } else {
      console.log("MAINTAIN SUCCESS LOG");
      console.log(response_log);
      response_log1 = response_log;
    }
    const returningUrl = await handleDownloadPDFHereBulk({
      setDownloadPdfLoader: setsaveLoading,
      imageUrls,
      textItems: textItems,
      canvasWidth,
      UniqIdDoc: uniq_id,
      ActivityLogData: response_log1,
      fileName,
      file_id: file_id,
      statusData: "receiver",
      imageUrlsCount: null,
      user_id: userIdFile,
      doc_completed: true,
      logo_data: compLogo,
    });
    console.log(returningUrl);
    const locationD = await getUserLocation();
    const postData = {
      // file_id: file_id,
      // // position_array: savedCanvasData
      // position_array: textItems,
      bulk_link_id: file_id,
      // position_array: textItems,
      email_response: emailMessage,
      location_country: locationD.country,
      // ip_address: location.ip,
      // file_name: fileName,
      location_date: locationD.date,

      // timezone: location?.timezone,

      pdfLink: returningUrl,
    };
    try {
      const apiData = await post("bulk_links/saveBulkLinkResponse", postData); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');

      //console.log(apiData);
      if (apiData.error) {
        setsaveLoading(false);
        setSaveSuccess(false);
      } else {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setsaveLoading(false);
        }, 2000);
        if (allowUsersToDownloadAfterSubmission) {
          setLinkDownload(returningUrl);
        } else {
          setLinkDownload(null);
        }
        setDocSignerStatusModal(true);
        //console.log('apixxsData');
        //console.log(apiData1);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      // setsaveLoading(false)
    }
  };
  //  const handleStateMemory =(data,type)=>{
  //   //console.log(data)
  //   //console.log(type)
  //   stateMemory.push({
  //     data,type
  //   })

  //  }
  // Input Text
  const handleInputChanged = (event, index) => {
    const newText = event.target.value;
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = newText;

    // Calculate width based on the length of the text
    const maxWidth = 500; // Set your maximum width here
    const minWidth = 100; // Set your minimum width here
    const textWidth = newText.length * 8; // Adjust this factor based on your font size and preferences
    // const newWidth = Math.max(minWidth, Math.min(maxWidth, textWidth)); // Ensure width is within the desired range

    // Update state with new text and width
    // newSavedCanvasData[index].width = newWidth;

    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      text: newText,
      // width: newWidth,
    }));
  };
  // const handleInputChanged = (event, index) => {
  //   const newText = event.target.value;
  //   const newSavedCanvasData = [...textItems];
  //   newSavedCanvasData[index].text = newText;

  //   // Calculate width based on the length of the text
  //   const maxWidth = 500; // Set your maximum width here
  //   const minWidth = 100; // Set your minimum width here
  //   const textWidth = newText.length * 10; // Adjust this factor based on your font size and preferences
  //   const newWidth = Math.max(minWidth, Math.min(maxWidth, textWidth)); // Ensure width is within the desired range

  //   // Update state with new text and width
  //   if (newSavedCanvasData[index].width < newWidth) {
  //     newSavedCanvasData[index].width = newWidth;

  //     setTextItems(newSavedCanvasData);
  //     setEditedItem(prevState => ({
  //       ...prevState,
  //       text: newText,
  //       width: newWidth,
  //     }));
  //   } else {
  //     setTextItems(newSavedCanvasData);
  //     setEditedItem(prevState => ({
  //       ...prevState,
  //       text: newText,
  //     }));
  //   }
  // };
  const [FinishButtonEnable, setFinishButtonEnable] = useState(true);
  function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const handleInputChecked = (event, index) => {
    setIsResizing(false);
    let inputValueText = event.target.checked;
    //console.log(inputValueText);

    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = inputValueText;
    setTextItems(newSavedCanvasData);
    //console.log(newSavedCanvasData);
  };
  const handleSelectDropDownItem = (event, index) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = event;
    setTextItems(newSavedCanvasData);
  };
  const handleInputChangedDate = (event, index) => {
    setIsResizing(false);
    let inputValueText = event;
    //console.log(inputValueText);

    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = event.target.value;
    setTextItems(newSavedCanvasData);
  };

  const [isOpenCanvas, setIsOpenCanvas] = useState(false);
  const [isOpenCanvasPages, setIsOpenCanvasPages] = useState(false);
  const containerRef = useRef();

  // end
  const canvasRef = useRef();
  const canvasRefs = useRef([]);
  const smoothScrollToElement = (
    element,
    options = { behavior: "smooth", block: "center" }
  ) => {
    return new Promise((resolve) => {
      const scrollHandler = () => {
        window.removeEventListener("scroll", scrollHandler);
        resolve();
      };
      window.addEventListener("scroll", scrollHandler);
      element.scrollIntoView(options);
    });
  };
  const [RequiredActive, setRequiredActive] = useState("");
  const handleButtonClicked = async (itemId, page_no) => {
    //console.log(itemId);

    setPageNumber(page_no);
    setActivePage(page_no);

    if (page_no > loadedPages[loadedPages.length - 1]) {
      console.log("load pages until", page_no);
      setEndPage(page_no);
      // Load pages up to the selected page if necessary
      await loadPagesUntil(page_no);
    }

    // if (pageNumber === page_no) {
    // }
    // const fullPageElementCanvas = document.getElementById(
    //   `full-page-${page_no}`
    // );
    // if (fullPageElementCanvas) {
    //   fullPageElementCanvas.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //   });
    //   setRequiredActive(itemId);
    // }
    setRequiredActive(itemId); // Activate the required item

    // Step 1: Scroll to the page container first
    setTimeout(async () => {
      const itemElement = document.getElementById(`item-${itemId}-${page_no}`);
      if (itemElement) {
        await smoothScrollToElement(itemElement, {
          behavior: "smooth",
          block: "center",
        });
      } else {
        console.error(`Item with ID ${itemId} not found`);
      }
    }, 1000);
  };
  const [AccessCodeModal, setAccessCodeModal] = useState(true);
  const [DocSignerStatusModal, setDocSignerStatusModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [MarkAsCompleted, setMarkAsCompleted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [linkDownload, setLinkDownload] = useState(false);

  const CompletedDocument = async () => {
    //console.log('Mark as Completed');
    await saveData();

    // setLoadingComplete(true);
    // await saveData();
    // const pdfLink = await handleDownloadPDFHere();
    // if (pdfLink === null) {
    //   //console.log('Something went wrong');
    // } else {
    //   //console.log('pdf lnk');
    //   //console.log(pdfLink);

    //   await saveData(pdfLink);
    // }

    // const postData = {
    //   signer_id: signerLoginId,
    //   completed_status: true,
    // };
    // const apiData = await post('file/markDocAsCompletedBySigner', postData); // Specify the endpoint you want to call
    // //console.log('apixxsData');

    // //console.log(apiData);
    // if (apiData.error) {
    //   setLoadingComplete(false);

    //   toastAlert('error', apiData.message);
    // } else {
    //   setMarkAsCompleted(false);
    //   toastAlert('success', 'Document Marked as Completed');
    //   window.location.reload();
    // }
  };
  const [SignersWhoHaveCompletedSigning, setSignersWhoHaveCompletedSigning] =
    useState([]);
  const [activeSignerId, setActiveSignerId] = useState("");

  // fetch positions
  const fetchDataPositions = async (fileId) => {
    // get positions from db
    const postData = {
      bulk_link_id: fileId,
    };
    const apiData = await post(
      "bulk_links/getallPositionsFromBulkLinkId",
      postData
    ); // Specify the endpoint you want to call
    console.log("Position Data");

    console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", apiData.message)
    } else {
      // toastAlert("success", apiData.message)
      //console.log('positions');
      //console.log(apiData.result);
      // getCanvas Data
      setTextItems(apiData.result[0].position_array);
    }
  };
  const zoomOptions = [0.5, 0.75, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%

  const [ResponseLimitCompleted, setResponseLimitCompleted] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [acknowledgmentMessage, setAcknowledgmentMessage] = useState("");
  const [loaderData, setLoaderData] = useState(true);
  const [compLogo, setCompLogo] = useState("");
  const [compPrimaryColor, setCompPrimaryColor] = useState("");
  const [compName, setCompName] = useState("");
  const [compId, setCompId] = useState("");

  const [
    allowUsersToDownloadAfterSubmission,
    setAllowUsersToDownloadAfterSubmission,
  ] = useState(false);
  const [allowToReceiveCopyInEmail, setAllowToReceiveCopyInEmail] =
    useState(false);
  const [userIdFile, setuserIdFile] = useState("");
  const fetchFileData = async (fileId) => {
    const postData = {
      bulk_link_id: fileId,
    };
    const apiData = await post("bulk_links/viewBulkLink", postData); // Specify the endpoint you want to call
    console.log("Bulk link Data Fetched");

    console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      setCompLogo(apiData.company_logo);
      setCompPrimaryColor(apiData.primary_color);
      setCompName(apiData.company_name);
      setCompId(apiData.company_id);
      setFileName(apiData.result.file_name || "");
      setuserIdFile(apiData.result.user_id);
      // setLink(apiData.result.url);
      setImageUrls(apiData.result.file_url);
      setUniq_Id(apiData.result.uniq_id);
      //console.log(apiData.result.file_url);
      setAllowUsersToDownloadAfterSubmission(
        apiData.result.allow_download_after_submission
      );
      setAllowToReceiveCopyInEmail(apiData.result.users_receive_copy_in_email);

      if (apiData.result.status === "inactive") {
        //   //console.log('INACTIVE');
        window.location.href = "/error";
      } else {
        setWelcomeMessage(apiData.result.welcome_message);
        setAcknowledgmentMessage(apiData.result.acknowledgement_message);

        if (apiData.result.limit_responses === "Limited") {
          //console.log('LIMITED RESPONSES ');
          const received_responses = apiData.responses_received;
          const limit_responses = apiData.result.link_response_limit;
          //console.log(apiData.result.link_response_limit);

          if (parseInt(limit_responses) === parseInt(received_responses)) {
            setResponseLimitCompleted(true);
            setAccessCodeModal(true);
            setLoaderData(false);
          } else {
            setResponseLimitCompleted(false);

            if (
              apiData.result.expires_option === true ||
              apiData.result.expires_option === "true"
            ) {
              //console.log('apiData.result.expiry_date');

              //console.log(apiData.result.expiry_date);
              const expiryDate = new Date(apiData.result.expiry_date);

              //         Get the current date
              const currentDate = new Date();
              // Check if the expiry date is before the current date
              if (expiryDate <= currentDate) {
                //console.log('Expired');
                setExpiredLink(true);
                setAccessCodeModal(true);
                setLoaderData(false);
              } else {
                setExpiredLink(false);
                //console.log('Accessible');
                setLoaderData(false);
              }
            } else {
              setAccessCodeModal(true);
              setLoaderData(false);
            }

            // check for email verification
            if (
              apiData.result.user_email_verification === "true" ||
              apiData.result.user_email_verification === true
            ) {
              setVerificationNeeded(true);
              //console.log('need verification');
              setLoaderData(false);
            } else {
              setVerificationNeeded(false);
              setLoaderData(false);
              // setNoVerification(true);
            }
          }
        } else {
          if (
            apiData.result.expires_option === true ||
            apiData.result.expires_option === "true"
          ) {
            //console.log('apiData.result.expiry_date');

            //console.log(apiData.result.expiry_date);
            const expiryDate = new Date(apiData.result.expiry_date);

            //         Get the current date
            const currentDate = new Date();
            // Check if the expiry date is before the current date
            if (expiryDate <= currentDate) {
              //console.log('Expired');
              setExpiredLink(true);
              setLoaderData(false);
            } else {
              setExpiredLink(false);
              //console.log('Accessible');
              setLoaderData(false);
            }
          } else {
          }
          if (
            apiData.result.user_email_verification === "true" ||
            apiData.result.user_email_verification === true
          ) {
            setVerificationNeeded(true);
            //console.log('need verification');
            setLoaderData(false);
          } else {
            setVerificationNeeded(false);
            // setNoVerification(true);
            setLoaderData(false);
          }
        }
      }
    }

    // toastAlert("success", "File exist")
    //_____________________________ uncomment this line
  };
  const [uniq_id, setUniq_Id] = useState("");
  const [isLoaded, setIsLoaded] = useState(true);
  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);

  const hasTextItems = (page) => {
    return textItems.some((item) => item.page_no === page);
  };
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };

  useEffect(() => {
    if (window.innerWidth < 786) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
    //console.log(file_id);
    // getUnhashedEmailFileId(emailHashed, file_id);
    // fetchData(file_id);
    fetchFileData(file_id);
    fetchDataPositions(file_id);
    // fetchData(file_id);
    // fetchFileData(file_id);
    // fetchDataPositions(file_id),
    // fetchSignerData(file_id),
    //  fetchRecipientsData(file_id);
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoaded(false);
    }, 3000);

    // Cleanup function to clear the timeout in case component unmounts before 1 second
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array to run effect only once
  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     // Get the zoom level
  //     const zoomLevel = parseFloat(document.body.style.zoom) / 100 || 1;

  //     // Calculate adjusted mouse coordinates based on the zoom level
  //     const adjustedX = e.clientX / zoomLevel;
  //     const adjustedY = e.clientY / zoomLevel;

  //     const box = elementRefCursor.current;
  //     if (box) {
  //       // Add null check here
  //       box.style.left = adjustedX + "px";
  //       box.style.top = adjustedY + "px";
  //     }
  //   };

  //   // Attach mousemove event listeners to each page element
  //   Array.from({ length: numPages }, (_, i) => i + 1).forEach((page) => {
  //     const pageElement = document.getElementById(`full-page-${page}`);
  //     if (pageElement) {
  //       pageElement.addEventListener("mousemove", handleMouseMove);
  //     }
  //   });

  //   // Cleanup function
  //   return () => {
  //     // Remove the mousemove event listener from each page element
  //     Array.from({ length: numPages }, (_, i) => i + 1).forEach((page) => {
  //       const pageElement = document.getElementById(`full-page-${page}`);
  //       if (pageElement) {
  //         pageElement.removeEventListener("mousemove", handleMouseMove);
  //       }
  //     });
  //   };
  // }, [numPages]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    const pagesArray = Array.from(
      { length: numPages },
      (_, index) => index + 1
    );

    console.log(pagesArray);
    if (numPages < 5) {
      setLoadedPages(pagesArray);
      setEndPage(numPages);
    }

    setPageNumber(1);

    setTimeout(() => {
      const fullPageElement = document.getElementById(`full-page-1`);
      if (fullPageElement) {
        fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
    console.log("DOUCMDGH LOSDED");
    // setIsDocumentLoaded(true)
  };

  const handleDownloadPDF = async () => {
    const location = await getUserLocation();
    const response = await fetch(`${imageUrls}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // download
    const postData1 = {
      email: emailMessage,
      bulk_link_id: file_id,
      timezone: location.timezone,
      location_country: location.country,
      ip_address: location.ip,
      location_date: location.date,
      event: "PUBLIC-FORM-DOWNLOADED",
      description: `${emailMessage} downloaded public form url ${fileName}`,
    };
    const apiData1 = await post("bulk_links/auditLogBulk", postData1); // Specify the endpoint you want to call
    //console.log('apixxsData');
    //console.log(apiData1);
  };
  const [editedIndex, setEditedIndex] = useState("");

  const handleDoubleClick = (index, item) => {
    setResizingIndex(index);
    setEditedItem(item);
    setIsResizing(true);
    //console.log('double click ');
  };
  const handleSignatureAdd = (index, item) => {
    setEditedIndex(index);
    // setSignatureModal(true);
    if (item.type === "signer_initials_text") {
      setInitialBox(true);
      setSignatureModal(true);
    } else {
      setInitialBox(false);
      setSignatureModal(true);
    }
  };
  // start

  // start

  useEffect(() => {
    const scrollContainer = scrollContainerRefCol2.current;

    if (scrollContainer) {
      console.log("SCROLL ERRORS scrollContainerRefCol2");

      // Add scroll event listener for col 2 container (thumbnails)
      scrollContainer.addEventListener("scroll", handleScrollCol2);

      return () => {
        if (scrollContainerRefCol2.current) {
          scrollContainerRefCol2.current.removeEventListener(
            "scroll",
            handleScrollCol2
          );
        }
      };
    }
  }, [loadedPages, numPages]);
  useEffect(() => {
    // IntersectionObserver to detect when the endPage is in view
    const pageElement = document.getElementById(`full-page-${endPage}`);
    if (pageElement) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadMorePages8(); // Load more pages when endPage is in view
              setEndPage((prevEndPage) => prevEndPage + 5); // Update endPage to the next 5 pages
            }
          });
        },
        {
          rootMargin: "0px",
          threshold: 0.5, // Trigger when 50% of the page is visible
        }
      );

      observer.current.observe(pageElement);
    }

    // Cleanup observer on component unmount
    return () => {
      if (observer.current && pageElement) {
        observer.current.unobserve(pageElement);
      }
    };
  }, [endPage, loadedPages8, loadingP8, numPages, setLoadedPages8]);
  const [showConfetti, setShowConfetti] = useState(false);

  // end
  useEffect(() => {
    if (DocSignerStatusModal) {
      // Get the modal size and set the confetti to display within the modal
      // const modalElement = document.querySelector('.modal-dialog-centered');
      // const { width, height } = modalElement.getBoundingClientRect();
      // setModalSize({ width, height });

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000); // Stop confetti after 5 seconds
    }
  }, [DocSignerStatusModal]);
  const [editedItem, setEditedItem] = useState();
  return (
    <>
      {isLoaded ? <FullScreenLoader /> : null}
      {isSmallScreen ? (
        <>
          <Row>
            <Col
              xl={12}
              md={12}
              sm={12}
              style={{
                // position: 'fixed',
                // top: 0,
                // left: 0,
                width: "100%",
                zIndex: 999,
                borderBottom: "1px solid #ececec",
                background: "white",
              }}
            >
              <Row>
                <Col
                  xl={12}
                  md={12}
                  sm={12}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBlock: "1%",
                    paddingInline: "2%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={compLogo}
                      style={{
                        width: "150px",
                        height: "50px",
                        objectFit: "contain",
                        marginLeft: "20px",
                        marginRight: "20px",
                      }}
                    />
                    <h4
                      className="fw-bold"
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                    >
                      {fileName.length > 10
                        ? fileName.substring(0, 10) + "..."
                        : fileName}
                      .pdf
                    </h4>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      alignItems: "center",
                    }}
                  ></div>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row>
                <Col
                  xs={12}
                  md={12}
                  style={{
                    cursor:
                      type === "my_text" || type === "signer_text"
                        ? "none"
                        : type
                        ? "none"
                        : "default",
                    border: "1px solid lightGrey",
                    // maxHeight: "92dvh",
                    paddingTop: "10px",
                    overflow: "auto",
                  }}
                >
                  {isLoadingDoc && ( // Conditionally render spinner if isLoading is true
                    <div style={{ display: "flex", justifyContent: "right" }}>
                      <Spinner />
                    </div>
                  )}
                  <div
                    style={{
                      position: "relative",
                      marginBottom: "130px",
                      // height: "90dvh",
                      // height:window.innerWidth
                      // transform: `scale(${zoomPercentage / 100})`,
                      // transformOrigin: "top left",
                      padding: "10px",
                    }}
                  >
                    <Document
                      // style={{ width: "100%", height: "100%" }}
                      file={`${imageUrls}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onError={onDocumentLoadError}
                    >
                      {Array.from({ length: numPages }, (_, i) => i + 1).map(
                        (page) => (
                          <>
                            <div
                              id={`full-page-${page}`}
                              style={{ position: "relative" }}
                              //  id={`full-page-${page}`} style={{position: 'relative'}}
                            >
                              <Page
                                scale={scale}
                                onLoadSuccess={({ width }) => {
                                  setCanvasWidth(width);
                                }}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                key={page}
                                pageNumber={page}
                                onClick={() => setPageNumber(page)}
                                canvasRef={(ref) =>
                                  (canvasRefs.current[page - 1] = ref)
                                }
                              >
                                {textItems.map((field, index) => (
                                  <>
                                    <Rnd
                                      disableDragging={true} // disable dragging
                                      disableResizing={{
                                        top: true,
                                        right: true,
                                        bottom: true,
                                        left: true,
                                        topRight: true,
                                        bottomRight: true,
                                        bottomLeft: true,
                                        topLeft: true,
                                      }}
                                      key={field.id}
                                      style={{
                                        // border: field.type==="checkmark" || field.type==="radio" ?'none':'1px solid lightgrey',

                                        // display: field.bgImg === activePage ? 'block' : 'none',
                                        display: "block", // Always render the component
                                        visibility:
                                          field.page_no === page
                                            ? "visible"
                                            : "hidden",
                                        transform: `translate(${field.x}px, ${field.y}px)`,
                                        willChange: "transform",
                                        touchAction: "none",
                                        // Hide/show based on condition
                                        zIndex: 2,
                                      }}
                                      id={`item-${field.id}-${page}`}
                                      size={{
                                        width: field.width * scale,
                                        height: field.height * scale,
                                      }}
                                      position={{
                                        x: field.x * scale,
                                        y: field.y * scale,
                                      }}
                                    >
                                      <div ref={containerRef}>
                                        <ComponentForItemType
                                          // handleKeyPress={(e)=>handleKeyPress(e,index)}
                                          // SignerActivePosition={SignerActivePosition}
                                          SignersWhoHaveCompletedSigning={
                                            SignersWhoHaveCompletedSigning
                                          }
                                          // RequiredActive={field.required}
                                          RequiredActive={RequiredActive}
                                          key={index}
                                          item={field}
                                          handleFileChange={(e) =>
                                            handleImageChangeDummyEdit(e, index)
                                          }
                                          // handleFileChange={e => handleFileChange(e, index)}
                                          handleInputChangedDate={(e) =>
                                            handleInputChangedDate(e, index)
                                          }
                                          handleInputChecked={(e) =>
                                            handleInputChecked(e, index)
                                          }
                                          handleSelectDropDownItem={(e) =>
                                            handleSelectDropDownItem(e, index)
                                          }
                                          handleInputChanged={(e) =>
                                            handleInputChanged(e, index)
                                          }
                                          handleDoubleClick={() =>
                                            handleDoubleClick(index, field)
                                          }
                                          onTouchEnd={() =>
                                            handleDoubleClick(index, field)
                                          }
                                          handleSignatureAdd={() =>
                                            handleSignatureAdd(index, field)
                                          }
                                          IsSigner={true}
                                          signer_id={field.signer_id}
                                          signerObject={selectedSigner}
                                          activeSignerId={parseInt(
                                            selectedSigner.signer_id
                                          )}
                                          zoomPercentage={scale}
                                        />
                                      </div>
                                    </Rnd>
                                  </>
                                ))}
                              </Page>
                              <h6
                                style={{
                                  marginBlock: "10px",
                                  textAlign: "left",
                                }}
                              >
                                {" "}
                                Page {page}
                              </h6>{" "}
                            </div>{" "}
                          </>
                        )
                      )}
                    </Document>
                  </div>
                </Col>
                {/* <Col
                    xs={12}
                    style={{
                      height: "200px",
                      width: "10px",
                      backgroundColor: "black",
                    }}
                  ></Col> */}
              </Row>
            </Col>
          </Row>
          {DocSignerStatusModal === false &&
            MarkAsCompleted === false &&
            AccessCodeModal === false &&
            isLoaded === false &&
            SignatureModal === false && (
              <div
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  zIndex: 22222222222222,
                  width: parseInt(window.innerWidth),
                  overflowX: "scroll",
                  overflowY: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  justifyContent: "left",

                  borderTop: ".5px solid lightGrey",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                    alignItems: "center",
                  }}
                >
                  <Button
                    disabled={AccessCodeModal}
                    color="primary"
                    size="sm"
                    onClick={handleDownloadPDF}
                    style={{
                      display: "flex",
                      boxShadow: "none",
                      justifyContent: "center",
                      marginRight: "10px",
                      alignItems: "center",
                    }}
                    className="btn-icon d-flex"
                  >
                    <span
                      style={{ fontSize: "16px", letterSpacing: ".5px" }}
                      className="align-middle ms-25"
                    >
                      Download
                    </span>
                  </Button>
                  <select
                    style={{
                      border: "1px solid lightGrey",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    value={scale}
                    id="zoom"
                    onChange={handleZoomChange}
                  >
                    {zoomOptions.map((option) => (
                      <option key={option} value={option}>
                        {option * 100}%
                      </option>
                    ))}
                  </select>
                  {textItems.some(
                    (item) =>
                      item.signer_id === 123 &&
                      item.required === true &&
                      (item.text === null ||
                        item.text === " " ||
                        item.text === "" ||
                        item.url === null)
                  ) ? (
                    <Button
                      size="sm"
                      disabled={AccessCodeModal}
                      color="warning"
                      onClick={async () => {
                        //console.log('text');
                        //console.log(textItems);

                        const emptyRows = textItems.filter(
                          (item) =>
                            item.signer_id === 123 &&
                            item.required === true &&
                            (item.text === null ||
                              item.text === " " ||
                              item.text === "" ||
                              item.url === null)
                        );

                        // Check if there are any empty rows
                        if (emptyRows.length > 0) {
                          // Perform action with the empty rows if needed
                          //console.log(emptyRows);
                          handleButtonClicked(
                            emptyRows[0].id,
                            emptyRows[0].page_no
                          );
                          // toastAlert(
                          //   "error",
                          //   "Please complete all required fields to proceed!"
                          // );
                        } else {
                          // Log a message if no empty rows are found
                          //console.log('No empty row found');
                          // saveData();
                          setFinishButtonEnable(false);
                        }
                      }}
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        display: "flex",
                        boxShadow: "none",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="btn-icon d-flex"
                    >
                      <span
                        style={{ fontSize: "16px" }}
                        className="align-middle ms-25"
                      >
                        Next
                      </span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={
                        AccessCodeModal ||
                        textItems.some(
                          (item) =>
                            item.signer_id === "selectedSigner.signer_id" &&
                            item.required === true &&
                            (item.text === null ||
                              item.text === " " ||
                              item.text === "" ||
                              item.url === null)
                        )
                          ? true
                          : false
                      }
                      color="success"
                      onClick={async () => {
                        setMarkAsCompleted(true);
                      }}
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        display: "flex",
                        boxShadow: "none",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="btn-icon d-flex"
                    >
                      <span
                        style={{ fontSize: "16px" }}
                        className="align-middle ms-25"
                      >
                        Finish
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            )}
        </>
      ) : (
        <Row>
          <Col
            xl={12}
            md={12}
            sm={12}
            style={{
              // position: 'fixed',
              // top: 0,
              // left: 0,
              width: "100%",
              zIndex: 999,
              borderBottom: "1px solid #ececec",
              background: "white",
            }}
          >
            <Row>
              <Col
                xl={12}
                md={12}
                sm={12}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBlock: "0.2%",
                  paddingInline: "2%",
                }}
              >
                {/* back button
                 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Button
                  style={{backgroundColor: 'white', boxShadow: 'none', height: '40px', marginLeft: '20px'}}
                  color="white"
                  onClick={async () => {
                    if (statusFile === 'InProgress') {
                      if (window.confirm('Do you want to save the previous changes?')) {
                        await saveData();
                      }
                      window.location.href = '/home';
                    } else {
                      window.location.href = '/home';
                    }
                  }}
                  className="btn-icon d-flex">
                  <ArrowLeft size={20} style={{color: '#2367a6'}} />
                </Button>
                <CustomButton
                  padding={true}
                  useDefaultColor={true}
                  size="sm"
                  // disabled={saveLoading}
                  color="primary"
                
                  onClick={async () => {
                    window.location.href = `/template`;
                  }}
                  style={{
                    display: "flex",
                    boxShadow: "none",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="btn-icon d-flex"
                  text={
                    <>
                      <span className="align-middle ms-25">Back</span>
                    </>
                  }
                /> */}
                  <img
                    src={compLogo}
                    style={{
                      width: "160px",
                      height: "50px",
                      objectFit: "contain",
                      marginLeft: "20px",
                      marginRight: "20px",
                    }}
                  />
                  {AccessCodeModal ? null : (
                    <h2
                      className="fw-bold"
                      style={{ marginLeft: "10px", marginTop: "5px" }}
                    >
                      {fileName}.pdf
                    </h2>
                  )}
                </div>
                <div>
                  <select
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      border: "1px solid lightGrey",
                      textAlign: "center",
                      textAlignLast: "center",
                    }}
                    value={scale}
                    onChange={handleZoomChange}
                  >
                    {zoomOptions.map((option) => (
                      <option key={option} value={option}>
                        {option * 100}%
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // disabled={saveLoading}
                    color="warning"
                    onClick={handleDownloadPDF}
                    disabled={AccessCodeModal}
                    style={{
                      display: "flex",
                      boxShadow: "none",
                      justifyContent: "center",
                      marginRight: "10px",
                      alignItems: "center",
                    }}
                    className="btn-icon d-flex"
                  >
                    {/* leeter spacing 1 */}
                    <span
                      style={{ fontSize: "16px", letterSpacing: ".5px" }}
                      className="align-middle ms-25"
                    >
                      Download Original
                    </span>
                  </Button>
                  {textItems.some(
                    (item) =>
                      item.signer_id === 123 &&
                      item.required === true &&
                      (item.text === null ||
                        item.text === " " ||
                        item.text === "" ||
                        item.url === null)
                  ) ? (
                    <Button
                      disabled={AccessCodeModal}
                      color="warning"
                      onClick={async () => {
                        //console.log('text');
                        //console.log(textItems);

                        const emptyRows = textItems.filter(
                          (item) =>
                            item.signer_id === 123 &&
                            item.required === true &&
                            (item.text === null ||
                              item.text === " " ||
                              item.text === "" ||
                              item.url === null)
                        );

                        // Check if there are any empty rows
                        if (emptyRows.length > 0) {
                          // Perform action with the empty rows if needed
                          //console.log(emptyRows);
                          handleButtonClicked(
                            emptyRows[0].id,
                            emptyRows[0].page_no
                          );
                          // toastAlert(
                          //   "error",
                          //   "Please complete all required fields to proceed!"
                          // );
                        } else {
                          // Log a message if no empty rows are found
                          //console.log('No empty row found');
                          // saveData();
                          setFinishButtonEnable(false);
                        }
                      }}
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        display: "flex",
                        boxShadow: "none",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="btn-icon d-flex"
                    >
                      <span
                        style={{ fontSize: "16px" }}
                        className="align-middle ms-25"
                      >
                        Next
                      </span>
                    </Button>
                  ) : (
                    <Button
                      disabled={
                        AccessCodeModal ||
                        textItems.some(
                          (item) =>
                            item.signer_id === "selectedSigner.signer_id" &&
                            item.required === true &&
                            (item.text === null ||
                              item.text === " " ||
                              item.text === "" ||
                              item.url === null)
                        )
                          ? true
                          : false
                      }
                      color="success"
                      onClick={async () => {
                        setMarkAsCompleted(true);
                      }}
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        display: "flex",
                        boxShadow: "none",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="btn-icon d-flex"
                    >
                      <span
                        style={{ fontSize: "16px" }}
                        className="align-middle ms-25"
                      >
                        Finish & Submit
                      </span>
                    </Button>
                  )}
                  {/* {statusFile === 'InProgress' ? (
                  <>
                    {onlySigner === true || onlySigner === 'true' ? (
                      <Button
                        color="success"
                        onClick={async () => {
                          const postData = {
                            file_id: file_id,
                            status: 'Completed',
                          };
                          try {
                            const apiData = await post('file/update-file', postData); // Specify the endpoint you want to call
                            //console.log('Update File Controls ');
                            //console.log(apiData);
                            if (apiData.error) {
                              toastAlert('error', apiData.message);
                              // setFileName("")
                              // setInputValue("")
                            } else {
                              // //console.log(apiData.result)
                              toastAlert('succes', apiData.message);

                              await saveData();
                              window.location.href = '/home';
                            }
                          } catch (error) {
                            //console.log('Error fetching data:', error);
                          }
                        }}
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          display: 'flex',
                          boxShadow: 'none',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        className="btn-icon d-flex">
                        <span style={{fontSize: '16px'}} className="align-middle ms-25">
                          Finish
                        </span>
                      </Button>
                    ) : (
                      <Button
                        disabled={signersData.length === 0 ? true : false}
                        color="primary"
                        onClick={() => {
                          if (signersData.length === 0) {
                            toastAlert('error', 'Please Add Signers');
                          } else {
                            setSendToEsign(true);
                          }
                        }}
                        style={{
                          marginLeft: '10px',

                          display: 'flex',
                          boxShadow: 'none',
                          height: '40px',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        className="btn-icon d-flex">
                        <span style={{fontSize: '16px'}} className="align-middle ms-25">
                          Send E-Sign
                        </span>
                      </Button>
                    )}
                  </>
                ) : (
                  <></>
                )} */}
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row>
              <Col
                xs={2}
                style={{
                  backgroundColor: "white",
                }}
              ></Col>

              <Col
                xs={8}
                ref={colRef}
                style={{
                  cursor:
                    type === "my_text" || type === "signer_text"
                      ? "none"
                      : type
                      ? "none"
                      : "default",
                  backgroundColor: "#eaeaea",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // maxHeight: '87dvh',
                  paddingTop: "10px",
                  overflow: "auto",
                }}
              >
                {/* editor  */}
                {isLoadingDoc && ( // Conditionally render spinner if isLoading is true
                  <div style={{ display: "flex", justifyContent: "right" }}>
                    {/* Render your spinner component */}
                    <Spinner />
                  </div>
                )}
                {/* <button onClick={() => handleButtonClicked(5107)}>Scroll and Return Object</button> */}

                <div
                  style={{
                    height: "92dvh",
                    position: "relative",
                    // display:AccessCodeModal?"none":"flex"
                  }}
                >
                  {" "}
                  {AccessCodeModal ? null : (
                    <Document
                      file={`${imageUrls}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      {/* <Page
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    pageNumber={pageNumber}
                    width={canvasWidth}
                  /> */}

                      {Array.from({ length: numPages }, (_, i) => i + 1)
                        .slice(0, endPage) // Only render a specific range of pages
                        .map((page) => (
                          <>
                            <div
                              id={`full-page-${page}`}
                              key={page}
                              style={{ marginBottom: "20px" }}
                            >
                              {/* <div
                          id={`page-${page}`}
                          key={`page-${page}`}
                          style={{position: 'absolute', top: 10, left: 10, zIndex: 2}}>
                          <h6 style={{color: 'black', fontSize: '16px'}}>Document ID: {Uniq_id_doc}</h6>
                        </div> */}
                              <Page
                                onLoadSuccess={({ width }) => {
                                  setCanvasWidth(width);
                                }}
                                scale={scale}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                key={page}
                                onMouseEnter={() => {
                                
                                  console.log("page",page)
                       
                         setActivePage(page)
                         setPageNumber(page)
                         // Ensure the thumbnail scrolls into view in Col 2
  const thumbnailElement = document.getElementById(`thumbnail-page-${page}`);
  if (thumbnailElement && scrollContainerRefCol2.current) {
    // Fallback to manual scroll if `scrollIntoView` fails
    thumbnailElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
                                }}
                                pageNumber={page}
                                canvasRef={(ref) =>
                                  (canvasRefs.current[page - 1] = ref)
                                }
                                // className={activePage === page ? 'active-page' : ''}
                                // onClick={() => handlePageClick(page)}
                              >
                                {textItems.map((field, index) => (
                                  <>
                                    <Rnd
                                      id={`item-${field.id}-${page}`}
                                      // id={`rnd-com-${field.id}`}
                                      // ref={scrollToRef}
                                      disableDragging={true} // disable dragging
                                      disableResizing={{
                                        top: true,
                                        right: true,
                                        bottom: true,
                                        left: true,
                                        topRight: true,
                                        bottomRight: true,
                                        bottomLeft: true,
                                        topLeft: true,
                                      }} // disable resizing from all sides
                                      key={field.id}
                                      style={{
                                        // border: field.type==="checkmark" || field.type==="radio" ?'none':'1px solid lightgrey',
                                        border:
                                          isResizing && resizingIndex === index
                                            ? "2px solid rgba(98,188,221,1)"
                                            : "none",
                                        display: "block", // Always render the component
                                        visibility:
                                          field.page_no === page
                                            ? "visible"
                                            : "hidden", // Hide/show based on condition
                                        zIndex: 2,
                                      }}
                                      size={{
                                        width: field.width * scale,
                                        height: field.height * scale,
                                      }}
                                      // position={{x: field.x, y: field.y}}
                                      position={{
                                        x: field.x * scale,
                                        y: field.y * scale,
                                      }}
                                      onDragStop={(e, d) => {}}
                                      onResizeStop={(
                                        e,
                                        direction,
                                        ref,
                                        delta,
                                        position
                                      ) => {}}
                                      bounds="parent"
                                    >
                                      <ComponentForItemType
                                        // handleKeyPress={(e)=>handleKeyPress(e,index)}
                                        // SignerActivePosition={SignerActivePosition}
                                        SignersWhoHaveCompletedSigning={
                                          SignersWhoHaveCompletedSigning
                                        }
                                        RequiredActive={RequiredActive}
                                        key={index}
                                        item={field}
                                        handleFileChange={(e) =>
                                          handleFileChange(e, index)
                                        }
                                        handleInputChangedDate={(e) =>
                                          handleInputChangedDate(e, index)
                                        }
                                        handleInputChecked={(e) =>
                                          handleInputChecked(e, index)
                                        }
                                        handleSelectDropDownItem={(e) =>
                                          handleSelectDropDownItem(e, index)
                                        }
                                        handleInputChanged={(e) =>
                                          handleInputChanged(e, index)
                                        }
                                        handleDoubleClick={() =>
                                          handleDoubleClick(index, field)
                                        }
                                        handleSignatureAdd={() =>
                                          handleSignatureAdd(index, field)
                                        }
                                        IsSigner={true}
                                        zoomPercentage={scale}
                                        signer_id={field.signer_id}
                                        signerObject={selectedSigner}
                                        activeSignerId={123}
                                      />
                                    </Rnd>
                                  </>
                                ))}
                              </Page>
                              <h5
                                style={{
                                  marginBlock: "10px",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                Page {page}
                              </h5>{" "}
                            </div>{" "}
                          </>
                        ))}
                    </Document>
                  )}
                  {/* </div> */}
                </div>
              </Col>
              <Col
                xs={2}
                style={{
                  position: "relative",
                  backgroundColor: "white",
                  border: "1px solid lightGrey",
                  maxHeight: "93dvh",
                  overflow: "auto",
                }}
              >
                {AccessCodeModal ? null : (
                  <div
                    ref={scrollContainerRefCol2}
                    // style={{
                    //   display: "flex",
                    //   flexDirection: "column",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    style={{ overflowY: "auto", maxHeight: "93dvh" }}
                  >
                    <div
                      style={{
                        display: AccessCodeModal ? "none" : "flex",

                        justifyContent: "center",
                        width: "100%",
                        marginTop: "25px",
                      }}
                    >
                      <Document
                        file={`${imageUrls}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        noData="No PDF loaded"
                      >
                        {loadedPages.map((page) => {
                          const hasItems = hasTextItems(page); // Check if the page has textItems

                          return (
                            <>
                              <div
                                        id={`thumbnail-page-${page}`}

                                // key={`thumbnail-${page}`}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  id={`full-page-${page}`}
                                  key={page}
                                  style={{
                                    border:
                                      pageNumber === page
                                        ? `1px solid ${primary_color}`
                                        : "1px solid lightGrey",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (pageNumber !== page) {
                                      e.target.style.border =
                                        "1px solid #c4c4c4";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (pageNumber !== page) {
                                      e.target.style.border = "1px solid white";
                                    }
                                  }}
                                  onClick={() => handlePageClick(page)}
                                >
                                  <Page
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                    key={`thumbnail-page-${page}`}
                                    pageNumber={page}
                                    width={180}
                                    className={
                                      activePage === page ? "active-page" : ""
                                    }
                                    // onClick={() => handlePageClick(page)}
                                  >
                                    {hasItems && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "5px",
                                          left: "5px",
                                          backgroundColor:
                                            "rgb(255 214 91 / 78%)", // Semi-transparent background
                                          color: "white",
                                          padding: "2px 5px",
                                          width: "20px",
                                          height: "20px",
                                          borderRadius: "50%",
                                          fontSize: "12px",
                                        }}
                                      ></div>
                                    )}
                                  </Page>
                                </div>
                                <h6
                                  style={{
                                    marginBlock: "10px",
                                    textAlign: "center",
                                  }}
                                >
                                  {" "}
                                  Page {page}
                                </h6>{" "}
                              </div>
                            </>
                          );
                        })}
                        {loadingP && (
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Spinner />
                            </div>
                          </div>
                        )}
                      </Document>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {/* signature modal  */}
      <Modal
        isOpen={SignatureModal}
        toggle={() => setSignatureModal(!SignatureModal)}
        className="modal-dialog-centered modal-lg"
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!SignatureModal)}></ModalHeader> */}
        <ModalBody className=" pb-5">
          <SignatureModalContent
            user_id_user={userIdFile}
            modalClose={() => {
              setSignatureModal(!SignatureModal);
            }}
            returnedSignature={placeImage}
            file_id={file_id}
            profile={true}
            initialsBox={initialBox}
          />
        </ModalBody>
      </Modal>
      {/* Checks starter  modal  */}
      <Modal
        isOpen={AccessCodeModal}
        // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        className="modal-dialog-centered modal-md"
        // onClosed={() => setCardType('')}
      >
        <ModalHeader
          // className="bg-transparent"
          className="bg-transparent"

          // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-2 backdrop-blur">
          <Row style={{ paddingBlock: "10px" }}>
            <Col
              xs={12}
              md={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {/* {ResponseLimitCompleted ? null : (
                <img
                  // src={compLogo}
                  src={logoWelcome}
                  style={{
                    width: "100px",
                    height: "auto",
                    marginBottom: "10px",
                    objectFit: "contain",
                  }}
                />
              )} */}
            </Col>
            {loaderData ? (
              <Col
                xs={12}
                md={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <h3>
                  <Spinner color="primary" />
                </h3>
              </Col>
            ) : (
              <>
                {ResponseLimitCompleted ? (
                  <Col
                    xs={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "4%",
                    }}
                  >
                    <img
                      src={accessDenied}
                      style={{
                        width: "150px",
                        height: "auto",
                      }}
                    />
                    <h1
                      className="fw-bold"
                      style={{
                        paddingTop: "3%",
                        textAlign: "center",
                        fontWeight: 900,
                        color: "red",
                      }}
                    >
                      Oops! Response Limit Exceeded
                    </h1>
                    <h3
                      className="form-label fw-bold"
                      style={{
                        letterSpacing: "0.5px",
                        textAlign: "center",
                        lineHeight: 1.5,
                        fontSize: "16px",
                      }}
                      for="login-email"
                    >
                      We've reached the maximum responses for this form. You can
                      no longer submit your information.
                    </h3>
                  </Col>
                ) : (
                  <>
                    {expiredLink ? (
                      <Col
                        xs={12}
                        md={12}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={linkExpired}
                          style={{
                            width: "150px",
                            height: "auto",
                          }}
                        />
                        <h1
                          className="fw-bold"
                          style={{
                            paddingTop: "1%",
                            textAlign: "center",
                            fontWeight: 900,
                            color: "red",
                          }}
                        >
                          Link Expired
                        </h1>
                        <h3
                          className="form-label fw-bold"
                          style={{
                            letterSpacing: "0.5px",
                            textAlign: "center",
                            lineHeight: 1.5,
                            fontSize: "16px",
                          }}
                          for="login-email"
                        >
                          The link you are trying to access has expired. Please
                          request a new one.
                        </h3>
                      </Col>
                    ) : (
                      <Col
                        xs={12}
                        md={12}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          // height: "90vh",
                          // padding: "4%",
                        }}
                      >
                        <img
                          // src={compLogo}
                          src={logoWelcome}
                          style={{
                            width: "100px",
                            height: "auto",
                            marginBottom: "10px",
                            objectFit: "contain",
                          }}
                        />
                        <h1
                          className="fw-bold"
                          style={{
                            textAlign: "center",
                            fontWeight: 900,
                            color: "#115fa7",
                            lineHeight: 1.5,
                          }}
                        >
                          {welcomeMessage}
                        </h1>

                        {/* <h2 className="fw-bold" style={{lineHeight: 1.5}}>
                          Acknowledgement Message
                        </h2> */}
                        <h3
                          className="form-label fw-bold"
                          for="login-email"
                          style={{
                            letterSpacing: "0.5px",
                            textAlign: "center",
                            lineHeight: 1.5,
                            fontSize: "16px",
                          }}
                        >
                          {acknowledgmentMessage}
                        </h3>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            <Input
                              type="checkbox"
                              id="remember-me"
                              checked={acknowledgement_messageCheck}
                              onChange={(e) => {
                                //console.log(e.target.checked);

                                setacknowledgement_messageCheck(
                                  e.target.checked
                                );
                              }}
                            />

                            <Label
                              style={{
                                marginLeft: "10px",
                                paddingTop: "2px",
                              }}
                              className="form-label"
                              for="remember-me"
                            >
                              I agree to the{" "}
                              <Link to={bulkLinkTermsAndConditionLink}>
                                terms & conditions{" "}
                              </Link>{" "}
                              for e-signature.
                            </Label>
                          </div>

                          <Input
                            style={{
                              marginTop: "20px",
                              fontSize: "16px",
                              boxShadow: "none",
                            }}
                            className={`form-control `}
                            placeholder="Enter Email"
                            type="text"
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            id="login-email"
                            autoFocus
                          />
                          {emailMessage && !isValidEmail(emailMessage) && (
                            <h5 style={{ color: "red", marginTop: "10px" }}>
                              Please enter a valid email address.
                            </h5>
                          )}
                          {verificationOTP ? (
                            <>
                              <Input
                                value={code}
                                onChange={(event) =>
                                  setCode(event.target.value)
                                }
                                style={{
                                  // height: '50px',
                                  boxShadow: "none",
                                  marginTop: "10px",
                                  fontSize: "16px",
                                }}
                                className={`form-control`}
                                type="number"
                                placeholder="Enter OTP"
                                id="login-email"
                                autoFocus
                              />
                              <h3 style={{ marginTop: "10px" }}>
                                Type OTP send in your email
                              </h3>
                            </>
                          ) : null}

                          {verificationNeeded ? (
                            <CustomButton
                              padding={true}
                              useDefaultColor={false}
                              size="sm"
                              // disabled={saveLoading}
                              color={compPrimaryColor}
                              disabled={
                                isSubmitting ||
                                // acknowledgement_messageCheck === false ||
                                !isValidEmail(emailMessage)
                              }
                              onClick={async () => {
                                if (acknowledgement_messageCheck === false) {
                                  return toastAlert(
                                    "error",
                                    "Please agree to the terms and conditions"
                                  );
                                }
                                setIsSubmitting(true);
                                const postData = {
                                  email: emailMessage,
                                  bulk_link_id: file_id,
                                };
                                const apiData = await post(
                                  "bulk_links/checkEmailExistforSpecificResponse",
                                  postData
                                ); // Specify the endpoint you want to call
                                //console.log('apixxsData');

                                //console.log(apiData);
                                if (
                                  apiData.error === true ||
                                  apiData.error === "true"
                                ) {
                                  toastAlert(
                                    "error",
                                    "Can't submit response with same Email"
                                  );
                                  setIsSubmitting(false);
                                } else {
                                  const postData1 = {
                                    email: emailMessage,
                                    company_id: compId,
                                  };
                                  const apiData1 = await post(
                                    "user/account-verification",
                                    postData1
                                  ); // Specify the endpoint you want to call
                                  console.log("apixxsData");

                                  console.log(apiData1);
                                  if (apiData1.error) {
                                    setIsSubmitting(false);

                                    toastAlert("error", apiData1.message);
                                  } else {
                                    setIsSubmitting(false);
                                    // set localStorage
                                    localStorage.setItem(
                                      "otp",
                                      JSON.stringify(apiData1)
                                    );
                                    setVerificationOTP(true);
                                    setVerificationNeeded(false);
                                    // toastAlert("success", apiData.message)
                                    setTimeout(() => {
                                      // setSendToEsign(false)
                                      setIsSubmitting(false);
                                      setResendOTPButton(true);
                                      // setProceedBtn(true)

                                      //  10 sec
                                    }, 1000);
                                  }
                                  // end
                                }
                              }}
                              style={{
                                display: "flex",
                                boxShadow: "none",
                                justifyContent: "center",
                                marginRight: "10px",
                                width: "100%",
                                alignItems: "center",
                                marginTop: "20px",
                              }}
                              className="btn-icon d-flex"
                              text={
                                <>
                                  {isSubmitting ? (
                                    <Spinner color="white" size="sm" />
                                  ) : null}
                                  <span
                                    style={{ fontSize: "16px" }}
                                    className="align-middle ms-25"
                                  >
                                    {" "}
                                    Verify
                                  </span>
                                </>
                              }
                            />
                          ) : (
                            <>
                              <CustomButton
                                padding={true}
                                useDefaultColor={false}
                                size="sm"
                                onClick={async () => {
                                  if (acknowledgement_messageCheck === false) {
                                    return toastAlert(
                                      "error",
                                      "Please agree to the terms and conditions"
                                    );
                                  }
                                  setIsSubmitting(true);
                                  let locationData = await getUserLocation();
                                  //console.log(verificationOTP);
                                  if (verificationOTP === true) {
                                    //console.log('match OTP ');
                                    const localCode = JSON.parse(
                                      localStorage.getItem("otp")
                                    );
                                    if (code === "") {
                                      toastAlert(
                                        "error",
                                        "Enter OTP to verify!"
                                      );
                                      setIsSubmitting(false);
                                    } else {
                                      //console.log(`localCode: "${localCode}"`);
                                      //console.log(`code: "${code}"`);
                                      //console.log(`parseInt(localCode): ${parseInt(localCode.otp)}`);
                                      //console.log(`parseInt(code): ${parseInt(code)}`);
                                      const LocalCoded = localCode.otp;
                                      if (
                                        parseInt(LocalCoded) === parseInt(code)
                                      ) {
                                        setIsSubmitting(true);

                                        setTimeout(() => {
                                          setIsSubmitting(false);
                                          // setProceedBtn(true)
                                          setIsSubmitting(true);
                                          setTimeout(async () => {
                                            setAccessCodeModal(false);
                                            // opened doc audit log

                                            setIsSubmitting(false);
                                            const postData1 = {
                                              email: emailMessage,
                                              bulk_link_id: file_id,
                                              timezone: locationData.timezone,
                                              location_country:
                                                locationData.country,
                                              ip_address: locationData.ip,
                                              location_date: locationData.date,
                                              event: "PUBLIC-FORM-OPENED",
                                              description: `${emailMessage} opened public form url ${fileName}`,
                                            };
                                            const apiData1 = await post(
                                              "bulk_links/auditLogBulk",
                                              postData1
                                            ); // Specify the endpoint you want to call
                                            //console.log('apixxsData');
                                            //console.log(apiData1);
                                            //  10 sec
                                          }, 1000);
                                        }, 1000);
                                      } else {
                                        toastAlert("error", "Invalid OTP");
                                      }
                                    }
                                  } else {
                                    //console.log('Access Code');
                                    const postData = {
                                      email: emailMessage,
                                      bulk_link_id: file_id,
                                    };
                                    const apiData = await post(
                                      "bulk_links/checkEmailExistforSpecificResponse",
                                      postData
                                    ); // Specify the endpoint you want to call
                                    //console.log('apixxsData');

                                    //console.log(apiData);
                                    if (
                                      apiData.error === true ||
                                      apiData.error === "true"
                                    ) {
                                      toastAlert(
                                        "error",
                                        "Can't submit response with same Email"
                                      );
                                      setIsSubmitting(false);
                                    } else {
                                      setAccessCodeModal(false);
                                      // opened doc audit log

                                      const postData1 = {
                                        email: emailMessage,
                                        bulk_link_id: file_id,
                                        timezone: locationData.timezone,
                                        location_country: locationData.country,
                                        ip_address: locationData.ip,
                                        location_date: locationData.date,
                                        event: "PUBLIC-FORM-OPENED",
                                        description: `${emailMessage} opened public form url ${fileName}`,
                                      };
                                      const apiData1 = await post(
                                        "bulk_links/auditLogBulk",
                                        postData1
                                      ); // Specify the endpoint you want to call
                                      //console.log('apixxsData');
                                      //console.log(apiData1);
                                    }
                                  }
                                }}
                                disabled={
                                  isSubmitting ||
                                  // acknowledgement_messageCheck === false ||
                                  !isValidEmail(emailMessage)
                                }
                                color={compPrimaryColor}
                                // compPrimaryColor={compPrimaryColor}
                                text={
                                  <>
                                    {isSubmitting ? (
                                      <Spinner color="white" size="sm" />
                                    ) : null}
                                    <span
                                      style={{ fontSize: "16px" }}
                                      className="align-middle ms-25"
                                    >
                                      {" "}
                                      Open
                                    </span>
                                  </>
                                }
                                style={{
                                  boxShadow: "none",
                                  marginTop: "10px",
                                  width: "100%",
                                  height: "40px",
                                }}
                              />
                              {/* <Button
                                size="sm"
                                style={{
                                  boxShadow: "none",
                                  marginTop: "10px",
                                  height: "40px",
                                }}
                                onClick={async () => {
                                  setIsSubmitting(true);
                                  let locationData = await getUserLocation();
                                  //console.log(verificationOTP);
                                  if (verificationOTP === true) {
                                    //console.log('match OTP ');
                                    const localCode = JSON.parse(
                                      localStorage.getItem("otp")
                                    );
                                    if (code === "") {
                                      toastAlert(
                                        "error",
                                        "Enter OTP to verify!"
                                      );
                                      setIsSubmitting(false);
                                    } else {
                                      //console.log(`localCode: "${localCode}"`);
                                      //console.log(`code: "${code}"`);
                                      //console.log(`parseInt(localCode): ${parseInt(localCode.otp)}`);
                                      //console.log(`parseInt(code): ${parseInt(code)}`);
                                      const LocalCoded = localCode.otp;
                                      if (
                                        parseInt(LocalCoded) === parseInt(code)
                                      ) {
                                        setIsSubmitting(true);

                                        setTimeout(() => {
                                          setIsSubmitting(false);
                                          // setProceedBtn(true)
                                          setIsSubmitting(true);
                                          setTimeout(async () => {
                                            setAccessCodeModal(false);
                                            // opened doc audit log

                                            setIsSubmitting(false);
                                            const postData1 = {
                                              email: emailMessage,
                                              bulk_link_id: file_id,
                                              timezone: locationData.timezone,
                                              location_country:
                                                locationData.country,
                                              ip_address: locationData.ip,
                                              location_date: locationData.date,
                                              event: "PUBLIC-FORM-OPENED",
                                              description: `${emailMessage} opened public form url ${fileName}`,
                                            };
                                            const apiData1 = await post(
                                              "bulk_links/auditLogBulk",
                                              postData1
                                            ); // Specify the endpoint you want to call
                                            //console.log('apixxsData');
                                            //console.log(apiData1);
                                            //  10 sec
                                          }, 1000);
                                        }, 1000);
                                      } else {
                                        toastAlert("error", "Invalid OTP");
                                      }
                                    }
                                  } else {
                                    //console.log('Access Code');
                                    const postData = {
                                      email: emailMessage,
                                      bulk_link_id: file_id,
                                    };
                                    const apiData = await post(
                                      "bulk_links/checkEmailExistforSpecificResponse",
                                      postData
                                    ); // Specify the endpoint you want to call
                                    //console.log('apixxsData');

                                    //console.log(apiData);
                                    if (
                                      apiData.error === true ||
                                      apiData.error === "true"
                                    ) {
                                      toastAlert(
                                        "error",
                                        "Can't submit response with same Email"
                                      );
                                      setIsSubmitting(false);
                                    } else {
                                      setAccessCodeModal(false);
                                      // opened doc audit log

                                      const postData1 = {
                                        email: emailMessage,
                                        bulk_link_id: file_id,
                                        timezone: locationData.timezone,
                                        location_country: locationData.country,
                                        ip_address: locationData.ip,
                                        location_date: locationData.date,
                                        event: "PUBLIC-FORM-OPENED",
                                        description: `${emailMessage} opened public form url ${fileName}`,
                                      };
                                      const apiData1 = await post(
                                        "bulk_links/auditLogBulk",
                                        postData1
                                      ); // Specify the endpoint you want to call
                                      //console.log('apixxsData');
                                      //console.log(apiData1);
                                    }
                                  }
                                }}
                                color="primary"
                                block
                                disabled={
                                  isSubmitting ||
                                  acknowledgement_messageCheck === false ||
                                  !isValidEmail(emailMessage)
                                }
                              >
                                {isSubmitting ? (
                                  <Spinner color="white" size="sm" />
                                ) : null}
                                <span
                                  style={{ fontSize: "16px" }}
                                  className="align-middle ms-25"
                                >
                                  {" "}
                                  Open
                                </span>
                              </Button> */}
                              {resendOTPButton ? (
                                <h4
                                  style={{
                                    marginTop: "10px",
                                  }}
                                >
                                  Didn't receive OTP?
                                  <span
                                    style={{
                                      marginLeft: "2px",
                                      cursor: "pointer",
                                    }}
                                    onClick={async () => {
                                      setIsSubmitting(true);
                                      const postData = {
                                        email: emailMessage,
                                        bulk_link_id: file_id,
                                      };
                                      const apiData = await post(
                                        "bulk_links/checkEmailExistforSpecificResponse",
                                        postData
                                      ); // Specify the endpoint you want to call
                                      //console.log('apixxsData');

                                      //console.log(apiData);
                                      if (
                                        apiData.error === true ||
                                        apiData.error === "true"
                                      ) {
                                        toastAlert(
                                          "error",
                                          "Can't submit response with same Email"
                                        );
                                        setIsSubmitting(false);
                                      } else {
                                        const postData1 = {
                                          email: emailMessage,
                                          company_id: compId,
                                        };
                                        const apiData1 = await post(
                                          "user/account-verification",
                                          postData1
                                        ); // Specify the endpoint you want to call
                                        //console.log('apixxsData');

                                        //console.log(apiData1);
                                        if (apiData1.error) {
                                          setIsSubmitting(false);

                                          toastAlert("error", apiData1.message);
                                        } else {
                                          setIsSubmitting(false);
                                          // set localStorage
                                          localStorage.setItem(
                                            "otp",
                                            JSON.stringify(apiData1)
                                          );
                                          setVerificationOTP(true);
                                          setVerificationNeeded(false);
                                          toastAlert(
                                            "success",
                                            "Otp Resend Successfully!"
                                          );
                                          setTimeout(() => {
                                            // setSendToEsign(false)
                                            setIsSubmitting(false);
                                            // setProceedBtn(true)

                                            //  10 sec
                                          }, 1000);
                                        }
                                        // end
                                      }
                                    }}
                                  >
                                    {" "}
                                    Resend OTP
                                  </span>
                                </h4>
                              ) : null}
                            </>
                          )}
                        </div>
                      </Col>
                    )}
                  </>
                )}
              </>
            )}
          </Row>

          {/* <SignatureModalContent modalClose={
            () => {
              setAccessCodeModal(!AccessCodeModal)
            }

          } returnedSignature={placeImage} file_id={file_id} /> */}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={DocSignerStatusModal}
        // isOpen={true}

        // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        className="modal-dialog-centered modal-fullscreen"
        // onClosed={() => setCardType('')}
      >
        <ModalHeader
          className="bg-transparent"
          // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        ></ModalHeader>
        <ModalBody style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: window.innerWidth,
            height: window.innerHeight,
            margin: 0,
            marginTop: -30,
            paddingTop: -50,
            padding: 0,
          }}>
          {/* {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )} */}
          <Row>
            <Col xs={12} md={4}>
              <img
                src={compLogo}
                style={{
                  width: "200px",
                  height: "50px",
                  objectFit: "contain",
                }}
              />
            </Col>
            <Col
              xs={12}
              md={4}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                padding: "4%",
              }}
            >
              <CheckCircle size={70} style={{ color: "#4BB543" }} />
              <h1
                className="fw-bold"
                style={{
                  paddingTop: "3%",
                  textAlign: "center",
                  fontWeight: 900,
                  // color: "#115fa7",
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                SUCCESS
              </h1>
              <h3
                className="form-label fw-bold"
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  lineHeight: 1.5,
                  fontSize: "16px",
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                  letterSpacing: "0.5px",
                }}
                for="login-email"
              >
                Your response has been successfully submitted.
                {linkDownload === null ? null : (
                  <>
                    <span>You can View Document by clicking here</span>
                    <a
                      href={`${linkDownload}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span
                        style={{
                          textDecoration: "underline",
                          color: "#115fa7",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                      >
                        View Your Document
                      </span>
                    </a>
                  </>
                )}
              </h3>
              <CustomButton
                padding={true}
                size="sm"
                onClick={async () => {
                  // navigate to FrontendBaseUrl
                  window.open(FrontendBaseUrl, "_self");
                }}
                color={compPrimaryColor}
                // compPrimaryColor={compPrimaryColor}
                text={
                  <>
                    <span
                      style={{ fontSize: "16px" }}
                      className="align-middle ms-25"
                    >
                      Go To Website
                    </span>
                  </>
                }
                style={{
                  height: "40px",
                  fontSize: "16px",
                  boxShadow: "none",
                  marginLeft: "10px",
                  marginBottom: "1%",
                  marginTop: "1%",
                }}
              />
              {linkDownload === null ? null : (
                <h1
                  className="form-label fw-bold"
                  style={{
                    color: "green",
                    marginTop: "20px",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                  for="login-email"
                ></h1>
              )}
            </Col>
          </Row>

          {/* <SignatureModalContent modalClose={
            () => {
              setAccessCodeModal(!AccessCodeModal)
            }

          } returnedSignature={placeImage} file_id={file_id} /> */}
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={MarkAsCompleted}
        toggleFunc={() => {
          if (loadingComplete) {
          } else {
            setMarkAsCompleted(!MarkAsCompleted);
          }
        }}
        loader={loadingComplete}
        callBackFunc={saveData}
        text="Are you sure you would like to send now?"
      />
    </>
  );
};

export default BulkLinkDocViewN;
