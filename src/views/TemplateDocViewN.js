import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
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
import { ArrowLeft, CheckCircle, Image, Menu } from "react-feather";
import logoRemoveBg from "@src/assets/images/pages/logoRemoveBg.png";
import logoRemoveBg1 from "@src/assets/images/pages/halfLogo.png";
import accessDenied from "@src/assets/images/pages/accessDenied.png";
import linkExpired from "@src/assets/images/pages/linkExpired.png";
import toastAlert from "@components/toastAlert";
import bgImg from "@src/assets/images/pages/bg-img.png";

import successCompletedDoc from "@src/assets/images/pages/successCompletedDoc.png";
// import {getColorByIndex} from '../utility/Utils';
import "react-resizable/css/styles.css";
import SignatureModalContent from "../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import ComponentForItemType from "../utility/EditorUtils/EditorTypesPosition.js/ComponentForItemType";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// usama import
import { Rnd } from "react-rnd";
import { BASE_URL, FrontendBaseUrl, post, postFormData } from "../apis/api";
import {
  formatDateTimeZone,
  handleDownloadPDFHereTemp,
} from "../utility/Utils";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import CustomButton from "../components/ButtonCustom";
import Confetti from "react-confetti";
import ImageCropperModal from "../components/ImageCropperModal";
import getActivityLogUserTemp from "../utility/IpLocation/MaintainActivityLogTemplate";
import getActivityLogUserTempResp from "../utility/IpLocation/MaintainActivityLogTemplateResponse";
import { selectPrimaryColor } from "../redux/navbar";
import { useSelector } from "react-redux";

