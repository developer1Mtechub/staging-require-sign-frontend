import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";
import {
  TabContent,
  TabPane,
  Card,
  CardBody,
  Row,
  Col,
  CardTitle,
  Button,
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Spinner,
  UncontrolledTooltip,
  ButtonGroup,
  Table,
 
} from "reactstrap";
import { post } from "../apis/api";
import {
  AlignJustify,
  ArrowLeft,
  CheckCircle,
  Clock,
  Folder,
  Grid,
  Inbox,
  Trash2,
  User,
  Users,
  X,
} from "react-feather";
import { formatDate, formatDateCustomTimelastActivity } from "../utility/Utils";
import { useParams, useNavigate } from "react-router-dom";
import pdfIcon from "../assets/images/pages/pdfIcon.png";
import emptyImage from "@assets/images/pages/empty.png";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";
import SpinnerCustom from "../components/SpinnerCustom";
import { useTranslation } from "react-i18next";
import { decrypt } from "../utility/auth-token";
import { getUser } from "../redux/navbar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FreeTrialAlert from "../components/FreeTrailAlert";
import PaginationComponent from "../components/pagination/PaginationComponent";
const Archieve = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    user,
    plan,
    isFreeTrialExpired,
    daysLeftExpiredfreePlan,
    subscription,
    isSubscripitonActive,
    status,
    error,
  } = useSelector((state) => state.navbar);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("warning");
  const [planAlert, setPlanAlert] = useState(false);
  const [active, setActive] = useState("0");

  const { subFolderId, prevId } = useParams();
  const [selectedItems, setSelectedItems] = useState([]);
  const [restoreAllLoader, setRestoreAllLoader] = useState(false);
  const [ItemRestoreAllConfirm, setItemRestoreAllConfirm] = useState(false);
  const [ItemRestoreSelectedConfirm, setItemRestoreSelectedConfirm] =
    useState(false);

  const navigate = useNavigate();
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const [modal, setModal] = useState(false);
  const [errorRequired, setErrorRequired] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  // Add this function to handle checkbox changes
  const handleCheckboxChange = (event, item, type, name) => {
    if (event.target.checked) {
      //console.log('selectedItems');

      //console.log(selectedItems);

      setSelectedItems((prevItems) => [...prevItems, { item, type, name }]);
    } else {
      //console.log(event.target.checked);

      //console.log(selectedItems);
      setSelectedItems((prevItems) => prevItems.filter((i) => i.item !== item));
    }
  };

  const RestoreAllTrash = async () => {
    setRestoreAllLoader(true);

    const postData = {
      user_id: user?.user_id,
    };
    try {
      const apiData = await post("file/UnArchieveFileAll", postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemRestoreAllConfirm(false);
        setRestoreAllLoader(false);
        fetchAllFiles();
        fetchAllFolder();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const [foldersArray, setFoldersArray] = useState([]);
  const [filesArray, setFilesArray] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items to display per page

  const handlePageChangeNo = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  const fetchAllFolder = async () => {
    //console.log(subFolderId);
    if (subFolderId === null || subFolderId === undefined) {
      const postData = {
        user_id: user?.user_id,
        subFolder: false,
      };
      try {
        const apiData = await post("folder/getAllFoldersArchieve", postData); // Specify the endpoint you want to call
        //console.log('GET FOLDER BY USER ID ');

        //console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFoldersArray([]);
        } else {
          //console.log(apiData.result);
          setFoldersArray(apiData.result);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
      setFolderLoader(false);
    } else {
      const postData = {
        user_id: user?.user_id,
        subFolder: true,
        subFolder_id: subFolderId,
      };
      try {
        const apiData = await post("folder/getAllFoldersArchieve", postData); // Specify the endpoint you want to call
        //console.log('GET FOLDER BY USER ID ');

        //console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFoldersArray([]);
        } else {
          //console.log(apiData.result);
          setFoldersArray(apiData.result);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
      setFolderLoader(false);
    }
  };

  const fetchAllFiles = async (statusData) => {
    //console.log('subFolderId');

    //console.log(subFolderId);
    if (
      subFolderId === null ||
      subFolderId === undefined ||
      subFolderId === "null" ||
      subFolderId === "undefined"
    ) {
      const postData = {
        user_id: user?.user_id,
        // user_id: 100617,
        subFolder: false,
        status: statusData,
      };
      try {
        const apiData = await post("file/getArchieveFiles", postData); // Specify the endpoint you want to call
        console.log("GET Files BY USER ID ");

        console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFilesArray([]);
        } else {
          // toastAlert('success', apiData.message);
          //console.log(apiData.result);
          setFilesArray(apiData.result);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
    } else {
      //console.log('Not null subfolder ');
      //console.log(subFolderId);

      const postData = {
        user_id: user?.user_id,
        // user_id: 100617,
        subFolder: true,
        subFolder_id: subFolderId,
        status: statusData,
      };
      try {
        const apiData = await post("file/getArchieveFiles", postData); // Specify the endpoint you want to call
        //console.log('GET Files BY USER ID Subfolder');

        //console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFilesArray([]);
        } else {
          toastAlert("succes", apiData.message);
          //console.log(apiData.result);
          setFilesArray(apiData.result);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
    }
  };
  // add folder
  const [addFolderLoader, setAddFolderLoader] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [deleteFolderId, setDeleteFolderId] = useState("");

  // update folder
  const [addFolderLoaderUpdate, setAddFolderLoaderUpdate] = useState(false);
  const [folderNameUpdate, setFolderNameUpdate] = useState("");
  const [modalUpdate, setModalUpdate] = useState(false);
  const [errorRequiredUpdate, setErrorRequiredUpdate] = useState(false);

  // delete folder
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [itemDeleteConfirmationFile, setItemDeleteConfirmationFile] =
    useState(false);
  const [itemRestoreConfirmation, setItemRestoreConfirmation] = useState(false);
  const [itemRestoreConfirmationFile, setItemRestoreConfirmationFile] =
    useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);
  const RestoreSelectedTrash = async () => {
    setRestoreAllLoader(true);
    //console.log(selectedItems);
    const postData = {
      items: selectedItems,
    };
    try {
      const apiData = await post("file/UnArchieveFileSelected", postData); // Specify the endpoint you want to call
      //console.log('RESTORE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "MULTIPLE-FOLDERS-AND-FILES_UNARCHIVED",
          description: `${email} Unarchived ${JSON.stringify(selectedItems)}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemRestoreSelectedConfirm(false);
        setRestoreAllLoader(false);
        fetchAllFiles();
        fetchAllFolder();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // delete folderv api
  const DeleteFolder = async () => {
    const location = await getUserLocation();
    setLoadingDelete(true);
    //console.log(deleteFolderId);
    const postData = {
      folder_id: deleteFolderId,
      deleted_at: location.date,
    };
    try {
      const apiData = await post("folder/delete_folder", postData); // Specify the endpoint you want to call
      //console.log('DELETE FOLDER BY USER-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "FOLDER-DELETED",
          description: `${email} deleted folder ${folderName} permanent `,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation(false);
        setLoadingDelete(false);
        fetchAllFolder();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // Delete filev
  const DeleteFile = async () => {
    const location = await getUserLocation();

    setLoadingDeleteFile(true);
    //console.log(deleteFolderId);
    const postData = {
      file_id: deleteFolderId,
      deleted_at: location.date,
    };
    try {
      const apiData = await post("file/delete-file", postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "FILE-DELETED",
          description: `${email} deleted file ${folderName} permanent `,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmationFile(false);
        setLoadingDeleteFile(false);
        fetchAllFiles();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // Restore folderv api
  const RestoreFolder = async () => {
    //console.log(location);

    //console.log(location);
    setLoadingDelete(true);
    //console.log(deleteFolderId);
    const postData = {
      folder_id: deleteFolderId,
    };
    try {
      const apiData = await post("folder/UnArchieveFolders", postData); // Specify the endpoint you want to call
      //console.log('DELETE FOLDER BY USER-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "FOLDER-UNARCHIVED",
          description: `${email} unarchived folder ${folderName}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemRestoreConfirmation(false);
        setLoadingDelete(false);
        fetchAllFolder();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // Delete filev
  const RestoreFile = async () => {
    setLoadingDeleteFile(true);
    //console.log(deleteFolderId);
    const postData = {
      file_id: deleteFolderId,
    };
    try {
      const apiData = await post("file/unarchiev_file", postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "FILE-UNARCHIVED",
          description: `${email} unarchived file ${folderName}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemRestoreConfirmationFile(false);
        setLoadingDeleteFile(false);
        fetchAllFiles();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 9; // Number of items to display per page
  let allItems = [...foldersArray, ...filesArray];
  // Calculate the index of the first and last item on the current page
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Assuming you have your data stored in an array called `allItems`
  let currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

    //console.log('Page changed to:', pageNumber);
    indexOfLastItem = currentPage * itemsPerPage;
    //console.log(indexOfLastItem);

    indexOfFirstItem = indexOfLastItem - itemsPerPage;
    //console.log(indexOfFirstItem);

    currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);
    //console.log(currentItems);
  };
  // end
  // Add files
  const [show, setShow] = useState(false);
  const [cardType, setCardType] = useState("");
  const [StatusData, setStatusData] = useState(null);
  const [rSelected, setRSelected] = useState(1);
  const [subfolderState, setSubfolderState] = useState(false);
  const [folderLoader, setFolderLoader] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const colors = [
    "#ff7979",
    "#76c476",
    "#3535fc",
    "#fea4d7",
    "#ffd17c",
    "#00cfe8",
  ];
  const [modalSize, setModalSize] = useState("modal-lg");
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  // useEffect(() => {
  //   getLocatinIPn();
  //   if (subFolderId !== null && subFolderId !== undefined) {
  //     setSubfolderState(true);
  //   } else {
  //     setSubfolderState(false);
  //   }
  //   if (items === '' || items === undefined || items === null) {
  //     window.location.href = '/login';
  //   } else {
  //     if (items.token.company_user) {
  //       setPlanAlert(false);
  //     } else if (items.subdomain === null || items.subdomain === undefined) {
  //       // setPlanAlert(true)
  //       // const interval = setInterval(() => {
  //       fetchData();
  //       fetchAllFolder();
  //       fetchAllFiles(StatusData);
  //       // }, 1000);
  //       // return () => clearInterval(interval);
  //     } else {
  //       setPlanAlert(false);
  //     }
  //   }
  //   // Get params
  // }, []);
  const [daysleftExpired, setdaysleftExpired] = useState(0);
  const [freeTrailExpiredAlert, setFreeTrailExpiredAlert] = useState(false);
  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            fetchAllFolder(),
            fetchAllFiles(StatusData),
            setFolderLoader(false),
          ]);
          console.log("PLAN DATA ");
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setFolderLoader(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, subscription, plan, status]);
  // useEffect(() => {
  //   const encryptedData = localStorage.getItem("user_data");
  //   console.log("encryptedData");

  //   console.log(encryptedData);
  //   if (encryptedData) {
  //     try {
  //       const decryptedData = JSON.parse(decrypt(encryptedData));
  //       const { token, user_id } = decryptedData;
  //       console.log(decryptedData);

  //       // Fetch user data if not already available in Redux state
  //       if (token && user_id && !user) {
  //         dispatch(getUser({ user_id, token }));

  //       }
  //     } catch (error) {
  //       console.error("Error processing token data:", error);
  //     }
  //   }
  // }, [dispatch, user]);
const icon_size=window.innerWidth<730?20:30;
const fontSize=window.innerWidth<730?14:16;
const icon_size_fc=window.innerWidth<730?15:20;
  return (
    <div>
      <FreeTrialAlert
        isSubscripitonActive={isSubscripitonActive}
        subscription={subscription}
        isFreeTrialExpired={isFreeTrialExpired}
        daysleftExpired={daysLeftExpiredfreePlan}
      />

      {/* {planAlert ? (
        <Alert color={severity}>
          <h1 className='alert-body'>
            {message}.<strong style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = '/stripe_plan'
              }> Buy a subscription .</strong>
          </h1>
        </Alert>
      ) : null} */}

      {/* Row for table view and card view of documnets  */}
      <Row>
        <Col md="12" xs="12" className="d-flex justify-content-between">
          {/* <div>
         <Button style={{ marginLeft: '10px' }} color='primary' size="sm"
              onClick={() => setModal(true)
              }>
              <FolderPlus size={24} />
            </Button>
            <Button
              onClick={() => { setShow(true) }}
              style={{ marginLeft: '10px', marginRight: '10px' }} color='primary' size="sm" >
              <FilePlus size={24} />
            </Button>
            </div> */}
          <h1>{t("Archive")}</h1>
          <span>
            {subfolderState ? (
              <>
                <Button
                  size="sm"
                  onClick={() => {
                    if (
                      prevId === null ||
                      prevId === undefined ||
                      prevId === "null" ||
                      prevId === "undefined"
                    ) {
                      navigate(`/home/`);
                    } else {
                      // Get the existing IDs from localStorage
                      let ids = JSON.parse(localStorage.getItem("ids")) || [];

                      // Get and remove the last ID
                      let lastId = ids.pop();

                      // Save the updated array back to localStorage
                      localStorage.setItem("ids", JSON.stringify(ids));
                      navigate(`/home/${prevId}/${lastId}`);
                    }
                    // refresh browser
                    // window.location.reload();
                  }}
                >
                  <ArrowLeft size={14} />
                  <span
                    className="align-middle ms-25"
                    style={{ fontSize: "16px" }}
                  >
                    {t("Back")}
                  </span>
                </Button>
              </>
            ) : null}
            {/* <ButtonGroup size="sm">
              <Button color='secondary' onClick={() => setRSelected(1)} active={rSelected === 1} outline>
                <Folder size={24}  />
              </Button> */}
            {/* <Button style={{ marginLeft: '10px' }} color='primary' size="sm"
              onClick={() => setModal(true)
              }>
              <Plus size={24} />
            </Button> */}

            {/* </ButtonGroup> */}
          </span>

          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            {allItems.length === 0 ? null : (
              <>
                {restoreAllLoader ? (
                  <Spinner color="primary" style={{ marginLeft: "10px" }} />
                ) : (
                  <>
                    <Inbox
                      id="RestoreAll"
                      onClick={() => {
                        //console.log(selectedItems);
                        if (selectedItems.length === 0) {
                          setItemRestoreAllConfirm(true);
                        } else {
                          setItemRestoreSelectedConfirm(true);
                        }
                      }}
                      size={20}
                      style={{ cursor: "pointer" }}
                    />
                    <UncontrolledTooltip placement="bottom" target="RestoreAll">
                      {t("Restore All")}
                    </UncontrolledTooltip>
                  </>
                )}{" "}
              </>
            )}

            <ButtonGroup
              size="sm"
              style={{ marginLeft: "10px", height: "40px" }}
            >
              <Button
                color="secondary"
                onClick={() => setRSelected(1)}
                active={rSelected === 1}
                outline
              >
                <Grid size={24} />
              </Button>
              <Button
                color="secondary"
                onClick={() => setRSelected(2)}
                active={rSelected === 2}
                outline
              >
                <AlignJustify size={24} />
              </Button>
            </ButtonGroup>
          </div>
        </Col>

        {/* <Card>
          <CardBody style={{backgroundColor:'transparent'}}>
            <CardText> */}
        <div className="nav-horizontal">
          {/* vertical for vertical  */}
          {/* {active} */}
          <TabContent activeTab={active}>
            <TabPane tabId={active}>
              <Row className="match-height mb-2 mt-2">
                {/* <Col md='4' xs='12'> */}
                {rSelected === 1 ? (
                  <>
                    <Row>
                      {currentItems.map((item, index) => (
                        <>
                          {item.folder_id === null ||
                          item.folder_id === undefined ? (
                            <Col md="4" xs="12">
                              <Card>
                                {/* <CardImg top src={img1} alt='card1' /> */}
                                <CardBody style={{ cursor: "pointer" }}>
                                  <div className="d-flex justify-content-between">
                                    <CardTitle tag="h4">
                                      <img
                                        src={pdfIcon}
                                        alt="pdf icon"
                                        style={{
                                          width: `${icon_size}px`,
                                          height: "auto",
                                        }}
                                      />
                                      <span
                                        style={{
                                          marginTop: "2%",
                                          fontSize: `${fontSize}px`,
                                          marginLeft: "10px",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          maxWidth: "110px",
                                          display: "inline-block",
                                        }}
                                        title={
                                          item.name.length > 10
                                            ? item.name
                                            : null
                                        }
                                      >
                                        {item.name}
                                      </span>
                                      {/* <span style={{ marginLeft: '10px' }}>
                                         {item.name}
                                       </span> */}
                                    </CardTitle>
                                    {/* folder icon here */}
                                    {/* <File size={24} /> */}
                                    {window.innerWidth<730?<>
                                      <div>
                                      {item.status === "InProgress" ? (
                                        <Badge color="info">
                                          <Clock
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                         
                                        </Badge>
                                      ) : null}
                                      {item.status === "WaitingForOthers" ? (
                                        <Badge color="warning">
                                          <Users
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                         
                                        </Badge>
                                      ) : null}
                                      {item.status === "WaitingForMe" ? (
                                        <Badge color="danger">
                                          <User
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                        
                                        </Badge>
                                      ) : null}
                                      {item.status === "Completed" ? (
                                        <Badge color="success">
                                          <CheckCircle
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                        
                                        </Badge>
                                      ) : null}
                                    </div>
                                      </>:
                                      
                                    <div>
                                      {item.status === "InProgress" ? (
                                        <Badge color="info">
                                          <Clock
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                          <span
                                            className="align-middle"
                                            style={{
                                              fontSize: "14px",
                                            }}
                                          >
                                            {t("In Progress")}
                                          </span>
                                        </Badge>
                                      ) : null}
                                      {item.status === "WaitingForOthers" ? (
                                        <Badge color="warning">
                                          <Users
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                          <span
                                            className="align-middle"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {t("Waiting For Others")}
                                          </span>
                                        </Badge>
                                      ) : null}
                                      {item.status === "WaitingForMe" ? (
                                        <Badge color="danger">
                                          <User
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                          <span
                                            className="align-middle"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {t("Waiting For Me")}
                                          </span>
                                        </Badge>
                                      ) : null}
                                      {item.status === "Completed" ? (
                                        <Badge color="success">
                                          <CheckCircle
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                          <span
                                            className="align-middle"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {t("Completed")}
                                          </span>
                                        </Badge>
                                      ) : null}
                                    </div>}
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <div style={{display:"flex"}}>
                                      {/* view  */}
                                      <Inbox
                                        size={icon_size_fc}
                                        id="view"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          //console.log('restore');
                                          setDeleteFolderId(item.file_id);
                                          setFolderName(item.name);
                                          setItemRestoreConfirmationFile(true);
                                        }}
                                      />
                                      {/* Icons for edit delete with tooltip  */}

                                      <Trash2
                                        id="delete"
                                        size={icon_size_fc}
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                          color: "red",
                                        }}
                                        onClick={() => {
                                          setDeleteFolderId(item.file_id);
                                          setFolderName(item.name);
                                          setItemDeleteConfirmationFile(true);
                                        }}
                                      />

                                      <UncontrolledTooltip
                                        placement="bottom"
                                        target="view"
                                      >
                                        {t("Restore")}
                                      </UncontrolledTooltip>
                                      <UncontrolledTooltip
                                        placement="bottom"
                                        target="delete"
                                      >
                                        {t("Delete Permanent")}
                                      </UncontrolledTooltip>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "right",
                                      }}
                                    >
                                      <h3
                                        className="text-muted d-flex justify-content-right align-right"
                                        style={{ marginLeft: window.innerWidth<730?"5px":"100px",  fontSize: `${fontSize}px`, }}
                                      >
                                        {formatDateCustomTimelastActivity(
                                          item.archieved_at
                                        )}
                                      </h3>
                                    </div>
                                  </div>
                                </CardBody>
                                {/* <CardFooter>
                                 
                                 </CardFooter> */}
                              </Card>
                            </Col>
                          ) : (
                            <Col md="4" xs="12">
                              <Card>
                                {/* <CardImg top src={img1} alt='card1' /> */}
                                <CardBody className="d-flex justify-content-left align-items-center">
                                  <Row>
                                    <Col
                                      md="12"
                                      xs="12"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <CardTitle
                                        tag="h3"
                                        className="d-flex justify-content-left align-items-center"
                                      >
                                        {/* folder icon here */}
                                        <Folder
                                          style={{ color: `${item.color}` }}
                                          size={icon_size}
                                        />
                                        <span
                                          style={{
                                            marginLeft: "10px",
                                            fontSize: `${fontSize}px`,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "150px",
                                            display: "inline-block",
                                          }}
                                          title={
                                            item.folder_name.length > 15
                                              ? item.folder_name
                                              : null
                                          }
                                        >
                                          {item.folder_name}
                                        </span>
                                      </CardTitle>
                                    </Col>
                                    <Col md="12" xs="12">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div style={{display:"flex"}}>
                                          {/* view  */}
                                          <Inbox
                                            size={icon_size_fc}
                                            id="view"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                              //console.log('restore');
                                              setFolderName(item.folder_name);
                                              setDeleteFolderId(item.folder_id);
                                              setItemRestoreConfirmation(true);
                                            }}
                                          />
                                          {/* Icons for edit delete with tooltip  */}

                                          <Trash2
                                            id="delete"
                                            size={icon_size_fc}
                                            style={{
                                              cursor: "pointer",
                                              marginLeft: "10px",
                                              color: "red",
                                            }}
                                            onClick={() => {
                                              setFolderName(item.folder_name);
                                              setDeleteFolderId(item.folder_id);
                                              setItemDeleteConfirmation(true);
                                            }}
                                          />

                                          <UncontrolledTooltip
                                            placement="bottom"
                                            target="view"
                                          >
                                            {t("Restore")}
                                          </UncontrolledTooltip>
                                          <UncontrolledTooltip
                                            placement="bottom"
                                            target="delete"
                                          >
                                            {t("Delete Permanent")}
                                          </UncontrolledTooltip>
                                        </div>
                                       
                                       {window.innerWidth<730?<h3
                                            className="text-muted d-flex justify-content-right align-right"
                                            style={{ fontSize: `${fontSize}px`, }}
                                          >
                                            {formatDateCustomTimelastActivity(
                                              item.archieved_at
                                            )}
                                          </h3>:<div
                                          style={{
                                            display: "flex",
                                            justifyContent: "right",
                                          }}
                                        >
                                          <h3
                                            className="text-muted d-flex justify-content-right align-right"
                                            style={{maxWidth:window.innerWidth<730?"5px":"100px",  fontSize: `${fontSize}px`, }}
                                          >
                                            {formatDateCustomTimelastActivity(
                                              item.archieved_at
                                            )}
                                          </h3>
                                        </div>} 
                                      </div>
                                    </Col>
                                  </Row>

                                  {/* <CardText>
                            This is a wider card with supporting text below as a natural lead-in to additional content. This content
                            is a little bit longer.
                          </CardText> */}
                                </CardBody>
                              </Card>
                            </Col>
                          )}
                        </>
                      ))}
                      {currentItems.length === 0 ? null : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "right",
                            }}
                          >
                            <PaginationComponent
                              currentPage={currentPage}
                              itemsPerPage={itemsPerPage}
                              totalItems={currentItems?.length}
                              handlePageChange={handlePageChange}
                              handlePageChangeNo={handlePageChangeNo}
                            />
                          </div>
                        </>
                      )}
                     
                    </Row>
                  </>
                ) : (
                  <>
                    <Col md="12" xs="12">
                      {/* <Table> */}
                      {/* <Card style={{padding: '15px'}}> */}
                      <div className="table-responsive">  
                         <Table>
                        <thead>
                          <tr>
                            <th></th>
                            <th>
                              {" "}
                              <h2 style={{ fontWeight: 700 }}>{t("Name")}</h2>
                            </th>
                            <th>
                              {" "}
                              <h2 style={{ fontWeight: 700 }}>{t("Status")}</h2>
                            </th>
                            <th>
                              {" "}
                              <h2 style={{ fontWeight: 700 }}>
                                {t("Archived at")}
                              </h2>{" "}
                            </th>
                            <th>
                              {" "}
                              <h2 style={{ fontWeight: 700 }}>
                                {t("Actions")}
                              </h2>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((item, index) => (
                            <>
                              {item.folder_id === null ||
                              item.folder_id === undefined ? (
                                <tr>
                                  <td>
                                    <input
                                      type="checkbox"
                                      onChange={(event) =>
                                        handleCheckboxChange(
                                          event,
                                          item.file_id,
                                          "file",
                                          item.name
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <span style={{ display: "flex" }}>
                                      <img
                                        src={pdfIcon}
                                        alt="pdf icon"
                                        style={{
                                          width: `${icon_size}px`,
                                          height:`${icon_size}px`,
                                        }}
                                      />
                                      <h2 style={{ marginLeft: "20px",fontSize:`${fontSize}px` }}>
                                        {item.name}
                                      </h2>
                                    </span>
                                  </td>
                                  <td>
                                    <span>
                                      {item.status === "InProgress" ? (
                                        <Badge color="info">
                                          <Clock
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                          <span
                                            className="align-middle"
                                            style={{
                                              fontSize: "14px",
                                            }}
                                          >
                                            {t("In Progress")}
                                          </span>
                                        </Badge>
                                      ) : null}
                                      {item.status === "WaitingForOthers" ? (
                                        <Badge color="warning">
                                          <Users
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                          <span
                                            className="align-middle"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {t("Waiting For Others")}
                                          </span>
                                        </Badge>
                                      ) : null}
                                      {item.status === "WaitingForMe" ? (
                                        <Badge color="danger">
                                          <User
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                          <span
                                            className="align-middle"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {t("Waiting For Me")}
                                          </span>
                                        </Badge>
                                      ) : null}
                                      {item.status === "Completed" ? (
                                        <Badge color="success">
                                          <CheckCircle
                                            size={12}
                                            className="align-middle me-25"
                                          />
                                          <span
                                            className="align-middle"
                                            style={{ fontSize: "14px" }}
                                          >
                                            {t("Completed")}
                                          </span>
                                        </Badge>
                                      ) : null}
                                    </span>
                                  </td>
                                  <td>
                                    {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
                                    <h3 style={{fontSize:`${fontSize}px` }}>
                                      {formatDateCustomTimelastActivity(
                                        item.archieved_at
                                      )}
                                    </h3>

                                    {/* </div> */}
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-between">
                                      <div style={{display:"flex"}}>
                                        {/* view  */}
                                        <Inbox
                                          size={20}
                                          id="viewing"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            // window.location.href = `/editor/${item.file_id}`
                                            setDeleteFolderId(item.file_id);
                                            setFolderName(item.name);
                                            setItemRestoreConfirmationFile(
                                              true
                                            );
                                          }}
                                        />
                                        {/* <Eye size={20} id="viewing" style={{ cursor: 'pointer' }}
        onClick={
          () => {
            window.location.href = `/editor/${item.file_id}`

          }
        }
      />
      <Edit2
        onClick={() => {
          window.location.href = `/editor/${item.file_id}`

        }}
        id='editing' size={20} style={{ cursor: 'pointer', marginLeft: '10px', }} /> */}
                                        <Trash2
                                          id="deleting"
                                          size={20}
                                          style={{
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                            color: "red",
                                          }}
                                          onClick={() => {
                                            setDeleteFolderId(item.file_id);
                                            setFolderName(item.name);
                                            setItemDeleteConfirmationFile(true);
                                          }}
                                        />
                                        {/* <UncontrolledTooltip placement='bottom' target='editing'>
        Edit
      </UncontrolledTooltip>
      <UncontrolledTooltip placement='bottom' target='viewing'>
        View
      </UncontrolledTooltip> */}
                                        <UncontrolledTooltip
                                          placement="bottom"
                                          target="viewing"
                                        >
                                          {t("Restore")}
                                        </UncontrolledTooltip>
                                        <UncontrolledTooltip
                                          placement="bottom"
                                          target="deleting"
                                        >
                                          {t("Delete")}
                                        </UncontrolledTooltip>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                <tr>
                                  <td>
                                    <input
                                      type="checkbox"
                                      onChange={(event) => {
                                        //console.log(item);
                                        handleCheckboxChange(
                                          event,
                                          item.folder_id,
                                          "folder",
                                          item.folder_name
                                        );
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <span style={{ display: "flex" }}>
                                      <Folder
                                        style={{ color: `${item.color}` }}
                                        size={icon_size}
                                      />
                                      <h2 style={{ marginLeft: "20px",fontSize:`${fontSize}px`  }}>
                                        {item.folder_name}
                                      </h2>
                                    </span>
                                  </td>
                                  <td>--</td>
                                  <td>
                                    {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
                                    <h3 style={{fontSize:`${fontSize}px` }}>
                                      {formatDateCustomTimelastActivity(
                                        item.archieved_at
                                      )}
                                    </h3>

                                    {/* </div> */}
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-between">
                                      <div style={{display:"flex"}}>
                                        {/* view  */}
                                        {/* <Eye size={20} id="view" style={{ cursor: 'pointer' }}
          onClick={
            () => {
              if (subFolderId === null || subFolderId === undefined || subFolderId === 'null' || subFolderId === 'undefined') {
                window.location.href = `/home/${item.uniq_id}/${subFolderId}`
              } else {
                // Get the existing IDs from localStorage
                let ids = JSON.parse(localStorage.getItem('ids')) || [];

                // Add the new ID
                ids.push(prevId);

                // Save the updated array back to localStorage
                localStorage.setItem('ids', JSON.stringify(ids));
                window.location.href = `/home/${item.uniq_id}/${subFolderId}`

              }

            }
          }
        /> */}
                                        <Inbox
                                          size={20}
                                          id="view"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            //console.log('restore');
                                            setDeleteFolderId(item.folder_id);
                                            setFolderName(item.folder_name);
                                            setItemRestoreConfirmation(true);
                                          }}
                                        />
                                        {/* Icons for edit delete with tooltip  */}
                                        {/* <Edit2
          onClick={() => {
            //console.log(item.folder_name)
            //console.log(item.folder_id)
            setFolderNameUpdate(item.folder_name)
            setDeleteFolderId(item.folder_id)
            setModalUpdate(true)

          }}
          id='edit' size={20} style={{ cursor: 'pointer', marginLeft: '10px', }} /> */}
                                        <Trash2
                                          id="delete"
                                          size={20}
                                          style={{
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                            color: "red",
                                          }}
                                          onClick={() => {
                                            setDeleteFolderId(item.folder_id);
                                            setFolderName(item.folder_name);
                                            setItemDeleteConfirmation(true);
                                          }}
                                        />
                                        {/* <UncontrolledTooltip placement='bottom' target='edit'>
          Rename
        </UncontrolledTooltip>
         */}
                                        <UncontrolledTooltip
                                          placement="bottom"
                                          target="view"
                                        >
                                          {t("Restore")}
                                        </UncontrolledTooltip>
                                        <UncontrolledTooltip
                                          placement="bottom"
                                          target="delete"
                                        >
                                          {t("Delete")}
                                        </UncontrolledTooltip>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </Table>
                      </div>
                      {/* </Card>{' '} */}
                      {/* </Table> */}
                      {currentItems.length === 0 ? null : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "right",
                            }}
                          >
                            <PaginationComponent
                              currentPage={currentPage}
                              itemsPerPage={itemsPerPage}
                              totalItems={currentItems?.length}
                              handlePageChange={handlePageChange}
                              handlePageChangeNo={handlePageChangeNo}
                            />
                          </div>
                        </>
                      )}
                    </Col>
                    
                  </>
                )}

                {/* </Col> */}
                {/* </>)
                  )) : null} */}
                {folderLoader ? (
                  <>
                    <Row>
                      <Col
                        md="12"
                        xs="12"
                        className="d-flex justify-content-center"
                      >
                        <SpinnerCustom color="primary" />
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    {foldersArray.length > 0 || filesArray.length > 0 ? null : (
                      <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                        <Col
                          md="12"
                          xs="12"
                          className="d-flex justify-content-center align-items-center"
                        >
                          <img
                            src={emptyImage}
                            alt="empty"
                            style={{ width: "100px", height: "auto" }}
                          />
                          <Label
                            className="form-label"
                            style={{ fontSize: "14px" }}
                          >
                            {t("No Folder or File Exist")}
                          </Label>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </Row>
      {/* Modal  Add Folder  */}

      {/* Modal delete  */}

      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteFolder}
        text={t("By click delete, your Folder will go to Trash. Are you sure?")}
        alertStatusDelete={"delete"}
      />
      {/* Restotre Folder  */}

      <ModalConfirmationAlert
        isOpen={itemRestoreConfirmation}
        toggleFunc={() => setItemRestoreConfirmation(!itemRestoreConfirmation)}
        loader={loadingDelete}
        callBackFunc={RestoreFolder}
        text={t("Are you sure you want to unArchived this Folder?")}
      />
      {/* Modal delete File  */}

      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmationFile}
        toggleFunc={() =>
          setItemDeleteConfirmationFile(!itemDeleteConfirmationFile)
        }
        loader={loadingDeleteFile}
        callBackFunc={DeleteFile}
        alertStatusDelete={"delete"}
        text={t(
          "By click delete, your document will go to Trash. Are you sure?"
        )}
      />

      <ModalConfirmationAlert
        isOpen={itemRestoreConfirmationFile}
        toggleFunc={() =>
          setItemRestoreConfirmationFile(!itemRestoreConfirmationFile)
        }
        loader={loadingDeleteFile}
        callBackFunc={RestoreFile}
        text={t("Are you sure you want to unArchived this File?")}
      />
      {/* Unarchived All  */}
      <ModalConfirmationAlert
        isOpen={ItemRestoreAllConfirm}
        toggleFunc={() => setItemRestoreAllConfirm(!ItemRestoreAllConfirm)}
        loader={restoreAllLoader}
        callBackFunc={RestoreAllTrash}
        text={t("Are you sure you want to unArchived All Items?")}
      />
      {/* selected Unarchived */}
      <ModalConfirmationAlert
        isOpen={ItemRestoreSelectedConfirm}
        toggleFunc={() =>
          setItemRestoreSelectedConfirm(!ItemRestoreSelectedConfirm)
        }
        loader={restoreAllLoader}
        callBackFunc={RestoreSelectedTrash}
        text={`${t("Are you sure you want to restore these")} ${
          selectedItems.length
        } ${t("Items")}?`}
      />
      {/* Modal Update Folder  */}
    </div>
  );
};

export default Archieve;
