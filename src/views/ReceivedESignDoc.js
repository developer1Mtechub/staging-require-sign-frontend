import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  ModalBody,
  Row,
  Spinner,
  FormFeedback,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  ListGroup,
  TabPane,
  TabContent,
} from "reactstrap";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Circle,
  Edit2,
  Image,
  Lock,
  Menu,
  MoreVertical,
  Plus,
  Trash2,
  Unlock,
  X,
} from "react-feather";
import logoRemoveBg from "@src/assets/images/pages/logoRemoveBg.png";
import bgImg from "@src/assets/images/pages/bg-img.png";

import lock_icon from "@src/assets/images/pages/lock_icon.png";
import logoRemoveBg1 from "@src/assets/images/pages/halfLogo.png";
import accessDenied from "@src/assets/images/pages/accessDenied.png";
import toastAlert from "@components/toastAlert";
import Repeater from "@components/repeater";
import successCompletedDoc from "@src/assets/images/pages/successCompletedDoc.png";
import { SlideDown } from "react-slidedown";
// import {getColorByIndex} from '../utility/Utils';
import "react-resizable/css/styles.css";
import SignatureModalContent from "../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import ComponentForItemType from "../utility/EditorUtils/EditorTypesPosition.js/ComponentForItemType";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// usama import
import { Rnd } from "react-rnd";
import {
  BASE_URL,
  FrontendBaseUrl,
  jpg_image1,
  post,
  postFormData,
  postFormDataPdf,
} from "../apis/api";
import ForYou from "../components/ForYou";
import SidebarTypes from "./SidebarTypes";
import { handlePlacePosition } from "../utility/EditorUtils/PlacePositions";
import ResizeCircle from "../utility/EditorUtils/EditorTypesPosition.js/ResizeCircle";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import Confetti from "react-confetti";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import {
  formatDateCustom,
  formatDateCustomTime,
  formatDateInternational,
  formatDateTimeZone,
  formatDateUSA,
  handleDownloadPDFHere,
} from "../utility/Utils";
import ComponentRightSidebarSS from "../utility/EditorUtils/EditorTypesPosition.js/ComponentRightSidebarSS";
import ImageCropperModalFreeForm from "../components/ImageCropperModal";
import ImageCropperModal from "../components/ImageCropperModal";
import CustomButton from "../components/ButtonCustom";
import getActivityLogUserFiles from "../utility/IpLocation/MaintainActivityLogFile";
import ComponentRightSidebar from "../utility/EditorUtils/EditorTypesPosition.js/ComponentRightSidebar";
import { getUser, selectPrimaryColor } from "../redux/navbar";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ReceivedESignDoc = () => {
  const { emailHashed, file_id, senderId, token } = useParams();
  const [deleteIndex, setDeleteIndex] = useState("");
  const zoomOptions = [0.5, 0.75, 0.85, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%
  const primary_color = useSelector(selectPrimaryColor);
  const [RequiredActive, setRequiredActive] = useState("");
  // Helper function to scroll to an element and return a Promise when it's done
  // Helper function for smooth scrolling
  const colRef = useRef(null);
  const [endPage, setEndPage] = useState(5);
  const [startPage, setStartPage] = useState(0);

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

  const handleButtonClicked = async (itemId, page_no) => {
    console.log(itemId);
    setPageNumber(page_no);
    setActivePage(page_no);

    if (page_no > loadedPages[loadedPages.length - 1]) {
      // Load pages up to the selected page if necessary
      await loadPagesUntil(page_no);
      setEndPage(page_no);
    }
    // First, scroll to the specific page that contains the item
    // Find the page element
    setRequiredActive(itemId); // Activate the required item

    // Step 1: Scroll to the page container first
    // const pageElement = document.getElementById(`full-page-${page_no}`);
    // if (pageElement) {
    //   await smoothScrollToElement(pageElement, {
    //     behavior: "smooth",
    //     block: "start",
    //   });

    // Step 2: After scrolling to the page, scroll to the specific item
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
    }, 1000); // Adjust delay as needed
    // } else {
    //   console.error(`Page with number ${page_no} not found`);
    // }
  };

  // Update scroll target when activeItemId or activePageNo changes

  const path = window.location.pathname;

  const parts = path.split("/");

  // The encrypted IDs are the last two parts of the path
  // const emailHashed = parts[parts.length - 2];
  // const file_id = parts[parts.length - 1];
  // const sender_user_id = parts[parts.length - 3];
  // const sender_token=parts[parts.length - 4];

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState("100%");
  // states

  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrlsCount, setImageUrlsCount] = useState([]);

  const [imageUrls2, setImageUrls2] = useState([]);

  // const file_id = window.location.pathname.split('/')[2];
  const [savedCanvasData, setSavedCanvasData] = useState([]);
  const [type, setType] = useState("");
  const [selectedSigner, setSelectedSigner] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);
  const [sendToEsign, setSendToEsign] = useState(false);
  const [signerAddEdit, setSignerAddEdit] = useState(false);
  const [count, setCount] = useState(1);
  const [signerFunctionalControls, setSignerFunctionalControls] =
    useState(false);
  const [securedShare, setSecuredShare] = useState(false);
  const [EsignOrder, setSetEsignOrder] = useState(false);
  const [RecipientsData, setRecipientsData] = useState([]);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [inputValue, setInputValue] = useState(null);
  const [signersData, setSignersData] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValueAccessCode, setInputValueAccessCode] = useState("");
  const [inputErrors, setInputErrors] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSignersSave, setLoadingSignersSave] = useState(false);
  const [countReceipient, setCountReceipient] = useState(0);
  const [loadingSendDocument, setLoadingSendDocument] = useState(false);
  const [fileName, setFileName] = useState("");
  const [statusFile, setStatusFile] = useState("");
  const [SignatureModal, setSignatureModal] = useState(false);
  const [SignatureModalUpdate, setSignatureModalUpdate] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [onlySigner, setOnlySigner] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [resizingIndex, setResizingIndex] = useState(null);
  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  // const [zoomPercentage, setZoomPercentage] = useState(window.innerWidth < 786 ? 70 : 100);
  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);
  const [hoveredStateDummyIndex, setHoveredStateDummyIndex] = useState("");

  const [zoomPercentage, setZoomPercentage] = useState(100);
  const handleZoomChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setScale(newScale);
    console.log(newScale);
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
  const [loadingDelete, setloadingDelete] = useState(false);

  const DeleteItemFromCanvas = () => {
    setloadingDelete(true);

    const updatedItems = textItems.filter((item) => item.id !== deleteIndex);
    //console.log('updatedItems');

    //console.log(updatedItems);
    setTextItems(updatedItems); // Update the savedCanvasData state
    //console.log(updatedItems);
    setItemDeleteConfirmation(false);
    setloadingDelete(false);
  };
  const handlePageClick = (page) => {
    // setPageNumber(page);

    // const fullPageElement = document.getElementById(`full-page-${page}`);

    // // Scroll the full-page view to the clicked page
    // if (fullPageElement) {
    //   fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    // }
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

  // fetch positions
  const fetchDataPositions = async (fileId) => {
    // get positions from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post("file/getallPositionsFromFile_Id", postData); // Specify the endpoint you want to call
    //console.log('Position Data');

    //console.log(apiData);
    if (apiData.error) {
      setTextItems([]);
    } else {
      //console.log('positions');
      //console.log(apiData.result);

      setTextItems(apiData.result[0].position_array);
    }
  };
  const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
  const toggleModalUpdate = () => setModalOpenUpdate(!modalOpenUpdate);
  const handleImageCroppedUpdate = async (croppedFile) => {
    console.log("Cropped File:", croppedFile);
    const postData = {
      image: croppedFile,
      user_id: FileUserid,
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
  const [croppedIndex, setCroppedIndex] = useState("");
  const [cropSrc, setCropSrc] = useState(null);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const toggleModal = () => setModalOpen1(!modalOpen1);
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
  const handleFileChange = async (e, index) => {
    const files = e.target.files[0];
    // upload image
    const postData = {
      image: files,
      user_id: FileUserid,
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

  const handleUpdateField = (id, type, x, y, page) => {
    setTextItems(
      textItems.map((field, index) => {
        if (field.id === id) {
          return { ...field, x, y, page_no: pageNumber };
        }
        return field;
      })
    );
  };
  const handleUpdateImageChange = async (e, index) => {
    const files = e.target.files[0];
    // upload image
    const postData = {
      image: files,
      user_id: FileUserid,
    };
    const apiData = await postFormData(postData); // Specify the endpoint you want to call
    if (
      apiData.public_url === null ||
      apiData.public_url === undefined ||
      apiData.public_url === ""
    ) {
      // toastAlert("error", "Error uploading Files")
    } else {
      let url = apiData.public_url;
      // setType('stamp');
      setResizingIndex(index);
      setIsResizing(true);
      setEditedItem(textItems[index]);
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[index].url = url;
      setTextItems(newSavedCanvasData);
      // setType('');
    }
  };
  const handleUpdateFieldResize = (id, type, width, height, x, y) => {
    // Issue
    setTextItems(
      textItems.map((field, index) => {
        if (field.id === id) {
          if (type === "my_text" || type === "date" || type === "signer_date") {
            return { ...field, width };
          } else if (
            type === "checkmark" ||
            type === "radio" ||
            type === "signer_checkmark" ||
            type === "signer_radio"
          ) {
          } else {
            return { ...field, width, height, x, y };
          }
        }
        return field;
      })
    );
    //console.log(textItems);
  };
  // const handleUpdateFieldResize = (id, type, width, height, x, y) => {
  //   setTextItems(
  //     textItems.map((field, index) => {
  //       if (field.id === id) {
  //         if (type === "my_text" || type === "date" || type === "signer_date") {
  //           return { ...field, width };
  //         } else if (
  //           type === "checkmark" ||
  //           type === "radio" ||
  //           type === "signer_checkmark" ||
  //           type === "signer_radio"
  //         ) {
  //         } else {
  //           return { ...field, width, height, x, y };
  //         }
  //       }
  //       return field;
  //     })
  //   );
  //   //console.log(textItems);
  // };
  const [initialBox, setInitialBox] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(false);

  const [eventDataOnClick, setEventDataOnClick] = useState([]);
  const [indexDataOnClick, setIndexDataOnClick] = useState(null);
  const [FinishButtonEnable, setFinishButtonEnable] = useState(true);
  const [appendEnable, setAppendEnable] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const handleImageChangeDummy = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result);
        setModalOpen1(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCanvasClick = (e, page_no) => {
    let clickedPageNumber = page_no;
    setPageNumber(page_no);
    if (appendEnable == true) {
      const canvasRect = canvasRefs.current[page_no - 1];
      const canvas = canvasRect.current;
      const rect = canvasRect.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      // const x = e.clientX - rect.left;
      // const y = e.clientY - rect.top;
      // const zoomLevel = parseFloat(document.body.style.zoom) / 100 || 1;
      // handleAddField(x, y);
      // ,y cose
      let arrayObj = {
        x,
        y,
      };
      if (type === "") {
      } else if (type === "my_signature") {
        setEventDataOnClick(arrayObj);
        setIndexDataOnClick(textItems.length);
        setInitialBox(false);
        setSignatureModal(true);
      } else if (type === "my_initials") {
        setEventDataOnClick(arrayObj);
        setIndexDataOnClick(textItems.length);
        setInitialBox(true);
        setSignatureModal(true);
      } else if (type === "stamp") {
        setEventDataOnClick(arrayObj);
        setIndexDataOnClick(textItems.length);
        const input = document.createElement("input");
        input.type = "file";
        // input.accept = 'image/png';
        // input.onchange = e => handleImageChange(e, arrayObj, type);
        input.accept = "image/*";
        input.onchange = (e) =>
          handleImageChangeDummy(e, arrayObj, type, page_no);

        input.click();
      } else {
        if (active === "2") {
          if (
            selectedSigner === null ||
            selectedSigner === undefined ||
            selectedSigner === "" ||
            selectedSigner.length === 0
          ) {
            toastAlert("error", "Please Select Signer");
          } else {
            console.log("selectedSigner");
            console.log(selectedSigner);

            let resultingData = handlePlacePosition(
              arrayObj,
              type,
              pageNumber,
              selectedSigner.color,
              "null",
              selectedSigner.signer_id,
              stateMemory,
              "null",
              "null",
              clickedPageNumber,
              scale
            );
            consoel.log(resultingData);

            //console.log(resultingData);
            setTextItems([...textItems, resultingData]);
            setEditedItem(resultingData);
            setResizingIndex(textItems.length);
            setIsResizing(true);
            // setEditStateTextTopbar(false)
            setType("");
          }
        } else {
          let resultingData = handlePlacePosition(
            arrayObj,
            type,
            activePage,
            "null",
            "null",
            "null",
            stateMemory,
            signerControlsOption,
            activeSignerId,
            clickedPageNumber,
            scale
          );
          //console.log(resultingData);
          // setSavedCanvasData([...savedCanvasData, resultingData])
          setResizingIndex(textItems.length);
          setIsResizing(true);
          setEditedItem(resultingData);
          setTextItems([...textItems, resultingData]);

          // setType('');
        }
      }
    }
  };
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const elementRefCursor = useRef(null);
  const defaultFontSize = window.innerWidth < 730 ? 30 : 12;
  const defaultFontFamily = "Helvetica";
  const defaultFontWeight = 400;
  const defaultFontStyle = "normal";

  const defaultTextDecoration = "none";

  const [stateMemory, setStateMemory] = useState({
    fontSize: defaultFontSize,
    fontFamily: defaultFontFamily,
    fontWeight: defaultFontWeight,
    fontStyle: defaultFontStyle,
    textDecoration: defaultTextDecoration,
  });
  const getTypeListItem = (type) => {
    setAppendEnable(true);
    // saveData();
    //console.log('Type');
    //console.log(type);
    if (type === "signer") {
      setSignerAddEdit(true);
    } else {
      setType(type);
      // setIsEditing(true);
      // setEditingIndex(savedCanvasData.length);
      //console.log(savedCanvasData.length);
    }
  };
  const placeImage = async (url, prevSign, typeSign) => {
    console.log(url);
    console.log(signerControlsOption);
    console.log(typeSign);
    console.log(type);

    console.log(editedIndex);

    if (signerControlsOption) {
      //console.log(type);
      // if (type === 'signer_initials' || type === 'signer_initials_text') {
      //console.log(url);
      if (type === "my_signature" || type === "my_initials") {
        if (prevSign === "prevSign") {
          // console.log('url');
          // console.log(url);
          //console.log(pageNumber)
          let resultingData = handlePlacePosition(
            eventDataOnClick,
            type,
            activePage,
            url,
            "image",
            "null",
            "null",
            "null",
            "null",
            pageNumber
          );
          //console.log(resultingData);
          setResizingIndex(textItems.length);
          setIsResizing(true);
          setEditedItem(resultingData);
          setDeleteIndex(resultingData.id);

          setTextItems([...textItems, resultingData]);
          setSignatureModal(false);
          // setType('');
        } else {
          if (typeSign === "initials") {
            //console.log('url');
            //console.log(url);
            //console.log('lines');
            setIsEditingSignature(true);
            //console.log(pageNumber)

            //console.log(activePage);
            let resultingData = handlePlacePosition(
              eventDataOnClick,
              type,
              activePage,
              url,
              typeSign,
              "null",
              "null",
              "null",
              "null",
              pageNumber
            );
            //console.log(resultingData);
            setResizingIndex(textItems.length);
            setIsResizing(true);
            setEditedItem(resultingData);
            setDeleteIndex(resultingData.id);
            // setSavedCanvasData([...savedCanvasData, resultingData])
            setTextItems([...textItems, resultingData]);
            setSignatureModal(false);
            //  setType('');
          } else {
            setIsEditingSignature(true);
            //console.log(activePage);
            let resultingData = handlePlacePosition(
              eventDataOnClick,
              type,
              activePage,
              url,
              typeSign,
              "null",
              "null",
              "null",
              "null",
              pageNumber
            );
            //console.log(resultingData);
            setResizingIndex(textItems.length);
            setIsResizing(true);
            setEditedItem(resultingData);
            setDeleteIndex(resultingData.id);
            // setSavedCanvasData([...savedCanvasData, resultingData])
            setTextItems([...textItems, resultingData]);
            setSignatureModal(false);
            // setType('');
            // }
          }

          // end Call
        }
      } else {
        const newSavedCanvasData = [...textItems];
        newSavedCanvasData[editedIndex].url = url;
        setTextItems(newSavedCanvasData);
        console.log(prevSign);

        setSignatureModal(false);
        setType("");
      }
    } else {
      //console.log(url);
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[editedIndex].url = url;
      setTextItems(newSavedCanvasData);

      setSignatureModal(false);
      setType("");

      // setTextItems([...textItems, resultingData]);
    }
  };
  const [UpdatedSignatureIndex, setUpdatedSignatureIndex] = useState("");
  const placeImageUpdate = async (url, prevSign, typeSign) => {
    //console.log(url);
    //console.log(prevSign);
    //console.log(typeSign);

    if (prevSign === "prevSign") {
      setSignatureModalUpdate(false);
      //console.log('url');
      //console.log(url);
      setResizingIndex(UpdatedSignatureIndex);
      setIsResizing(true);
      setEditedItem(textItems[UpdatedSignatureIndex]);
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[UpdatedSignatureIndex].url = url;
      setTextItems(newSavedCanvasData);
      setType("");
    } else {
      setSignatureModalUpdate(false);
      //console.log('url');
      //console.log(url);
      //console.log('lines');
      setResizingIndex(UpdatedSignatureIndex);
      setIsResizing(true);
      setEditedItem(textItems[UpdatedSignatureIndex]);
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[UpdatedSignatureIndex].url = url;
      setTextItems(newSavedCanvasData);
      setType("");
      // }
    }
  };

  const saveData = async () => {
    setsaveLoading(true);
    //console.log(savedCanvasData);
    const postData = {
      file_id: file_id,
      // position_array: savedCanvasData
      position_array: textItems,
    };
    try {
      const apiData = await post(
        "file/saveCanvasDataWithFile_IdSave",
        postData
      ); // Specify the endpoint you want to call
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
        fetchDataPositions(file_id);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      // setsaveLoading(false)
    }
  };
  const saveDataSigning = async (filteredTextItems) => {
    setsaveLoading(true);
    //console.log(savedCanvasData);
    const postData = {
      file_id: file_id,
      // position_array: savedCanvasData
      position_array: filteredTextItems,
    };
    try {
      const apiData = await post(
        "file/saveCanvasDataWithFile_IdSave",
        postData
      ); // Specify the endpoint you want to call
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
        fetchDataPositions(file_id);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      // setsaveLoading(false)
    }
  };
  const handleChnageWidthInput = (width, index) => {
    const newSavedCanvasData = [...textItems];
    // console.log("widthsfsdf");

    // console.log(width);
    newSavedCanvasData[index].width = parseFloat(width) / scale;
    setTextItems(newSavedCanvasData);
    // setEditedItem((prevState) => ({
    //   ...prevState,
    //   // text: newText,
    //   width: width,
    // }));
  };
  const handleInputChanged = (event, index) => {
    const newText = event.target.value;
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = newText;
    if (
      !disableDraggingAndResizing.includes(newSavedCanvasData[index].type) &&
      isSmallScreen
    ) {
      const maxWidth = 500; // Set your maximum width here
      const minWidth = 100; // Set your minimum width here
      const textWidth = newText.length * 10; // Adjust this factor based on your font size and preferences
      const newWidth = Math.max(minWidth, Math.min(maxWidth, textWidth)); // Ensure width is within the desired range
      newSavedCanvasData[index].width = textWidth;
      setEditedItem((prevState) => ({
        ...prevState,
        text: newText,
        width: textWidth,
      }));
    }
    // Update state with new text and width
    // newSavedCanvasData[index].width = newWidth;

    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      text: newText,
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

  const fetchSignerData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post("file/getAllSignersByFileId", postData); // Specify the endpoint you want to call
      //console.log('Signers ');

      //console.log(apiData);
      if (apiData.error) {
        setSignersData([]);
      } else {
        setSignersData(apiData.result);
        setSelectedSigner(apiData.result[0]);
        setCount(apiData.result.length);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const handleButtonClick = () => {
    setIsInputVisible(true);
  };
  // Helper function to determine if a page has textItems
  const hasTextItems = (page) => {
    return textItems?.some((item) => item.page_no === page);
  };

  const handleCheckClickAccessCode = async (signer_id, i) => {
    setIsLoading(true);

    // call api to update access code
    const postData = {
      signer_id: signer_id,
      access_code: inputValueAccessCode,
    };
    try {
      const apiData = await post("file/update-signer", postData); // Specify the endpoint you want to call
      //console.log('Update Access code ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert("error", apiData.message);
      } else {
        // //console.log(apiData.result)
        toastAlert("succes", apiData.message);
        setIsInputVisible(false);
        // You might want to save the access code for the active row here
        signersData[i].accessCode = inputValueAccessCode;
        fetchSignerData();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseClick = async (signer_id, i) => {
    setIsInputVisible(false);
    signersData[i].accessCode = null;
    const postData = {
      signer_id: signer_id,
      access_code: null,
    };
    try {
      const apiData = await post("file/update-signer", postData); // Specify the endpoint you want to call
      //console.log('Update Access code ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert("error", apiData.message);
      } else {
        toastAlert("succes", apiData.message);
        setIsInputVisible(false);
        fetchSignerData();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (i, event) => {
    const { name, value } = event.target;
    const newSignersData = [...signersData];

    const newInputErrors = [...inputErrors];
    // Check if the email is already present in the array
    if (
      name === "email" &&
      signersData?.some(
        (signer, index) => signer.email === value && index !== i
      )
    ) {
      newInputErrors[i] = "This email is already in use.";
    } else {
      newInputErrors[i] = "";
    }

    newSignersData[i][name] = value;
    setSignersData(newSignersData);
    setInputErrors(newInputErrors);
  };
  const handleInputChangeRecipients = (i, event) => {
    const { name, value } = event.target;
    const newSignersData = [...RecipientsData];

    const newInputErrors = [...inputErrors];
    // Check if the email is already present in the array
    if (
      name === "email" &&
      RecipientsData?.some(
        (signer, index) => signer.email === value && index !== i
      )
    ) {
      newInputErrors[i] = "This email is already in use.";
    } else {
      newInputErrors[i] = "";
    }

    newSignersData[i][name] = value;
    setRecipientsData(newSignersData);
    setInputErrors(newInputErrors);
  };

  const AddSignersData = async () => {
    setLoadingSignersSave(true);
    //console.log(signersData);
    //console.log(file_id);

    const postData = {
      file_id: file_id,
      signers: signersData,
    };
    try {
      const apiData = await post("file/add-signer", postData); // Specify the endpoint you want to call
      //console.log('Signers ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert("error", apiData.message);
        setSignersData([]);
        setLoadingSignersSave(false);
      } else {
        // //console.log(apiData.result)
        toastAlert("succes", apiData.message);
        setSignersData(apiData.data);
        setCount(apiData.data.length);
        setLoadingSignersSave(false);
        fetchSignerData(file_id);
        setSignerAddEdit(false);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setLoadingSignersSave(false);
    }
  };
  const AddRecipientsData = async () => {
    //console.log(RecipientsData);
    //console.log(file_id);

    const postData = {
      file_id: file_id,
      recipients: RecipientsData,
    };
    try {
      const apiData = await post("file/add-recipient", postData); // Specify the endpoint you want to call
      //console.log('Recipients ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert("error", apiData.message);
        // setRecipientsData([])
        //console.log('Recipients Error');
      } else {
        //console.log('Recipients Success');
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };

  const deleteForm = (index) => {
    //console.log(index);
    const newSignersData = [...signersData];
    newSignersData.splice(index, 1);
    //console.log(newSignersData);
    setSignersData(newSignersData);
    setCount(count - 1);
  };

  // send to esign

  // nav tabs

  const DragHandle = SortableHandle(() => {
    return (
      <>
        <MoreVertical size={20} id="DragItem" />
      </>
    );
  });
  const DragHandle1 = SortableHandle(() => {
    return (
      <>
        <MoreVertical size={25} id="DragItem" />
      </>
    );
  });
  const handleImageCropped = async (croppedFile) => {
    console.log("Cropped File:", croppedFile);
    const postData = {
      image: croppedFile,
      user_id: FileUserid,
    };
    const apiData = await postFormData(postData); // Specify the endpoint you want to call
    if (
      apiData.public_url === null ||
      apiData.public_url === undefined ||
      apiData.public_url === ""
    ) {
    } else {
      const url = apiData.public_url;

      console.log("pageno djh");

      console.log(pageNumber);
      let resultingData = await handlePlacePosition(
        eventDataOnClick,
        type,
        activePage,
        url,
        "null",
        activeSignerId,
        "null",
        true,
        "null",
        pageNumber
      );
      console.log(resultingData);

      setTextItems([...textItems, resultingData]);
      setEditedItem(resultingData);
      setResizingIndex(textItems.length);
      setIsResizing(true);
      // setType('');
    }
    // Handle the cropped image file (e.g., upload to server or display in UI)
  };

  const [isOpenCanvas, setIsOpenCanvas] = useState(false);
  const [isOpenCanvasPages, setIsOpenCanvasPages] = useState(false);

  // end
  const canvasRef = useRef();
  const canvasRefs = useRef([]);

  const [modalErrorWaitingSignersOther, setModalErrorWaitingSignersOther] =
    useState(false);
  const [AccessCodeModal, setAccessCodeModal] = useState(false);
  const [accessCodeSigner, setAccessCodeSigner] = useState("");
  const [inputAccessCode, setInputAccessCode] = useState("");

  const [signerControlsOption, setSignerControlsOption] = useState(false);
  const [signerLoginId, setSignerLoginId] = useState(null);
  const [DocSignerStatus, setDocSignerStatus] = useState(false);
  const [DocSignerStatusModal, setDocSignerStatusModal] = useState(false);
  const [DocSignerStatusModal1, setDocSignerStatusModal1] = useState(false);

  const [waitforOtherusers, setWaitforOtherusers] = useState(false);
  const [WaitOtherModal, setWaitOtherModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Uniq_id_doc, setUniq_id_doc] = useState("");
  const [MarkAsCompleted, setMarkAsCompleted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [ActivityLogData, setActivityLogData] = useState([]);
  const getActivityLog = async (file_id) => {
    // setLoaderDataIP(true);
    //console.log('Activity Log ');
    const postData = {
      file_id: file_id,
    };
    const apiData1 = await post(
      "file/getFilesActivityLogReceivingEnd",
      postData
    ); // Specify the endpoint you want to call
    console.log("apiData1");

    console.log(apiData1);
    if (apiData1.data.length === 0) {
      // setLoaderDataIP(false);
      toastAlert("error", "No Audit Log Added");
    } else {
      // const formattedData = await Promise.all(
      //   apiData1.data.map(async item => {
      //     const formattedDate = await formatDateTimeZone(item.location_date, item.ip_address);
      //     // const timeZone=userTimezone?.timezone

      //     return {...item, formattedDate: formattedDate.dateTime, timeZone: formattedDate?.timeZone};
      //   }),
      // );
      // setLoaderDataIP(false);
      setActivityLogData(apiData1.data); // Set the state with formatted data
      return apiData1.data;
    }
  };
  function addTableToPage(page, data) {
    const tableTop = 700;
    const rowHeight = 20;
    const columnWidths = [90, 200, 100, 100];

    // Draw table headers
    page.drawText("Event", { x: 10, y: tableTop, size: 5 });
    page.drawText("Description", {
      x: 10 + columnWidths[0],
      y: tableTop,
      size: 5,
    });
    // page.drawText('Country', {x: 10 + columnWidths[0] + columnWidths[1], y: tableTop, size: 5});
    page.drawText("IP Address", {
      x: 10 + columnWidths[0] + columnWidths[1] + columnWidths[2],
      y: tableTop,
      size: 5,
    });
    page.drawText("Date Time", {
      x:
        10 +
        columnWidths[0] +
        columnWidths[1] +
        columnWidths[2] +
        columnWidths[3],
      y: tableTop,
      size: 5,
    });

    // Draw table rows
    data.forEach((item, index) => {
      const y = tableTop - (index + 1) * rowHeight;
      page.drawText(item.event, { x: 10, y, size: 5 });
      page.drawText(item.description, { x: 10 + columnWidths[0], y, size: 5 });
      // page.drawText(item.location_country, {x: 10 + columnWidths[0] + columnWidths[1], y, size: 5});
      page.drawText(item.ip_address, {
        x: 10 + columnWidths[0] + columnWidths[1] + columnWidths[2],
        y,
        size: 5,
      });
      page.drawText(`${formatDateCustomTime(item.location_date)} `, {
        x:
          10 +
          columnWidths[0] +
          columnWidths[1] +
          columnWidths[2] +
          columnWidths[3],
        y,
        size: 5,
      });
    });
  }

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

  const CompletedDocument = async () => {
    //     console.log('Mark as Completed');
    let doc_completed;
    const location = await getUserLocation();
    //     // await updateFileLog()
    //   setDocSignerStatusModal1(true);

    // setShowConfetti(true);
    setLoadingComplete(true);
    // await saveData();
    let response_log1;
    let allCompletedExceptCurrent;
    // getActivityLogUserFiles
    let response_log = await getActivityLogUserFiles({
      file_id: file_id,
      email: currentSignerEmail,
      event: "SIGNED-BY-SIGNER",
      description: `${currentSignerEmail} signed a document ${fileName} `,
    });
    console.log("Signed By signer");

    console.log(response_log);
    if (response_log === null) {
      console.log("MAINTAIN ERROR LOG");
    } else {
      console.log("SUCCESS ");
      allCompletedExceptCurrent = checkSignersCompletion(
        allSigners,
        signer_currentObject
      );
      console.log(allCompletedExceptCurrent);
      if (allCompletedExceptCurrent) {
        console.log("All accepted");
        doc_completed = true;

        if (!all_recipientsData || all_recipientsData.length === 0) {
          console.log("none");
          response_log1 = await getActivityLogUserFiles({
            file_id: file_id,
            email: currentSignerEmail,
            event: "COMPLETED",
            description: `${fileName} completed  `,
          });
        } else {
          const emails = all_recipientsData.map((recipient) => recipient.email);
          console.log("All accepted 2");

          if (emails.length === 1) {
            console.log(emails[0]);
            response_log1 = await getActivityLogUserFiles({
              file_id: file_id,
              email: currentSignerEmail,
              event: "COMPLETED",
              description: `${fileName} completed and send to recipient ${emails[0]}`,
            });
          } else {
            // Join the emails into a single string separated by commas
            const emailString = emails.join(", ");
            // Log the resulting string to the console
            console.log(emailString);
            response_log1 = await getActivityLogUserFiles({
              file_id: file_id,
              email: currentSignerEmail,
              event: "COMPLETED",
              description: `${fileName} completed and send to recipient ${emailString}`,
            });
          }
          //    let response_log1 = await getActivityLogUserFiles({
          //   file_id: file_id,
          //   email:currentSignerEmail,
          //   event: 'COMPLETED',
          //   description: `${fileName} completed and send to recipient `,
          // });
        }

        // Proceed with your action
      } else {
        console.log("Not all signers have accepted yet");
        doc_completed = false;
        // Handle the case where not all signers have accepted
      }
      // let response_log = await getActivityLogUserFiles({
      //   file_id: file_id,
      //   email:currentSignerEmail,
      //   event: 'COMPLETED-',
      //   description: `${currentSignerEmail} signed a document ${fileName} `,
      // });
      console.log(textItems);
      console.log("MAINTAIN SUCCESS LOG");
      console.log(response_log1);
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
          item.signer_id === signerLoginId ||
          item.signer_id_receive === signerLoginId
      );

      // Now, filteredTextItems will contain only the items that match both conditions.
      console.log(filteredTextItems);
      // Filter items that do not match the condition
      const remainingTextItems = textItems.filter(
        (item) =>
          !specifiedTypes.includes(item.type) &&
          item.signer_id !== signerLoginId &&
          item.signer_id_receive !== signerLoginId
      );

      // Now you have both arrays
      console.log("Filtered Text Items:", filteredTextItems);
      console.log("Remaining Text Items:", remainingTextItems);
      // let ActivityLogDetails= await getActivityLog(file_id)
      console.log(file_id);
      let statusData = "receiver";
      console.log(imageUrls);

      console.log("imageUrls");
      console.log(response_log1);
      await handleDownloadPDFHere({
        setDownloadPdfLoader: setLoadingComplete,
        imageUrls,
        textItems: filteredTextItems,
        canvasWidth,
        UniqIdDoc: UniqIdDoc,
        ActivityLogData: allCompletedExceptCurrent
          ? response_log1
          : response_log,
        fileName,
        file_id,
        statusData,
        imageUrlsCount,
        user_id: FileUserid,
        doc_completed,
        logo_data: compLogo,
      });
      // setLoadingComplete(false);

      await saveDataSigning(remainingTextItems);
    }
    const url_file = "dsjh";
    //     console.log('sgfsdghdfsh');
    const postData = {
      // sender_user_id:103584,

      signer_id: signerLoginId,
      file_id: file_id,
      completed_status: true,
      location_country: location.country,
      ip_address: location.ip,
      location_date: location.date,
      timezone: location?.timezone,
      url_file: url_file,
    };
    const apiData = await post("file/markDocAsCompletedBySigner", postData); // Specify the endpoint you want to call
    console.log("apixxsData");

    console.log(apiData);
    if (apiData.error) {
      setLoadingComplete(false);

      // toastAlert('error', apiData.message);
    } else {
      // start
      console.log(textItems);
      console.log(signerLoginId);

      //     // end
      setMarkAsCompleted(false);
      setDocSignerStatusModal1(true);
      // setShowConfetti(true);

      setLoadingComplete(false);
    }
  };
  const [currentSignerEmail, setCurrentSignerEmail] = useState([]);
  const [FileUserid, setFileUserid] = useState([]);

  const [SignersWhoHaveCompletedSigning, setSignersWhoHaveCompletedSigning] =
    useState([]);
  const [activeSignerId, setActiveSignerId] = useState("");
  const [allSigners, setAllSigners] = useState([]);
  const [UniqIdDoc, setUniqIdDoc] = useState("");
  const [all_recipientsData, setAll_RecipientsData] = useState([]);
  const [signer_currentObject, setSigner_currentObject] = useState(null);
  const [compLogo, setCompLogo] = useState("");
  const [compPrimaryColor, setCompPrimaryColor] = useState("");

  const getUnhashedEmailFileId = async () => {
    //console.log('emailHashed', emailHashed);
    //console.log('fileId', fileId);
    const location = await getUserLocation();
    const postData = {
      email: emailHashed,
      file_id: file_id,
      sender_user_id: senderId,
      token: token,
      location_country: location.country,
      ip_address: location.ip,
      location_date: location.date,
      timezone: location?.timezone,
    };
    try {
      const apiData = await post("file/received-doc-esign", postData); // Specify the endpoint you want to call
      console.log("Update File Controls ");
      console.log(apiData);
      if (
        apiData.company_details_exist === null ||
        apiData.company_details_exist === undefined
      ) {
        console.log("COMP LOGI ");
        if (apiData?.user_sender?.logo === null) {
          setCompLogo(logoRemoveBg);
        } else {
          setCompLogo(apiData?.user_sender?.logo);
        }
        setCompPrimaryColor("#23b3e8");
      } else {
        console.log("COMP LOGIn h ");
        let comp_logo = apiData?.company_details_exist?.company_logo;
        if (comp_logo === null) {
          console.log("COMP LOGIn hlogog ");

          setCompLogo(logoRemoveBg);
        } else {
          console.log("COMP LOGIn hlogog dsuiyfus");

          setCompLogo(comp_logo);
        }
        let comp_primary_color = apiData?.company_details_exist?.primary_color;
        if (comp_primary_color === null) {
          setCompPrimaryColor("#23b3e8");
        } else {
          setCompPrimaryColor(comp_primary_color);
        }
        // const action = await dispatch(
        //   getUser({user_id: apiData.fileDetails.user_id, token: apiData.token}),
        // );
        // if (action.payload) {
        //   // Do something with the user data if needed
        //   console.log('User data fetched:', action.payload);
        // }
      }
      setSigner_currentObject(apiData?.data);
      setUniqIdDoc(apiData?.fileDetails?.uniq_id);
      //console.log('You can sign');
      setImageUrls(apiData?.bgImages[0]?.inprocess_doc);
      setImageUrlsCount(apiData?.bgImages[0]?.original_doc_pages);
      setImageUrls2(apiData?.bgImages[0]?.image);

      // scroll to top
      // getActivityLog(apiData.fileDetails.file_id);

      if (apiData?.accessCode === true || apiData?.accessCode === "true") {
        console.log("Access code true ");

        setAccessCodeModal(true);
        setAccessCodeSigner(apiData?.data?.access_code);
      } else {
        console.log("Access code falsr ");
      }
      if (
        apiData?.fileDetails?.signer_functional_controls === true ||
        apiData?.fileDetails?.signer_functional_controls === "true"
      ) {
        console.log("signer contriols true");

        setSignerControlsOption(true);
        //console.log('SIGNER CONTROL OPTIONS ');
      } else {
        console.log("signer contriols false");

        setSignerControlsOption(false);
      }
      setSignerLoginId(apiData?.data?.signer_id);
      //console.log(apiData.data.signer_id);
      // setloaderRefresh(false)

      setTextItems(apiData?.positions[0]?.position_array);
      let positionsArrady = apiData?.positions[0]?.position_array;
      // setActiveImage(apiData.bgImages[0].bgimgs_id)
      // setActiveImageUrl(apiData.bgImages[0].image)
      // setImageUrls(apiData.bgImages)
      // setSavedCanvasData(apiData?.positions[0]?.position_array)
      const email_signer_current = apiData?.data.email;
      setCurrentSignerEmail(email_signer_current);
      console.log("email signef curreny");
      console.log(email_signer_current);
      let all_signers = apiData?.all_signers;
      setAll_RecipientsData(apiData?.all_recipients);
      setAllSigners(all_signers);
      //console.log(all_signers);
      //console.log(email_signer_current);

      // Find the order_id of the current user
      const currentUser = all_signers.find(
        (signer) => signer.email === email_signer_current
      );
      console.log("currentUser", currentUser);

      const currentUserOrderId = currentUser ? currentUser.order_id : null;
      const statusSignerCompletedDoc = currentUser.completed_status;
      const eSignOrder = apiData.fileDetails.set_esigning_order;
      setUniq_id_doc(apiData?.fileDetails?.uniq_id);
      setStatusFile(apiData?.fileDetails?.status);
      setFileName(apiData?.fileDetails?.name);
      setFileUserid(apiData?.fileDetails?.user_id);
      setDocSignerStatus(currentUser.completed_status);

      //console.log('dshgghds');
      //console.log(currentUser);
      if (
        currentUser.completed_status === true ||
        currentUser.completed_status === "true"
      ) {
        console.log("setDocSignerStatusModal");

        setDocSignerStatusModal(true);
        //console.log('DD');
      } else {
        console.log(currentUserOrderId);
        console.log("currentUserOrderId");
        if (eSignOrder === true || eSignOrder === "true") {
          if (currentUserOrderId === null) {
            console.log("Current user not found in signers");
          } else {
            console.log("Current user  found in signers");

            // Check if all users with a lower order_id have status true
            // Sort the orders by order_id
            all_signers.sort(
              (a, b) => parseInt(a.order_id) - parseInt(b.order_id)
            );
            // Find the first order with completed_status null
            let lowestOrderWithNullStatus = all_signers.find(
              (order) => order.completed_status === null
            );

            if (lowestOrderWithNullStatus) {
              console.log("Current user  null aagy ");

              console.log(lowestOrderWithNullStatus.order_id);
              console.log(currentUserOrderId);

              //console.log('Lowest order id with null completed status:', lowestOrderWithNullStatus.order_id);
              if (lowestOrderWithNullStatus.order_id === currentUserOrderId) {
                console.log("Current user  null aagy value  ");

                setWaitforOtherusers(false);
                setActiveSignerId(currentUser.signer_id);

                let signersWhoHaveCompletedSignedAA = all_signers.filter(
                  (order) => order.completed_status === "true"
                );
                //console.log('signers Who Have Completed Signed');
                //console.log(signersWhoHaveCompletedSignedAA);
                if (!Array.isArray(signersWhoHaveCompletedSignedAA)) {
                  signersWhoHaveCompletedSignedAA = [
                    signersWhoHaveCompletedSignedAA,
                  ];
                }

                const signerIds = signersWhoHaveCompletedSignedAA.map(
                  (signer) => signer.signer_id
                );
                //console.log('Signer IDs:');
                //console.log(signerIds);

                setSignersWhoHaveCompletedSigning(signerIds);
              } else {
                console.log("Current user sdfhj  ");

                //console.log('Wait for other users to sign');
                setWaitforOtherusers(true);
                setWaitOtherModal(true);
              }
            } else {
              //console.log('No order with null completed status found.');
            }
          }
        } else {
          setWaitforOtherusers(false);
          setActiveSignerId(currentUser.signer_id);
        }
        //console.log('dsf');
      }
      setIsLoaded(false);
    } catch (error) {
      //console.log('Error fetching data:', error);
      setIsLoaded(false);
    }
  };
  const [active, setActive] = useState("1");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // start
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

  // end
  useEffect(() => {
    if (window.innerWidth < 786) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
    getUnhashedEmailFileId();
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
  const containerRef = useRef();

  const handleTouchStart = (e, index, field) => {
    const touch = e.touches[0];
    const canvasRect =
      canvasRefs.current[pageNumber - 1].getBoundingClientRect();
    // const boundingRect = containerRef.current.getBoundingClientRect();
    const offsetX = (touch.clientX - canvasRect.left) / scale - field.x;
    const offsetY = (touch.clientY - canvasRect.top) / scale - field.y;
    // console.log("offsetX",offsetX)
    // console.log("offsetY",offsetY)

    setDragOffset({ x: offsetX, y: offsetY });
    setHoveredStateDummyIndex(index); // Set index of the hovered item
    setHoveredStateDummyType(field.type); // Set type of the hovered item
  };

  const handleTouchMove = (e, index, field) => {
    if (disableDraggingAndResizing.includes(field.type)) {
      return; // Skip if dragging/resizing is disabled
    }

    // e.preventDefault(); // Prevent default to stop scrolling while dragging

    const touch = e.touches[0];
    // const page = e.target.id.split('-')[2];
    const canvasRect =
      canvasRefs.current[pageNumber - 1].getBoundingClientRect();

    // const boundingRect = containerRef.current.getBoundingClientRect();
    const newX = (touch.clientX - canvasRect.left) / scale - dragOffset.x;
    const newY = (touch.clientY - canvasRect.top) / scale - dragOffset.y;
    // console.log("newX",newX)
    // console.log("newY",newY)
    // Only update if there is a noticeable move to reduce jitter
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].x = newX;
    newSavedCanvasData[index].y = newY;
    setTextItems(newSavedCanvasData);

    // if (Math.abs(newX - field.x) > 1 || Math.abs(newY - field.y) > 1) {
    //   setTextItems((prevItems) => {
    //     const updatedItems = [...prevItems];
    //     updatedItems[index].x = newX;
    //     updatedItems[index].y = newY;
    //     return updatedItems;
    //   });
    // }
  };

  const handleTouchEnd = () => {
    setType(hoveredStateDummyType); // Clear the hovered item index
    setHoveredStateDummyType(""); // Clear the hovered item type
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setType("");
      }
    };

    // Add event listener when the component mounts
    document.body.addEventListener("keydown", handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Update mouse position globally
    const updateMousePosition = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    document.addEventListener("mousemove", updateMousePosition);

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get the zoom level
      const zoomLevel = parseFloat(document.body.style.zoom) / 100 || 1;

      // Calculate adjusted mouse coordinates based on the zoom level
      const adjustedX = e.clientX / zoomLevel;
      const adjustedY = e.clientY / zoomLevel;

      const box = elementRefCursor.current;
      if (box) {
        // Add null check here
        box.style.left = adjustedX + "px";
        box.style.top = adjustedY + "px";
      }
    };

    // Attach mousemove event listeners to each page element
    Array.from({ length: numPages }, (_, i) => i + 1).forEach((page) => {
      const pageElement = document.getElementById(`full-page-${page}`);
      if (pageElement) {
        pageElement.addEventListener("mousemove", handleMouseMove);
      }
    });

    // Cleanup function
    return () => {
      // Remove the mousemove event listener from each page element
      Array.from({ length: numPages }, (_, i) => i + 1).forEach((page) => {
        const pageElement = document.getElementById(`full-page-${page}`);
        if (pageElement) {
          pageElement.removeEventListener("mousemove", handleMouseMove);
        }
      });
    };
  }, [numPages]);

  useEffect(() => {
    if (
      type === "my_text" ||
      type === "signer_text" ||
      type === "checkmark" ||
      type === "signer_checkmark" ||
      type === "date" ||
      type === "signer_date" ||
      type === "highlight" ||
      type === "stamp" ||
      type === "my_signature" ||
      type === "my_initials" ||
      type === "signer_initials" ||
      type === "signer_initials_text" ||
      type === "signer_chooseImgDrivingL" ||
      type === "signer_chooseImgPassportPhoto" ||
      type === "signer_chooseImgStamp" ||
      type === "signer_radio" ||
      type === "signer_dropdown"
    ) {
      // Get the zoom level
      const zoomLevel = parseFloat(document.body.style.zoom) / 100 || 1;

      // Calculate adjusted mouse coordinates based on the zoom level
      const adjustedX = mousePosition.x / zoomLevel;
      const adjustedY = mousePosition.y / zoomLevel;

      const box = elementRefCursor.current;
      if (box) {
        // Add null check here
        box.style.left = adjustedX + "px";
        box.style.top = adjustedY + "px";
      }
    }
  }, [type, mousePosition]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
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
      if (fullPageElement) {
        fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 1000);
    console.log("DOUCMDGH LOSDED");
    // setIsDocumentLoaded(true)
  };

  const handleDownloadPDF = async () => {
    setDownloadLoader(true);
    const response = await fetch(`${imageUrls2}`);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { height } = page.getSize();
      page.drawText(`Document ID: ${UniqIdDoc}`, {
        x: 10,
        y: height - 20,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const url = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadLoader(false);
  };

  const [editedIndex, setEditedIndex] = useState("");

  const handleDoubleClick = (index, item) => {
    if (!disableDraggingAndResizing.includes(item.type)) {
      setResizingIndex(index);
      setEditedItem(item);
      setDeleteIndex(item.id);
      setIsResizing(true);
    }

    //console.log('double click ');
  };
  const handleSignatureAdd = (index, item) => {
    setEditedIndex(index);
    console.log(item);
    setType(item.type);
    console.log(index);
    console.log(item.type);

    //console.log(item.type)
    if (item.type === "signer_initials_text") {
      setInitialBox(true);
      setSignatureModal(true);
    } else {
      setInitialBox(false);
      setSignatureModal(true);
    }
  };
  const [hoveredStateDummyType, setHoveredStateDummyType] = useState("");

  const [isLoaded, setIsLoaded] = useState(true);
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };
  const [editedItem, setEditedItem] = useState();
  const isButtonDisabled = () => {
    // Assuming textItems is the array of objects you mentioned
    // activeSignerId is the id of the active signer
    const data = textItems?.some(
      (item) =>
        item.signer_id === activeSignerId &&
        item.required &&
        (!item.text || !item.url)
    );
    return data;
  };
  const handleFontSizeChange = (index, fontSize) => {
    // Implement your logic to change the font size here
    //console.log(index);
    //console.log(fontSize);
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].fontSize = parseInt(fontSize);
    if (newSavedCanvasData[index].type === "my_text") {
      if (fontSize >= 18) {
        newSavedCanvasData[index].height = parseInt(40);
      }
    }

    //console.log(fontSize);
    setTextItems(newSavedCanvasData);
    // setStateMemory({
    //   fontSize: fontSize,
    // });
    setStateMemory((prevState) => ({
      ...prevState,
      fontSize: parseInt(fontSize),
    }));

    setEditedItem((prevState) => ({
      ...prevState,
      fontSize: parseInt(fontSize),
    }));
    //console.log(editedItem);
  };
  const handleFontFamChange = (index, fontFam) => {
    // Implement your logic to change the font size here
    //console.log(index);
    //console.log(fontFam);
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].fontFamily = fontFam;
    //console.log(fontFam);
    setTextItems(newSavedCanvasData);
    setStateMemory((prevState) => ({
      ...prevState,
      fontFamily: fontFam,
    }));
    setEditedItem((prevState) => ({
      ...prevState,
      fontFamily: fontFam,
    }));
    //console.log(editedItem);
  };
  const handleDeleteCurrentPosition = (id) => {
    setDeleteIndex(id);
    setItemDeleteConfirmation(true);
    setOpenEditorComp(false);
  };
  const handleCharacterLimitChange = (event, index) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].characterLimit = event.target.value;
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      characterLimit: event.target.value,
    }));
  };
  const handleFormatChange = (index, event) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].format = event.target.value;
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      format: event.target.value,
    }));
  };
  const handleTooltipChanged = (event, index) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].tooltip = event.target.value;
    //console.log(event.target.value);
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      tooltip: event.target.value,
    }));
  };
  const handleAddSelectOptions = (array, index) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].options = array;
    //console.log(array);
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      options: array,
    }));
  };
  const handleFontWeightChange = (index, fontWeight) => {
    const newSavedCanvasData = [...textItems];
    // Implement your logic to change the font weight here
    if (parseInt(fontWeight) === parseInt(400)) {
      newSavedCanvasData[index].fontWeight = 600;
      // savedCanvasData[index].fontWeight = 600
      //console.log('600');
      setStateMemory((prevState) => ({
        ...prevState,
        fontWeight: 600,
      }));
      setEditedItem((prevState) => ({
        ...prevState,
        fontWeight: 600,
      }));
    } else {
      newSavedCanvasData[index].fontWeight = 400;
      // savedCanvasData[index].fontWeight = 400
      //console.log('400');
      setEditedItem((prevState) => ({
        ...prevState,
        fontWeight: 400,
      }));
      setStateMemory((prevState) => ({
        ...prevState,
        fontWeight: 400,
      }));
    }
    setTextItems(newSavedCanvasData);
  };
  const handleFontStyleChange = (index, fontStyle) => {
    const newSavedCanvasData = [...textItems];
    // Implement your logic to change the font style here
    if (fontStyle === "normal") {
      newSavedCanvasData[index].fontStyle = "italic";
      setEditedItem((prevState) => ({
        ...prevState,
        fontStyle: "italic",
      }));
      setStateMemory((prevState) => ({
        ...prevState,
        fontStyle: "italic",
      }));
    } else {
      newSavedCanvasData[index].fontStyle = "normal";
      setEditedItem((prevState) => ({
        ...prevState,
        fontStyle: "normal",
      }));
      setStateMemory((prevState) => ({
        ...prevState,
        fontStyle: "normal",
      }));
    }
    setTextItems(newSavedCanvasData);
  };
  const handleDateChanged = (event, index) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = new Date(event.target.value);
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      text: new Date(event.target.value),
    }));
  };
  const handleTextDecorationChange = (index, textDecoration) => {
    const newSavedCanvasData = [...textItems];
    // Implement your logic to change the font style here
    if (textDecoration === "underline") {
      newSavedCanvasData[index].textDecoration = "none";
      setEditedItem((prevState) => ({
        ...prevState,
        textDecoration: "none",
      }));
      setStateMemory((prevState) => ({
        ...prevState,
        textDecoration: "none",
      }));
    } else {
      newSavedCanvasData[index].textDecoration = "underline";
      setEditedItem((prevState) => ({
        ...prevState,
        textDecoration: "underline",
      }));
      setStateMemory((prevState) => ({
        ...prevState,
        textDecoration: "underline",
      }));
    }
    setTextItems(newSavedCanvasData);
  };
  const [OpenEditorComp, setOpenEditorComp] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const handleInputRequired = (event, index) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].required = event;
    //console.log(event);
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      required: event,
    }));
    setStateMemory((prevState) => ({
      ...prevState,
      required: event,
    }));
  };

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (DocSignerStatusModal1) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000); // Stop confetti after 5 seconds
    }
  }, [DocSignerStatusModal1]);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const handleCanvasClick2 = async (type1) => {
    console.log("canvas click ");
    console.log(type1);
    setType(type1);
    // setZoomPercentage(100);

    const zoomLevel1 = window.devicePixelRatio;

    console.log(pageNumber);
    let clickedPageNumber = pageNumber;
    // Get the canvas element and its bounding rectangle
    // const canvas = document.getElementById(`full-page-${pageNumber}`);
    // const rect = canvas.getBoundingClientRect();
    const canvasRect = canvasRefs.current[pageNumber - 1];
    const canvas = canvasRect.current;
    const rect = canvasRect.getBoundingClientRect();
    const x = (rect.width / 2 - rect.left) / zoomLevel1;
    const y = (rect.height / 2 - rect.top) / zoomLevel1;
    console.log(x);
    console.log(y);

    // end
    setUnsavedChanges(true);

    // setPageNumber(page_no)
    // if (appendEnable == true) {
    console.log("sdfhjsdfhjgfdhsj");

    const zoomLevel = parseFloat(document.body.style.zoom) / 100 || 1;
    // handleAddField(x, y);
    // ,y cose
    // let arrayObj = {
    //   x,
    //   y,
    // };
    console.log(textItems);
    const itemExists = textItems?.some(
      (item) => item.x === x && item.y === y && item.page_no === pageNumber
    );
    let arrayObj;
    if (itemExists) {
      // toastAlert("error","Move the page to add more fields")
      console.log("Item already present in this position");
      //  arrayObj = {
      //   x:x+10,
      //   y:y+10,
      // };
      let newX = x;
      let newY = y;
      while (
        textItems?.some(
          (item) =>
            item.x === newX && item.y === newY && item.page_no === pageNumber
        )
      ) {
        console.log("Item already present in this position");
        newX += 10;
        newY += 10;
      }
      arrayObj = {
        x: newX,
        y: newY,
      };
    } else {
      arrayObj = {
        x,
        y,
      };
    }
    if (type1 === "") {
      console.log("type1 not ");
    } else if (type1 === "my_signature") {
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(textItems.length);

      setInitialBox(false);
      setSignatureModal(true);
    } else if (type1 === "my_initials") {
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(textItems.length);
      setInitialBox(true);
      setSignatureModal(true);
    } else if (type1 === "stamp") {
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(textItems.length);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) =>
        handleImageChangeDummy(e, arrayObj, type1, clickedPageNumber);
      // input.onchange = e => handleImageChange(e, arrayObj, type1,clickedPageNumber);
      input.click();
    } else {
      let resultingData = await handlePlacePosition(
        arrayObj,
        type1,
        activePage,
        "null",
        "null",
        "null",
        stateMemory,
        "null",
        "null",
        clickedPageNumber,
        scale
      );
      console.log(resultingData);
      // setSavedCanvasData([...savedCanvasData, resultingData])
      setResizingIndex(textItems.length);
      setIsResizing(true);
      setEditedItem(resultingData);
      // const idData=textItems[textItems.length-1].id
      console.log(resultingData);
      setDeleteIndex(resultingData.id);
      setTextItems([...textItems, resultingData]);

      // setTextItems([...textItems, { x, y, page: pageNumber, text: "TEXT" }]);
      // setClickPosition({ x, y });
      setClickPosition({ x: x, y: y });

      // setType('');
    }

    if (
      type1 === "my_signature" ||
      type1 === "my_initials" ||
      type1 === "checkmark" ||
      type1 === "highlight" ||
      type1 === "stamp" ||
      type1 === "signer_chooseImgDrivingL" ||
      type1 === "signer_chooseImgPassportPhoto" ||
      type1 === "signer_chooseImgStamp" ||
      type1 === "signer_initials" ||
      type1 === "signer_initials_text" ||
      type1 === "signer_checkmark" ||
      type1 === "signer_radio"
    ) {
      //   console.log('Conditions not met, not opening modal');
    } else {
      setOpenEditorComp(true);
      // setDeleteIndex(id);
    }
  };

  return (
    <>
      {isLoaded ? <FullScreenLoader /> : null}
      <>
        {" "}
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
                                          border:
                                            (hoveredStateDummyIndex === index ||
                                              (isResizing &&
                                                resizingIndex === index)) &&
                                            [
                                              "my_text",
                                              "my_signature",
                                              "date",
                                              // "checkmark",
                                              "highlight",
                                              "stamp",
                                            ].includes(field.type)
                                              ? "2px solid rgba(98,188,221,1)"
                                              : "none",
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
                                        onTouchStart={(e) => {
                                          if (
                                            !disableDraggingAndResizing.includes(
                                              field.type
                                            )
                                          ) {
                                            setResizingIndex(index);
                                            setIsResizing(true);
                                            setEditedItem(field);
                                            setPageNumber(page);
                                            handleTouchStart(e, index, field);
                                          }
                                        }}
                                        onTouchMove={(e) => {
                                          if (
                                            !disableDraggingAndResizing.includes(
                                              field.type
                                            )
                                          ) {
                                            setPageNumber(page);
                                            handleTouchMove(e, index, field);
                                          }
                                        }}
                                        onTouchEnd={handleTouchEnd}
                                        onResizeStart={(
                                          e,
                                          direction,
                                          ref,
                                          delta,
                                          position
                                        ) => {
                                          if (
                                            !disableDraggingAndResizing.includes(
                                              field.type
                                            )
                                          ) {
                                            if (field.type === "checkmark") {
                                              return;
                                            }
                                            setEditedItem(field);
                                            setIsResizing(true);
                                            setResizingIndex(index);
                                            setPageNumber(page);
                                            setHoveredStateDummyType(type);
                                            setType("");
                                          }
                                        }}
                                        onResizeStop={async (
                                          e,
                                          direction,
                                          ref,
                                          delta,
                                          position
                                        ) => {
                                          // console.log(signerControlsOption);
                                          // console.log(field);
                                          if (
                                            !disableDraggingAndResizing.includes(
                                              field.type
                                            )
                                          ) {
                                            if (field.type === "checkmark") {
                                              return;
                                            }
                                            if (signerControlsOption) {
                                              // if (
                                              //   field.signer_id_receive ===
                                              //   activeSignerId
                                              // ) {
                                              const width =
                                                parseInt(ref.style.width, 10) /
                                                scale;
                                              const height =
                                                parseInt(ref.style.height, 10) /
                                                scale;

                                              const newX = position.x / scale;
                                              const newY = position.y / scale;

                                              // Ensure that the new position does not go out of bounds
                                              const boundedX = Math.max(
                                                0,
                                                newX
                                              );
                                              const boundedY = Math.max(
                                                0,
                                                newY
                                              );

                                              await handleUpdateFieldResize(
                                                field.id,
                                                field.type,
                                                width,
                                                height,
                                                boundedX,
                                                boundedY
                                              );
                                              setType(hoveredStateDummyType);
                                              setHoveredStateDummyType("");
                                              // } else {
                                              // }
                                            }
                                          }
                                        }}
                                        bounds="parent"
                                      >
                                        <div ref={containerRef}>
                                          {!disableDraggingAndResizing.includes(
                                            field.type
                                          ) &&
                                            isResizing &&
                                            resizingIndex === index && (
                                              <>
                                                {field.type !== "checkmark" &&
                                                  field.type !==
                                                    "signer_checkmark" &&
                                                  field.type !==
                                                    "signer_radio" && (
                                                    <>
                                                      <ResizeCircle
                                                        position={{
                                                          top: -5,
                                                          left: -5,
                                                        }}
                                                        color="white"
                                                        item="none"
                                                      />
                                                      <ResizeCircle
                                                        position={{
                                                          top: -5,
                                                          right: -5,
                                                        }}
                                                        color="white"
                                                        item="none"
                                                      />
                                                      <ResizeCircle
                                                        position={{
                                                          bottom: -5,
                                                          left: -5,
                                                        }}
                                                        color="white"
                                                        item="none"
                                                      />
                                                      <ResizeCircle
                                                        position={{
                                                          bottom: -5,
                                                          right: -5,
                                                        }}
                                                        color="white"
                                                        item="none"
                                                      />
                                                    </>
                                                  )}
                                              </>
                                            )}

                                          <ComponentForItemType
                                            // handleKeyPress={(e)=>handleKeyPress(e,index)}
                                            // SignerActivePosition={SignerActivePosition}
                                            SignersWhoHaveCompletedSigning={
                                              SignersWhoHaveCompletedSigning
                                            }
                                            RequiredActive={RequiredActive}
                                            signerFunctionalControls={
                                              signerControlsOption
                                            }
                                            key={index}
                                            item={field}
                                            // handleFileChange={(e) =>
                                            //   handleFileChange(e, index)
                                            // }
                                            handleFileChange={(e) =>
                                              handleImageChangeDummyEdit(
                                                e,
                                                index
                                              )
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
                                            setCallbackWidth={(width) =>
                                              handleChnageWidthInput(
                                                width,
                                                index
                                              )
                                            }
                                            onTouchEnd={() => {
                                              handleDoubleClick(index, field);
                                            }}
                                            handleSignatureAdd={() =>
                                              handleSignatureAdd(index, field)
                                            }
                                            IsSigner={true}
                                            signer_id={field.signer_id}
                                            signerObject={selectedSigner}
                                            activeSignerId={activeSignerId}
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
            {sendToEsign === false &&
              SignatureModalUpdate === false &&
              OpenEditorComp === false &&
              DocSignerStatusModal === false &&
              DocSignerStatusModal1 === false &&
              MarkAsCompleted === false &&
              AccessCodeModal === false &&
              modalOpen1 === false &&
              WaitOtherModal === false &&
              isLoaded === false &&
              itemDeleteConfirmation === false &&
              signerAddEdit === false &&
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
                  {signerControlsOption ? (
                    <>
                      {isResizing &&
                      !disableDraggingAndResizing.includes(editedItem?.type) ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              editedItem?.type === "checkmark" ||
                              editedItem?.type === "highlight"
                                ? "right"
                                : "space-between",
                            backgroundColor: "white",
                            paddingBottom: "10px",
                          }}
                        >
                          {editedItem?.type === "checkmark" ||
                          editedItem?.type === "highlight" ||
                          editedItem?.type === "signer_checkmark" ? null : (
                            <Button
                              size="sm"
                              color="success"
                              style={{ boxShadow: "none", width: "100px" }}
                              className="text-nowrap px-1"
                              onClick={() => {
                                // setInputValueAccessCode('');
                                // handleButtonClick();
                                // setActiveRow(i);
                                console.log("type");

                                console.log(editedItem);
                                if (editedItem?.type === "my_signature") {
                                  setInitialBox(false);
                                  const index = textItems.findIndex(
                                    (item) => item.id === editedItem.id
                                  );
                                  console.log(index);
                                  setUpdatedSignatureIndex(index);
                                  setSignatureModalUpdate(true);
                                } else if (editedItem?.type === "my_initials") {
                                  const index = textItems.findIndex(
                                    (item) => item.id === editedItem.id
                                  );
                                  console.log(index);
                                  setUpdatedSignatureIndex(index);
                                  setInitialBox(true);
                                  setSignatureModalUpdate(true);
                                } else if (editedItem?.type === "stamp") {
                                  const index = textItems.findIndex(
                                    (item) => item.id === editedItem.id
                                  );
                                  console.log(index);
                                  setEventDataOnClick({
                                    x: editedItem.x,
                                    y: editedItem.y,
                                  });
                                  setUpdatedSignatureIndex(index);
                                  const input = document.createElement("input");
                                  input.type = "file";
                                  input.accept = "image/png";
                                  input.onchange = (e) =>
                                    handleUpdateImageChange(e, index);
                                  input.click();
                                } else {
                                  setOpenEditorComp(true);
                                }
                              }}
                            >
                              <span style={{ fontSize: "16px" }}> Edit </span>
                            </Button>
                          )}
                          {editedItem?.type === "signer_checkmark" ? null : (
                            <Button
                              size="sm"
                              color="danger"
                              style={{ boxShadow: "none", width: "100px" }}
                              className="text-nowrap px-1"
                              onClick={() => {
                                setItemDeleteConfirmation(true);
                                setOpenEditorComp(false);
                                //   setInputValueAccessCode('');
                                //   handleButtonClick();
                                //   setActiveRow(i);
                              }}
                            >
                              <span style={{ fontSize: "16px" }}> Delete </span>
                            </Button>
                          )}
                        </div>
                      ) : null}

                      <div style={{ backgroundColor: "white" }}>
                        <div
                          style={{
                            display: "flex",
                            width: parseInt(window.innerWidth),
                            overflowX: "scroll",
                            overflowY: "hidden",
                          }}
                        >
                          {/* <TabContent activeTab={active}>
                            <TabPane tabId="1">
                              <ListGroup
                                style={{ width: "100%" }}
                                className="list-group-vertical-sm"
                              >
                                <ForYou
                                  type={getTypeListItem}
                                  typeData={type}
                                  compPrimaryColor={compPrimaryColor}
                                  handleCanvasClick2={handleCanvasClick2}
                                />
                              </ListGroup>
                            </TabPane>
                          </TabContent> */}
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
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
                    {statusFile === "WaitingForOthers" ? (
                      <>
                        {textItems?.some(
                          (item) =>
                            item.signer_id === activeSignerId &&
                            item.required === true &&
                            (item.text === null ||
                              item.text === " " ||
                              item.text === "" ||
                              item.url === null)
                        ) ? (
                          <Button
                            size="sm"
                            color={"warning"}
                            onClick={async () => {
                              // saveData();
                              // setMarkAsCompleted(true);
                              //console.log('text');
                              //console.log(textItems);
                              const emptyRows = textItems.filter(
                                (item) =>
                                  item.signer_id === activeSignerId &&
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
                                //   "Fill All Required Fileds to continue!"
                                // );
                              } else {
                                // Log a message if no empty rows are found
                                //console.log('No empty row found');
                                //  await saveData();
                                // setMarkAsCompleted(true);
                                setFinishButtonEnable(false);
                              }
                            }}
                            // onClick={() => saveData()}
                            style={{
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
                              textItems?.some(
                                (item) =>
                                  item.signer_id === activeSignerId &&
                                  item.required === true &&
                                  (item.text === null ||
                                    item.text === " " ||
                                    item.text === "" ||
                                    item.url === null)
                              )
                                ? true
                                : false
                            }
                            color={"success"}
                            onClick={async () => {
                              setMarkAsCompleted(true);
                            }}
                            // onClick={() => saveData()}
                            style={{
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
                      </>
                    ) : null}

                    {statusFile === "InProgress" ? (
                      <>
                        {onlySigner === true || onlySigner === "true" ? (
                          <Button
                            color="success"
                            onClick={async () => {
                              const postData = {
                                file_id: file_id,
                                status: "Completed",
                              };
                              try {
                                const apiData = await post(
                                  "file/update-file",
                                  postData
                                ); // Specify the endpoint you want to call
                                //console.log('Update File Controls ');
                                //console.log(apiData);
                                if (apiData.error) {
                                  toastAlert("error", apiData.message);
                                  // setFileName("")
                                  // setInputValue("")
                                } else {
                                  // //console.log(apiData.result)
                                  toastAlert("success", apiData.message);

                                  await saveData();
                                  window.location.href = "/home";
                                }
                              } catch (error) {
                                //console.log('Error fetching data:', error);
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
                              Finish
                            </span>
                          </Button>
                        ) : (
                          <Button
                            disabled={signersData.length === 0 ? true : false}
                            color="primary"
                            onClick={() => {
                              if (signersData.length === 0) {
                                toastAlert("error", "Please Add Signers");
                              } else {
                                setSendToEsign(true);
                              }
                            }}
                            style={{
                              marginLeft: "10px",

                              display: "flex",
                              boxShadow: "none",
                              height: "40px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="btn-icon d-flex"
                          >
                            <span
                              style={{ fontSize: "16px" }}
                              className="align-middle ms-25"
                            >
                              Send E-Sign
                            </span>
                          </Button>
                        )}
                      </>
                    ) : (
                      <></>
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
                    {window.innerWidth < 380 ? (
                      <Menu
                        size={20}
                        style={{ marginRight: "20px" }}
                        onClick={() => {
                          setIsOpenCanvas(true);
                        }}
                      />
                    ) : null}
                    {/* <Button
                    style={{
                      backgroundColor: "white",
                      boxShadow: "none",
                      height: "40px",
                      marginLeft: "20px",
                    }}
                    color="white"
                    onClick={async () => {
                      if (statusFile === "InProgress") {
                        if (
                          window.confirm(
                            "Do you want to save the previous changes?"
                          )
                        ) {
                          await saveData();
                        }
                        window.location.href = "/home";
                      } else {
                        window.location.href = "/home";
                      }
                    }}
                    className="btn-icon d-flex"
                  >
                    <ArrowLeft size={20} style={{ color: "#2367a6" }} />
                  </Button> */}
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
                    {AccessCodeModal ||
                    DocSignerStatusModal ||
                    WaitOtherModal ? null : (
                      <h2
                        className="fw-bold"
                        style={{ marginLeft: "10px", marginTop: "5px" }}
                      >
                        {fileName}.pdf
                      </h2>
                    )}
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <select
                      id="zoom"
                      onChange={handleZoomChange}
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        border: "1px solid lightGrey",
                        textAlign: "center",
                        textAlignLast: "center",
                      }}
                      value={scale}
                    >
                      {zoomOptions.map((option) => (
                        <option key={option} value={option}>
                          {option * 100}%
                        </option>
                      ))}
                    </select>
                    {/* <select
                    style={{border: 'none', fontSize: '16px', cursor: 'pointer'}}
                    value={zoomPercentage}
                    onChange={e => handleZoomChange(e.target.value)}>
                    <option value="75">75%</option>
                    <option value="100">100%</option>
                    <option value="110">110%</option>
                    <option value="125">125%</option>
                    <option value="150">150%</option>
                    <option value="fit">Fit to Width</option>
                  </select> */}
                  </div>
                  {/* <div>{saveLoading ? <h4>Saving ...</h4> : null}</div> */}
                  {/* {AccessCodeModal ||WaitOtherModal||
                DocSignerStatusModal ||
                loadingComplete ? null : ( */}
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
                      // disabled={saveLoading}
                      color="orange"
                      disabled={
                        downloadLoader ||
                        AccessCodeModal ||
                        WaitOtherModal ||
                        DocSignerStatusModal ||
                        loadingComplete
                      }
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
                          {downloadLoader ? (
                            <Spinner color="white" size="sm" />
                          ) : null}
                          <span className="align-middle ms-25">
                            Download Original
                          </span>
                        </>
                      }
                    />

                    {statusFile === "WaitingForOthers" ? (
                      <>
                        {textItems?.some(
                          (item) =>
                            item.signer_id === activeSignerId &&
                            item.required === true &&
                            (item.text === null ||
                              item.text === " " ||
                              item.text === "" ||
                              item.url === null)
                        ) ? (
                          <Button
                            disabled={
                              AccessCodeModal ||
                              WaitOtherModal ||
                              DocSignerStatusModal ||
                              loadingComplete
                            }
                            color={"warning"}
                            onClick={async () => {
                              // saveData();
                              // setMarkAsCompleted(true);
                              //console.log('text');
                              //console.log(textItems);
                              const emptyRows = textItems.filter(
                                (item) =>
                                  item.signer_id === activeSignerId &&
                                  item.required === true &&
                                  (item.text === null ||
                                    item.text === " " ||
                                    item.text === "" ||
                                    item.url === null)
                              );

                              // Check if there are any empty rows
                              if (emptyRows.length > 0) {
                                // Perform action with the empty rows if needed
                                console.log(emptyRows);
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
                                //  await saveData();
                                // setMarkAsCompleted(true);
                                setFinishButtonEnable(false);
                              }
                            }}
                            // onClick={() => saveData()}
                            style={{
                              marginRight: "10px",
                              display: "flex",
                              boxShadow: "none",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="btn-icon d-flex"
                          >
                            {/* {saveLoading ? (
                        <Spinner color="white" size="sm" />
                      ) : saveSuccess ? (
                        <Check color="white" size={15} />
                      ) : null} */}
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
                              WaitOtherModal ||
                              DocSignerStatusModal ||
                              loadingComplete ||
                              textItems?.some(
                                (item) =>
                                  item.signer_id === activeSignerId &&
                                  item.required === true &&
                                  (item.text === null ||
                                    item.text === " " ||
                                    item.text === "" ||
                                    item.url === null)
                              )
                                ? true
                                : false
                            }
                            color={"success"}
                            onClick={async () => {
                              setMarkAsCompleted(true);
                            }}
                            // onClick={() => saveData()}
                            style={{
                              marginRight: "10px",
                              display: "flex",
                              boxShadow: "none",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="btn-icon d-flex"
                          >
                            {/* {saveLoading ? (
                        <Spinner color="white" size="sm" />
                      ) : saveSuccess ? (
                        <Check color="white" size={15} />
                      ) : null} */}
                            <span
                              style={{ fontSize: "16px" }}
                              className="align-middle ms-25"
                            >
                              Finish & Submit
                            </span>
                          </Button>
                        )}
                        {/* {FinishButtonEnable===false?null:
                    } */}
                      </>
                    ) : null}
                  </div>
                  {/* // )} */}
                </Col>
              </Row>
            </Col>
            {AccessCodeModal ||
            DocSignerStatusModal ||
            WaitOtherModal ? null : (
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
             
              </Col> */}
                  <Col
                    xs={2}
                    style={{
                      backgroundColor: "white",
                    }}
                  >
                    {/* For you For Others  */}
                    {/* {signerControlsOption ? (
                      <div>
                        <Nav className="justify-content-center">
                          <NavItem>
                            <NavLink
                              style={{
                                fontSize: "16px",
                                color: compPrimaryColor,
                              }}
                              active={1}
                            >
                              For You
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <ListGroup
                          style={{ width: "100%" }}
                          className="list-group-vertical-sm"
                        >
                          <ForYou
                            type={getTypeListItem}
                            typeData={type}
                            compPrimaryColor={compPrimaryColor}
                          />
                        </ListGroup>
                       
                      </div>
                    ) : null} */}
                    {type === "" ? null : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginInline: "4%",
                        }}
                      >
                        <Button
                          // disabled={saveLoading}
                          color="danger"
                          onClick={() => {
                            // setSignerView(true)
                            setType("");
                          }}
                          style={{
                            display: "flex",
                            boxShadow: "none",
                            justifyContent: "center",
                            marginBlock: "3%",
                            width: "92%",
                            cursor: "pointer",
                            marginLeft: "2px",
                            // alignSelf:"center",
                            alignItems: "center",
                          }}
                          className="btn-icon d-flex"
                        >
                          <span
                            style={{ fontSize: "16px", letterSpacing: ".5px" }}
                            className="align-middle ms-25"
                          >
                            Deselect
                          </span>
                        </Button>
                      </div>
                    )}
                  </Col>
                  {sendToEsign === false &&
                    // modalOpen === false &&
                    // modalOpenDropdown === false &&
                    DocSignerStatusModal1 === false &&
                    MarkAsCompleted === false &&
                    itemDeleteConfirmation === false &&
                    signerAddEdit === false &&
                    modalOpen1 === false &&
                    SignatureModalUpdate === false &&
                    SignatureModal === false && (
                      <SidebarTypes
                        selectedSigner={selectedSigner}
                        type={type}
                        elementRefCursor={elementRefCursor}
                        stateMemory={stateMemory}
                        zoomPercentage={scale}
                      />
                    )}
                  <Col
                    xs={8}
                    ref={colRef}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor:
                        type === "my_text" || type === "signer_text"
                          ? "none"
                          : type
                          ? "none"
                          : "default",
                      // maxHeight: '92dvh',
                      paddingTop: "10px",
                      backgroundColor: "#eaeaea",
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
                        // overFlow: "auto",

                        position: "relative",
                        // position: 'relative',
                        // transform: `scale(${zoomPercentage / 100})`,
                        // transformOrigin: 'top left',
                      }}
                    >
                      {/* <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '25px'}}> */}
                      <Document
                        file={`${imageUrls}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onError={onDocumentLoadError}
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
                              {" "}
                              {/* {Array.from({ length: numPages }, (_, i) => i + 1).map(
                          (page) => ( */}
                              <div
                                key={page}
                                style={{ marginBottom: "20px" }}
                                // style={{ position: "relative" }}
                                id={`full-page-${page}`}
                                // key={page}
                                // style={{ marginBottom: "20px" }}
                                //  id={`full-page-${page}`} style={{position: 'relative'}}
                              >
                                {/* <div
                              id={`page-${page}`}
                              key={`page-${page}`}
                              style={{position: 'absolute', top: 10, left: 10, zIndex: 2}}>
                              <h6 style={{color: 'black', fontSize: '16px'}}>Document ID: {UniqIdDoc}</h6>
                            </div> */}
                                <Page
                                  scale={scale}
                                  onLoadSuccess={({ width }) => {
                                    setCanvasWidth(width);
                                  }}
                                  onMouseEnter={() => {
                                    console.log("page", page);

                                    setActivePage(page);
                                    setPageNumber(page);
                                    // Ensure the thumbnail scrolls into view in Col 2
                                    const thumbnailElement =
                                      document.getElementById(
                                        `thumbnail-page-${page}`
                                      );
                                    if (
                                      thumbnailElement &&
                                      scrollContainerRefCol2.current
                                    ) {
                                      // Fallback to manual scroll if `scrollIntoView` fails
                                      thumbnailElement.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center",
                                        inline: "nearest",
                                      });
                                    }
                                  }}
                                  renderAnnotationLayer={false}
                                  renderTextLayer={false}
                                  key={page}
                                  pageNumber={page}
                                  canvasRef={(ref) =>
                                    (canvasRefs.current[page - 1] = ref)
                                  }
                                  onClick={(e) => handleCanvasClick(e, page)}
                                  // width={canvasWidth}
                                  // className={activePage === page ? 'active-page' : ''}
                                  // onClick={() => handlePageClick(page)}
                                >
                                  {textItems.map((field, index) => (
                                    <>
                                      <Rnd
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
                                        id={`item-${field.id}-${page}`}
                                        key={field.id}
                                        style={{
                                          // border: field.type==="checkmark" || field.type==="radio" ?'none':'1px solid lightgrey',
                                          border:
                                            (hoveredStateDummyIndex === index ||
                                              (isResizing &&
                                                resizingIndex === index)) &&
                                            [
                                              "my_text",
                                              "my_signature",
                                              "my_initials",
                                              "date",
                                              // "checkmark",
                                              "highlight",
                                              "stamp",
                                            ].includes(field.type)
                                              ? "2px solid rgba(98,188,221,1)"
                                              : "none",
                                          // display: field.bgImg === activePage ? 'block' : 'none',
                                          display: "block", // Always render the component
                                          visibility:
                                            field.page_no === page
                                              ? "visible"
                                              : "hidden", // Hide/show based on condition
                                          transform: `translate(${field.x}px, ${field.y}px)`,

                                          zIndex: 2,
                                        }}
                                        // size={{width: field.width, height: field.height}}
                                        // position={{x: field.x, y: field.y}}
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
                                        onMouseEnter={() => {
                                          setHoveredStateDummyIndex(index);
                                          setHoveredStateDummyType(type);
                                          setType("");
                                        }} // Set the hovered item ID on mouse enter
                                        onMouseLeave={() => {
                                          setHoveredStateDummyIndex("");
                                          setType(hoveredStateDummyType);
                                          setHoveredStateDummyType("");
                                        }}
                                        onDragStart={(e, d) => {
                                          console.log("DRAG Staget");
                                          if (signerControlsOption) {
                                            // console.log("field.signer_id_receive",
                                            //   field.signer_id_receive)
                                            //   console.log("activeSignerId",
                                            //     activeSignerId)
                                            if (
                                              // field.signer_id_receive ===
                                              //   activeSignerId &&
                                              field.type !== "signer_text" &&
                                              field.type !== "signer_date" &&
                                              field.type !==
                                                "signer_chooseImgDrivingL" &&
                                              field.type !==
                                                "signer_chooseImgPassportPhoto" &&
                                              field.type !==
                                                "signer_chooseImgStamp" &&
                                              field.type !==
                                                "signer_initials" &&
                                              field.type !==
                                                "signer_initials_text" &&
                                              field.type !==
                                                "signer_checkmark" &&
                                              field.type !== "signer_dropdown"
                                            ) {
                                              setHoveredStateDummyType(type);
                                              setType("");
                                              const canvasRect =
                                                canvasRefs.current[
                                                  page - 1
                                                ].getBoundingClientRect();
                                              const elementOffsetX =
                                                (e.clientX - canvasRect.left) /
                                                  scale -
                                                field.x;
                                              const elementOffsetY =
                                                (e.clientY - canvasRect.top) /
                                                  scale -
                                                field.y;

                                              setDragOffset({
                                                x: elementOffsetX,
                                                y: elementOffsetY,
                                              });
                                            } else {
                                            }
                                          }
                                        }}
                                        onDrag={async (e) => {
                                          if (signerControlsOption) {
                                            if (
                                              // field.signer_id_receive ===
                                              //   activeSignerId &&
                                              field.type !== "signer_text" &&
                                              field.type !== "signer_date" &&
                                              field.type !==
                                                "signer_chooseImgDrivingL" &&
                                              field.type !==
                                                "signer_chooseImgPassportPhoto" &&
                                              field.type !==
                                                "signer_chooseImgStamp" &&
                                              field.type !==
                                                "signer_initials" &&
                                              field.type !==
                                                "signer_initials_text" &&
                                              field.type !==
                                                "signer_checkmark" &&
                                              field.type !== "signer_dropdown"
                                            ) {
                                              // const page = e.target.id.split('-')[2];
                                              const canvasRect =
                                                canvasRefs.current[
                                                  page - 1
                                                ].getBoundingClientRect();

                                              // Adjust the position calculation using the initial offset
                                              const x =
                                                (e.clientX - canvasRect.left) /
                                                  scale -
                                                dragOffset.x;
                                              const y =
                                                (e.clientY - canvasRect.top) /
                                                  scale -
                                                dragOffset.y;

                                              const newSavedCanvasData = [
                                                ...textItems,
                                              ];
                                              newSavedCanvasData[index].x = x;
                                              newSavedCanvasData[index].y = y;
                                              setTextItems(newSavedCanvasData);
                                            } else {
                                            }
                                          }
                                          // Now you can use canvasRef to get the position relative to the current canvas
                                        }}
                                        onDragStop={(e, d) => {
                                          // let cumulativeHeight = 0;
                                          // for (let i = 0; i < page - 1; i++) {
                                          //   cumulativeHeight += canvasRefs.current[i].offsetHeight;
                                          // }

                                          setType(hoveredStateDummyType);
                                          setHoveredStateDummyType("");
                                        }}
                                        // onDragStop={(e, d) => {
                                        //   if (signerControlsOption) {
                                        //     if (field.signer_id_receive === activeSignerId) {
                                        //       const originalX = d.x;
                                        //       const originalY = d.y;
                                        //       handleUpdateField(field.id, field.type, originalX, originalY);
                                        //     } else {
                                        //     }
                                        //   }
                                        // }}
                                        onResizeStart={(
                                          e,
                                          direction,
                                          ref,
                                          delta,
                                          position
                                        ) => {
                                          // setIsResizing1(true);
                                          setHoveredStateDummyType(type);
                                          setType("");
                                        }}
                                        onResizeStop={async (
                                          e,
                                          direction,
                                          ref,
                                          delta,
                                          position
                                        ) => {
                                          if (signerControlsOption) {
                                            // if (
                                            //   field.signer_id_receive ===
                                            //   activeSignerId
                                            // ) {
                                            const width =
                                              parseInt(ref.style.width, 10) /
                                              scale;
                                            const height =
                                              parseInt(ref.style.height, 10) /
                                              scale;

                                            const newX = position.x / scale;
                                            const newY = position.y / scale;

                                            // Ensure that the new position does not go out of bounds
                                            const boundedX = Math.max(0, newX);
                                            const boundedY = Math.max(0, newY);

                                            await handleUpdateFieldResize(
                                              field.id,
                                              field.type,
                                              width,
                                              height,
                                              boundedX,
                                              boundedY
                                            );
                                            setType(hoveredStateDummyType);
                                            setHoveredStateDummyType("");
                                            // } else {
                                            // }
                                          }
                                        }}
                                        bounds="parent"
                                      >
                                        {!disableDraggingAndResizing.includes(
                                          field.type
                                        ) &&
                                          isResizing &&
                                          resizingIndex === index && (
                                            <>
                                              <ResizeCircle
                                                position={{
                                                  top: -10,
                                                  right: -10,
                                                }}
                                                onClick={() => {
                                                  setDeleteIndex(field.id);
                                                  setItemDeleteConfirmation(
                                                    true
                                                  );
                                                }}
                                                color="red"
                                                item="delete"
                                              />
                                              {field.type ===
                                                "my_signature" && (
                                                <ResizeCircle
                                                  position={{
                                                    top: -10,
                                                    right: 20,
                                                  }}
                                                  onClick={() => {
                                                    setEventDataOnClick({
                                                      x: field.x,
                                                      y: field.y,
                                                    });
                                                    setActivePage(field.bgImg);
                                                    setUpdatedSignatureIndex(
                                                      index
                                                    );
                                                    setSignatureModalUpdate(
                                                      true
                                                    );
                                                  }}
                                                  color="#23af23"
                                                  item="edit"
                                                >
                                                  <Edit2 size={15} />
                                                </ResizeCircle>
                                              )}
                                              {field.type === "my_initials" && (
                                                <ResizeCircle
                                                  position={{
                                                    top: -10,
                                                    right: 20,
                                                  }}
                                                  onClick={() => {
                                                    setEventDataOnClick({
                                                      x: field.x,
                                                      y: field.y,
                                                    });
                                                    setActivePage(field.bgImg);
                                                    setUpdatedSignatureIndex(
                                                      index
                                                    );
                                                    setInitialBox(true);
                                                    setSignatureModalUpdate(
                                                      true
                                                    );
                                                  }}
                                                  color="#23af23"
                                                  item="edit"
                                                >
                                                  <Edit2 size={15} />
                                                </ResizeCircle>
                                              )}
                                              {field.type === "stamp" && (
                                                <ResizeCircle
                                                  position={{
                                                    top: -10,
                                                    right: 15,
                                                  }}
                                                  onClick={() => {
                                                    setEventDataOnClick({
                                                      x: field.x,
                                                      y: field.y,
                                                    });
                                                    setActivePage(field.bgImg);
                                                    setUpdatedSignatureIndex(
                                                      index
                                                    );
                                                    const input =
                                                      document.createElement(
                                                        "input"
                                                      );
                                                    input.type = "file";
                                                    input.accept = "image/png";
                                                    input.onchange = (e) =>
                                                      handleUpdateImageChange(
                                                        e,
                                                        index
                                                      );
                                                    input.click();
                                                  }}
                                                  color="#23af23"
                                                  item="edit"
                                                >
                                                  <Edit2 size={15} />
                                                </ResizeCircle>
                                              )}
                                              {field.type !== "checkmark" &&
                                                field.type !==
                                                  "signer_checkmark" &&
                                                field.type !==
                                                  "signer_radio" && (
                                                  <>
                                                    <ResizeCircle
                                                      position={{
                                                        top: -5,
                                                        left: -5,
                                                      }}
                                                      color="white"
                                                      item="none"
                                                    />
                                                    <ResizeCircle
                                                      position={{
                                                        bottom: -5,
                                                        left: -5,
                                                      }}
                                                      color="white"
                                                      item="none"
                                                    />
                                                    <ResizeCircle
                                                      position={{
                                                        bottom: -5,
                                                        right: -5,
                                                      }}
                                                      color="white"
                                                      item="none"
                                                    />
                                                  </>
                                                )}
                                            </>
                                          )}
                                        {!disableDraggingAndResizing.includes(
                                          field.type
                                        ) &&
                                          hoveredStateDummyIndex === index && (
                                            // field.signer_id_receive ===
                                            //   activeSignerId &&
                                            <>
                                              <ResizeCircle
                                                position={{
                                                  top: -10,
                                                  right: -10,
                                                }}
                                                onClick={() => {
                                                  setDeleteIndex(field.id);
                                                  setItemDeleteConfirmation(
                                                    true
                                                  );
                                                }}
                                                color="red"
                                                item="delete"
                                              />
                                              {field.type ===
                                                "my_signature" && (
                                                <ResizeCircle
                                                  position={{
                                                    top: -10,
                                                    right: 20,
                                                  }}
                                                  onClick={() => {
                                                    setEventDataOnClick({
                                                      x: field.x,
                                                      y: field.y,
                                                    });
                                                    setActivePage(field.bgImg);
                                                    setUpdatedSignatureIndex(
                                                      index
                                                    );
                                                    setSignatureModalUpdate(
                                                      true
                                                    );
                                                  }}
                                                  color="#23af23"
                                                  item="edit"
                                                >
                                                  <Edit2 size={15} />
                                                </ResizeCircle>
                                              )}
                                              {field.type === "my_initials" && (
                                                <ResizeCircle
                                                  position={{
                                                    top: -10,
                                                    right: 20,
                                                  }}
                                                  onClick={() => {
                                                    setEventDataOnClick({
                                                      x: field.x,
                                                      y: field.y,
                                                    });
                                                    setActivePage(field.bgImg);
                                                    setUpdatedSignatureIndex(
                                                      index
                                                    );
                                                    setInitialBox(true);
                                                    setSignatureModalUpdate(
                                                      true
                                                    );
                                                  }}
                                                  color="#23af23"
                                                  item="edit"
                                                >
                                                  <Edit2 size={15} />
                                                </ResizeCircle>
                                              )}
                                              {field.type === "stamp" && (
                                                <ResizeCircle
                                                  position={{
                                                    top: -10,
                                                    right: 15,
                                                  }}
                                                  onClick={() => {
                                                    setEventDataOnClick({
                                                      x: field.x,
                                                      y: field.y,
                                                    });
                                                    setActivePage(field.bgImg);
                                                    setUpdatedSignatureIndex(
                                                      index
                                                    );
                                                    const input =
                                                      document.createElement(
                                                        "input"
                                                      );
                                                    input.type = "file";
                                                    input.accept = "image/png";
                                                    input.onchange = (e) =>
                                                      handleUpdateImageChange(
                                                        e,
                                                        index
                                                      );
                                                    input.click();
                                                  }}
                                                  color="#23af23"
                                                  item="edit"
                                                >
                                                  <Edit2 size={15} />
                                                </ResizeCircle>
                                              )}
                                              {field.type !== "checkmark" &&
                                                field.type !==
                                                  "signer_checkmark" &&
                                                field.type !==
                                                  "signer_radio" && (
                                                  <>
                                                    <ResizeCircle
                                                      position={{
                                                        top: -5,
                                                        left: -5,
                                                      }}
                                                      color="white"
                                                      item="none"
                                                    />
                                                    <ResizeCircle
                                                      position={{
                                                        bottom: -5,
                                                        left: -5,
                                                      }}
                                                      color="white"
                                                      item="none"
                                                    />
                                                    <ResizeCircle
                                                      position={{
                                                        bottom: -5,
                                                        right: -5,
                                                      }}
                                                      color="white"
                                                      item="none"
                                                    />
                                                  </>
                                                )}
                                            </>
                                          )}
                                        <ComponentForItemType
                                          // handleKeyPress={(e)=>handleKeyPress(e,index)}
                                          // SignerActivePosition={SignerActivePosition}
                                          SignersWhoHaveCompletedSigning={
                                            SignersWhoHaveCompletedSigning
                                          }
                                          RequiredActive={RequiredActive}
                                          signerFunctionalControls={
                                            signerControlsOption
                                          }
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
                                          handleSignatureAdd={() =>
                                            handleSignatureAdd(index, field)
                                          }
                                          setCallbackWidth={(width) =>
                                            handleChnageWidthInput(width, index)
                                          }
                                          IsSigner={true}
                                          signer_id={field.signer_id}
                                          signerObject={selectedSigner}
                                          activeSignerId={activeSignerId}
                                          zoomPercentage={scale}
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
                      {/* </div> */}

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
                    {/* start  */}
                    {isResizing === true &&
                    editedItem.type != "my_signature" &&
                    editedItem.type != "my_initials" &&
                    editedItem.type != "checkmark" &&
                    editedItem.type != "signer_checkmark" &&
                    editedItem.type != "signer_radio" &&
                    editedItem.type != "highlight" &&
                    editedItem.type != "stamp" &&
                    !disableDraggingAndResizing.includes(editedItem.type) ? (
                      <div style={{ position: "absolute", top: 5, right: 30 }}>
                        <X
                          size={15}
                          onClick={() => {
                            setIsResizing(false);
                            setSignerView(!signerView);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    ) : (
                      <div style={{ position: "absolute", top: 5, right: 25 }}>
                        <Menu
                          size={15}
                          onClick={() => setSignerView(!signerView)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    )}
                    {isResizing === true &&
                    editedItem.type != "my_signature" &&
                    // editedItem.type != 'signer_initials_text' &&
                    editedItem.type != "my_initials" &&
                    editedItem.type != "checkmark" &&
                    // editedItem.type != 'signer_checkmark' &&
                    // editedItem.type != 'signer_radio' &&

                    editedItem.type != "highlight" &&
                    editedItem.type != "stamp" &&
                    !disableDraggingAndResizing.includes(editedItem.type) ? (
                      <>
                        <ComponentRightSidebar
                          // stateMemory={handleStateMemory}
                          // dataSavedTextMemory={dtate}
                          editedItem={editedItem}
                          stateMemory={stateMemory}
                          resizingIndex={resizingIndex}
                          handleInputChanged={handleInputChanged}
                          handleInputRequired={handleInputRequired}
                          handleFontSizeChange={handleFontSizeChange}
                          handleFontFamChange={handleFontFamChange}
                          handleFontWeightChange={handleFontWeightChange}
                          handleFontStyleChange={handleFontStyleChange}
                          handleTextDecorationChange={
                            handleTextDecorationChange
                          }
                          handleDateChanged={handleDateChanged}
                          formatDateUSA={formatDateUSA}
                          formatDateInternational={formatDateInternational}
                          formatDateCustom={formatDateCustom}
                          handleDeleteCurrentPosition={
                            handleDeleteCurrentPosition
                          }
                          handleAddSelectOptions={handleAddSelectOptions}
                          handleFormatChange={handleFormatChange}
                          handleTooltipChanged={handleTooltipChanged}
                          handleCharacterLimitChange={
                            handleCharacterLimitChange
                          }
                        />
                      </>
                    ) : (
                      <>
                        {/* end  */}
                        {/* <div style={{ marginBottom: "10px" }}>
                              <label
                                htmlFor="jumpToPage"
                                style={{
                                  marginRight: "10px",
                                  fontSize: "14px",
                                }}
                              >
                                Jump to Page:{" "}
                              </label>
                              <select
                                id="jumpToPage"
                                value={activePage}
                                onChange={handleJumpToPage}
                                style={{ padding: "5px", fontSize: "14px" }}
                              >
                                {Array.from(
                                  { length: numPages },
                                  (_, i) => i + 1
                                ).map((page) => (
                                  <option
                                    key={page}
                                    value={page}
                                    style={{ fontSize: "14px" }}
                                  >
                                    {page}
                                  </option>
                                ))}
                              </select>
                            </div> */}
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
                            style={{ marginTop: "25px", padding: "20px" }}
                            // style={{
                            //   display: "flex",
                            //   justifyContent: "center",
                            //   width: "100%",
                            //   marginTop: "25px",
                            // }}
                          >
                            <Document
                              file={`${imageUrls}`}
                              onLoadSuccess={onDocumentLoadSuccess}
                              noData="No PDF loaded"
                            >
                              {/* {Array.from(
                            { length: numPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <>
                              <div
                                id={`full-page-${page}`}
                                key={page}
                                style={{
                                  border:
                                    pageNumber === page
                                
                                      : "1px solid lightGrey",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  if (pageNumber !== page) {
                                    e.target.style.border = "1px solid #c4c4c4";
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
                                  key={page}
                                  pageNumber={page}
                                  width={180}
                                  className={
                                    pageNumber === page ? "active-page" : ""
                                  }
                                  // onClick={() => handlePageClick(page)}
                                >
                                  
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
                            </>
                          ))} */}
                              {/* {Array.from(
                                { length: numPages },
                                (_, i) => i + 1
                              ).map((page) => { */}
                              {loadedPages.map((page) => {
                                const hasItems = hasTextItems(page); // Check if the page has textItems
                                return (
                                  <div
                                    // key={`thumbnail-${page}`}
                                    id={`thumbnail-page-${page}`}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      id={`full-page-${page}`}
                                      style={{
                                        position: "relative", // To position the indicator absolutely within this div
                                        border:
                                          pageNumber === page
                                            ? `1px solid ${primary_color}`
                                            : "1px solid lightGrey",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        width: "180px", // Match the thumbnail width
                                        height: "auto", // Let the height adjust based on content
                                      }}
                                      onMouseEnter={(e) => {
                                        if (pageNumber !== page) {
                                          e.currentTarget.style.border =
                                            "1px solid #c4c4c4";
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (pageNumber !== page) {
                                          e.currentTarget.style.border =
                                            "1px solid lightGrey";
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
                                          pageNumber === page
                                            ? "active-page"
                                            : ""
                                        }
                                      />
                                      {/* Render the indicator if the page has textItems */}
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
                                    </div>
                                    <h6
                                      style={{
                                        marginBlock: "10px",
                                        textAlign: "center",
                                      }}
                                    >
                                      Page {page}
                                    </h6>
                                  </div>
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
                      </>
                    )}
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        )}
      </>
      {/* Cropper  */}
      <ImageCropperModal
        cropSrc={cropSrc}
        isOpen={modalOpen1}
        toggle={toggleModal}
        onImageCropped={handleImageCropped}
      />
      <ImageCropperModalFreeForm
        cropSrc={cropSrc}
        isOpen={modalOpenUpdate}
        toggle={toggleModalUpdate}
        onImageCropped={handleImageCroppedUpdate}
      />
      <Modal
        isOpen={OpenEditorComp}
        toggle={() => setOpenEditorComp(!OpenEditorComp)}
        className="modal-dialog-centered modal-lg "
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!ContinueModal)}></ModalHeader> */}
        <ModalBody className=" pb-2 pt-1">
          {/* <div style={{
          display:"flex",
          justifyContent:"right"
        }}>
         
<X size={20} 
onClick={
  () => {
    setOpenEditorComp(!OpenEditorComp);
  }
}
style={{
  cursor:"pointer"
}}/>
        </div> */}
          <div>
            {isResizing === true ? (
              // editedItem.type != 'my_signature' &&
              // editedItem.type != 'signer_initials_text' &&
              // editedItem.type != 'my_initials' &&
              // editedItem.type != 'checkmark' &&
              // editedItem.type != 'signer_checkmark' &&
              // editedItem.type != 'signer_radio' &&

              // editedItem.type != 'highlight' &&
              // editedItem.type != 'stamp'
              <>
                <ComponentRightSidebarSS
                  // stateMemory={handleStateMemory}
                  // dataSavedTextMemory={dtate}
                  editedItem={editedItem}
                  stateMemory={stateMemory}
                  resizingIndex={resizingIndex}
                  handleInputChanged={handleInputChanged}
                  handleInputRequired={handleInputRequired}
                  handleFontSizeChange={handleFontSizeChange}
                  handleFontFamChange={handleFontFamChange}
                  handleFontWeightChange={handleFontWeightChange}
                  handleFontStyleChange={handleFontStyleChange}
                  handleTextDecorationChange={handleTextDecorationChange}
                  handleDateChanged={handleDateChanged}
                  formatDateUSA={formatDateUSA}
                  formatDateInternational={formatDateInternational}
                  formatDateCustom={formatDateCustom}
                  handleDeleteCurrentPosition={handleDeleteCurrentPosition}
                  handleAddSelectOptions={handleAddSelectOptions}
                  handleFormatChange={handleFormatChange}
                  handleTooltipChanged={handleTooltipChanged}
                  handleCharacterLimitChange={handleCharacterLimitChange}
                  saveButton={() => setOpenEditorComp(!OpenEditorComp)}
                />
              </>
            ) : null}
          </div>
        </ModalBody>
      </Modal>
      {/* signature modal  */}
      <Modal
        isOpen={SignatureModal}
        toggle={() => {
          // setType('');
          setSignatureModal(!SignatureModal);
        }}
        className={
          window.innerWidth < 736
            ? "modal-dialog-centered modal-lg "
            : "modal-dialog-centered modal-lg"
        }
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!SignatureModal)}></ModalHeader> */}
        <ModalBody className=" pb-5">
          <SignatureModalContent
            user_id_user={FileUserid}
            initialsBox={initialBox}
            modalClose={() => {
              // setType('');
              setSignatureModal(!SignatureModal);
            }}
            returnedSignature={placeImage}
            file_id={file_id}
            profile={true}
          />
        </ModalBody>
      </Modal>
      {/* Acces Code  modal  */}
      <Modal
        isOpen={AccessCodeModal}
        // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        className="modal-dialog-centered modal-md"
        // onClosed={() => setCardType('')}
      >
        <ModalHeader
          className="bg-transparent"
          // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <Row>
            {/* <Col xs={12} md={4}>
              <img
                src={compLogo}
                style={{
                  width: "200px",
                  height: "auto",
                }}
              />
            </Col> */}
            {modalErrorWaitingSignersOther ? (
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
                  ERROR
                </h1>
                <h1
                  className="form-label fw-bold"
                  style={{
                    color: "red",
                    marginTop: "20px",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                  for="login-email"
                >
                  You can't sign this document until other users have signed
                </h1>
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
                  textAlign: "justify",
                  // height: "90vh",
                  // padding: "4%",
                }}
              >
                <img
                  src={lock_icon}
                  style={{
                    width: "150px",
                    height: "auto",
                  }}
                />
                {/* <Lock size={70} style={{ marginBottom: "15px" }} /> */}
                <h1
                  className="fw-bold"
                  style={{
                    paddingTop: "3%",
                    textAlign: "center",
                    fontWeight: 900,
                    color: "#115fa7",
                  }}
                >
                  Access Code Required
                </h1>
                <h1
                  className="form-label fw-bold"
                  for="login-email"
                  style={{ fontSize: "16px", lineHeight: 1.5 }}
                >
                  Enter the code or contact the sender if unknown.
                </h1>
                {/* <h1 className="form-label fw-bold" for="login-email">
                  If you do not know the code, please contact sender
                </h1> */}
                <Input
                  style={{
                    marginTop: "20px",
                    fontSize: "16px",
                    boxShadow: "none",
                    // make placeholder center aligned
                    textAlign: "center",
                  }}
                  className={`form-control `}
                  placeholder="Enter Access Code"
                  type="text"
                  value={inputAccessCode}
                  onChange={(e) => setInputAccessCode(e.target.value)}
                  id="login-email"
                  autoFocus
                />
                <CustomButton
                  padding={true}
                  useDefaultColor={false}
                  style={{
                    boxShadow: "none",
                    display: "flex",
                    marginTop: "20px",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    //console.log('Access Code');
                    setIsSubmitting(true);
                    if (inputAccessCode === accessCodeSigner) {
                      //console.log('Access Code Matched');
                      if (
                        waitforOtherusers === true ||
                        waitforOtherusers === "true"
                      ) {
                        setModalErrorWaitingSignersOther(true);
                      } else {
                        setAccessCodeModal(!AccessCodeModal);
                      }
                      // setAccessCodeModal(!AccessCodeModal)
                      setIsSubmitting(false);
                      toastAlert("success", "Access Code Matched Successfully");

                      // setAccessCodeSigner(apiData.data.access_code)
                    } else {
                      setTimeout(() => {
                        setIsSubmitting(false);

                        toastAlert("error", "Invalid Access Code");
                      }, 500);
                    }
                  }}
                  color={compPrimaryColor}
                  disabled={isSubmitting}
                  size="sm"
                  text={
                    <>
                      {" "}
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
              </Col>
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
        isOpen={WaitOtherModal}
        // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        className="modal-dialog-centered modal-md"
        // onClosed={() => setCardType('')}
      >
        <ModalHeader
          className="bg-transparent"
          // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <Row>
            {/* <Col xs={12} md={4}>
              <img
                src={compLogo}
                style={{
                  width: "200px",
                  height: "auto",
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
              {allSigners.map((field, index) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {field.completed_status === true ||
                    field.completed_status === "true" ? (
                      <CheckCircle size={15} />
                    ) : (
                      <Circle size={15} />
                    )}
                    {/* <Circle size={15} /> */}

                    <h1
                      className="form-label "
                      style={{
                        color: "black",
                        textAlign: "center",
                        lineHeight: 1.5,
                        marginLeft: "10px",
                      }}
                    >
                      {field.email}
                    </h1>
                  </div>{" "}
                </>
              ))}
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
        // isOpen={false}
        isOpen={DocSignerStatusModal}
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
              {window.innerWidth < 736 ? (
                <>
                  <img
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
                    You have completed the Document earlier.
                  </h1>
                </>
              ) : (
                <>
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
                      width: '50px',
                      height: 'auto',
                    }}
                  /> */}
                  {/* <h1
                    className="form-label fw-bold"
                    style={{color: 'green', marginTop: '20px', textAlign: 'center', lineHeight: 1.5}}
                    for="login-email">
                    You have completed the Document earlier.
                  </h1> */}
                </>
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
      <Modal
        isOpen={DocSignerStatusModal1}
        // isOpen={true}
        // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        className="modal-dialog-centered modal-fullscreen"
        // onClosed={() => setCardType('')}
      >
        <ModalHeader
          className="bg-transparent"
          // toggle={() => setAccessCodeModal(!AccessCodeModal)}
        ></ModalHeader>
        <ModalBody
          style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: window.innerWidth,
            height: window.innerHeight,
            margin: 0,
            marginTop: -30,
            paddingTop: -50,
            padding: 0,
          }}
          //  className="px-sm-5 mx-50 pb-5"
        >
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
                  marginTop: "30px",
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
              {window.innerWidth < 736 ? (
                <>
                  <img
                    src={successCompletedDoc}
                    style={{
                      width: "50px",
                      height: "auto",
                    }}
                  />
                  <h1
                    className="fw-bold"
                    style={{
                      paddingTop: "3%",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",

                      textAlign: "center",
                      fontWeight: 900,
                      // color: "#115fa7",
                      color: "white",
                    }}
                  >
                    SUCCESS
                  </h1>
                  <h1
                    className="form-label fw-bold"
                    style={{
                      color: "green",
                      marginTop: "20px",
                      textAlign: "center",
                      color: "white",
                      lineHeight: 1.5,
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                    for="login-email"
                  >
                    Your document has been sent successfully.
                  </h1>
                </>
              ) : (
                <>
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
                      letterSpacing: "0.5px",
                      textAlign: "center",
                      lineHeight: 1.5,

                      color: "white",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                      fontSize: "16px",
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
                    color="primary"
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
                </>
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

      <Modal
        isOpen={SignatureModalUpdate}
        toggle={() => setSignatureModalUpdate(!SignatureModalUpdate)}
        className={
          window.innerWidth < 736
            ? "modal-dialog-centered modal-lg modal-fullscreen"
            : "modal-dialog-centered modal-lg"
        }
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!SignatureModal)}></ModalHeader> */}
        <ModalBody className=" pb-5">
          <SignatureModalContent
            user_id_user={FileUserid}
            modalClose={() => {
              setSignatureModalUpdate(!SignatureModalUpdate);
            }}
            initialsBox={initialBox}
            profile={true}
            returnedSignature={placeImageUpdate}
            file_id={file_id}
          />
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
        text="Are you sure you would like to send now?"
      />
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteItemFromCanvas}
        alertStatusDelete={"delete"}
        text="Are you sure you want to remove this item?"
      />
    </>
  );
};

export default ReceivedESignDoc;
