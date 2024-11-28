import {useEffect, useRef, useState} from 'react';
import {BASE_URL, post, postFormData} from '../apis/api';
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
} from 'reactstrap';
import Draggable from 'react-draggable';
import {ChromePicker} from 'react-color';
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
  Edit,
  Edit2,
  FileText,
  Lock,
  MapPin,
  Maximize,
  MoreVertical,
  Plus,
  Trash,
  Trash2,
  Type,
  Unlock,
  User,
  X,
} from 'react-feather';
import logoRemoveBg from '@src/assets/images/pages/logoRemoveBg.png';
import ForYou from '../components/ForYou';
import ForOthers from '../components/ForOthers';
import {handlePlacePosition} from '../utility/EditorUtils/PlacePositions';
import toastAlert from '@components/toastAlert';
// import Wizard from '@components/wizard';
import Repeater from '@components/repeater';
import {SlideDown} from 'react-slidedown';
import {darkenColor, getColorByIndex, getRandomLightColor, lightenColor} from '../utility/Utils';
// import {ResizableBox} from 'react-resizable';
// import 'react-resizable/css/styles.css';
// import Flatpickr from 'react-flatpickr';
import imageDummy from '@src/assets/images/pages/localhost-file-not-found.jpg';
// import SignatureModalContent from '../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent';
// import { Layer, Line, Stage } from "react-konva";
// import pdfMaSignerke from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
// import emptyImage from '@assets/images/pages/empty.png';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
// import ModalConfirmationAlert from '../components/ModalConfirmationAlert';
// import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ViewDocEditor = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const file_id = window.location.pathname.split('/')[2];
  const [activeImage, setActiveImage] = useState('');
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

  const [editingIndex, setEditingIndex] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editedTextIndex, setEditedTextIndex] = useState(null);
  const [type, setType] = useState('');
  const [eventDataOnClick, setEventDataOnClick] = useState([]);
  const [selectedSigner, setSelectedSigner] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);
  const [saveLoadingClose, setsaveLoadingClose] = useState(false);

  const [sendToEsign, setSendToEsign] = useState(false);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState('');
  const [loadingDelete, setloadingDelete] = useState(false);
  const [active, setActive] = useState('1');
  const [signerAddEdit, setSignerAddEdit] = useState(false);
  const [count, setCount] = useState(1);
  const [signerFunctionalControls, setSignerFunctionalControls] = useState(false);
  const [securedShare, setSecuredShare] = useState(false);
  const [EsignOrder, setSetEsignOrder] = useState(false);
  const [RecipientsData, setRecipientsData] = useState([]);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [inputValue, setInputValue] = useState(null);
  const [firstIndex, setFirstIndex] = useState(true);
  const [saveButtonEnable, setSaveButtonEnable] = useState(false);
  const [signersData, setSignersData] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [stepper, setStepper] = useState(null);
  const [inputValueAccessCode, setInputValueAccessCode] = useState('');
  const [inputErrors, setInputErrors] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSignersSave, setLoadingSignersSave] = useState(false);
  const [loadingRecipientsSave, setLoadingRecipientsSave] = useState(false);
  const [inputErrorsRecipients, setInputErrorsRecipients] = useState([]);
  const [countReceipient, setCountReceipient] = useState(0);
  const [loadingSaveDocument, setLoadingSaveDocument] = useState(false);
  const [loadingSendDocument, setLoadingSendDocument] = useState(false);
  const [fileName, setFileName] = useState('');
  const [picker, setPicker] = useState(new Date());
  const [statusFile, setStatusFile] = useState('');
  const [SignatureModal, setSignatureModal] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [indexDataOnClick, setIndexDataOnClick] = useState(null);
  const [loaderRadio, setLoaderRadio] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [radioButtonGroup, setRadioButtonGroup] = useState({question: '', options: [], option: ''});
  const [onlySigner, setOnlySigner] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [loaderRefresh, setloaderRefresh] = useState(true);
  const elementRefCursor = useRef(null);
  // download PDF
  const elementRef = useRef();

  const generatePDF = async () => {
    //console.log('pdfdsdssd');
    if (elementRef.current) {
      //console.log('elementRef.current is not null or undefined');

      try {
        const canvas = await html2canvas(elementRef.current);
        //console.log('canvas created');

        const pdf = new jsPDF('p', 'mm', 'a4');
        //console.log('pdf created');

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
        //console.log('image added to pdf');

        pdf.save('output.pdf');
        //console.log('pdf saved');
      } catch (error) {
        console.error('Error in generatePDF:', error);
      }
    } else {
      //console.log('elementRef.current is null or undefined');
    }
  };
  const [dropdownGroup, setDropdownGroup] = useState({
    question: '',
    option: '',
    options: [],
    text: '',
  });
  const [loaderDropdown, setLoaderDropdown] = useState(false);
  // Define the dropdownOpen state
  const [dropdownOpenForOther, setDropdownOpenForOther] = useState(true);

  // Define the handleSelectOption function
  const handleSelectOption = option => {
    setDropdownGroup(prevState => ({...prevState, text: option}));
  };
  const handleAddOptionDropdown = () => {
    setDropdownGroup(prevState => ({...prevState, options: [...prevState.options, prevState.option], option: ''}));
  };
  // Define the toggleDropdown function
  const toggleDropdownForOther = () => {
    setDropdownOpenForOther(prevState => !prevState);
  };
  const [modalOpenDropdown, setModalOpenDropdown] = useState(false);
  // start
  const [dropdownOpenOptionOther, setDropdownOpenOptionOther] = useState(false);

  const toggleDropdownOptionOther = () => {
    setDropdownOpenOptionOther(prevState => !prevState);
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

  const fetchData = async fileId => {
    // get Images from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post('file/getbgImagesByFileId', postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No Images Selected")
    } else {
      // toastAlert("success", "You can Edit document ")

      setImageUrls(apiData.result);
      setActiveImage(apiData.result[0].bgimgs_id);
      setActiveImageUrl(apiData.result[0].image);
    }
  };
  // fetch positions
  const fetchDataPositions = async fileId => {
    // get positions from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post('file/getallPositionsFromFile_Id', postData); // Specify the endpoint you want to call
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
  const deleteFormReceipient = e => {
    e.preventDefault();
    const slideDownWrapper = e.target.closest('.react-slidedown'),
      form = e.target.closest('form');
    if (slideDownWrapper) {
      slideDownWrapper.remove();
    } else {
      form.remove();
    }
  };
  const increaseCount = () => {
    // Check if all fields are filled
    if (signersData.some(signer => !signer.name || !signer.email)) {
      alert('Please fill all fields.');
      return;
    }

    // Check if there are any input errors
    if (inputErrors.some(error => error)) {
      alert('Please fix the errors.');
      return;
    }
    // push empty object to signers array
    // const color_code = getRandomLightColor()
    const color_code = getColorByIndex(count);
    //console.log(color_code);
    // //console.log(color_code)
    if (count === 8) {
      //console.log('Max Size Signer Filled');
    } else {
      setSignersData([...signersData, {order_id: signersData.length + 1, name: '', email: '', color: color_code}]);
      setCount(count + 1);
    }
  };
  const increaseCountReceipient = () => {
    //console.log(countReceipient);
    if (countReceipient === 0) {
      setRecipientsData([...RecipientsData, {name: '', email: ''}]);
      setCountReceipient(countReceipient + 1);
    } else {
      setRecipientsData([...RecipientsData, {id: RecipientsData.length + 1, name: '', email: ''}]);

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
    if (apiData.path === null || apiData.path === undefined || apiData.path === '') {
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
      setType('');
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

    if (type === null || type === undefined || type === '') {
    } else {
      //console.log('selectedSigner');
      if (type === 'my_signature') {
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
      } else if (type === 'stamp') {
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
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png';
        input.onchange = e => handleImageChange(e, arrayObj);
        input.click();
      } else if (type === 'signer_radio') {
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
      } else if (type === 'signer_dropdown') {
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
        if (active === '2') {
          if (
            selectedSigner === null ||
            selectedSigner === undefined ||
            selectedSigner === '' ||
            selectedSigner.length === 0
          ) {
            toastAlert('error', 'Please Select Signer');
          } else {
            //console.log('selectedSigner');
            //console.log(selectedSigner);

            let resultingData = handlePlacePosition(
              arrayObj,
              type,
              imageUrl,
              selectedSigner.color,
              'null',
              selectedSigner.signer_id,
            );
            //console.log(resultingData);
            setSavedCanvasData([...savedCanvasData, resultingData]);
            // setEditStateTextTopbar(false)
            // setType('')
          }
        } else {
          let resultingData = handlePlacePosition(
            arrayObj,
            type,
            imageUrl,
            selectedSigner.color,
            'null',
            selectedSigner.signer_id,
          );
          //console.log(resultingData);
          setSavedCanvasData([...savedCanvasData, resultingData]);
          // setEditStateTextTopbar(false)
          setType('');
        }
      }
    }
  };
  const placeImage = async (url, prevSign, typeSign) => {
    if (prevSign === 'prevSign') {
      setSignatureModal(false);
      //console.log('url');
      //console.log(url);
      let resultingData = handlePlacePosition(eventDataOnClick, type, activeImage, url);
      //console.log(resultingData);
      setSavedCanvasData([...savedCanvasData, resultingData]);
      setType('');
    } else {
      // call api to save previous user signatures
      //console.log('sdgfdfshjdfdf');
      //console.log(url);

      const items = JSON.parse(localStorage.getItem('@UserLoginRS'));

      const user_id = items?.token?.user_id;
      //console.log(user_id);

      const postData = {
        user_id: user_id,
        signature_image_url: url,
        type: typeSign,
      };
      const apiData = await post('user/AddUserSignaturesToDb', postData); // Specify the endpoint you want to call
      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined || apiData.error === 'true') {
        toastAlert('error', 'Error uploading Files');
      } else {
        setSignatureModal(false);
        //console.log('url');
        //console.log(url);
        //console.log('lines');
        //console.log(activeImage);
        let resultingData = handlePlacePosition(eventDataOnClick, type, activeImage, url);
        //console.log(resultingData);
        setSavedCanvasData([...savedCanvasData, resultingData]);
        setType('');
      }

      // end Call
    }
  };
  const handleTextDrag = (e, data, index) => {
    if (statusFile === 'InProgress') {
      const newSavedCanvasData = [...savedCanvasData];
      newSavedCanvasData[index] = {
        ...newSavedCanvasData[index],
        x: data.x,
        y: data.y,
      };
      setSavedCanvasData(newSavedCanvasData);
      // setIsEditing(false)
      // setIsEditingSignature(false)
      // setDatePickerActive(false)
      // setDatePickerActiveSigner(false)
      // setIsEditingStamp(false)
      // setIsEditingDrivingLicense(false)
      // setIsEditingPassportPhoto(false)
      // setIsEditingStampImage(false)
      // setIsEditingInitials(false)
      // setIsEditingSignerRadio(false)
      // setIsEditingSignerDropdown(false)
    }
  };
  const saveData = async () => {
    setsaveLoading(true);
    //console.log(savedCanvasData);
    const postData = {
      file_id: file_id,
      position_array: savedCanvasData,
    };
    try {
      const apiData = await post('file/saveCanvasDataWithFile_Id', postData); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');

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
  const saveDataClose = async () => {
    setsaveLoadingClose(true);
    //console.log(savedCanvasData);
    const postData = {
      file_id: file_id,
      position_array: savedCanvasData,
    };
    try {
      const apiData = await post('file/saveCanvasDataWithFile_Id', postData); // Specify the endpoint you want to call
      //console.log('Save Data To canvas ');

      //console.log(apiData);
      if (apiData.error) {
        // toastAlert("error", apiData.message)
        // setData(null)
        setsaveLoadingClose(false);
        setSaveSuccess(false);
      } else {
        // //console.log(apiData.result)
        // toastAlert("succes", apiData.message)
        // setData(apiData.result)
        setsaveLoadingClose(false);
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
  const handleInputChanged = (event, index) => {
    const newSavedCanvasData = [...savedCanvasData];
    newSavedCanvasData[index].text = event.target.value;
    setSavedCanvasData(newSavedCanvasData);
  };
  const [datePickerActive, setDatePickerActive] = useState(false);
  const [datePickerActiveSigner, setDatePickerActiveSigner] = useState(false);
  const [signerCheckmark, setSignerCheckmark] = useState(false);
  const handleTextClick = (index, typeData) => {
    if (statusFile === 'InProgress') {
      if (typeData === 'my_text') {
        setIsEditing(true);
        setEditingIndex(index);
      } else if (typeData === 'my_signature') {
        setIsEditingSignature(true);
        setEditingIndex(index);
      } else if (typeData === 'date') {
        setDatePickerActive(true);
        setEditingIndex(index);
      } else if (typeData === 'signer_date') {
        setDatePickerActiveSigner(true);
        setEditingIndex(index);
      } else if (typeData === 'stamp') {
        setIsEditingStamp(true);
        setEditingIndex(index);
      } else if (typeData === 'signer_checkmark') {
        setSignerCheckmark(true);
        setEditingIndex(index);
      } else if (typeData === 'signer_chooseImgDrivingL') {
        setIsEditingDrivingLicense(true);
        setEditingIndex(index);
      } else if (typeData === 'signer_chooseImgPassportPhoto') {
        setIsEditingPassportPhoto(true);
        setEditingIndex(index);
      } else if (typeData === 'signer_chooseImgStamp') {
        setIsEditingStampImage(true);
        setEditingIndex(index);
      } else if (typeData === 'signer_initials') {
        setIsEditingInitials(true);
        setEditingIndex(index);
      } else if (typeData === 'signer_radio') {
        setIsEditingSignerRadio(true);
        setEditingIndex(index);
      } else if (typeData === 'signer_dropdown') {
        setIsEditingSignerDropdown(true);
        setEditingIndex(index);
      }
    }
  };

  const handleFontSizeChange = (index, fontSize, item) => {
    // Implement your logic to change the font size here
    //console.log(index);
    //console.log(fontSize);
    const newSavedCanvasData = [...savedCanvasData];
    // newSavedCanvasData[index].required = true;
    // newSavedCanvasData[index].backgroundColor = darkenedBgColor
    setSavedCanvasData(newSavedCanvasData);
    if (item === 'big') {
      if (parseInt(fontSize) === 100) {
      } else {
        newSavedCanvasData[index].fontSize = parseInt(fontSize) + parseInt(1);
        // savedCanvasData[index].fontSize = parseInt(fontSize) + parseInt(1)
      }
    } else {
      if (parseInt(fontSize) === 1) {
      } else {
        newSavedCanvasData[index].fontSize = parseInt(fontSize) - parseInt(1);

        // savedCanvasData[index].fontSize = parseInt(fontSize) - parseInt(1)
      }
    }
    setSavedCanvasData(newSavedCanvasData);
  };

  const handleFontWeightChange = index => {
    const newSavedCanvasData = [...savedCanvasData];
    // Implement your logic to change the font weight here
    if (parseInt(savedCanvasData[index].fontWeight) === parseInt(400)) {
      newSavedCanvasData[index].fontWeight = 600;
      // savedCanvasData[index].fontWeight = 600
      //console.log('600');
    } else {
      newSavedCanvasData[index].fontWeight = 400;
      // savedCanvasData[index].fontWeight = 400
      //console.log(savedCanvasData);
      //console.log('400');
    }
    setSavedCanvasData(newSavedCanvasData);
  };

  const handleColorChange = newColor => {
    const newSavedCanvasData = [...savedCanvasData];
    newSavedCanvasData[editedTextIndex].color = newColor.hex;
    setSavedCanvasData(newSavedCanvasData);
    // Implement your logic to change the color here
  };
  const toggle = tab => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const getTypeListItem = type => {
    //console.log('Type');
    //console.log(type);
    if (type === 'signer') {
      setSignerAddEdit(true);
      // setType("my_text")
    } else {
      setType(type);
    }
  };
  const handleDeleteCurrentPosition = index => {
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
    //console.log(deleteIndex);
    if (deleteIndex >= 0 && deleteIndex < updatedCanvasData.length) {
      updatedCanvasData.splice(deleteIndex, 1);
    }
    // updatedCanvasData.splice(deleteIndex, 1);

    setSavedCanvasData(updatedCanvasData); // Update the savedCanvasData state
    //console.log(updatedCanvasData);
    // saveData()
    setItemDeleteConfirmation(false);
    setloadingDelete(false);
  };
  const fetchSignerData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post('file/getAllSignersByFileId', postData); // Specify the endpoint you want to call
      //console.log('Signers ');

      //console.log(apiData);
      if (apiData.error) {
        // toastAlert("error", apiData.message)
        setSignersData([]);
      } else {
        // //console.log(apiData.result)
        // toastAlert("succes", apiData.message)
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
    // if (inputValueAccessCode.trim() === "") {
    //   setIsInputInvalid(true);
    // } else {

    // call api to update access code
    const postData = {
      signer_id: signer_id,
      access_code: inputValueAccessCode,
    };
    try {
      const apiData = await post('file/update-signer', postData); // Specify the endpoint you want to call
      //console.log('Update Access code ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert('error', apiData.message);
      } else {
        // //console.log(apiData.result)
        toastAlert('succes', apiData.message);
        setIsInputVisible(false);
        // setIsInputInvalid(false);
        // You might want to save the access code for the active row here
        signersData[i].accessCode = inputValueAccessCode;
        fetchSignerData();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }

    // }
  };

  const handleCloseClick = async (signer_id, i) => {
    setIsInputVisible(false);
    // setIsInputInvalid(false);
    // If you want to reset the access code when the input is closed without saving, uncomment the following line
    signersData[i].accessCode = null;
    const postData = {
      signer_id: signer_id,
      access_code: null,
    };
    try {
      const apiData = await post('file/update-signer', postData); // Specify the endpoint you want to call
      //console.log('Update Access code ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert('error', apiData.message);
      } else {
        // //console.log(apiData.result)
        toastAlert('succes', apiData.message);
        setIsInputVisible(false);
        // setIsInputInvalid(false);
        // You might want to save the access code for the active row here
        fetchSignerData();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (i, event) => {
    const {name, value} = event.target;
    const newSignersData = [...signersData];

    const newInputErrors = [...inputErrors];
    // Check if the email is already present in the array
    if (name === 'email' && signersData.some((signer, index) => signer.email === value && index !== i)) {
      newInputErrors[i] = 'This email is already in use.';
    } else {
      newInputErrors[i] = '';
    }

    newSignersData[i][name] = value;
    setSignersData(newSignersData);
    setInputErrors(newInputErrors);
  };
  const handleInputChangeRecipients = (i, event) => {
    const {name, value} = event.target;
    const newSignersData = [...RecipientsData];

    const newInputErrors = [...inputErrors];
    // Check if the email is already present in the array
    if (name === 'email' && RecipientsData.some((signer, index) => signer.email === value && index !== i)) {
      newInputErrors[i] = 'This email is already in use.';
    } else {
      newInputErrors[i] = '';
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
      const apiData = await post('file/add-signer', postData); // Specify the endpoint you want to call
      //console.log('Signers ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert('error', apiData.message);
        setSignersData([]);
        setLoadingSignersSave(false);
      } else {
        // //console.log(apiData.result)
        toastAlert('succes', apiData.message);
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
      const apiData = await post('file/add-recipient', postData); // Specify the endpoint you want to call
      //console.log('Recipients ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert('error', apiData.message);
        // setRecipientsData([])
        //console.log('Recipients Error');
      } else {
        //console.log('Recipients Success');
        // //console.log(apiData.result)
        // toastAlert("succes", apiData.message)
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };

  const deleteForm = index => {
    //console.log(index);
    const newSignersData = [...signersData];
    newSignersData.splice(index, 1);
    //console.log(newSignersData);
    setSignersData(newSignersData);
    setCount(count - 1);
  };
  // }deleteForm = e => {
  //     e.preventDefault()
  //     const slideDownWrapper = e.target.closest('.react-slidedown'),
  //       form = e.target.closest('form')
  //     if (slideDownWrapper) {
  //       slideDownWrapper.remove()
  //     } else {
  //       form.remove()
  //     }
  //   }
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
      const apiData = await post('file/send-doc-to-esign', postData); // Specify the endpoint you want to call
      //console.log('Update File Controls ');
      //console.log(apiData);
      if (apiData.error) {
        toastAlert('error', apiData.message);
        // setFileName("")
        // setInputValue("")
        setLoadingSendDocument(false);
      } else {
        // //console.log(apiData.result)
        toastAlert('succes', apiData.message);
        // setFileName(apiData.data.name)
        // setInputValue(apiData.data.name)
        setLoadingSendDocument(false);
        setSendToEsign(false);
        window.location.href = '/home';
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setLoadingSendDocument(false);
    }
  };
  // Fetch File
  const fetchFileData = async fileId => {
    // get Images from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post('file/get-file', postData); // Specify the endpoint you want to call
    //console.log('File Dta Fetch');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      setFileName(apiData.data.name || '');
      setInputValue(apiData.data.name || '');
      //console.log('dfdf');
      //console.log(apiData.data.only_signer);
      setOnlySigner(apiData.data.only_signer || false);
      setEmailMessage(apiData.data.email_message || '');
      setEmailSubject(apiData.data.name);
      setSecuredShare(apiData.data.secured_share || false);
      setSignerFunctionalControls(apiData.data.signer_functional_controls || false);
      setSetEsignOrder(apiData.data.esign_order || false);
      setStatusFile(apiData.data.status || '');
    }
  };
  const fetchRecipientsData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post('file/getAllRecipientsByFileId', postData); // Specify the endpoint you want to call
      //console.log('Recipients');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === 'true') {
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
  const toggleDropdown1 = () => setDropdownOpen1(prevState => !prevState);

  const handleAddOption = () => {
    setRadioButtonGroup(prevState => ({...prevState, options: [...prevState.options, prevState.option], option: ''}));
  };
  const handleDeleteOption = index => {
    setRadioButtonGroup(prevState => ({...prevState, options: prevState.options.filter((_, i) => i !== index)}));
  };
  const handleDeleteOptionDropdown = index => {
    setDropdownGroup(prevState => ({...prevState, options: prevState.options.filter((_, i) => i !== index)}));
  };
  const DragHandle = SortableHandle(() => <MoreVertical size={20} />);

  const SortableItem = SortableElement(({value, i}) => {
    const Tag = i === 0 ? 'div' : SlideDown;
    return (
      <Tag key={i}>
        <Form>
          <Row style={{position: 'relative'}} className="d-flex justify-content-between align-items-center">
            {EsignOrder ? (
              <Col md={1} className="mb-md-0 mb-1 d-flex justify-content-center align-items-center">
                <DragHandle />
                {/* <span>{signersData[i].order_id}</span> */}
              </Col>
            ) : null}
            <Col md={3} className="mb-md-0 mb-1">
              <h3 style={{fontSize: '16px'}} className="form-label" for={`animation-item-name-${i}`}>
                Name
              </h3>

              <Input
                style={{
                  fontSize: '16px',
                  boxShadow: 'none',
                }}
                type="text"
                name="name"
                id={`animation-item-name-${i}`}
                placeholder="Signer "
                value={signersData[i].name}
                onChange={event => handleInputChange(i, event)}
              />
            </Col>
            <Col md={4} className="mb-md-0 mb-1">
              <h3 style={{fontSize: '16px'}} className="form-label" for={`animation-cost-${i}`}>
                Email
              </h3>
              <Input
                style={{
                  fontSize: '16px',
                  boxShadow: 'none',
                }}
                name="email"
                value={signersData[i].email}
                onChange={event => handleInputChange(i, event)}
                type="email"
                id={`animation-cost-${i}`}
                placeholder="signer@gmail.com"
              />
            </Col>
            <Col md={1} style={{marginTop: '10px'}}>
              {signersData[i].access_code === null ||
              signersData[i].access_code === undefined ||
              signersData[i].access_code === '' ? (
                <Unlock size={20} />
              ) : (
                <Lock size={20} />
              )}
            </Col>
            <Col
              md={3}
              className="mb-md-0 mb-1 mt-2"
              style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {isInputVisible && i === activeRow ? (
                <>
                  <div style={{position: isInputFocused ? 'absolute' : 'static', top: 18, left: '66%', width: '85px'}}>
                    <Input
                      autoFocus={false}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      style={{
                        fontSize: '16px',
                        boxShadow: 'none',
                        // height: '40px',
                        marginTop: '5px',
                      }}
                      type="text"
                      maxLength={6} // Maximum 6 characters allowed
                      value={inputValueAccessCode}
                      // invalid={isInputInvalid}
                      onChange={e => {
                        setInputValueAccessCode(e.target.value);
                      }}
                    />
                  </div>

                  <Button
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
                  <FormFeedback>Access Code cannot be empty</FormFeedback>
                  {/* {isLoading ? (
                                <Spinner color='primary' size='sm' style={{ cursor: 'pointer', position: 'absolute', top: -10, right: 0 }} />
                              ) : (
                                <Badge color='success' pill style={{ cursor: 'pointer', position: 'absolute', top: -10, right: 0 }}>
                                  <Check size={14} onClick={() =>
                                    handleCheckClickAccessCode(signersData[i].signer_id, i)
                                  } />
                                </Badge>
                              )}
                              <Badge color='danger' pill style={{ cursor: 'pointer', position: 'absolute', top: -10, left: 0 }}>
                                <X size={14} onClick={() => handleCloseClick(i)} />
                              </Badge> */}
                </>
              ) : (
                <>
                  {signersData[i].access_code === null ||
                  signersData[i].access_code === undefined ||
                  signersData[i].access_code === '' ? (
                    <Button
                      size="sm"
                      color="success"
                      className="text-nowrap px-1"
                      outline
                      onClick={() => {
                        setInputValueAccessCode('');
                        handleButtonClick();
                        setActiveRow(i);
                      }}>
                      <Plus size={14} />
                      <span style={{fontSize: '16px'}}> Access Code</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      color="success"
                      className="text-nowrap px-1"
                      outline
                      onClick={() => {
                        setInputValueAccessCode(signersData[i].access_code);
                        handleButtonClick();
                        setActiveRow(i);
                      }}>
                      <Edit2 size={14} />
                      <span style={{fontSize: '16px'}}> Modify Code</span>
                    </Button>
                  )}

                  {/* <Button color='success' className='text-nowrap px-1' outline onClick={() => { handleButtonClick(); setActiveRow(i); }}>
                                  <Plus size={14} />
                                  <span>Add Access Code</span>
                                </Button> */}
                </>
              )}
              {/* <Button color='success' className='text-nowrap px-1' outline>
                            <Plus size={14} />
                            <span>Add Access Code</span>
                          </Button> */}
            </Col>
            <Col sm={12}>
              <hr />
            </Col>
          </Row>
        </Form>
      </Tag>
    );
  });
  const SortableList = SortableContainer(({items}) => {
    return (
      <Repeater count={items.length}>
        {i => <SortableItem key={`item-${items[i].order_id}`} index={i} value={items[i]} i={i} />}
      </Repeater>
    );
  });
  useEffect(() => {
    // //console.log(window.innerWidth)
    // if (window.innerWidth >= 1600) { // for extra large screens
    //   document.body.style.zoom = "125%";
    // } else { // for small to large screens
    //   document.body.style.zoom = "100%";
    // }
    Promise.all([
      fetchData(file_id),
      fetchFileData(file_id),
      fetchDataPositions(file_id),
      fetchSignerData(file_id),
      fetchRecipientsData(file_id),
    ])
      .then(() => {
        setloaderRefresh(false); // Set loading to false when all requests are complete
      })
      .catch(error => {
        console.error(error);
        setloaderRefresh(false); // Also set loading to false if there was an error
      });
    // Scroll to the top of the page
    window.scrollTo(0, 0);
    // fetchPrevSignatureImages();
  }, []);
  useEffect(() => {
    const handleMouseMove = e => {
      if (
        type === 'my_text' ||
        type === 'signer_text' ||
        type === 'checkmark' ||
        type === 'signer_checkmark' ||
        type === 'date' ||
        type === 'signer_date' ||
        type === 'highlight' ||
        type === 'stamp' ||
        type === 'my_signature' ||
        type === 'signer_initials' ||
        type === 'signer_chooseImgDrivingL' ||
        type === 'signer_chooseImgPassportPhoto' ||
        type === 'signer_chooseImgStamp' ||
        type === 'signer_radio' ||
        type === 'signer_dropdown'
      ) {
        // Set position of the custom box to follow the mouse
        const box = elementRefCursor.current;
        box.style.left = e.clientX + 'px';
        box.style.top = e.clientY + 'px';
      }
    };
    const col9 = document.getElementById('col-9');
    // Add event listener for mousemove
    col9.addEventListener('mousemove', handleMouseMove);

    // Cleanup function
    return () => {
      col9.removeEventListener('mousemove', handleMouseMove);
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
            position: 'fixed',
            borderBottom: '1px solid #ececec',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 999,
            background: 'white',
            // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            // padding: '10px',
            // display: 'flex',
            // justifyContent: 'space-around',
            // alignItems: 'center'
          }}>
          <Row>
            <Col
              xl={12}
              md={12}
              sm={12}
              style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlock: '1%'}}>
              {/* back button
               */}
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button
                  style={{boxShadow: 'none', height: '40px'}}
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
                  <ArrowLeft size={20} />
                  <span style={{fontSize: '16px'}} className="align-middle ms-25">
                    Back
                  </span>
                </Button>
                <img
                  src={logoRemoveBg}
                  style={{
                    width: '200px',
                    height: 'auto',
                  }}
                />
              </div>
              {statusFile === 'InProgress' ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <ButtonDropdown
                    size="sm"
                    style={{marginRight: '10px', fontSize: '16px'}}
                    isOpen={dropdownOpen1}
                    toggle={toggleDropdown1}>
                    <DropdownToggle color="primary" style={{fontSize: '16px', height: '40px', boxShadow: 'none'}} caret>
                      {active === '1' ? 'For You' : 'For Other'}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem style={{fontSize: '14px', width: '100%'}} onClick={() => toggle('1')}>
                        For You
                      </DropdownItem>
                      {onlySigner === true || onlySigner === 'true' ? null : (
                        <DropdownItem
                          style={{fontSize: '14px', width: '100%'}}
                          onClick={() => {
                            // if (selectedSigner === null || selectedSigner === undefined || selectedSigner === "" ||
                            //   selectedSigner.length === 0) {
                            //   toastAlert("error", "Please Select Signer")
                            // } else {
                            toggle('2');
                            // }
                          }}>
                          For Others
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </ButtonDropdown>
                  <TabContent className="py-50" activeTab={active}>
                    <TabPane tabId="1">
                      <ForYou type={getTypeListItem} />
                    </TabPane>
                    <TabPane tabId="2">
                      <ForOthers type={getTypeListItem} />
                    </TabPane>
                  </TabContent>
                </div>
              ) : (
                <div></div>
              )}
              {statusFile === 'InProgress' ? (
                <>
                  {onlySigner === true || onlySigner === 'true' ? null : (
                    <div>
                      {selectedSigner === null ||
                      selectedSigner === undefined ||
                      selectedSigner === '' ||
                      selectedSigner.length === 0 ? (
                        <>
                          <Button
                            // disabled={saveLoading}
                            color="primary"
                            onClick={() => {
                              setCount(signersData.length);
                              setSignerAddEdit(true);
                            }}
                            style={{
                              marginLeft: '10px',
                              display: 'flex',
                              boxShadow: 'none',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            className="btn-icon d-flex">
                            <span style={{fontSize: '16px'}} className="align-middle ms-25">
                              Add Signer
                            </span>
                          </Button>
                        </>
                      ) : (
                        <ButtonDropdown size="sm" isOpen={dropdownOpen} toggle={toggleDropdown}>
                          <DropdownToggle
                            style={{
                              boxShadow: 'none',
                              height: '40px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            color="primary"
                            caret>
                            {selectedSigner === null ||
                            selectedSigner === undefined ||
                            selectedSigner === '' ||
                            selectedSigner.length === 0 ? (
                              <span style={{fontSize: '16px'}}>Select Signer</span>
                            ) : (
                              <>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexShrink: 1,
                                  }}>
                                  <div
                                    style={{
                                      backgroundColor: `${selectedSigner.color}`,
                                      width: '20px',
                                      height: '20px',
                                    }}></div>
                                  <span style={{marginLeft: '10px'}}>{selectedSigner.name}</span>
                                </div>
                              </>
                            )}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              href="/"
                              tag="a"
                              onClick={e => {
                                e.preventDefault();
                                setCount(signersData.length);
                                setSignerAddEdit(true);
                              }}>
                              <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                                <Plus size={12} />
                                <h3 style={{marginLeft: '10px', marginTop: '3px'}}> Signer</h3>
                              </div>
                            </DropdownItem>
                            {signersData &&
                              signersData.map((item, index) => (
                                <DropdownItem
                                  href="/"
                                  tag="a"
                                  onClick={e => {
                                    e.preventDefault();
                                    //console.log(item);
                                    setSelectedSigner(item);
                                  }}>
                                  <div style={{display: 'flex'}}>
                                    <div
                                      style={{backgroundColor: `${item.color}`, width: '20px', height: '20px'}}></div>
                                    <span style={{marginLeft: '20px', fontSize: '16px'}}>{item.name}</span>{' '}
                                  </div>
                                </DropdownItem>
                              ))}
                          </DropdownMenu>
                        </ButtonDropdown>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  {onlySigner === true || onlySigner === 'true' ? null : (
                    <>
                      <h3 className="fw-bold" style={{marginTop: '1%'}}>
                        Selected Signer :
                      </h3>
                      {signersData &&
                        signersData.map((item, index) => (
                          <>
                            <div
                              onClick={() => {
                                setSelectedSigner(item);
                              }}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: '10px',
                              }}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: `${item.color}`,
                                  width: '30px',
                                  height: '30px',
                                  border: selectedSigner === item ? '2px solid black' : 'none',
                                }}>
                                {item.completed_status === 'true' || item.completed_status === true ? (
                                  <Check size={20} color="white" />
                                ) : null}
                              </div>
                              <span style={{marginLeft: '10px', fontSize: '16px'}}>{item.name}</span>
                            </div>
                          </>
                        ))}
                    </>
                  )}
                </div>
              )}
              <div style={{display: 'flex'}}>
                {/* <Button
                  // disabled={saveLoading}
                  color="primary"
                  onClick={generatePDF}
                  style={{

                    display: 'flex',
                    boxShadow: 'none',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }} className='btn-icon d-flex'>
                  <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Download</span>
                </Button> */}
                {statusFile === 'InProgress' ? (
                  <>
                    <Button
                      disabled={saveLoading}
                      color={saveSuccess ? 'success' : 'primary'}
                      onClick={() => saveData()}
                      style={{
                        marginLeft: '10px',
                        display: 'flex',
                        boxShadow: 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      className="btn-icon d-flex">
                      {saveLoading ? (
                        <Spinner color="white" size="sm" />
                      ) : saveSuccess ? (
                        <Check color="white" size={15} />
                      ) : null}
                      <span style={{fontSize: '16px'}} className="align-middle ms-25">
                        Save
                      </span>
                    </Button>
                    {/* <Button
                    // disabled={saveLoading}
                    color="primary"
                    onClick={async () => {
                      await saveDataClose()
                      window.location.href = "/home"
                    }}
                    style={{
                      marginLeft: '10px',
                      display: 'flex',
                      boxShadow: 'none',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }} className='btn-icon d-flex'>
                    {saveLoadingClose ? <Spinner color='white' size='sm' /> : null}
                    <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Save & Close</span>
                  </Button> */}
                  </>
                ) : null}

                {statusFile === 'InProgress' ? (
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
                              // setFileName(apiData.data.name)
                              // setInputValue(apiData.data.name)
                            }
                          } catch (error) {
                            //console.log('Error fetching data:', error);
                          }
                        }}
                        style={{
                          marginLeft: '10px',
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
                )}
              </div>
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

        <Col xs={12} style={{marginTop: '8%'}}>
          <Row>
            <Col xs={12} md={2}></Col>
            <Col
              xs={12}
              md={8}
              style={{
                cursor: type === 'my_text' || type === 'signer_text' ? 'text' : type ? 'pointer' : 'default',
              }}>
              <div
                id="col-9"
                ref={elementRef}
                style={{maxHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative'}}>
                {/* {imageUrls.map((imageUrl, index) => ( */}
                <>
                  {/* <Button onClick={generatePDF}>Generate PDF</Button> */}
                  {loaderRefresh ? (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(211, 211, 211, 0.5)', // Light grey with opacity
                        //  display: 'flex',
                        //  justifyContent: 'center',
                        //  alignItems: 'center',
                      }}>
                      <Spinner style={{width: '3rem', height: '3rem', color: 'grey'}} /> {/* Grey spinner */}
                    </div>
                  ) : null}
                  {/* <Stage width='auto' height={window.innerHeight} onMouseDown={handleMouseDown} onMousemove={handleMouseMove} onMouseup={handleMouseUp}>
                <Layer> */}
                  <img
                    crossOrigin="anonymous"
                    onError={e => {
                      e.target.onerror = null; // Prevents infinite looping if the replacement image also fails
                      e.target.src = imageDummy; // Replace with your dummy image path
                    }}
                    // key={index}
                    // ref={(el) => imageRefs.current[index] = el}
                    src={`${BASE_URL}${activeImageUrl}`}
                    // onClick={() => {
                    //   // //console.log(imageUrl.bgimgs_id)
                    //   handleThumbnailClick(event, activeImage)
                    // }}
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
                    if (position.type === 'my_text') {
                      return (
                        <Draggable
                          key={index}
                          disabled
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                            }}
                            onClick={() => handleTextClick(index, 'my_text')}>
                            <span
                              style={{
                                fontSize: position.fontSize,
                                fontStyle: position.fontStyle,
                                fontWeight: position.fontWeight,
                                color: position.color,
                                // backgroundColor: position.backgroundColor,
                                border: 'none',
                                minWidth: position.width,

                                fontFamily: position.fontFamily,
                                width: `${position.text.length}ch`,
                              }}>
                              {position.text}
                            </span>
                            {/* <input
                              autoFocus
                              value={position.text}
                              onChange={(e) => handleInputChanged(e, index)}
                              style={{
                                fontSize: position.fontSize,
                                fontStyle: position.fontStyle,
                                fontWeight: position.fontWeight,
                                color: position.color,
                                backgroundColor: position.backgroundColor,
                                border: 'none',
                                minWidth: position.width,

                                fontFamily: position.fontFamily,
                                width: `${position.text.length}ch`
                              }}
                            /> */}
                            {isEditing && editingIndex === index && (
                              <div>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => handleFontSizeChange(index, position.fontSize, 'big')}>
                                    <ChevronsUp size={15} />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => handleFontSizeChange(index, position.fontSize, 'small')}>
                                    <ChevronsDown size={15} />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleFontWeightChange(index)}>
                                    <Bold size={15} />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => {
                                      setEditedTextIndex(index);
                                      setShowColorPicker(!showColorPicker);
                                    }}>
                                    <Type style={{color: position.color}} size={15} />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                                {showColorPicker && (
                                  <div style={{position: 'absolute', zIndex: 200}}>
                                    <ChromePicker color={position.color} onChange={handleColorChange} />
                                  </div>
                                )}
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'my_signature') {
                      return (
                        <Draggable
                          disabled
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            <img
                              // className="drag-handle"
                              // onClick={() => setEdit(!edit)}
                              alt="Remy Sharp"
                              onClick={() => handleTextClick(index, 'my_signature')}
                              variant="square"
                              src={`${BASE_URL}${position.url}`}
                              style={{
                                backgroundColor: `${
                                  isEditingSignature && editingIndex === index ? '#e4e3e5' : 'transparent'
                                }`,
                                width: `${position.width}px`,
                                height: `${position.height}px`,
                                // border: '1px solid lightGray',
                              }}
                            />

                            {isEditingSignature && editingIndex === index && (
                              <div>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'date') {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                            }}
                            // onClick={() => handleTextClick(index, "date")}
                          >
                            <div>
                              <input
                                type="date"
                                className="form-control"
                                style={{
                                  height: '40px',
                                  fontSize: position.fontSize,
                                }}
                                value={position.text}
                                onFocus={() => setDatePickerActive(true)}
                                // onChange={event => {
                                //   const newSavedCanvasData = [...savedCanvasData];
                                //   newSavedCanvasData[index].text = event.target.value;
                                //   setSavedCanvasData(newSavedCanvasData);
                                //   setDatePickerActive(false)
                                // }}
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
                                  <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                    <Button
                                      outline
                                      color="primary"
                                      onClick={() => handleFontSizeChange(index, position.fontSize, 'big')}>
                                      <ChevronsUp size={15} />
                                    </Button>
                                    <Button
                                      outline
                                      color="primary"
                                      onClick={() => handleFontSizeChange(index, position.fontSize, 'small')}>
                                      <ChevronsDown size={15} />
                                    </Button>
                                    <Button outline color="primary">
                                      <Maximize size={15} className="drag-handle" />
                                    </Button>
                                    <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                      <Trash2 style={{color: 'red'}} size={15} />
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
                    } else if (position.type === 'checkmark') {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                            }}
                            // onClick={() => handleTextClick(index, "date")}
                          >
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              <Input
                                type="checkbox"
                                checked={position.text}
                                onChange={e => {
                                  //console.log(e.target.checked);
                                  // setPicker(date)
                                  const newSavedCanvasData = [...savedCanvasData];
                                  newSavedCanvasData[index].text = e.target.checked;
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

                              <div style={{marginLeft: '10px'}}>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
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
                    } else if (position.type === 'signer_text') {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            onClick={() => handleTextClick(index, 'my_text')}>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
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
                                // onChange={(e) => {
                                //   const newSavedCanvasData = [...savedCanvasData];
                                //   newSavedCanvasData[index].placeholder = e.target.value;
                                //   setSavedCanvasData(newSavedCanvasData);
                                //   // handleInputChanged(e, index)
                                // }}
                                style={{
                                  fontSize: position.fontSize,
                                  fontStyle: position.fontStyle,
                                  fontWeight: position.fontWeight,
                                  width: position.width,
                                  color: position.color,
                                  backgroundColor: position.backgroundColor,
                                  border: 'none',
                                  fontFamily: position.fontFamily,
                                  // opacity: 0.5
                                  // width: `${position.text.length}ch`
                                }}
                              />
                            </div>

                            {isEditing && editingIndex === index && (
                              <div>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => {
                                      if (position.required === true || position.required === 'true') {
                                        let bgColor = savedCanvasData[index].backgroundColor;
                                        let darkenedBgColor = lightenColor(bgColor);
                                        const newSavedCanvasData = [...savedCanvasData];
                                        newSavedCanvasData[index].required = false;
                                        newSavedCanvasData[index].backgroundColor = darkenedBgColor;
                                        setSavedCanvasData(newSavedCanvasData);

                                        // let bgColor = savedCanvasData[index].backgroundColor
                                        // let darkenedBgColor = lightenColor(bgColor)

                                        // // //console.log(savedCanvasData[index])
                                        // savedCanvasData[index].required = false
                                        // savedCanvasData[index].backgroundColor = darkenedBgColor
                                      } else {
                                        let bgColor = savedCanvasData[index].backgroundColor;
                                        let darkenedBgColor = darkenColor(bgColor);
                                        const newSavedCanvasData = [...savedCanvasData];
                                        newSavedCanvasData[index].required = true;
                                        newSavedCanvasData[index].backgroundColor = darkenedBgColor;
                                        setSavedCanvasData(newSavedCanvasData);

                                        // let bgColor = savedCanvasData[index].backgroundColor
                                        // let lightenBgColor = darkenColor(bgColor)

                                        // //console.log(savedCanvasData[index])
                                        // savedCanvasData[index].required = true
                                        // savedCanvasData[index].backgroundColor = lightenBgColor
                                        // //console.log(savedCanvasData)
                                      }

                                      // handleFontSizeChange(index, position.fontSize, 'big')
                                    }}>
                                    <span style={{color: position.required ? 'red' : 'rgb(98 188 221)'}}>*</span>
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => handleFontSizeChange(index, position.fontSize, 'big')}>
                                    <ChevronsUp size={15} />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => handleFontSizeChange(index, position.fontSize, 'small')}>
                                    <ChevronsDown size={15} />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleFontWeightChange(index)}>
                                    <Bold size={15} />
                                  </Button>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => {
                                      setEditedTextIndex(index);
                                      setShowColorPicker(!showColorPicker);
                                    }}>
                                    <Type style={{color: position.color}} size={15} />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                                {showColorPicker && (
                                  <div style={{position: 'absolute', zIndex: 200}}>
                                    <ChromePicker color={position.color} onChange={handleColorChange} />
                                  </div>
                                )}
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'signer_date') {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            onClick={() => handleTextClick(index, 'signer_date')}>
                            <div>
                              <input
                                type="date"
                                className="form-control"
                                style={{
                                  height: '40px',
                                  fontSize: position.fontSize,
                                  backgroundColor: `${position.backgroundColor}`,
                                }}
                                value={position.text}
                                onFocus={() => setDatePickerActiveSigner(true)}
                                onChange={event => {
                                  const newSavedCanvasData = [...savedCanvasData];
                                  newSavedCanvasData[index].text = event.target.value;
                                  setSavedCanvasData(newSavedCanvasData);
                                  setDatePickerActiveSigner(false);
                                }}
                                id="default-picker"
                              />
                              {/* <Flatpickr
                            className='form-control'
                            value={position.text}
                            onChange={date => {
                              // setEdit(false)
                              // setPicker(date)
                              const newSavedCanvasData = [...savedCanvasData];
                              newSavedCanvasData[index].text = date;
                              setSavedCanvasData(newSavedCanvasData);

                            }}
                            options={{
                              altInput: true,
                              altFormat: 'd/m/Y', // Day of the month, month, year
                              dateFormat: 'd/m/Y'
                            }}

                            id='default-picker' /> */}
                              {datePickerActiveSigner && editingIndex === index && (
                                <div>
                                  <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                    <Button
                                      outline
                                      color="primary"
                                      onClick={() => handleFontSizeChange(index, position.fontSize, 'big')}>
                                      <ChevronsUp size={15} />
                                    </Button>
                                    <Button
                                      outline
                                      color="primary"
                                      onClick={() => handleFontSizeChange(index, position.fontSize, 'small')}>
                                      <ChevronsDown size={15} />
                                    </Button>
                                    <Button outline color="primary">
                                      <Maximize size={15} className="drag-handle" />
                                    </Button>
                                    <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                      <Trash2 style={{color: 'red'}} size={15} />
                                    </Button>
                                  </ButtonGroup>
                                </div>
                              )}
                            </div>
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'stamp') {
                      return (
                        <Draggable
                          disabled
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                              <Maximize size={15}/>
                              </div> */}
                            <img
                              // className="drag-handle"
                              // onClick={() => setEdit(!edit)}
                              alt="Remy Sharp"
                              onClick={() => handleTextClick(index, 'stamp')}
                              variant="square"
                              src={`${BASE_URL}${position.url}`}
                              style={{
                                filter: 'grayscale(100%)',
                                width: `${position.width}px`,
                                // height: `${position.height}px`,
                                height: 'auto',
                                // border: '1px solid lightGray',
                              }}
                            />
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
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'signer_chooseImgDrivingL') {
                      return (
                        <Draggable
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                              <Maximize size={15}/>
                              </div> */}
                            {position.url === null || position.url === undefined ? (
                              <div
                                onClick={() => handleTextClick(index, 'signer_chooseImgDrivingL')}
                                style={{
                                  backgroundColor: `${position.backgroundColor}`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  border: '1px solid lightGray',
                                  display: 'flex',
                                  padding: '1%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <h3>+ Driving License</h3>
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
                            {isEditingDrivingLicense && editingIndex === index && (
                              <div>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'signer_chooseImgPassportPhoto') {
                      return (
                        <Draggable
                          disabled
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            onClick={() => handleTextClick(index, 'signer_chooseImgPassportPhoto')}
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                              <Maximize size={15}/>
                              </div> */}
                            {position.url === null || position.url === undefined ? (
                              <div
                                style={{
                                  backgroundColor: `${position.backgroundColor}`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  border: '1px solid lightGray',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  padding: '1%',
                                  alignItems: 'center',
                                }}>
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
                            {isEditingPassportPhoto && editingIndex === index && (
                              <div>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'signer_chooseImgStamp') {
                      return (
                        <Draggable
                          disabled
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            {/* <ResizableBox
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
                            > */}
                            {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                              <Maximize size={15}/>
                              </div> */}
                            {position.url === null || position.url === undefined ? (
                              <div
                                onClick={() => handleTextClick(index, 'signer_chooseImgStamp')}
                                style={{
                                  backgroundColor: `${position.backgroundColor}`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  border: '1px solid lightGray',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <h3>+ Choose Stamp Image</h3>
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
                            {/* </ResizableBox> */}
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
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'signer_initials') {
                      return (
                        <Draggable
                          disabled
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            // onClick={() => handleTextClick(index)}
                          >
                            {/* <ResizableBox
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
                            > */}
                            {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                              <Maximize size={15}/>
                              </div> */}
                            {position.url === null || position.url === undefined ? (
                              <div
                                onClick={() => handleTextClick(index, 'signer_initials')}
                                style={{
                                  backgroundColor: `${position.backgroundColor}`,
                                  width: `${position.width}px`,
                                  height: `${position.height}px`,
                                  border: '1px solid lightGray',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <h3>Sign Here</h3>
                              </div>
                            ) : (
                              <>
                                {statusFile === 'InProgress' ? (
                                  <div
                                    onClick={() => handleTextClick(index, 'signer_initials')}
                                    style={{
                                      backgroundColor: `${position.backgroundColor}`,
                                      width: `${position.width}px`,
                                      height: `${position.height}px`,
                                      border: '1px solid lightGray',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <h3>Sign Here</h3>
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
                            {/* </ResizableBox> */}
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
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                            {/* <button onClick={() => handleDelete(index)}>Delete</button> */}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'signer_checkmark') {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            onClick={() => handleTextClick(index, 'signer_checkmark')}>
                            <div
                              style={{
                                display: 'flex',
                                padding: '10px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${position.backgroundColor}`,
                              }}>
                              <Input
                                type="checkbox"
                                checked={position.text}
                                onChange={e => {
                                  //console.log(e.target.checked);
                                  // setPicker(date)
                                  const newSavedCanvasData = [...savedCanvasData];
                                  newSavedCanvasData[index].text = e.target.checked;
                                  setSavedCanvasData(newSavedCanvasData);
                                }}
                                id="basic-cb-checked"
                              />
                              {/* <input
                                autoFocus
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
                              {signerCheckmark && editingIndex === index && (
                                <div style={{marginLeft: '10px'}}>
                                  <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                    <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                      <Trash2 style={{color: 'red'}} size={15} />
                                    </Button>
                                  </ButtonGroup>
                                </div>
                              )}
                            </div>
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'signer_radio') {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            onClick={() => handleTextClick(index, 'signer_radio')}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: `${position.direction}`,
                                padding: '10px',
                                justifyContent: 'left',
                                alignItems: 'left',
                                backgroundColor: `${position.backgroundColor}`,
                              }}>
                              <h2>{position?.options?.question}</h2>
                              {position?.options?.options?.map(option => {
                                return (
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'left',
                                      alignItems: 'center',
                                    }}>
                                    <input
                                      type="radio"
                                      id={option}
                                      name="option"
                                      value={option}
                                      checked={position.text === option}
                                      style={{marginLeft: '10px'}}
                                      onChange={e => {
                                        //console.log(e.target.value);
                                        // setPicker(date)
                                        const newSavedCanvasData = [...savedCanvasData];
                                        newSavedCanvasData[index].text = e.target.value;
                                        setSavedCanvasData(newSavedCanvasData);
                                      }}
                                      // checked={selectedOption === 'option1'}
                                      // onChange={(e) => setSelectedOption(e.target.value)}
                                    />
                                    <h3 style={{marginLeft: '10px'}} htmlFor={option}>
                                      {option}
                                    </h3>
                                  </div>
                                );
                              })}

                              {/* <Button color='primary' > */}
                              {/* <Trash2 style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }} size={20} onClick={() => handleDeleteCurrentPosition(index)} /> */}
                              {/* </Button> */}
                            </div>
                            {isEditingSignerRadio && editingIndex === index && (
                              <div>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => {
                                      if (position.direction === 'row') {
                                        const newSavedCanvasData = [...savedCanvasData];
                                        newSavedCanvasData[index].direction = 'column';
                                        setSavedCanvasData(newSavedCanvasData);
                                      } else {
                                        const newSavedCanvasData = [...savedCanvasData];
                                        newSavedCanvasData[index].direction = 'row';
                                        setSavedCanvasData(newSavedCanvasData);
                                      }
                                    }}>
                                    {position.direction === 'row' ? <ArrowUp size={15} /> : <ArrowRight size={15} />}
                                  </Button>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'signer_dropdown') {
                      return (
                        <Draggable
                          disabled
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${
                                position.bgImg === activeImage && selectedSigner.signer_id === position.signer_id
                                  ? 'block'
                                  : 'none'
                              }`,
                            }}
                            onClick={() => handleTextClick(index, 'signer_dropdown')}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: `${position.direction}`,
                                padding: '10px',
                                justifyContent: 'left',
                                alignItems: 'center',
                                backgroundColor: `${position.backgroundColor}`,
                              }}>
                              <h2>{position?.options?.question}</h2>
                              <Dropdown
                                color="primary"
                                style={{marginLeft: '10px'}}
                                isOpen={dropdownOpenOptionOther}
                                toggle={toggleDropdownOptionOther}>
                                <DropdownToggle color="primary" caret style={{fontSize: '16px'}}>
                                  {position.text === null || position.text === undefined
                                    ? 'Select Option'
                                    : position.text}
                                </DropdownToggle>
                                <DropdownMenu>
                                  {position?.options?.options?.map((option, index) => (
                                    <DropdownItem
                                      style={{width: '100%', fontSize: '16px'}}
                                      key={index}
                                      onClick={() => handleSelectOptionOptionOther(option, index)}>
                                      {option}
                                    </DropdownItem>
                                  ))}
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                            {isEditingSignerDropdown && editingIndex === index && (
                              <div>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button
                                    outline
                                    color="primary"
                                    onClick={() => {
                                      if (position.direction === 'row') {
                                        const newSavedCanvasData = [...savedCanvasData];
                                        newSavedCanvasData[index].direction = 'column';
                                        setSavedCanvasData(newSavedCanvasData);
                                      } else {
                                        const newSavedCanvasData = [...savedCanvasData];
                                        newSavedCanvasData[index].direction = 'row';
                                        setSavedCanvasData(newSavedCanvasData);
                                      }
                                    }}>
                                    {position.direction === 'row' ? <ArrowUp size={15} /> : <ArrowRight size={15} />}
                                  </Button>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            )}
                          </div>
                        </Draggable>
                      );
                    } else if (position.type === 'highlight') {
                      return (
                        <Draggable
                          disabled
                          handle=".drag-handle" // Add this line
                          key={index}
                          defaultPosition={{x: position.x, y: position.y}}
                          onStop={(e, data) => handleTextDrag(e, data, index)}>
                          <div
                            style={{
                              position: 'absolute',
                              display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                            }}>
                            <div
                              onClick={() => handleTextClick(index, 'signer_chooseImgStamp')}
                              style={{
                                backgroundColor: `${position.backgroundColor}`,
                                width: `${position.width}px`,
                                height: `${position.height}px`,
                                border: '1px solid lightGray',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: '0.5',
                              }}></div>

                            {isEditingStampImage && editingIndex === index && (
                              <div>
                                <ButtonGroup size="sm" style={{backgroundColor: 'white'}}>
                                  <Button outline color="primary">
                                    <Maximize size={15} className="drag-handle" />
                                  </Button>
                                  <Button outline color="primary" onClick={() => handleDeleteCurrentPosition(index)}>
                                    <Trash2 style={{color: 'red'}} size={15} />
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
              style={{maxHeight: '100vh', overflowY: 'auto', position: 'fixed', right: 0, top: 150, bottom: 5}}>
              <Row>
                {imageUrls.map((imageUrl, index) => (
                  <>
                    <Col xs={12} className="d-flex justify-content-center">
                      <img
                        key={index}
                        src={`${BASE_URL}${imageUrl.image}`}
                        onClick={() => {
                          setActiveImage(imageUrl.bgimgs_id);
                          setActiveImageUrl(imageUrl.image);
                          setShowColorPicker(false);
                          // imageRefs.current[index].scrollIntoView({ behavior: 'smooth' });
                          // handleThumbnailClick(imageUrl.image, index)
                        }}
                        style={{
                          width: '150px',
                          height: '200px',
                          border: activeImage === imageUrl.bgimgs_id ? '2px solid gray' : 'none',
                        }}
                      />
                    </Col>
                    <Col xs={12} className="d-flex justify-content-center p-2">
                      <span style={{fontSize: '12px'}}>Page {index + 1}</span>
                    </Col>
                  </>
                ))}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Modal  */}
    </>
  );
};

export default ViewDocEditor;
