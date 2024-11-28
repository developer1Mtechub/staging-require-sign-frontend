import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  ModalBody,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
  ListGroup,
  Label,
} from "reactstrap";
import {
  ArrowLeft,
  Clock,
  Copy,
  Edit2,
  Lock,
  Menu,
  MoreVertical,
  Plus,
  Send,
  Trash2,
  Unlock,
  X,
  XCircle,
} from "react-feather";
import ForOthers from "../components/ForOthers";
import { handlePlacePosition } from "../utility/EditorUtils/PlacePositions";
import toastAlert from "@components/toastAlert";
import Repeater from "@components/repeater";
import { SlideDown } from "react-slidedown";
import {
  formatDateCustom,
  formatDateCustomTimelastActivity,
  formatDateInternational,
  formatDateUSA,
  getColorByIndex,
  handleDownloadPDFHereTemp,
  // handleDownloadPDFHereTemp,
} from "../utility/Utils";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import "react-resizable/css/styles.css";
import SignatureModalContent from "../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent";
import emptyImage from "@assets/images/pages/empty.png";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import SidebarTypes from "./SidebarTypes";
import { BASE_URL, post, postFormData } from "../apis/api";
import ComponentForItemType from "../utility/EditorUtils/EditorTypesPosition.js/ComponentForItemType";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// usama import
import { Rnd } from "react-rnd";
import ComponentRightSidebar from "../utility/EditorUtils/EditorTypesPosition.js/ComponentRightSidebar";
import ResizeCircle from "../utility/EditorUtils/EditorTypesPosition.js/ResizeCircle";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomButton from "../components/ButtonCustom";
import ImageCropperModal from "../components/ImageCropperModal";
import getActivityLogUserTemp from "../utility/IpLocation/MaintainActivityLogTemplate";
import { useTranslation } from "react-i18next";
import {
  getUser,
  selectLoading,
  selectLogo,
  selectPrimaryColor,
} from "../redux/navbar";
import { decrypt } from "../utility/auth-token";
import { useDispatch } from "react-redux";
import DropdownCustom from "../components/DropdownCustom";
import getActivityLogUserTempResp from "../utility/IpLocation/MaintainActivityLogTemplateResponse";
import OverLayFullScreen from "../components/OverLayFullScreen";

