import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
import {
  Button,
  ButtonDropdown,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
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
  FormFeedback,
} from "reactstrap";
import {
  ArrowLeft,
  Check,
  Copy,
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
import ForYou from "../components/ForYou";
import ForOthers from "../components/ForOthers";
import { handlePlacePosition } from "../utility/EditorUtils/PlacePositions";
import toastAlert from "@components/toastAlert";
import Repeater from "@components/repeater";
import { SlideDown } from "react-slidedown";
import {
  formatDateCustom,
  formatDateInternational,
  formatDateUSA,
  getColorByIndex,
  handleDownloadPDFHereBulk,
} from "../utility/Utils";
import "react-resizable/css/styles.css";
import SignatureModalContent from "../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent";
import emptyImage from "@assets/images/pages/empty.png";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from "react-sortable-hoc";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import SidebarTypes from "./SidebarTypes";
import { BASE_URL, post, postFormData } from "../apis/api";
import ComponentForItemType from "../utility/EditorUtils/EditorTypesPosition.js/ComponentForItemType";
import useLogo from "@uselogo/useLogo";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// usama import
import { Rnd } from "react-rnd";
import ComponentRightSidebar from "../utility/EditorUtils/EditorTypesPosition.js/ComponentRightSidebar";
import ResizeCircle from "../utility/EditorUtils/EditorTypesPosition.js/ResizeCircle";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import CustomButton from "../components/ButtonCustom";
import getActivityLogUserBulk from "../utility/IpLocation/MaintainActivityLogBulkLink";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { decrypt } from "../utility/auth-token";
import {
  getUser,
  selectLoading,
  selectLogo,
  selectPrimaryColor,
} from "../redux/navbar";
import OverLayFullScreen from "../components/OverLayFullScreen";

const BulkLinkDocN = () => {
  const dispatch = useDispatch();
  const { user, plan, docuemntsCount, status, error } = useSelector(
    (state) => state.navbar
  );
  const primary_color = useSelector(selectPrimaryColor);

  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);
  const params = new URLSearchParams(location.search);
  const openValue = params.get("open");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [canvasWidth, setCanvasWidth] = useState(1250);
  // states
  const [link, setLink] = useState(null);
  const [MarkAsCompleted, setMarkAsCompleted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const [imageUrls, setImageUrls] = useState([]);
  const file_id = window.location.pathname.split("/")[2];
  const [savedCanvasData, setSavedCanvasData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [type, setType] = useState("");
  const [eventDataOnClick, setEventDataOnClick] = useState([]);
  const [selectedSigner, setSelectedSigner] = useState({
    color: "rgb(255 214 91 / 78%)",
    signer_id: 123,
    name: "Rim",
    email: "rim",
  });
  const CompletedDocument = async () => {
    setLoadingComplete(true);
    setLoadingSendDocument(true);
    const data = window.location.pathname.split("/")[2];
    console.log(data);

    const user_id = user?.user_id;
    const email = user?.email;
    console.log(file_id);
    let response_log = await getActivityLogUserBulk({
      user_id: user_id,
      file_id: file_id,
      email: email,
      event: "PUBLIC-FORM-COMPLETED",
      description: `${email} Completed Editing Public Form ${fileName}`,
    });
    console.log("response_log");

    console.log(response_log);
    if (response_log === true) {
      console.log("MAINTAIN LOG SUCCESS");
    } else {
      console.log("MAINTAIN ERROR LOG");
    }
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
    const filteredTextItems = cleanedTextItems.filter((item) =>
      specifiedTypes.includes(item.type)
    );
    console.log(filteredTextItems);
    const nonSpecifiedTextItems = cleanedTextItems.filter(
      (item) => !specifiedTypes.includes(item.type)
    );
    console.log(nonSpecifiedTextItems);

    let ActivityLogDetails = await getFunctionTemplateAuditLog();
    console.log(ActivityLogDetails);
    // setDownloadPdfLoader(false)
    await handleDownloadPDFHereBulk({
      setDownloadPdfLoader: setLoadingSendDocument,
      imageUrls,
      textItems: filteredTextItems,
      // textItems,

      canvasWidth,
      UniqIdDoc: uniq_id,

      ActivityLogData: response_log,
      fileName,
      file_id,
      imageUrlsCount: null,
      user_id: DocUserId,
      doc_completed: false,
    });
    await saveDataSigning(nonSpecifiedTextItems);
    setLoadingSendDocument(false);
    // // timeoutn for 1 second
    setTimeout(() => {
      window.location.href = `/public_forms?toastAlert=${file_id}&name=${fileName}`;
    }, 1000);
  };

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
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [inputValue, setInputValue] = useState(null);
  const [signersData, setSignersData] = useState([]);
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
  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);
  const zoomOptions = [0.5, 0.75, 0.85, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [zoomPercentage, setZoomPercentage] = useState(100);
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
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };
  //  usama states and working
  // list started100%

  const [fields, setFields] = useState([]);
  const [appendEnable, setAppendEnable] = useState(false);

  const handleUpdateField = (id, type, x, y) => {
    // setFields(
    // //console.log('poasition');

    // //console.log(textItems);
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

  const handleDeleteField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };
  const [initialBox, setInitialBox] = useState(false);

  const handleCanvasClick = (e, page_no) => {
    let clickedPageNumber = page_no;
    setPageNumber(page_no);
    if (appendEnable == true) {
      // Get the position of the click relative to the canvas
      const canvasRect = canvasRefs.current[page_no - 1];
      const canvas = canvasRect.current;
      const rect = canvasRect.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
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
        input.accept = "image/png";
        input.onchange = (e) => handleImageChange(e, arrayObj, type, page_no);
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
            "rgb(255 214 91 / 78%)",
            "null",
            123,
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
          // setType("");
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
          //console.log(resultingData);
          // setSavedCanvasData([...savedCanvasData, resultingData])
          setResizingIndex(textItems.length);
          setIsResizing(true);
          setEditedItem(resultingData);
          setTextItems([...textItems, resultingData]);

          // setTextItems([...textItems, { x, y, page: pageNumber, text: "TEXT" }]);
          // setClickPosition({ x, y });
          setClickPosition({ x: x, y: y });

          // setType("");
        }
      }
    }
  };
  const [hoveredStateDummyType, setHoveredStateDummyType] = useState("");
  const [hoveredStateDummyIndex, setHoveredStateDummyIndex] = useState("");

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
  const colRef = useRef(null);

  const handlePageClick = (page) => {
    // setIsLoadingDoc(true);
    // setTimeout(() => {
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

    // Find the corresponding full-page view element
    // const fullPageElement = document.getElementById(`full-page-${page}`);

    // // Scroll the full-page view to the clicked page
    // if (fullPageElement) {
    //   fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    // }
    // // setIsLoadingDoc(false);
    // // }, 1000);
  };
  // Define the dropdownOpen state

  const [modalOpenDropdown, setModalOpenDropdown] = useState(false);
  // start
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const fetchData = async (fileId) => {
    // get Images from db
    const postData = {
      bulk_link_id: fileId,
    };
    const apiData = await post("file/getbgImagesByFileId", postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
    if (apiData.error) {
    } else {
      setImageUrls(apiData.result[0].image);
    }
  };
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
    //console.log('Position Data');

    //console.log(apiData);
    if (apiData.error) {
    } else {
      //console.log('positions');
      //console.log(apiData.result);

      setTextItems(apiData.result[0].position_array);
    }
  };

  // stepper
  const deleteFormReceipient = (e) => {
    e.preventDefault();
    const slideDownWrapper = e.target.closest(".react-slidedown"),
      form = e.target.closest("form");
    if (slideDownWrapper) {
      slideDownWrapper.remove();
    } else {
      form.remove();
    }
  };
  const increaseCount = () => {
    // Check if all fields are filled
    if (signersData.some((signer) => !signer.name || !signer.email)) {
      alert("Please fill all fields.");
      return;
    }

    // Check if there are any input errors
    if (inputErrors.some((error) => error)) {
      alert("Please fix the errors.");
      return;
    }
    // push empty object to signers array
    const color_code = getColorByIndex(count);
    // const color_code = getColorByIndex(count);
    // let color_rgb=`rgb(${color_code}/78%)`

    // 'rgb(255 214 91 / 78%)'
    // //console.log(color_code);
    if (count === 8) {
      //console.log('Max Size Signer Filled');
    } else {
      setSignersData([
        ...signersData,
        {
          order_id: signersData.length + 1,
          name: "",
          email: "",
          color: color_code,
        },
      ]);
      setCount(count + 1);
    }
  };
  const increaseCountReceipient = () => {
    //console.log(countReceipient);
    if (countReceipient === 0) {
      setRecipientsData([...RecipientsData, { name: "", email: "" }]);
      setCountReceipient(countReceipient + 1);
    } else {
      setRecipientsData([
        ...RecipientsData,
        { id: RecipientsData.length + 1, name: "", email: "" },
      ]);

      setCountReceipient(countReceipient + 1);
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
    //console.log(savedCanvasData);
    let user_id = user?.user_id;
    let email = user?.email;
    const location = await getUserLocation();
    const postData = {
      bulk_link_id: file_id,
      // position_array: savedCanvasData
      position_array: textItems,
      email: email,
      file_name: fileName,
      location_country: location.country,
      ip_address: location.ip,
      location_date: location.date,
      timezone: location?.timezone,
    };
    try {
      const apiData = await post(
        "bulk_links/saveCanvasDataWithBulk_LinkId",
        postData
      ); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');

      //console.log(apiData);
      if (apiData.error) {
        setsaveLoading(false);
        setSaveSuccess(false);
      } else {
        setSaveSuccess(true);

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "BULK-LINK-COMPLETED",
          description: `${email} complted editing public form ${fileName}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
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
      signersData.some((signer, index) => signer.email === value && index !== i)
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
  const sendToEsignApi = async () => {
    // api to update name of file
    // update_email_content()
    await AddSignersData();
    await AddRecipientsData();
    //console.log(inputValue);
    const postData = {
      file_id: file_id,
      email_subject: emailSubject,
      signer_functional_controls: signerFunctionalControls,
      secured_share: securedShare,
      set_esigning_order: EsignOrder,
      email_message: emailMessage,
      name: inputValue,
    };
    try {
      const apiData = await post("file/send-doc-to-esign", postData); // Specify the endpoint you want to call
      //console.log('Update File Controls ');
      //console.log(apiData);
      if (apiData.error) {
        toastAlert("error", apiData.message);
        // setFileName("")
        // setInputValue("")
        setLoadingSendDocument(false);
      } else {
        // //console.log(apiData.result)
        toastAlert("succes", apiData.message);
        // setFileName(apiData.data.name)
        // setInputValue(apiData.data.name)
        setLoadingSendDocument(false);
        setSendToEsign(false);
        window.location.href = "/home";
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setLoadingSendDocument(false);
    }
  };
  // Fetch File
  const [uniq_id, setUniq_id] = useState("");
  const [DocUserId, setDocUserId] = useState("");
  const fetchFileData = async (fileId) => {
    // get Images from db
    const postData = {
      bulk_link_id: fileId,
      user_id: user?.user_id,
    };
    const apiData = await post("bulk_links/viewBulkLinkEditor", postData); // Specify the endpoint you want to call
    console.log("File Dta Fetch");

    console.log(apiData);
    if (apiData.error) {
      window.location.href = "/error";
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      setFileName(apiData.result.file_name || "");
      const dataEdit = apiData.result.editable;
      console.log("editable ");
      console.log(dataEdit);

      if (dataEdit === false || dataEdit === "false") {
        setEditingTemp(false);
      } else {
        setEditingTemp(true);
      }
      setImageUrls(apiData.result.file_url);
      setLink(apiData.result.url);
      setUniq_id(apiData.result.uniq_id);
      setDocUserId(apiData.result.user_id);

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
  const fetchRecipientsData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post("file/getAllRecipientsByFileId", postData); // Specify the endpoint you want to call
      //console.log('Recipients');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === "true") {
        setRecipientsData([]);
        setCountReceipient(apiData.result.length);
      } else {
        setRecipientsData(apiData.result);
        setCountReceipient(apiData.result.length);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
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

  const SortableItem = SortableElement(({ value, i }) => {
    const Tag = i === 0 ? "div" : SlideDown;
    return (
      <Tag key={i} style={{ zIndex: 9999 }}>
        <Form>
          <Row
            style={{ position: "relative" }}
            className="d-flex justify-content-between align-items-center"
          >
            {EsignOrder ? (
              <Col
                md={1}
                className="mb-md-0 mb-1 d-flex justify-content-center align-items-center"
                style={{ cursor: "pointer" }}
              >
                <DragHandle />
              </Col>
            ) : null}
            <Col md={3} className="mb-md-0 mb-1">
              <h3
                style={{ fontSize: "16px" }}
                className="form-label"
                for={`animation-item-name-${i}`}
              >
                Name
              </h3>

              <Input
                style={{
                  fontSize: "16px",
                  boxShadow: "none",
                }}
                type="text"
                name="name"
                id={`animation-item-name-${i}`}
                placeholder="Signer "
                value={signersData[i].name}
                onChange={(event) => handleInputChange(i, event)}
              />
            </Col>
            <Col md={4} className="mb-md-0 mb-1">
              <h3
                style={{ fontSize: "16px" }}
                className="form-label"
                for={`animation-cost-${i}`}
              >
                Email
              </h3>
              <Input
                style={{
                  fontSize: "16px",
                  boxShadow: "none",
                }}
                name="email"
                value={signersData[i].email}
                onChange={(event) => handleInputChange(i, event)}
                type="email"
                id={`animation-cost-${i}`}
                placeholder="signer@gmail.com"
              />
            </Col>
            <Col md={1} style={{ marginTop: "10px" }}>
              {signersData[i].access_code === null ||
              signersData[i].access_code === undefined ||
              signersData[i].access_code === "" ? (
                <Unlock size={20} />
              ) : (
                <Lock size={20} />
              )}
            </Col>
            <Col
              md={3}
              className="mb-md-0 mb-1 mt-2"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* {isInputVisible && i === activeRow ? (
                <> */}
              {/* <div style={{position: isInputFocused ? 'absolute' : 'static', top: 18, left: '66%', width: '85px'}}>
                    <Input
                      autoFocus={false}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      style={{
                        fontSize: '16px',
                        boxShadow: 'none',
                        marginTop: '5px',
                      }}
                      type="text"
                      maxLength={6} // Maximum 6 characters allowed
                      value={inputValueAccessCode}
                      onChange={e => {
                        setInputValueAccessCode(e.target.value);
                      }}
                    />
                  </div> */}

              {/* <Button
                    size="sm"
                    style={{marginLeft: '10px', height: '40px'}}
                    color="success"
                    className="text-nowrap px-1"
                    outline
                    onClick={() => handleCheckClickAccessCode(signersData[i].signer_id, i)}>
                    {isLoading ? <Spinner size="sm" /> : <Check size={15} />}
                  </Button>
                  <Button
                    size="sm"
                    style={{marginLeft: '10px', height: '40px'}}
                    color="danger"
                    className="text-nowrap px-1"
                    outline
                    onClick={() => handleCloseClick(signersData[i].signer_id, i)}>
                    <Trash2 size={15} />
                  </Button>
                  <FormFeedback>Access Code cannot be empty</FormFeedback> */}
              {/* </>
              // ) : (
                <>
                  
                </>
              // )} */}
              {signersData[i].access_code === null ||
              signersData[i].access_code === undefined ||
              signersData[i].access_code === "" ? (
                <Button
                  size="sm"
                  color="success"
                  className="text-nowrap px-1"
                  outline
                  onClick={() => {
                    setInputValueAccessCode("");
                    handleButtonClick();
                    setActiveRow(i);
                  }}
                >
                  <Plus size={14} />
                  <span style={{ fontSize: "16px" }}> Access Code</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  color="success"
                  className="text-nowrap px-1"
                  outline
                  onClick={() => {
                    setInputValueAccessCode(signersData[i].access_code);
                    // handleButtonClick();
                    // setSigner_idAccesCode()
                    setIsInputVisible(true);
                    setActiveRow(i);
                  }}
                >
                  <Edit2 size={14} />
                  <span style={{ fontSize: "16px" }}> Modify Code</span>
                </Button>
              )}
            </Col>
            <Col sm={12}>
              <hr />
            </Col>
          </Row>
        </Form>
      </Tag>
    );
  });
  const SortableItem1 = SortableElement(({ value, i }) => {
    const Tag = i === 0 ? "div" : SlideDown;
    return (
      <Tag key={i} style={{ zIndex: 9999 }}>
        <Form>
          <Row
            style={{ position: "relative" }}
            className="d-flex justify-content-between align-items-center"
          >
            {EsignOrder ? (
              <Col
                md={2}
                className="mb-md-0 mb-1 d-flex justify-content-left align-items-center"
                style={{ cursor: "all-scroll" }}
              >
                <DragHandle1 />
                <h4>{signersData[i].order_id}</h4>
              </Col>
            ) : null}
            <Col
              md={10}
              className="mb-md-0 mb-1"
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: `${signersData[i].color}`,
                  // marginTop: '25px',
                  marginRight: "10px",
                  width: "20px",
                  height: "20px",
                }}
              ></div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h5
                  style={{ fontSize: "13px" }}
                  className="form-label"
                  for={`animation-item-name-${i}`}
                >
                  {signersData[i].name}
                </h5>
                <h5
                  style={{ fontSize: "12px" }}
                  className="form-label"
                  for={`animation-cost-${i}`}
                >
                  {signersData[i].email}
                </h5>{" "}
              </div>
            </Col>

            <Col sm={12}>
              <hr />
            </Col>
          </Row>
        </Form>
      </Tag>
    );
  });
 
  const [isOpenCanvas, setIsOpenCanvas] = useState(false);
  const [isOpenCanvasPages, setIsOpenCanvasPages] = useState(false);

  // end
  const canvasRef = useRef();
  const canvasRefs = useRef([]);

  // useEffect(() => {
  //   const updateCanvasWidth = () => {
  //     const pdfPage = document.querySelector('.react-pdf__Page__canvas');
  //     if (pdfPage) {
  //       const {width} = pdfPage.getBoundingClientRect();
  //       setCanvasWidth(width);
  //       //console.log('widtAAAAAAAAAAAAAAAAAAh');
  //       //console.log(width);
  //     }
  //   };
  //   window.addEventListener('resize', updateCanvasWidth);
  //   updateCanvasWidth();
  //   return () => window.removeEventListener('resize', updateCanvasWidth);
  // }, []);

  // Not working // Disturbing the Positions
  // const adjustZoomPercentage = () => {
  //   const screenWidth = window.innerWidth;
  //   // Adjust zoom percentage based on screen width
  //   if (screenWidth <= 768) {
  //     setZoomPercentage(50); // Zoom level for small screens
  //   } else if (screenWidth <= 1024) {
  //     setZoomPercentage(75); // Zoom level for medium screens
  //   } else {
  //     setZoomPercentage(110); // Default zoom level for larger screens
  //   }
  // };

  // // useEffect to update zoomPercentage on component mount and when viewport width changes
  // useEffect(() => {
  //   adjustZoomPercentage();

  // }, []);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const getFunctionTemplateAuditLog = async () => {
    // setImageUrls(apiData.result[0].image);
    // setLoaderResponseFetch1(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      bulk_link_id: file_id,
    };
    const apiData = await post("bulk_links/viewBulkLinkAuditLog", postData); // Specify the endpoint you want to call
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
  }, []); // Empty dependency array ensures the effect runs only once
  const [editingTemp, setEditingTemp] = useState(true);
  // start
  const [loadedPages, setLoadedPages] = useState([1, 2, 3, 4, 5]); // Manage loaded pages
  const [loadingP, setLoadingP] = useState(false); // Loading state
  const scrollContainerRefCol2 = useRef(null); // Ref for the scrollable container inside col 2 (thumbnails)
  const [endPage, setEndPage] = useState(5);
  const [startPage, setStartPage] = useState(0);

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
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            fetchFileData(file_id),
            fetchDataPositions(file_id),
          ]);
          console.log("REDUC SH");

          setIsLoaded(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoaded(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, status]);
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
    } else {
      window.location.href = "/login";
    }
  }, [dispatch, user]);

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
  };

  const handleDownloadPDF = async () => {
    setsaveLoading(true);
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
    setsaveLoading(false);
  };
  const [isLoaded, setIsLoaded] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [resizing, setResizing] = useState(false);
  const handleDoubleClick = (index, item) => {
    setResizingIndex(index);
    setEditedItem(item);
    setIsResizing(true);
    //console.log('double click ');
  };

  const [editedItem, setEditedItem] = useState();
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setIsLoaded(false);
  //   }, 3000);

  //   // Cleanup function to clear the timeout in case component unmounts before 1 second
  //   return () => clearTimeout(timeoutId);
  // }, []); // Empty dependency array to run effect only once
  const saveDataSigning = async (filteredTextItems) => {
    // setUnsavedChanges(false);
    console.log("file_id");

    console.log(file_id);
    setsaveLoading(true);
    const postData = {
      bulk_link_id: file_id,
      // position_array: savedCanvasData
      position_array: filteredTextItems,
    };
    try {
      const apiData = await post(
        "bulk_links/updateBulkLinkPositions",
        postData
      ); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');
      console.log("POSITIONS");

      console.log(apiData);
      if (apiData.error) {
        setsaveLoading(false);
        setSaveSuccess(false);
      } else {
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
      {isLoaded ? <FullScreenLoader /> : null}
      {window.innerWidth < 786 ? (
        <>
          <OverLayFullScreen />
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
                        marginLeft: "20px",
                        marginRight: "20px",
                      }}
                    />
                    <h4 className="fw-bold" style={{ marginTop: "10px" }}>
                      {fileName.length > 10
                        ? fileName.substring(0, 10) + "..."
                        : fileName}
                      .pdf
                    </h4>
                  </div>
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
          {" "}
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
                              "Finished editing the form? Please confirm if you're done or wish to continue."
                            )
                          ) {
                            setLoadingSendDocument(true);

                            const data = window.location.pathname.split("/")[2];
                            console.log(data);

                            const user_id = user?.user_id;
                            const email = user?.email;
                            console.log(file_id);
                            let response_log = await getActivityLogUserBulk({
                              user_id: user_id,
                              file_id: file_id,
                              email: email,
                              event: "PUBLIC-FORM-COMPLETED",
                              description: `${email} Completed Editing Public Form ${fileName}`,
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
                            console.log(nonSpecifiedTextItems);

                            let ActivityLogDetails =
                              await getFunctionTemplateAuditLog();
                            console.log(ActivityLogDetails);
                            // setDownloadPdfLoader(false)
                            await handleDownloadPDFHereBulk({
                              setDownloadPdfLoader: setLoadingSendDocument,
                              imageUrls,
                              textItems: filteredTextItems,
                              // textItems,

                              canvasWidth,
                              UniqIdDoc: uniq_id,

                              ActivityLogData: ActivityLogDetails,
                              fileName,
                              file_id,
                            });
                            await saveDataSigning(nonSpecifiedTextItems);
                            setLoadingSendDocument(false);
                            // // timeoutn for 1 second
                            setTimeout(() => {
                              window.location.href = `/public_forms?toastAlert=${file_id}&name=${fileName}`;
                            }, 1000);
                          } else {
                            return;
                          }
                        } else {
                          window.location.href = `/public_forms`;
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
                          <span className="align-middle ms-25">Back</span>
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
                      style={{ marginLeft: "10px", marginTop: "5px" }}
                    >
                      Public Form : {fileName}.pdf
                    </h2>
                  </div>
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
                      disabled={saveLoading}
                      color="orange"
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
                          {saveLoading ? (
                            <Spinner color="white" size="sm" />
                          ) : null}
                          <span className="align-middle ms-25">
                            Download Original
                          </span>
                        </>
                      }
                    />
                    {editingTemp ? (
                      <>
                        {/* <Button
                    // disabled={signersData.length === 0 ? true : false}
                    color="primary"
                    onClick={async () => {
                      await saveData();
                      window.location.href = `/public_forms?toastAlert=${link}&name=${fileName}`;
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
                      Finish
                    </span>
                  </Button> */}
                        <CustomButton
                          padding={true}
                          secondary_color_data={true}
                          size="sm"
                          disabled={loadingSendDocument}
                          color="primary"
                          onClick={async () => {
                            console.log(signersData)
                            // const firstMissingTextItemSigner = signersData.find(
                            //   (signer) => !textItems.some((item) => item.signer_id === signer.signer_id)
                            // );
                          
                            if (textItems.length===0) {
                              toastAlert(
                                "error",
                                `Please add atleast one field for signer `
                              );
                              console.log("First signer without text item:", firstMissingTextItemSigner);
                            }else{
                            setMarkAsCompleted(true);
                            }
                            // if (editingTemp) {
                            //   if (
                            //     window.confirm(
                            //       "Are you sure you sure you want to complete that document?"
                            //     )
                            //   ) {
                            //     setLoadingSendDocument(true);

                            //     const data = window.location.pathname.split("/")[2];
                            //     console.log(data);
                            //     const user_id_local = JSON.parse(
                            //     );
                            //     const user_id = user_id_local.token.user_id;
                            //     const email = user_id_local.token.email;
                            //     console.log(file_id);
                            //     let response_log = await getActivityLogUserBulk({
                            //       user_id: user_id,
                            //       file_id: file_id,
                            //       email: email,
                            //       event: "PUBLIC-FORM-COMPLETED",
                            //       description: `${email} Completed Editing Public Form ${fileName}`,
                            //     });
                            //     console.log("response_log");

                            //     console.log(response_log);
                            //     if (response_log === true) {
                            //       console.log("MAINTAIN LOG SUCCESS");
                            //     } else {
                            //       console.log("MAINTAIN ERROR LOG");
                            //     }
                            //     const specifiedTypes = [
                            //       "my_text",
                            //       "my_signature",
                            //       "my_initials",
                            //       "date",
                            //       "checkmark",
                            //       "highlight",
                            //       "stamp",
                            //     ];
                            //     const filteredTextItems = textItems.filter((item) =>
                            //       specifiedTypes.includes(item.type)
                            //     );
                            //     console.log(filteredTextItems);
                            //     const nonSpecifiedTextItems = textItems.filter(
                            //       (item) => !specifiedTypes.includes(item.type)
                            //     );
                            //     console.log(nonSpecifiedTextItems);

                            //     let ActivityLogDetails =
                            //       await getFunctionTemplateAuditLog();
                            //     console.log(ActivityLogDetails);
                            //     // setDownloadPdfLoader(false)
                            //     await handleDownloadPDFHereBulk({
                            //       setDownloadPdfLoader: setLoadingSendDocument,
                            //       imageUrls,
                            //       textItems: filteredTextItems,
                            //       // textItems,

                            //       canvasWidth,
                            //       UniqIdDoc: uniq_id,

                            //       UniqIdDoc: uniq_id,
                            //       ActivityLogData: ActivityLogDetails,
                            //       fileName,
                            //       file_id,
                            //     });
                            //     await saveDataSigning(nonSpecifiedTextItems);
                            //     setLoadingSendDocument(false);
                            //     // // timeoutn for 1 second
                            //     setTimeout(() => {
                            //       window.location.href = `/bulk_links?toastAlert=${file_id}&name=${fileName}`;
                            //     }, 1000);
                            //   } else {
                            //     return;
                            //   }
                            // } else {
                            //   window.location.href = `/bulk_links`;
                            // }
                            // await saveData();
                            // window.location.href = `/bulk_links?toastAlert=${link}&name=${fileName}`;
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
                              <span className="align-middle ms-25">Finish</span>
                            </>
                          }
                        />
                      </>
                    ) : null}

                    {/* )}
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
                >
                  {/* For you For Others  */}
                  {/* {statusFile === 'InProgress' ? ( */}
                  {editingTemp ? (
                    <div>
                      <Nav className="justify-content-center">
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
                            For Others
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
                  {/* ) : null} */}
                </Col>

                {sendToEsign === false &&
                  modalOpen === false &&
                  modalOpenDropdown === false &&
                  itemDeleteConfirmation === false &&
                  signerAddEdit === false &&
                  MarkAsCompleted === false &&
                  SignatureModal === false && (
                    <SidebarTypes
                      selectedSigner={{ color: "rgb(255 214 91 / 78%)" }}
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
                    // maxHeight: '87dvh',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                            <div
                              key={page}
                              id={`full-page-${page}`}
                              style={{ marginBottom: "20px" }}
                            >
                              <Page
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                key={page}
                                scale={scale}
                                pageNumber={page}
                                canvasRef={(ref) =>
                                  (canvasRefs.current[page - 1] = ref)
                                }
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
                                onClick={(e) => handleCanvasClick(e, page)}
                                onLoadSuccess={({ width }) => {
                                  setCanvasWidth(width);
                                }}
                                // width={canvasWidth}
                                // className={activePage === page ? 'active-page' : ''}
                                // onClick={() => handlePageClick(page)}
                              >
                                {/* <canvas
                            id={`full-page-${page}`}
                            onMouseMove={() => setPageNumber(page)}
                            ref={ref => (canvasRefs.current[page - 1] = ref)}
                            onClick={e => handleCanvasClick(e, page)}
                            style={{
                              border: '1px solid lightgrey',
                              width: canvasWidth,
                              height: '100%',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              zIndex: 1,
                            }}
                          />{' '} */}
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
                                          : "hidden", // Hide/show based on condition
                                      transform: `translate(${field.x}px, ${field.y}px)`,

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
                                    //   handleUpdateField(field.id, field.type, originalX, originalY);
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
                                      const width =
                                        parseInt(ref.style.width, 10) / scale;
                                      const height =
                                        parseInt(ref.style.height, 10) / scale;

                                      const newX = position.x / scale;
                                      const newY = position.y / scale;

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
                                      // const width = (parseInt(ref.style.width, 10) / zoomPercentage) * 100;
                                      // const height = (parseInt(ref.style.height, 10) / zoomPercentage) * 100;
                                      // handleUpdateFieldResize(field.id, field.type, width, height);
                                      //console.log(position);
                                    }}
                                    resizeHandleClasses={{
                                      topLeft: "resize-handle",
                                      topRight: "resize-handle",
                                      bottomLeft: "resize-handle",
                                      bottomRight: "resize-handle",
                                    }}
                                    bounds="parent"
                                  >
                                    {isResizing &&
                                      resizingIndex === index &&
                                      editingTemp === true && (
                                        <>
                                          <ResizeCircle
                                            position={{ top: -10, right: -10 }}
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
                                              position={{ top: -10, right: 20 }}
                                              onClick={() => {
                                                setEventDataOnClick({
                                                  x: field.x,
                                                  y: field.y,
                                                });
                                                setActivePage(field.bgImg);
                                                setUpdatedSignatureIndex(index);
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
                                              position={{ top: -10, right: 20 }}
                                              onClick={() => {
                                                setEventDataOnClick({
                                                  x: field.x,
                                                  y: field.y,
                                                });
                                                setActivePage(field.bgImg);
                                                setUpdatedSignatureIndex(index);
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
                                              position={{ top: -10, right: 15 }}
                                              onClick={() => {
                                                setEventDataOnClick({
                                                  x: field.x,
                                                  y: field.y,
                                                });
                                                setActivePage(field.bgImg);
                                                setUpdatedSignatureIndex(index);
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
                                            field.type !== "signer_checkmark" &&
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
                                        signerObject={{
                                          color: "rgb(255 214 91 / 78%)",
                                          signer_id: 123,
                                          name: "Rim",
                                          email: "rim",
                                        }}
                                        zoomPercentage={scale}
                                      />
                                    </div>
                                  </Rnd>
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
                  editingTemp === true &&
                  editedItem.type != "my_signature" &&
                  editedItem.type != "my_initials" &&
                  editedItem.type != "checkmark" &&
                  // editedItem.type != 'signer_checkmark' &&
                  // editedItem.type != 'signer_radio' &&

                  editedItem.type != "highlight" &&
                  editedItem.type != "stamp" ? (
                    <>
                      {/* {editedItem?.id} */}
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
                        handleTextDecorationChange={handleTextDecorationChange}
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
                        handleCharacterLimitChange={handleCharacterLimitChange}
                      />
                    </>
                  ) : (
                    <>
                      <div
                        ref={scrollContainerRefCol2}
                        style={{ overflowY: "auto", maxHeight: "93dvh" }}
                      >
                         <div
                              // ref={scrollContainerRefCol2}
                              // style={{ overflowY: "auto", maxHeight: "93dvh",
                              
                              //  }}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                        <div style={{padding: "20px" }}>
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
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    width: "180px",
                                    height: "auto", // Let the height adjust based on content
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
                                  Page {page}
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
        text="Have you finished editing form? Please confirm if you're done or wish to continue."
      />
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteItemFromCanvas}
        alertStatusDelete={"delete"}
        text="Are you sure you want to remove this item?"
      />
      {/* send to e-sign  */}
      <Modal
        isOpen={sendToEsign}
        toggle={() => setSendToEsign(!sendToEsign)}
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
                <h1 className="fw-bold"> Document Ready for sharing</h1>
                <X
                  size={24}
                  onClick={() => setSendToEsign(!sendToEsign)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <h3>Copy Link</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Input
                  style={{ flexGrow: 1, marginRight: "10px" }}
                  type="text"
                  id="link"
                  value={link}
                  readOnly
                />
                <Button
                  style={{ boxShadow: "none" }}
                  size="sm"
                  color="primary"
                  onClick={async () => {
                    await saveData();
                    navigator.clipboard.writeText(link);
                    toastAlert("success", "Link Copied to Clipboard");

                    // toastAlert("success", "You can Edit document ")

                    setTimeout(() => {
                      setSendToEsign(!sendToEsign);
                      window.location.href = `/public_forms`;
                    }, 2000);
                  }}
                >
                  <Copy size={20} />
                </Button>
              </div>
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
                <h1 className="fw-bold"> Add Access Code</h1>
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
                  Save
                </span>
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default BulkLinkDocN;
