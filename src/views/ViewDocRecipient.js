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
// import {ChromePicker} from 'react-color';
import {
  Bold,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  FileText,
  MapPin,
  Maximize,
  Plus,
  Trash,
  Trash2,
  Type,
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
import {formatDate, getRandomLightColor} from '../utility/Utils';
// import {ResizableBox} from 'react-resizable';
import 'react-resizable/css/styles.css';

const ReceivedEsignDoc = () => {
  const [imageUrls, setImageUrls] = useState([]);
  // const file_id = window.location.pathname.split("/")[2];
  const path = window.location.pathname;

  // Split the path into parts
  const parts = path.split('/');

  // The encrypted IDs are the last two parts of the path
  const emailHashed = parts[parts.length - 2];
  const file_id = parts[parts.length - 1];

  const [activeImage, setActiveImage] = useState('');
  const [savedCanvasData, setSavedCanvasData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [isEditingStamp, setIsEditingStamp] = useState(false);
  const [isEditingStampImage, setIsEditingStampImage] = useState(false);
  const [isEditingDrivingLicense, setIsEditingDrivingLicense] = useState(false);
  const [isEditingPassportPhoto, setIsEditingPassportPhoto] = useState(false);
  const [isEditingSignerRadio, setIsEditingSignerRadio] = useState(false);
  const [isEditingSignerDropdown, setIsEditingSignerDropdown] = useState(false);
  const [isEditingInitials, setIsEditingInitials] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editedTextIndex, setEditedTextIndex] = useState(null);
  const [type, setType] = useState('');

  const [eventDataOnClick, setEventDataOnClick] = useState([]);
  const [selectedSigner, setSelectedSigner] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);
  const [sendToEsign, setSendToEsign] = useState(false);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState('');
  const [loadingDelete, setloadingDelete] = useState(false);
  const [active, setActive] = useState('1');
  const [signerAddEdit, setSignerAddEdit] = useState(false);
  const [count, setCount] = useState(1);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [MarkAsCompleted, setMarkAsCompleted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loaderRefresh, setloaderRefresh] = useState(true);
  // const [signerFunctionalControls, setSignerFunctionalControls] = useState(false);
  const [signerFunctionalControls, setSignerFunctionalControls] = useState(false);

  const imageRefs = useRef([]);
  const ref = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const CompletedDocument = async () => {
    //console.log('Mark as Completed');
    setLoadingComplete(true);
    await saveData();
    const postData = {
      signer_id: position.signer_id,
      completed_status: true,
    };
    const apiData = await post('file/markDocAsCompletedBySigner', postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
    if (apiData.error) {
      setLoadingComplete(false);

      toastAlert('error', apiData.message);
    } else {
      setMarkAsCompleted(false);
      toastAlert('success', 'Document Marked as Completed');
      window.location.reload();
    }
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
    const color_code = getRandomLightColor();
    //console.log(color_code);
    setSignersData([...signersData, {id: signersData.length + 1, name: '', email: '', color: color_code}]);
    setCount(count + 1);
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
  const handleImageChange = async e => {
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
      let resultingData = handlePlacePosition(eventDataOnClick, type, activeImage, url);
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
        input.onchange = handleImageChange;
        input.click();
      }
      //  else if (type === "signer_chooseImgDrivingL") {
      //   const rect = event.currentTarget.getBoundingClientRect();
      //   const x = event.offsetX
      //   const y = event.offsetY
      //   // const x = event.clientX - rect.left;
      //   // const y = event.clientY - rect.top;
      //   let arrayObj = {
      //     x,
      //     y,
      //     rect
      //   }
      //   setEventDataOnClick(arrayObj)
      //   //console.log("Event Data onclick ")
      //   //console.log(arrayObj)

      //   setIndexDataOnClick(index)
      //   const input = document.createElement('input');
      //   input.type = 'file';
      //   input.accept = 'image/*';
      //   input.onchange = handleImageChange;
      //   input.click();
      // }
      else {
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

  const saveData = async () => {
    setsaveLoading(true);
    //console.log(savedCanvasData);
    const postData = {
      file_id: file_id,
      position_array: savedCanvasData,
    };
    try {
      const apiData = await post('file/saveCanvasDataWithFile_IdSave', postData); // Specify the endpoint you want to call
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
  // Input Text

  const [dropdownOpenOptionOther, setDropdownOpenOptionOther] = useState(false);

  const [indesDataPosition, setIndexDataPosition] = useState(null);
  const handleTextClick = (index, typeData, returned_position) => {
    if (typeData === 'my_text') {
      setIsEditing(true);
      setEditingIndex(index);
    } else if (typeData === 'my_signature') {
      setIsEditingSignature(true);
      setEditingIndex(index);
    } else if (typeData === 'date') {
      setIsEditingSignature(true);
      setEditingIndex(index);
    } else if (typeData === 'stamp') {
      setIsEditingStamp(true);
      setEditingIndex(index);
    } else if (typeData === 'signer_initials') {
      //console.log(returned_position);
      setIndexDataPosition(index);

      setType('signer_initials');
      let arrayObj = {
        x: returned_position.x,
        y: returned_position.y,
      };
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(index);
      setSignatureModal(true);
    } else if (typeData === 'signer_chooseImgDrivingL') {
      //console.log(returned_position);
      setIndexDataPosition(index);

      setType('signer_chooseImgDrivingL');
      let arrayObj = {
        x: returned_position.x,
        y: returned_position.y,
      };
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(index);
      setSignatureModal(true);
    } else if (typeData === 'signer_chooseImgPassportPhoto') {
      //console.log(returned_position);
      setIndexDataPosition(index);

      setType('signer_chooseImgPassportPhoto');
      let arrayObj = {
        x: returned_position.x,
        y: returned_position.y,
      };
      setEventDataOnClick(arrayObj);
      setIndexDataOnClick(index);
      setSignatureModal(true);
    } else if (typeData === 'signer_chooseImgStamp') {
      //console.log(returned_position);
      setIndexDataPosition(index);

      setType('signer_chooseImgStamp');
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
    if (item === 'big') {
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
    const updatedImageUrls = [...savedCanvasData];
    updatedImageUrls.splice(deleteIndex, 1); // Remove the image at the specified index
    const updatedCanvasData = [...savedCanvasData];
    updatedCanvasData.splice(deleteIndex, 1); // Remove the corresponding data
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

  const handleCloseClick = i => {
    setIsInputVisible(false);
    // setIsInputInvalid(false);
    // If you want to reset the access code when the input is closed without saving, uncomment the following line
    signersData[i].accessCode = '';
    fetchSignerData();
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
  // Recipients
  const handleInputChangeRecipients = (i, event) => {
    const {name, value} = event.target;
    const newRecipientData = [...RecipientsData];

    const newInputErrors = [...inputErrorsRecipients];
    // Check if the email is already present in the array
    if (name === 'email' && RecipientsData.some((receipients, index) => receipients.email === value && index !== i)) {
      newInputErrors[i] = 'This email is already in use.';
    } else {
      newInputErrors[i] = '';
    }

    newRecipientData[i][name] = value;
    setRecipientsData(newRecipientData);
    setInputErrorsRecipients(newInputErrors);
  };
  const AddSignersData = async () => {
    setLoadingSignersSave(true);

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
        setSignerAddEdit(false);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setLoadingSignersSave(false);
    }
  };
  // Recipients data
  const AddRecipientsData = async () => {
    setLoadingRecipientsSave(true);

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
        setRecipientsData([]);
        setLoadingRecipientsSave(false);
      } else {
        // //console.log(apiData.result)
        toastAlert('succes', apiData.message);
        setRecipientsData(apiData.data);
        setCountReceipient(apiData.data.length);
        setLoadingRecipientsSave(false);
        // setSignerAddEdit(false)
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setLoadingSignersSave(false);
    }
  };
  const update_file_controls = async () => {
    // api to update name of file
    const postData = {
      file_id: file_id,
      secured_share: securedShare,
      signer_functional_controls: signerFunctionalControls,
      set_esigning_order: EsignOrder,
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
        // setFileName(apiData.data.name)
        // setInputValue(apiData.data.name)
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const update_email_content = async () => {
    // api to update name of file
    const postData = {
      file_id: file_id,
      email_subject: emailSubject,
      email_message: emailMessage,
      name: fileName,
    };
    try {
      const apiData = await post('file/update-file', postData); // Specify the endpoint you want to call
      //console.log('Update File Controls ');
      //console.log(apiData);
      if (apiData.error) {
        toastAlert('error', apiData.message);
        // setFileName("")
        // setInputValue("")
        setLoadingSaveDocument(false);
      } else {
        // //console.log(apiData.result)
        toastAlert('succes', apiData.message);
        // setFileName(apiData.data.name)
        // setInputValue(apiData.data.name)
        setLoadingSaveDocument(false);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
      setLoadingSaveDocument(false);
    }
  };
  const deleteForm = e => {
    e.preventDefault();
    const slideDownWrapper = e.target.closest('.react-slidedown'),
      form = e.target.closest('form');
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
      setEmailMessage(apiData.data.email_message || '');
      setEmailSubject(apiData.data.email_subject || '');
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

  const steps = [
    {
      id: 'account-details',
      title: 'Signer Details',
      subtitle: 'Enter Signers Detail.',
      icon: <FileText size={18} />,
      content: (
        <>
          <Row tag="form" className="gy-1 gx-2 ">
            <Col xs={12} className="d-flex justify-content-between align-center">
              <h3 className="text-center mb-1 fw-bold">Add Signers</h3>
              <Button size="sm" className="btn-icon" color="primary" onClick={increaseCount}>
                <Plus size={14} />
                <span className="align-middle ms-25">Signer</span>
              </Button>
            </Col>
            <Col xs={12}>
              <Repeater count={count}>
                {i => {
                  const Tag = i === 0 ? 'div' : SlideDown;
                  return (
                    <Tag key={i}>
                      <Form>
                        <Row className="justify-content-between align-items-center">
                          <Col md={4} className="mb-md-0 mb-1">
                            <Label className="form-label" for={`animation-item-name-${i}`}>
                              Signer Name
                            </Label>
                            <Input
                              type="text"
                              name="name"
                              id={`animation-item-name-${i}`}
                              placeholder="Vuexy Admin "
                              value={signersData[i].name}
                              onChange={event => handleInputChange(i, event)}
                            />
                          </Col>
                          <Col md={4} className="mb-md-0 mb-1">
                            <Label className="form-label" for={`animation-cost-${i}`}>
                              Email
                            </Label>
                            <Input
                              name="email"
                              value={signersData[i].email}
                              onChange={event => handleInputChange(i, event)}
                              type="email"
                              id={`animation-cost-${i}`}
                              placeholder="signer@gmail.com"
                            />
                          </Col>
                          <Col md={4} className="mb-md-0 mt-2" style={{position: 'relative'}}>
                            {isInputVisible && i === activeRow ? (
                              <>
                                <Input
                                  type="text"
                                  value={inputValueAccessCode}
                                  // invalid={isInputInvalid}
                                  onChange={e => {
                                    setInputValueAccessCode(e.target.value);
                                  }}
                                />
                                <FormFeedback>Access Code cannot be empty</FormFeedback>
                                {isLoading ? (
                                  <Spinner
                                    color="primary"
                                    size="sm"
                                    style={{cursor: 'pointer', position: 'absolute', top: -10, right: 0}}
                                  />
                                ) : (
                                  <Badge
                                    color="success"
                                    pill
                                    style={{cursor: 'pointer', position: 'absolute', top: -10, right: 0}}>
                                    <Check
                                      size={14}
                                      onClick={() => handleCheckClickAccessCode(signersData[i].signer_id, i)}
                                    />
                                  </Badge>
                                )}
                                <Badge
                                  color="danger"
                                  pill
                                  style={{cursor: 'pointer', position: 'absolute', top: -10, left: 0}}>
                                  <X size={14} onClick={() => handleCloseClick(i)} />
                                </Badge>
                              </>
                            ) : (
                              <>
                                {signersData[i].access_code === null ||
                                signersData[i].access_code === undefined ||
                                signersData[i].access_code === '' ? (
                                  <Button
                                    color="success"
                                    className="text-nowrap px-1"
                                    outline
                                    onClick={() => {
                                      setInputValueAccessCode('');
                                      handleButtonClick();
                                      setActiveRow(i);
                                    }}>
                                    <Plus size={14} />
                                    <span>Add Access Code</span>
                                  </Button>
                                ) : (
                                  <Button
                                    color="success"
                                    className="text-nowrap px-1"
                                    outline
                                    onClick={() => {
                                      setInputValueAccessCode(signersData[i].access_code);
                                      handleButtonClick();
                                      setActiveRow(i);
                                    }}>
                                    <Plus size={14} />
                                    <span>Modify Access Code</span>
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
                }}
              </Repeater>
              {/* <Button className='btn-icon' color='primary' onClick={increaseCount}>
        <Plus size={14} />
        <span className='align-middle ms-25'>Add New</span>
      </Button> */}
            </Col>
          </Row>
        </>
        // <AccountDetails stepper={stepper} type='wizard-modern' />
      ),
    },
    {
      id: 'personal-info',
      title: 'Add Security Controls',
      subtitle: 'Enable Secure Share',
      icon: <User size={18} />,
      content: (
        <>
          <Row>
            <Col xs={12}>
              <h3 className="text-left mb-1">Add Controls</h3>
            </Col>
            <Col xs={12}>
              <div className="form-check">
                <Input
                  type="checkbox"
                  id="signerFunctionalControls"
                  checked={signerFunctionalControls}
                  // onClick={e => e.stopPropagation()}
                  onChange={e => {
                    setSignerFunctionalControls(e.target.checked);
                  }}
                />
                <span className="ms-50">Signer Functional Controls</span>
              </div>
              <div className="form-check">
                <Input
                  type="checkbox"
                  id="securedShare"
                  checked={securedShare}
                  onChange={e => {
                    setSecuredShare(e.target.checked);
                  }}
                  // onClick={e => e.stopPropagation()}
                  // onChange={e => {
                  //   e.stopPropagation()
                  //   dispatch(updateTask({ ...item, isCompleted: e.target.checked }))
                  // }}
                />
                <span className="ms-50">Secured Share</span>
              </div>
              <div className="form-check">
                <Input
                  type="checkbox"
                  id="EsignOrder"
                  checked={EsignOrder}
                  onChange={e => {
                    setSetEsignOrder(e.target.checked);
                  }}
                  // onClick={e => e.stopPropagation()}
                  // onChange={e => {
                  //   e.stopPropagation()
                  //   dispatch(updateTask({ ...item, isCompleted: e.target.checked }))
                  // }}
                />
                <span className="ms-50">Set e-signing order</span>
              </div>
            </Col>
            {securedShare ? (
              <>
                <Col xs={12} className="d-flex justify-content-between align-center " style={{marginTop: '10px'}}>
                  <h2 className="text-center mb-1 hw-bold">Signed Documents Receipients</h2>
                  <Button
                    size="sm"
                    className="btn-icon"
                    color="primary"
                    disabled={
                      RecipientsData.some(receipients => !receipients.name || !receipients.email) ||
                      inputErrorsRecipients.some(error => error)
                    }
                    onClick={increaseCountReceipient}>
                    <Plus size={14} />
                    <span className="align-middle ms-25"> Recipient</span>
                  </Button>
                </Col>
                <Col xs={12}>
                  {RecipientsData && RecipientsData.length > 0 ? (
                    <Repeater count={countReceipient}>
                      {i => {
                        const Tag = i === 0 ? 'div' : SlideDown;
                        return (
                          <Tag key={i}>
                            <Form>
                              <Row className="justify-content-between align-items-center">
                                <Col md={4} className="mb-md-0 mb-1">
                                  <Label className="form-label" for={`animation-item-name-${i}`}>
                                    Receipient Name
                                  </Label>
                                  <Input
                                    value={RecipientsData[i].name}
                                    onChange={event => handleInputChangeRecipients(i, event)}
                                    type="text"
                                    name="name"
                                    id={`animation-item-name-${i}`}
                                    placeholder="John "
                                  />
                                </Col>
                                <Col md={4} className="mb-md-0 mb-1">
                                  <Label className="form-label" for={`animation-cost-${i}`}>
                                    Receipient Email
                                  </Label>
                                  <Input
                                    value={RecipientsData[i].email}
                                    onChange={event => handleInputChangeRecipients(i, event)}
                                    name="email"
                                    type="email"
                                    id={`animation-cost-${i}`}
                                    placeholder="john@gmail.com"
                                  />
                                  {inputErrorsRecipients[i] && (
                                    <div style={{color: 'red'}}>{inputErrorsRecipients[i]}</div>
                                  )}{' '}
                                  {/* Add this line */}
                                </Col>
                                <Col md={4} className="mb-md-0 mt-2">
                                  <Button
                                    color="danger"
                                    className="text-nowrap px-1"
                                    onClick={deleteFormReceipient}
                                    outline>
                                    <Trash size={14} />
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
                  ) : (
                    <span>No Recipients Added</span>
                  )}
                  {/* <Button className='btn-icon' color='primary' onClick={increaseCount}>
          <Plus size={14} />
          <span className='align-middle ms-25'>Add New</span>
        </Button> */}
                </Col>
              </>
            ) : null}
            {EsignOrder ? (
              <Col className="text-center mt-1" xs={12}>
                {/* <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="signers">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {signersData.map((signer, index) => (
                        <Draggable key={index} draggableId={index} index={index}>
                          {(provided) => (<>

                            <div style={{ cursor: 'drag', marginBottom: '10px' }} className="d-flex justify-content-between align-center"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <List size={30} style={{ marginTop: '10px' }} />
                              <Input style={{ marginLeft: '10px', width: '56px' }} value={index} type='text' placeholder='Vuexy Admin ' />

                              <Input style={{ marginLeft: '10px' }} value={signer.name} type='text' placeholder='Vuexy Admin ' />

                            </div>
                          </>)}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext> */}
              </Col>
            ) : null}
          </Row>
        </>
      ),
    },
    {
      id: 'step-address',
      title: 'Email Content',
      subtitle: 'Enter Content You want to share with signer',
      icon: <MapPin size={18} />,
      content: (
        <>
          <Row>
            <Col xs={12}>
              <h3 className="text-left mb-1"> Email Content</h3>
            </Col>
            <Col xs={12}>
              <Label className="form-label">Email Subject</Label>
              <Input
                type="text"
                id={`email-subject`}
                value={emailSubject}
                onChange={e => {
                  setEmailSubject(e.target.value);
                }}
                placeholder="Enter subject here "
              />
              <Label className="form-label">Message</Label>
              <Input
                type="textarea"
                value={emailMessage}
                onChange={e => {
                  setEmailMessage(e.target.value);
                }}
                id={`message`}
                placeholder="Enter Message here "
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const [modalErrorWaitingSignersOther, setModalErrorWaitingSignersOther] = useState(false);
  const [accessCodeSigner, setAccessCodeSigner] = useState('');
  const [inputAccessCode, setInputAccessCode] = useState('');
  const [signerLoginId, setSignerLoginId] = useState(null);
  const [signerControlsOption, setSignerControlsOption] = useState(false);
  const [waitforOtherusers, setWaitforOtherusers] = useState(false);
  const [DocSignerStatus, setDocSignerStatus] = useState(false);
  const [DocSignerStatusModal, setDocSignerStatusModal] = useState(false);
  const [WaitOtherModal, setWaitOtherModal] = useState(false);
  const getUnhashedEmailFileId = async (emailHashed, fileId) => {
    //console.log('emailHashed', emailHashed);
    //console.log('fileId', fileId);
    const postData = {
      email: emailHashed,
      file_id: fileId,
    };
    try {
      const apiData = await post('file/received-doc-recipient', postData); // Specify the endpoint you want to call
      //console.log('Update File Controls ');
      //console.log(apiData);

      // if (apiData.accessCode === true || apiData.accessCode === "true") {
      //   setAccessCodeModal(true)
      //   setAccessCodeSigner(apiData.data.access_code)

      // } else {

      // }
      // if (apiData.fileDetails.signer_functional_controls === true || apiData.fileDetails.signer_functional_controls === "true") {
      //   setSignerControlsOption(true)
      // } else {
      //   setSignerControlsOption(false)
      // }
      // setSignerLoginId(apiData.data.signer_id)
      // //console.log(apiData.data.signer_id)
      setloaderRefresh(false);
      setActiveImage(apiData.bgImages[0].bgimgs_id);
      setActiveImageUrl(apiData.bgImages[0].image);
      setImageUrls(apiData.bgImages);
      setSignersData(apiData.all_signers);
      setSelectedSigner(apiData.all_signers[0]);
      setSavedCanvasData(apiData?.positions[0]?.position_array);
      // const email_signer_current = apiData?.data.email
      // let all_signers = apiData?.all_signers
      // //console.log(all_signers)
      // //console.log(email_signer_current)

      // // Find the order_id of the current user
      // const currentUser = all_signers.find(signer => signer.email === email_signer_current);
      // const currentUserOrderId = currentUser ? currentUser.order_id : null;
      // const statusSignerCompletedDoc = currentUser.completed_status
      // const eSignOrder = apiData.fileDetails.set_esigning_order

      // setDocSignerStatus(currentUser.completed_status)
      // if (currentUser.completed_status === true || currentUser.completed_status === "true") {
      //   setDocSignerStatusModal(true)
      // } else {
      //   if (eSignOrder === true || eSignOrder === "true") {
      //     if (currentUserOrderId === null) {
      //       //console.log('Current user not found in signers');
      //     } else {

      //       // Check if all users with a lower order_id have status true
      //       // Sort the orders by order_id
      //       all_signers.sort((a, b) => parseInt(a.order_id) - parseInt(b.order_id));
      //       // Find the first order with completed_status null
      //       let lowestOrderWithNullStatus = all_signers.find(order => order.completed_status === null);

      //       if (lowestOrderWithNullStatus) {
      //         //console.log("Lowest order id with null completed status:", lowestOrderWithNullStatus.order_id);
      //         if (lowestOrderWithNullStatus.order_id === currentUserOrderId) {
      //           //console.log('You can sign');
      //           setWaitforOtherusers(false)
      //         } else {
      //           //console.log('Wait for other users to sign');
      //           setWaitforOtherusers(true)
      //           setWaitOtherModal(true)
      //         }
      //       } else {
      //         //console.log("No order with null completed status found.");
      //       }
      //       // const canSign = all_signers.every(signer => parseInt(signer.order_id) <= parseInt(currentUserOrderId) && statusSignerCompletedDoc === true);

      //       // if (canSign) {
      //       //   //console.log('You can sign');
      //       //   setWaitforOtherusers(false)
      //       // } else {
      //       //   //console.log('Wait for other users to sign');
      //       //   setWaitforOtherusers(true)
      //       // }
      //     }
      //   } else {

      //   }

      // }

      // if (apiData.error) {
      //   toastAlert("error", apiData.message)
      //   // setFileName("")
      //   // setInputValue("")
      //   setLoadingSendDocument(false)
      // } else {
      //   // //console.log(apiData.result)
      //   toastAlert("succes", apiData.message)
      //   // setFileName(apiData.data.name)
      //   // setInputValue(apiData.data.name)
      setLoadingSendDocument(false);
      //   setSendToEsign(false)

      // }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const [locationIP, setLocationIP] = useState('');
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  useEffect(() => {
    getLocatinIPn();
    //console.log(file_id);
    getUnhashedEmailFileId(emailHashed, file_id);
  }, []);

  return (
    <>
      {loaderRefresh ? (
        <Row>
          <Col
            md={12}
            xs={12}
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3%', height: '90vh'}}>
            <Spinner style={{width: '3rem', height: '3rem', color: 'grey'}} />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xl={12} md={12} sm={12}>
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBlock: '1%'}}>
              <img
                src={logoRemoveBg}
                style={{
                  width: '200px',
                  height: 'auto',
                }}
              />
              {signerControlsOption ? (
                <>
                  {/* <div style={{ position: 'absolute', top: 20, left: "15%", width: '100px', height: 'auto' }}>
                <Nav tabs >
                  <NavItem>
                    <NavLink
                      active={active === '1'}
                      onClick={() => {
                        toggle('1')
                      }}
                    >
                      <h3 className='align-middle'>  For You</h3>

                    </NavLink>
                  </NavItem>
                  
                </Nav>
              </div> */}
                  {/* Signer  */}

                  <div>
                    <TabContent className="py-50" activeTab={active}>
                      <TabPane tabId="1">
                        <ForYou type={getTypeListItem} />
                      </TabPane>
                      <TabPane tabId="2">
                        <ForOthers type={getTypeListItem} />
                      </TabPane>
                    </TabContent>
                  </div>
                </>
              ) : null}
              <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <h3 className="fw-bold" style={{marginTop: '1%'}}>
                    Signer :
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
                              border: selectedSigner === item ? '2px solid black' : 'none',

                              width: '30px',
                              height: '30px',
                            }}>
                            {item.completed_status === 'true' || item.completed_status === true ? (
                              <Check size={20} color="white" />
                            ) : null}
                          </div>
                          <span style={{marginLeft: '10px', fontSize: '16px'}}>{item.name}</span>
                        </div>
                      </>
                    ))}
                </div>
                {/* {waitforOtherusers ? null :
                  <Button style={{ height: '40px', marginLeft: '10px', boxShadow: 'none' }}
                    className='btn-icon'
                    color='primary'
                    onClick={() => {
                      setMarkAsCompleted(true)
                    }}>
                    <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Mark as Completed</span>
                  </Button>} */}
                {/* xdfdfdf
                <Button style={{ height: '40px', marginLeft: '10px',boxShadow:'none' }}
                  className='btn-icon'
                  color='primary'
                  onClick={() => {
                    setMarkAsCompleted(true)
                  }}>
                  <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Mark as Completed</span>
                </Button> */}
              </div>
            </div>

            {/* <div style={{ position: 'absolute', top: 20, left: "65%" }}>
            <ButtonDropdown
              size="sm"
              isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color='primary' caret>
                {selectedSigner === null || selectedSigner === undefined || selectedSigner === "" ||
                  selectedSigner.length === 0
                  ? <span style={{ fontSize: '16px' }} >
                    Select Signer
                  </span> : selectedSigner.name}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/' tag='a' onClick={e => {
                  e.preventDefault()
                  setCount(signersData.length)
                  setSignerAddEdit(true)


                }}>
                  <h3>Add Signer
                  </h3>
                </DropdownItem>
                {signersData && signersData.map((item, index) => (
                  <DropdownItem href='/' tag='a' onClick={e => {
                    e.preventDefault()
                    //console.log(item)
                    setSelectedSigner(item)
                  }}>
                    <div style={{ display: 'flex' }}>


                      <div style={{ backgroundColor: `${item.color}`, width: '20px', height: '20px' }}></div>
                      <span style={{ marginLeft: '20px', fontSize: '16px' }}>
                        {item.name}
                      </span>  </div>
                  </DropdownItem>
                ))}



              </DropdownMenu>
            </ButtonDropdown>
          </div> */}
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
          <Col xs={1}></Col>
          <Col
            xs={9}
            style={{
              cursor: type === 'my_text' ? 'text' : type ? 'crosshair' : 'default',
            }}>
            <div style={{maxHeight: '100%', display: 'flex', flexDirection: 'column'}}>
              {/* {imageUrls.map((imageUrl, index) => ( */}
              <>
                <img
                  // key={index}
                  // ref={(el) => imageRefs.current[index] = el}
                  src={`${BASE_URL}${activeImageUrl}`}
                  onClick={() => {
                    // //console.log(imageUrl.bgimgs_id)
                    handleThumbnailClick(event, activeImage);
                  }}
                  // style={{
                  //    border: activeImage === imageUrl.bgimgs_id ?  '2px solid gray' : 'none' }}
                />
                {/* <span className="p-2">Page No {index}</span> */}
                {/* {savedCanvasData.filter(position => position.bgImg === imageUrl.bgimgs_id).map((position, positionIndex) => { */}

                {savedCanvasData.map((position, index) => {
                  if (position.type === 'my_text') {
                    return (
                      <Draggable disabled key={index} defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                          }}>
                          <input
                            value={position.text}
                            disabled
                            style={{
                              fontSize: position.fontSize,
                              fontStyle: position.fontStyle,
                              fontWeight: position.fontWeight,
                              color: position.color,
                              backgroundColor: signerControlsOption ? position.backgroundColor : 'transparent',
                              border: 'none',
                              fontFamily: position.fontFamily,
                              width: `${position.text.length}ch`,
                            }}
                          />

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
                        defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                          }}>
                          {/* <div className="drag-handle" style={{ cursor: 'move'}}>
                              <Maximize size={15}/>
                              </div> */}
                          <img
                            // className="drag-handle"
                            // onClick={() => setEdit(!edit)}
                            alt="Remy Sharp"
                            onClick={signerControlsOption ? () => handleTextClick(index, 'my_signature') : null}
                            variant="square"
                            src={`${BASE_URL}${position.url}`}
                            style={{
                              width: `${position.width}px`,
                              height: `${position.height}px`,
                              // border: '1px solid lightGray',
                            }}
                          />
                        </div>
                      </Draggable>
                    );
                  } else if (position.type === 'date') {
                    return (
                      <Draggable disabled key={index} defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                          }}
                          // onClick={() => handleTextClick(index, "date")}
                        >
                          <div style={{display: 'flex'}}>
                            <span
                              style={{
                                // height: '40px',
                                fontSize: position.fontSize,
                                // backgroundColor: `transparent`
                              }}>
                              {formatDate(position.text, locationIP)}
                            </span>

                            {/* <Flatpickr
                              className='form-control'
                              value={position.text}
                              onChange={date => {
                                // const newSavedCanvasData = [...savedCanvasData];
                                // newSavedCanvasData[index].text = date;
                                // setSavedCanvasData(newSavedCanvasData);

                              }}
                              options={{
                                altInput: true,
                                altFormat: 'd/m/Y', // Day of the month, month, year
                                dateFormat: 'd/m/Y'
                              }}

                              id='default-picker' /> */}
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
                        // onStop={(e, data) => handleTextDrag(e, data, index)}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            display: `${position.bgImg === activeImage ? 'block' : 'none'}`,
                          }}
                          // onClick={() => handleTextClick(index, "date")}
                        >
                          <div style={{display: 'flex'}}>
                            <Input type="checkbox" checked={position.text} id="basic-cb-checked" />
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
                        // onStop={(e, data) => handleTextDrag(e, data, index)}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
                                ? 'block'
                                : 'none'
                            }`,
                          }}
                          // onClick={() => handleTextClick(index, "signer_text")}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}>
                            {/* <h3>{position.placeholder}</h3> */}
                            <h3
                              style={{
                                fontSize: position.fontSize,
                                fontStyle: position.fontStyle,
                                fontWeight: position.fontWeight,
                                color: position.color,
                                // backgroundColor: position.required ? "#83deff" : '#dbf1f9',

                                fontFamily: position.fontFamily,
                              }}>
                              {position.text}
                            </h3>
                            {/* <input

                              value={position.text}
                              onChange={(e) => handleInputChanged(e, index)}
                              style={{
                                fontSize: position.fontSize,
                                fontStyle: position.fontStyle,
                                fontWeight: position.fontWeight,
                                color: position.color,
                                // backgroundColor: position.required ? "#83deff" : '#dbf1f9',

                                fontFamily: position.fontFamily,
                                minWidth: '200px',
                                width: `${position.text.length}ch`
                              }}
                            /> */}
                          </div>
                        </div>
                      </Draggable>
                    );
                  } else if (position.type === 'signer_date') {
                    return (
                      <Draggable disabled key={index} defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
                                ? 'block'
                                : 'none'
                            }`,
                          }}>
                          <div style={{display: 'flex'}}>
                            <span
                              style={{
                                // height: '40px',
                                fontSize: position.fontSize,
                                // backgroundColor: `transparent`
                              }}>
                              {formatDate(position.text, locationIP)}
                            </span>
                            {/* <input
                              type="date"
                              className='form-control'
                              style={{
                                height: '40px',
                                fontSize: position.fontSize,
                                // backgroundColor: `transparent`
                              }}
                              value={position.text}
                            
                              id='default-picker'
                            /> */}
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
                        defaultPosition={{x: position.x, y: position.y}}>
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
                              height: `${position.height}px`,
                              // border: '1px solid lightGray',
                            }}
                          />
                        </div>
                      </Draggable>
                    );
                  } else if (position.type === 'signer_chooseImgDrivingL') {
                    return (
                      <Draggable
                        disabled
                        handle=".drag-handle" // Add this line
                        key={index}
                        defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
                                ? 'block'
                                : 'none'
                            }`,
                          }}
                          // onClick={() => handleTextClick(index)}
                        >
                          {/* <ResizableBox
                            width={position.width}
                            height={position.height}
                           
                          > */}

                          {position.url === null || position.url === undefined ? (
                            <div
                              style={{
                                width: `${position.width}px`,
                                height: `${position.height}px`,
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
                                border: `2px solid #dbf1f9`,
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
                  } else if (position.type === 'signer_chooseImgPassportPhoto') {
                    return (
                      <Draggable
                        disabled
                        handle=".drag-handle" // Add this line
                        key={index}
                        defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
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
                              style={{
                                backgroundColor: '#dbf1f9',
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
                                width: `${position.width}px`,
                                height: `${position.height}px`,
                                border: `2px solid #dbf1f9`,
                              }}
                            />
                          )}
                        </div>
                      </Draggable>
                    );
                  } else if (position.type === 'signer_chooseImgStamp') {
                    return (
                      <Draggable
                        disabled
                        handle=".drag-handle" // Add this line
                        key={index}
                        defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
                                ? 'block'
                                : 'none'
                            }`,
                          }}
                          // onClick={() => handleTextClick(index)}
                        >
                          {position.url === null || position.url === undefined ? (
                            <div
                              style={{
                                backgroundColor: '#dbf1f9',
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
                              alt="Remy Sharp"
                              variant="square"
                              src={`${BASE_URL}${position.url}`}
                              style={{
                                filter: 'grayscale(100%)',
                                width: `${position.width}px`,
                                height: `${position.height}px`,
                                border: `2px solid #dbf1f9`,
                                // border: '1px solid lightGray',
                              }}
                            />
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
                        defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
                                ? 'block'
                                : 'none'
                            }`,
                          }}
                          // onClick={() => handleTextClick(index)}
                        >
                          {position.url === null || position.url === undefined ? (
                            <div
                              style={{
                                backgroundColor: '#dbf1f9',
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
                              alt="Remy Sharp"
                              // onClick={() => handleTextClick(index, "my_signature")}
                              variant="square"
                              src={`${BASE_URL}${position.url}`}
                              style={{
                                width: `${position.width}px`,
                                height: `${position.height}px`,
                                // border: '1px solid lightGray',
                              }}
                            />
                          )}
                        </div>
                      </Draggable>
                    );
                  } else if (position.type === 'signer_checkmark') {
                    return (
                      <Draggable disabled key={index} defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            // && position.signer_id === position.signer_id
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
                                ? 'block'
                                : 'none'
                            }`,
                          }}
                          // onClick={() => handleTextClick(index, "date")}
                        >
                          <div
                            style={{
                              display: 'flex',
                              padding: '10px',
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: `transparent`,
                            }}>
                            <Input type="checkbox" checked={position.text} id="basic-cb-checked" />
                          </div>
                        </div>
                      </Draggable>
                    );
                  } else if (position.type === 'signer_radio') {
                    return (
                      <Draggable disabled key={index} defaultPosition={{x: position.x, y: position.y}}>
                        <div
                          style={{
                            position: 'absolute',
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
                                ? 'block'
                                : 'none'
                            }`,
                          }}
                          // onClick={() => handleTextClick(index, "date")}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: `${position.direction}`,
                              padding: '10px',
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: `transparent`,
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
                                    style={{
                                      marginLeft: '10px',
                                      backgroundColor: '#dbf1f9',
                                    }}
                                  />
                                  <h3 style={{marginLeft: '10px'}} htmlFor={option}>
                                    {option}
                                  </h3>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </Draggable>
                    );
                  } else if (position.type === 'signer_dropdown') {
                    return (
                      <Draggable
                        disabled
                        key={index}
                        defaultPosition={{x: position.x, y: position.y}}
                        // onStop={(e, data) => handleTextDrag(e, data, index)}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            display: `${
                              position.bgImg === activeImage && position.signer_id === selectedSigner.signer_id
                                ? 'block'
                                : 'none'
                            }`,
                          }}
                          // onClick={() => handleTextClick(index, "signer_dropdown")}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: `${position.direction}`,
                              padding: '10px',
                              justifyContent: 'left',
                              alignItems: 'center',
                              backgroundColor: `transparent`,
                            }}>
                            <h2>{position?.options?.question}</h2>
                            <select
                              value={position.text}
                              // onChange={(event) => handleSelectOptionOptionOther(event.target.value, index)}
                              style={{
                                marginLeft: '10px',
                                fontSize: '16px',
                                backgroundColor: '#dbf1f9',
                                padding: '15px',
                                color: 'white',
                                borderRadius: '5px',
                                border: 'none',
                              }}>
                              <option
                                style={{padding: '15px', backgroundColor: 'white', color: 'black', fontSize: '16px'}}
                                value="">
                                Select Option
                              </option>
                              {position?.options?.options?.map((option, index) => (
                                <option
                                  style={{padding: '15px', backgroundColor: 'white', color: 'black', fontSize: '16px'}}
                                  value={option}
                                  key={index}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </Draggable>
                    );
                  } else if (position.type === 'highlight') {
                    return (
                      <Draggable
                        disabled
                        handle=".drag-handle" // Add this line
                        key={index}
                        defaultPosition={{x: position.x, y: position.y}}>
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
                          <div
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
          <Col xs={2} style={{maxHeight: '90vh', overflowY: 'auto'}}>
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
      )}
    </>
  );
};

export default ReceivedEsignDoc;