const TemplateDocN = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const primary_color = useSelector(selectPrimaryColor);

  const { user, plan, status, error } = useSelector((state) => state.navbar);
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const openValue = params.get("open");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [canvasWidth, setCanvasWidth] = useState("100%");
  // states
  const [link, setLink] = useState(null);

  const [imageUrls, setImageUrls] = useState([]);
  const file_id = window.location.pathname.split("/")[2];
  const [savedCanvasData, setSavedCanvasData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [type, setType] = useState("");
  const [eventDataOnClick, setEventDataOnClick] = useState([]);
  const [selectedSigner, setSelectedSigner] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);

  const [sendToEsign, setSendToEsign] = useState(false);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState("");
  const [loadingDelete, setloadingDelete] = useState(false);
  const [active, setActive] = useState("2");
  const [signerAddEdit, setSignerAddEdit] = useState(false);
  const [count, setCount] = useState(1);
  const [signerFunctionalControls, setSignerFunctionalControls] =
    useState(false);
  const [securedShare, setSecuredShare] = useState(false);
  const [EsignOrder, setSetEsignOrder] = useState(false);
  const [RecipientsData, setRecipientsData] = useState([]);
  const [emailMessage, setEmailMessage] = useState(
    "Please review and e-sign the document at your earliest convenience. Thank you!"
  );
  const [emailSubject, setEmailSubject] = useState("Request for Signature");
  const [inputValue, setInputValue] = useState(null);
  const [signersData, setSignersData] = useState([]);
  const [signersData1, setSignersData1] = useState([]);
  const [DelteSelectedId, setDelteSelectedId] = useState("");
  const [deleteSignerLoader, setDeleteSignerLoader] = useState(false);
  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(result);
    if (!destination) return; // If dropped outside the list, do nothing

    const reorderedSigners = Array.from(signersData);
    const [removed] = reorderedSigners.splice(source.index, 1); // Remove from the source index
    reorderedSigners.splice(destination.index, 0, removed); // Insert at the destination index

    // Update the order_id based on the new order
    const updatedArray = reorderedSigners.map((item, index) => ({
      ...item,
      order_id: index + 1, // Adjust order_id
    }));
    console.log(updatedArray);

    setSignersData(updatedArray); // Update state
    // AddSignersData()
  };
  const DeleteSigner = async (signer, index) => {
    //console.log(signer);
    setDeleteSignerLoader(true);
    const postData = {
      signer_id: signer,
    };
    try {
      const apiData = await post("file/delete-signer", postData); // Specify the endpoint you want to call
      //console.log('Delete signer  ');
      //console.log(apiData);
      if (apiData.error) {
        setDeleteSignerLoader(false);
      } else {
        const newSignersData = [...signersData];
        newSignersData.splice(index, 1);
        //console.log(newSignersData);
        await fetchSignerData();
        setSignersData(newSignersData);
        //console.log(newSignersData);
        setInputErrors([]);
        setCount(count - 1);
        setDeleteSignerLoader(false);
        // setSignerAddEdit(false);
        toastAlert("success", "Signer Deleted Successfully");
      }
    } catch (error) {
      setDeleteSignerLoader(false);
      //console.log('Error fetching data:', error);
    }
  };
  const DeletetextItemsData = async () => {
    setloadingDelete(true);
    // Assuming idSignerFieldsRemove holds the signer_id to remove
    const updatedTextItems = textItems.filter(
      (item) => item.signer_id !== idSignerFieldsRemove
    );

    // Update the textItems state with the filtered array
    setTextItems(updatedTextItems);
    setDelteSelectedId(idSignerFieldsRemove);
    setItemDeleteConfirmation12(false);
    await DeleteSigner(idSignerFieldsRemove, IndexRemoveSigner);
    // Optionally, reset the loading state or perform further actions here
    setloadingDelete(false);
  };
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [stepper, setStepper] = useState(null);
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
  const colRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [indexDataOnClick, setIndexDataOnClick] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [onlySigner, setOnlySigner] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const elementRefCursor = useRef(null);
  const [activePage, setActivePage] = useState(1);
  const [resizingIndex, setResizingIndex] = useState(null);
  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const defaultFontSize = 12;
  const defaultFontFamily = "Helvetica";
  const defaultFontWeight = 400;
  const defaultFontStyle = "normal";

  const defaultTextDecoration = "none";
  const RequiredField = true;

  const [stateMemory, setStateMemory] = useState({
    fontSize: defaultFontSize,
    fontFamily: defaultFontFamily,
    fontWeight: defaultFontWeight,
    fontStyle: defaultFontStyle,
    textDecoration: defaultTextDecoration,
    required: RequiredField,
  });

  const [fields, setFields] = useState([]);
  const [appendEnable, setAppendEnable] = useState(false);

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
  const handleUpdateFieldResize = (id, type, width, height, x, y) => {
    //console.log(id);
    //console.log('height');

    //console.log(width);
    //console.log(height);

    // setFields(
    // setTextItems([...textItems, resultingData]);
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
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };
  const [emailError, setEmailError] = useState("");
  const [addFolderLoader, setAddFolderLoader] = useState(false);

  const [cropSrc, setCropSrc] = useState(null);
  const [itemDeleteConfirmation12, setItemDeleteConfirmation12] =
    useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
  const toggleModal = () => setModalOpen1(!modalOpen1);
  const toggleModalUpdate = () => setModalOpenUpdate(!modalOpenUpdate);
  const handleImageCropped = async (croppedFile) => {
    console.log("Cropped File:", croppedFile);
    const postData = {
      image: croppedFile,
      user_id: user?.user_id,
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
        "null",
        "null",
        "null",
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
  const [firstPart, setFirstPart] = useState("");
  const [checkboxes, setCheckboxes] = useState(false); // Initialize checkbox state
  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const updatedCheckboxes = event.target.checked;
    setCheckboxes(updatedCheckboxes);

    if (updatedCheckboxes === true) {
      const usedColors = signersData.map((signer) => signer.color);
      const availableColors = [
        ...new Set([...Array(8).keys()].map((i) => getColorByIndex(i))),
      ].filter((color) => !usedColors.includes(color));

      const color_code =
        availableColors.length > 0
          ? availableColors[0]
          : getColorByIndex(count);
      setSignersData([
        ...signersData,
        {
          signer_id: signersData.length + 1,
          order_id: signersData.length + 1,
          name: user?.first_name || `Signer ${signersData.length + 1}`,
          placeholder: `Signer ${signersData.length + 1}`,
          email: user?.email || "",
          color: color_code,
        },
      ]);
      setCount(signersData.length + 1);
    }
  };
  const handleImageCroppedUpdate = async (croppedFile) => {
    console.log("Cropped File:", croppedFile);
    const postData = {
      image: croppedFile,
      user_id: user?.user_id,
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
      setResizingIndex(UpdatedSignatureIndex);
      setIsResizing(true);
      //console.log('UpdatedSignatureIndex');

      //console.log(index);
      setEditedItem(textItems[UpdatedSignatureIndex]);
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[UpdatedSignatureIndex].url = url;
      setTextItems(newSavedCanvasData);
      // let resultingData =await handlePlacePosition(eventDataOnClick, type, activePage, url,"null","null","null","null","null",pageNumber);
      // console.log(resultingData);

      // setTextItems([...textItems, resultingData]);

      // setType('');
    }
    // Handle the cropped image file (e.g., upload to server or display in UI)
  };
  const [initialBox, setInitialBox] = useState(false);
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
  const handleImageChangeDummyEdit = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result);
        setModalOpenUpdate(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCanvasClick = (e, page_no) => {
    console.log(e);
    if (appendEnable == true) {
      // Get the position of the click relative to the canvas
      // const canvasRect = canvasRef.current.getBoundingClientRect();
      // const x = e.clientX - canvasRect.left;
      // const y = e.clientY - canvasRect.top;
      let clickedPageNumber = page_no;
      setPageNumber(page_no);

      // handleAddField(x, y);
      // ,y cose
      const canvasRect = canvasRefs.current[page_no - 1];
      const canvas = canvasRect.current;
      const rect = canvasRect.getBoundingClientRect();
      // const x = e.clientX - rect.left;
      // const y = e.clientY - rect.top;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      console.log("x", x);
      console.log("y", y);

      const zoomLevel = parseFloat(document.body.style.zoom) / 100 || 1;
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
        input.accept = "image/png";
        // input.onchange = e => handleImageChange(e, arrayObj, type);
        input.onchange = (e) =>
          handleImageChangeDummy(e, arrayObj, type, page_no);

        input.click();
      } else {
        if (active === "2") {
          //   if (
          //     selectedSigner === null ||
          //     selectedSigner === undefined ||
          //     selectedSigner === '' ||
          //     selectedSigner.length === 0
          //   ) {
          //     toastAlert('error', 'Please Select Signer');
          //   } else {
          //console.log('selectedSigner');
          //console.log(selectedSigner);

          let resultingData = handlePlacePosition(
            arrayObj,
            type,
            activePage,
            selectedSigner.color,
            "null",
            selectedSigner.signer_id,
            stateMemory,
            "null",
            "null",
            clickedPageNumber,
            scale
          );

          //console.log(resultingData);
          setTextItems([...textItems, resultingData]);
          setEditedItem(resultingData);
          setResizingIndex(textItems.length);
          setIsResizing(true);
          // setEditStateTextTopbar(false)
          // setType('');
          //   }
        } else {
          let resultingData = handlePlacePosition(
            arrayObj,
            type,
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
          setTextItems([...textItems, resultingData]);

          // setTextItems([...textItems, { x, y, page: pageNumber, text: "TEXT" }]);
          // setClickPosition({ x, y });
          setClickPosition({ x: x, y: y });

          // setType('');
        }
      }
    }
  };

  // items list append end
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
    // const fullPageElement = document.getElementById(`full-page-${page}`);
    // if (fullPageElement) {
    //   fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    // }
    // // Scroll the main Col element to the clicked page
    // const canvasPageElement = canvasRefs.current[page - 1];
    // if (canvasPageElement && colRef.current) {
    //   const colScrollTop = colRef.current.scrollTop;
    //   const colOffsetTop = colRef.current.getBoundingClientRect().top;
    //   const elementOffsetTop = canvasPageElement.getBoundingClientRect().top;
    //   const scrollToPosition = colScrollTop + elementOffsetTop - colOffsetTop;

    //   colRef.current.scrollTo({ top: scrollToPosition, behavior: "smooth" });
    // }
  };
  // const handlePageClick = (page) => {
  //   // setIsLoadingDoc(true);
  //   // setTimeout(() => {
  //   setPageNumber(page);

  //   // setActivePage(page);
  //   // const pageElement = document.getElementById(`page-${page}`);
  //   // if (pageElement) {
  //   //   pageElement.scrollIntoView({behavior: 'smooth', block: 'start'});
  //   // }
  //   // setActivePage(pageNumber);

  //   // Find the corresponding full-page view element
  //   const fullPageElement = document.getElementById(`full-page-${page}`);

  //   // Scroll the full-page view to the clicked page
  //   if (fullPageElement) {
  //     fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  //   // setIsLoadingDoc(false);
  //   // }, 1000);
  // };
  // Define the dropdownOpen state

  const [modalOpenDropdown, setModalOpenDropdown] = useState(false);
  // start
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const fetchData = async (fileId) => {
    // get Images from db
    const postData = {
      bulk_link_id: fileId,
    };
    const apiData = await post("file/getbgImagesByFileId", postData); // Specify the endpoint you want to call
    console.log("apixxsData");

    console.log(apiData);
    if (apiData.error) {
    } else {
      setImageUrls(apiData.result[0].file_url_completed);
    }
  };
  // fetch positions
  const fetchDataPositions = async (fileId) => {
    //console.log(fileId)
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
    } else {
      console.log("positions");
      console.log(apiData.result);

      setTextItems(apiData.result[0].position_array);
    }
  };

  // stepper

  const increaseCount = () => {
    // Check if all fields are filled
    if (signersData.some((signer) => !signer.name)) {
      alert("Please fill all fields.");
      return;
    }

    // Check if there are any input errors
    // if (inputErrors.some((error) => error)) {
    //   alert("Please fix the errors.");
    //   return;
    // }
    // push empty object to signers array
    // const color_code = getColorByIndex(count);
    // let color_rgb=`rgb(${color_code}/78%)`

    // 'rgb(255 214 91 / 78%)'
    // //console.log(color_code);
    if (count === 8) {
      //console.log('Max Size Signer Filled');
      // toastAlert("error","Maximum 8 Signers Allowed!")
    } else {
      const usedColors = signersData.map((signer) => signer.color);
      const availableColors = [
        ...new Set([...Array(8).keys()].map((i) => getColorByIndex(i))),
      ].filter((color) => !usedColors.includes(color));

      // If no available colors, fallback to any color (should not happen with max 8 signers)
      const color_code =
        availableColors.length > 0
          ? availableColors[0]
          : getColorByIndex(count);
      // generate random id 4 digit
      // Add new signer with unique color
      setSignersData([
        ...signersData,
        {
          order_id: signersData.length + 1,
          name: "",
          placeholder: `Signer ${signersData.length + 1}`,
          email: "",
          color: color_code,
        },
      ]);
      setCount(count + 1);
      // setSignersData([...signersData, {order_id: signersData.length + 1, name: '', email: '', color: color_code}]);
      // setCount(count + 1);
    }
  };

  const [signerView, setSignerView] = useState(false);
  const handleImageChange = async (e, arrayObj, typeds) => {
    const files = e.target.files[0];
    // upload image
    const postData = {
      image: files,
      user_id: user?.user_id,
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
      //console.log(arrayObj);
      //console.log(activePage);
      let resultingData = handlePlacePosition(
        arrayObj,
        type,
        activePage,
        url,
        "null",
        "null",
        "null",
        "null",
        "null",
        pageNumber
      );
      //console.log(resultingData);
      setTextItems([...textItems, resultingData]);
      setResizingIndex(textItems.length);
      setIsResizing(true);
      setType("");
    }
  };
  const handleUpdateImageChange = async (e, index) => {
    const files = e.target.files[0];
    // upload image
    const postData = {
      image: files,
      user_id: user?.user_id,
    };
    const apiData = await postFormData(postData); // Specify the endpoint you want to call
    // //console.log(apiData)
    if (
      apiData.public_url === null ||
      apiData.public_url === undefined ||
      apiData.public_url === ""
    ) {
      // toastAlert("error", "Error uploading Files")
    } else {
      // toastAlert("success", "Successfully Upload Files")
      //console.log('result');
      //console.log(apiData.public_url);

      const url = apiData.public_url;
      //console.log(activePage);
      setResizingIndex(index);
      setIsResizing(true);
      setEditedItem(textItems[index]);
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[index].url = url;
      setTextItems(newSavedCanvasData);
      setType("");
    }
  };

  const placeImage = async (url, prevSign, typeSign) => {
    //console.log(url);
    //console.log(prevSign);
    //console.log(typeSign);

    if (prevSign === "prevSign") {
      setSignatureModal(false);
      //console.log('url');
      //console.log(url);
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

      setTextItems([...textItems, resultingData]);
      setType("");
    } else {
      if (typeSign === "initials") {
        setSignatureModal(false);
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
        // setSavedCanvasData([...savedCanvasData, resultingData])
        setTextItems([...textItems, resultingData]);
        setType("");
      } else {
        // call api to save previous user signatures
        //console.log('sdgfdfshjdfdf');
        //console.log(url);

        const user_id = user?.user_id;
        //console.log(user_id);

        const postData = {
          user_id: user_id,
          signature_image_url: url,
          type: typeSign,
        };
        const apiData = await post("user/AddUserSignaturesToDb", postData); // Specify the endpoint you want to call
        //console.log(apiData);
        if (
          apiData.error === true ||
          apiData.error === undefined ||
          apiData.error === "true"
        ) {
          toastAlert("error", "Error uploading Files");
        } else {
          setSignatureModal(false);
          //console.log('url');
          //console.log(url);
          //console.log('lines');
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
          // setSavedCanvasData([...savedCanvasData, resultingData])
          setTextItems([...textItems, resultingData]);
          setType("");
        }
      }
      // end Call
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
      // call api to save previous user signatures
      //console.log('sdgfdfshjdfdf');
      //console.log(url);

      const user_id = user?.user_id;
      //console.log(user_id);

      const postData = {
        user_id: user_id,
        signature_image_url: url,
        type: typeSign,
      };
      const apiData = await post("user/AddUserSignaturesToDb", postData); // Specify the endpoint you want to call
      //console.log(apiData);
      if (
        apiData.error === true ||
        apiData.error === undefined ||
        apiData.error === "true"
      ) {
        toastAlert("error", "Error uploading Files");
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
      }
    }
  };

  const saveData = async () => {
    setsaveLoading(true);
    const location = await getUserLocation();
    const user_email_d = user?.email;
    //console.log(savedCanvasData);
    const postData = {
      template_id: file_id,
      // position_array: savedCanvasData
      position_array: textItems,
      file_name: fileName,
      email: user_email_d,
      location_country: location?.country,
      ip_address: location?.ip,
      location_date: location?.date,
      timezone: location?.timezone,
    };
    try {
      const apiData = await post(
        "template/saveCanvasDataWithtemplateId",
        postData
      ); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');

      //console.log(apiData);
      if (apiData.error) {
        setsaveLoading(false);
        setSaveSuccess(false);
      } else {
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "TEMPLATE-COMPLETED",
          description: `${email} Completed Editing Template ${fileName}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
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
  const handleChnageWidthInput = (width, index) => {
    const newSavedCanvasData = [...textItems];
    console.log("widthsfsdf");

    console.log(width);
    newSavedCanvasData[index].width = parseFloat(width) / scale;
    setTextItems(newSavedCanvasData);
    // setEditedItem((prevState) => ({
    //   ...prevState,
    //   // text: newText,
    //   width: width,
    // }));
  };
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
  const handleDateChanged = (event, index) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = new Date(event.target.value);
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      text: new Date(event.target.value),
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
  const handleCharacterLimitChange = (event, index) => {
    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].characterLimit = event.target.value;
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      characterLimit: event.target.value,
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
  const handleInputChecked = (event, index) => {
    setIsResizing(false);
    let inputValueText = event.target.checked;
    //console.log(inputValueText);

    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = event.target.checked;
    setTextItems(newSavedCanvasData);
  };
  const handleInputChangedDate = (event, index) => {
    setIsResizing(false);
    let inputValueText = event;
    //console.log(inputValueText);

    const newSavedCanvasData = [...textItems];
    newSavedCanvasData[index].text = event;
    setTextItems(newSavedCanvasData);
  };
  const handleWidthChanged = (width, index) => {
    setTextItems(
      textItems.map((field, idx) => {
        if (idx === index && field.width <= width) {
          return { ...field, width };
        }
        return field;
      })
    );
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

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const getTypeListItem = (type) => {
    setAppendEnable(true);
    // saveData();
    //console.log('Type');
    //console.log(type);
    if (type === "signer") {
      setSignerAddEdit(true);
    } else {
      setType(type);
      setIsEditing(true);
      setEditingIndex(savedCanvasData.length);
      //console.log(savedCanvasData.length);
    }
  };
  const handleDeleteCurrentPosition = (id) => {
    setDeleteIndex(id);
    setItemDeleteConfirmation(true);
  };
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
  const fetchSignerData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post("template/getAllSignersByFileId", postData); // Specify the endpoint you want to call
      console.log("Signers ");

      console.log(apiData);
      if (apiData.error) {
        setSignersData([]);
      } else {
        setSignersData(apiData.result);
        // setSelectedSigner(apiData.result[0]);
        setSelectedSigner(apiData.result[apiData.result.length - 1]);

        setCount(apiData.result.length);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const handleButtonClick = () => {
    setIsInputVisible(true);
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
  const handleInputChange1 = (id, event) => {
    // const { name, value } = event.target;
    // const newSignersData = [...signersData1];
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const newInputErrors = [...inputErrors];
    // // Check if the email is already present in the array
    // if (!emailRegex.test(value)) {
    //   newInputErrors[i] = "Please enter a valid email address.";
    // } else {
    //   newInputErrors[i] = "";
    // }

    // newSignersData[i][name] = value;
    // setSignersData1(newSignersData);

    // setInputErrors(newInputErrors);
    const { name, value } = event.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Create new arrays for updating signers data and input errors
    const newSignersData = [...signersData];
    const newInputErrors = [...inputErrors];

    // Find the index of the signer with the matching id
    const signerIndex = newSignersData.findIndex(
      (signer) => signer.signer_id === id
    );

    // Validate email if the field is "email"
    if (name === "email" && !emailRegex.test(value)) {
      newInputErrors[signerIndex] = "Please enter a valid email address.";
    } else {
      newInputErrors[signerIndex] = "";
    }

    // Update the signer's data
    newSignersData[signerIndex][name] = value;

    // Update state with new data
    setSignersData(newSignersData);
    setInputErrors(newInputErrors);
  };
  const handleInputChange = (i, event) => {
    const { name, value } = event.target;
    const newSignersData = [...signersData];

    const newInputErrors = [...inputErrors];
    // Check if the email is already present in the array
    // if (
    //   name === "email" &&
    //   signersData.some((signer, index) => signer.email === value && index !== i)
    // ) {
    //   newInputErrors[i] = "This email is already in use.";
    // } else {
    newInputErrors[i] = "";
    // } /

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
      RecipientsData.some(
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
    //console.log(signersData);
    //console.log(file_id);
    let errors = [];

    // Loop through signersData to check if any signer name is empty
    signersData.forEach((signer, index) => {
      if (!signer.name || signer.name.trim() === "") {
        errors[index] = "Please fill in the signer's name.";
      } else {
        errors[index] = ""; // Reset error if the field is filled
      }
    });
    setInputErrors(errors);
    // Check if there are no errors before proceeding
    if (errors.every((error) => error === "")) {
      setLoadingSignersSave(true);

      // Call your save function here (e.g., API call to save signers)
      console.log("All data is valid, proceeding to save...");
      const postData = {
        file_id: file_id,
        signers: signersData,
      };
      try {
        console.log("signersData");
        console.log(signersData);

        const apiData = await post("template/add-signer", postData); // Specify the endpoint you want to call
        console.log("Signers ");

        console.log(apiData);
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
    } else {
      console.log("Please fill in all required fields.");
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
  const [idSignerFieldsRemove, setIdSignerFieldsRemove] = useState("");

  const [IndexRemoveSigner, setIndexRemoveSigner] = useState(null);
  const deleteForm = async (index) => {
    const signerId = signersData[index]?.signer_id;
    console.log(signersData[index]);
    console.log("textItems:", textItems);
    console.log("signerId:", signerId);
    if (signerId === undefined || signerId === null) {
      console.log("null");
      const newSignersData = [...signersData];
      newSignersData.splice(index, 1);
      setSignersData(newSignersData);
      setInputErrors([]);
      setCount(count - 1);
      return;
    }

    // Check if any text items are associated with the signer's ID
    const hasAssociatedTextItems = textItems.some((item) => {
      console.log("Checking item:", item);
      return item.signer_id === signerId;
    });
    // Check if any text items are associated with the signer's ID
    // const hasAssociatedTextItems = textItems.some(item => item.signer_id === signerId);
    console.log(hasAssociatedTextItems);
    if (hasAssociatedTextItems) {
      setIdSignerFieldsRemove(signerId);
      setItemDeleteConfirmation12(true);
      setIndexRemoveSigner(index);

      // alert('This signer cannot be deleted because there are associated text items.');
      return;
    }
    setDelteSelectedId(signerId);
    await DeleteSigner(signerId, index);
  };
  const [uniq_id, setUniq_Id] = useState("");
  const [hoveredStateDummyType, setHoveredStateDummyType] = useState("");
  const [hoveredStateDummyIndex, setHoveredStateDummyIndex] = useState("");

  // Fetch File
  const [created_at_doc, setCreated_at_doc] = useState("");
  const [urlshare, seturlShare] = useState("");
  const fetchFileData = async (fileId) => {
    // get Images from db
    const postData = {
      template_id: fileId,
      user_id: user?.user_id,
    };
    const apiData = await post("template/viewTemplateForEditor", postData); // Specify the endpoint you want to call
    console.log("File Dta Fetch");

    console.log(apiData);
    if (apiData.error) {
      window.location.href = "/error";
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      setFileName(apiData.result.file_name || "");
      const doc_completed = apiData.result.file_url_completed;
      if (
        doc_completed === null ||
        doc_completed === undefined ||
        doc_completed === ""
      ) {
        setImageUrls(apiData.result.file_url);
        setEditingTemp(true);
      } else {
        setEditingTemp(false);

        setImageUrls(apiData.result.file_url_completed);
      }
      setEmailMessage(
        apiData.result.email_message ||
          " Please review and e-sign the document at your earliest convenience. Thank you!"
      );
      setEmailSubject(apiData.result.email_subject || "Request for Signature");
      setCreated_at_doc(apiData.result.created_at_doc);
      setLink(apiData.result.url);
      setUniq_Id(apiData.result.uniq_id);
      setSignersData(apiData.signers);
      setSignersData1(apiData.signers);

      setSelectedSigner(apiData.signers[0]);
      // end
      //   setInputValue(apiData.result.name || '');
      //console.log('dfdf');
      //   //console.log(apiData.result.only_signer);
      //   setOnlySigner(apiData.result.only_signer || false);
      //   setEmailMessage(apiData.result.email_message || '');
      //   setEmailSubject(apiData.result.name);
      //   setSecuredShare(apiData.result.secured_share || false);
      //   setSignerFunctionalControls(apiData.result.signer_functional_controls || false);
      //   setSetEsignOrder(apiData.result.esign_order || false);
      //   setStatusFile(apiData.result.status || '');
    }
  };

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
        <MoreVertical size={15} id="DragItem" />
      </>
    );
  });

  const [sendTemplate, setSendTemplate] = useState(false);

  const [isOpenCanvas, setIsOpenCanvas] = useState(false);
  const [isOpenCanvasPages, setIsOpenCanvasPages] = useState(false);

  // end
  const canvasRefs = useRef([]);

  const [isLoaded, setIsLoaded] = useState(true);
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

  const [editingTemp, setEditingTemp] = useState(true);
  const zoomOptions = [0.5, 0.75, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%
  // start
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
    // setTimeout(() => {
      const canvasPageElement = canvasRefs.current[selectedPage - 1];
      if (canvasPageElement && colRef.current) {
        const colScrollTop = colRef.current.scrollTop;
        const colOffsetTop = colRef.current.getBoundingClientRect().top;
        const elementOffsetTop = canvasPageElement.getBoundingClientRect().top;
        const scrollToPosition = colScrollTop + elementOffsetTop - colOffsetTop;

        colRef.current.scrollTo({ top: scrollToPosition, behavior: "smooth" });
      }
    // }, 1000);
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

  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            fetchFileData(file_id),
            fetchDataPositions(file_id),
          ]);
          if (openValue === "true1") {
            setSendTemplate(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoaded(false);
          setTimeout(() => {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.delete("open"); // Remove the "open" param
            window.history.replaceState({}, "", currentUrl.toString());
          }, 3000);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, status]);
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setIsLoaded(false);
  //   }, 3000);

  //   // Cleanup function to clear the timeout in case component unmounts before 1 second
  //   return () => clearTimeout(timeoutId);
  // }, []); // Empty dependency array to run effect only once
  useEffect(() => {
    const encryptedData = localStorage.getItem("user_data");
    console.log("encryptedData");

    console.log(encryptedData);
    if (encryptedData) {
      try {
        const decryptedData = JSON.parse(decrypt(encryptedData));
        const { token, user_id } = decryptedData;
        console.log(decryptedData);

        // Fetch user data if not already available in Redux state
        if (token && user_id && !user) {
          dispatch(getUser({ user_id, token }));
        }
      } catch (error) {
        console.error("Error processing token data:", error);
      }
    }
  }, [dispatch, user]);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    const pagesArray = Array.from(
      { length: numPages },
      (_, index) => index + 1
    );

    // console.log(pagesArray);
    if (numPages < 5) {
      setLoadedPages(pagesArray);
      setEndPage(numPages);
    } else {
      setLoadedPages([1, 2, 3, 4, 5]);
      setEndPage(5);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadLoader(true);

    const response = await fetch(`${imageUrls}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadLoader(false);
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
  const handleDoubleClick = (index, item) => {
    setResizingIndex(index);
    setEditedItem(item);
    setIsResizing(true);
    //console.log('double click ');
  };

  const [editedItem, setEditedItem] = useState();
  // get audit log
  const getFunctionTemplateAuditLog = async () => {
    // setImageUrls(apiData.result[0].image);
    // setLoaderResponseFetch1(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      template_id: file_id,
    };
    const apiData = await post("template/viewTemplateAuditLog", postData); // Specify the endpoint you want to call
    console.log("File Template Fetch Log");

    console.log(apiData);
    // if (apiData.error) {
    //   // toastAlert("error", "No File exist")
    // } else {
    return apiData?.response_data;
    //   // setResponsesTemp(apiData.response_data);
    //   // setSendTemplateResponses1(true);
    //   // setLoaderResponseFetch1(false);
    // }
  };

  const saveDataSigning = async (filteredTextItems) => {
    // setUnsavedChanges(false);
    console.log("file_id");

    console.log(file_id);
    setsaveLoading(true);
    const postData = {
      template_id: file_id,
      // position_array: savedCanvasData
      position_array: filteredTextItems,
      email_subject: emailSubject,
      email_message: emailMessage,
    };
    try {
      const apiData = await post("template/updateTemplatePositions", postData); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');
      console.log("POSITIONS");

      console.log(apiData);
      if (apiData.error) {
        setsaveLoading(false);
        setSaveSuccess(false);
      } else {
        toastAlert("success", "Template saved successfully!");
        setSaveSuccess(true);
        setSaveSuccess(false);
        setsaveLoading(false);

        // fetchDataPositions(file_id);
        // UpdateLastChange();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setsaveLoading(false);
    }
  };
  return (
    <>
      <ImageCropperModal
        cropSrc={cropSrc}
        isOpen={modalOpen1}
        toggle={toggleModal}
        onImageCropped={handleImageCropped}
      />
      <ImageCropperModal
        cropSrc={cropSrc}
        isOpen={modalOpenUpdate}
        toggle={toggleModalUpdate}
        onImageCropped={handleImageCroppedUpdate}
      />
      {isLoaded ? <FullScreenLoader /> : null}
      {window.innerWidth < 786 ? (
        <>
          {editingTemp ? <OverLayFullScreen /> : null}
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
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                    <ArrowLeft
                      size={20}
                      style={{ marginLeft: "10px" }}
                      onClick={async () => {
                        window.location.href = `/template`;
                      }}
                    />

                    <img
                      src={logo}
                      style={{
                        width: "100px",
                        height: "50px",
                        objectFit: "contain",
                        marginLeft: "10px",
                        marginRight: "20px",
                      }}
                    />
                    <h4 className="fw-bold" style={{ marginTop: "10px" }}>
                      {fileName.length > 10
                        ? fileName.substring(0, 10) + "..."
                        : fileName}
                      .pdf
                    </h4>
                    <Send
                      size={20}
                      style={{ marginLeft: "10px" }}
                      onClick={async () => {
                        setSendTemplate(true);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row>
                <Col
                  xs={12}
                  md={8}
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
                              ></Page>
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
        </>
      ) : (
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
                    style={{marginRight: '20px'}}
                    onClick={() => {
                      setIsOpenCanvas(true);
                    }}
                  />
                ) : null} */}
                    <CustomButton
                      padding={true}
                      useDefaultColor={true}
                      size="sm"
                      // disabled={saveLoading}
                      color="primary"
                      // disabled={downloadLoader}
                      // onClick={async () => {
                      //   if (statusFile === 'InProgress') {
                      //     if (window.confirm('Do you want to save the previous changes?')) {
                      //       await saveData();
                      //     }
                      //     window.location.href = '/template';
                      //   } else {
                      //     window.location.href = '/template';
                      //   }
                      // }}
                      onClick={async () => {
                        if (editingTemp) {
                          if (
                            window.confirm(
                              "Are you sure you sure you want to complete that document?"
                            )
                          ) {
                            setLoadingSendDocument(true);

                            const data = window.location.pathname.split("/")[2];
                            console.log(data);

                            const user_id = user?.user_id;
                            const email = user?.email;
                            console.log(file_id);
                            let response_log = await getActivityLogUserTemp({
                              user_id: user_id,
                              file_id: file_id,
                              email: email,
                              event: "TEMPLATE-COMPLETED",
                              response_get: true,
                              description: `${email} Completed Editing Template ${fileName}`,
                            });
                            console.log("response_log");

                            console.log(response_log);
                            if (response_log === true) {
                              console.log("MAINTAIN LOG SUCCESS");
                            } else {
                              console.log("MAINTAIN ERROR LOG");
                            }
                            const specifiedTypes = [
                              "my_text",
                              "my_signature",
                              "my_initials",
                              "date",
                              "checkmark",
                              "highlight",
                              "stamp",
                            ];
                            const filteredTextItems = textItems.filter((item) =>
                              specifiedTypes.includes(item.type)
                            );
                            console.log(filteredTextItems);
                            const nonSpecifiedTextItems = textItems.filter(
                              (item) => !specifiedTypes.includes(item.type)
                            );
                            console.log(filteredTextItems);

                            let ActivityLogDetails =
                              await getFunctionTemplateAuditLog();
                            console.log(ActivityLogDetails);
                            // setDownloadPdfLoader(false)
                            await handleDownloadPDFHereTemp({
                              setDownloadPdfLoader: setLoadingSendDocument,
                              imageUrls,
                              textItems: filteredTextItems,
                              // textItems,

                              canvasWidth,
                              UniqIdDoc: uniq_id,

                              ActivityLogData: response_log,
                              fileName,
                              file_id,
                              statusData: null,
                              imageUrlsCount: null,
                              user_id,
                            });
                            await saveDataSigning(nonSpecifiedTextItems);
                            // await saveData();
                            setLoadingSendDocument(false);
                            // timeoutn for 1 second
                            // setTimeout(() => {
                            //   window.location.href = `/template?toastAlert=${link}`;
                            // }, 1000);
                          } else {
                            return;
                          }
                        } else {
                          window.location.href = `/template`;
                        }
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
                          {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                          <span className="align-middle ms-25">
                            {t("Back")}
                          </span>
                        </>
                      }
                    />

                    {loading ? (
                      <Spinner color="primary" />
                    ) : (
                      <img
                        src={
                          // logoFromApi ||
                          logo
                        }
                        style={{
                          width: "160px",
                          height: "50px",
                          objectFit: "contain",
                          marginLeft: "20px",
                          marginRight: "20px",
                        }}
                      />
                    )}
                    <h2
                      className="fw-bold"
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                    >
                      {t("Template")} : {fileName}.pdf
                    </h2>
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
                  {/* <div>{saveLoading ? <h4>Saving ...</h4> : null}</div> */}
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
                      disabled={downloadLoader}
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
                            {t("Download Original")}
                          </span>
                        </>
                      }
                    />
                    {editingTemp ? (
                      <CustomButton
                        padding={true}
                        secondary_color_data={true}
                        size="sm"
                        disabled={loadingSendDocument}
                        color="primary"
                        onClick={() => {
                          console.log(signersData);
                          const firstMissingTextItemSigner = signersData.find(
                            (signer) =>
                              !textItems.some(
                                (item) => item.signer_id === signer.signer_id
                              )
                          );

                          if (firstMissingTextItemSigner) {
                            toastAlert(
                              "error",
                              `Please add atleast one field for signer : ${
                                firstMissingTextItemSigner.name ||
                                firstMissingTextItemSigner.email ||
                                "Unknown"
                              }`
                            );
                            console.log(
                              "First signer without text item:",
                              firstMissingTextItemSigner
                            );
                          } else {
                            setSendToEsign(true);
                          }
                        }}
                        style={{
                          display: "flex",
                          boxShadow: "none",
                          justifyContent: "center",
                          marginRight: "5px",
                          marginLeft: "5px",
                          alignItems: "center",
                        }}
                        className="btn-icon d-flex"
                        text={
                          <>
                            {loadingSendDocument ? (
                              <Spinner color="light" size="sm" />
                            ) : null}
                            <span className="align-middle ms-25">
                              {t("Finish")}
                            </span>
                          </>
                        }
                      />
                    ) : (
                      <CustomButton
                        padding={true}
                        size="sm"
                        disabled={loadingSendDocument}
                        color="green"
                        onClick={async () => {
                          // const currentDate =
                          //   new Date();

                          // // Format the date as YYYYMMDD
                          // const formattedDate =
                          //   currentDate
                          //     .toISOString()
                          //     .slice(0, 10)
                          //     .replace(/-/g, "");
                          // const valueResponse =
                          //   parseInt(
                          //     item.total_responses
                          //   ) + parseInt(1);
                          // // Construct the document name
                          // const documentName = `${item.file_name}_${formattedDate}-${valueResponse}.pdf`;
                          // setDocumentName(
                          //   documentName
                          // );
                          // await fetchSignerData(
                          //   item.template_id
                          // );
                          setSendTemplate(true);
                        }}
                        style={{
                          display: "flex",
                          boxShadow: "none",
                          justifyContent: "center",
                          marginRight: "5px",
                          marginLeft: "5px",
                          alignItems: "center",
                        }}
                        className="btn-icon d-flex"
                        text={
                          <>
                            {loadingSendDocument ? (
                              <Spinner color="light" size="sm" />
                            ) : null}
                            <span className="align-middle ms-25">
                              {t("Share")}
                            </span>
                          </>
                        }
                      />
                    )}

                    {/* )}
                  </>
                ) : (
                  <></>
                )} */}
                    {/* {window.innerWidth < 380 ? (
                  <Image
                    style={{marginLeft: '20px'}}
                    size={20}
                    onClick={() => {
                      setIsOpenCanvasPages(true);
                    }}
                  />
                ) : null} */}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row id={`full-page-${pageNumber}`}>
                <Col
                  xs={2}
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  {/* Signer add  */}
                  {editingTemp ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginInline: "5%",
                        }}
                      >
                        <Button
                          // disabled={saveLoading}
                          color="success"
                          onClick={() => {
                            // setSignerView(true)
                            setCount(signersData.length);
                            setSignerAddEdit(true);
                            increaseCount();
                          }}
                          style={{
                            display: "flex",
                            boxShadow: "none",
                            justifyContent: "center",
                            marginBlock: "4%",
                            width: "100%",
                            cursor: "pointer",
                            marginLeft: "10px",
                            // alignSelf:"center",
                            alignItems: "center",
                          }}
                          className="btn-icon d-flex"
                        >
                          <Plus size={15} />
                          <span
                            style={{ fontSize: "16px", letterSpacing: ".5px" }}
                            className="align-middle ms-25"
                          >
                            {t("Signer")}
                          </span>
                        </Button>
                      </div>
                      {selectedSigner === null ||
                      selectedSigner === undefined ||
                      selectedSigner === "" ||
                      selectedSigner.length === 0 ? null : (
                        <>
                          <div style={{ marginInline: "5%" }}>
                            <DropdownCustom
                              signersData={signersData}
                              selectedSigner={selectedSigner}
                              setSelectedSigner={setSelectedSigner}
                              setActive={setActive}
                              deleteForm={deleteForm}
                              template={true}
                              deleteSignerLoader={deleteSignerLoader}
                            />
                          </div>
                        </>
                      )}{" "}
                    </>
                  ) : (
                    <>
                      <div style={{ padding: "10px" }}>
                        {/* <h3>From Rimsha Riaz</h3> */}
                        <h3>
                          {t("Sent on")}{" "}
                          {formatDateCustomTimelastActivity(created_at_doc)}
                        </h3>
                        <h3>
                          {/* {statusFile==="InProgress"?<>
              <Clock size={15}/>
              <span>In Progress</span>
              </>:null} */}
                          {statusFile === "WaitingForOthers" ? (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "left",
                                  alignItems: "center",
                                }}
                              >
                                <Clock size={15} />
                                <span style={{ marginLeft: "5px" }}>
                                  {t("Waiting for Others")}
                                </span>
                              </div>
                            </>
                          ) : null}

                          {/* {statusFile==="WaitingForOthers"?<>
              <Users size={15}/>
              <span>Waiting for me</span>
              </>:null} */}
                        </h3>
                      </div>
                      <div
                        style={{ borderBottom: "1px solid lightGrey" }}
                      ></div>

                      <div style={{ padding: "10px" }}>
                        <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                          {t("Signers")}
                        </h2>
                        {signersData1.length === 0 ? null : (
                          <>
                            {signersData1.map((signer, index) => (
                              <div
                                style={{
                                  // display: 'flex',
                                  // justifyContent: 'space-between',
                                  // alignItems: 'center',
                                  borderBottom: "1px solid LightGrey",
                                  paddingBlock: "10px",
                                }}
                              >
                                <div>
                                  {/* <h3 className="fw-bold">{signer.name}</h3> */}
                                  <h3>{signer.name}</h3>
                                </div>
                                <div>
                                  <h3>
                                    {signer.completed_status === null ||
                                    signer.completed_status === undefined ? (
                                      t("Needs to sign")
                                    ) : (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "left",
                                            alignItems: "center",
                                          }}
                                        >
                                          <CheckCircle
                                            size={15}
                                            style={{ color: "green" }}
                                          />
                                          <h3
                                            style={{
                                              marginLeft: "10px",
                                              fontWeight: 700,
                                            }}
                                          >
                                            {t("Completed")}
                                          </h3>
                                        </div>
                                      </>
                                    )}
                                  </h3>
                                  <h3>
                                    {signer.completed_status === null ||
                                    signer.completed_status ===
                                      undefined ? null : (
                                      <>
                                        {formatDateCustomTimelastActivity(
                                          signer.completed_at
                                        )}
                                      </>
                                    )}
                                  </h3>
                                </div>
                              </div>
                            ))}{" "}
                          </>
                        )}
                        <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                          {t("Subject")}
                        </h2>
                        <h3 style={{ marginBlock: "2%" }}>{emailSubject}</h3>
                        <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                          {t("Message")}
                        </h2>
                        <h3 style={{ marginBlock: "2%" }}>{emailMessage}</h3>
                      </div>
                    </>
                  )}

                  {/* // end signer  */}
                  {/* For you For Others  */}
                  {/* {statusFile === 'InProgress' ? ( */}
                  {editingTemp ? (
                    <div>
                      <Nav className="justify-content-center">
                        {/* <NavItem>
                      <NavLink
                        style={{ fontSize: "16px" }}
                        active={active === "1"}
                        onClick={() => {
                          toggle("1");
                        }}
                      >
                        For You
                      </NavLink>
                    </NavItem> */}
                        <NavItem>
                          <NavLink
                            style={
                              active === "2"
                                ? {
                                    color: primary_color,
                                    borderBottom: `3px solid ${primary_color}`,
                                    fontSize: "16px",
                                  }
                                : { fontSize: "16px" }
                            }
                            active={active === "2"}
                            onClick={() => {
                              //   if (selectedSigner.length === 0 || selectedSigner === null || selectedSigner === undefined) {
                              //     toastAlert('error', 'Please Add Signer!');
                              //   } else {
                              toggle("2");
                              //   }
                            }}
                          >
                            {t("For Others")}
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={active}>
                        {/* <TabPane tabId="1">
                      <ListGroup
                        style={{ width: "100%" }}
                        className="list-group-vertical-sm"
                      >
                        <ForYou type={getTypeListItem} />
                      </ListGroup>
                    </TabPane> */}
                        <TabPane tabId="2">
                          <ForOthers
                            type={getTypeListItem}
                            selectedSigner={selectedSigner}
                          />
                        </TabPane>
                      </TabContent>
                    </div>
                  ) : null}
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
                          {t("Deselect")}
                        </span>
                      </Button>
                    </div>
                  )}
                  {/* ) : null} */}
                </Col>

                {sendToEsign === false &&
                  modalOpen === false &&
                  modalOpenDropdown === false &&
                  itemDeleteConfirmation === false &&
                  signerAddEdit === false &&
                  modalOpen1 === false &&
                  modalOpenUpdate === false &&
                  itemDeleteConfirmation12 === false &&
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
                    cursor:
                      type === "my_text" || type === "signer_text"
                        ? "none"
                        : type
                        ? "none"
                        : "default",
                    // border: '1px solid lightGrey',
                    backgroundColor: "#eaeaea",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // maxHeight: '92dvh',
                    paddingTop: "10px",
                    overflow: "auto",
                    // paddingBottom: '20px',
                  }}
                >
                  {/* editor  */}
                  {isLoadingDoc && ( // Conditionally render spinner if isLoading is true
                    <div style={{ display: "flex", justifyContent: "right" }}>
                      {/* Render your spinner component */}
                      <Spinner />
                    </div>
                  )}

                  <div
                    style={{
                      height: "92dvh",

                      position: "relative",
                      // transform: `scale(${zoomPercentage / 100})`,
                      // transformOrigin: 'top left',
                    }}
                  >
                    {/* {imageUrls} */}
                    <Document
                      file={`${imageUrls}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      // style={{ width: '100%', height: '100%' }} // Add this line
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
                              key={page}
                              id={`full-page-${page}`}
                              style={{ marginBottom: "20px" }}
                            >
                              <Page
                                onLoadSuccess={({ width }) => {
                                  setCanvasWidth(width);
                                }}
                                scale={scale}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                key={page}
                                pageNumber={page}
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
                                canvasRef={(ref) =>
                                  (canvasRefs.current[page - 1] = ref)
                                }
                                onClick={(e) => handleCanvasClick(e, page)}

                                // width={canvasWidth}
                                // className={activePage === page ? 'active-page' : ''}
                                // onClick={() => handlePageClick(page)}
                              >
                                {/* <canvas
                            id={`full-page-${page}`}
                            onMouseMove={() => setPageNumber(page)}
                            ref={ref => (canvasRefs.current[page - 1] = ref)}
                            onClick={e => handleCanvasClick(e, page)}
                            // id="col-9"
                            // ref={canvasRef}
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
                                  <Rnd
                                    dragHandleClassName="drag-handle"
                                    disableDragging={editingTemp ? false : true}
                                    enableResizing={
                                      editingTemp
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
                                    // disableDragging={editingTemp ? false : true}
                                    // disableResizing={{
                                    //   top: editingTemp ? false : true,
                                    //   right: editingTemp ? false : true,
                                    //   bottom: editingTemp ? false : true,
                                    //   left: editingTemp ? false : true,
                                    //   topRight: editingTemp ? false : true,
                                    //   bottomRight: editingTemp ? false : true,
                                    //   bottomLeft: editingTemp ? false : true,
                                    //   topLeft: editingTemp ? false : true,
                                    // }}
                                    key={field.id}
                                    style={{
                                      // border: field.type==="checkmark" || field.type==="radio" ?'none':'1px solid lightgrey',
                                      border:
                                        hoveredStateDummyIndex === index ||
                                        (isResizing && resizingIndex === index)
                                          ? field.type === "signer_checkmark" ||
                                            field.type === "checkmark"
                                            ? "none"
                                            : "2px solid rgba(98,188,221,1)"
                                          : "none",
                                      display: "block", // Always render the component
                                      visibility:
                                        field.page_no === page
                                          ? "visible"
                                          : "hidden",
                                      transform: `translate(${field.x}px, ${field.y}px)`,

                                      // Hide/show based on condition
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
                                      // setIsDragging(true);
                                      setHoveredStateDummyType(type);
                                      setType("");

                                      // Calculate the initial offset of the mouse relative to the element
                                      const canvasRect =
                                        canvasRefs.current[
                                          page - 1
                                        ].getBoundingClientRect();
                                      const elementOffsetX =
                                        (e.clientX - canvasRect.left) / scale -
                                        field.x;
                                      const elementOffsetY =
                                        (e.clientY - canvasRect.top) / scale -
                                        field.y;

                                      setDragOffset({
                                        x: elementOffsetX,
                                        y: elementOffsetY,
                                      });
                                    }}
                                    // onDrag={async (e) => {
                                    //   const canvasRect =
                                    //     canvasRefs.current[
                                    //       page - 1
                                    //     ].getBoundingClientRect();

                                    //   // Adjust the position calculation using the initial offset
                                    //   const x =
                                    //     (e.clientX - canvasRect.left) / scale -
                                    //     dragOffset.x;
                                    //   const y =
                                    //     (e.clientY - canvasRect.top) / scale -
                                    //     dragOffset.y;

                                    //   const newSavedCanvasData = [...textItems];
                                    //   newSavedCanvasData[index].x = x;
                                    //   newSavedCanvasData[index].y = y;
                                    //   setTextItems(newSavedCanvasData);
                                    //   // const page = e.target.id.split('-')[2];
                                    //   // const canvasRect = canvasRefs.current[page - 1];
                                    //   // const rect = canvasRect.getBoundingClientRect();
                                    //   // // const x = e.clientX - rect.left;
                                    //   // // const y = e.clientY - rect.top;
                                    //   // const x = (e.clientX - rect.left) / (zoomPercentage / 100);
                                    //   // const y = (e.clientY - rect.top) / (zoomPercentage / 100);
                                    //   // //console.log("y")

                                    //   // //console.log(x)
                                    //   // //console.log(y)

                                    //   // await handleUpdateField(field.id, field.type, x, y);
                                    //   // Now you can use canvasRef to get the position relative to the current canvas
                                    // }}
                                    onDrag={async (e, d) => {
                                      const canvasRects = canvasRefs.current.map((ref) =>
                                        ref.getBoundingClientRect()
                                      );
                                    
                                      // Detect the page under the dragged element
                                      let targetPage = null;
                                      for (let i = 0; i < canvasRects.length; i++) {
                                        const rect = canvasRects[i];
                                        if (
                                          e.clientX >= rect.left &&
                                          e.clientX <= rect.right &&
                                          e.clientY >= rect.top &&
                                          e.clientY <= rect.bottom
                                        ) {
                                          targetPage = i + 1; // Page numbers are 1-based
                                          break;
                                        }
                                      }
                                    
                                      // Update the element's position
                                      const canvasRect = canvasRects[targetPage - 1] || canvasRects[page - 1];
                                      const x = (e.clientX - canvasRect.left) / scale - dragOffset.x;
                                      const y = (e.clientY - canvasRect.top) / scale - dragOffset.y;
                                    
                                      const newSavedCanvasData = [...textItems];
                                      newSavedCanvasData[index].x = x;
                                      newSavedCanvasData[index].y = y;
                                    
                                      // Update the page temporarily for preview purposes
                                      if (targetPage && targetPage !== textItems[index].page_no) {
                                        newSavedCanvasData[index].page_no = targetPage;
                                      }
                                    
                                      setTextItems(newSavedCanvasData);
                                    }}
                                    // onDragStop={(e, d) => {
                                    //   // setIsDragging(false); // Dragging has stopped

                                    //   // let cumulativeHeight = 0;
                                    //   // for (let i = 0; i < page - 1; i++) {
                                    //   //   cumulativeHeight += canvasRefs.current[i].offsetHeight;
                                    //   // }

                                    //   setType(hoveredStateDummyType);
                                    //   setHoveredStateDummyType("");
                                    // }}
                                    onDragStop={(e, d) => {
                                      const canvasRect = canvasRefs.current[page - 1].getBoundingClientRect();
                                      const pageWidth = canvasRect.width / scale; // Width of the PDF page
                                      const pageHeight = canvasRect.height / scale; // Height of the PDF page
                                    
                                      // Get the last position
                                      let x = d.x / scale;
                                      let y = d.y / scale;
                                    
                                      // Constrain position to within bounds
                                      x = Math.max(0, Math.min(x, pageWidth - field.width));
                                      y = Math.max(0, Math.min(y, pageHeight - field.height));
                                    
                                      // Update the text item to fit within the page
                                      const newSavedCanvasData = [...textItems];
                                      newSavedCanvasData[index].x = x;
                                      newSavedCanvasData[index].y = y;
                                      setTextItems(newSavedCanvasData);
                                    }}
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
                                    // onDragStop={(e, d) => {
                                    //   const originalX = d.x;
                                    //   const originalY = d.y;
                                    //   if (editingTemp) {
                                    //     handleUpdateField(field.id, field.type, originalX, originalY);
                                    //   } else {
                                    //   }
                                    //   // //console.log('I M DRAG');
                                    //   // handleUpdateField(field.id, field.type, d.x, d.y);
                                    // }}
                                    onResizeStop={async (
                                      e,
                                      direction,
                                      ref,
                                      delta,
                                      position
                                    ) => {
                                      //console.log('I M RESIZE');
                                      // const width = parseInt(ref.style.width, 10);
                                      // const height = parseInt(ref.style.height, 10);
                                      // const width = parseInt(ref.style.width, 10) ;
                                      // const height = parseInt(ref.style.height, 10) ;
                                      // const width = (parseInt(ref.style.width, 10) / zoomPercentage) * 100;
                                      // const height = (parseInt(ref.style.height, 10) / zoomPercentage) * 100;

                                      // let newX = field.x;
                                      // let newY = field.y;

                                      // if (direction.left) {
                                      //   newX = field.x - (delta.width / zoomPercentage) * 100;
                                      // }
                                      // if (direction.top) {
                                      //   newY = field.y - (delta.height / zoomPercentage) * 100;
                                      // }

                                      // handleUpdateFieldResize(field.id, field.type, width, height, newX, newY);
                                      // // const width = (parseInt(ref.style.width, 10) / zoomPercentage) * 100;
                                      // // const height = (parseInt(ref.style.height, 10) / zoomPercentage) * 100;
                                      // // handleUpdateFieldResize(field.id, field.type, width, height);
                                      // //console.log(position);
                                      const width =
                                        parseInt(ref.style.width, 10) / scale;
                                      const height =
                                        parseInt(ref.style.height, 10) / scale;
                                      // let newX = field.x ;
                                      // let newY = field.y ;
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
                                      // setIsResizing1(false); // Resizing has stopped
                                    }}
                                    resizeHandleClasses={{
                                      topLeft: "resize-handle",
                                      topRight: "resize-handle",
                                      bottomLeft: "resize-handle",
                                      bottomRight: "resize-handle",
                                    }}
                                    bounds="parent"
                                  >
                                    {editingTemp ? (
                                      <>
                                        {hoveredStateDummyIndex === index && (
                                          <>
                                            <ResizeCircle
                                              position={{
                                                top: -10,
                                                right: -10,
                                              }}
                                              onClick={() =>
                                                handleDeleteCurrentPosition(
                                                  field.id
                                                )
                                              }
                                              color="red"
                                              item="delete"
                                            />
                                            {field.type === "my_signature" && (
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
                                                  setSignatureModalUpdate(true);
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
                                                  setSignatureModalUpdate(true);
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
                                              field.type !== "signer_radio" && (
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
                                        {isResizing &&
                                          resizingIndex === index && (
                                            <>
                                              <ResizeCircle
                                                position={{
                                                  top: -10,
                                                  right: -10,
                                                }}
                                                onClick={() =>
                                                  handleDeleteCurrentPosition(
                                                    field.id
                                                  )
                                                }
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
                                          )}{" "}
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    <div className="drag-handle">
                                      <ComponentForItemType
                                        key={index}
                                        item={field}
                                        handleInputChangedDate={(e) =>
                                          handleInputChangedDate(e, index)
                                        }
                                        handleInputChecked={(e) =>
                                          handleInputChecked(e, index)
                                        }
                                        handleInputChanged={(e) =>
                                          handleInputChanged(e, index)
                                        }
                                        setCallbackWidth={(width) =>
                                          handleChnageWidthInput(width, index)
                                        }
                                        handleDoubleClick={() =>
                                          handleDoubleClick(index, field)
                                        }
                                        IsSigner={false}
                                        zoomPercentage={scale}
                                        signerObject={selectedSigner}
                                      />
                                    </div>
                                  </Rnd>
                                ))}{" "}
                              </Page>
                              <h5
                                style={{
                                  marginBlock: "10px",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                {t("Page")} {page}
                              </h5>{" "}
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
                  {/* Pages  */}
                  {isResizing === true &&
                  editedItem.type != "my_signature" &&
                  editedItem.type != "my_initials" &&
                  editedItem.type != "checkmark" &&
                  editedItem.type != "signer_checkmark" &&
                  editedItem.type != "signer_radio" &&
                  editedItem.type != "highlight" &&
                  editedItem.type != "stamp" ? (
                    <div style={{ position: "absolute", top: 0, right: 30 }}>
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
                    <div style={{ position: "absolute", top: 0, right: 25 }}>
                      <Menu
                        size={15}
                        onClick={() => setSignerView(!signerView)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  )}

                  {isResizing === true &&
                  editedItem.type != "my_signature" &&
                  editedItem.type != "my_initials" &&
                  editedItem.type != "checkmark" &&
                  // editedItem.type != 'signer_checkmark' &&
                  // editedItem.type != 'signer_radio' &&

                  editedItem.type != "highlight" &&
                  editedItem.type != "stamp" ? (
                    <>
                      {editingTemp ? (
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
                          <div
                            ref={scrollContainerRefCol2}
                            style={{ overflowY: "auto", maxHeight: "93dvh",marginTop:"20px" }}

                            // style={{
                            //   display: "flex",
                            //   flexDirection: "column",
                            //   justifyContent: "center",
                            //   alignItems: "center",
                            // }}
                          >
                            <div
                              // style={{
                              //   display: "flex",
                              //   justifyContent: "center",
                              //   width: "100%",
                              //   marginTop: "25px",
                              // }}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ padding: "20px" }}>
                             
                              <Document
                                file={`${imageUrls}`}
                                onLoadSuccess={onDocumentLoadSuccess}
                                noData="No PDF loaded"
                              >
                                {loadedPages.map((page) => (
                                  <>
                                    <div
                                      // id={`full-page-${page}`}
                                      id={`thumbnail-page-${page}`}
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
                                      // onMouseEnter={(e) => {
                                      //   if (pageNumber !== page) {
                                      //     e.target.style.border =
                                      //       "1px solid #c4c4c4";
                                      //     // e.target.style.borderRadius = '10px';
                                      //   }
                                      // }}
                                      // onMouseLeave={(e) => {
                                      //   if (pageNumber !== page) {
                                      //     e.target.style.border =
                                      //       "1px solid white";
                                      //   }
                                      // }}
                                      onClick={() => handlePageClick(page)}
                                    >
                                      <Page
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
                                        key={page}
                                        pageNumber={page}
                                        width={180}
                                        className={
                                          activePage === page
                                            ? "active-page"
                                            : ""
                                        }
                                        // onClick={() => handlePageClick(page)}
                                      ></Page>
                                    </div>
                                    <h6
                                      style={{
                                        marginBlock: "10px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {" "}
                                      {t("Page")} {page}
                                    </h6>{" "}
                                  </>
                                ))}
                              </Document>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {/* {editedItem?.id} */}
                    </>
                  ) : (
                    <>
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
                            // display: "flex",
                            // justifyContent: "center",
                            // width: "100%",
                            // marginTop: "25px",
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
                            {loadedPages.map((page) => (
                              <>
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
                                      e.target.style.border =
                                        "1px solid #c4c4c4";
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
                                    key={page}
                                    pageNumber={page}
                                    width={180}
                                    className={
                                      activePage === page ? "active-page" : ""
                                    }
                                    // onClick={() => handlePageClick(page)}
                                  ></Page>
                                </div>
                                <h5
                                  style={{
                                    marginBlock: "10px",
                                    textAlign: "center",
                                  }}
                                >
                                  {" "}
                                  {t("Page")} {page}
                                </h5>{" "}
                              </>
                            ))}
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
          </Row>
        </>
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
            user_id_user={user?.user_id}
            modalClose={() => {
              setSignatureModal(!SignatureModal);
            }}
            returnedSignature={placeImage}
            file_id={file_id}
            profile={false}
            initialsBox={initialBox}
          />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={SignatureModalUpdate}
        toggle={() => setSignatureModalUpdate(!SignatureModalUpdate)}
        className="modal-dialog-centered modal-lg"
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!SignatureModal)}></ModalHeader> */}
        <ModalBody className=" pb-5">
          <SignatureModalContent
            user_id_user={user?.user_id}
            modalClose={() => {
              setSignatureModalUpdate(!SignatureModalUpdate);
            }}
            returnedSignature={placeImageUpdate}
            file_id={file_id}
            initialsBox={initialBox}
          />
        </ModalBody>
      </Modal>
      {/* signer add/edit  */}
      <Modal
        isOpen={signerAddEdit}
        toggle={() => setSignerAddEdit(!signerAddEdit)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalBody className="pb-2">
          <Row tag="form" className="gy-1 gx-2 p-2">
            <Col xs={12} className="d-flex justify-content-between">
              <h1 className="text-center  fw-bold">{t("Add/Edit Signers")}</h1>

              {count === 8 ? (
                <></>
              ) : (
                <Button
                  size="sm"
                  style={{
                    boxShadow: "none",
                  }}
                  className="btn-icon"
                  color="primary"
                  onClick={increaseCount}
                  disabled={
                    signersData.some((signer) => !signer.name) ||
                    inputErrors.some((error) => error)
                  }
                >
                  <Plus size={14} />
                  <span
                    style={{ fontSize: "16px" }}
                    className="align-middle ms-25"
                  >
                    {t("Signer")}
                  </span>
                </Button>
              )}
            </Col>
            <Col xs={12} className="d-flex justify-content-between">
              <h3>{t("Maximum 8 signers can be added")}</h3>
            </Col>

            <Col xs={12}>
              {signersData.length === 0 ? (
                <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                  <Col
                    md="12"
                    xs="12"
                    className="d-flex justify-content-center align-items-center"
                  >
                    <img
                      src={emptyImage}
                      alt="empty"
                      style={{ width: "150px", height: "auto" }}
                    />
                    <h3>{t("No Signer Exist")}</h3>
                  </Col>
                </Row>
              ) : (
                <>
                  {signersData.map((signer, i) => (
                    <div key={i}>
                      <Form>
                        <Row className="justify-content-between align-items-center">
                          {window.innerWidth < 736 ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: `${signer?.color}`,
                                  marginTop: "5px",
                                  marginRight: "5px",
                                  borderRadius: "50%",
                                  width: "15px",
                                  height: "15px",
                                }}
                              ></div>
                              <Input
                                style={{
                                  fontSize: "14px",
                                  boxShadow: "none",
                                  width: "30%",
                                }}
                                name="name"
                                type="text"
                                id={`animation-item-name-${i}`}
                                value={signer?.name}
                                placeholder={signer?.name}
                                onChange={(event) =>
                                  handleInputChange(i, event)
                                }
                              />
                              <div>
                                <Input
                                  style={{
                                    fontSize: "14px",
                                    boxShadow: "none",
                                    marginLeft: "10px",
                                    width: "80%",
                                  }}
                                  name="email"
                                  value={signer?.email}
                                  onChange={(event) =>
                                    handleInputChange(i, event)
                                  }
                                  type="email"
                                  id={`animation-cost-${i}`}
                                  placeholder="signer@gmail.com"
                                />
                                {inputErrors[i] && (
                                  <div
                                    style={{
                                      color: "red",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {inputErrors[i]}
                                  </div>
                                )}
                              </div>
                              <div style={{ marginLeft: "10px" }}>
                                {deleteSignerLoader &&
                                signer?.signer_id === DelteSelectedId ? (
                                  <Spinner color="primary" size="sm" />
                                ) : (
                                  <XCircle
                                    size={18}
                                    style={{ color: "red" }}
                                    onClick={() => deleteForm(i)}
                                  />
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              <Col md={1} xs={1} className="mb-md-0 mb-1">
                                <div
                                  style={{
                                    backgroundColor: `${signer?.color}`,
                                    marginTop: "5px",
                                    marginRight: "10px",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                ></div>
                              </Col>

                              <Col md={9} xs={9} className="mb-md-0 mb-1">
                                <h3
                                  className="form-label"
                                  htmlFor={`animation-item-name-${i}`}
                                >
                                  {t("Signer Name")}
                                </h3>
                                <Input
                                  style={{
                                    fontSize: "16px",
                                    boxShadow: "none",
                                  }}
                                  name="name"
                                  type="text"
                                  id={`animation-item-name-${i}`}
                                  value={signer?.name}
                                  onChange={(event) =>
                                    handleInputChange(i, event)
                                  }
                                  placeholder={signer.placeholder}
                                />
                                {inputErrors[i] && (
                                  <div
                                    style={{
                                      color: "red",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {inputErrors[i]}
                                  </div>
                                )}
                              </Col>
                              {/* <Col md={5} xs={5} className="mb-md-0 mb-1">
                    <h3 className="form-label" htmlFor={`animation-cost-${i}`}>
                      Email
                    </h3>
                    <Input
                      style={{
                        fontSize: "16px",
                        boxShadow: "none",
                      }}
                      name="email"
                      value={signer?.email}
                      onChange={(event) => handleInputChange(i, event)}
                      type="email"
                      id={`animation-cost-${i}`}
                      placeholder="signer@gmail.com"
                    />
                    {inputErrors[i] && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginTop: "5px",
                        }}
                      >
                        {inputErrors[i]}
                      </div>
                    )}
                  </Col> */}
                              <Col md={2} className="mb-md-0 mt-2">
                                {i !== 0 && (
                                  <Button
                                    disabled={deleteSignerLoader}
                                    size="sm"
                                    color="danger"
                                    className="text-nowrap px-1"
                                    onClick={() => deleteForm(i)}
                                  >
                                    {deleteSignerLoader &&
                                    signer.signer_id === DelteSelectedId ? (
                                      <Spinner color="light" size="sm" />
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                  </Button>
                                )}
                              </Col>
                            </>
                          )}
                          <Col
                            sm={12}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "left",
                            }}
                          >
                            {/* make checkbox
                             */}
                            {/* <Input
                      style={{
                        fontSize: "16px",
                        boxShadow: "none",
                      }}
                      type="checkbox"
                      checked
                      // onChange={(event) => handleInputChange(i, event)}
                    />
                    <span style={{fontSize:"16px",marginLeft:'10px'}}>I am the signer </span> */}
                          </Col>
                          <Col sm={12}>
                            <hr />
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  ))}
                </>
              )}
            </Col>

            {signersData.length === 0 ? null : (
              <Col className="text-center mt-1" xs={12}>
                <Button
                  style={{ boxShadow: "none", height: "40px" }}
                  size="sm"
                  disabled={loadingSignersSave}
                  color="primary"
                  onClick={AddSignersData}
                >
                  {loadingSignersSave ? (
                    <Spinner color="light" size="sm" />
                  ) : null}
                  <span
                    style={{ fontSize: "16px" }}
                    className="align-middle ms-25"
                  >
                    {t("Save")}
                  </span>
                </Button>

                <Button
                  size="sm"
                  style={{
                    marginLeft: "10px",
                    fontSize: "16px",
                    boxShadow: "none",
                    height: "40px",
                  }}
                  color="secondary"
                  outline
                  onClick={() => {
                    setSignerAddEdit(!signerAddEdit);
                  }}
                >
                  {t("Cancel")}
                </Button>
              </Col>
            )}
          </Row>
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteItemFromCanvas}
        alertStatusDelete={"delete"}
        text={t("Are you sure you want to remove this item?")}
      />
      {/* send to e-sign  */}
      <Modal
        isOpen={sendToEsign}
        toggle={() => {
          if (loadingSendDocument) {
          } else {
            setSendToEsign(!sendToEsign);
          }
        }}
        className="modal-dialog-centered modal-lg"
      >
        <ModalBody className="px-sm-5 mx-20 pb-2">
          <Row tag="form" className="gy-1 gx-2 mt-75">
            <Col xs={12}>
              <div
                style={{
                  display: " flex",
                  justifyContent: "space-between",
                }}
              >
                <h1 className="fw-bold"> {t("Save Template")} </h1>
                <X
                  size={24}
                  onClick={() => setSendToEsign(!sendToEsign)}
                  style={{ cursor: "pointer" }}
                />
              </div>

              <Row>
                <Col xs={12}>
                  <h3>{t("Email Subject")}</h3>
                  <Input
                    type="text"
                    style={{
                      fontSize: "16px",
                      boxShadow: "none",
                      marginBottom: "10px",
                    }}
                    id={`email-subject`}
                    value={emailSubject}
                    onChange={(e) => {
                      setEmailSubject(e.target.value);
                    }}
                    placeholder="Enter subject here "
                  />
                  <h3>{t("Message")}</h3>
                  <Input
                    style={{
                      fontSize: "16px",
                      boxShadow: "none",
                    }}
                    type="textarea"
                    rows={5}
                    value={emailMessage}
                    onChange={(e) => {
                      setEmailMessage(e.target.value);
                    }}
                    id={`message`}
                    placeholder="Enter Message here "
                  />
                </Col>
                <Col xs={12} className="d-flex justify-content-end">
                  <CustomButton
                    padding={true}
                    size="sm"
                    disabled={signersData.length === 0 || loadingSendDocument}
                    onClick={async () => {
                      // email template save
                      setLoadingSendDocument(true);
                      // await saveData();
                      const data = window.location.pathname.split("/")[2];
                      console.log(data);

                      const user_id = user?.user_id;
                      const email = user?.email;
                      console.log(file_id);
                      let response_log = await getActivityLogUserTemp({
                        user_id: user_id,
                        file_id: file_id,
                        email: email,
                        event: "TEMPLATE-COMPLETED",
                        response_get: true,
                        user_shared_email: email,
                        description: `${email} Completed Editing Template ${fileName}`,
                      });
                      console.log("response_log");

                      console.log(response_log);
                      // if (response_log === true) {
                      //   console.log("MAINTAIN LOG SUCCESS");
                      // } else {
                      //   console.log("MAINTAIN ERROR LOG");
                      // }
                      const cleanedTextItems = textItems.filter(
                        (item) =>
                          !(
                            item.type === "signer_dropdown" &&
                            (!item.options || item.options.length === 0)
                          )
                      );
                      const specifiedTypes = [
                        "my_text",
                        "my_signature",
                        "my_initials",
                        "date",
                        "checkmark",
                        "highlight",
                        "stamp",
                      ];
                      const filteredTextItems = cleanedTextItems.filter(
                        (item) => specifiedTypes.includes(item.type)
                      );
                      console.log(filteredTextItems);
                      const nonSpecifiedTextItems = cleanedTextItems.filter(
                        (item) => !specifiedTypes.includes(item.type)
                      );
                      console.log(filteredTextItems);

                      let ActivityLogDetails =
                        await getFunctionTemplateAuditLog();
                      console.log(ActivityLogDetails);
                      // setDownloadPdfLoader(false)
                      console.log("files data", file_id);
                      console.log("user data", user_id);
                      await handleDownloadPDFHereTemp({
                        setDownloadPdfLoader: setLoadingSendDocument,
                        imageUrls,
                        textItems: filteredTextItems,
                        // textItems,

                        canvasWidth,
                        UniqIdDoc: uniq_id,

                        ActivityLogData: response_log,
                        fileName,
                        file_id,
                        statusData: null,
                        imageUrlsCount: null,
                        user_id,
                      });
                      await saveDataSigning(nonSpecifiedTextItems);
                      // await saveData();
                      // setLoadingSendDocument(false);
                      // timeoutn for 1 second
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }}
                    text={
                      <>
                        {loadingSendDocument ? (
                          <Spinner color="light" size="sm" />
                        ) : null}
                        <span
                          style={{ fontSize: "16px" }}
                          className="align-middle ms-25"
                        >
                          {t("Save")}
                        </span>
                      </>
                    }
                    color="primary"
                    style={{
                      height: "40px",
                      fontSize: "16px",
                      boxShadow: "none",
                      marginLeft: "10px",
                      marginBottom: "1%",
                      marginTop: "2%",
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={isInputVisible}
        toggle={() => setIsInputVisible(!sendToEsign)}
        className="modal-dialog-centered modal-sm"
      >
        <ModalBody className="px-sm-5 mx-20 pb-2">
          <Row tag="form" className="gy-1 gx-1 mt-75">
            <Col
              xs={12}
              style={{
                position: "sticky",
                top: 0,
                zIndex: "1000",
                backgroundColor: "#f8f8f8",
              }}
            >
              <div
                style={{
                  paddingBlock: "10px",

                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1%",
                }}
              >
                <h1 className="fw-bold"> {t("Add Access Code")}</h1>
                <X
                  size={24}
                  onClick={() => setIsInputVisible(!isInputVisible)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </Col>
            <Col xs={12}>
              <Row>
                <Col xs={12}>
                  {/* <h3>Access Code</h3> */}
                  <Input
                    // autoFocus={false}
                    // onFocus={() => setIsInputFocused(true)}
                    // onBlur={() => setIsInputFocused(false)}
                    style={{
                      fontSize: "16px",
                      boxShadow: "none",
                      marginTop: "5px",
                    }}
                    type="text"
                    maxLength={6} // Maximum 6 characters allowed
                    value={inputValueAccessCode}
                    onChange={(e) => {
                      setInputValueAccessCode(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Col>

            <Col xs={12} className="d-flex justify-content-center">
              <Button
                size="sm"
                disabled={loadingSendDocument}
                onClick={async () => {
                  // email template save
                  handleCheckClickAccessCode(
                    signersData[activeRow].signer_id,
                    activeRow
                  );
                }}
                color="primary"
                style={{
                  height: "40px",
                  fontSize: "16px",
                  boxShadow: "none",
                  marginLeft: "10px",
                  marginBottom: "1%",
                }}
              >
                {loadingSendDocument ? (
                  <Spinner color="light" size="sm" />
                ) : null}
                <span
                  style={{ fontSize: "16px" }}
                  className="align-middle ms-25"
                >
                  {t("Save")}
                </span>
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation12}
        toggleFunc={() =>
          setItemDeleteConfirmation12(!itemDeleteConfirmation12)
        }
        loader={loadingDelete}
        callBackFunc={DeletetextItemsData}
        alertStatusDelete={"delete"}
        text={t(
          "There are associated Items with this signer. Do you want to delete that signer?"
        )}
      />
      <Modal
        isOpen={sendTemplate}
        toggle={() => {
          // setErrorRequired(false)
          // setFolderName('')
          setSendTemplate(false);
        }}
        className="modal-dialog-centered modal-lg"
        modalClassName="info"
        key="success"
      >
        {/* <ModalHeader
         toggle={() => {
          setErrorRequired(false)
          setFolderName('')

          setModal(false)
        }}
        > */}

        {/* </ModalHeader> */}
        <ModalBody>
          <div
            style={{
              display: " flex",
              justifyContent: "space-between",
              marginBottom: "2%",
            }}
          >
            <h1 className="fw-bold">{t("Share Template")}</h1>

            <X
              size={24}
              onClick={() => {
                // setFolderName('')
                setSendTemplate(false);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>

          <Label className="form-label" for="register-firstname">
            {t("Document Name")}
          </Label>
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Input
              style={{
                width: "100%",
                boxShadow: "none",
                fontSize: "14px",
              }}
              className={`form-control`}
              type="text"
              id="register-firstname"
              value={fileName}
              onChange={(e) => {
                let value = e.target.value;

                // Check if the document name ends with .pdf
                // if (!value.toLowerCase().endsWith(".pdf")) {
                //   value += ".pdf";
                // }

                setFileName(value);
              }}
              // placeholder="John"
              autoFocus={true}
            />{" "}
            {/* <h3 style={{marginLeft: '10px'}} className="fw-bold">
              {documentName}
            </h3> */}
          </div>
          {/* <Input
            style={{
              height: '40px',
              boxShadow: 'none',
              fontSize: '16px',
            }}
            className={`form-control`}
            type="text"
            id="register-firstname"
            value={documentName}
            onChange={e => {
              setDocumentName(e.target.value);
            }}
            // placeholder="John"
            autoFocus
          /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBlock: "5px",
            }}
          >
            <Label className="form-label" for="register-firstname">
              {t("Signers")}
            </Label>{" "}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="signersList">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="signers-list"
                >
                  {signersData &&
                    signersData.map((signer, i) => (
                      <Draggable
                        key={signer.signer_id}
                        draggableId={signer.signer_id.toString()}
                        index={i}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="signer-item"
                            style={{
                              padding: "10px",
                              marginBottom: "10px",
                              backgroundColor: "#fff",
                              borderRadius: "4px",
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {" "}
                            <Row className="justify-content-between align-items-center">
                              <Col md={1} xs={1} className="mb-md-0 mb-1">
                                <div
                                  {...provided.dragHandleProps}
                                  onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent default focus behavior
                                  }}
                                  style={{
                                    marginTop: "5px",
                                    marginRight: "5px",
                                    width: "30px",
                                    height: "30px",
                                    cursor: "grab",
                                  }}
                                >
                                  <Menu />
                                </div>
                              </Col>
                              <Col md={1} xs={12} className="mb-md-0 mb-1">
                                <div
                                  style={{
                                    backgroundColor: `${signer?.color}`,
                                    marginTop: "5px",
                                    marginRight: "10px",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                ></div>
                              </Col>
                              <Col md={4} xs={12} className="mb-md-0 mb-1">
                                <h3
                                  className="form-label"
                                  htmlFor={`animation-item-name-${signer?.signer_id}`}
                                >
                                  {t("Signer Name")}
                                </h3>
                                <Input
                                  style={{
                                    fontSize: "16px",
                                    boxShadow: "none",
                                  }}
                                  name="name"
                                  type="text"
                                  // onFocus={(e) => e.stopPropagation()}
                                  id={`animation-item-name-${signer?.signer_id}`}
                                  value={signer?.name}
                                  onChange={(event) =>
                                    handleInputChange1(signer?.signer_id, event)
                                  }
                                  placeholder={signer?.placeholder}
                                />
                              </Col>
                              <Col md={6} xs={12} className="mb-md-0 mb-1">
                                <h3
                                  className="form-label"
                                  htmlFor={`animation-cost-${signer?.signer_id}`}
                                >
                                  {t("Email")}
                                </h3>
                                <div style={{ position: "relative" }}>
                                  <Input
                                    //  onFocus={(e) => e.stopPropagation()}
                                    style={{
                                      fontSize: "16px",
                                      boxShadow: "none",
                                      paddingRight: inputErrors[i]
                                        ? "20px"
                                        : "0",
                                    }}
                                    name="email"
                                    value={signer?.email}
                                    onChange={(event) =>
                                      handleInputChange1(
                                        signer?.signer_id,
                                        event
                                      )
                                    }
                                    type="email"
                                    id={`animation-cost-${signer?.signer_id}`}
                                    placeholder="signer@gmail.com"
                                  />
                                  {inputErrors[i] && (
                                    <div
                                      style={{
                                        color: "red",
                                        fontSize: "12px",
                                        position: "absolute",
                                        top: "100%",
                                        left: "0",
                                        marginTop: "2px",
                                        minHeight: "16px", // reserve space for the error message
                                      }}
                                    >
                                      {inputErrors[i]}
                                    </div>
                                  )}
                                </div>
                              </Col>

                              <Col sm={12}>
                                <hr />
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* {emailError && ( */}
          <div style={{ color: "red", fontSize: "12px" }}>{emailError}</div>
          {/* )} */}
          {/* {errorRequired ? <div style={{ color: 'red', fontSize: '12px', margin: "1%" }}>Email is required</div> : null} */}
          <Col
            md={12}
            xs={12}
            className="mb-md-0 mb-1"
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            {/* make checkbox and text as add mee as signer  */}
            <Input
              type="checkbox"
              id={`signer-checkbox`}
              checked={checkboxes}
              onChange={(event) => handleCheckboxChange(event)}
            />{" "}
            <label
              htmlFor={`signer-checkbox`} // Associate the label with the checkbox
              style={{
                fontSize: "14px",
                marginLeft: "5px",
                cursor: "pointer",
              }} // Make the cursor pointer for better UX
            >
              {t("Add me as signer")}
            </label>
          </Col>
          <Label className="form-label" for="register-firstname">
            {t("Subject")}
          </Label>
          <Input
            style={{
              // height: '40px',
              boxShadow: "none",
              fontSize: "14px",
            }}
            className={`form-control`}
            type="text"
            id="register-firstname"
            value={emailSubject}
            onChange={(e) => {
              setEmailSubject(e.target.value);
            }}
            // placeholder="John"
            autoFocus
          />
          <Label className="form-label" for="register-firstname">
            {t("Mesage")}
          </Label>
          <Input
            style={{
              height: "100px",
              boxShadow: "none",
              fontSize: "14px",
            }}
            className={`form-control`}
            type="textarea"
            id="register-firstname"
            value={emailMessage}
            onChange={(e) => {
              setEmailMessage(e.target.value);
            }}
            // placeholder="John"
            autoFocus
          />

          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginBottom: "1%",
              marginTop: "2%",
            }}
          >
            <Button
              color="primary"
              size="sm"
              style={{
                boxShadow: "none",
                marginBottom: "1%",
                marginTop: "2%",
              }}
              disabled={
                // email.length === 0 ||
                emailSubject?.length === 0 ||
                emailSubject === "" ||
                emailMessage?.length === 0 ||
                emailMessage === "" ||
                signersData.some((signer) => !signer.name || !signer.email)
                  ? true
                  : false
              }
              onClick={async () => {
                setAddFolderLoader(true);
                // await AddsignersData()
                const location = await getUserLocation();
                let email_d = user?.email;
                let user_id = user?.user_id;

                let email_name = `${
                  user?.first_name && user?.last_name
                    ? `${user?.first_name} ${user?.last_name}`
                    : user?.email
                }`;
                console.log(email_name);
                const name_sender =
                  user?.first_name && user.first_name.trim() !== ""
                    ? user.first_name
                    : user.email.split("@")[0];
                const postData = {
                  url_hashed: imageUrls,
                  user_id: user_id, //sender
                  signers: signersData, // signerd
                  message: emailMessage,
                  subject: emailSubject,
                  template_id: file_id,
                  title: `${fileName}`,
                  location_country: location.country,
                  ip_address: location.ip,
                  location_date: location.date,
                  timezone: location?.timezone,
                  email_user: user?.email, //sender
                  user_name_sender: name_sender, //sender
                };
                const apiData1 = await post(
                  "template/shareTemplates",
                  postData
                ); // Specify the endpoint you want to call
                console.log(apiData1);
                if (apiData1.error === true || apiData1.error === "true") {
                  toastAlert("error", apiData1.message);
                  setAddFolderLoader(false);
                } else {
                  //console.log(apiData1.url_data);
                  toastAlert("success", apiData1.message);

                  const user_id = user?.user_id;
                  const emailUser = user?.email;
                  const signerEmails = signersData
                    .map((signer) => signer.email)
                    .join(", ");
                  let response_log = await getActivityLogUserTempResp({
                    user_id: user_id,
                    email: user?.email,
                    file_id: apiData1.TemplateResponseId,
                    event: "TEMPLATE-SHARED",
                    user_shared_email: signerEmails,
                    description: `${emailUser} shared template ${firstPart} ${fileName} to email:${signerEmails}`,
                  });
                  if (response_log === true) {
                    //console.log('MAINTAIN LOG SUCCESS');
                  } else {
                    //console.log('MAINTAIN ERROR LOG');
                  }
                  // setAddFolderLoader(false);
                  setTimeout(() => {
                    // setSendTemplate(false);
                    window.location.href = "/template";
                  }, 2000);
                }
              }}
            >
              {addFolderLoader ? <Spinner color="light" size="sm" /> : null}
              <span style={{ fontSize: "16px" }} className="align-middle ms-25">
                {t("Send")}
              </span>
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default TemplateDocN;