const TemplateDocViewN = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRefs = useRef([]);
  const path = window.location.pathname;
  const [ResponseSubmittedModal, setResponseSubmittedModal] = useState(false);
  const primary_color = useSelector(selectPrimaryColor);

  // Split the path into parts

  // The encrypted IDs are the last two parts of the path
  const file_id = window.location.pathname.split("/")[2];
  const emailData = window.location.pathname.split("/")[3];
  const signerId = window.location.pathname.split("/")[4];
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState(1250);
  // states

  const [imageUrls, setImageUrls] = useState([]);
  // const file_id = window.location.pathname.split('/')[2];
  const [type, setType] = useState("");
  const [selectedSigner, setSelectedSigner] = useState(null);
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
    console.log(page);

    // setActivePage(page);
    // const pageElement = document.getElementById(`page-${page}`);
    // if (pageElement) {
    //   pageElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    // }
    // setActivePage(pageNumber);

    // Find the corresponding full-page view element
    const fullPageElement = document.getElementById(`full-page-${page}`);

    // Scroll the full-page view to the clicked page
    if (fullPageElement) {
      fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // setIsLoadingDoc(false);
    // }, 1000);
  };
  const containerRef = useRef();

  const handleFileChange = async (e, index) => {
    const files = e.target.files[0];
    // upload image
    const postData = {
      image: files,
      user_id: DocUserId,
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
  const zoomOptions = [0.5, 0.75, 0.85, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%

  const placeImage = async (url, prevSign, typeSign) => {
    //console.log(url);
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[editedIndex].url = url;
    setTextItems(newSavedCanvasData);

    setSignatureModal(false);
    // setTextItems([...textItems, resultingData]);
  };
  function checkSignersCompletion(all_signers, current_signer) {
    // const { all_signers, current_signer } = data;
    console.log("all_signers");

    // Filter out the current signer from the list of all signers
    console.log(all_signers);
    const otherSigners = all_signers.filter(
      (signer) => signer.signer_id !== current_signer.signer_id
    );
    console.log(otherSigners);

    // Check if all remaining signers have completed_status true
    const allCompleted = otherSigners.every(
      (signer) =>
        signer.completed_status === true || signer.completed_status === "true"
    );
    console.log(allCompleted);

    // Return the result
    return allCompleted;
  }
  const saveData = async () => {
    // setsaveLoading(true);
    let response_log1;

    let allCompletedExceptCurrent;
    let doc_completed;
    // getActivityLogUserFiles
    let response_log = await getActivityLogUserTempResp({
      file_id: unhashTemplateId,
      email: unhashEmail,
      event: "SIGNED-BY-SIGNER",
      response_get: true,
      description: `${unhashEmail} completed a template ${fileName} `,
      user_shared_email: unhashEmail,
    });
    if (response_log === null) {
      console.log("MAINTAIN ERROR LOG");
    } else {
      console.log("MAINTAIN SUCCESS LOG");
      console.log(response_log);
      response_log1 = response_log;
    }
    console.log(response_log1);

    // check signer all signed or not
    allCompletedExceptCurrent = checkSignersCompletion(
      All_Signers,
      selectedSigner
    );
    console.log(allCompletedExceptCurrent);
    if (allCompletedExceptCurrent) {
      console.log("All accepted");
      doc_completed = true;

      const response_logT = await getActivityLogUserTempResp({
        file_id: unhashTemplateId,
        email: unhashEmail,
        event: "DOCUMENT-COMPLETED",
        response_get: true,
        description: `${unhashEmail} completed a template ${fileName} `,
        user_shared_email: unhashEmail,
      });
      if (response_logT === null) {
        console.log("MAINTAIN ERROR LOG");
      } else {
        console.log("MAINTAIN SUCCESS LOG");
        console.log(response_logT);
        response_log1 = response_logT;
      }
      // Proceed with your action
    } else {
      console.log("Not all signers have accepted yet");
      doc_completed = false;
      // Handle the case where not all signers have accepted
    }
    console.log("response_log1");

    console.log(response_log1);

    // // end
    //console.log(textItems);
    const specifiedTypes = [
      "my_text",
      "my_signature",
      "my_initials",
      "date",
      "checkmark",
      "highlight",
      "stamp",
    ];
    // const filteredTextItems = textItems.filter(
    //   (item) =>
    //     item.signer_id === signerLoginId ||
    //     item.signer_id_receive === signerLoginId
    // );
    const filteredTextItems = textItems.filter(
      (item) =>
        specifiedTypes.includes(item.type) ||
        parseInt(item.signer_id) === parseInt(selectedSigner.signer_id) ||
        parseInt(item.signer_id_receive) === parseInt(selectedSigner.signer_id)
    );

    // Now, filteredTextItems will contain only the items that match both conditions.
    console.log(filteredTextItems);
    // Filter items that do not match the condition
    const remainingTextItems = textItems.filter(
      (item) =>
        !specifiedTypes.includes(item.type) &&
        parseInt(item.signer_id) !== parseInt(selectedSigner.signer_id) &&
        parseInt(item.signer_id_receive) !== parseInt(selectedSigner.signer_id)
    );

    // Now you have both arrays
    console.log("Filtered Text Items:", filteredTextItems);
    console.log("Remaining Text Items:", remainingTextItems);
    let locationData = await getUserLocation();
    // // donwload
    const returningUrl = await handleDownloadPDFHereTemp({
      setDownloadPdfLoader: setsaveLoading,
      imageUrls,
      textItems: filteredTextItems,
      canvasWidth,
      UniqIdDoc: UniqIdDoc,
      uniqIdPage: UniqIdDoc,
      ActivityLogData: response_log1,
      fileName,
      file_id: unhashTemplateId,
      statusData: "receiver",
      // statusData: null,
      imageUrlsCount: null,
      user_id: DocUserId,
      doc_completed: doc_completed,
      logo_data: compLogo,
    });
    console.log(returningUrl);
    const postData = {
      template_id: unhashTemplateId,
      position_array: remainingTextItems,
      selectedSigner: selectedSigner.template_response_signer_id,

      completed_doc: returningUrl,
      file_name: fileName,
      email_response: unhashEmail,
      completed_at: locationData.date,
      timezone: locationData.timezone,
      doc_completed: doc_completed,
    };
    try {
      const apiData = await post("template/saveTemplateResponse", postData); // Specify the endpoint you want to call
      console.log("Save Data To canvas ");

      console.log(apiData);
      if (apiData.error) {
        setsaveLoading(false);
        setSaveSuccess(false);
        toastAlert("error", apiData.message);
      } else {
        setDocSignerStatusModal(true);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setsaveLoading(false);
        }, 2000);
        fetchDataPositions(file_id);
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
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);

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
  //     setEditedItem((prevState) => ({
  //       ...prevState,
  //       text: newText,
  //       width: newWidth,
  //     }));
  //   } else {
  //     setTextItems(newSavedCanvasData);
  //     setEditedItem((prevState) => ({
  //       ...prevState,
  //       text: newText,
  //     }));
  //   }
  // };
  const handleInputChanged = (event, index) => {
    const newText = event.target.value;
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = newText;

    // Calculate width based on the length of the text
    const maxWidth = 500; // Set your maximum width here
    const minWidth = 100; // Set your minimum width here
    const textWidth = newText.length * 8; // Adjust this factor based on your font size and preferences
    const newWidth = Math.max(minWidth, Math.min(maxWidth, textWidth)); // Ensure width is within the desired range

    // Update state with new text and width
    // newSavedCanvasData[index].width = newWidth;

    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      text: newText,
      // width: newWidth,
    }));
  };
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
  // end

  const [RequiredActive, setRequiredActive] = useState("");
  const handleButtonClicked = async (itemId, page_no) => {
    setPageNumber(page_no);
    // First, scroll to the specific page that contains the item
    // Find the page element
    setActivePage(page_no);

    if (page_no > loadedPages[loadedPages.length - 1]) {
      // Load pages up to the selected page if necessary
      await loadPagesUntil(page_no);
      setEndPage(page_no);
    }
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

  const [DocSignerStatusModal, setDocSignerStatusModal] = useState(false);

  const [MarkAsCompleted, setMarkAsCompleted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const CompletedDocument = async () => {
    //console.log('Mark as Completed');
    setLoadingComplete(true);
    await saveData();
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
    // window.location.reload();
    // }
  };
  const [SignersWhoHaveCompletedSigning, setSignersWhoHaveCompletedSigning] =
    useState([]);
  const [activeSignerId, setActiveSignerId] = useState("");

  // fetch positions
  const fetchDataPositions = async (fileId) => {
    // get positions from db
    const postData = {
      template_id: fileId,
    };
    const apiData = await post(
      "template/getallPositionsFromTemplateId",
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
  const [ResponseLimitCompleted, setResponseLimitCompleted] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [acknowledgmentMessage, setAcknowledgmentMessage] = useState("");
  const [loaderData, setLoaderData] = useState(true);
  const [UniqIdDoc, setUniqueDocId] = useState("");
  const fetchFileData = async (fileId) => {
    const postData = {
      template_id: fileId,
    };
    const apiData = await post("template/viewTemplate", postData); // Specify the endpoint you want to call
    console.log("Bulk link Data Fetched");

    console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      // setFileName(apiData.result.file_name || '');
      // setLink(apiData.result.url);
      setImageUrls(apiData.result.file_url);
      setUniqueDocId(apiData.result.uniq_id);
      setIsLoaded(false);
    }

    // toastAlert("success", "File exist")
    //_____________________________ uncomment this line
  };
  const [unhashTemplateId, setUnhashTemplateId] = useState("");
  const [unhashEmail, setUnhashEmail] = useState("");
  const checkFileSubmitted = async (file_id, email_id) => {
    // checkEmailExistforSpecificResponse
    const postData = {
      email: email_id,
      template_id: file_id,
    };
    const apiData = await post(
      "template/checkEmailExistforSpecificResponse",
      postData
    ); // Specify the endpoint you want to call
    console.log("dfdfdfdf");

    console.log(apiData);

    if (apiData.error) {
      setResponseSubmittedModal(true);
    } else {
      setResponseSubmittedModal(false);
    }
  };
  const [waitingForOthersusers, setWaitforOtherusers] = useState(false);
  const [DocUserId, setDocUserId] = useState("");
  const [compLogo, setCompLogo] = useState("");
  const [compPrimaryColor, setCompPrimaryColor] = useState("");

  const [TemplateIduser, setTemplateIdUse] = useState("");
  const [All_Signers, setAll_Signers] = useState([]);
  const CallFuncHashedReceivedTemplate = async (fileId, email) => {
    console.log("locvation get ");
    const postData = {
      url_hashed: fileId,
      email: email,
      signerId: signerId,
    };
    console.log(signerId);
    const apiData1 = await post("template/unHashTemplates", postData); // Specify the endpoint you want to call
    console.log("apiData1");
    console.log(apiData1);

    if (apiData1.error === true || apiData1.error === "true") {
      // window.location.href = "/error";
      if (
        apiData1.company_logo === null ||
        apiData1.company_logo === undefined
      ) {
        setCompLogo(logoRemoveBg);
      } else {
        setCompLogo(apiData1.company_logo);
      }
      if (
        apiData1.primary_color === null ||
        apiData1.company_logo === undefined
      ) {
        setCompPrimaryColor("#23b3e8");
      } else {
        setCompPrimaryColor(apiData1.primary_color);
      }
      if (apiData1.completed === true) {
        console.log("alreday completed");
        setResponseSubmittedModal(true);
        setIsLoaded(false);
      } else {
        console.log("othefr error ");
        setIsLoaded(false);
      }
    } else {
      if (
        apiData1.company_logo === null ||
        apiData1.company_logo === undefined
      ) {
        setCompLogo(logoRemoveBg);
      } else {
        setCompLogo(apiData1.company_logo);
      }
      if (
        apiData1.primary_color === null ||
        apiData1.company_logo === undefined
      ) {
        setCompPrimaryColor("#23b3e8");
      } else {
        setCompPrimaryColor(apiData1.primary_color);
      }
      let currentUserOrderId = apiData1.signer_current.order_id;
      let all_signers = apiData1.signers;
      all_signers.sort((a, b) => parseInt(a.order_id) - parseInt(b.order_id));
      // Find the first order with completed_status null
      let lowestOrderWithNullStatus = all_signers.find(
        (order) => order.completed_status === null
      );

      if (lowestOrderWithNullStatus) {
        //console.log('Lowest order id with null completed status:', lowestOrderWithNullStatus.order_id);
        if (lowestOrderWithNullStatus.order_id === currentUserOrderId) {
          //console.log('You can sign');
          setWaitforOtherusers(false);
          // setActiveSignerId(currentUser.signer_id);

          let signersWhoHaveCompletedSignedAA = all_signers.filter(
            (order) => order.completed_status === "true"
          );
          //console.log('signers Who Have Completed Signed');
          //console.log(signersWhoHaveCompletedSignedAA);
          if (!Array.isArray(signersWhoHaveCompletedSignedAA)) {
            signersWhoHaveCompletedSignedAA = [signersWhoHaveCompletedSignedAA];
          }

          const signerIds = signersWhoHaveCompletedSignedAA.map(
            (signer) => signer.signer_id
          );
          //console.log('Signer IDs:');
          //console.log(signerIds);
          setAll_Signers(apiData1.signers);
          setSignersWhoHaveCompletedSigning(signerIds);
          setUnhashEmail(apiData1.DecryptEmailId);
          setFileName(apiData1.template_response.title);
          setDocUserId(apiData1.template.user_id);
          setUniqueDocId(apiData1.template.uniq_id);
          setTemplateIdUse(apiData1.template_response.template_id);
          setUnhashTemplateId(apiData1.template_response.template_responses_id);
          setImageUrls(apiData1.template_response.completed_doc);
          setUniqueDocId(apiData1.template.uniq_id);
          setTextItems(apiData1.position_array);
          setSelectedSigner(apiData1.signer_current);
        } else {
          //console.log('Wait for other users to sign');
          setWaitforOtherusers(true);
          // setWaitOtherModal(true);
        }
      } else {
        //console.log('No order with null completed status found.');
      }

      setIsLoaded(false);

      //     if(apiData1.userDataCheckEmail.completed===true||apiData1.userDataCheckEmail.completed==="true"){
      //       setResponseSubmittedModal(true)
      //     }else{
      //       // const user_id = user_id_local.token.user_id;
      //       // const email = user_id_local.token.email;
      // console.log(file_id)
      // // console.log(file_id)

      //       let fileIdData = apiData1.template_id;
      //       let emailData = apiData1.userDataCheckEmail.email;
      //       let user_id = apiData1.userDataCheckEmail.user_id;
      //       setDocUserId(user_id)
      //       let name_response = apiData1.userDataCheckEmail.title;

      //       let response_log = await getActivityLogUserTemp({
      //         // user_id: user_id,
      //         file_id: apiData1.template_id,
      //         email:emailData,
      //         user_shared_email:emailData,
      //         event: "TEMPLATE-OPENED",
      //         description: `${emailData} opened template ${name_response}`,
      //       });
      //       console.log("response_log");
      //       console.log(response_log);

      //       // console.log(response_log);
      //       // if (response_log === true) {
      //       //   console.log('MAINTAIN LOG SUCCESS');
      //       // } else {
      //       //   console.log('MAINTAIN ERROR LOG');
      //       // }
      //       setFileName(name_response);

      //       setUnhashTemplateId(fileIdData);
      //       setUnhashEmail(emailData);

      //       // fetchData(fileIdData);
      //      await checkFileSubmitted(fileIdData, emailData);
      //      await fetchFileData(fileIdData);
      //       await fetchDataPositions(fileIdData);
      //     }
    }
  };
  const [isLoaded, setIsLoaded] = useState(true);
  const hasTextItems = (page) => {
    return textItems.some((item) => item.page_no === page);
  };
  useEffect(() => {
    if (window.innerWidth < 786) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
    //console.log(file_id);
    CallFuncHashedReceivedTemplate(file_id, emailData);
    // getUnhashedEmailFileId(emailHashed, file_id);
    // fetchData(file_id);
    // fetchFileData(file_id);
    // fetchDataPositions(file_id);
    // fetchData(file_id);
    // fetchFileData(file_id);
    // fetchDataPositions(file_id),
    // fetchSignerData(file_id),
    //  fetchRecipientsData(file_id);
  }, []);
  const disableDraggingAndResizing = [
    "signer_text",
    "signer_date",
    "signer_chooseImgDrivingL",
    "signer_chooseImgPassportPhoto",
    "signer_chooseImgStamp",
    "signer_initials",
    "signer_initials_text",
    "signer_checkmark",
    "signer_dropdown",
  ];
  const [loadedPages, setLoadedPages] = useState([1, 2, 3, 4, 5]); // Manage loaded pages
  const [loadingP, setLoadingP] = useState(false); // Loading state
  const scrollContainerRefCol2 = useRef(null); // Ref for the scrollable container inside col 2 (thumbnails)

  const [loadingP8, setLoadingP8] = useState(false); // Loading state
  const [loadedPages8, setLoadedPages8] = useState([1]); // Manage loaded pages
  const observer = useRef(null);
  const [endPage, setEndPage] = useState(5);
  const [startPage, setStartPage] = useState(0);

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
  const colRef = useRef(null);

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
    // if (scrollContainerRefCol2?.current) {
    //   console.log("SCROLL ERRORS scrollContainerRefCol2 ");

    //   // Add scroll event listener for col 2 container (thumbnails)
    //   scrollContainerRefCol2?.current.addEventListener(
    //     "scroll",
    //     handleScrollCol2
    //   );
    //   return () => {
    //     scrollContainerRefCol2?.current.removeEventListener(
    //       "scroll",
    //       handleScrollCol2
    //     );
    //   };
    // }
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
  // useEffect(() => {
  //   // const timeoutId = setTimeout(() => {
  //   //   setIsLoaded(false);
  //   // }, 3000);

  //   // Cleanup function to clear the timeout in case component unmounts before 1 second
  //   return () => clearTimeout(timeoutId);
  // }, []); // Empty dependency array to run effect only once

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    console.log("asdgf");
    const pagesArray = Array.from(
      { length: numPages },
      (_, index) => index + 1
    );

    console.log(pagesArray);
    if (numPages < 5) {
      setLoadedPages(pagesArray);
      setEndPage(numPages);
    }

    setTimeout(() => {
      const fullPageElement = document.getElementById(`full-page-1`);

      // Scroll the full-page view to the clicked page
      if (fullPageElement) {
        fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
    console.log("Doc loaded");
  };

  const handleDownloadPDF = async () => {
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
    // file log doenload
    const location = await getUserLocation();
    const postData = {
      template_id: unhashTemplateId,
      file_name: fileName,
      user_shared_email: unhashEmail,
      location_country: location.country,
      ip_address: location.ip,
      location_date: location.date,
      timezone: location?.timezone,
    };

    const apiData1 = await post(
      "template/downloaded_template_shared",
      postData
    ); // Specify the endpoint you want to call
    //console.log(apiData1);
    if (apiData1.error === true || apiData1.error === "true") {
      toastAlert("error", "ERROR MAINTAINIG LOG");
    } else {
      toastAlert("success", "Document Downloaded!");
    }
  };
  const [FinishButtonEnable, setFinishButtonEnable] = useState(true);

  const [editedIndex, setEditedIndex] = useState("");

  const handleDoubleClick = (index, item) => {
    setResizingIndex(index);
    setEditedItem(item);
    setIsResizing(true);
    //console.log('double click ');
  };
  const [initialBox, setInitialBox] = useState(false);

  const handleSignatureAdd = (index, item) => {
    setEditedIndex(index);
    if (item.type === "signer_initials_text") {
      setInitialBox(true);
      setSignatureModal(true);
    } else {
      setInitialBox(false);
      setSignatureModal(true);
    }
  };
  const [croppedIndex, setCroppedIndex] = useState("");
  const [cropSrc, setCropSrc] = useState(null);
  const toggleModal = () => setModalOpen1(!modalOpen1);
  const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
  const toggleModalUpdate = () => setModalOpenUpdate(!modalOpenUpdate);
  const handleImageChangeDummyEdit = (e, index) => {
    const file = e.target.files[0];
    setCroppedIndex(index);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result);
        setModalOpenUpdate(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageCroppedUpdate = async (croppedFile) => {
    console.log("Cropped File:", croppedFile);
    const postData = {
      image: croppedFile,
      user_id: DocUserId,
    };
    const apiData = await postFormData(postData); // Specify the endpoint you want to call
    if (
      apiData.public_url === null ||
      apiData.public_url === undefined ||
      apiData.public_url === ""
    ) {
    } else {
      // const url = apiData.public_url;

      console.log("pageno djh");

      console.log(pageNumber);
      const url = apiData.public_url;
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[croppedIndex].url = url;
      setTextItems(newSavedCanvasData);
      // let resultingData =await handlePlacePosition(eventDataOnClick, type, activePage, url,"null","null","null","null","null",pageNumber);
      // console.log(resultingData);

      // setTextItems([...textItems, resultingData]);

      // setType('');
    }
    // Handle the cropped image file (e.g., upload to server or display in UI)
  };
  const [editedItem, setEditedItem] = useState();
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
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };
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
                                      disableDragging={disableDraggingAndResizing.includes(
                                        field.type
                                      )}
                                      enableResizing={
                                        field.type === "checkmark"
                                          ? false
                                          : true ||
                                            !disableDraggingAndResizing.includes(
                                              field.type
                                            )
                                          ? {
                                              top: true,
                                              right: true,
                                              bottom: true,
                                              left: true,
                                              topRight: true,
                                              bottomRight: true,
                                              bottomLeft: true,
                                              topLeft: true,
                                            }
                                          : false
                                      }
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
            ResponseSubmittedModal === false &&
            isLoaded === false &&
            modalOpenUpdate === false &&
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
                    // disabled={saveLoading}
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
                      parseInt(item.signer_id) ===
                        parseInt(selectedSigner.signer_id) &&
                      item.required === true &&
                      (item.text === null ||
                        item.text === " " ||
                        item.text === "" ||
                        item.url === null)
                  ) ? (
                    <Button
                      // disabled={saveLoading}
                      color="warning"
                      disabled={waitingForOthersusers || ResponseSubmittedModal}
                      size="sm"
                      onClick={async () => {
                        //console.log('text');
                        //console.log(textItems);

                        const emptyRows = textItems.filter(
                          (item) =>
                            parseInt(item.signer_id) ===
                              parseInt(selectedSigner.signer_id) &&
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
                        Next
                      </span>
                    </Button>
                  ) : (
                    // <Button
                    //   color="warning"
                    //   onClick={async () => {
                    //     //console.log('text');
                    //     //console.log(textItems);

                    //     const emptyRows = textItems.filter(
                    //       item =>
                    //         item.signer_id === 'selectedSigner.signer_id' &&
                    //         item.required === true &&
                    //         (item.text === null || item.text === ' ' || item.text === '' || item.url === null),
                    //     );

                    //     // Check if there are any empty rows
                    //     if (emptyRows.length > 0) {
                    //       // Perform action with the empty rows if needed
                    //       //console.log(emptyRows);
                    //       handleButtonClicked(emptyRows[0].id, emptyRows[0].page_no);
                    //       toastAlert('error', 'Fill All Required Fileds to continue!');
                    //     } else {
                    //       // Log a message if no empty rows are found
                    //       //console.log('No empty row found');
                    //       // saveData();
                    //       setFinishButtonEnable(false);
                    //     }
                    //   }}
                    //   style={{
                    //     marginLeft: '10px',
                    //     marginRight: '10px',
                    //     display: 'flex',
                    //     boxShadow: 'none',
                    //     justifyContent: 'center',
                    //     alignItems: 'center',
                    //   }}
                    //   className="btn-icon d-flex">
                    //   <span style={{fontSize: '16px'}} className="align-middle ms-25">
                    //     Next
                    //   </span>
                    // </Button>

                    <Button
                      disabled={
                        textItems.some(
                          (item) =>
                            parseInt(item.signer_id) ===
                              parseInt(selectedSigner.signer_id) &&
                            item.required === true &&
                            (item.text === null ||
                              item.text === " " ||
                              item.text === "" ||
                              item.url === null)
                        )
                          ? true
                          : false
                      }
                      // disabled={saveLoading}
                      color="success"
                      size="sm"
                      onClick={async () => {
                        // saveData();
                        if (waitingForOthersusers || ResponseSubmittedModal) {
                          return;
                        } else {
                          setMarkAsCompleted(true);
                        }
                      }}
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
                  {/* {window.innerWidth < 380 ? (
                  <Menu
                    size={20}
                    style={{ marginRight: "20px" }}
                    onClick={() => {
                      setIsOpenCanvas(true);
                    }}
                  />
                ) : null} */}
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
                </Button> */}
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
                  <h2
                    className="fw-bold"
                    style={{ marginLeft: "10px", marginTop: "5px" }}
                  >
                    {fileName}
                  </h2>
                </div>
                {/* <div>{saveLoading ? <h4>Saving ...</h4> : null}</div> */}
                <div style={{ marginLeft: "10px" }}>
                  <select
                    style={{
                      border: "none",
                      fontSize: "16px",
                      cursor: "pointer",
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
                  <CustomButton
                    padding={true}
                    useDefaultColor={false}
                    size="sm"
                    disabled={waitingForOthersusers || ResponseSubmittedModal}
                    color="orange"
                    // disabled={downloadLoader}
                    onClick={handleDownloadPDF}
                    style={{
                      display: "flex",
                      boxShadow: "none",
                      justifyContent: "center",
                      marginRight: "5px",
                      alignItems: "center",
                    }}
                    className="btn-icon d-flex"
                    text={
                      <>
                        {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                        <span className="align-middle ms-25">
                          Download Original
                        </span>
                      </>
                    }
                  />
                  {/* <Button
                  // disabled={saveLoading}
                  color="primary"
                  onClick={handleDownloadPDF}
                  style={{
                    display: 'flex',
                    boxShadow: 'none',
                    justifyContent: 'center',
                    marginRight: '10px',
                    alignItems: 'center',
                  }}
                  className="btn-icon d-flex">
                  <span style={{fontSize: '16px', letterSpacing: '.5px'}} className="align-middle ms-25">
                    Download Original
                  </span>
                </Button> */}
                  {textItems.some(
                    (item) =>
                      parseInt(item.signer_id) ===
                        parseInt(selectedSigner.signer_id) &&
                      item.required === true &&
                      (item.text === null ||
                        item.text === " " ||
                        item.text === "" ||
                        item.url === null)
                  ) ? (
                    <CustomButton
                      padding={true}
                      useDefaultColor={false}
                      size="sm"
                      disabled={waitingForOthersusers || ResponseSubmittedModal}
                      color="orange"
                      // disabled={downloadLoader}
                      onClick={async () => {
                        //console.log('text');
                        //console.log(textItems);

                        const emptyRows = textItems.filter(
                          (item) =>
                            parseInt(item.signer_id) ===
                              parseInt(selectedSigner.signer_id) &&
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
                        display: "flex",
                        boxShadow: "none",
                        justifyContent: "center",
                        marginRight: "10px",
                        alignItems: "center",
                      }}
                      className="btn-icon d-flex"
                      text={
                        <>
                          {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                          <span className="align-middle ms-25">Next</span>
                        </>
                      }
                    />
                  ) : (
                    <CustomButton
                      padding={true}
                      disabled={
                        textItems.some(
                          (item) =>
                            parseInt(item.signer_id) ===
                              parseInt(selectedSigner.signer_id) &&
                            item.required === true &&
                            (item.text === null ||
                              item.text === " " ||
                              item.text === "" ||
                              item.url === null)
                        )
                          ? true
                          : false
                      }
                      useDefaultColor={false}
                      size="sm"
                      // disabled={saveLoading}
                      color={compPrimaryColor}
                      // compPrimaryColor={compPrimaryColor}
                      // disabled={downloadLoader}
                      onClick={async () => {
                        // saveData();
                        if (waitingForOthersusers || ResponseSubmittedModal) {
                          return;
                        } else {
                          setMarkAsCompleted(true);
                        }
                      }}
                      style={{
                        display: "flex",
                        boxShadow: "none",
                        justifyContent: "center",
                        marginRight: "5px",
                        alignItems: "center",
                      }}
                      className="btn-icon d-flex"
                      text={
                        <>
                          {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                          <span className="align-middle ms-25">
                            Finish & Submit
                          </span>
                        </>
                      }
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row
            // id={`full-page-${pageNumber}`}
            >
              {/* <Col
              xs={12}
              style={{
                backgroundColor: 'white',
                border: '1px solid lightGrey',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBlock: '0.3%',
                paddingInline: '2%',
              }}>
              <div style={{marginLeft: '10px'}}>
                <select
                  style={{border: 'none', fontSize: '16px', cursor: 'pointer'}}
                  value={scale}
                  onChange={handleZoomChange}>
                 
                {zoomOptions.map(option => (
                    <option key={option} value={option}>
                      {option * 100}%
                    </option>
                  ))}
                </select>
              </div>
            </Col> */}
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
                  backgroundColor: "rgb(234 234 234)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor:
                    type === "my_text" || type === "signer_text"
                      ? "none"
                      : type
                      ? "none"
                      : "default",
                  // border: '1px solid lightGrey',
                  // maxHeight: '50dvh',
                  // border: '3px solid black',
                  // height: '93dvh',
                  // height:"90vh",
                  paddingTop: "10px",
                  overflow: "auto",
                  paddingBottom: "20px",
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
                    // position: 'relative',
                    // transform: `scale(${zoomPercentage / 100})`,
                    // transformOrigin: 'top left',
                  }}
                >
                  <Document
                    file={`${imageUrls}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    noData="No PDF loaded"
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
                            style={{ marginBottom: "20px" }}
                            id={`full-page-${page}`}
                            key={page}
                          >
                            {/* <div
                          id={`page-${page}`}
                          key={`page-${page}`}
                          style={{position: 'absolute', top: 10, left: 10, zIndex: 2}}>
                          <h6 style={{color: 'black', fontSize: '16px'}}>Document ID: {Uniq_id_doc}</h6>
                        </div> */}
                            <Page
                              renderAnnotationLayer={false}
                              scale={scale}
                              onLoadSuccess={({ width }) => {
                                setCanvasWidth(width);
                              }}
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
                              renderTextLayer={false}
                              key={page}
                              pageNumber={page}
                              ref={(ref) =>
                                (canvasRefs.current[page - 1] = ref)
                              }

                              // width={canvasWidth}
                              // className={activePage === page ? 'active-page' : ''}
                              // onClick={() => handlePageClick(page)}
                            >
                              {/* <canvas
                            // id="col-9"
                            id={`full-page-${page}`}
                            onMouseMove={() => setPageNumber(page)}
                            ref={ref => (canvasRefs.current[page - 1] = ref)}
                            // onClick={handleCanvasClick}
                            style={{
                              border: '1px solid lightgrey',
                              width: canvasWidth,
                              height: '100%',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              zIndex: 1,
                            }}
                          /> */}
                              {textItems.map((field, index) => (
                                <>
                                  <Rnd
                                    // id={`full-page-${page}`}
                                    id={`item-${field.id}-${page}`}
                                    key={field.id}
                                    // id={`rnd-com-${field.id}`}
                                    dragHandleClassName="drag-handle"
                                    // ref={scrollToRef}
                                    disableDragging={disableDraggingAndResizing.includes(
                                      field.type
                                    )}
                                    enableResizing={
                                      !disableDraggingAndResizing.includes(
                                        field.type
                                      )
                                        ? {
                                            top: true,
                                            right: true,
                                            bottom: true,
                                            left: true,
                                            topRight: true,
                                            bottomRight: true,
                                            bottomLeft: true,
                                            topLeft: true,
                                          }
                                        : false
                                    }
                                    // disableDragging={true} // disable dragging
                                    // disableResizing={{
                                    //   top: true,
                                    //   right: true,
                                    //   bottom: true,
                                    //   left: true,
                                    //   topRight: true,
                                    //   bottomRight: true,
                                    //   bottomLeft: true,
                                    //   topLeft: true,
                                    // }} // disable resizing from all sides

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
                                    position={{
                                      x: field.x * scale,
                                      y: field.y * scale,
                                    }}
                                    // position={{
                                    //   x: (field.x * zoomPercentage) / 100, // Adjusted x position based on zoom percentage
                                    //   y: (field.y * zoomPercentage) / 100, // Adjusted y position based on zoom percentage
                                    // }}
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
                                  </Rnd>
                                </>
                              ))}
                            </Page>
                            <h6
                              style={{
                                marginBlock: "10px",
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              Page {page}
                            </h6>{" "}
                          </div>{" "}
                        </>
                      ))}
                  </Document>

                  {/* </div> */}
                </div>
              </Col>
              <Col
                xs={2}
                style={{
                  position: "relative",
                  backgroundColor: "white",
                  border: ".5px solid lightGrey",
                  maxHeight: "93dvh",
                  overflow: "auto",
                }}
              >
                <div
                  ref={scrollContainerRefCol2}
                  style={{ overflowY: "auto", maxHeight: "93dvh" }}
                  // style={{
                  //   display: "flex",
                  //   flexDirection: "column",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}
                >
                  <div
                    style={{
                      display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                    }}
                  >
                    <Document
                      file={`${imageUrls}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      noData="No PDF loaded"
                    >
                      {loadedPages.map((page) => {
                        const hasItems = hasTextItems(page);
                        return (
                          <>
                            <div
                              // key={`thumbnail-${page}`}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <div
                                        id={`thumbnail-page-${page}`}

                                // id={`full-page-${page}`}
                                key={page}
                                style={{
                                  border:
                                    pageNumber === page
                                      ? `1px solid ${primary_color}`
                                      : "1px solid lightGrey",
                                  // borderRadius: '10px',
                                  overflow: "hidden",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  if (pageNumber !== page) {
                                    e.target.style.border = "1px solid #c4c4c4";
                                    // e.target.style.borderRadius = '10px';
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
                                  // key={`thumbnail-page-${page}`}
                                  // key={page}
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
                                          display: "flex",
                                        marginBlock: "10px",

                                          justifyContent: "center",
                                        }}
                                      >
                                        Page {page}
                                      </h6>
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
            user_id_user={DocUserId}
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
      {/* <ImageCropperModal
        cropSrc={cropSrc}
        isOpen={modalOpen1}
        toggle={toggleModal}
        onImageCropped={handleImageCropped}
      /> */}
      <ImageCropperModal
        cropSrc={cropSrc}
        isOpen={modalOpenUpdate}
        toggle={toggleModalUpdate}
        onImageCropped={handleImageCroppedUpdate}
      />
      <Modal
        isOpen={DocSignerStatusModal}
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
          }} >
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
              {/* <img
                src={successCompletedDoc}
                style={{
                  width: "50px",
                  height: "auto",
                }}
              />
              <h1
                className="form-label fw-bold"
                style={{
                  color: "green",
                  marginTop: "20px",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
                for="login-email"
              >
                Your response has been sent successfully.
              </h1> */}
              <CheckCircle size={70} style={{ color: "#4BB543" }} />
              <h1
                className="fw-bold"
                style={{
                  paddingTop: "3%",
                  textAlign: "center",
                  fontWeight: 900,
                  color: "white",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                  color: "#115fa7",
                }}
              >
                SUCCESS
              </h1>
              <h3
                className="form-label fw-bold"
                style={{
                  letterSpacing: "0.5px",
                  textAlign: "center",
                  lineHeight: 1.5,
                  fontSize: "16px",
                  color: "white",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                }}
                for="login-email"
              >
                Your document has been successfully sent.
              </h3>
              <CustomButton
                padding={true}
                size="sm"
                onClick={async () => {
                  // navigate to FrontendBaseUrl
                  window.open(FrontendBaseUrl);
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
            </Col>
          </Row>

          {/* <SignatureModalContent modalClose={
            () => {
              setAccessCodeModal(!AccessCodeModal)
            }

          } returnedSignature={placeImage} file_id={file_id} /> */}
        </ModalBody>
      </Modal>
      <Modal
        isOpen={ResponseSubmittedModal}
        // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        className="modal-dialog-centered modal-fullscreen"
        // onClosed={() => setCardType('')}
      >
        <ModalHeader
          className="bg-transparent"
          // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
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
                  color: "#115fa7",
                }}
              >
                SUCCESS
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
                You have completed the Document earlier.
              </h3>
              <CustomButton
                padding={true}
                size="sm"
                onClick={async () => {
                  // navigate to FrontendBaseUrl
                  window.open(FrontendBaseUrl);
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
              {/* <img
                src={successCompletedDoc}
                style={{
                  width: "50px",
                  height: "auto",
                }}
              />
              <h1
                className="form-label fw-bold"
                style={{
                  color: "green",
                  marginTop: "20px",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
                for="login-email"
              >
                Response already submitted.
              </h1> */}
            </Col>
          </Row>

          {/* <SignatureModalContent modalClose={
            () => {
              setAccessCodeModal(!AccessCodeModal)
            }

          } returnedSignature={placeImage} file_id={file_id} /> */}
        </ModalBody>
      </Modal>
      <Modal
        isOpen={waitingForOthersusers}
        // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        className="modal-dialog-centered modal-md"
        // onClosed={() => setCardType('')}
      >
        <ModalHeader
          className="bg-transparent"
          // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-3">
          <Row>
            {/* <Col xs={12} md={4}>
              <img
                src={compLogo}
                style={{
                  width: "200px",
                  height: "50px",
                  objectFit:"contain",
                }}
              />
            </Col> */}

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
                src={accessDenied}
                style={{
                  width: "150px",
                  height: "auto",
                }}
              />
              <h1
                className="fw-bold"
                style={{
                  paddingTop: "4%",
                  textAlign: "center",
                  fontWeight: 900,
                  color: "#115fa7",
                }}
              >
                Signatures Pending
              </h1>
              <h1
                className="form-label fw-bold"
                style={{
                  color: "red",
                  marginTop: "10px",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
                for="login-email"
              >
                This document requires other signatures first. You'll be
                notified when it's your turn.
              </h1>
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
        callBackFunc={CompletedDocument}
        text="Are you sure you want to submit this response?"
      />
    </>
  );
};

export default TemplateDocViewN;
