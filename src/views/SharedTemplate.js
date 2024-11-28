import { useEffect, useRef, useState } from "react";
import { BASE_URL, post, postFormData } from "../apis/api";
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
} from "reactstrap";
import Draggable from "react-draggable";
import { ChromePicker } from "react-color";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bold,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  Copy,
  FileText,
  Link,
  Link2,
  MapPin,
  Maximize,
  Plus,
  Trash,
  Trash2,
  Type,
  User,
  X,
} from "react-feather";
import logoRemoveBg from "@src/assets/images/pages/logoRemoveBg.png";
// import ForYou from '../components/ForYou';
// import ForOthers from '../components/ForOthers';
import { handlePlacePosition } from "../utility/EditorUtils/PlacePositions";
import toastAlert from "@components/toastAlert";
import Wizard from "@components/wizard";
import Repeater from "@components/repeater";
import { SlideDown } from "react-slidedown";
import {
  darkenColor,
  getRandomLightColor,
  lightenColor,
} from "../utility/Utils";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
// import Flatpickr from 'react-flatpickr';
import SignatureModalContent from "../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent";
// import { Layer, Line, Stage } from "react-konva";
import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";

const SharedTemplate = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const file_id = window.location.pathname.split("/")[2];
  const emailData = window.location.pathname.split("/")[3];

  const [activeImage, setActiveImage] = useState("");
  const [savedCanvasData, setSavedCanvasData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [isEditingStamp, setIsEditingStamp] = useState(false);
  const [isEditingDrivingLicense, setIsEditingDrivingLicense] = useState(false);
  const [isEditingPassportPhoto, setIsEditingPassportPhoto] = useState(false);
  const [isEditingStampImage, setIsEditingStampImage] = useState(false);
  const [isEditingInitials, setIsEditingInitials] = useState(false);
  const [isEditingSignerRadio, setIsEditingSignerRadio] = useState(false);
  const [isEditingSignerDropdown, setIsEditingSignerDropdown] = useState(false);
  const [datePickerActiveSigner, setDatePickerActiveSigner] = useState(false);
  const [indesDataPosition, setIndexDataPosition] = useState(null);
  const [signatureChooseImage, setSignatureChooseImage] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editedTextIndex, setEditedTextIndex] = useState(null);
  const [type, setType] = useState("");
  const [eventDataOnClick, setEventDataOnClick] = useState([]);
  const [selectedSigner, setSelectedSigner] = useState([]);
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
  const [firstIndex, setFirstIndex] = useState(true);
  const [saveButtonEnable, setSaveButtonEnable] = useState(false);
  const [signersData, setSignersData] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [stepper, setStepper] = useState(null);
  const [inputValueAccessCode, setInputValueAccessCode] = useState("");
  const [inputErrors, setInputErrors] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSignersSave, setLoadingSignersSave] = useState(false);
  const [loadingRecipientsSave, setLoadingRecipientsSave] = useState(false);
  const [inputErrorsRecipients, setInputErrorsRecipients] = useState([]);
  const [countReceipient, setCountReceipient] = useState(0);
  const [loadingSaveDocument, setLoadingSaveDocument] = useState(false);
  const [loadingSendDocument, setLoadingSendDocument] = useState(false);
  const [fileName, setFileName] = useState("");
  const [picker, setPicker] = useState(new Date());
  const [statusFile, setStatusFile] = useState("");
  const [SignatureModal, setSignatureModal] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [indexDataOnClick, setIndexDataOnClick] = useState(null);
  const [loaderRadio, setLoaderRadio] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [radioButtonGroup, setRadioButtonGroup] = useState({
    question: "",
    options: [],
    option: "",
  });
  const [onlySigner, setOnlySigner] = useState(null);
  const [signerCheckmark, setSignerCheckmark] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingIndex, setResizingIndex] = useState(null);

  const [link, setLink] = useState(null);
  const elementRefCursor = useRef(null);

  const [dropdownGroup, setDropdownGroup] = useState({
    question: "",
    option: "",
    options: [],
    text: "",
  });
  const [loaderDropdown, setLoaderDropdown] = useState(false);
  // Define the dropdownOpen state
  const [dropdownOpenForOther, setDropdownOpenForOther] = useState(true);

  // Define the handleSelectOption function
  const handleSelectOption = (option) => {
    setDropdownGroup((prevState) => ({ ...prevState, text: option }));
  };
  const handleAddOptionDropdown = () => {
    setDropdownGroup((prevState) => ({
      ...prevState,
      options: [...prevState.options, prevState.option],
      option: "",
    }));
  };
  // Define the toggleDropdown function
  const toggleDropdownForOther = () => {
    setDropdownOpenForOther((prevState) => !prevState);
  };
  const [modalOpenDropdown, setModalOpenDropdown] = useState(false);
  // start
  const [dropdownOpenOptionOther, setDropdownOpenOptionOther] = useState(false);

  const toggleDropdownOptionOther = () => {
    setDropdownOpenOptionOther((prevState) => !prevState);
  };

  const handleSelectOptionOptionOther = (option, index) => {
    const newSavedCanvasData = [...savedCanvasData];
    newSavedCanvasData[index].text = option;
    setSavedCanvasData(newSavedCanvasData);
  };
  // end
  const imageRefs = useRef([]);
  const ref = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const fetchData = async (fileId) => {
    //console.log('fileId');

    //console.log(fileId);
    // get Images from db
    const postData = {
      template_id: fileId,
    };
    const apiData = await post("template/getbgImagesByTemplateId", postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No Images Selected")
    } else {
      // toastAlert("success", "You can Edit document ")

      setImageUrls(apiData.result);
      setActiveImage(apiData.result[0].template_bg_imgs_id);
      setActiveImageUrl(apiData.result[0].image);
    }
  };
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
    //console.log('Position Data');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", apiData.message)
    } else {
      // toastAlert("success", apiData.message)
      //console.log('positions');
      //console.log(apiData.result);
      // getCanvas Data
      setSavedCanvasData(apiData.result[0].position_array);
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
    const color_code = getRandomLightColor();
    //console.log(color_code);
    setSignersData([
      ...signersData,
      { id: signersData.length + 1, name: "", email: "", color: color_code },
    ]);
    setCount(count + 1);
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
  const handleImageChange = async (e, arrayObj) => {
    const files = e.target.files[0];
    // upload image
    const postData = {
      image: files,
    };
    const apiData = await postFormData(postData); // Specify the endpoint you want to call
    // //console.log(apiData)
    if (
      apiData.path === null ||
      apiData.path === undefined ||
      apiData.path === ""
    ) {
      // toastAlert("error", "Error uploading Files")
    } else {
      // toastAlert("success", "Successfully Upload Files")
      //console.log('result');
      //console.log(apiData.path);

      const url = apiData.path;
      //console.log(arrayObj);
      // arrayObj, type, imageUrl, selectedSigner.color, "null", selectedSigner.signer_id
      let resultingData = handlePlacePosition(arrayObj, type, activeImage, url);
      //console.log(resultingData);
      setSavedCanvasData([...savedCanvasData, resultingData]);
      setType("");
      // setSavedCanvasData([...savedCanvasData, { x: XSignature, y: YSignature, type, url, width: 100, height: 100, bgImg: activeImage }]);
      // const canvasDatalength = savedCanvasData.length
      // setIndexSelected(canvasDatalength)
      // setType("")
    }
  };
  const handleThumbnailClick = (event, imageUrl, index) => {
    setActiveImage(imageUrl);
    //console.log(imageUrl);
    setShowColorPicker(false);
    setDatePickerActive(false);
    // imageRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    const rect = event.currentTarget.getBoundingClientRect();
    //console.log(rect);

    const x = event.offsetX;
    const y = event.offsetY;
    let arrayObj = {
      x,
      y,
      rect,
    };
    setEventDataOnClick(arrayObj);

    if (type === null || type === undefined || type === "") {
    } else {
      //console.log('selectedSigner');
      if (type === "my_signature") {
        const rect = event.currentTarget.getBoundingClientRect();
        // const x = event.clientX - rect.left;
        // const y = event.clientY - rect.top;

        const x = event.offsetX;
        const y = event.offsetY;
        let arrayObj = {
          x,
          y,
          rect,
        };
        setEventDataOnClick(arrayObj);
        setIndexDataOnClick(index);
        setSignatureModal(true);
      } else if (type === "stamp") {
        //console.log('stamp');
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.offsetX;
        const y = event.offsetY;
        // const x = event.clientX - rect.left;
        // const y = event.clientY - rect.top;
        let arrayObj = {
          x,
          y,
          rect,
        };
        setEventDataOnClick(arrayObj);
        //console.log('Event Data onclick ');
        //console.log(arrayObj);

        setIndexDataOnClick(index);
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png";
        input.onchange = (e) => handleImageChange(e, arrayObj);
        input.click();
      } else if (type === "signer_radio") {
        //console.log('signer_radio');
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.offsetX;
        const y = event.offsetY;
        // const x = event.clientX - rect.left;
        // const y = event.clientY - rect.top;
        let arrayObj = {
          x,
          y,
          rect,
        };
        setEventDataOnClick(arrayObj);
        //console.log('Event Data onclick ');
        //console.log(arrayObj);

        setIndexDataOnClick(index);
        setModalOpen(true);
        // const input = document.createElement('input');
        // input.type = 'file';
        // input.accept = 'image/*';
        // input.onchange = (e) => handleImageChange(e, arrayObj);
        // input.click();
      } else if (type === "signer_dropdown") {
        //console.log('signer_dropdown');
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.offsetX;
        const y = event.offsetY;
        // const x = event.clientX - rect.left;
        // const y = event.clientY - rect.top;
        let arrayObj = {
          x,
          y,
          rect,
        };
        setEventDataOnClick(arrayObj);
        //console.log('Event Data onclick ');
        //console.log(arrayObj);

        setIndexDataOnClick(index);
        setModalOpenDropdown(true);
        // const input = document.createElement('input');
        // input.type = 'file';
        // input.accept = 'image/*';
        // input.onchange = (e) => handleImageChange(e, arrayObj);
        // input.click();
      } else {
        // if (active === '2') {
        //   if (selectedSigner === null || selectedSigner === undefined || selectedSigner === "" ||
        //     selectedSigner.length === 0) {
        //     toastAlert("error", "Please Select Signer")
        //   } else {
        //     //console.log("selectedSigner")
        //     //console.log(selectedSigner)

        //     let resultingData = handlePlacePosition(arrayObj, type, imageUrl, selectedSigner.color, "null", selectedSigner.signer_id)
        //     //console.log(resultingData)
        //     setSavedCanvasData([...savedCanvasData, resultingData])
        //     // setEditStateTextTopbar(false)
        //     // setType('')
        //   }
        // } else {
        //console.log('imageUrl');

        //console.log(imageUrl);
        let resultingData = handlePlacePosition(
          arrayObj,
          type,
          imageUrl,
          "#74cbeb",
          "null",
          "null"
        );
        //console.log(resultingData);
        setSavedCanvasData([...savedCanvasData, resultingData]);
        // setEditStateTextTopbar(false)
        setType("");
        // }
      }
    }
  };
  const placeImage = async (url, prevSign, typeSign) => {
    if (
      type === "signer_initials" ||
      type === "signer_chooseImgDrivingL" ||
      type === "signer_chooseImgPassportPhoto" ||
      type === "signer_chooseImgStamp"
    ) {
      //console.log(type);
      //console.log(typeSign);
      //console.log(url);
      setSignatureModal(false);
      const newSavedCanvasData = [...savedCanvasData];
      newSavedCanvasData[indesDataPosition].url = url;
      setSavedCanvasData(newSavedCanvasData);
      //console.log(savedCanvasData);

      setType("");
    } else {
      if (prevSign === "prevSign") {
        setSignatureModal(false);
        //console.log('url');
        //console.log(url);
        let resultingData = handlePlacePosition(
          eventDataOnClick,
          type,
          activeImage,
          url
        );
        //console.log(resultingData);
        setSavedCanvasData([...savedCanvasData, resultingData]);
        setType("");
      } else {
        // call api to save previous user signatures
        //console.log('sdgfdfshjdfdf');
        //console.log(url);

        const items = JSON.parse(localStorage.getItem("@UserLoginRS"));

        const user_id = items?.token?.user_id;
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
          //console.log(activeImage);
          let resultingData = handlePlacePosition(
            eventDataOnClick,
            type,
            activeImage,
            url
          );
          //console.log(resultingData);
          setSavedCanvasData([...savedCanvasData, resultingData]);
          setType("");
        }

        // end Call
      }
    }
  };
  const handleTextDrag = (e, data, index) => {
    const newSavedCanvasData = [...savedCanvasData];
    newSavedCanvasData[index] = {
      ...newSavedCanvasData[index],
      x: data.x,
      y: data.y,
    };
    setSavedCanvasData(newSavedCanvasData);
  };
  const saveData = async () => {
    setsaveLoading(true);
    //console.log(savedCanvasData);
    const postData = {
      // template_id: file_id,
      // email
      position_array: savedCanvasData,
    };
    try {
      const apiData = await post(
        "template/saveCanvasDataWithtemplateId",
        postData
      ); // Specify the endpoint you want to call
      //console.log('Save Bulk Link Positions  To canvas ');

      //console.log(apiData);
      if (apiData.error) {
        // toastAlert("error", apiData.message)
        // setData(null)
        setsaveLoading(false);
        setSaveSuccess(false);
      } else {
        // //console.log(apiData.result)
        // toastAlert("succes", apiData.message)
        // setData(apiData.result)
        setsaveLoading(false);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 2000);
        fetchDataPositions(file_id);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      // setsaveLoading(false)
    }
  };
  // Input Text
  // const handleInputChanged = (event, index) => {
  //   const newSavedCanvasData = [...savedCanvasData];
  //   newSavedCanvasData[index].text = event.target.value;
  //   setSavedCanvasData(newSavedCanvasData);
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
    newSavedCanvasData[index].width = newWidth;
  
    setTextItems(newSavedCanvasData);
    setEditedItem((prevState) => ({
      ...prevState,
      text: newText,
      width: newWidth,
    }));
  };
  const [datePickerActive, setDatePickerActive] = useState(false);
  const handleTextClick = (index, typeData, returned_position) => {
    if (typeData === "my_text") {
      setIsEditing(true);
      setEditingIndex(index);
    } else if (typeData === "my_signature") {
      setIsEditingSignature(true);
      setEditingIndex(index);
    } else if (typeData === "date") {
      setDatePickerActive(true);
      setEditingIndex(index);
    } else if (typeData === "signer_date") {
      setDatePickerActiveSigner(true);
      setEditingIndex(index);
    } else if (typeData === "stamp") {
      setIsEditingStamp(true);
      setEditingIndex(index);
    } else if (typeData === "signer_checkmark") {
      setSignerCheckmark(true);
      setEditingIndex(index);
    } else if (typeData === "signer_chooseImgDrivingL") {
      //console.log(returned_position);
      setIndexDataPosition(index);
      setSignatureChooseImage(true);

      setType("signer_chooseImgDrivingL");
      let arrayObj = {
        x: returned_position.x,
        y: returned_position.y,
      };
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(index);
      setSignatureModal(true);
    } else if (typeData === "signer_chooseImgPassportPhoto") {
      //console.log(returned_position);
      setIndexDataPosition(index);
      setSignatureChooseImage(true);

      setType("signer_chooseImgPassportPhoto");
      let arrayObj = {
        x: returned_position.x,
        y: returned_position.y,
      };
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(index);
      setSignatureModal(true);
    } else if (typeData === "signer_chooseImgStamp") {
      //console.log(returned_position);
      setIndexDataPosition(index);

      setType("signer_chooseImgStamp");
      let arrayObj = {
        x: returned_position.x,
        y: returned_position.y,
      };
      setSignatureChooseImage(false);

      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(index);
      setSignatureModal(true);
    } else if (typeData === "signer_initials") {
      //console.log(returned_position);
      setIndexDataPosition(index);
      setSignatureChooseImage(false);

      setType("signer_initials");
      let arrayObj = {
        x: returned_position.x,
        y: returned_position.y,
      };
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(index);
      setSignatureModal(true);
    }
  };

  const handleFontSizeChange = (index, fontSize, item) => {
    // Implement your logic to change the font size here
    //console.log(index);
    //console.log(fontSize);
    if (item === "big") {
      if (parseInt(fontSize) === 100) {
      } else {
        savedCanvasData[index].fontSize = parseInt(fontSize) + parseInt(1);
      }
    } else {
      if (parseInt(fontSize) === 1) {
      } else {
        savedCanvasData[index].fontSize = parseInt(fontSize) - parseInt(1);
      }
    }
  };

  const handleFontWeightChange = (index) => {
    // Implement your logic to change the font weight here
    if (parseInt(savedCanvasData[index].fontWeight) === parseInt(400)) {
      savedCanvasData[index].fontWeight = 600;
      //console.log('600');
    } else {
      savedCanvasData[index].fontWeight = 400;
      //console.log(savedCanvasData);
      //console.log('400');
    }
  };

  const handleColorChange = (newColor) => {
    // Implement your logic to change the color here
    savedCanvasData[editedTextIndex].color = newColor.hex;
    // setShowColorPicker(false)
  };
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const getTypeListItem = (type) => {
    //console.log('Type');
    //console.log(type);
    if (type === "signer") {
      setSignerAddEdit(true);
      // setType("my_text")
    } else {
      setType(type);
    }
  };
  const handleDeleteCurrentPosition = (index) => {
    setDeleteIndex(index);
    setItemDeleteConfirmation(true);
  };
  const DeleteItemFromCanvas = () => {
    setloadingDelete(true);
    // const updatedImageUrls = [...savedCanvasData];
    // updatedImageUrls.splice(deleteIndex, 1); // Remove the image at the specified index
    // const updatedCanvasData = [...savedCanvasData];
    // updatedCanvasData.splice(deleteIndex, 1); // Remove the corresponding data
    // setSavedCanvasData(updatedCanvasData); // Update the savedCanvasData state
    // //console.log(updatedCanvasData)
    const updatedCanvasData = [...savedCanvasData];
    updatedCanvasData.splice(deleteIndex, 1);

    setSavedCanvasData(updatedCanvasData); // Update the savedCanvasData state
    //console.log(updatedCanvasData);
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
        // toastAlert("error", apiData.message)
        setSignersData([]);
      } else {
        // //console.log(apiData.result)
        // toastAlert("succes", apiData.message)
        setSignersData(apiData.result);
        setCount(apiData.result.length);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
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

  const deleteForm = (e) => {
    e.preventDefault();
    const slideDownWrapper = e.target.closest(".react-slidedown"),
      form = e.target.closest("form");
    if (slideDownWrapper) {
      slideDownWrapper.remove();
    } else {
      form.remove();
    }
  };
  // send to esign
  const sendToEsignApi = async () => {
    // api to update name of file
    const postData = {
      file_id: file_id,
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
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setLoadingSendDocument(false);
    }
  };
  // Fetch File
  const fetchFileData = async (fileId) => {
    // const bulk_link_id = fileId
    // const Url=`${BASE_URL}bulk_link_doc_view/${bulk_link_id}`
    // // window.location.href = `/e-sign-form-create/${bulk_link_id}`;
    // setLink(Url)
    // get Images from db
    const postData = {
      template_id: fileId,
    };
    const apiData = await post("template/viewTemplate", postData); // Specify the endpoint you want to call
    //console.log('Bulk link Data Fetched');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      setFileName(apiData.result.file_name || "");
      setLink(apiData.result.url);
      // setInputValue(apiData.data.name || "")
      // //console.log("dfdf")
      // //console.log(apiData.data.only_signer)
      // setOnlySigner(apiData.data.only_signer || false)
      // setEmailMessage(apiData.data.email_message || "")
      // setEmailSubject(apiData.data.email_subject || "")
      // setSecuredShare(apiData.data.secured_share || false)
      // setSignerFunctionalControls(apiData.data.signer_functional_controls || false)
      // setSetEsignOrder(apiData.data.esign_order || false)
      // setStatusFile(apiData.data.status || "")
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
        // toastAlert("error", apiData.message)
        setRecipientsData([]);
        setCountReceipient(apiData.result.length);
      } else {
        // //console.log(apiData.result)
        // toastAlert("succes", apiData.message)
        setRecipientsData(apiData.result);
        setCountReceipient(apiData.result.length);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // nav tabs
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const toggleDropdown1 = () => setDropdownOpen1((prevState) => !prevState);

  const handleAddOption = () => {
    setRadioButtonGroup((prevState) => ({
      ...prevState,
      options: [...prevState.options, prevState.option],
      option: "",
    }));
  };
  const handleDeleteOption = (index) => {
    setRadioButtonGroup((prevState) => ({
      ...prevState,
      options: prevState.options.filter((_, i) => i !== index),
    }));
  };
  const handleDeleteOptionDropdown = (index) => {
    setDropdownGroup((prevState) => ({
      ...prevState,
      options: prevState.options.filter((_, i) => i !== index),
    }));
  };
  const CallFuncHashedReceivedTemplate = async (fileId, email) => {
    const postData = {
      url_hashed: fileId,
      email: email,
    };
    const apiData1 = await post("template/unHashTemplates", postData); // Specify the endpoint you want to call
    //console.log('apiData1');
    //console.log(apiData1);

    if (apiData1.error === true || apiData1.error === "true") {
      window.location.href = "/error";
    } else {
      let fileIdData = apiData1.template_id;
      fetchData(fileIdData);
      fetchFileData(fileIdData);
      fetchDataPositions(fileIdData);
    }
  };
  useEffect(() => {
    //console.log(emailData);
    //console.log(window.innerWidth);
    // if (window.innerWidth >= 1600) { // for extra large screens
    //   document.body.style.zoom = "125%";
    // } else { // for small to large screens
    //   document.body.style.zoom = "90%";
    // }
    //console.log(file_id);
    CallFuncHashedReceivedTemplate(file_id, emailData);

    // fetchSignerData(file_id);
    // // fetchPrevSignatureImages();

    // fetchRecipientsData(file_id);
    // fetchPrevSignatureImages();
  }, []);
  useEffect(() => {
    const handleMouseMove = (e) => {
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
        type === "signer_initials" ||
        type === "signer_chooseImgDrivingL" ||
        type === "signer_chooseImgPassportPhoto" ||
        type === "signer_chooseImgStamp" ||
        type === "signer_radio" ||
        type === "signer_dropdown"
      ) {
        // Set position of the custom box to follow the mouse
        const box = elementRefCursor.current;
        box.style.left = e.clientX + "px";
        box.style.top = e.clientY + "px";
      }
    };
    const col9 = document.getElementById("col-9");
    // Add event listener for mousemove
    col9.addEventListener("mousemove", handleMouseMove);

    // Cleanup function
    return () => {
      col9.removeEventListener("mousemove", handleMouseMove);
    };
  }, [type]);
  // const [lines, setLines] = useState([]);
  // const [isDrawing, setIsDrawing] = useState(false);

  // const handleMouseDown = (e) => {
  //   if (type !== 'highlight') return;
  //   setIsDrawing(true);
  //   setLines([...lines, { points: [e.evt.x, e.evt.y], color: 'yellow' }]);
  // };

  // const handleMouseMove = (e) => {
  //   if (!isDrawing || type !== 'highlight') return;
  //   const currentLine = lines[lines.length - 1];
  //   currentLine.points = [...currentLine.points, e.evt.x, e.evt.y];
  //   setLines([...lines.slice(0, lines.length - 1), currentLine]);
  // };

  // const handleMouseUp = () => {
  //   setIsDrawing(false);
  // };
  return (
    <>
      <Row>
        <Col
          xl={12}
          md={12}
          sm={12}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            borderBottom: "1px solid #ececec",

            zIndex: 999,
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
              {/* back button
               */}
              <div style={{ display: "flex" }}>
                {/* <Button style={{ boxShadow: 'none', height: '40px' }}
                  color='primary'
                  onClick={async () => {
                    if (window.confirm('Do you want to save the previous changes?')) {
                      await saveData();
                    }
                    window.location.href = "/template"
                  }
                  }
                  className='btn-icon d-flex'>
                  <ArrowLeft size={20} />
                  <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Back</span>
                </Button> */}
                <img
                  src={logoRemoveBg}
                  style={{
                    width: "200px",
                    height: "auto",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <ButtonDropdown style={{ maxHeight: '40px', boxShadow: 'none' }} size="sm" isOpen={dropdownOpen1} toggle={toggleDropdown1}>
                  <DropdownToggle color='primary' style={{ fontSize: '16px', height: '40px', boxShadow: 'none' }}  caret>
                    {active === '1' ? 'For You' : 'For Other'}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem style={{ fontSize: "14px", width: '100%' }}
                      onClick={() => {
                        toggle('2')
                      }}>
                      For Others
                    </DropdownItem>


                  </DropdownMenu>
                </ButtonDropdown> */}
                {/* <TabContent className='py-50' style={{ marginLeft: '10px' }} activeTab={active}> */}

                {/* <TabPane tabId='1'>
                    <ForYou type={getTypeListItem} />

                  </TabPane> */}
                {/* <TabPane tabId='2'> */}
                {/* <ForOthersBulkLink type={getTypeListItem} /> */}
                {/* </TabPane> */}

                {/* </TabContent> */}
              </div>

              <div style={{ display: "flex" }}>
                {/* <Button
                  disabled={saveLoading}
                  color={saveSuccess ? 'success' : 'primary'}
                  onClick={() => saveData()}
                  style={{ height: '40px',boxShadow:'none' }} className='btn-icon d-flex'>
                  {saveLoading ? <Spinner color='white' size='sm' /> : saveSuccess ? <Check color='white' size='sm' /> : null}
                  <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Save</span>
                </Button> */}
                <Button
                  disabled={saveLoading}
                  color={saveSuccess ? "success" : "primary"}
                  onClick={() => saveData()}
                  style={{
                    height: "40px",
                    marginLeft: "10px",
                    boxShadow: "none",
                  }}
                  className="btn-icon d-flex"
                >
                  {saveLoading ? (
                    <Spinner color="white" size="sm" />
                  ) : saveSuccess ? (
                    <Check color="white" size="sm" />
                  ) : null}
                  <span
                    style={{ fontSize: "16px" }}
                    className="align-middle ms-25"
                  >
                    Finish{" "}
                  </span>
                </Button>
                {/* <Button
                // disabled={saveLoading}
                color="primary"
                // onClick={() => saveData()}
                style={{ height: '40px',marginLeft:'10px' }} className='btn-icon d-flex'>
                <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Save & Close</span>
              </Button> */}

                {/* {onlySigner === true || onlySigner === "true" ? <Button
                color='success'
                onClick={async() => {
                  const postData = {
                    file_id: file_id,
                    status: "Completed"
                  };
                  try {
                    const apiData = await post('file/update-file', postData); // Specify the endpoint you want to call
                    //console.log("Update File Controls ")
                    //console.log(apiData)
                    if (apiData.error) {
                      toastAlert("error", apiData.message)
                      // setFileName("")
                      // setInputValue("")
                    } else {
                      // //console.log(apiData.result)
                      toastAlert("succes", apiData.message)

                     await saveData()
                     window.location.href = "/home"
                      // setFileName(apiData.data.name)
                      // setInputValue(apiData.data.name)
                    }
                  } catch (error) {
                    //console.log('Error fetching data:', error);
              
                  }
                }}
                style={{ height: '40px',marginLeft:'10px' }} className='btn-icon d-flex'>

                <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Finish</span>
              </Button> :
                <Button
                  disabled={signersData.length === 0 ? true : false}
                  color='primary'
                  onClick={() => {
                    if (signersData.length === 0) {
                      toastAlert("error", "Please Add Signers")
                    } else {
                      setSendToEsign(true)

                    }
                  }}
                  style={{ height: '40px',marginLeft:'10px' }} className='btn-icon d-flex'>

                  <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Send E-Sign</span>
                </Button>
              }         */}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} style={{ marginTop: "8%" }}>
          <Row>
            <Col xs={12} md={2}></Col>
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
              }}
            >
              <div
                id="col-9"
                style={{
                  maxHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* {imageUrls.map((imageUrl, index) => ( */}
                <>
                  {/* <Stage width='auto' height={window.innerHeight} onMouseDown={handleMouseDown} onMousemove={handleMouseMove} onMouseup={handleMouseUp}>
                <Layer> */}
                  <img
                    // key={index}
                    // ref={(el) => imageRefs.current[index] = el}
                    src={`${BASE_URL}${activeImageUrl}`}
                    onClick={() => {
                      // //console.log(imageUrl.bgimgs_id)
                      // handleThumbnailClick(event, activeImage)
                    }}
                    // style={{
                    //    border: activeImage === imageUrl.bgimgs_id ?  '2px solid gray' : 'none' }}
                  />
                  {/* {lines.map((line, i) => (
                    <Line key={i} points={line.points} stroke={line.color} strokeWidth={5} tension={0.5} lineCap="round" globalCompositeOperation="source-over" />
                  ))}
                </Layer>
              </Stage> */}
                  {/* <span className="p-2">Page No {index}</span> */}
                  {/* {savedCanvasData.filter(position => position.bgImg === imageUrl.bgimgs_id).map((position, positionIndex) => { */}

                  {savedCanvasData.map((position, index) => {
                    if (position.type === "my_text") {
                      return (
                        <Draggable
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            onClick={() => handleTextClick(index, "my_text")}
                          >
                            <input
                              value={position.text}
                              onChange={(e) => handleInputChanged(e, index)}
                              style={{
                                fontSize: position.fontSize,
                                fontStyle: position.fontStyle,
                                fontWeight: position.fontWeight,
                                color: position.color,
                                backgroundColor: position.backgroundColor,
                                border: "none",
                                fontFamily: position.fontFamily,
                                width: `${position.text.length}ch`,
                              }}
                            />
                            {isEditing && editingIndex === index && (
                              <div>
                                <ButtonGroup
                                  size="sm"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleFontSizeChange(
                                        index,
                                        position.fontSize,
                                        "big"
                                      )
                                    }
                                  >
                                    <ChevronsUp size={15} />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleFontSizeChange(
                                        index,
                                        position.fontSize,
                                        "small"
                                      )
                                    }
                                  >
                                    <ChevronsDown size={15} />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleFontWeightChange(index)
                                    }
                                  >
                                    <Bold size={15} />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => {
                                      setEditedTextIndex(index);
                                      setShowColorPicker(!showColorPicker);
                                    }}
                                  >
                                    <Type
                                      style={{ color: position.color }}
                                      size={15}
                                    />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleDeleteCurrentPosition(index)
                                    }
                                  >
                                    <Trash2
                                      style={{ color: "red" }}
                                      size={15}
                                    />
                                  </Button>
                                </ButtonGroup>
                                {showColorPicker && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      zIndex: 200,
                                    }}
                                  >
                                    <ChromePicker
                                      color={position.color}
                                      onChange={handleColorChange}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "my_signature") {
                      return (
                        <Draggable
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            <ResizableBox
                              width={position.width}
                              height={position.height}
                              className={isResizing ? "resizing" : ""} // Add a class when resizing
                              onResizeStart={() => {
                                setIsResizing(true);
                                setResizingIndex(index); // Track the index of the resizing element
                              }}
                              // handle={<span className="resize-handle" />} // Add this line
                              onResizeStop={(e, { size }) => {
                                setIsResizing(false);
                                setResizingIndex(null);
                                // Update the savedCanvasData state here
                                // For example:
                                let newSavedCanvasData = [...savedCanvasData];
                                // newSavedCanvasData[index].width = size.width;
                                // newSavedCanvasData[index].height = size.height;
                                // setSavedCanvasData(newSavedCanvasData);
                                const aspectRatio =
                                  position.width / position.height;
                                // Calculate new width and height while maintaining aspect ratio
                                if (size.width / aspectRatio <= size.height) {
                                  size.height = size.width / aspectRatio;
                                } else {
                                  size.width = size.height * aspectRatio;
                                }
                                newSavedCanvasData[index].width = size.width;
                                newSavedCanvasData[index].height = size.height;
                                setSavedCanvasData(newSavedCanvasData);
                              }}
                            >
                              {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                          <Maximize size={15}/>
                          </div> */}
                              {isResizing && resizingIndex === index && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "2px dashed #000", // Dotted border style
                                    pointerEvents: "none", // Ensure the div doesn't block events
                                  }}
                                />
                              )}
                              <img
                                // className="drag-handle"
                                // onClick={() => setEdit(!edit)}
                                alt="Remy Sharp"
                                onClick={() =>
                                  handleTextClick(index, "my_signature")
                                }
                                variant="square"
                                src={`${BASE_URL}${position.url}`}
                                style={{
                                  backgroundColor: `${
                                    isEditingSignature && editingIndex === index
                                      ? "#e4e3e5"
                                      : "transparent"
                                  }`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  // border: '1px solid lightGray',
                                }}
                              />
                            </ResizableBox>
                            {/* <input
                        value={position.text}
                        onChange={(e) => handleInputChanged(e, index)}
                        style={{
                          fontSize: position.fontSize,
                          fontStyle: position.fontStyle,
                          fontWeight: position.fontWeight,
                          color: position.color,
                          backgroundColor: position.backgroundColor,
                          border: 'none',
                          fontFamily: position.fontFamily,
                          width: `${position.text.length}ch`
                        }} 
                      />*/}
                            {isEditingSignature && editingIndex === index && (
                              <div>
                                <ButtonGroup
                                  size="sm"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <Button outline color="primary">
                                    <Maximize
                                      size={15}
                                      className="drag-handle"
                                    />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleDeleteCurrentPosition(index)
                                    }
                                  >
                                    <Trash2
                                      style={{ color: "red" }}
                                      size={15}
                                    />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "date") {
                      return (
                        <Draggable
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            onClick={() => handleTextClick(index, "date")}
                          >
                            <div>
                              <input
                                type="date"
                                className="form-control"
                                style={{
                                  height: "40px",
                                  fontSize: position.fontSize,
                                  opacity: 0.5,
                                }}
                                value={position.text}
                                onFocus={() => setDatePickerActive(true)}
                                onChange={(event) => {
                                  const newSavedCanvasData = [
                                    ...savedCanvasData,
                                  ];
                                  newSavedCanvasData[index].text =
                                    event.target.value;
                                  setSavedCanvasData(newSavedCanvasData);
                                  setDatePickerActive(false);
                                }}
                                id="default-picker"
                              />
                              {/* <Flatpickr
                        className='form-control '
                        style={{
                          height:'10px',
                          fontSize:'16px'

                        }}
                        value={position.text}
                        onOpen={() => setDatePickerActive(true)}
                        onChange={date => {
                          // setEdit(false)
                          // setPicker(date)
                          const newSavedCanvasData = [...savedCanvasData];
                          newSavedCanvasData[index].text = date;
                          setSavedCanvasData(newSavedCanvasData);
                          setDatePickerActive(false)

                        }}
                        options={{
                          altInput: true,
                          altFormat: 'F j, Y', // Day of the month, month, year
                          dateFormat: 'Y-m-d'
                        }}

                        id='default-picker' /> */}
                              {datePickerActive && editingIndex === index && (
                                <div>
                                  <ButtonGroup
                                    size="sm"
                                    style={{ backgroundColor: "white" }}
                                  >
                                    <Button
                                      outline
                                      color="primary"
                                      onClick={() =>
                                        handleFontSizeChange(
                                          index,
                                          position.fontSize,
                                          "big"
                                        )
                                      }
                                    >
                                      <ChevronsUp size={15} />
                                    </Button>
                                    <Button
                                      outline
                                      color="primary"
                                      onClick={() =>
                                        handleFontSizeChange(
                                          index,
                                          position.fontSize,
                                          "small"
                                        )
                                      }
                                    >
                                      <ChevronsDown size={15} />
                                    </Button>
                                    <Button outline color="primary">
                                      <Maximize
                                        size={15}
                                        className="drag-handle"
                                      />
                                    </Button>
                                    <Button
                                      outline
                                      color="primary"
                                      onClick={() =>
                                        handleDeleteCurrentPosition(index)
                                      }
                                    >
                                      <Trash2
                                        style={{ color: "red" }}
                                        size={15}
                                      />
                                    </Button>
                                  </ButtonGroup>
                                </div>
                              )}
                              {/* <Button outline color='primary' onClick={() => handleDeleteCurrentPosition(index)}>
                        <Trash2 style={{ color: 'red' }} size={15} />
                      </Button> */}
                            </div>
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "checkmark") {
                      return (
                        <Draggable
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index, "date")}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Input
                                type="checkbox"
                                checked={position.text}
                                onChange={(e) => {
                                  //console.log(e.target.checked);
                                  // setPicker(date)
                                  const newSavedCanvasData = [
                                    ...savedCanvasData,
                                  ];
                                  newSavedCanvasData[index].text =
                                    e.target.checked;
                                  setSavedCanvasData(newSavedCanvasData);
                                }}
                                id="basic-cb-checked"
                              />
                              {/* <input
                        value={position.placeholder}
                        onChange={(e) => {
                          const newSavedCanvasData = [...savedCanvasData];
                          newSavedCanvasData[index].placeholder = e.target.value;
                          setSavedCanvasData(newSavedCanvasData);
                          // handleInputChanged(e, index)
                        }}
                        style={{
                          marginLeft: '10px',
                          fontSize: position.fontSize,
                          border: '1px solid grey',

                        }}
                      /> */}

                              <div style={{ marginLeft: "10px" }}>
                                <ButtonGroup
                                  size="sm"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleDeleteCurrentPosition(index)
                                    }
                                  >
                                    <Trash2
                                      style={{ color: "red" }}
                                      size={15}
                                    />
                                  </Button>
                                </ButtonGroup>
                              </div>

                              {/* <Button color='primary' > */}
                              {/* <Trash2 style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }} size={20} onClick={() => handleDeleteCurrentPosition(index)} /> */}
                              {/* </Button> */}
                            </div>
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "signer_text") {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index, "my_text")}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* <input
                            value={position.placeholder}
                            placeholder="Enter PlaceHolder"
                            onChange={(e) => {
                              const newSavedCanvasData = [...savedCanvasData];
                              newSavedCanvasData[index].placeholder = e.target.value;
                              setSavedCanvasData(newSavedCanvasData);
                              // handleInputChanged(e, index)
                            }}
                            style={{
                              fontSize: '16px',
                              border: 'none',
                            }}
                          /> */}
                              <input
                                value={position.text}
                                onChange={(e) => {
                                  const newSavedCanvasData = [
                                    ...savedCanvasData,
                                  ];
                                  newSavedCanvasData[index].text =
                                    e.target.value;
                                  setSavedCanvasData(newSavedCanvasData);
                                  // handleInputChanged(e, index)
                                }}
                                style={{
                                  fontSize: position.fontSize,
                                  fontStyle: position.fontStyle,
                                  fontWeight: position.fontWeight,
                                  width: position.width,
                                  color: position.color,
                                  backgroundColor: position.backgroundColor,
                                  border: "none",
                                  fontFamily: position.fontFamily,
                                  opacity: 0.5,
                                  // width: `${position.text.length}ch`
                                }}
                              />
                            </div>

                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "signer_date") {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            onClick={() =>
                              handleTextClick(index, "signer_date")
                            }
                          >
                            <div>
                              <input
                                type="date"
                                className="form-control"
                                style={{
                                  height: "40px",
                                  fontSize: position.fontSize,
                                  opacity: 0.5,
                                  backgroundColor: `${position.backgroundColor}`,
                                }}
                                value={position.text}
                                onFocus={() => setDatePickerActiveSigner(true)}
                                onChange={(event) => {
                                  const newSavedCanvasData = [
                                    ...savedCanvasData,
                                  ];
                                  newSavedCanvasData[index].text =
                                    event.target.value;
                                  setSavedCanvasData(newSavedCanvasData);
                                  setDatePickerActiveSigner(false);
                                }}
                                id="default-picker"
                              />
                            </div>
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "stamp") {
                      return (
                        <Draggable
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            <ResizableBox
                              width={position.width}
                              height={position.height}
                              // handle={<span className="resize-handle" />} // Add this line
                              onResizeStop={(e, { size }) => {
                                setIsResizing(false);
                                setResizingIndex(null);
                                // Update the savedCanvasData state here
                                // For example:
                                let newSavedCanvasData = [...savedCanvasData];
                                newSavedCanvasData[index].width = size.width;
                                newSavedCanvasData[index].height = size.height;
                                setSavedCanvasData(newSavedCanvasData);
                              }}
                              onResizeStart={() => {
                                setIsResizing(true);
                                setResizingIndex(index); // Track the index of the resizing element
                              }}
                            >
                              {isResizing && resizingIndex === index && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "2px dashed #000", // Dotted border style
                                    pointerEvents: "none", // Ensure the div doesn't block events
                                  }}
                                />
                              )}
                              {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                          <Maximize size={15}/>
                          </div> */}
                              <img
                                // className="drag-handle"
                                // onClick={() => setEdit(!edit)}
                                alt="Remy Sharp"
                                onClick={() => handleTextClick(index, "stamp")}
                                variant="square"
                                src={`${BASE_URL}${position.url}`}
                                style={{
                                  filter: "grayscale(100%)",
                                  width: `${position.width}px`,
                                  // height: `${position.height}px`,
                                  height: "auto",
                                  // border: '1px solid lightGray',
                                }}
                              />
                            </ResizableBox>
                            {/* <input
                        value={position.text}
                        onChange={(e) => handleInputChanged(e, index)}
                        style={{
                          fontSize: position.fontSize,
                          fontStyle: position.fontStyle,
                          fontWeight: position.fontWeight,
                          color: position.color,
                          backgroundColor: position.backgroundColor,
                          border: 'none',
                          fontFamily: position.fontFamily,
                          width: `${position.text.length}ch`
                        }} 
                      />*/}
                            {isEditingStamp && editingIndex === index && (
                              <div>
                                <ButtonGroup
                                  size="sm"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <Button outline color="primary">
                                    <Maximize
                                      size={15}
                                      className="drag-handle"
                                    />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleDeleteCurrentPosition(index)
                                    }
                                  >
                                    <Trash2
                                      style={{ color: "red" }}
                                      size={15}
                                    />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "signer_chooseImgDrivingL") {
                      return (
                        <Draggable
                          disabled
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                          <Maximize size={15}/>
                          </div> */}
                            {position.url === null ||
                            position.url === undefined ? (
                              <div
                                onClick={() =>
                                  handleTextClick(
                                    index,
                                    "signer_chooseImgDrivingL",
                                    position
                                  )
                                }
                                style={{
                                  backgroundColor: `${position.backgroundColor}`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  border: "1px solid lightGray",
                                  display: "flex",
                                  padding: "1%",
                                  opacity: 0.5,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <h3>+ Driving License</h3>
                              </div>
                            ) : (
                              <img
                                // className="drag-handle"
                                onClick={() =>
                                  handleTextClick(
                                    index,
                                    "signer_chooseImgDrivingL",
                                    position
                                  )
                                }
                                alt="Remy Sharp"
                                variant="square"
                                src={`${BASE_URL}${position.url}`}
                                style={{
                                  border: `2px solid #23b3e8`,
                                  // filter: 'grayscale(100%)',
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  // border: '1px solid lightGray',
                                }}
                              />
                            )}

                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (
                      position.type === "signer_chooseImgPassportPhoto"
                    ) {
                      return (
                        <Draggable
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            onClick={() =>
                              handleTextClick(
                                index,
                                "signer_chooseImgPassportPhoto",
                                position
                              )
                            }
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            {position.url === null ||
                            position.url === undefined ? (
                              <div
                                style={{
                                  backgroundColor: `${position.backgroundColor}`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  border: "1px solid lightGray",
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "1%",
                                  opacity: 0.5,
                                  alignItems: "center",
                                }}
                              >
                                <h3>+ Passport Photo</h3>
                              </div>
                            ) : (
                              <img
                                // className="drag-handle"
                                // onClick={() => setEdit(!edit)}
                                alt="Remy Sharp"
                                variant="square"
                                src={`${BASE_URL}${position.url}`}
                                style={{
                                  border: `2px solid #23b3e8`,
                                  // filter: 'grayscale(100%)',
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  // border: '1px solid lightGray',
                                }}
                              />
                            )}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "signer_chooseImgStamp") {
                      return (
                        <Draggable
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            {position.url === null ||
                            position.url === undefined ? (
                              <div
                                onClick={() =>
                                  handleTextClick(
                                    index,
                                    "signer_chooseImgStamp",
                                    position
                                  )
                                }
                                style={{
                                  backgroundColor: `${position.backgroundColor}`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  border: "1px solid lightGray",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  opacity: 0.5,
                                }}
                              >
                                <h3>+ Choose Stamp Image</h3>
                              </div>
                            ) : (
                              <img
                                // className="drag-handle"
                                onClick={() =>
                                  handleTextClick(
                                    index,
                                    "signer_chooseImgStamp",
                                    position
                                  )
                                }
                                alt="Remy Sharp"
                                variant="square"
                                src={`${BASE_URL}${position.url}`}
                                style={{
                                  border: `2px solid #23b3e8`,
                                  // filter: 'grayscale(100%)',
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  // border: '1px solid lightGray',
                                }}
                              />
                            )}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "signer_initials") {
                      return (
                        <Draggable
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            <ResizableBox
                              width={position.width}
                              height={position.height}
                              onResizeStart={() => {
                                setIsResizing(true);
                                setResizingIndex(index); // Track the index of the resizing element
                              }}
                              // handle={<span className="resize-handle" />} // Add this line
                              onResizeStop={(e, { size }) => {
                                setIsResizing(false);
                                setResizingIndex(null);
                                // Update the savedCanvasData state here
                                // For example:
                                let newSavedCanvasData = [...savedCanvasData];
                                newSavedCanvasData[index].width = size.width;
                                newSavedCanvasData[index].height = size.height;
                                setSavedCanvasData(newSavedCanvasData);
                              }}
                            >
                              {isResizing && resizingIndex === index && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "2px dashed #000", // Dotted border style
                                    pointerEvents: "none", // Ensure the div doesn't block events
                                  }}
                                />
                              )}
                              {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                          <Maximize size={15}/>
                          </div> */}
                              {position.url === null ||
                              position.url === undefined ? (
                                <div
                                  onClick={() =>
                                    handleTextClick(
                                      index,
                                      "signer_initials",
                                      position
                                    )
                                  }
                                  style={{
                                    backgroundColor: `${position.backgroundColor}`,
                                    width: `${position.width}px`,
                                    height: `${position.height}px`,
                                    border: "1px solid lightGray",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    opacity: 0.5,
                                  }}
                                >
                                  <h3>Sign Here</h3>
                                </div>
                              ) : (
                                <>
                                  <img
                                    onClick={() =>
                                      handleTextClick(
                                        index,
                                        "signer_initials",
                                        position
                                      )
                                    }
                                    alt="Remy Sharp"
                                    variant="square"
                                    src={`${BASE_URL}${position.url}`}
                                    style={{
                                      border: `2px solid #23b3e8`,
                                      // filter: 'grayscale(100%)',
                                      width: `${position.width}px`,
                                      height: `${position.height}px`,
                                      // border: '1px solid lightGray',
                                    }}
                                  />
                                </>
                              )}
                              {/* <img
                        // className="drag-handle"
                        // onClick={() => setEdit(!edit)}
                        alt="Remy Sharp"
                        onClick={() => handleTextClick(index, "my_signature")}
                        variant="square"
                        src={`${BASE_URL}${position.url}`}
                        style={{
                          filter: 'grayscale(100%)',
                          width: `${position.width}px`,
                          height: `${position.height}px`,
                          // border: '1px solid lightGray',

                        }}
                      /> */}
                            </ResizableBox>
                            {/* <input
                        value={position.text}
                        onChange={(e) => handleInputChanged(e, index)}
                        style={{
                          fontSize: position.fontSize,
                          fontStyle: position.fontStyle,
                          fontWeight: position.fontWeight,
                          color: position.color,
                          backgroundColor: position.backgroundColor,
                          border: 'none',
                          fontFamily: position.fontFamily,
                          width: `${position.text.length}ch`
                        }} 
                      />*/}
                            {isEditingInitials && editingIndex === index && (
                              <div>
                                <ButtonGroup
                                  size="sm"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <Button outline color="primary">
                                    <Maximize
                                      size={15}
                                      className="drag-handle"
                                    />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleDeleteCurrentPosition(index)
                                    }
                                  >
                                    <Trash2
                                      style={{ color: "red" }}
                                      size={15}
                                    />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "signer_checkmark") {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            onClick={() =>
                              handleTextClick(index, "signer_checkmark")
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                padding: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0.5,
                                // backgroundColor: `${position.backgroundColor}`
                              }}
                            >
                              <Input
                                type="checkbox"
                                checked={position.text}
                                style={{
                                  border: `1px solid ${position.backgroundColor}`,
                                }}
                                onChange={(e) => {
                                  //console.log(e.target.checked);
                                  // setPicker(date)
                                  const newSavedCanvasData = [
                                    ...savedCanvasData,
                                  ];
                                  newSavedCanvasData[index].text =
                                    e.target.checked;
                                  setSavedCanvasData(newSavedCanvasData);
                                }}
                                id="basic-cb-checked"
                              />
                            </div>
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "signer_radio") {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index, "signer_radio")}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: `${position.direction}`,
                                padding: "10px",
                                justifyContent: "left",
                                alignItems: "left",
                                opacity: 0.5,
                                backgroundColor: `${position.backgroundColor}`,
                              }}
                            >
                              <h2>{position?.options?.question}</h2>
                              {position?.options?.options?.map((option) => {
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "left",
                                      alignItems: "center",
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      id={option}
                                      name="option"
                                      value={option}
                                      checked={position.text === option}
                                      style={{ marginLeft: "10px" }}
                                      onChange={(e) => {
                                        //console.log(e.target.value);
                                        // setPicker(date)
                                        const newSavedCanvasData = [
                                          ...savedCanvasData,
                                        ];
                                        newSavedCanvasData[index].text =
                                          e.target.value;
                                        setSavedCanvasData(newSavedCanvasData);
                                      }}
                                      // checked={selectedOption === 'option1'}
                                      // onChange={(e) => setSelectedOption(e.target.value)}
                                    />
                                    <h3
                                      style={{ marginLeft: "10px" }}
                                      htmlFor={option}
                                    >
                                      {option}
                                    </h3>
                                  </div>
                                );
                              })}

                              {/* <Button color='primary' > */}
                              {/* <Trash2 style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }} size={20} onClick={() => handleDeleteCurrentPosition(index)} /> */}
                              {/* </Button> */}
                            </div>
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "signer_dropdown") {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index, "signer_dropdown")}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: `${position.direction}`,
                                padding: "10px",
                                justifyContent: "left",
                                alignItems: "center",
                                opacity: 0.5,
                                backgroundColor: `${position.backgroundColor}`,
                              }}
                            >
                              <h2>{position?.options?.question}</h2>
                              <Dropdown
                                color="primary"
                                style={{ marginLeft: "10px" }}
                                isOpen={dropdownOpenOptionOther}
                                toggle={toggleDropdownOptionOther}
                              >
                                <DropdownToggle
                                  color="primary"
                                  caret
                                  style={{ fontSize: "16px" }}
                                >
                                  {position.text === null ||
                                  position.text === undefined
                                    ? "Select Option"
                                    : position.text}
                                </DropdownToggle>
                                <DropdownMenu>
                                  {position?.options?.options?.map(
                                    (option, index) => (
                                      <DropdownItem
                                        style={{
                                          width: "100%",
                                          fontSize: "16px",
                                        }}
                                        key={index}
                                        onClick={() =>
                                          handleSelectOptionOptionOther(
                                            option,
                                            index
                                          )
                                        }
                                      >
                                        {option}
                                      </DropdownItem>
                                    )
                                  )}
                                </DropdownMenu>
                              </Dropdown>

                              {/* <Button color='primary' > */}
                              {/* <Trash2 style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }} size={20} onClick={() => handleDeleteCurrentPosition(index)} /> */}
                              {/* </Button> */}
                            </div>
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === "highlight") {
                      return (
                        <Draggable
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{ x: position.x, y: position.y }}
                          onStop={(e, data) => handleTextDrag(e, data, index)}
                        >
                          <div
                            style={{
                              position: "absolute",
                              display: `${
                                position.bgImg === activeImage
                                  ? "block"
                                  : "none"
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            <ResizableBox
                              width={position.width}
                              height={position.height}
                              // handle={<span className="resize-handle" />} // Add this line
                              onResizeStop={(e, { size }) => {
                                // Update the savedCanvasData state here
                                // For example:
                                let newSavedCanvasData = [...savedCanvasData];
                                newSavedCanvasData[index].width = size.width;
                                newSavedCanvasData[index].height = size.height;
                                setSavedCanvasData(newSavedCanvasData);
                              }}
                            >
                              {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                          <Maximize size={15}/>
                          </div> */}
                              <div
                                onClick={() =>
                                  handleTextClick(
                                    index,
                                    "signer_chooseImgStamp"
                                  )
                                }
                                style={{
                                  backgroundColor: `${position.backgroundColor}`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  border: "1px solid lightGray",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  opacity: "0.5",
                                }}
                              ></div>
                              {/* <img
                        // className="drag-handle"
                        // onClick={() => setEdit(!edit)}
                        alt="Remy Sharp"
                        onClick={() => handleTextClick(index, "my_signature")}
                        variant="square"
                        src={`${BASE_URL}${position.url}`}
                        style={{
                          filter: 'grayscale(100%)',
                          width: `${position.width}px`,
                          height: `${position.height}px`,
                          // border: '1px solid lightGray',

                        }}
                      /> */}
                            </ResizableBox>
                            {/* <input
                        value={position.text}
                        onChange={(e) => handleInputChanged(e, index)}
                        style={{
                          fontSize: position.fontSize,
                          fontStyle: position.fontStyle,
                          fontWeight: position.fontWeight,
                          color: position.color,
                          backgroundColor: position.backgroundColor,
                          border: 'none',
                          fontFamily: position.fontFamily,
                          width: `${position.text.length}ch`
                        }} 
                      />*/}
                            {isEditingStampImage && editingIndex === index && (
                              <div>
                                <ButtonGroup
                                  size="sm"
                                  style={{ backgroundColor: "white" }}
                                >
                                  <Button outline color="primary">
                                    <Maximize
                                      size={15}
                                      className="drag-handle"
                                    />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() =>
                                      handleDeleteCurrentPosition(index)
                                    }
                                  >
                                    <Trash2
                                      style={{ color: "red" }}
                                      size={15}
                                    />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    }
                  })}
                </>
                {/* // ))} */}
              </div>
            </Col>
            <Col
              xs={2}
              style={{
                maxHeight: "100vh",
                overflowY: "auto",
                position: "fixed",
                right: 0,
                top: 160,
                bottom: 5,
              }}
            >
              <Row>
                {imageUrls.map((imageUrl, index) => (
                  <>
                    <Col xs={12} className="d-flex justify-content-center">
                      <img
                        key={index}
                        src={`${BASE_URL}${imageUrl.image}`}
                        onClick={() => {
                          setActiveImage(imageUrl.template_bg_imgs_id);
                          setActiveImageUrl(imageUrl.image);
                          setShowColorPicker(false);
                          // imageRefs.current[index].scrollIntoView({ behavior: 'smooth' });
                          // handleThumbnailClick(imageUrl.image, index)
                        }}
                        style={{
                          width: "150px",
                          height: "200px",
                          border:
                            activeImage === imageUrl.template_bg_imgs_id
                              ? "2px solid gray"
                              : "none",
                        }}
                      />
                    </Col>
                    <Col xs={12} className="d-flex justify-content-center p-2">
                      <span style={{ fontSize: "12px" }}>Page {index + 1}</span>
                    </Col>
                  </>
                ))}
              </Row>
            </Col>
          </Row>
        </Col>
        {/* <Col xs={12}>
          <div
            style={{
              cursor: "pointer"
            }}
            onClick={() => saveData()}
          >DUMMY DIV HANDLED HERE
          </div>
        </Col> */}
      </Row>
      {/* Modal  */}

      {/* Delete Modal  */}
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteItemFromCanvas}
        alertStatusDelete={"delete"}
        text="Are you sure you want to remove this item?"
      />

      {/* signer add/edit  */}
      <Modal
        isOpen={signerAddEdit}
        toggle={() => setSignerAddEdit(!signerAddEdit)}
        className="modal-dialog-centered modal-lg"
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignerAddEdit(!signerAddEdit)}></ModalHeader> */}
        <ModalBody className="px-sm-5 mx-50 pb-2">
          {/* <div style={{
            display: ' flex',
            justifyContent: 'space-between'
          }}>
            <h1 className="fw-bold">Add/ Edit Signers
            </h1>
            <X size={24} onClick={() =>setSignerAddEdit(!signerAddEdit)} style={{ cursor: 'pointer' }} />

          </div> */}
          {/* <p className='text-center'>Add card for future billing</p> */}
          {/* <div style={{
            paddingBottom:'15px',
            display: ' flex',
            justifyContent: 'right'
          }}>
           
            <X size={24} onClick={()Pas => {
             setSignerAddEdit(!signerAddEdit)
            }} style={{ cursor: 'pointer' }} />

          </div> */}
          <Row tag="form" className="gy-1 gx-2 p-2">
            <Col xs={12} className="d-flex justify-content-between">
              <h1 className="text-center mb-1 fw-bold">Add/ Edit Signers</h1>
              <Button
                size="sm"
                className="btn-icon"
                color="primary"
                onClick={increaseCount}
                disabled={
                  signersData.some((signer) => !signer.name || !signer.email) ||
                  inputErrors.some((error) => error)
                }
              >
                <Plus size={14} />
                <span className="align-middle ms-25">Signer</span>
              </Button>{" "}
            </Col>

            <Col xs={12}>
              <Repeater count={count}>
                {(i) => {
                  const Tag = i === 0 ? "div" : SlideDown;
                  return (
                    <Tag key={i}>
                      <Form>
                        <Row className="justify-content-between align-items-center">
                          <Col md={1} className="mb-md-0 mb-1">
                            <div
                              style={{
                                backgroundColor: `${signersData[i].color}`,
                                marginTop: "40px",
                                marginRight: "10px",
                                width: "50px",
                                height: "50px",
                              }}
                            ></div>
                          </Col>
                          <Col md={4} className="mb-md-0 mb-1">
                            <Label
                              className="form-label"
                              for={`animation-item-name-${i}`}
                            >
                              Signer Name
                            </Label>
                            <Input
                              name="name"
                              type="text"
                              id={`animation-item-name-${i}`}
                              value={signersData[i].name}
                              onChange={(event) => handleInputChange(i, event)}
                              placeholder="Vuexy Admin "
                            />
                          </Col>
                          <Col md={5} className="mb-md-0 mb-1">
                            <Label
                              className="form-label"
                              for={`animation-cost-${i}`}
                            >
                              Email
                            </Label>
                            <Input
                              name="email"
                              value={signersData[i].email}
                              onChange={(event) => handleInputChange(i, event)}
                              type="email"
                              id={`animation-cost-${i}`}
                              placeholder="signer@gmail.com"
                            />
                            {inputErrors[i] && (
                              <div style={{ color: "red" }}>
                                {inputErrors[i]}
                              </div>
                            )}{" "}
                            {/* Add this line */}
                          </Col>

                          <Col md={2} className="mb-md-0 mt-2">
                            <Button
                              color="danger"
                              className="text-nowrap px-1"
                              onClick={deleteForm}
                              outline
                            >
                              <Trash size={14} />
                              {/* <span>Delete</span> */}
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
                  <span className="align-middle ms-25">Save</span>
                </Button>
                {/* <Button

               onClick={()=>{

              }} className='me-1' color='primary'>
                Save
              </Button> */}
                <Button
                  size="sm"
                  style={{
                    marginLeft: "10px",
                    boxShadow: "none",
                    height: "40px",
                  }}
                  color="secondary"
                  outline
                  onClick={() => {
                    setSignerAddEdit(!signerAddEdit);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            )}
          </Row>
        </ModalBody>
      </Modal>
      {/* signature modal  */}
      <Modal
        isOpen={SignatureModal}
        toggle={() => setSignatureModal(!SignatureModal)}
        className="modal-dialog-centered modal-lg"
        // onClosed={() => setCardType('')}
      >
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <SignatureModalContent
            signatureChooseImage={signatureChooseImage}
            modalClose={() => {
              setSignatureModal(!SignatureModal);
            }}
            returnedSignature={placeImage}
            file_id={file_id}
          />
        </ModalBody>
      </Modal>
      {/* send to e-sign  */}
      <Modal
        isOpen={sendToEsign}
        toggle={() => setSendToEsign(!sendToEsign)}
        className="modal-dialog-centered modal-md"
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSendToEsign(!sendToEsign)}></ModalHeader> */}
        <ModalBody className="px-sm-5 mx-50 pb-5">
          {/* <p className='text-center'>Add card for future billing</p> */}
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
                    saveData();
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

      {/* options Radio Button  */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalBody>
          <div
            style={{
              display: " flex",
              justifyContent: "space-between",
              marginBottom: "1%",
            }}
          >
            <h1 className="fw-bold"> Radio Button Group Details</h1>
            <X
              size={24}
              onClick={() => {
                setModalOpen(!modalOpen);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Form>
            {/* <FormGroup> */}
            <h3 for="question">Question</h3>
            <Input
              style={{
                fontSize: "16px",
                boxShadow: "none",
              }}
              type="text"
              id="question"
              onChange={(event) =>
                setRadioButtonGroup({
                  ...radioButtonGroup,
                  question: event.target.value,
                })
              }
            />
            {/* </FormGroup>
            <FormGroup> */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                marginTop: "1%",
              }}
            >
              <h3 for="option">Option</h3>
              <Button
                size="sm"
                color="primary"
                style={{
                  marginTop: "10px",
                  fontSize: "16px",
                  display: "flex",
                  boxShadow: "none",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={handleAddOption}
              >
                <Plus size={15} />
                <span className="align-middle ms-25">Option</span>
              </Button>
            </div>

            <Input
              style={{
                fontSize: "16px",
                boxShadow: "none",
              }}
              type="text"
              id="option"
              value={radioButtonGroup.option}
              onChange={(event) =>
                setRadioButtonGroup({
                  ...radioButtonGroup,
                  option: event.target.value,
                })
              }
            />

            {/* </FormGroup> */}
            <div
              style={{ marginTop: "1%", maxHeight: "300px", overflowY: "auto" }}
            >
              {radioButtonGroup.options.map((option, index) => (
                <div key={index}>
                  <h3 for={`option${index}`} style={{ marginBlock: "1%" }}>
                    Option {index + 1}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      style={{
                        fontSize: "16px",
                        boxShadow: "none",
                      }}
                      type="text"
                      id={`option${index}`}
                      value={option}
                      readOnly
                    />

                    <Button
                      size="sm"
                      outline
                      color="primary"
                      onClick={() => handleDeleteOption(index)}
                    >
                      <Trash
                        size={15}
                        style={{
                          color: "red",
                          cursor: "pointer",
                        }}
                      />
                    </Button>

                    {/* <Button
                    size="sm"
                    style={{
                      marginLeft: '10px'
                    }}
                    onClick={() => handleDeleteOption(index)}>Delete</Button> */}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginBlock: "4%",
                display: "flex",
                justifyContent: "right",
              }}
            >
              <Button
                size="sm"
                color="secondary"
                style={{
                  fontSize: "16px",
                  boxShadow: "none",
                }}
                onClick={() => {
                  setModalOpen(!modalOpen);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                color="primary"
                style={{
                  fontSize: "16px",
                  boxShadow: "none",
                  marginLeft: "10px",
                }}
                // type="submit"
                onClick={() => {
                  setLoaderRadio(true);
                  //console.log('DISPLAY RADIO BUTTON GROUP DETAILS');
                  //console.log('sdhdsh');
                  //console.log(radioButtonGroup);
                  //console.log(type);
                  //console.log(eventDataOnClick);

                  let resultingData = handlePlacePosition(
                    eventDataOnClick,
                    type,
                    activeImage,
                    selectedSigner.color,
                    radioButtonGroup,
                    selectedSigner.signer_id
                  );
                  // let resultingData = handlePlacePosition(eventDataOnClick, type, activeImage, radioButtonGroup)
                  //console.log(resultingData);
                  setSavedCanvasData([...savedCanvasData, resultingData]);
                  // setType('')
                  setLoaderRadio(false);
                  setRadioButtonGroup({
                    question: "",
                    options: [],
                    option: "",
                  });
                  setModalOpen(!modalOpen);
                }}
              >
                {loaderRadio ? <Spinner color="light" size="sm" /> : null}
                <span>Save</span>
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      {/* dropdown  */}
      <Modal
        isOpen={modalOpenDropdown}
        toggle={() => setModalOpenDropdown(!modalOpenDropdown)}
      >
        <ModalBody>
          <div
            style={{
              display: " flex",
              justifyContent: "space-between",
              marginBottom: "1%",
            }}
          >
            <h1 className="fw-bold">Dropdown Group Details</h1>
            <X
              size={24}
              onClick={() => setModalOpenDropdown(!modalOpenDropdown)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Form>
            <h3 for="question">Question</h3>
            <Input
              style={{
                fontSize: "16px",
                boxShadow: "none",
              }}
              type="text"
              id="question"
              onChange={(event) =>
                setDropdownGroup({
                  ...dropdownGroup,
                  question: event.target.value,
                })
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              <h3 for="option">Option</h3>
              <Button
                size="sm"
                color="primary"
                style={{
                  display: "flex",
                  boxShadow: "none",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={handleAddOptionDropdown}
              >
                <Plus size={15} />
                <span className="align-middle ms-25">Option</span>
              </Button>
            </div>
            <Input
              style={{
                fontSize: "16px",
                boxShadow: "none",
              }}
              type="text"
              id="option"
              value={dropdownGroup.option}
              onChange={(event) =>
                setDropdownGroup({
                  ...dropdownGroup,
                  option: event.target.value,
                })
              }
            />
            {/* <div style={{ marginBlock: '3%', display: 'flex', justifyContent: 'center' }}> */}

            <div
              style={{ marginTop: "1%", maxHeight: "300px", overflowY: "auto" }}
            >
              {dropdownGroup.options.map((option, index) => (
                <div key={index}>
                  <h3 for={`option${index}`} style={{ marginBlock: "1%" }}>
                    Option {index + 1}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      style={{
                        fontSize: "16px",
                        boxShadow: "none",
                      }}
                      type="text"
                      id={`option${index}`}
                      value={option}
                      readOnly
                    />

                    <Button
                      size="sm"
                      outline
                      color="primary"
                      onClick={() => handleDeleteOptionDropdown(index)}
                    >
                      <Trash
                        size={15}
                        style={{
                          color: "red",
                          cursor: "pointer",
                        }}
                      />
                    </Button>

                    {/* <Button
                    size="sm"
                    style={{
                      marginLeft: '10px'
                    }}
                    onClick={() => handleDeleteOption(index)}>Delete</Button> */}
                  </div>
                </div>
              ))}
            </div>
            {/* <Dropdown size="sm" isOpen={dropdownOpenForOther} toggle={toggleDropdownForOther}>
                <DropdownToggle caret style={{
                  display: 'flex',
                  boxShadow: 'none',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  Choose Options
                </DropdownToggle>
                <DropdownMenu>

                  {dropdownGroup.options.map((option, index) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid lightGray', padding: '2px', alignItems: 'center' }}>

                      <DropdownItem
                        style={{ fontSize: '16px' }}
                        key={index}
                        onClick={() => handleSelectOption(option)}>
                        {option}
                      </DropdownItem>
                      <Trash
                        onClick={() => handleDeleteOptionDropdown(index)}
                        size={15}
                        style={{
                          color: 'red',
                          cursor: 'pointer',
                          marginRight: '10px'
                        }}

                      />

                    </div>
                  ))}
                </DropdownMenu>
              </Dropdown> */}
            {/* </div> */}
            <div
              style={{
                marginBlock: "4%",
                display: "flex",
                justifyContent: "right",
              }}
            >
              <Button
                size="sm"
                color="secondary"
                style={{
                  fontSize: "16px",
                  height: "40px",
                  boxShadow: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => setModalOpen(!modalOpen)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                color="primary"
                style={{
                  fontSize: "16px",
                  boxShadow: "none",
                  marginLeft: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setLoaderDropdown(true);
                  //console.log('DISPLAY DropDown BUTTON GROUP DETAILS');
                  //console.log('sdhdsh');
                  //console.log(dropdownGroup);
                  //console.log(type);
                  //console.log(eventDataOnClick);

                  let resultingData = handlePlacePosition(
                    eventDataOnClick,
                    type,
                    activeImage,
                    selectedSigner.color,
                    dropdownGroup,
                    selectedSigner.signer_id
                  );
                  // let resultingData = handlePlacePosition(eventDataOnClick, type, activeImage, radioButtonGroup)
                  //console.log(resultingData);
                  setSavedCanvasData([...savedCanvasData, resultingData]);
                  setType("");
                  setLoaderDropdown(false);
                  setDropdownGroup({
                    question: "",
                    option: "",
                    options: [],
                    text: "",
                  });
                  setModalOpenDropdown(!modalOpenDropdown);
                }}
              >
                {loaderDropdown ? <Spinner color="light" size="sm" /> : null}
                <span>Save</span>
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SharedTemplate;
