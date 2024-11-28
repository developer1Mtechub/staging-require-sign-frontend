import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
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
  UncontrolledTooltip,
} from "reactstrap";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import {
  ArrowLeft,
  Check,
  Download,
  Edit2,
  Info,
  Menu,
  MoreVertical,
  Plus,
  Save,
  Send,
  Trash2,
  X,
  XCircle,
} from "react-feather";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  handleDownloadPDFHere,
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
import { post, postFormData } from "../apis/api";
import ComponentForItemType from "../utility/EditorUtils/EditorTypesPosition.js/ComponentForItemType";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// usama import
import { Rnd } from "react-rnd";
import ComponentRightSidebar from "../utility/EditorUtils/EditorTypesPosition.js/ComponentRightSidebar";
import ResizeCircle from "../utility/EditorUtils/EditorTypesPosition.js/ResizeCircle";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import useLogo from "@uselogo/useLogo";
import ComponentRightSidebarSS from "../utility/EditorUtils/EditorTypesPosition.js/ComponentRightSidebarSS";
import ImageCropperModal from "../components/ImageCropperModal";
import { useSelector } from "react-redux";
import CustomButton from "../components/ButtonCustom";
import DropdownCustom from "../components/DropdownCustom";
import ModalReusable from "../components/ModalReusable";
import { useTranslation } from "react-i18next";
import { decrypt } from "../utility/auth-token";
import { useDispatch } from "react-redux";
import {
  getUser,
  selectLoading,
  selectLogo,
  selectPrimaryColor,
  selectSecondaryColor,
  selectUser,
} from "../redux/navbar";
import OverLayFullScreen from "../components/OverLayFullScreen";
const EditorMain = () => {
  const dispatch = useDispatch();
  const colRef = useRef(null);
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);
  const primary_color = useSelector(selectPrimaryColor);
  const { user, status, error } = useSelector((state) => state.navbar);
  // const user = useSelector(selectUser);
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [canvasWidth, setCanvasWidth] = useState("100%");
  // const [canvasWidth, setCanvasWidth] = useState(window.innerWidth < 786 ? 500 : 1250);
  // const [canvasWidth, setCanvasWidth] = useState(window.innerWidth<786?window.innerWidth:1250);

  // states
  const [startPage, setStartPage] = useState(0);
  const [endPage, setEndPage] = useState(5);
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
  };
  const [imageUrls, setImageUrls] = useState([]);
  const file_id = window.location.pathname.split("/")[2];
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [type, setType] = useState("");
  const [eventDataOnClick, setEventDataOnClick] = useState([]);
  const [selectedSigner, setSelectedSigner] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);

  const [sendToEsign, setSendToEsign] = useState(false);
  const [itemDeleteConfirmationR, setItemDeleteConfirmationR] = useState(false);
  const [itemDeleteConfirmation12, setItemDeleteConfirmation12] =
    useState(false);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState("");
  const [loadingDelete, setloadingDelete] = useState(false);
  const [active, setActive] = useState("1");
  const [signerAddEdit, setSignerAddEdit] = useState(false);
  const [count, setCount] = useState(0);
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
  const [dropdownOpen1, setDropdownOpen1] = useState(false);

  const [indexDataOnClick, setIndexDataOnClick] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [onlySigner, setOnlySigner] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const elementRefCursor = useRef(null);
  const [activePage, setActivePage] = useState(1);
  const [resizingIndex, setResizingIndex] = useState(null);
  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(true);
  const [zoomPercentage, setZoomPercentage] = useState(100);

  // const [zoomPercentage, setZoomPercentage] = useState(window.innerWidth<786?70:100);

  const defaultFontSize = 12;
  const defaultFontFamily = "Helvetica";
  const defaultFontWeight = 400;
  const defaultFontStyle = "normal";
  const RequiredField = true;

  const defaultTextDecoration = "none";

  const [stateMemory, setStateMemory] = useState({
    fontSize: defaultFontSize,
    fontFamily: defaultFontFamily,
    fontWeight: defaultFontWeight,
    fontStyle: defaultFontStyle,
    textDecoration: defaultTextDecoration,
    required: RequiredField,
  });

  //  usama states and working
  // list started100%

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
  const calculateTextWidth = (text, font = "16px Arial") => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font; // Ensure this matches your input field's style
    return context.measureText(text).width;
  };
  const handleUpdateFieldResize = (id, type, width, height, x, y) => {
    // Issue
    console.log(width);
    setTextItems(
      textItems.map((field, index) => {
        if (field.id === id) {
          if (type === "my_text" || type === "date" || type === "signer_date") {
            return { ...field, width };
            //   const text = field.text || ""; // Text content of the field
            // const textWidth = calculateTextWidth(text, "16px Arial"); // Measure the text width
            // const padding = 5; // Small padding to ensure a good fit
            // const minWidth = Math.max(textWidth + padding, 50); // Minimum width to prevent shrinking too much

            // // Debug logs
            // console.log(`Text: ${text}`);
            // console.log(`Calculated Text Width: ${textWidth}`);
            // console.log(`Final Width: ${Math.max(width, minWidth)}`);
            // return { ...field, width: Math.max(width, minWidth) };
            // const textWidth = calculateTextWidth(field.text || ""); // field.value contains the typed text
            // const widthD=textWidth*scale
            // const minWidth = Math.max(widthD, 50); // Ensure a minimum of 50px even for empty text

            // return { ...field, width: Math.max(width, minWidth) };
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
  const [EsignOrderModal, setEsignOrderModal] = useState(false);
  const [initialBox, setInitialBox] = useState(false);
  const [selectedOption, setSelectedOption] = useState("text");

  const handleCanvasClick = (e, page_no) => {
    setUnsavedChanges(true);
    console.log("canvas");

    let clickedPageNumber = page_no;
    setPageNumber(page_no);
    if (appendEnable == true) {
      const canvasRect = canvasRefs.current[page_no - 1];
      const canvas = canvasRect.current;
      const rect = canvasRect.getBoundingClientRect();
      // const x = e.clientX - rect.left;
      // const y = e.clientY - rect.top;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      //   const x = (e.clientX - rect.left) * (100 / zoomLevel);
      // const y = (e.clientY - rect.top) * (100 / zoomLevel);

      // handleAddField(x, y);
      // ,y cose

      let arrayObj = {
        x,
        y,
      };
      const newElement = {
        type: selectedOption,
        x,
        y,
        width: 100 / scale,
        height: 50 / scale,
        fontSize: 16 * scale, // Initial font size
        page_no: page_no,
        id: Date.now(),
      };
      console.log(newElement);
      setElements([...elements, newElement]);

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
        console.log("clickedPageNumber");
        console.log(clickedPageNumber);
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) =>
          handleImageChangeDummy(e, arrayObj, type, page_no);

        // input.onchange = e => handleImageChange(e, arrayObj, type,page_no);
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
            // setType('');
          }
        } else {
          console.log("state memory");
          console.log(stateMemory);

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

          // setType('');
        }
      }
    }
  };
  // second small screen

  // end
  // items list append end
  const [elements, setElements] = useState([]);
  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);

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

  // Define the dropdownOpen state

  const [modalOpenDropdown, setModalOpenDropdown] = useState(false);
  // start

  const fetchData = async (fileId) => {
    // get Images from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post("file/getbgImagesByFileId", postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
    if (apiData.error) {
      setIsLoadingDoc(false);
    } else {
      setImageUrls(apiData.result[0].image);
      setIsLoadingDoc(false);
      setIsLoaded(false);
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
    } else {
      //console.log('positions');
      //console.log(apiData.result);

      setTextItems(apiData.result[0].position_array);
    }
  };

  // stepper
  const [UpdatedSignatureIndex, setUpdatedSignatureIndex] = useState("");
  const [deleteItemRecipient, setdeleteItemReciepint] = useState(null);
  const [inputErrorsRecipient, setInputErrorsRecipient] = useState([]);

  const deleteFormReceipient = () => {
    //console.log(RecipientsData);
    // const e = deleteItemRecipient;
    // e.preventDefault();
    // setInputErrorsRecipient([]);
    // const slideDownWrapper = e.target.closest('.react-slidedown'),
    //   form = e.target.closest('form');
    // if (slideDownWrapper) {
    //   slideDownWrapper.remove();
    // } else {
    //   form.remove();
    // }
    const index = deleteItemRecipient;
    const newRecipientsData = [...RecipientsData];

    if (newRecipientsData.length === 1) {
      // Clear the only row's name and email
      newRecipientsData[0] = { name: "", email: "" };
      setCountReceipient(0);
    } else {
      // Remove the specific row
      newRecipientsData.splice(index, 1);
      setCountReceipient(countReceipient - 1);
    }

    setRecipientsData(newRecipientsData);
    setItemDeleteConfirmationR(false);
  };
  const isAddButtonDisabled = RecipientsData.some(
    (recipient) =>
      !recipient.name ||
      !recipient.email ||
      inputErrorsRecipient.some((error) => error)
  );
  const increaseCount = () => {
    // Check if all fields are filled
    if (signersData.some((signer) => !signer.name || !signer.email)) {
      // alert('Please fill all fields.');
      setSignerAddEdit(true);
      return;
    }

    // Check if there are any input errors
    if (inputErrors.some((error) => error)) {
      alert("Please fix the errors.");
      return;
    }
    // push empty object to signers array
    // const color_code = getColorByIndex(count);
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
      const randomId = Math.floor(1000 + Math.random() * 9000);
      // Add new signer with unique color
      setSignersData([
        ...signersData,
        {
          order_id: signersData.length + 1,
          name: "",
          email: "",
          color: color_code,
          randomId: randomId,
        },
      ]);
      setCount(count + 1);
      // setSignersData([...signersData, {order_id: signersData.length + 1, name: '', email: '', color: color_code}]);
      // setCount(count + 1);
    }
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; // If dropped outside the list, do nothing

    const reorderedSigners = Array.from(signersData);
    const [removed] = reorderedSigners.splice(source.index, 1); // Remove from the source index
    reorderedSigners.splice(destination.index, 0, removed); // Insert at the destination index

    // Update the order_id based on the new order
    const updatedArray = reorderedSigners.map((item, index) => ({
      ...item,
      order_id: index + 1, // Adjust order_id
    }));

    setSignersData(updatedArray); // Update state
  };
  const increaseCountReceipient = () => {
    //console.log(countReceipient);
    if (countReceipient < 8) {
      setRecipientsData([...RecipientsData, { name: "", email: "" }]);
      setCountReceipient(countReceipient + 1);
    }
    // if (countReceipient === 0) {
    //   setRecipientsData([...RecipientsData, {name: '', email: ''}]);
    //   setCountReceipient(countReceipient + 1);
    // } else if (countReceipient === 8) {
    //   //console.log('Max Size Signer Filled');
    //   // toastAlert("error","Maximum 8 Recipients Allowed!")
    // } else {
    //   setRecipientsData([...RecipientsData, {id: RecipientsData.length + 1, name: '', email: ''}]);

    //   setCountReceipient(countReceipient + 1);
    // }
  };
  const [signerView, setSignerView] = useState(false);

  const placeImage = async (url, prevSign, typeSign) => {
    console.log(url);
    console.log(prevSign);
    console.log(typeSign);

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
        console.log("NO INITIAL URKL");

        console.log(url);
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
          pageNumber,
          scale
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
        console.log("NO INITIAL URKL");

        console.log(url);
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
          setDeleteIndex(resultingData.id);
          // setSavedCanvasData([...savedCanvasData, resultingData])
          setTextItems([...textItems, resultingData]);
          setSignatureModal(false);
          // setType('');
        }
      }

      // end Call
    }
    setInitialBox(false);
  };
  const placeImageUpdate = async (url, prevSign, typeSign) => {
    //console.log(url);
    //console.log(prevSign);
    //console.log(typeSign);

    if (prevSign === "prevSign") {
      //console.log('url');
      //console.log(url);
      setResizingIndex(UpdatedSignatureIndex);
      setIsResizing(true);
      setEditedItem(textItems[UpdatedSignatureIndex]);
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[UpdatedSignatureIndex].url = url;
      setTextItems(newSavedCanvasData);
      setSignatureModalUpdate(false);
      setType("");
    } else {
      if (typeSign === "initials") {
        //console.log('url');
        //console.log(url);
        //console.log('lines');
        setResizingIndex(UpdatedSignatureIndex);
        setIsResizing(true);
        setEditedItem(textItems[UpdatedSignatureIndex]);
        const newSavedCanvasData = [...textItems];
        newSavedCanvasData[UpdatedSignatureIndex].url = url;
        setTextItems(newSavedCanvasData);
        setSignatureModalUpdate(false);
        setType("");
      } else {
        // call api to save previous user signatures
        //console.log('sdgfdfshjdfdf');
        //console.log(url);

        //console.log(user_id);

        // const postData = {
        //   user_id: user_id,
        //   signature_image_url: url,
        //   type: typeSign,
        // };
        // const apiData = await post('user/AddUserSignaturesToDb', postData); // Specify the endpoint you want to call
        // //console.log(apiData);
        // if (apiData.error === true || apiData.error === undefined || apiData.error === 'true') {
        //   toastAlert('error', 'Error uploading Files');
        // } else {

        //console.log('url');
        //console.log(url);
        //console.log('lines');
        setResizingIndex(UpdatedSignatureIndex);
        setIsResizing(true);
        setEditedItem(textItems[UpdatedSignatureIndex]);
        const newSavedCanvasData = [...textItems];
        newSavedCanvasData[UpdatedSignatureIndex].url = url;
        setTextItems(newSavedCanvasData);
        setSignatureModalUpdate(false);
        setType("");
        // }
      }
    }
  };
  const [downloadPdfLoader, setDownloadPdfLoader] = useState(false);
  const [UniqIdDoc, setUniqIdDoc] = useState("");
  const [ActivityLogData, setActivityLogData] = useState([]);
  const saveData = async () => {
    setUnsavedChanges(false);
    setsaveLoading(true);
    const postData = {
      file_id: file_id,
      // position_array: savedCanvasData
      position_array: textItems,
    };
    try {
      const apiData = await post("file/saveCanvasDataWithFile_Id", postData); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');

      console.log(apiData);
      if (apiData.error) {
        setsaveLoading(false);
        setSaveSuccess(false);
      } else {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setsaveLoading(false);
          setContinueModal(false);
          // download completed
          // handleDownloadPDFHere({
          //   setDownloadPdfLoader,
          //   imageUrls,
          //   textItems,
          //   canvasWidth,
          //   UniqIdDoc,
          //   ActivityLogData,
          //   fileName,
          //   file_id
          // });
        }, 2000);
        fetchDataPositions(file_id);
        UpdateLastChange();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setsaveLoading(false);
    }
  };
  const saveDataSigning = async (filteredTextItems) => {
    setUnsavedChanges(false);
    setsaveLoading(true);
    const postData = {
      file_id: file_id,
      // position_array: savedCanvasData
      position_array: filteredTextItems,
    };
    try {
      const apiData = await post("file/saveCanvasDataWithFile_Id", postData); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');
      console.log("apiData");

      console.log(apiData);
      if (apiData.error) {
        setsaveLoading(false);
        setSaveSuccess(false);
      } else {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setsaveLoading(false);
          setContinueModal(false);
          // download completed
          // handleDownloadPDFHere({
          //   setDownloadPdfLoader,
          //   imageUrls,
          //   textItems,
          //   canvasWidth,
          //   UniqIdDoc,
          //   ActivityLogData,
          //   fileName,
          //   file_id
          // });
        }, 2000);
        fetchDataPositions(file_id);
        UpdateLastChange();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setsaveLoading(false);
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
  //   const textWidth = newText.length * 5; // Adjust this factor based on your font size and preferences
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
    // const newText = event.target.value;
    // const newSavedCanvasData = [...textItems];
    // newSavedCanvasData[index].text = newText;

    // // Create a canvas element to measure the exact width of the text
    // const canvas = document.createElement("canvas");
    // const context = canvas.getContext("2d");

    // // Set the canvas context to the same font style as your input
    // const font = `${item.fontWeight || 'normal'} ${item.fontStyle || 'normal'} ${item.fontSize * zoomPercentage}px ${item.fontFamily || 'Arial'}`;
    // context.font = font;

    // // Measure the exact width of the text
    // const textWidth = context.measureText(newText).width;

    // // Remove extra space by setting padding and margins to 0
    // const newWidth = Math.max(textWidth, 0); // You can set a minimum width if needed

    // // Update the state with new text and calculated width
    // newSavedCanvasData[index].width = newWidth;

    // setTextItems(newSavedCanvasData);
    // setEditedItem((prevState) => ({
    //   ...prevState,
    //   text: newText,
    //   width: newWidth,
    // }));

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
    if (
      newSavedCanvasData[index].type === "my_text" ||
      newSavedCanvasData[index].type === "signer_text"
    ) {
      if (fontSize >= 18) {
        newSavedCanvasData[index].height = parseInt(40);
      }
    }
    if (
      newSavedCanvasData[index].type === "date" ||
      newSavedCanvasData[index].type === "signer_date"
    ) {
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
      // setEditingIndex(savedCanvasData.length);
      // //console.log(savedCanvasData.length);
    }
  };
  const handleDeleteCurrentPosition = (id) => {
    setDeleteIndex(id);
    setItemDeleteConfirmation(true);
    setOpenEditorComp(false);
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

  const DeleteItemFromCanvas = () => {
    setloadingDelete(true);

    const updatedItems = textItems.filter((item) => item.id !== deleteIndex);
    //console.log('updatedItems');

    //console.log(updatedItems);
    setTextItems(updatedItems); // Update the savedCanvasData state
    //console.log(updatedItems);
    setItemDeleteConfirmation(false);
    setloadingDelete(false);
    setIsResizing(false);
  };
  const fetchSignerData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post("file/getAllSignersByFileId", postData); // Specify the endpoint you want to call
      console.log("Signers ");

      console.log(apiData);
      if (apiData.error) {
        setSignersData([]);
        setSelectedSigner([]);
        setActive("1");
        setCount(0);
      } else {
        // if(apiData)
        setSignersData(apiData.result);
        setSelectedSigner(apiData.result[apiData.result.length - 1]);

        // setSelectedSigner(apiData.result[0]);
        setCount(apiData.result.length);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const handleButtonClick = () => {
    setIsInputVisible(true);
  };
  const [loadingAccessSave, setloadingAccessSave] = useState(false);
  const handleCheckClickAccessCode = async (signer_id, i) => {
    setloadingAccessSave(true);

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
        setloadingAccessSave(false);
        fetchSignerData();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    } finally {
      setloadingAccessSave(false);
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
    // if (name === 'email' && signersData.some((signer, index) => signer.email === value && index !== i)) {
    //   newInputErrors[i] = 'This email is already in use.';
    // } else {
    //   newInputErrors[i] = '';
    // }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the email is already present in the array
    if (name === "email") {
      if (!emailPattern.test(value)) {
        newInputErrors[i] = t("Please enter a valid email address.");
      } else if (
        signersData.some(
          (signer, index) => signer.email === value && index !== i
        )
      ) {
        newInputErrors[i] = t("This email is already in use.");
      } else {
        newInputErrors[i] = "";
      }
    }

    newSignersData[i][name] = value;
    setSignersData(newSignersData);
    setInputErrors(newInputErrors);
  };
  const handleInputChangeRecipients = (i, event) => {
    const { name, value } = event.target;
    const newSignersData = [...RecipientsData];

    // const newInputErrors = [...inputErrors];
    const newInputErrors = [...inputErrorsRecipient];

    // Check if the email is already present in the array
    // if (name === 'email' && RecipientsData.some((signer, index) => signer.email === value && index !== i)) {
    //   newInputErrors[i] = 'This email is already in use.';
    // } else {
    //   newInputErrors[i] = '';
    // }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the email is already present in the array
    if (name === "email") {
      if (!emailPattern.test(value)) {
        newInputErrors[i] = "Please enter a valid email address.";
      } else if (
        RecipientsData.some(
          (signer, index) => signer.email === value && index !== i
        )
      ) {
        newInputErrors[i] = "This email is already in use.";
      } else {
        newInputErrors[i] = "";
      }
    }
    // inputErrorsRecipient

    newSignersData[i][name] = value;
    setRecipientsData(newSignersData);
    setInputErrorsRecipient(newInputErrors);
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
      console.log("Signers ");

      console.log(apiData);
      if (apiData.error) {
        toastAlert("error", apiData.message);
        setSignersData([]);
        setLoadingSignersSave(false);
      } else {
        // //console.log(apiData.result)
        // if(toast){
        //   toastAlert("succes", apiData.message);

        // }
        setSignersData(apiData.data);
        setSelectedSigner(apiData.data[apiData.data.length - 1]);
        setCount(apiData.data.length);
        setLoadingSignersSave(false);
        fetchSignerData(file_id);
        setSignerAddEdit(false);
        setActive("2");
      }
    } catch (error) {
      // toastA
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
  const [deleteSignerLoader, setDeleteSignerLoader] = useState(false);
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
  const [DelteSelectedId, setDelteSelectedId] = useState("");
  const [idSignerFieldsRemove, setIdSignerFieldsRemove] = useState("");
  const [IndexRemoveSigner, setIndexRemoveSigner] = useState("");
  const deleteForm = async (index) => {
    //console.log(index);
    const signerId = signersData[index]?.signer_id;
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

  // send to esign
  const [successModalAlert, setSuccessModalAlert] = useState(false);
  const getActivityLog = async (file_id) => {
    //console.log('Activity Log ');
    const postData = {
      file_id: file_id,
    };
    const apiData1 = await post("file/getFileActivityLog", postData); // Specify the endpoint you want to call
    console.log("ACTIVITY LOG");

    console.log(apiData1);
    // fileDetail
    if (apiData1.data.length === 0) {
      return null;
    } else {
      setActivityLogData(apiData1.data); // Set the state with formatted data
      return apiData1.data;
    }
  };
  const sendToEsignApi = async () => {
    // api to update name of file
    // // update_email_content()
    // console.log("textItems");
    // console.log(textItems);
    // // Check for `signer_dropdown` type items with empty or null `options`

    //   const specifiedTypes = ['my_text', 'my_signature', 'my_initials', 'date', 'checkmark', 'highlight', 'stamp'];

    //   // Filter items with the specified types
    //   const filteredTextItems = textItems.filter(item => specifiedTypes.includes(item.type));

    //   // Filter items without the specified types
    //   const nonSpecifiedTextItems = textItems.filter(item => !specifiedTypes.includes(item.type));

    //   // Now you can use `filteredTextItems` wherever you need
    //   console.log(filteredTextItems);
    //   const user_id = user?.user_id;
    //   let ActivityLogDetails= await getActivityLog(file_id)
    //   console.log(ActivityLogDetails)
    //   setDownloadPdfLoader(false)
    //  const downloadPdf= handleDownloadPDFHere({
    //     setDownloadPdfLoader,
    //         imageUrls,
    //         textItems: filteredTextItems,
    //         canvasWidth,
    //         UniqIdDoc,
    //         UniqIdDoc,
    //         ActivityLogData: ActivityLogDetails,
    //         fileName,
    //         file_id,
    //         statusData: null,
    //               imageUrlsCount: null,
    //               user_id,
    //               doc_completed:true,
    //               logo_data: logo,
    //   });
    // //     console.log("error")
    // //     console.log(downloadPdf)

    // //     if(downloadPdf.error===true){
    //       setDownloadPdfLoader(false)
    // toastAlert("error","Something went wrong!")
    //     }else{
    //     setDownloadPdfLoader(false)

    //     }
    // await saveDataSigning(nonSpecifiedTextItems);
    // // console.log(textItems)
    //  uncomment  this line to download the pdf
    await AddSignersData();
    await AddRecipientsData();
    //console.log(inputValue);
    const location = await getUserLocation();
    const postData = {
      file_id: file_id,

      email_subject: emailSubject,
      signer_functional_controls: signerFunctionalControls,
      secured_share: securedShare,
      set_esigning_order: EsignOrder,
      email_message: emailMessage,
      name: inputValue,
      location_country: location?.country,
      ip_address: location?.ip,
      location_date: location?.date,
      timezone: location?.timezone,
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
        setLoadingSendDocument(false);
        setSendToEsign(false);
        setSuccessModalAlert(true);
        // download doc and replace

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

        // let filteredTextItems = textItems.filter(item =>
        //   ['my_text', 'my_signature', 'my_initials', 'date', 'checkmark', 'highlight', 'stamp'].includes(item.type)
        // );

        // Now you can use `filteredTextItems` wherever you need
        console.log(filteredTextItems);
        const nonSpecifiedTextItems = cleanedTextItems.filter(
          (item) => !specifiedTypes.includes(item.type)
        );

        const user_id = user?.user_id;
        // update positions array
        let ActivityLogDetails = await getActivityLog(file_id);
        await handleDownloadPDFHere({
          setDownloadPdfLoader,
          imageUrls,
          textItems: filteredTextItems,
          canvasWidth,
          UniqIdDoc,
          ActivityLogData: ActivityLogDetails,
          fileName,
          file_id,
          statusData: null,
          imageUrlsCount: null,
          user_id,
        });
        await saveDataSigning(nonSpecifiedTextItems);
        // toastAlert('succes', 'Document Send to E-Sign');

        setTimeout(() => {
          window.location.href = "/home?waitingforOtherstoast=success";
        }, 1000);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setLoadingSendDocument(false);
    }
  };
  // Fetch File
  const fetchFileData = async (fileId) => {
    // get Images from db
    console.log("user_iudsfjsf");
    console.log(user?.user_id);
    const postData = {
      file_id: fileId,
      user_id: user?.user_id,
    };
    const apiData = await post("file/get-file", postData); // Specify the endpoint you want to call
    console.log("File Dta Fetch");

    console.log(apiData);
    // setUniqIdDoc(apiData.data.uniq_id)
    if (apiData.error) {
      window.location.href = "/error";
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      setFileName(apiData?.data?.name || "");

      // end
      setInputValue(apiData?.data?.name || "");
      //console.log('dfdf');
      //console.log(apiData.data.only_signer);
      setOnlySigner(apiData?.data?.only_signer || false);
      setEmailMessage(
        apiData?.data?.email_message ||
          `Please review and e-sign the document ${apiData?.data?.name} at your earliest convenience. Thank you!`
      );
      setEmailSubject(`Request for Signature: ${apiData?.data?.name}`);
      setUniqIdDoc(apiData?.data?.uniq_id);
      setSecuredShare(apiData.data.secured_share || false);
      setSignerFunctionalControls(
        apiData.data.signer_functional_controls || true
      );
      setSetEsignOrder(apiData.data.esign_order || false);
      setStatusFile(apiData.data.status || "");
    }
  };
  const UpdateLastChange = async () => {
    const location = await getUserLocation();
    const postData = {
      file_id: file_id,
      last_change: location.date,
    };
    try {
      const apiData = await post("file/updateLastChange", postData); // Specify the endpoint you want to call
      console.log("Update Last Change");

      console.log(apiData);
    } catch (error) {
      //console.log('Error fetching data:', error);
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
        <span style={{ cursor: "grab", marginRight: "10px" }}>☰</span>
        {/* <MoreVertical size={25} id="DragItem" /> */}
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

            <Col md={6} className="mb-md-0 mb-1 d-flex justify-content-around">
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: `${signersData[i]?.color}`,
                  marginTop: "10px",
                }}
              ></div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3
                  style={{ fontSize: "16px" }}
                  className="form-label"
                  for={`animation-item-name-${i}`}
                >
                  {signersData[i]?.name}
                </h3>
                <h3
                  style={{ fontSize: "16px" }}
                  className="form-label"
                  for={`animation-cost-${i}`}
                >
                  {signersData[i]?.email}
                </h3>
              </div>
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
              {signersData[i].access_code === null ||
              signersData[i].access_code === undefined ||
              signersData[i].access_code === "" ? (
                <Button
                  size="sm"
                  color="success"
                  style={{ boxShadow: "none" }}
                  className="text-nowrap px-1"
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
                  style={{ boxShadow: "none" }}
                  size="sm"
                  color="success"
                  className="text-nowrap px-1"
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
    // const Tag = i === 0 ? "div" : "div";
    return (
      // <Tag key={i} style={{ zIndex: 9999 }}>
      <div
        key={i}
        // style={{ zIndex: 9999 }}
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          marginBottom: "5px",
          backgroundColor: "#f8f8f8",
          cursor: "grab",
        }}
      >
        <Form>
          <Row
            style={{ position: "relative" }}
            className="d-flex justify-content-between align-items-center"
          >
            {EsignOrder ? (
              <Col
                xs={2}
                md={2}
                className="mb-md-0 mb-1 d-flex justify-content-left align-items-center"
                style={{
                  cursor: "all-scroll",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <DragHandle1 />
                <h3 style={{ marginTop: "1%" }}>{signersData[i].order_id}</h3>
              </Col>
            ) : null}
            <Col
              xs={10}
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
                  borderRadius: "50%",
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
      </div>
    );
  });

  const SortableList1 = SortableContainer(({ items }) => {
    return (
      <Repeater count={items.length}>
        {(i) => (
          <SortableItem1
            key={`item-${items[i].order_id}`}
            index={i}
            value={items[i]}
            i={i}
          />
        )}
      </Repeater>
    );
  });

  // end
  const canvasRef = useRef();
  const canvasRefs = useRef([]);

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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };

  const handleDownloadPDF = async () => {
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
  };
  const [downloadLoader, setDownloadLoader] = useState(false);
  const handleDownloadPDF1 = async () => {
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
    setContinueModal(false);
  };

  const handleDoubleClick = (index, item) => {
    setResizingIndex(index);
    setEditedItem(item);
    setDeleteIndex(item.id);
    setIsResizing(true);
    console.log(item);
  };

  const [editedItem, setEditedItem] = useState();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const scrollContainerRefCol2 = useRef(null); // Ref for the scrollable container inside col 2 (thumbnails)
  const scrollContainerRefCol8 = useRef(null); // Ref for the scrollable container inside col 2 (thumbnails)

  const [loadedPages, setLoadedPages] = useState([1, 2, 3, 4, 5]); // Manage loaded pages
  const [loadingP, setLoadingP] = useState(false); // Loading state
  const [loadedPages8, setLoadedPages8] = useState([1]); // Manage loaded pages
  const [loadingP8, setLoadingP8] = useState(false); // Loading state

  const observer = useRef(null);
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
    const canvasPageElement = canvasRefs.current[selectedPage - 1];
    if (canvasPageElement && colRef.current) {
      const colScrollTop = colRef.current.scrollTop;
      const colOffsetTop = colRef.current.getBoundingClientRect().top;
      const elementOffsetTop = canvasPageElement.getBoundingClientRect().top;
      const scrollToPosition = colScrollTop + elementOffsetTop - colOffsetTop;

      colRef.current.scrollTo({ top: scrollToPosition, behavior: "smooth" });
    }
    // const pageNumber = Number(e.target.value); // Get the selected page number
    // setActivePage(pageNumber); // Update the selected page in the state
    // handlePageClick(pageNumber); // Trigger the page click action

    // scrollToPage(pageNumber); // Scroll to the selected page if needed
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
  // Handle scroll for col 2 (you may use similar logic here for the thumbnail scrolling)
  const handleScrollCol2 = () => {
    if (!scrollContainerRefCol2.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRefCol2.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMorePages(); // This could be a separate load function if you want to treat it differently
    }
  };

  // const loadMorePages8 = () => {
  //   if (loadedPages8.length >= numPages || loadingP8) return;
  //   setLoadingP8(true);
  //   setTimeout(() => {
  //     setLoadedPages8((prevPages) => {
  //       const nextPages = Array.from(
  //         { length: Math.min(5, numPages - prevPages.length) },
  //         (_, i) => prevPages.length + i + 1
  //       );
  //       setLoadingP8(false);
  //       return [...prevPages, ...nextPages];
  //     });
  //   }, 1000);
  // };
  // Load more pages when the user reaches the bottom
  // const loadMorePages = () => {
  //   if (loadedPages.length >= numPages || loadingP) return;
  //   setLoadingP(true);
  //   setTimeout(() => {
  //     setLoadedPages((prevPages) => {
  //       const nextPages = Array.from(
  //         { length: Math.min(5, numPages - prevPages.length) },
  //         (_, i) => prevPages.length + i + 1
  //       );
  //       setLoadingP(false);
  //       return [...prevPages, ...nextPages];
  //     });
  //   }, 1000);
  // };
  // const loadMorePages8 = () => {
  //   if (loadedPages8.length >= numPages || loadingP8) return;

  //   setLoadingP8(true);
  //   setTimeout(() => {
  //     setLoadedPages8((prevPages) => {
  //       const nextPages = Array.from(
  //         { length: Math.min(5, numPages - prevPages.length) },
  //         (_, i) => prevPages.length + i + 1
  //       );
  //       setLoadingP8(false);
  //       return [...prevPages, ...nextPages];
  //     });
  //   }, 1000);
  // };
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
   // Runs whenever activePage changes


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
  // const [loadedPages, setLoadedPages] = useState([...initialPages]); // Modify based on your initial page data

  // useEffect(() => {
  //   console.log("colRef",colRef)
  //   if (colRef.current) {
  //     console.log("SCROLL ERRORS NOYT ")
  //     // Add scroll event listener for col 8 container (big preview)
  //     colRef.current.addEventListener('scroll', handleScrollCol8);
  //     return () => {
  //       colRef.current.removeEventListener('scroll', handleScrollCol8);
  //     };
  //   }

  // }, [loadedPages, numPages,colRef]);
  // const scrollContainerRef = useRef(null); // Ref for the scrollable container inside col 8

  // const [loadedPages, setLoadedPages] = useState([1, 2, 3, 4, 5]); // Manage loaded pages
  // const [loadingP, setLoadingP] = useState(false); // Loading state

  // // Handle scroll for col 8 to load more pages
  // const handleScroll = () => {
  //   if (!scrollContainerRef.current) return;
  //   const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
  //   if (scrollTop + clientHeight >= scrollHeight - 10) {
  //     loadMorePages();
  //   }
  // };

  // // Load more pages when the user reaches the bottom
  // const loadMorePages = () => {
  //   if (loadedPages.length >= numPages || loadingP) return;
  //   setLoadingP(true);
  //   setTimeout(() => {
  //     setLoadedPages((prevPages) => {
  //       const nextPages = Array.from(
  //         { length: Math.min(5, numPages - prevPages.length) },
  //         (_, i) => prevPages.length + i + 1
  //       );
  //       setLoadingP(false);
  //       return [...prevPages, ...nextPages];
  //     });
  //   }, 1000);
  // };

  // useEffect(() => {
  //   if (scrollContainerRef.current) {
  //     // Add scroll event listener for col 8 container
  //     scrollContainerRef.current.addEventListener('scroll', handleScroll);
  //     return () => {
  //       scrollContainerRef.current.removeEventListener('scroll', handleScroll);
  //     };
  //   }
  // }, [loadedPages, numPages]);

  // enfd
  useEffect(() => {
    // const items = JSON.parse(localStorage.getItem("user_data"));
    // if (items === "" || items === undefined || items === null) {
    //   window.location.href = "/login";
    // } else {
    //   // window.location.href = '/home';
    // }
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

  // start =============
  const zoomOptions = [0.5, 0.75, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%
  // start =============
  const inputRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [ContinueModal, setContinueModal] = useState(false);
  const [OpenEditorComp, setOpenEditorComp] = useState(false);

  useEffect(() => {
    console.log("status");

    console.log(status);
    console.log(user);

    if (user) {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            fetchFileData(file_id),

            fetchData(file_id),
            UpdateLastChange(),
            fetchDataPositions(file_id),
            fetchSignerData(file_id),
            fetchRecipientsData(file_id),
          ]);
          if (window.innerWidth < 786) {
            setIsSmallScreen(true);
          } else {
            setIsSmallScreen(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoaded(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user]);

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
  // Empty dependency array to run effect only once
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (unsavedChanges) {
        const confirmationMessage =
          "You have unsaved changes. Do you want to leave this page?";
        event.returnValue = confirmationMessage; // For legacy browsers
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);
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
  const [cropSrc, setCropSrc] = useState(null);
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

  const [hoveredStateDummyType, setHoveredStateDummyType] = useState("");
  const [hoveredStateDummyIndex, setHoveredStateDummyIndex] = useState("");

  return (
    <>
      <div>
        {/* <button onClick={() => handleButtonClick1(1)}>Open Image Cropper</button> */}

        <ImageCropperModal
          cropSrc={cropSrc}
          isOpen={modalOpen1}
          // toggle={toggleModal}
          toggle={toggleModal}
          onImageCropped={handleImageCropped}
        />
        <ImageCropperModal
          cropSrc={cropSrc}
          isOpen={modalOpenUpdate}
          toggle={toggleModalUpdate}
          onImageCropped={handleImageCroppedUpdate}
        />
      </div>
      {isLoaded ? <FullScreenLoader /> : null}
      {window.innerWidth < 781 ? (
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
                      {/* {Array.from({ length: numPages }, (_, i) => i + 1).map(
                        (page) => ( */}
                      {Array.from({ length: numPages }, (_, i) => i + 1)
                        .slice(startPage, endPage) // Only render a specific range of pages
                        .map((page) => (
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
                        ))}
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
                    {/* <Button
                  style={{
                    // backgroundColor: 'white',
                    boxShadow: 'none',
                    height: '40px',
                    marginLeft: '20px',
                  }}
                  color="primary"
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
                  <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Back</span>
                </Button> */}
                    {loading ? (
                      <Spinner color="primary" />
                    ) : (
                      <img
                        src={
                          // logoFromApi ||
                          // logoFromLocalStorage ||
                          //  logoURL
                          logo
                        }
                        style={{
                          width: "160px",
                          height: "50px",
                          objectFit: "contain",
                          marginLeft: "10px",
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <h2
                      className="fw-bold"
                      style={{ marginLeft: "10px", marginTop: "5px" }}
                    >
                      {fileName}.pdf
                    </h2>
                  </div>
                  <div>
                    {/* <select
                  style={{ fontSize: '16px', cursor: 'pointer',border:"1px solid lightGrey",textAlign: "center",
                    textAlignLast: "center" }}
                  value={zoomPercentage}
                  onChange={e => handleZoomChange(e)}>
               
                  <option value="75">75%</option>
                  <option value="100">100%</option>
                  <option value="110">110%</option>
                  <option value="125">125%</option>
                  <option value="150">150%</option>
                  <option value="200">200%</option>

                


                  <option value="100">Fit to Width</option>
                </select> */}
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
                      // disabled={saveLoading}
                      color="orange"
                      disabled={downloadLoader}
                      onClick={handleDownloadPDF1}
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

                    {statusFile === "InProgress" ? (
                      <>
                        <CustomButton
                          size="sm"
                          padding={true}
                          disabled={saveLoading}
                          color={saveSuccess ? "success" : "primary"}
                          onClick={() => saveData()}
                          style={{
                            marginRight: "5px",
                            marginLeft: "5px",

                            display: "flex",
                            boxShadow: "none",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          className="btn-icon d-flex"
                          text={
                            <>
                              {saveLoading ? (
                                <Spinner color="white" size="sm" />
                              ) : saveSuccess ? (
                                <Check color="white" size={15} />
                              ) : null}
                              <span className="align-middle ms-25">
                                {t("Save")}
                              </span>
                            </>
                          }
                        />
                        <CustomButton
                          size="sm"
                          padding={true}
                          disabled={saveLoading}
                          color={saveSuccess ? "success" : "primary"}
                          onClick={async () => {
                            await saveData();
                            window.location.href = "/home";
                          }}
                          style={{
                            marginRight: "5px",
                            marginLeft: "5px",

                            display: "flex",
                            boxShadow: "none",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          className="btn-icon d-flex"
                          text={
                            <>
                              {saveLoading ? (
                                <Spinner color="white" size="sm" />
                              ) : saveSuccess ? (
                                <Check color="white" size={15} />
                              ) : null}
                              <span className="align-middle ms-25">
                                {t("Save & Close")}
                              </span>
                            </>
                          }
                        />
                      </>
                    ) : null}

                    {statusFile === "InProgress" ? (
                      <>
                        {onlySigner === true || onlySigner === "true" ? (
                          <CustomButton
                            size="sm"
                            padding={true}
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
                                  toastAlert("succes", apiData.message);

                                  await saveData();
                                  window.location.href = "/home";
                                }
                              } catch (error) {
                                //console.log('Error fetching data:', error);
                              }
                            }}
                            style={{
                              marginLeft: "5px",
                              marginRight: "5px",
                              display: "flex",
                              boxShadow: "none",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="btn-icon d-flex"
                            text={
                              <span className="align-middle ms-25">
                                {t("Finish")}
                              </span>
                            }
                          />
                        ) : (
                          <CustomButton
                            size="sm"
                            padding={true}
                            // disabled={signersData.length === 0 || signersData.some(signer => !signer.email)}
                            color="primary"
                            useDefaultColor={true}
                            secondary_color_data={true}
                            onClick={() => {
                              console.log(textItems)
                              console.log(signersData)
                              const firstMissingTextItemSigner = signersData.find(
                                (signer) => !textItems.some((item) => item.signer_id === signer.signer_id)
                              );
                            
                              if (firstMissingTextItemSigner) {
                                toastAlert(
                                  "error",
                                  `Please add atleast one field for signer : ${firstMissingTextItemSigner.name || firstMissingTextItemSigner.email || 'Unknown'}`
                                );
                                console.log("First signer without text item:", firstMissingTextItemSigner);
                              }else{
                              if (
                                signersData.length === 0 ||
                                signersData.some((signer) => !signer.email)
                              ) {
                                toastAlert("error", "Please Add Signers");
                                setSignerAddEdit(true);
                              } else {
                                setSendToEsign(true);
                              }}
                            }}
                            style={{
                              marginLeft: "5px",

                              display: "flex",
                              boxShadow: "none",
                              // height: '40px',
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="btn-icon d-flex"
                            text={
                              <span className="align-middle ms-25">
                                {t("Send E-Sign")}
                              </span>
                            }
                          />
                        )}
                      </>
                    ) : (
                      <></>
                    )}
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
                    borderRight: ".5px solid lightGrey",
                    position: "relative",
                    // cursor: type === 'my_text' || type === 'signer_text' ? 'default' : type ? 'default' : 'default',
                  }}
                >
                  {/* <div style={{
                  position:"absolute",
                  bottom:10,
                  left:"30%",
                }}> */}
                  {/* {selectedSigner === null ||
                selectedSigner === undefined ||
                selectedSigner === '' ||
                selectedSigner.length === 0 ? ( */}
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
                  {/* // ) : ( */}
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
                          active={active}
                          deleteSignerLoader={deleteSignerLoader}
                        />
                      </div>
                    </>
                  )}

                  {statusFile === "InProgress" ? (
                    <div>
                      <Nav className="justify-content-center">
                        <NavItem>
                          <NavLink
                            style={
                              active === "1"
                                ? {
                                    color: primary_color,
                                    borderBottom: `3px solid ${primary_color}`,
                                    fontSize: "16px",
                                  }
                                : { fontSize: "16px" }
                            }
                            // style={{fontSize: '16px'}}
                            active={active === "1"}
                            onClick={() => {
                              toggle("1");
                            }}
                          >
                            {t("For You")}
                          </NavLink>
                        </NavItem>
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
                              if (
                                selectedSigner.length === 0 ||
                                selectedSigner === null ||
                                selectedSigner === undefined
                              ) {
                                toastAlert("error", "Please Add Signer!");
                              } else {
                                toggle("2");
                              }
                            }}
                          >
                            {t("For Others")}
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={active}>
                        <TabPane tabId="1">
                          <ListGroup
                            style={{ width: "100%" }}
                            className="list-group-vertical-sm"
                          >
                            <ForYou type={getTypeListItem} typeData={type} />
                          </ListGroup>
                        </TabPane>
                        <TabPane tabId="2">
                          <ForOthers
                            type={getTypeListItem}
                            typeData={type}
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
                </Col>

                {sendToEsign === false &&
                  modalOpen1 === false &&
                  successModalAlert === false &&
                  modalOpen === false &&
                  modalOpenDropdown === false &&
                  itemDeleteConfirmation === false &&
                  itemDeleteConfirmation12 === false &&
                  signerAddEdit === false &&
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
                  xs={12}
                  md={8}
                  ref={colRef}
                  style={{
                    backgroundColor: "#eaeaea",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor:
                      type === "my_text" || type === "signer_text"
                        ? "none"
                        : type
                        ? "none"
                        : "default",

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
                  <div
                    //  onMouseMove={(e)=>handleMouseMove(e)}
                    style={{
                      height: "92dvh",

                      position: "relative",
                    }}
                  >
                    <Document
                      file={`${imageUrls}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onError={onDocumentLoadError} // Add this line
                    >
                      {/* {Array.from({ length: numPages }, (_, i) => i + 1).map(
                        (page) => ( */}
                      {Array.from({ length: numPages }, (_, i) => i + 1)
                        .slice(0, endPage) // Only render a specific range of pages
                        .map((page) => (
                          <>
                            {" "}
                            {/*  */}
                            <div
                              key={page}
                              id={`full-page-${page}`}
                              style={{ marginBottom: "20px" }}
                              
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
                                canvasRef={(ref) =>
                                  (canvasRefs.current[page - 1] = ref)
                                }
                                onClick={(e) => {
                                  handleCanvasClick(e, page);
                                }}
                               
                              >
                                {textItems.map((field, index) => (
                                  <Rnd
                                    dragHandleClassName="drag-handle"
                                    key={field.id}
                                    // minWidth={field.width * scale} // Set minimum width
                                    style={{
                                      border:
                                        hoveredStateDummyIndex === index ||
                                        (isResizing && resizingIndex === index)
                                          ? field.type === "signer_checkmark" ||
                                            field.type === "checkmark"
                                            ? "none"
                                            : "2px solid rgba(98,188,221,1)"
                                          : "none",
                                      display: "block", // Always render the component
                                      backgroundColor:
                                        field.type === "signer_checkmark" ||
                                        field.type === "checkmark" ||
                                        field.type === "highlight" ||
                                        field.type === "signer_initials" ||
                                        field.type === "signer_initials_text" ||
                                        field.type ===
                                          "signer_chooseImgStamp" ||
                                        field.type ===
                                          "signer_chooseImgPassportPhoto" ||
                                        field.type ===
                                          "signer_chooseImgDrivingL" ||
                                        field.type === "signer_dropdown" ||
                                        field.type === "signer_text" ||
                                        field.type === "signer_date"
                                          ? "none"
                                          : "rgba(98,188,221,.3)",
                                      visibility:
                                        field?.page_no === page
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
                                    // position={{x: field.x * (zoomPercentage / 100), y: field.y * (zoomPercentage / 100)}}
                                    // onDrag={async (e, d) => {
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
                                    // correct 
                                    // onDrag={async (e, d) => {
                                    //   const canvasRect = canvasRefs.current[page - 1].getBoundingClientRect();
                                    
                                    //   // Calculate the current position freely
                                    //   const x = (e.clientX - canvasRect.left) / scale - dragOffset.x;
                                    //   const y = (e.clientY - canvasRect.top) / scale - dragOffset.y;
                                    
                                    //   const newSavedCanvasData = [...textItems];
                                    //   newSavedCanvasData[index].x = x;
                                    //   newSavedCanvasData[index].y = y;
                                    //   setTextItems(newSavedCanvasData);
                                    // }}
                                    // onDragStop={(e, d) => {
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
                                    // onResizeStop={async (
                                    //   e,
                                    //   direction,
                                    //   ref,
                                    //   delta,
                                    //   position
                                    // ) => {
                                    //   //console.log('I M RESIZE');
                                    //   const width =
                                    //     parseInt(ref.style.width, 10) / scale;
                                    //   const height =
                                    //     parseInt(ref.style.height, 10) / scale;
                                    //   const newX = position.x / scale;
                                    //   const newY = position.y / scale;

                                    //   // Ensure that the new position does not go out of bounds
                                    //   const boundedX = Math.max(0, newX);
                                    //   const boundedY = Math.max(0, newY);

                                    //   await handleUpdateFieldResize(
                                    //     field.id,
                                    //     field.type,
                                    //     width,
                                    //     height,
                                    //     boundedX,
                                    //     boundedY
                                    //   );

                                    //   setType(hoveredStateDummyType);
                                    //   setHoveredStateDummyType("");
                                    // }}
                                    onResizeStop={async (e, direction, ref, delta, position) => {
                                      const canvasRect = canvasRefs.current[page - 1].getBoundingClientRect();
                                      const pageWidth = canvasRect.width / scale; // Width of the PDF page
                                      const pageHeight = canvasRect.height / scale; // Height of the PDF page
                                    
                                      // Calculate new dimensions and position
                                      const width = parseInt(ref.style.width, 10) / scale;
                                      const height = parseInt(ref.style.height, 10) / scale;
                                      let newX = position.x / scale;
                                      let newY = position.y / scale;
                                    
                                      // Constrain dimensions and position
                                      const boundedWidth = Math.min(width, pageWidth - newX);
                                      const boundedHeight = Math.min(height, pageHeight - newY);
                                      newX = Math.max(0, Math.min(newX, pageWidth - boundedWidth));
                                      newY = Math.max(0, Math.min(newY, pageHeight - boundedHeight));
                                    
                                      // Update the field data
                                      await handleUpdateFieldResize(
                                        field.id,
                                        field.type,
                                        boundedWidth,
                                        boundedHeight,
                                        newX,
                                        newY
                                      );
                                    
                                      setType(hoveredStateDummyType);
                                      setHoveredStateDummyType("");
                                    }}
                                    enableResizing={
                                      field.type === "signer_checkmark" ||
                                      field.type === "checkmark"
                                        ? false
                                        : {
                                            topLeft: true,
                                            topRight: true,
                                            bottomLeft: true,
                                            bottomRight: true,
                                          }
                                    }
                                    resizeHandleClasses={{
                                      topLeft: "resize-handle",
                                      topRight: "resize-handle",
                                      bottomLeft: "resize-handle",
                                      bottomRight: "resize-handle",
                                    }}
                                    bounds="parent"
                                  >
                                    {hoveredStateDummyIndex === index && (
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
                                            position={{ top: -10, right: 20 }}
                                            onClick={() => {
                                              setEventDataOnClick({
                                                x: field.x,
                                                y: field.y,
                                              });
                                              setActivePage(field.bgImg);
                                              setUpdatedSignatureIndex(index);
                                              const input =
                                                document.createElement("input");
                                              input.type = "file";
                                              input.accept = "image/*";
                                              input.onchange = (e) =>
                                                handleImageChangeDummyEdit(
                                                  e,
                                                  index
                                                );

                                              // input.onchange = e => handleUpdateImageChange(e, index);
                                              input.click();
                                            }}
                                            color="#23af23"
                                            item="edit"
                                          >
                                            <Edit2 size={15} />
                                          </ResizeCircle>
                                        )}
                                        {field.type !== "checkmark" &&
                                          field.type !== "signer_checkmark" && (
                                            <>
                                              <ResizeCircle
                                                position={{ top: -5, left: -5 }}
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
                                    {isResizing && resizingIndex === index && (
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
                                            position={{ top: -10, right: 20 }}
                                            onClick={() => {
                                              setEventDataOnClick({
                                                x: field.x,
                                                y: field.y,
                                              });
                                              setActivePage(field.bgImg);
                                              setUpdatedSignatureIndex(index);
                                              const input =
                                                document.createElement("input");
                                              input.type = "file";
                                              input.accept = "image/*";
                                              input.onchange = (e) =>
                                                handleImageChangeDummyEdit(
                                                  e,
                                                  index
                                                );

                                              // input.onchange = e => handleUpdateImageChange(e, index);
                                              input.click();
                                            }}
                                            color="#23af23"
                                            item="edit"
                                          >
                                            <Edit2 size={15} />
                                          </ResizeCircle>
                                        )}
                                        {/* {field.type !== "checkmark" &&
                                      field.type !== "signer_checkmark" &&
                                      field.type !== "signer_radio" && (
                                        <>
                                          <ResizeCircle
                                            position={{ top: -5, left: -5 }}
                                            color="white"
                                            item="none"
                                          />
                                          <ResizeCircle
                                            position={{ bottom: -5, left: -5 }}
                                            color="white"
                                            item="none"
                                          />
                                          <ResizeCircle
                                            position={{ bottom: -5, right: -5 }}
                                            color="white"
                                            item="none"
                                          />
                                        </>
                                      )} */}
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
                                        zoomPercentage={scale}
                                        IsSigner={false}
                                        signerObject={selectedSigner}
                                      />
                                    </div>
                                  </Rnd>
                                  // </div>
                                ))}
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
                            </div>
                          </>
                        ))}
                    </Document>
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
                  {isResizing === true &&
                  editedItem.type != "my_signature" &&
                  editedItem.type != "my_initials" &&
                  editedItem.type != "checkmark" &&
                  editedItem.type != "signer_checkmark" &&
                  editedItem.type != "signer_radio" &&
                  editedItem.type != "highlight" &&
                  editedItem.type != "stamp" ? (
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
                    <div style={{ position: "absolute", top: 2, right: 25 }}>
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
                  editedItem.type != "stamp" ? (
                    <>
                    <div >

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
                      </div>
                    </>
                  ) : (
                    <>
                      {signerView ? (
                        <>
                          <div
                            className="modern-horizontal-wizard"
                            style={{ marginTop: "20px" }}
                          >
                            <Row tag="form" className="gy-1 gx-2 ">
                              <Col xs={12}>
                                {signersData.length === 0 ? null : (
                                  <div className="form-check">
                                    <Input
                                      type="checkbox"
                                      id="signerFunctionalControls"
                                      checked={EsignOrder}
                                      // onClick={e => e.stopPropagation()}
                                      onChange={(e) => {
                                        setSetEsignOrder(e.target.checked);
                                      }}
                                    />
                                    <h3 className="ms-50 ">Set e-sign Order</h3>
                                  </div>
                                )}
                              </Col>
                              <Col xs={12}>
                                {signersData.length === 0 ? (
                                  <>
                                    <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                                      <Col
                                        md="12"
                                        xs="12"
                                        className="d-flex justify-content-center align-items-center"
                                      >
                                        <img
                                          src={emptyImage}
                                          alt="empty"
                                          style={{
                                            width: "150px",
                                            height: "auto",
                                          }}
                                        />
                                        <h3>{t("No Signer Exist")}</h3>
                                      </Col>
                                    </Row>
                                  </>
                                ) : (
                                  <>
                                    <SortableList1
                                      items={signersData}
                                      onSortEnd={({ oldIndex, newIndex }) => {
                                        // Reorder the array
                                        const newArray = arrayMove(
                                          signersData,
                                          oldIndex,
                                          newIndex
                                        );

                                        // Update the order_id of each item
                                        const updatedArray = newArray.map(
                                          (item, index) => ({
                                            ...item,
                                            order_id: index + 1, // Assuming order_id starts from 1
                                          })
                                        );

                                        // Update the state
                                        //console.log(updatedArray);
                                        setSignersData(updatedArray);
                                      }}
                                      useDragHandle
                                    />
                                  </>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            ref={scrollContainerRefCol2}
                            style={{ overflowY: "auto", maxHeight: "93dvh",marginTop:"20px" }}
                            
                          >
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
                              <div style={{ padding: "20px" }}>
                                <Document
                                  file={imageUrls}
                                  noData="No PDF loaded"
                                >
                                  {loadedPages.map((page) => (
                                    <>
                                      <div
                                        // id={`full-page-${page}`}
                                        id={`thumbnail-page-${page}`}

                                        key={page}
                                        style={{
                                          // border: `1px solid ${
                                          //   loadedPages.includes(page) ? primary_color : 'lightGrey'
                                          // }`,
                                          border:
                                            pageNumber === page
                                              ? `1px solid ${primary_color}`
                                              : "1px solid lightGrey",

                                          overflow: "hidden",
                                          cursor: "pointer",
                                          // marginBottom: "10px",
                                        }}
                                        onClick={() => {
                                          handlePageClick(page);
                                        }}
                                      >
                                        <Page
                                          renderAnnotationLayer={false}
                                          renderTextLayer={false}
                                          pageNumber={page}
                                          width={180}
                                          className={
                                            activePage === page
                                              ? "active-page"
                                              : ""
                                          }
                                        />
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

                          {/* <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                marginTop: "35px",
                              }}
                            >
                              <Document
                                file={`${imageUrls}`}
                                onLoadSuccess={onDocumentLoadSuccess}
                                noData="No PDF loaded"
                              >
                                 {Array.from(
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
                                          e.target.style.border =
                                            "1px solid white";
                                        }
                                      }}
                                      onClick={() => {
                                        handlePageClick(page);
                                      }}
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
                              </Document>
                            </div>
                          </div> */}
                        </>
                      )}
                    </>
                  )}
                </Col>
                {/* <Col xs={2}>
               
                <div ref={scrollContainerRef} style={{ overflowY: 'auto', maxHeight: '93dvh' }}>
      <div style={{ padding: '20px' }}>
        <Document file={imageUrls} noData="No PDF loaded">
          {loadedPages.map((page) => (
            <div
              id={`full-page-${page}`}
              key={page}
              style={{
                border: `1px solid ${
                  loadedPages.includes(page) ? primary_color : 'lightGrey'
                }`,
                overflow: 'hidden',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              <Page
                renderAnnotationLayer={false}
                renderTextLayer={false}
                pageNumber={page}
                width={180}
              />
              <h6>Page {page}</h6>
            </div>
          ))}
          {loadingP && <div style={{ textAlign: 'center' }}>Loading more pages...</div>}
        </Document>
      </div>
    </div>
     </Col> */}
              </Row>
            </Col>
          </Row>
        </>
      )}
      {/* Modal Onclick  small sceeeb */}
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

      {/* Modal Continue small screen  */}
      <Modal
        isOpen={ContinueModal}
        toggle={() => setContinueModal(!ContinueModal)}
        className="modal-dialog-centered modal-lg "
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!ContinueModal)}></ModalHeader> */}
        <ModalBody className=" pb-2 pt-2">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h1>Select an Action</h1>
            <X
              size={20}
              onClick={() => {
                setContinueModal(!ContinueModal);
              }}
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="sm"
              style={{
                marginTop: "10px",
                width: "50%",
              }}
              color="primary"
              disabled={downloadLoader}
              onClick={handleDownloadPDF1}
            >
              {downloadLoader ? (
                <Spinner color="white" size="sm" />
              ) : (
                <Download size={15} />
              )}
              <span
                style={{ fontSize: "16px", marginLeft: "10px" }}
                className="align-middle ms-25"
              >
                Download
              </span>
            </Button>
            <Button
              size="sm"
              disabled={saveLoading}
              color={saveSuccess ? "success" : "primary"}
              onClick={() => saveData()}
              style={{
                marginTop: "10px",
                width: "50%",
              }}
            >
              {saveLoading ? (
                <Spinner color="white" size="sm" />
              ) : saveSuccess ? (
                <Check color="white" size={15} />
              ) : (
                <Save size={15} />
              )}
              <span
                style={{ fontSize: "16px", marginLeft: "10px" }}
                className="align-middle ms-25"
              >
                Save
              </span>
            </Button>
            <Button
              size="sm"

              // disabled={signersData.length === 0 || signersData.some(signer => !signer.email)}
              onClick={() =>{ 
                console.log(textItems)
                console.log(signersData)
                const firstMissingTextItemSigner = signersData.find(
                  (signer) => !textItems.some((item) => item.signer_id === signer.signer_id)
                );
              
                if (firstMissingTextItemSigner) {
                  toastAlert(
                    "error",
                    `Please add atleast one field for signer : ${firstMissingTextItemSigner.name || firstMissingTextItemSigner.email || 'Unknown'}`
                  );
                  console.log("First signer without text item:", firstMissingTextItemSigner);
                } else {
                  setSendToEsign(true)
                }
              }}
              style={{
                marginTop: "10px",
                width: "50%",
              }}
              color="success"
            >
              <Send size={15} />
              <span
                style={{ fontSize: "16px", marginLeft: "10px" }}
                className="align-middle ms-25"
              >
                Send E-Sign
              </span>
            </Button>
          </div>
        </ModalBody>
      </Modal>
      {/* signature modal  */}
      <Modal
        isOpen={SignatureModal}
        toggle={() => setSignatureModal(!SignatureModal)}
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
            user_id_user={user?.user_id}
            initialsBox={initialBox}
            modalClose={() => {
              setSignatureModal(!SignatureModal);
            }}
            returnedSignature={placeImage}
            file_id={file_id}
            profile={false}
          />
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
            user_id_user={user?.user_id}
            modalClose={() => {
              setSignatureModalUpdate(!SignatureModalUpdate);
            }}
            initialsBox={initialBox}
            returnedSignature={placeImageUpdate}
            file_id={file_id}
          />
        </ModalBody>
      </Modal>
      {/* signer add/edit  */}
      <Modal
        isOpen={signerAddEdit}
        toggle={() => setSignerAddEdit(!signerAddEdit)}
        className={
          window.innerWidth < 736
            ? "modal-dialog-centered modal-lg modal-fullscreen"
            : "modal-dialog-centered modal-lg"
        }
      >
        <ModalBody className="pb-2" style={{ position: "relative" }}>
          <Row tag="form" className="gy-1 gx-1 p-2">
            {window.innerWidth < 736 ? (
              <>
                <Col
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h1 className="text-center  fw-bold">
                    {t("Add/Edit Signers")}
                  </h1>

                  <X
                    size={20}
                    onClick={() => setSignerAddEdit(!signerAddEdit)}
                  />
                </Col>
                <h3>{t("Maximum 8 signers can be added")}</h3>
              </>
            ) : null}
            {window.innerWidth < 736 ? null : (
              <Col xs={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h1 className="text-center  fw-bold">
                    {t("Add/ Edit Signers")}
                  </h1>
                  <div>
                    {count === 8 ? (
                      <></>
                    ) : (
                      <CustomButton
                        size="sm"
                        style={{
                          boxShadow: "none",
                        }}
                        text={
                          <>
                            <Plus size={12} />
                            <span
                              style={{ fontSize: "14px", marginLeft: "5px" }}
                              className="align-middle "
                            >
                              {t("Signer")}
                            </span>
                          </>
                        }
                        className="btn-icon"
                        color="primary"
                        onClick={increaseCount}
                        disabled={
                          signersData.some(
                            (signer) => !signer.name || !signer.email
                          ) || inputErrors.some((error) => error)
                        }
                      />
                    )}
                  </div>
                </div>

                <h3>{t("Maximum 8 signers can be added")}</h3>
              </Col>
            )}

            <Col xs={12}>
              {signersData.length === 0 ? (
                <Row className="match-height mb-2 mt-1 d-flex justify-content-center align-items-center">
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
                      {/* <Form> */}
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
                              autoFocus
                              id={`animation-item-name-${i}`}
                              value={signer?.name}
                              onChange={(event) => handleInputChange(i, event)}
                              ref={(el) => (signerRefs.current[index] = el)}
                              placeholder="Signer "
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
                            <Col md={4} xs={4} className="mb-md-0 mb-1">
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
                                autoFocus={true}
                                placeholder="Signer "
                              />
                            </Col>
                            <Col md={5} xs={5} className="mb-md-0 mb-1">
                              <h3
                                className="form-label"
                                htmlFor={`animation-cost-${i}`}
                              >
                                {t("Email")}
                              </h3>
                              <div style={{ position: "relative" }}>
                                <Input
                                  style={{
                                    fontSize: "16px",
                                    boxShadow: "none",
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
                            <Col md={2} className="mb-md-0 mt-2">
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
                            </Col>
                          </>
                        )}
                        <Col sm={12}>
                          <hr />
                        </Col>
                      </Row>
                      {/* </Form> */}
                    </div>
                  ))}
                </>
              )}
            </Col>
            {window.innerWidth < 736 ? (
              <Col xs={12}>
                <div style={{ display: "flex", justifyContent: "right" }}>
                  <div>
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
                          signersData.some(
                            (signer) => !signer.name || !signer.email
                          ) || inputErrors.some((error) => error)
                        }
                      >
                        <Plus size={14} />
                        <span
                          style={{ fontSize: "16px" }}
                          className="align-middle "
                        >
                          {t("Signer")}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </Col>
            ) : null}
            {signersData.length === 0 ? null : (
              <>
                {window.innerWidth < 736 ? (
                  <Col
                    className="text-center mt-1"
                    style={{ position: "absolute", bottom: 10, left: 10 }}
                    xs={12}
                  >
                    <Button
                      style={{ boxShadow: "none", height: "40px" }}
                      size="sm"
                      disabled={
                        signersData.some(
                          (signer) => !signer.name || !signer.email
                        ) || inputErrors.some((error) => error)
                      }
                      color="primary"
                      onClick={AddSignersData}
                    >
                      {loadingSignersSave ? (
                        <Spinner color="light" size="sm" />
                      ) : null}
                      <span
                        style={{ fontSize: "14px" }}
                        className="align-middle ms-25"
                      >
                        {t("Save")}
                      </span>
                    </Button>

                    <Button
                      size="sm"
                      style={{
                        marginLeft: "10px",
                        fontSize: "14px",
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
                ) : (
                  <Col className="text-center mt-1" xs={12}>
                    <Button
                      style={{ boxShadow: "none", height: "40px" }}
                      size="sm"
                      disabled={
                        signersData.some(
                          (signer) => !signer.name || !signer.email
                        ) || inputErrors.some((error) => error)
                      }
                      color="primary"
                      onClick={async () => {
                        await AddSignersData();
                        // setSendToEsign(true);
                      }}
                    >
                      {loadingSignersSave ? (
                        <Spinner color="light" size="sm" />
                      ) : null}
                      <span
                        style={{ fontSize: "14px" }}
                        className="align-middle ms-25"
                      >
                        {t("Save")}
                      </span>
                    </Button>

                    <Button
                      size="sm"
                      style={{
                        marginLeft: "10px",
                        fontSize: "14px",
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
              </>
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
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmationR}
        alertStatusDelete={"delete"}
        toggleFunc={() => setItemDeleteConfirmationR(!itemDeleteConfirmationR)}
        loader={loadingDelete}
        callBackFunc={deleteFormReceipient}
        text={t("Are you sure you want to remove this Recipient?")}
      />
      {/* send to e-sign  */}
      <Modal
        isOpen={sendToEsign}
        toggle={() => setSendToEsign(!sendToEsign)}
        className={
          window.innerWidth < 736
            ? "modal-dialog-centered modal-lg modal-fullscreen"
            : "modal-dialog-centered modal-xl"
        }
        // className="modal-dialog-centered modal-xl"
      >
        <ModalBody
          className="px-sm-5 mx-20 pb-2"
          style={{ position: "relative" }}
        >
          <Row tag="form" className="gy-1 gx-1 mt-75">
            <Col
              xs={12}
              style={{
                position: "sticky",
                top: 0,
                zIndex: "1000",
                // backgroundColor: '#f8f8f8',
              }}
            >
              <div
                style={{
                  paddingBlock: "5px",

                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#f8f8f8",
                  marginBottom: "1%",
                }}
              >
                <div>
                  {" "}
                  <h1 className="fw-bold">
                    {" "}
                    {t("Send Document for E-Signing")}
                  </h1>
                  {/* {signersData.length===0?
             <h4 style={{color:"red"}}>Add a signer to send your document for e-signature.</h4>
             :null
             }    */}
                </div>

                <X
                  size={24}
                  onClick={() => setSendToEsign(!sendToEsign)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </Col>
            <Col
              xs={12}
              style={{
                height: window.innerWidth < 786 ? "75vh" : "60vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Row>
                <Col xs={12} md={6}>
                  <h3>{t("Document Name")}</h3>
                  <Input
                    style={{
                      boxShadow: "none",
                      fontSize: "16px",
                      marginBottom: "10px",
                    }}
                    type="text"
                    id={`document-name`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t("Document Name")}
                  />
                  {/* <div className="form-check d-flex justify-content-left align-items-center mb-1">
                    <Input
                      type="checkbox"
                      id="signerFunctionalControls"
                      checked={signerFunctionalControls}
                      onChange={(e) => {
                        setSignerFunctionalControls(e.target.checked);
                      }}
                    />
                    <h3
                      style={{ cursor: "pointer", marginTop: "10px" }}
                      onClick={() => {
                        if (signerFunctionalControls) {
                          setSignerFunctionalControls(false);
                        } else {
                          setSignerFunctionalControls(true);
                        }
                      }}
                      className="ms-50"
                    >
                      {t("Signer Functional Controls")}
                    </h3>
                    <Info
                      size={15}
                      id="signerFunc"
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                    />
                    <UncontrolledTooltip placement="top" target="signerFunc">
                      {t(
                        "Grant document access to signers in the 'For You' tab."
                      )}
                    </UncontrolledTooltip>
                  </div> */}

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
                        placeholder={t("Enter subject here ")}
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
                        placeholder={t("Enter Message here ")}
                      />
                      <div className="form-check mt-1 d-flex justify-content-left align-items-center">
                        <Input
                          type="checkbox"
                          id="signerFunctionalControls"
                          checked={securedShare}
                          onChange={(e) => {
                            setSecuredShare(e.target.checked);
                            if (e.target.checked) {
                              increaseCountReceipient();
                            } else {
                              setCountReceipient(0);
                              setRecipientsData([]);
                              // setRecipientsData([...RecipientsData, {name: '', email: ''}]);
                            }
                          }}
                        />
                        <h3
                          style={{ cursor: "pointer", marginTop: "10px" }}
                          onClick={() => {
                            if (securedShare) {
                              setSecuredShare(false);
                            } else {
                              setSecuredShare(true);
                              increaseCountReceipient();
                              setRecipientsData([
                                ...RecipientsData,
                                { name: "", email: "" },
                              ]);
                            }
                          }}
                          className="ms-50"
                        >
                          {t("Add Recipient")}
                        </h3>

                        <Info
                          size={15}
                          id="recipeint"
                          style={{ marginLeft: "10px", cursor: "pointer" }}
                        />
                        <UncontrolledTooltip placement="top" target="recipeint">
                          {t(
                            "Recipient will receive copy of this document when signed and completed."
                          )}
                        </UncontrolledTooltip>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} md={6}>
                  <div
                    className="modern-horizontal-wizard"
                    style={{ marginTop: "20px" }}
                  >
                    <Row tag="form" className="gy-1 gx-2 ">
                      <Col
                        xs={12}
                        className="d-flex justify-content-between align-center"
                      >
                        <h3
                          className="text-center mb-1 fw-bold"
                          style={{ marginLeft: "20px" }}
                        >
                          {t("Signers")}
                        </h3>
                        <div className="form-check d-flex justify-content-right align-items-center">
                          {signersData.length === 0 ||
                          signersData.some((signer) => !signer.email) ? null : (
                            <>
                              {" "}
                              <Input
                                type="checkbox"
                                id="signerFunctionalControls"
                                checked={EsignOrder}
                                onChange={(e) => {
                                  setSetEsignOrder(e.target.checked);
                                  if (e.target.checked === true) {
                                    setEsignOrderModal(true);
                                  }
                                }}
                              />
                              <h3
                                style={{ cursor: "pointer", marginTop: "10px" }}
                                onClick={() => {
                                  if (EsignOrder) {
                                    setSetEsignOrder(false);
                                  } else {
                                    setSetEsignOrder(true);
                                    setEsignOrderModal(true);
                                  }
                                }}
                                className="ms-50"
                              >
                                {t("Set e-sign Order")}
                              </h3>
                              <Info
                                size={15}
                                id="signerFuncOrder"
                                style={{
                                  marginLeft: "10px",
                                  cursor: "pointer",
                                }}
                              />
                              <UncontrolledTooltip
                                placement="top"
                                target="signerFuncOrder"
                              >
                                {t(
                                  "Send Document to Signers in a specific order."
                                )}
                              </UncontrolledTooltip>
                            </>
                          )}
                        </div>
                        {/* <Button
                          style={{boxShadow: 'none'}}
                          size="sm"
                          className="btn-icon"
                          color="primary"
                          onClick={increaseCount}>
                          <Plus size={14} />
                          <span className="align-middle ms-25">Signer</span>
                        </Button> */}
                      </Col>
                      <Col xs={12}>
                        {signersData.length === 0 ? (
                          <>
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
                          </>
                        ) : (
                          <>
                            {signersData &&
                              signersData.map((item, i) => (
                                <>
                                  {window.innerWidth < 786 ? (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          flexDirection: "column",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <div
                                            style={{
                                              backgroundColor: `${item.color}`,
                                              // marginTop: '25px',
                                              marginRight: "10px",
                                              marginBottom: "15px",

                                              width: "40px",
                                              height: "40px",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                          >
                                            <h5
                                              style={{ fontSize: "16px" }}
                                              className="form-label"
                                            >
                                              {item.name}
                                            </h5>
                                            <h5
                                              style={{ fontSize: "16px" }}
                                              className="form-label"
                                            >
                                              {item.email}
                                            </h5>{" "}
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "right",
                                          }}
                                        >
                                          {item.access_code === null ||
                                          item.access_code === undefined ||
                                          item.access_code === "" ? (
                                            <Button
                                              size="sm"
                                              color="success"
                                              style={{ boxShadow: "none" }}
                                              className="text-nowrap px-1"
                                              onClick={() => {
                                                setInputValueAccessCode("");
                                                handleButtonClick();
                                                setActiveRow(i);
                                              }}
                                            >
                                              <Plus size={14} />
                                              <span
                                                style={{ fontSize: "16px" }}
                                              >
                                                {" "}
                                                {t("Access Code")}
                                              </span>
                                            </Button>
                                          ) : (
                                            <Button
                                              style={{ boxShadow: "none" }}
                                              size="sm"
                                              color="success"
                                              className="text-nowrap px-1"
                                              onClick={() => {
                                                setInputValueAccessCode(
                                                  item.access_code
                                                );
                                                // handleButtonClick();
                                                // setSigner_idAccesCode()
                                                setIsInputVisible(true);
                                                setActiveRow(i);
                                              }}
                                            >
                                              <Edit2 size={14} />
                                              <span
                                                style={{ fontSize: "16px" }}
                                              >
                                                {" "}
                                                {t("Modify Code")}
                                              </span>
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <hr />
                                    </>
                                  ) : (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div style={{ display: "flex" }}>
                                        <div
                                          style={{
                                            backgroundColor: `${item.color}`,
                                            // marginTop: '25px',
                                            marginRight: "10px",
                                            marginBottom: "15px",

                                            width: "40px",
                                            height: "40px",
                                          }}
                                        ></div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <h5
                                            style={{ fontSize: "16px" }}
                                            className="form-label"
                                          >
                                            {item.name}
                                          </h5>
                                          <h5
                                            style={{ fontSize: "16px" }}
                                            className="form-label"
                                          >
                                            {item.email}
                                          </h5>{" "}
                                        </div>
                                      </div>
                                      <div>
                                        {item.access_code === null ||
                                        item.access_code === undefined ||
                                        item.access_code === "" ? (
                                          <Button
                                            size="sm"
                                            color="success"
                                            style={{ boxShadow: "none" }}
                                            className="text-nowrap px-1"
                                            onClick={() => {
                                              setInputValueAccessCode("");
                                              handleButtonClick();
                                              setActiveRow(i);
                                            }}
                                          >
                                            <Plus size={14} />
                                            <span style={{ fontSize: "16px" }}>
                                              {" "}
                                              {t("Access Code")}
                                            </span>
                                          </Button>
                                        ) : (
                                          <Button
                                            style={{ boxShadow: "none" }}
                                            size="sm"
                                            color="success"
                                            className="text-nowrap px-1"
                                            onClick={() => {
                                              setInputValueAccessCode(
                                                item.access_code
                                              );
                                              // handleButtonClick();
                                              // setSigner_idAccesCode()
                                              setIsInputVisible(true);
                                              setActiveRow(i);
                                            }}
                                          >
                                            <Edit2 size={14} />
                                            <span style={{ fontSize: "16px" }}>
                                              {" "}
                                              {t("Modify Code")}
                                            </span>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </>
                              ))}
                            {/* <SortableList
                             items={signersData}
                             onSortEnd={({oldIndex, newIndex}) => {
                               // Reorder the array
                               const newArray = arrayMove(signersData, oldIndex, newIndex)
                               // Update the order_id of each item
                               const updatedArray = newArray.map((item, index) => ({
                                 ...item,
                                 order_id: index + 1, // Assuming order_id starts from 1
                               }))
                               // Update the state
                               //console.log(updatedArray);
                               setSignersData(updatedArray);
                             }}
                             useDragHandle 
                           />*/}
                          </>
                        )}
                      </Col>
                    </Row>
                  </div>
                  {/* button next and prev  */}
                </Col>
                {/* Recipient  */}
                <Col xs={12}>
                  {securedShare === true || securedShare === "true" ? (
                    <>
                      <div
                        className="modern-horizontal-wizard"
                        style={{ marginTop: "20px" }}
                      >
                        <Row tag="form" className="gy-1 gx-2 ">
                          <Col
                            xs={12}
                            className="d-flex justify-content-between align-center"
                          >
                            <h3 className="text-center  fw-bold">
                              {t("Add Recipient")}
                            </h3>
                            {window.innerWidth > 736 ? (
                              <>
                                <CustomButton
                                  // color="primary"
                                  disabled={isAddButtonDisabled}
                                  size="sm"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",

                                    display: "flex",
                                    boxShadow: "none",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  onClick={increaseCountReceipient}
                                  text={
                                    <>
                                      <Plus size={14} />
                                      <span
                                        className="align-middle ms-25"
                                        style={{ fontSize: "16px" }}
                                      >
                                        {t("Recipient")}
                                      </span>
                                    </>
                                  }
                                />
                              </>
                            ) : null}
                          </Col>
                          <Col xs={12} style={{ marginBottom: 1 }}>
                            <h3>{t("Maximum 8 recipients can be added")}</h3>
                          </Col>
                          <Col xs={12}>
                            {countReceipient === 0 ? (
                              <>
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
                                    <h3>{t("No Recipient Exist")}</h3>
                                  </Col>
                                </Row>
                              </>
                            ) : (
                              <>
                                <Repeater count={countReceipient}>
                                  {(i) => {
                                    const Tag = i === 0 ? "div" : SlideDown;
                                    return (
                                      <Tag key={i}>
                                        <Form>
                                          <Row className="d-flex justify-content-between align-items-center">
                                            <Col
                                              md={4}
                                              className="mb-md-0 mb-1"
                                            >
                                              <h3
                                                style={{ fontSize: "16px" }}
                                                className="form-label"
                                                for={`animation-item-name-${i}`}
                                              >
                                                {t("Recipient Name")}
                                              </h3>

                                              <Input
                                                style={{
                                                  fontSize: "16px",
                                                  boxShadow: "none",
                                                }}
                                                type="text"
                                                name="name"
                                                id={`animation-item-name-${i}`}
                                                placeholder="Recipient "
                                                value={RecipientsData[i].name}
                                                onChange={(event) =>
                                                  handleInputChangeRecipients(
                                                    i,
                                                    event
                                                  )
                                                }
                                              />
                                            </Col>
                                            <Col
                                              md={5}
                                              className="mb-md-0 mb-1"
                                            >
                                              <h3
                                                style={{ fontSize: "16px" }}
                                                className="form-label"
                                                for={`animation-cost-${i}`}
                                              >
                                                {t("Email")}
                                              </h3>
                                              <Input
                                                style={{
                                                  fontSize: "16px",
                                                  boxShadow: "none",
                                                }}
                                                name="email"
                                                value={RecipientsData[i].email}
                                                onChange={(event) =>
                                                  handleInputChangeRecipients(
                                                    i,
                                                    event
                                                  )
                                                }
                                                type="email"
                                                id={`animation-cost-${i}`}
                                                placeholder="recipient@gmail.com"
                                              />
                                              {inputErrorsRecipient[i] && (
                                                <div
                                                  style={{
                                                    color: "red",
                                                    fontSize: "14px",
                                                  }}
                                                >
                                                  {inputErrorsRecipient[i]}
                                                </div>
                                              )}{" "}
                                            </Col>
                                            <Col
                                              md={2}
                                              className="mb-md-0 mb-1"
                                            >
                                              <Button
                                                size="sm"
                                                style={{
                                                  height: "40px",
                                                  marginTop: "20px",
                                                }}
                                                color="danger"
                                                className="text-nowrap px-1"
                                                onClick={(e) => {
                                                  setdeleteItemReciepint(i);
                                                  setItemDeleteConfirmationR(
                                                    true
                                                  );
                                                  // deleteFormReceipient
                                                }}
                                              >
                                                <Trash2 size={15} />
                                              </Button>
                                            </Col>

                                            <Col sm={12}>
                                              <hr />
                                            </Col>
                                          </Row>
                                        </Form>
                                      </Tag>
                                    );
                                  }}
                                </Repeater>
                              </>
                            )}
                            {window.innerWidth < 736 ? (
                              <>
                                <Button
                                  disabled={RecipientsData.some(
                                    (signer) =>
                                      !signer.name ||
                                      !signer.email ||
                                      inputErrorsRecipient.some(
                                        (error) => error
                                      )
                                  )}
                                  style={{
                                    boxShadow: "none",
                                    marginRight: "28px",
                                  }}
                                  size="sm"
                                  className="btn-icon"
                                  color="primary"
                                  onClick={increaseCountReceipient}
                                >
                                  <Plus size={14} />
                                  <span className="align-middle ms-25">
                                    {t("Recipient")}
                                  </span>
                                </Button>{" "}
                              </>
                            ) : null}
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* button next and prev  */}
                </Col>

                {/* End Recipient  */}
              </Row>
            </Col>
            {window.innerWidth < 760 ? (
              <Col
                xs={12}
                className="d-flex justify-content-end"
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                }}
              >
                <CustomButton
                  padding={true}
                  size="sm"
                  disabled={
                    signersData.length === 0 ||
                    signersData.some((signer) => !signer.email) ||
                    loadingSendDocument ||
                    RecipientsData.some(
                      (signer) =>
                        !signer.name ||
                        !signer.email ||
                        inputErrorsRecipient.some((error) => error)
                    )
                  }
                  onClick={async (e) => {
                    console.log(RecipientsData);

                    // email template save
                    setLoadingSendDocument(true);
                    // // await saveData();

                    // // send to e-sign api
                    sendToEsignApi();
                  }}
                  color="primary"
                  text={
                    <>
                      {loadingSendDocument ? (
                        <Spinner color="light" size="sm" />
                      ) : null}
                      <span
                        style={{ fontSize: "16px" }}
                        className="align-middle ms-25"
                      >
                        {t("Send Document")}
                      </span>
                    </>
                  }
                  style={{
                    height: "40px",
                    fontSize: "16px",
                    boxShadow: "none",
                    marginLeft: "10px",
                    marginBottom: "1%",
                  }}
                />
              </Col>
            ) : (
              <Col xs={12} className="d-flex justify-content-end">
                <CustomButton
                  padding={true}
                  size="sm"
                  disabled={
                    signersData.length === 0 ||
                    signersData.some((signer) => !signer.email) ||
                    loadingSendDocument ||
                    RecipientsData.some(
                      (signer) =>
                        !signer.name ||
                        !signer.email ||
                        inputErrorsRecipient.some((error) => error)
                    )
                  }
                  onClick={async () => {
                    console.log(RecipientsData);

                    // email template save
                    setLoadingSendDocument(true);
                    // await saveData();

                    // send to e-sign api
                    sendToEsignApi();
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
                        {t("Send Document")}
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
                  }}
                />
              </Col>
            )}
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={isInputVisible}
        toggle={() => setIsInputVisible(!sendToEsign)}
        className="modal-dialog-centered modal-sm"
      >
        <ModalBody>
          <Row tag="form">
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
                  <h3>{t("Maximum Six Digit Secured Access Code")} </h3>
                  <Input
                    // autoFocus={false}
                    // onFocus={() => setIsInputFocused(true)}
                    // onBlur={() => setIsInputFocused(false)}
                    style={{
                      fontSize: "16px",
                      boxShadow: "none",
                      marginBlock: "5px",
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
              <CustomButton
                // color="primary"
                disabled={loadingAccessSave}
                size="sm"
                style={{
                  display: "flex",
                  marginBlock: "15px",
                  boxShadow: "none",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={async () => {
                  // email template save
                  handleCheckClickAccessCode(
                    signersData[activeRow].signer_id,
                    activeRow
                  );
                }}
                text={
                  <>
                    {loadingAccessSave ? (
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
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {/* set Esign order  */}
      <Modal
        isOpen={EsignOrderModal}
        toggle={() => setEsignOrderModal(!EsignOrderModal)}
        className="modal-dialog-centered modal-lg"
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!SignatureModal)}></ModalHeader> */}
        <ModalBody className=" pb-5">
          <Row tag="form">
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
                <h1 className="fw-bold">{t("Set e-sign Order")}</h1>
                <X
                  size={24}
                  onClick={() => setEsignOrderModal(!EsignOrderModal)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </Col>
            <Col xs={12}>
              <h3>{t("Drag to sort the list")}</h3>
              {/* <SortableList1
                items={signersData}
                onSortEnd={({ oldIndex, newIndex }) => {
                  // Reorder the array
                  const newArray = arrayMove(signersData, oldIndex, newIndex);

                  // Update the order_id of each item
                  const updatedArray = newArray.map((item, index) => ({
                    ...item,
                    order_id: index + 1, // Assuming order_id starts from 1
                  }));

                  // Update the state
                  //console.log(updatedArray);
                  setSignersData(updatedArray);
                }}
                useDragHandle
              /> */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="signersList">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="signers-list"
                    >
                      {signersData.map((signer, index) => (
                        <Draggable
                          key={signer.signer_id}
                          draggableId={signer.signer_id.toString()}
                          index={index}
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
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "left",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    backgroundColor: `${signer.color}`,
                                    // marginTop: '25px',
                                    marginRight: "10px",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                ></div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <h5
                                    style={{ fontSize: "13px" }}
                                    className="form-label"
                                    for={`animation-item-name`}
                                  >
                                    {signer.name}
                                  </h5>
                                  <h5
                                    style={{ fontSize: "12px" }}
                                    className="form-label"
                                    for={`animation-cost`}
                                  >
                                    {signer.email}
                                  </h5>{" "}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <ModalReusable
        isOpen={successModalAlert}
        // isOpen={true}

        successMessageData={[t("The document has been sent successfully!")]}
        errorMessageData={t("Document Send for E-sign Failed")}
        success={true}
        loader={true}

        // toggleFunc={() => setSuccessModalAlert(!successModalAlert)}
      />
    </>
  );
};

export default EditorMain;
