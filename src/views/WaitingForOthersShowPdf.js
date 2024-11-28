import React, {useState, useRef, useEffect} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
// import {PDFDocument, rgb} from 'pdf-lib';
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
  FormFeedback,
} from 'reactstrap';
import {
  ArrowLeft,
  Check,
  Clock,
  Edit2,
  Image,
  Lock,
  Menu,
  MoreVertical,
  Plus,
  Trash2,
  Unlock,
  Users,
  X,
} from 'react-feather';
import logoRemoveBg from '@src/assets/images/pages/halfLogo.png';
// import ForYou from '../components/ForYou';
// import ForOthers from '../components/ForOthers';
import {handlePlacePosition} from '../utility/EditorUtils/PlacePositions';
import toastAlert from '@components/toastAlert';
import Repeater from '@components/repeater';
import {SlideDown} from 'react-slidedown';
import {formatDateTime, getColorByIndex} from '../utility/Utils';
import 'react-resizable/css/styles.css';
import SignatureModalContent from '../utility/EditorUtils/ElectronicSignature.js/SignatureModalContent';
import emptyImage from '@assets/images/pages/empty.png';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import ModalConfirmationAlert from '../components/ModalConfirmationAlert';
import {BASE_URL, post, postFormData} from '../apis/api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const WaitingForOthersShowPdf = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  // states

  const [imageUrls, setImageUrls] = useState([]);
  const file_id = window.location.pathname.split('/')[2];
  const [savedCanvasData, setSavedCanvasData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
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
  const [signerFunctionalControls, setSignerFunctionalControls] = useState(false);
  const [securedShare, setSecuredShare] = useState(false);
  const [EsignOrder, setSetEsignOrder] = useState(false);
  const [RecipientsData, setRecipientsData] = useState([]);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [inputValue, setInputValue] = useState(null);
  const [signersData, setSignersData] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [stepper, setStepper] = useState(null);
  const [inputValueAccessCode, setInputValueAccessCode] = useState('');
  const [inputErrors, setInputErrors] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSignersSave, setLoadingSignersSave] = useState(false);
  const [countReceipient, setCountReceipient] = useState(0);
  const [loadingSendDocument, setLoadingSendDocument] = useState(false);
  const [fileName, setFileName] = useState('');
  const [statusFile, setStatusFile] = useState('');
  const [SignatureModal, setSignatureModal] = useState(false);
  const [SignatureModalUpdate, setSignatureModalUpdate] = useState(false);
  const [onlySigner, setOnlySigner] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const elementRefCursor = useRef(null);
  const [activePage, setActivePage] = useState(1);
  const [resizingIndex, setResizingIndex] = useState(null);
  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  const [appendEnable, setAppendEnable] = useState(false);

  const handlePageClick = page => {
    // setIsLoadingDoc(true);
    // setTimeout(() => {
    setPageNumber(page);
    const fullPageElement = document.getElementById(`full-page-${page}`);

    // Scroll the full-page view to the clicked page
    if (fullPageElement) {
      fullPageElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };
  // Define the dropdownOpen state

  const [modalOpenDropdown, setModalOpenDropdown] = useState(false);
  // start

  const fetchData = async fileId => {
    // get Images from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post('file/getbgImagesByFileId', postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
    if (apiData.error) {
    } else {
      setImageUrls(apiData.result[0].image);
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
    } else {
      //console.log('positions');
      //console.log(apiData.result);

      setTextItems(apiData.result[0].position_array);
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
    const color_code = getColorByIndex(count);
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
    if (apiData.path === null || apiData.path === undefined || apiData.path === '') {
    } else {
      //console.log('result');
      //console.log(apiData.path);

      const url = apiData.path;
      //console.log(arrayObj);
      //console.log(activePage);
      let resultingData = handlePlacePosition(arrayObj, type, activePage, url);
      //console.log(resultingData);
      setTextItems([...textItems, resultingData]);
      setResizingIndex(textItems.length);
      setIsResizing(true);
      setType('');
    }
  };

  const placeImage = async (url, prevSign, typeSign) => {
    //console.log(url);
    //console.log(prevSign);
    //console.log(typeSign);

    if (prevSign === 'prevSign') {
      setSignatureModal(false);
      //console.log('url');
      //console.log(url);
      let resultingData = handlePlacePosition(eventDataOnClick, type, activePage, url, 'image');
      //console.log(resultingData);
      setResizingIndex(textItems.length);
      setIsResizing(true);
      setEditedItem(resultingData);

      setTextItems([...textItems, resultingData]);
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
        setIsEditingSignature(true);
        //console.log(activePage);
        let resultingData = handlePlacePosition(eventDataOnClick, type, activePage, url, typeSign);
        //console.log(resultingData);
        setResizingIndex(textItems.length);
        setIsResizing(true);
        setEditedItem(resultingData);
        setTextItems([...textItems, resultingData]);
        setType('');
      }

      // end Call
    }
  };
  const [UpdatedSignatureIndex, setUpdatedSignatureIndex] = useState('');
  const placeImageUpdate = async (url, prevSign, typeSign) => {
    //console.log(url);
    //console.log(prevSign);
    //console.log(typeSign);

    if (prevSign === 'prevSign') {
      setSignatureModalUpdate(false);
      //console.log('url');
      //console.log(url);
      setResizingIndex(UpdatedSignatureIndex);
      setIsResizing(true);
      setEditedItem(textItems[UpdatedSignatureIndex]);
      const newSavedCanvasData = [...textItems];
      newSavedCanvasData[UpdatedSignatureIndex].url = url;
      setTextItems(newSavedCanvasData);
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
        setType('');
      }
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
      const apiData = await post('file/saveCanvasDataWithFile_Id', postData); // Specify the endpoint you want to call
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
    }
  };

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const getTypeListItem = type => {
    setAppendEnable(true);
    saveData();
    //console.log('Type');
    //console.log(type);
    if (type === 'signer') {
      setSignerAddEdit(true);
    } else {
      setType(type);
      setIsEditing(true);
      setEditingIndex(savedCanvasData.length);
      //console.log(savedCanvasData.length);
    }
  };
  const handleDeleteCurrentPosition = id => {
    setDeleteIndex(id);
    setItemDeleteConfirmation(true);
  };
  const DeleteItemFromCanvas = () => {
    setloadingDelete(true);

    const updatedItems = textItems.filter(item => item.id !== deleteIndex);
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
      const apiData = await post('file/getAllSignersByFileId', postData); // Specify the endpoint you want to call
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
      const apiData = await post('file/update-signer', postData); // Specify the endpoint you want to call
      //console.log('Update Access code ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert('error', apiData.message);
      } else {
        toastAlert('succes', apiData.message);
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
      const apiData = await post('file/update-signer', postData); // Specify the endpoint you want to call
      //console.log('Update Access code ');

      //console.log(apiData);
      if (apiData.error) {
        toastAlert('error', apiData.message);
      } else {
        toastAlert('succes', apiData.message);
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
        //console.log('Recipients Error');
      } else {
        //console.log('Recipients Success');
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

        setLoadingSendDocument(false);
      } else {
        toastAlert('succes', apiData.message);

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
  const [UniqIdDoc, setUniqIdDoc] = useState('');
  const [User_id_created, setUser_id_created] = useState('');
  const [created_at_doc, setCreated_at_doc] = useState('');

  const fetchFileData = async fileId => {
    // get Images from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post('file/get-file', postData); // Specify the endpoint you want to call
    //console.log('File Dta Fetch');

    //console.log(apiData);
    if (apiData.error) {
    } else {
      setFileName(apiData.data.name || '');

      // end
      setInputValue(apiData.data.name || '');
      //console.log('dfdf');
      setUniqIdDoc(apiData.data.uniq_id);
      setUser_id_created(apiData.data.user_id);
      setCreated_at_doc(apiData.data.created_at);
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
        <MoreVertical size={25} id="DragItem" />
      </>
    );
  });

  const SortableItem = SortableElement(({value, i}) => {
    const Tag = i === 0 ? 'div' : SlideDown;
    return (
      <Tag key={i} style={{zIndex: 9999}}>
        <Form>
          <Row style={{position: 'relative'}} className="d-flex justify-content-between align-items-center">
            {EsignOrder ? (
              <Col
                md={1}
                className="mb-md-0 mb-1 d-flex justify-content-center align-items-center"
                style={{cursor: 'pointer'}}>
                <DragHandle />
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
                        marginTop: '5px',
                      }}
                      type="text"
                      maxLength={6} // Maximum 6 characters allowed
                      value={inputValueAccessCode}
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
                </>
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
  const SortableItem1 = SortableElement(({value, i}) => {
    const Tag = i === 0 ? 'div' : SlideDown;
    return (
      <Tag key={i} style={{zIndex: 9999}}>
        <Form>
          <Row style={{position: 'relative'}} className="d-flex justify-content-between align-items-center">
            {EsignOrder ? (
              <Col
                md={2}
                className="mb-md-0 mb-1 d-flex justify-content-center align-items-center"
                style={{cursor: 'pointer'}}>
                <DragHandle1 />
                <h4>{signersData[i].order_id}</h4>
              </Col>
            ) : null}
            <Col
              md={10}
              className="mb-md-0 mb-1"
              style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div
                style={{
                  backgroundColor: `${signersData[i].color}`,
                  marginRight: '10px',
                  width: '20px',
                  height: '20px',
                }}></div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <h5 style={{fontSize: '13px'}} className="form-label" for={`animation-item-name-${i}`}>
                  {signersData[i].name}
                </h5>
                <h5 style={{fontSize: '12px'}} className="form-label" for={`animation-cost-${i}`}>
                  {signersData[i].email}
                </h5>{' '}
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
  const SortableList = SortableContainer(({items}) => {
    return (
      <Repeater count={items.length}>
        {i => <SortableItem key={`item-${items[i].order_id}`} index={i} value={items[i]} i={i} />}
      </Repeater>
    );
  });
  const SortableList1 = SortableContainer(({items}) => {
    return (
      <Repeater count={items.length}>
        {i => <SortableItem1 key={`item-${items[i].order_id}`} index={i} value={items[i]} i={i} />}
      </Repeater>
    );
  });
  const [isOpenCanvas, setIsOpenCanvas] = useState(false);
  const [isOpenCanvasPages, setIsOpenCanvasPages] = useState(false);

  // end
  const canvasRef = useRef();

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
    fetchData(file_id);
    fetchFileData(file_id);
    fetchDataPositions(file_id), fetchSignerData(file_id), fetchRecipientsData(file_id);
  }, []);

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages);
  };

  const handleDownloadPDF = async () => {
    const response = await fetch(`${BASE_URL}${imageUrls}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [resizing, setResizing] = useState(false);
  const handleDoubleClick = (index, item) => {
    setResizingIndex(index);
    setEditedItem(item);
    setIsResizing(true);
    //console.log('double click ');
  };

  const [editedItem, setEditedItem] = useState();

  return (
    <>
      <Row>
        <Col
          xl={12}
          md={12}
          sm={12}
          style={{
            width: '100%',
            zIndex: 999,
            borderBottom: '1px solid #ececec',
            background: 'white',
          }}>
          <Row>
            <Col
              xl={12}
              md={12}
              sm={12}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBlock: '0.2%',
                paddingInline: '2%',
              }}>
              {/* back button
               */}
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {window.innerWidth < 380 ? (
                  <Menu
                    size={20}
                    style={{marginRight: '20px'}}
                    onClick={() => {
                      setIsOpenCanvas(true);
                    }}
                  />
                ) : null}
                <Button
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
                  {/* <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Back</span> */}
                </Button>
                <img
                  src={logoRemoveBg}
                  style={{
                    width: '45px',
                    height: 'auto',
                    marginLeft: '20px',
                    marginRight: '20px',
                  }}
                />
                <h2 className="fw-bold" style={{marginLeft: '10px', marginTop: '5px'}}>
                  {fileName}.pdf
                </h2>
              </div>
              <div>{saveLoading ? <h4>Saving ...</h4> : null}</div>
              <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
                <Button
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
                  {/* leeter spacing 1 */}
                  <span style={{fontSize: '16px', letterSpacing: '.5px'}} className="align-middle ms-25">
                    Download Original
                  </span>
                </Button>
                {/* REMOVE REMOVE REMOVE  */}
                <Button
                  disabled={saveLoading}
                  color={saveSuccess ? 'success' : 'primary'}
                  onClick={() => saveData()}
                  style={{
                    marginRight: '10px',
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
                {/* REMOVE REMOVE REMOVE  */}
                {statusFile === 'InProgress' ? (
                  <>
                    <Button
                      disabled={saveLoading}
                      color={saveSuccess ? 'success' : 'primary'}
                      onClick={() => saveData()}
                      style={{
                        marginRight: '10px',
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
                            } else {
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
                )}
                {window.innerWidth < 380 ? (
                  <Image
                    style={{marginLeft: '20px'}}
                    size={20}
                    onClick={() => {
                      setIsOpenCanvasPages(true);
                    }}
                  />
                ) : null}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col
              xs={10}
              style={{
                paddingLeft: '100px',
                paddingTop: '20px',
                border: '1px solid lightGrey',
              }}>
              {/* editor  */}
              {isLoadingDoc && ( // Conditionally render spinner if isLoading is true
                <div style={{display: 'flex', justifyContent: 'right'}}>
                  {/* Render your spinner component */}
                  <Spinner />
                </div>
              )}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 className="fw-bold">Doc Id : {UniqIdDoc}</h3>
                {/* <button onClick={()=>window.location.href=`file/${file_id}`}>View Completed Document</button> */}
                <Button
                  size="sm"
                  style={{boxShadow: 'none', fontSize: '15px'}}
                  color="primary"
                  onClick={() => (window.location.href = `file/${file_id}`)}
                  className="text-nowrap px-1">
                  View
                </Button>
              </div>
              {/* <h3>From Rimsha Riaz</h3> */}
              <h3>Sent on {formatDateTime(created_at_doc, locationIP)}</h3>
              <h3>
                {/* {statusFile==="InProgress"?<>
              <Clock size={15}/>
              <span>In Progress</span>
              </>:null} */}
                {statusFile === 'WaitingForOthers' ? (
                  <>
                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                      <Clock size={15} />
                      <span style={{marginLeft: '5px'}}>Waiting for others</span>
                    </div>
                  </>
                ) : null}
                {/* {statusFile==="WaitingForOthers"?<>
              <Users size={15}/>
              <span>Waiting for me</span>
              </>:null} */}
              </h3>
              <div style={{borderBottom: '1px solid lightGrey'}}></div>
              <h2 className="fw-bold" style={{marginBlock: '2%'}}>
                Signers
              </h2>
              {signersData.length === 0 ? null : (
                <>
                  {signersData.map((signer, index) => (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid LightGrey',
                        paddingBlock: '10px',
                      }}>
                      <div>
                        <h3 className="fw-bold">{signer.name}</h3>
                        <h3>{signer.email}</h3>
                      </div>
                      <div>
                        <h3>
                          {signer.completed_status === null || signer.completed_status === undefined
                            ? 'Needs to sign'
                            : 'Completed'}
                        </h3>
                        <h3>Viewed on date |time</h3>
                      </div>
                    </div>
                  ))}{' '}
                </>
              )}

              {RecipientsData.length === 0 ? null : (
                <>
                  <h2 className="fw-bold" style={{marginBlock: '2%'}}>
                    Recipient
                  </h2>
                  {RecipientsData.map((signer, index) => (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid LightGrey',
                        paddingBlock: '10px',
                      }}>
                      <div>
                        <h3 className="fw-bold">{signer.name}</h3>
                        <h3>{signer.email}</h3>
                      </div>
                    </div>
                  ))}{' '}
                </>
              )}
              <h2 className="fw-bold" style={{marginBlock: '2%'}}>
                Message
              </h2>
              <h3 style={{marginBlock: '2%'}}>{emailMessage}</h3>
            </Col>
            <Col
              xs={2}
              style={{
                position: 'relative',
                backgroundColor: 'white',
                border: '1px solid lightGrey',
                maxHeight: '80vh',
                overflow: 'auto',
              }}>
              {/* Pages  */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '25px'}}>
                  <Document
                    file={`${BASE_URL}${imageUrls}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    noData="No PDF loaded">
                    {Array.from({length: numPages}, (_, i) => i + 1).map(page => (
                      <>
                        <div
                          id={`full-page-${page}`}
                          key={page}
                          style={{
                            border: activePage === page ? '2px solid #23b3e8' : '2px solid lightGrey',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            if (activePage !== page) {
                              e.target.style.border = '2px solid #c4c4c4';
                              e.target.style.borderRadius = '10px';
                            }
                          }}
                          onMouseLeave={e => {
                            if (activePage !== page) {
                              e.target.style.border = '2px solid white';
                            }
                          }}
                          onClick={() => handlePageClick(page)}>
                          <Page
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            key={page}
                            pageNumber={page}
                            width={150}
                            className={activePage === page ? 'active-page' : ''}></Page>
                        </div>
                        <h6 style={{marginBlock: '10px', textAlign: 'center'}}> Page {page}</h6>{' '}
                      </>
                    ))}
                  </Document>
                </div>
              </div>

              {/* </>
              )} */}
            </Col>
          </Row>
        </Col>
      </Row>
      {/* signature modal  */}
      <Modal
        isOpen={SignatureModal}
        toggle={() => setSignatureModal(!SignatureModal)}
        className="modal-dialog-centered modal-lg">
        <ModalBody className=" pb-5">
          <SignatureModalContent
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
        className="modal-dialog-centered modal-lg">
        <ModalBody className=" pb-5">
          <SignatureModalContent
            modalClose={() => {
              setSignatureModalUpdate(!SignatureModalUpdate);
            }}
            returnedSignature={placeImageUpdate}
            file_id={file_id}
          />
        </ModalBody>
      </Modal>
      {/* signer add/edit  */}
      <Modal
        isOpen={signerAddEdit}
        toggle={() => setSignerAddEdit(!signerAddEdit)}
        className="modal-dialog-centered modal-lg">
        <ModalBody className="pb-2">
          <Row tag="form" className="gy-1 gx-2 p-2">
            <Col xs={12} className="d-flex justify-content-between">
              <h1 className="text-center  fw-bold">Add/ Edit Signers</h1>

              {count === 8 ? (
                <></>
              ) : (
                <Button
                  size="sm"
                  style={{
                    boxShadow: 'none',
                  }}
                  className="btn-icon"
                  color="primary"
                  onClick={increaseCount}
                  disabled={
                    signersData.some(signer => !signer.name || !signer.email) || inputErrors.some(error => error)
                  }>
                  <Plus size={14} />
                  <span style={{fontSize: '16px'}} className="align-middle ms-25">
                    Signer
                  </span>
                </Button>
              )}
            </Col>
            <Col xs={12} className="d-flex justify-content-between">
              <h3>Maximum 8 signers can be added</h3>
            </Col>

            <Col xs={12}>
              {signersData.length === 0 ? (
                <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                  <Col md="12" xs="12" className="d-flex justify-content-center align-items-center">
                    <img src={emptyImage} alt="empty" style={{width: '150px', height: 'auto'}} />
                    <h3>No Signer Exist</h3>
                  </Col>
                </Row>
              ) : (
                <Repeater count={count}>
                  {i => {
                    const Tag = i === 0 ? 'div' : SlideDown;
                    return (
                      <Tag key={i}>
                        <Form>
                          <Row className="justify-content-between align-items-center">
                            <Col md={1} className="mb-md-0 mb-1">
                              <div
                                style={{
                                  backgroundColor: `${signersData[i].color}`,
                                  marginTop: '25px',
                                  marginRight: '10px',
                                  width: '30px',
                                  height: '30px',
                                }}></div>
                            </Col>
                            <Col md={4} className="mb-md-0 mb-1">
                              <h3 className="form-label" for={`animation-item-name-${i}`}>
                                Signer Name
                              </h3>
                              <Input
                                style={{fontSize: '16px', boxShadow: 'none'}}
                                name="name"
                                type="text"
                                id={`animation-item-name-${i}`}
                                value={signersData[i].name}
                                onChange={event => handleInputChange(i, event)}
                                placeholder="Signer "
                              />
                            </Col>
                            <Col md={5} className="mb-md-0 mb-1">
                              <h3 className="form-label" for={`animation-cost-${i}`}>
                                Email
                              </h3>
                              <Input
                                style={{fontSize: '16px', boxShadow: 'none'}}
                                name="email"
                                value={signersData[i].email}
                                onChange={event => handleInputChange(i, event)}
                                type="email"
                                id={`animation-cost-${i}`}
                                placeholder="signer@gmail.com"
                              />
                              {inputErrors[i] && <div style={{color: 'red', fontSize: '14px'}}>{inputErrors[i]}</div>}{' '}
                            </Col>

                            <Col md={2} className="mb-md-0 mt-2">
                              <Button
                                size="sm"
                                color="danger"
                                className="text-nowrap px-1"
                                onClick={() => deleteForm(i)}
                                outline>
                                <Trash2 size={14} />
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
              )}
            </Col>

            {signersData.length === 0 ? null : (
              <Col className="text-center mt-1" xs={12}>
                <Button
                  style={{boxShadow: 'none', height: '40px'}}
                  size="sm"
                  disabled={loadingSignersSave}
                  color="primary"
                  onClick={AddSignersData}>
                  {loadingSignersSave ? <Spinner color="light" size="sm" /> : null}
                  <span style={{fontSize: '16px'}} className="align-middle ms-25">
                    Save
                  </span>
                </Button>

                <Button
                  size="sm"
                  style={{marginLeft: '10px', fontSize: '16px', boxShadow: 'none', height: '40px'}}
                  color="secondary"
                  outline
                  onClick={() => {
                    setSignerAddEdit(!signerAddEdit);
                  }}>
                  Cancel
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
        alertStatusDelete={'delete'}
        callBackFunc={DeleteItemFromCanvas}
        text="Are you sure you want to remove this item?"
      />
      {/* send to e-sign  */}
      <Modal
        isOpen={sendToEsign}
        toggle={() => setSendToEsign(!sendToEsign)}
        className="modal-dialog-centered modal-lg">
        <ModalBody className="px-sm-5 mx-20 pb-2">
          <Row tag="form" className="gy-1 gx-1 mt-75">
            <Col
              xs={12}
              style={{
                position: 'sticky',
                top: 0,
                zIndex: '1000',
                backgroundColor: '#f8f8f8',
              }}>
              <div
                style={{
                  paddingBlock: '10px',

                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1%',
                }}>
                <h1 className="fw-bold"> Send Document for E-Signing</h1>
                <X size={24} onClick={() => setSendToEsign(!sendToEsign)} style={{cursor: 'pointer'}} />
              </div>
            </Col>
            <Col xs={12} style={{height: '60vh', overflowY: 'auto', overflowX: 'hidden'}}>
              <Row>
                <Col xs={12}>
                  <h3>Document Name</h3>
                  <Input
                    style={{
                      boxShadow: 'none',
                      fontSize: '16px',
                      marginBottom: '10px',
                    }}
                    type="text"
                    id={`document-name`}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Document Name "
                  />
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      id="signerFunctionalControls"
                      checked={signerFunctionalControls}
                      onChange={e => {
                        setSignerFunctionalControls(e.target.checked);
                      }}
                    />
                    <h3 className="ms-50">Signer Functional Controls</h3>
                  </div>

                  <div className="form-check">
                    <Input
                      type="checkbox"
                      id="signerFunctionalControls"
                      checked={securedShare}
                      onChange={e => {
                        setSecuredShare(e.target.checked);
                      }}
                    />
                    <h3 className="ms-50">Secured Share</h3>
                  </div>
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      id="signerFunctionalControls"
                      checked={EsignOrder}
                      onChange={e => {
                        setSetEsignOrder(e.target.checked);
                      }}
                    />
                    <h3 className="ms-50">Set e-sign Order</h3>
                  </div>
                  <Row>
                    <Col xs={12}>
                      <h3>Email Subject</h3>
                      <Input
                        type="text"
                        style={{
                          fontSize: '16px',
                          boxShadow: 'none',
                          marginBottom: '10px',
                        }}
                        id={`email-subject`}
                        value={emailSubject}
                        onChange={e => {
                          setEmailSubject(e.target.value);
                        }}
                        placeholder="Enter subject here "
                      />
                      <h3>Message</h3>
                      <Input
                        style={{
                          fontSize: '16px',
                          boxShadow: 'none',
                        }}
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
                </Col>
                <Col xs={12}>
                  <div className="modern-horizontal-wizard" style={{marginTop: '20px'}}>
                    <Row tag="form" className="gy-1 gx-2 ">
                      <Col xs={12} className="d-flex justify-content-between align-center">
                        <h3 className="text-center mb-1 fw-bold">Add Signers</h3>
                        <Button
                          style={{boxShadow: 'none'}}
                          size="sm"
                          className="btn-icon"
                          color="primary"
                          onClick={increaseCount}>
                          <Plus size={14} />
                          <span className="align-middle ms-25">Signer</span>
                        </Button>
                      </Col>
                      <Col xs={12}>
                        {signersData.length === 0 ? (
                          <>
                            <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                              <Col md="12" xs="12" className="d-flex justify-content-center align-items-center">
                                <img src={emptyImage} alt="empty" style={{width: '150px', height: 'auto'}} />
                                <h3>No Signer Exist</h3>
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <SortableList
                            items={signersData}
                            onSortEnd={({oldIndex, newIndex}) => {
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
                          />
                        )}
                      </Col>
                    </Row>
                  </div>
                  {/* button next and prev  */}
                </Col>
                {/* Recipient  */}
                <Col xs={12}>
                  {securedShare === true || securedShare === 'true' ? (
                    <>
                      <div className="modern-horizontal-wizard" style={{marginTop: '20px'}}>
                        <Row tag="form" className="gy-1 gx-2 ">
                          <Col xs={12} className="d-flex justify-content-between align-center">
                            <h3 className="text-center mb-1 fw-bold">Add Recipient</h3>
                            <Button
                              style={{boxShadow: 'none'}}
                              size="sm"
                              className="btn-icon"
                              color="primary"
                              onClick={increaseCountReceipient}>
                              <Plus size={14} />
                              <span className="align-middle ms-25">Recipient</span>
                            </Button>
                          </Col>
                          <Col xs={12}>
                            {countReceipient === 0 ? (
                              <>
                                <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                                  <Col md="12" xs="12" className="d-flex justify-content-center align-items-center">
                                    <img src={emptyImage} alt="empty" style={{width: '150px', height: 'auto'}} />
                                    <h3>No Recipient Exist</h3>
                                  </Col>
                                </Row>
                              </>
                            ) : (
                              <>
                                <Repeater count={countReceipient}>
                                  {i => {
                                    const Tag = i === 0 ? 'div' : SlideDown;
                                    return (
                                      <Tag key={i}>
                                        <Form>
                                          <Row className="d-flex justify-content-between align-items-center">
                                            <Col md={3} className="mb-md-0 mb-1">
                                              <h3
                                                style={{fontSize: '16px'}}
                                                className="form-label"
                                                for={`animation-item-name-${i}`}>
                                                Recipient Name
                                              </h3>

                                              <Input
                                                style={{
                                                  fontSize: '16px',
                                                  boxShadow: 'none',
                                                }}
                                                type="text"
                                                name="name"
                                                id={`animation-item-name-${i}`}
                                                placeholder="Recipient "
                                                value={RecipientsData[i].name}
                                                onChange={event => handleInputChangeRecipients(i, event)}
                                              />
                                            </Col>
                                            <Col md={6} className="mb-md-0 mb-1">
                                              <h3
                                                style={{fontSize: '16px'}}
                                                className="form-label"
                                                for={`animation-cost-${i}`}>
                                                Email
                                              </h3>
                                              <Input
                                                style={{
                                                  fontSize: '16px',
                                                  boxShadow: 'none',
                                                }}
                                                name="email"
                                                value={RecipientsData[i].email}
                                                onChange={event => handleInputChangeRecipients(i, event)}
                                                type="email"
                                                id={`animation-cost-${i}`}
                                                placeholder="recipient@gmail.com"
                                              />
                                            </Col>
                                            <Col md={2} className="mb-md-0 mb-1">
                                              <Button
                                                size="sm"
                                                style={{height: '40px', marginTop: '20px'}}
                                                color="danger"
                                                className="text-nowrap px-1"
                                                outline
                                                onClick={deleteFormReceipient}>
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

            <Col xs={12} className="d-flex justify-content-end">
              <Button
                size="sm"
                disabled={loadingSendDocument}
                onClick={async () => {
                  // email template save
                  await saveData();
                  setLoadingSendDocument(true);

                  // send to e-sign api
                  sendToEsignApi();
                }}
                color="primary"
                style={{height: '40px', fontSize: '16px', boxShadow: 'none', marginLeft: '10px', marginBottom: '1%'}}>
                {loadingSendDocument ? <Spinner color="light" size="sm" /> : null}
                <span style={{fontSize: '16px'}} className="align-middle ms-25">
                  Send Document
                </span>
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default WaitingForOthersShowPdf;
