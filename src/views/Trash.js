import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";
import {
  Alert,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  Row,
  Col,
  CardTitle,
  CardText,
  CardFooter,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Spinner,
  UncontrolledTooltip,
  ButtonGroup,
  Table,
  PaginationItem,
  PaginationLink,
  Pagination,
} from "reactstrap";
import { deleteReq, post } from "../apis/api";
import {
  AlignJustify,
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  File,
  FilePlus,
  Folder,
  FolderPlus,
  Grid,
  Key,
  MoreVertical,
  Plus,
  RefreshCcw,
  Star,
  Trash,
  Trash2,
  User,
  Users,
  X,
} from "react-feather";
// import StatsVertical from '@components/widgets/stats/StatsVertical';
import { formatDate, formatDateCustomTimelastActivity } from "../utility/Utils";
import { useParams, useNavigate } from "react-router-dom";
import pdfIcon from "../assets/images/pages/pdfIcon.png";
import emptyImage from "@assets/images/pages/empty.png";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import SpinnerCustom from "../components/SpinnerCustom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/navbar";
import { decrypt } from "../utility/auth-token";
import FreeTrialAlert from "../components/FreeTrailAlert";
import PaginationComponent from "../components/pagination/PaginationComponent";
const TrashPage = () => {
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
  const [active, setActive] = useState("0");
  const [ItemDeleteSelectedConfirm, setItemDeleteSelectedConfirm] =
    useState(false);

  const [ItemDeleteAllConfirm, setItemDeleteAllConfirm] = useState(false);
  const [deleteAllLoader, setDeleteAllLoader] = useState(false);
  const [restoreAllLoader, setRestoreAllLoader] = useState(false);
  const [ItemRestoreAllConfirm, setItemRestoreAllConfirm] = useState(false);
  const [ItemRestoreSelectedConfirm, setItemRestoreSelectedConfirm] =
    useState(false);

  const { subFolderId, prevId } = useParams();
  const navigate = useNavigate();
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const [foldersArray, setFoldersArray] = useState([]);
  const [filesArray, setFilesArray] = useState([]);

  const fetchAllFolder = async () => {
    //console.log(subFolderId);
    if (subFolderId === null || subFolderId === undefined) {
      const postData = {
        user_id: user?.user_id,
        subFolder: false,
      };
      try {
        const apiData = await post("folder/get_all_folder_trash", postData); // Specify the endpoint you want to call
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
    } else {
      const postData = {
        user_id: user?.user_id,
        subFolder: true,
        subFolder_id: subFolderId,
      };
      try {
        const apiData = await post("folder/get_all_folder_trash", postData); // Specify the endpoint you want to call
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
    }
  };
  const [filesTemp, setFilesTemp] = useState([]);
  const handlePageChangeNo = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
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
        const apiData = await post("file/trash_files", postData); // Specify the endpoint you want to call
        console.log('GET Files BY USER ID ');

        console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFilesArray([]);
        } else {
          //console.log(apiData.result);
          setFilesArray(apiData.result);
          setFilesTemp(apiData.result1);
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
        const apiData = await post("file/trash_files", postData); // Specify the endpoint you want to call
        //console.log('GET Files BY USER ID Subfolder');

        //console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFilesArray([]);
        } else {
          //console.log(apiData.result);
          setFilesArray(apiData.result);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
    }
  };
  // add folder
  const [folderName, setFolderName] = useState("");
  const [deleteFolderId, setDeleteFolderId] = useState("");

  // update folder

  // delete folder
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [itemDeleteConfirmationFile, setItemDeleteConfirmationFile] =
    useState(false);
  const [itemRestoreConfirmation, setItemRestoreConfirmation] = useState(false);
  const [itemRestoreConfirmationFile, setItemRestoreConfirmationFile] =
    useState(false);
  const [itemRestoreConfirmationFileTemp, setItemRestoreConfirmationFileTemp] =
    useState(false);
  const [itemDeleteConfirmationFileTemp, setItemDeleteConfirmationFileTemp] =
    useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);

  // delete folderv api
  const DeleteFolder = async () => {
    setLoadingDelete(true);
    //console.log(deleteFolderId);
    const postData = {
      folder_id: deleteFolderId,
    };
    try {
      const apiData = await post("folder/delete_permanent", postData); // Specify the endpoint you want to call
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
          event: "DELETED-FOLDER",
          description: `${email} Deleted Folder ${folderName} permanent`,
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
    setLoadingDeleteFile(true);
    //console.log(deleteFolderId);
    const postData = {
      file_id: deleteFolderId,
    };
    try {
      const apiData = await post("file/delete_permanent", postData); // Specify the endpoint you want to call
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
          description: `${email} Deleted file ${folderName} Permanent`,
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
  const DeleteFileTemp = async () => {
    setLoadingDeleteFile(true);
    //console.log(deleteFolderId);
    const postData = {
      file_id: deleteFolderId,
    };
    try {
      const apiData = await post("file/delete_permanent_temp", postData); // Specify the endpoint you want to call
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
          description: `${email} Deleted file ${folderName} Permanent`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmationFileTemp(false);
        setLoadingDeleteFile(false);
        fetchAllFiles();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };

  // Delete All  filev
  const DeleteAllTrash = async () => {
    setLoadingDeleteFile(true);
    setDeleteAllLoader(true);

    const postData = {
      user_id: user?.user_id,
    };
    try {
      const apiData = await post("file/deleteAllTrashPermanent", postData); // Specify the endpoint you want to call
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
          event: "DELETED-TRASH",
          description: `${email} Deleted Trash Files and Folders permanently`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteAllConfirm(false);
        setLoadingDeleteFile(false);
        setDeleteAllLoader(false);
        fetchAllFiles();
        fetchAllFolder();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // Delete Selected  filev
  const DeleteSelectedTrash = async () => {
    //console.log(selectedItems);
    setLoadingDeleteFile(true);
    setDeleteAllLoader(true);

    const postData = {
      items: selectedItems,
    };
    try {
      const apiData = await post("file/deleteSelectedTrashPermanent", postData); // Specify the endpoint you want to call
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
          event: "MULTIPLE-FOLDERS-AND-FILES_DELETED",
          description: `${email} Deleted ${JSON.stringify(
            selectedItems
          )} permanent`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteSelectedConfirm(false);
        setLoadingDeleteFile(false);
        setDeleteAllLoader(false);
        setSelectedItems([]);
        fetchAllFiles();
        fetchAllFolder();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // Delete All  filev
  const RestoreAllTrash = async () => {
    setRestoreAllLoader(true);

    const postData = {
      user_id: user?.user_id,
    };
    try {
      const apiData = await post("file/restoreTrash", postData); // Specify the endpoint you want to call
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
          event: "RESTORED-TRASH",
          description: `${email} Restored all Trash Files and Folders`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
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
  // Restore selcted
  const RestoreSelectedTrash = async () => {
    setRestoreAllLoader(true);

    const postData = {
      items: selectedItems,
    };
    try {
      const apiData = await post("file/restoreSelectedTrash", postData); // Specify the endpoint you want to call
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
          event: "MULTIPLE-FOLDERS-AND-FILES_RESTORED",
          description: `${email} RESTORED ${JSON.stringify(selectedItems)}`,
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

  // Restore folderv api
  const RestoreFolder = async () => {
    setLoadingDelete(true);
    //console.log(deleteFolderId);
    const postData = {
      folder_id: deleteFolderId,
    };
    try {
      const apiData = await post("folder/restore-folder", postData); // Specify the endpoint you want to call
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
          event: "FOLDER-RESTORED",
          description: `${email} Restored Folder ${folderName}`,
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
      const apiData = await post("file/restore-file", postData); // Specify the endpoint you want to call
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
          event: "FILE-RESTORED",
          description: `${email} Restored file ${folderName}`,
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
  const RestoreFileTemp = async () => {
    setLoadingDeleteFile(true);
    //console.log(deleteFolderId);
    const postData = {
      file_id: deleteFolderId,
    };
    try {
      const apiData = await post("file/restore-file-temp", postData); // Specify the endpoint you want to call
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
          event: "FILE-RESTORED",
          description: `${email} Restored file ${folderName}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemRestoreConfirmationFileTemp(false);
        setLoadingDeleteFile(false);
        fetchAllFiles();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
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
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items to display per page
  // Number of items to display per page
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
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  // useEffect(() => {
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
  // }, [StatusData]);

  // Add this state variable at the beginning of your component
  const [selectedItems, setSelectedItems] = useState([]);

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

  // Add this function to handle the delete selected button click
  const handleDeleteSelected = async () => {
    setIsLoading(true);
    for (const item of selectedItems) {
      await deleteItemApi(item); // Replace this with your actual API call
    }
    //console.log('Selected items deleted');
    setIsLoading(false);
  };
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
  const icon_size = window.innerWidth < 730 ? 20 : 30;
  const fontSize = window.innerWidth < 730 ? 14 : 16;
  const icon_size_fc = window.innerWidth < 730 ? 15 : 20;
  return (
    <div>
      <FreeTrialAlert
        isSubscripitonActive={isSubscripitonActive}
        subscription={subscription}
        isFreeTrialExpired={isFreeTrialExpired}
        daysleftExpired={daysLeftExpiredfreePlan}
      />
      {/* Row for table view and card view of documnets  */}
      <Row>
        {window.innerWidth < 730 ? (
          <>
            <Col
              md="12"
              xs="12"
              className="d-flex justify-content-center "
              style={{ flexDirection: "column" }}
            >
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1>{t("Trash")}</h1>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  {filesArray.length === 0 && foldersArray.length === 0 ? (
                    <></>
                  ) : (
                    <>
                      {restoreAllLoader ? (
                        <Spinner
                          color="primary"
                          style={{ marginLeft: "10px" }}
                        />
                      ) : (
                        <RefreshCcw
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
                      )}
                      {deleteAllLoader ? (
                        <Spinner
                          color="primary"
                          style={{ marginLeft: "10px" }}
                        />
                      ) : (
                        <Trash2
                          id="DeleteAll"
                          onClick={() => {
                            // setDeleteAllLoader(true)
                            if (selectedItems.length === 0) {
                              setItemDeleteAllConfirm(true);
                            } else {
                              //console.log('selectedItems');

                              //console.log(selectedItems);
                              setItemDeleteSelectedConfirm(true);
                            }
                          }}
                          size={20}
                          style={{
                            cursor: "pointer",
                            marginLeft: "10px",
                            color: "red",
                          }}
                        />
                      )}
                      <UncontrolledTooltip
                        placement="bottom"
                        target="DeleteAll"
                      >
                        {t("Delete")}
                      </UncontrolledTooltip>
                      <UncontrolledTooltip
                        placement="bottom"
                        target="RestoreAll"
                      >
                        {t("Restore")}
                      </UncontrolledTooltip>
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
                </div>{" "}
              </div>
              <h4 style={{ color: "red", marginTop: "20px" }}>
                {t("Trash Items will be deleted after 14 days")}
              </h4>

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
                          let ids =
                            JSON.parse(localStorage.getItem("ids")) || [];

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
              </span>
            </Col>{" "}
          </>
        ) : (
          <Col md="12" xs="12" className="d-flex justify-content-between">
            <div>
              <h1>{t("Trash")}</h1>
              <h4 style={{ color: "red" }}>
                {t("Trash Items will be deleted after 14 days")}
              </h4>
            </div>
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
            </span>

            <div
              style={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              {filesArray.length === 0 && foldersArray.length === 0 ? (
                <></>
              ) : (
                <>
                  {restoreAllLoader ? (
                    <Spinner color="primary" style={{ marginLeft: "10px" }} />
                  ) : (
                    <RefreshCcw
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
                  )}
                  {deleteAllLoader ? (
                    <Spinner color="primary" style={{ marginLeft: "10px" }} />
                  ) : (
                    <Trash2
                      id="DeleteAll"
                      onClick={() => {
                        // setDeleteAllLoader(true)
                        if (selectedItems.length === 0) {
                          setItemDeleteAllConfirm(true);
                        } else {
                          //console.log('selectedItems');

                          //console.log(selectedItems);
                          setItemDeleteSelectedConfirm(true);
                        }
                      }}
                      size={20}
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red",
                      }}
                    />
                  )}
                  <UncontrolledTooltip placement="bottom" target="DeleteAll">
                    {t("Delete")}
                  </UncontrolledTooltip>
                  <UncontrolledTooltip placement="bottom" target="RestoreAll">
                    {t("Restore")}
                  </UncontrolledTooltip>
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
        )}

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
                      {filesTemp.map((item, index) => (
                        <>
                          <Col md="4" xs="12">
                            <Card>
                              {/* <CardImg top src={img1} alt='card1' /> */}
                              <CardBody style={{ cursor: "pointer" }}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <CardTitle
                                    tag="h4"
                                    className="d-flex justify-content-left align-items-center"
                                  >
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
                                        marginLeft: "10px",
                                        marginTop: "2%",
                                      }}
                                    >
                                      {item.file_name}
                                    </span>
                                    {/* <span style={{ marginLeft: '10px' }}>
                                    {item.name}
                                  </span> */}
                                  </CardTitle>
                                  {/* folder icon here */}
                                  {/* <File size={24} /> */}
                                </div>

                                <Col md="12" xs="12">
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <RefreshCcw
                                        size={icon_size_fc}
                                        id="view"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          setDeleteFolderId(item.template_id);
                                          setFolderName(item.file_name);
                                          setItemRestoreConfirmationFileTemp(
                                            true
                                          );
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
                                        size={icon_size_fc}
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                          color: "red",
                                        }}
                                        onClick={() => {
                                          setDeleteFolderId(item.template_id);
                                          setFolderName(item.file_name);
                                          setItemDeleteConfirmationFileTemp(
                                            true
                                          );
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
                                        style={{ marginLeft: "100px" }}
                                      >
                                        {item.deleted_at===null?null:formatDateCustomTimelastActivity(
                                          item.deleted_at)}
                                      </h3>
                                    </div>
                                  </div>
                                </Col>
                              </CardBody>
                            </Card>
                          </Col>
                        </>
                      ))}
                      {currentItems.map((item, index) => (
                        <>
                          {item.file_id === null ||
                          item.file_id === undefined ? (
                            <Col md="4" xs="12">
                              <Card>
                                {/* <CardImg top src={img1} alt='card1' /> */}
                                <CardBody className="d-flex justify-content-between align-items-center">
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
                                            fontSize: `${fontSize}px`,
                                            marginLeft: "10px",
                                            marginTop: "2%",
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
                                        <div style={{ display: "flex" }}>
                                          <RefreshCcw
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
                                            style={{
                                              marginLeft:
                                                window.innerWidth < 730
                                                  ? "10px"
                                                  : "100px",
                                              fontSize: `${fontSize}px`,
                                            }}
                                          >
                                            {formatDateCustomTimelastActivity(
                                              item.deleted_at
                                              
                                            )}
                                          </h3>
                                        </div>
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
                          ) : (
                            <Col md="4" xs="12">
                              <Card>
                                {/* <CardImg top src={img1} alt='card1' /> */}
                                <CardBody style={{ cursor: "pointer" }}>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <CardTitle
                                      tag="h4"
                                      className="d-flex justify-content-left align-items-center"
                                    >
                                      <img
                                        src={pdfIcon}
                                        alt="pdf icon"
                                        style={{
                                          width: `${icon_size}px`,
                                          height: `${icon_size}px`,
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: `${fontSize}px`,
                                          marginLeft: "10px",
                                          marginTop: "2%",
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
                                    {window.innerWidth < 730 ? (
                                      <>
                                        <div style={{ marginTop: "-25px" }}>
                                          {item.status === "InProgress" ? (
                                            <Badge color="info">
                                              <Clock
                                                size={12}
                                                className="align-middle me-25"
                                              />
                                            </Badge>
                                          ) : null}
                                          {item.status ===
                                          "WaitingForOthers" ? (
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
                                        </div>{" "}
                                      </>
                                    ) : (
                                      <div style={{ marginTop: "-25px" }}>
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
                                      </div>
                                    )}
                                  </div>

                                  <Col md="12" xs="12">
                                    <div className="d-flex justify-content-between">
                                      <div style={{ display: "flex" }}>
                                        <RefreshCcw
                                          size={icon_size_fc}
                                          id="view"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            setDeleteFolderId(item.file_id);
                                            setFolderName(item.name);
                                            setItemRestoreConfirmationFile(
                                              true
                                            );
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
                                          style={{ marginLeft: window.innerWidth<730?"5px":"100px",fontSize: `${fontSize}px`}}
                                        >
                                          {formatDateCustomTimelastActivity(
                                            item.deleted_at
                                           
                                          )}
                                        </h3>
                                      </div>
                                    </div>
                                  </Col>
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
                      {/* <Card style={{padding: '15px'}}> */}
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th></th>
                              <th>
                                <h2 style={{ fontWeight: 700 }}>{t("Name")}</h2>
                              </th>
                              <th>
                                <h2 style={{ fontWeight: 700 }}>
                                  {t("Status")}
                                </h2>
                              </th>
                              <th>
                                <h2 style={{ fontWeight: 700 }}>
                                  {t("Deleted at")}
                                </h2>{" "}
                              </th>
                              <th>
                                <h2 style={{ fontWeight: 700 }}>
                                  {t("Actions")}
                                </h2>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {foldersArray.length > 0
                              ? foldersArray.map((item, index) => (
                                  <>
                                    <tr>
                                      <td>
                                        <input
                                          type="checkbox"
                                          onChange={(event) =>
                                            handleCheckboxChange(
                                              event,
                                              item.folder_id,
                                              "folder",
                                              item.folder_name
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <span style={{ display: "flex" }}>
                                          <Folder
                                            style={{ color: `${item.color}` }}
                                            size={icon_size}
                                          />
                                          <h2 style={{ marginLeft: "20px" }}>
                                            {item.folder_name}
                                          </h2>
                                        </span>
                                      </td>
                                      <td>--</td>
                                      <td>
                                        {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
                                        <h3>
                                          {formatDateCustomTimelastActivity(
                                            item.deleted_at
                                          )}
                                        </h3>

                                        {/* </div> */}
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-between">
                                          <div>
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
                                            <RefreshCcw
                                              size={20}
                                              id="view"
                                              style={{ cursor: "pointer" }}
                                              onClick={() => {
                                                //console.log('restore');
                                                setDeleteFolderId(
                                                  item.folder_id
                                                );
                                                setFolderName(item.folder_name);
                                                setItemRestoreConfirmation(
                                                  true
                                                );
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
                                                setDeleteFolderId(
                                                  item.folder_id
                                                );
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
                                  </>
                                ))
                              : null}
                            {filesArray.length > 0
                              ? filesArray.map((item, index) => (
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
                                        <h2 style={{ marginLeft: "20px" }}>
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
                                      <h3>
                                        {formatDateCustomTimelastActivity(
                                          item.deleted_at
                                        )}
                                      </h3>

                                      {/* </div> */}
                                    </td>
                                    <td>
                                      <div className="d-flex justify-content-between">
                                        <div>
                                          {/* view  */}
                                          <RefreshCcw
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
                                              setItemDeleteConfirmationFile(
                                                true
                                              );
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
                                ))
                              : null}
                          </tbody>
                        </Table>
                      </div>
                      {/* </Card> */}
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
              </Row>
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
            </TabPane>
          </TabContent>
        </div>
      </Row>

      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteFolder}
        alertStatusDelete={"delete"}
        text={t("Are you sure you want to permanently delete this Folder?")}
      />
      {/* Restotre Folder  */}

      <ModalConfirmationAlert
        isOpen={itemRestoreConfirmation}
        toggleFunc={() => setItemRestoreConfirmation(!itemRestoreConfirmation)}
        loader={loadingDelete}
        callBackFunc={RestoreFolder}
        text={t("Are you sure you want to restore this Folder?")}
      />
      {/* delete file  */}
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmationFile}
        toggleFunc={() =>
          setItemDeleteConfirmationFile(!itemDeleteConfirmationFile)
        }
        loader={loadingDeleteFile}
        callBackFunc={DeleteFile}
        alertStatusDelete={"delete"}
        text={t("Are you sure you want to permanently delete this File?")}
      />
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmationFileTemp}
        toggleFunc={() =>
          setItemDeleteConfirmationFileTemp(!itemDeleteConfirmationFileTemp)
        }
        loader={loadingDeleteFile}
        callBackFunc={DeleteFileTemp}
        alertStatusDelete={"delete"}
        text={t("Are you sure you want to permanently delete this File?")}
      />
      {/* Modal delete All File  */}

      <ModalConfirmationAlert
        isOpen={ItemDeleteAllConfirm}
        toggleFunc={() => setItemDeleteAllConfirm(!ItemDeleteAllConfirm)}
        loader={deleteAllLoader}
        callBackFunc={DeleteAllTrash}
        alertStatusDelete={"delete"}
        text={t("Are you sure you want to empty Trash?")}
      />
      <ModalConfirmationAlert
        isOpen={ItemDeleteSelectedConfirm}
        toggleFunc={() =>
          setItemDeleteSelectedConfirm(!ItemDeleteSelectedConfirm)
        }
        loader={deleteAllLoader}
        callBackFunc={DeleteSelectedTrash}
        alertStatusDelete={"delete"}
        text={`${t("Are you sure you want to permanently delete these")} ${
          selectedItems.length
        } ${t("Items")}?`}
      />

      {/* restore all trash  */}
      <ModalConfirmationAlert
        isOpen={ItemRestoreAllConfirm}
        toggleFunc={() => setItemRestoreAllConfirm(!ItemRestoreAllConfirm)}
        loader={restoreAllLoader}
        callBackFunc={RestoreAllTrash}
        text={t("Are you sure you want to restore Trash?")}
      />
      {/* Restore selected  */}
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
      {/* Modal restore File  */}
      <ModalConfirmationAlert
        isOpen={itemRestoreConfirmationFile}
        toggleFunc={() =>
          setItemRestoreConfirmationFile(!itemRestoreConfirmationFile)
        }
        loader={loadingDeleteFile}
        callBackFunc={RestoreFile}
        text={t("Are you sure you want to restore this File?")}
      />
      <ModalConfirmationAlert
        isOpen={itemRestoreConfirmationFileTemp}
        toggleFunc={() =>
          setItemRestoreConfirmationFileTemp(!itemRestoreConfirmationFileTemp)
        }
        loader={loadingDeleteFile}
        callBackFunc={RestoreFileTemp}
        text={t("Are you sure you want to restore this File?")}
      />
    </div>
  );
};

export default TrashPage;
