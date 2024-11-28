import { useEffect, useMemo, useState } from "react";
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
  Label,
  Input,
  UncontrolledTooltip,
  ButtonGroup,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Table,
  Alert,
  Spinner,
} from "reactstrap";
import { BASE_URL, get, post } from "../apis/api";

import {
  AlignJustify,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  AtSign,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  Eye,
  FilePlus,
  Folder,
  FolderPlus,
  Grid,
  Move,
  Plus,
  RotateCw,
  Trash2,
  User,
  Users,
  X,
} from "react-feather";
import {
  formatDateCustomTimelastActivity,
  handleDownloadPDFApp,
  highlightText,
} from "../utility/Utils";

import { useParams, useNavigate } from "react-router-dom";
import pdfIcon from "../assets/images/pages/pdfIcon.png";
import emptyImage from "@assets/images/pages/empty.png";

import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import UploadFile from "../components/upload-file/FileUploaderSingle";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";

import "react-phone-input-2/lib/bootstrap.css";
import "./StylesheetPhoneNo.css";
import getUserPlan from "../utility/IpLocation/GetUserPlanData";
import ModalUpgradePremium from "../components/ModalUpgradePremium";
// import ModalConfirmationCompanyProfile from "../components/ModalConfirmationCompanyProfile";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getUser,
  selectCompanyProfile,
  selectDaysLeftExpiredfreePlan,
  selectDocumentCount,
  selectIsFreeTrialExpired,
  selectIsSubscriptionActive,
  selectLoading,
  selectLogo,
  selectPlan,
  selectPrimaryColor,
  selectSubscription,
  selectUser,
} from "../redux/navbar";

import CustomButton from "../components/ButtonCustom";
import SpinnerCustom from "../components/SpinnerCustom";
import WelcomeNewUser from "./Home/WelcomeNewUser";
import StatsGrid from "./Home/StatsVerticalComponent";
import DesktopNav from "./Home/DesktopNav";
import MobileSelect from "./Home/MobileSelect";
import CustomBadge from "../components/BadgeCustom";
import { useTranslation } from "react-i18next";
import { decrypt } from "../utility/auth-token";
import ActivityLogModal from "../components/modal/ActivityLogModal";
import PaginationComponent from "../components/pagination/PaginationComponent";
import FreeTrialAlert from "../components/FreeTrailAlert";

const Home = ({ modalOpenFile }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    //   user,
    //   plan,
    //   subscription,
    //   isFreeTrialExpired,
    //   isSubscripitonActive,
    //   daysLeftExpiredfreePlan,
    //   docuemntsCount,
    status,
    error,
  } = useSelector((state) => state.navbar);
  const user = useSelector(selectUser);
  const subscription = useSelector(selectSubscription);
  const plan = useSelector(selectPlan);
  const loading = useSelector(selectLoading);
  const company_profile = useSelector(selectCompanyProfile);
  const isFreeTrialExpired = useSelector(selectIsFreeTrialExpired);
  const daysLeftExpiredfreePlan = useSelector(selectDaysLeftExpiredfreePlan);
  const isSubscripitonActive = useSelector(selectIsSubscriptionActive);
  const primary_color = useSelector(selectPrimaryColor);
  const docuemntsCount = useSelector(selectDocumentCount);

  const [modalUpgradePremium, setModalUpgradePremium] = useState(false);
  const [FileToMove, setFileToMove] = useState("");
  // const [active, setActive] = useState('1');
  const [active, setActive] = useState(() => {
    const storedActiveTab = localStorage.getItem("tabActive");
    return storedActiveTab !== null ? storedActiveTab : "1";
  });
  const { subFolderId, prevId } = useParams();
  const navigate = useNavigate();
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const [modal, setModal] = useState(false);
  const [modalMove, setModalMove] = useState(false);
  const [errorRequired, setErrorRequired] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [TypeTemp, setTypeTemp] = useState("Files");
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [foldersArray, setFoldersArray] = useState([]);
  const [foldersArrayMove, setFoldersArrayMove] = useState([]);

  const [filesArray, setFilesArray] = useState([]);

  const fetchAllFolder = async () => {
    //console.log(subFolderId);
    setFolderLoader(true);
    if (
      StatusData === "Completed" ||
      StatusData === "null" ||
      StatusData === null
    ) {
      if (subFolderId === null || subFolderId === undefined) {
        // const items = JSON.parse(localS

        const postData = {
          user_id: user?.user_id,
          subFolder: false,
        };
        try {
          const apiData = await post("folder/folder_by_user_id", postData); // Specify the endpoint you want to call
          console.log("GET FOLDER BY USER ID ");

          console.log(apiData);
          if (apiData.error === true || apiData.error === undefined) {
            // toastAlert("error", apiData.message)
            setFoldersArray([]);
            setFolderLoader(false);
          } else {
            // toastAlert("success", apiData.message);
            //console.log(apiData.result);
            setFolderLoader(false);
            setFoldersArray(apiData.result);
          }
        } catch (error) {
          setFolderLoader(false);
          //console.log('Error fetching data:', error);
        }
      } else {
        const postData = {
          user_id: user?.user_id,
          subFolder: true,
          subFolder_id: subFolderId,
        };
        try {
          const apiData = await post("folder/folder_by_user_id", postData); // Specify the endpoint you want to call
          console.log("GET FOLDER BY USER ID ");

          console.log(apiData);
          if (apiData.error === true || apiData.error === undefined) {
            // toastAlert("error", apiData.message)
            setFolderLoader(false);
            setFoldersArray([]);
          } else {
            toastAlert("success", apiData.message);
            //console.log(apiData.result);
            setFolderLoader(false);
            setFoldersArray(apiData.result);
          }
        } catch (error) {
          setFolderLoader(false);
          //console.log('Error fetching data:', error);
        }
        // setFolderLoader(false);
      }
    } else {
      // setFolderLoader(false);
      setFolderLoader(false);
      setFoldersArray([]);
    }
  };
  const fetchAllFoldersForModalMove = async () => {
    const postData = {
      user_id: user?.user_id,
    };
    try {
      const apiData = await post("folder/getAllFoldersByUserIds", postData); // Specify the endpoint you want to call
      //console.log('_____GET FOLDER BY USER ID ____ ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        // toastAlert("error", apiData.message)
        setFoldersArrayMove([]);
      } else {
        //console.log(apiData.result);
        setFoldersArrayMove(apiData.result);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const [completeProfileD, setCompleteProfileD] = useState(false);

  const [templateArray, setTemplateArray] = useState([]);
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
        company_id: user?.company_id,
        // user_id: 100617,
        subFolder: false,
        status: statusData,
      };
      try {
        const apiData = await post("file/files_by_user_id", postData); // Specify the endpoint you want to call
        console.log("GET Files BY USER ID ");

        console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFilesArray([]);
          setFolderLoader(false);
        } else {
          // toastAlert("success", apiData.message);
          console.log(apiData.result);
          console.log("Files By user id");

          //console.log(apiData.result1);

          if (apiData.result1 === null || apiData.result1 === undefined) {
            setTemplateArray([]);
            setFolderLoader(false);
          } else {
            setTemplateArray(apiData.result1);
          }
          setFolderLoader(false);

          setFilesArray(apiData.result);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
        setFolderLoader(false);
      }
    } else {
      setTypeTemp("Files");

      const postData = {
        user_id: user?.user_id,
        // user_id: 100617,
        subFolder: true,
        subFolder_id: subFolderId,
        status: statusData,
      };
      try {
        const apiData = await post("file/files_by_user_id", postData); // Specify the endpoint you want to call
        //console.log('GET Files BY USER ID Subfolder');

        //console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFilesArray([]);
          setFolderLoader(false);
        } else {
          toastAlert("success", apiData.message);
          //console.log(apiData.result);
          setFilesArray(apiData.result);
          setFolderLoader(false);
        }
      } catch (error) {
        setFolderLoader(false);
        //console.log('Error fetching data:', error);
      }
    }
    setLoaderData(false);
  };
  // pagination
  const [sortDirection, setSortDirection] = useState("asc");

  const [referalCodes, setReferalCodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items to display per page
  let allItems = [...foldersArray, ...filesArray];
  // Calculate the index of the first and last item on the current page
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [sortField, setSortField] = useState(""); // Field to sort by
  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };
  const sortItems = (items) => {
    return items.sort((a, b) => {
      let fieldA, fieldB;
      if (sortField === "name") {
        fieldA = `${a.name || ""} `.toLowerCase();
        fieldB = `${b.name || ""}`.toLowerCase();
      }

      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };
  // Assuming you have your data stored in an array called `allItems`
  // let currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);
  let currentItems = sortItems(
    allItems.slice(indexOfFirstItem, indexOfLastItem)
  );
  const handlePageChangeNo = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
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
  // temp
  const sizeP_icon = window.innerWidth < 730 ? 15 : 20;
  const pdfIcon_width = window.innerWidth < 730 ? "20px" : "30px";
  const folder_icon_size= window.innerWidth < 730 ? 20 : 30;
  const text_name_size=window.innerWidth < 730 ? "14px" : "16px";
  // end
  // add folder
  const [addFolderLoader, setAddFolderLoader] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [deleteFolderId, setDeleteFolderId] = useState("");
  const addFolder = async () => {
    let locationUser = await getUserLocation();
    if (errorRequired === true || folderName === "") {
      setErrorRequired(true);
    } else {
      setAddFolderLoader(true);
      if (subFolderId === null || subFolderId === undefined) {
        const postData = {
          user_id: user?.user_id,
          folder_name: folderName,
          color: selectedColor,
          subFolder: false,
          uploaded_at: locationUser.date,
        };
        try {
          const apiData = await post("folder/create-folder", postData); // Specify the endpoint you want to call
          //console.log('CREATE FOLDER BY USER-ID ');

          //console.log(apiData);
          if (apiData.error === true || apiData.error === undefined) {
            toastAlert("error", apiData.message);
            // setFilesArray([])
            setAddFolderLoader(false);
          } else {
            toastAlert("success", apiData.message);
            //console.log(apiData.result);
            const user_id = user?.user_id;
            const email = user?.email;

            let response_log = await getActivityLogUser({
              user_id: user_id,
              event: "FOLDER-CREATED",
              description: `${email} created folder ${folderName}`,
            });
            if (response_log === true) {
              //console.log('MAINTAIN LOG SUCCESS');
            } else {
              //console.log('MAINTAIN ERROR LOG');
            }
            // setFilesArray(apiData.result)
            setModal(false);
            setFolderName("");
            fetchAllFolder();
            setErrorRequired(false);
            setAddFolderLoader(false);
            fetchAllFoldersForModalMove();
          }
        } catch (error) {
          //console.log('Error fetching data:', error);
          setAddFolderLoader(false);
        }
      } else {
        const postData = {
          user_id: user?.user_id,
          folder_name: folderName,
          subFolder: true,
          color: selectedColor,
          subFolder_id: subFolderId,
          uploaded_at: locationUser.date,
        };
        try {
          const apiData = await post("folder/create-folder", postData); // Specify the endpoint you want to call
          //console.log('CREATE FOLDER BY USER-ID ');

          //console.log(apiData);
          if (apiData.error === true || apiData.error === undefined) {
            toastAlert("error", apiData.message);
            // setFilesArray([])
            setAddFolderLoader(false);
          } else {
            toastAlert("success", apiData.message);
            //console.log(apiData.result);
            const user_id = user?.user_id;
            const email = user?.email;

            let response_log = await getActivityLogUser({
              user_id: user_id,
              event: "FOLDER-CREATED",
              description: `${email} created folder ${folderName}`,
            });
            if (response_log === true) {
              //console.log('MAINTAIN LOG SUCCESS');
            } else {
              //console.log('MAINTAIN ERROR LOG');
            }
            // setFilesArray(apiData.result)
            setModal(false);
            setFolderName("");
            fetchAllFolder();
            setErrorRequired(false);
            setAddFolderLoader(false);
          }
        } catch (error) {
          //console.log('Error fetching data:', error);
          setAddFolderLoader(false);
        }
      }
    }
  };
  // update folder
  const [addFolderLoaderUpdate, setAddFolderLoaderUpdate] = useState(false);
  const [folderNameUpdate, setFolderNameUpdate] = useState("");
  const [modalUpdate, setModalUpdate] = useState(false);
  const [errorRequiredUpdate, setErrorRequiredUpdate] = useState(false);
  const updateFolder = async () => {
    if (errorRequiredUpdate === true || folderNameUpdate === "") {
      setErrorRequiredUpdate(true);
    } else {
      setAddFolderLoaderUpdate(true);
      const postData = {
        folder_id: deleteFolderId,
        folder_name: folderNameUpdate,

        // subFolder: false,
        // subFolder_id:"dsdfdf"
      };
      try {
        const apiData = await post("folder/rename_folder", postData); // Specify the endpoint you want to call
        //console.log('UPDATE FOLDER BY USER-ID ');

        //console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          toastAlert("error", apiData.message);
          // setFilesArray([])
          setAddFolderLoaderUpdate(false);
        } else {
          toastAlert("success", apiData.message);
          //console.log(apiData.result);

          const user_id = user?.user_id;
          const email = user?.email;

          let response_log = await getActivityLogUser({
            user_id: user_id,
            event: "RENAME_FOLDER",
            description: `${email} renamed folder to ${folderNameUpdate}`,
          });
          if (response_log === true) {
            //console.log('MAINTAIN LOG SUCCESS');
          } else {
            //console.log('MAINTAIN ERROR LOG');
          }
          // setFilesArray(apiData.result)
          setModalUpdate(false);
          setFolderNameUpdate("");
          setAddFolderLoaderUpdate(false);
          fetchAllFolder();
          setErrorRequiredUpdate(false);
          fetchAllFoldersForModalMove();
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
        setAddFolderLoaderUpdate(false);
      }
    }
  };

  // delete folder
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [itemDeleteConfirmationFile, setItemDeleteConfirmationFile] =
    useState(false);
  const [itemArchieveConfirmation, setItemArchieveConfirmation] =
    useState(false);
  const [itemArchieveConfirmationFile, setItemArchieveConfirmationFile] =
    useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);

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
        toastAlert("success", apiData.message);
        //console.log(apiData.result);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "FOLDER-DELETED",
          description: `${email} deleted folder ${folderName}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation(false);
        setLoadingDelete(false);
        setFolderName("");
        fetchAllFolder();
        fetchAllFoldersForModalMove();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // ArchieveFolder
  const ArchieveFolder = async () => {
    setLoadingDelete(true);
    const location = await getUserLocation();
    //console.log(deleteFolderId);
    const postData = {
      archived_at: location.date,
      folder_id: deleteFolderId,
    };
    try {
      const apiData = await post("folder/ArchieveFolders", postData); // Specify the endpoint you want to call
      //console.log('DELETE FOLDER BY USER-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("success", apiData.message);
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user?.user_id,
          event: "FOLDER-ARCHIVED",
          description: `${email} archived folder ${folderName}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemArchieveConfirmation(false);
        setLoadingDelete(false);
        setFolderName("");
        fetchAllFolder();
        fetchAllFoldersForModalMove();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const handleSelectChange = (e) => {
    console.log(e.target.value);
    localStorage.setItem("tabActive", e.target.value);
    // setFolderLoader(true);
    const dropdownselectvalue = parseInt(e.target.value);
    let status_choosen;
    setFolderLoader(true);
    setCurrentPage(dropdownselectvalue);
    if (dropdownselectvalue === 1) {
      setStatusData("InProgress");
      status_choosen = "InProgress";
    } else if (dropdownselectvalue === 2) {
      setStatusData("WaitingForOthers");
      status_choosen = "WaitingForOthers";
    } else if (dropdownselectvalue === 3) {
      setStatusData("WaitingForMe");
      status_choosen = "WaitingForMe";
    } else if (dropdownselectvalue === 4) {
      setStatusData("Completed");
      status_choosen = "WaitingForMe";
    }
    fetchAllFiles(status_choosen);
  };
  //{t("Delete")} filev
  const DeleteFile = async () => {
    setLoadingDeleteFile(true);
    //console.log(deleteFolderId);
    const location = await getUserLocation();

    // let today_date=new Date()
    const postData = {
      file_id: deleteFolderId,
      deleted_at:location.date
    };
    try {
      const apiData = await post("file/delete-file", postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("success", apiData.message);
        //console.log(apiData.result);

        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "FILE-DELETED",
          description: `${email} deleted file  "${folderName}"`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        // setFilesArray(apiData.result)
        setItemDeleteConfirmationFile(false);
        setFolderName("");
        setLoadingDeleteFile(false);
        fetchAllFiles(StatusData);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  //{t("Delete")} filev
  const ArchieveFile = async () => {
    setLoadingDeleteFile(true);
    const location = await getUserLocation();

    //console.log(deleteFolderId);
    const postData = {
      file_id: deleteFolderId,
      archived_at: location.date,
    };
    try {
      const apiData = await post("file/archiev_file", postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("success", apiData.message);
        //console.log(apiData.result);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "FILE-ARCHIVED",
          description: `${email} archived file  "${folderName}"`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        // setFilesArray(apiData.result)
        setItemArchieveConfirmationFile(false);
        setLoadingDeleteFile(false);
        setFolderName("");
        fetchAllFiles(StatusData);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // Add files
  const [show, setShow] = useState(modalOpenFile === true ? true : false);
  const getInitialStatusData = () => {
    const storedActiveTab = localStorage.getItem("tabActive");
    switch (storedActiveTab) {
      case "2":
        return "WaitingForOthers";
      case "3":
        return "WaitingForMe";
      case "4":
        return "Completed";
      default:
        return "InProgress";
    }
  };
  const [StatusData, setStatusData] = useState(getInitialStatusData());

  const [rSelected, setRSelected] = useState(window.innerWidth < 768 ? 1 : 2);
  const [subfolderState, setSubfolderState] = useState(false);
  const [folderLoader, setFolderLoader] = useState(false);
  const [welcomeNewUser, setWelcomeNewUser] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#00cfe8");
  const colors = [
    "#00cfe8",
    "#ff7979",
    "#76c476",
    "#3535fc",
    "#fea4d7",
    "#ffd17c",
  ];
  const [inprogressFiles, setInprogressFiles] = useState(0);
  const [completedFiles, setCompletedFiles] = useState(0);
  const [waitingformeFiles, setWaitingformeFiles] = useState(0);
  const [waitingforothersFiles, setWaitingforothersFiles] = useState(0);

  const statusTrueLoginUserFirstTime = async () => {
    const postData = {
      user_id: user?.user_id,
    };
    const apiData = await post(
      "user/updateProfilefirst_time_logged_in",
      postData
    ); // Specify the endpoint you want to call
    //console.log(apiData);
    if (apiData.error) {
    } else {
      //console.log('Email sent');
      // Get the current object from localStorage and parse it
      // // Update the token property
      // userLoginRS.token = apiData.data; // Replace newToken with the new token value
      // // Stringify the updated object and save it back to localStorage
    }
  };
  const fetchAllCardsDashboard = async () => {
    const postData = {
      user_id: user.user_id,
    };
    const apiData = await post("file/getFilesCount", postData); // Specify the endpoint you want to call
    //console.log('DSAHBOARD');

    //console.log(apiData);
    if (apiData.error) {
    } else {
      setInprogressFiles(apiData.data.inprogress);
      setCompletedFiles(apiData.data.completed);
      setWaitingformeFiles(apiData.waitingForMe);
      setWaitingforothersFiles(apiData.data.waitingforothers);
    }
  };
  // Search Bar
  const [searchQuery, setSearchQuery] = useState("");

  const [loaderData, setLoaderData] = useState(true);
  const [ActivityLogData, setActivityLogData] = useState([]);

  // Filtered items based on the search query
  const [LoaderDataIP, setLoaderDataIP] = useState(false);
  // const filteredItems = searchQuery.trim() === '' ? [] : filesArray.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  // const filteredItems = filesArray.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredItems = filesArray.filter((item) => {
    const fullName = `${item.name || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  // const filteredItemstemp = templateArray.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const [showLog, setShowLog] = useState(false);
  const [fileNameOpened, setFileNameOpened] = useState("");
  const getActivityLog = async (file_id) => {
    setLoaderDataIP(true);
    setShowLog(true);
    //console.log('Audit Log ');
    const postData = {
      file_id: file_id,
    };
    const apiData1 = await post("file/getFileActivityLog", postData); // Specify the endpoint you want to call
    //console.log('Audit Log');

    //console.log(apiData1);
    setFileNameOpened(apiData1?.fileDetail[0]?.name);
    // fileDetail
    if (apiData1.data.length === 0) {
      setLoaderDataIP(false);
      toastAlert("error", "No Audit Log Added");
    } else {
      const user_id = user?.user_id;
      const email = user?.email;

      let response_log = await getActivityLogUser({
        user_id: user_id,
        event: "VIEWED-ACTIVITY-LOG",
        description: `${email} viewed file log of ${apiData1?.fileDetail[0]?.name}`,
      });
      if (response_log === true) {
        //console.log('MAINTAIN LOG SUCCESS');
      } else {
        //console.log('MAINTAIN ERROR LOG');
      }
      // const formattedData = await Promise.all(
      //   apiData1.data.map(async item => {
      //     const formattedDate = await formatDateTimeZone(item.location_date, item.ip_address);
      //     // const timeZone=userTimezone?.timezone

      //     return {...item, formattedDate: formattedDate.dateTime, timeZone: formattedDate?.timeZone};
      //   }),
      // );
      setLoaderDataIP(false);
      setActivityLogData(apiData1.data); // Set the state with formatted data
    }
  };
  const [locationIP, setLocationIP] = useState("");

  const [notCompletedProfile, setNotCompletedprofile] = useState(false);

  const [companyData, setCompanyData] = useState([]);
  const [companyId, setCompanyId] = useState("");

  const [LoaderFileAdd, setLoaderFileAdd] = useState(false);
  const getCheckUserPlan = async () => {
    const profileCompleted = await getUserPlan(user?.user_id);
    //console.log('PROFILE  COMPLETED PLAN ');
    //console.log(profileCompleted);
    return profileCompleted;
  };

  const [sortAscending, setSortAscending] = useState(true);

  // Function to toggle sort direction and sort items
  const toggleSort = () => {
    console.log("sortng");
    setSortAscending(!sortAscending);
  };

  const [userDetailsCurrent, setUserDetailsCutrrent] = useState(null);
  const [userPlanCurrent, setUserPlanCurrent] = useState(null);
  const [userTotalDocCount, setUserTotalDocCount] = useState(null);

  const [isHovered, setIsHovered] = useState(false);
  const fetchlocationUrl = () => {
    const queryString = window.location.search;

    // Parse the query string to get parameters
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the 'waitingforOtherstoast' parameter
    let waitingParam = urlParams.get("waitingforOtherstoast");
    let pricingParam = urlParams.get("pricing");
    //console.log('waitingParam');

    //console.log(waitingParam);
    if (waitingParam === "success") {
      // toastAlert('success', 'Document send for E-signing!');
      toggle("2");
      setStatusData("WaitingForOthers");
      // Remove the query parameter after 1 second
      setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 1000);
    }

    if (subFolderId !== null && subFolderId !== undefined) {
      setSubfolderState(true);
      toggle("4");
      setFolderLoader(true);
      setTimeout(() => {
        setStatusData("Completed");
      }, 1000);
      setCurrentPage(1);
    } else {
      setSubfolderState(false);
    }
    const firstTimeLogin = user?.first_time_logged_in;
    if (firstTimeLogin === false || firstTimeLogin === "false") {
      setWelcomeNewUser(true);
      statusTrueLoginUserFirstTime();
    } else {
      //console.log('FALSE FORST TIME USER');
      setWelcomeNewUser(false);
    }
  };
  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            fetchlocationUrl(),
            fetchAllFiles(StatusData),
            fetchAllFolder(),
            fetchAllCardsDashboard(),
            fetchAllFoldersForModalMove(),
          ]);
          console.log("REDUC SH ~HOMe");

          setUserDetailsCutrrent(user);
          setUserPlanCurrent(plan);
          console.log("PLAN DATA ");
          console.log(isFreeTrialExpired);

          console.log(docuemntsCount);
          setUserTotalDocCount(docuemntsCount);
          setLoaderData(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoaderData(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, status, StatusData]);
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

  return (
    <>
      {/* {freeTrailExpiredAlert ? (
        <> */}
      <FreeTrialAlert
        isSubscripitonActive={isSubscripitonActive}
        subscription={subscription}
        isFreeTrialExpired={isFreeTrialExpired}
        daysleftExpired={daysLeftExpiredfreePlan}
      />
      {/* </>
      ) : null} */}

      {loaderData ? (
        <SpinnerCustom
          color="primary"
          style={{ width: "3rem", height: "3rem" }}
        />
      ) : (
        // <Spinner color="primary" style={{width: '3rem', height: '3rem'}} />
        <>
          <div>
            {/* {planAlert ? (
        <Alert color={severity}>
          <h1 className='alert-body'>
            {message}.<strong style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = '/stripe_plan'
              }> Buy a subscription .</strong>
          </h1>
        </Alert>
      ) : null} */}
            {/* WElcome New User  */}
            {/* <p>{t('Home')}</p> */}
            <Row>
              <Col md="12" xs="12">
                {welcomeNewUser ? (
                  <>
                    {" "}
                    <WelcomeNewUser />
                  </>
                ) : null}
              </Col>
            </Row>
            {/*Cards side*/}
            <StatsGrid
              active={active}
              toggle={toggle}
              setFolderLoader={setFolderLoader}
              setStatusData={setStatusData}
              setCurrentPage={setCurrentPage}
              inprogressFiles={inprogressFiles}
              waitingforothersFiles={waitingforothersFiles}
              waitingformeFiles={waitingformeFiles}
              completedFiles={completedFiles}
            />

            {/* Row for table view and card view of documnets  */}
            <Row>
              {window.innerWidth < 786 ? (
                <>
                  <Col
                    md="12"
                    xs="12"
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {subfolderState ? (
                        <>
                          <Button
                            style={{ boxShadow: "none" }}
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
                                localStorage.setItem(
                                  "ids",
                                  JSON.stringify(ids)
                                );
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
                              Back
                            </span>
                          </Button>
                        </>
                      ) : null}
                    </span>

                    {/* <div></div> */}
                    <div style={{ flexGrow: 1, marginTop: "10px" }}>
                      <MobileSelect
                        active={active}
                        handleSelectChange={handleSelectChange}
                        toggle={toggle}
                        pcolorFromLocalStorage={primary_color}
                        setFolderLoader={setFolderLoader}
                        setStatusData={setStatusData}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                    <div style={{ marginRight: "10px", cursor: "pointer" }}>
                      <RotateCw
                        id="refresh-icon"
                        onClick={async () => {
                          //   setFolderLoader(true);
                          //  await fetchAllBulkLinks();
                          setFolderLoader(true);
                          await fetchAllFiles(StatusData);
                          await fetchAllFolder();
                        }}
                      />
                      <UncontrolledTooltip
                        placement="bottom"
                        target="refresh-icon"
                      >
                        Refresh
                      </UncontrolledTooltip>
                    </div>
                  </Col>

                  <Col xs={12} style={{ marginBlock: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "right",
                          alignItems: "center",
                        }}
                      >
                        <Input
                          style={{
                            height: "35px",
                            boxShadow: "none",
                            fontSize: "14px",
                            paddingLeft: "30px", // Add padding to make space for the icon
                          }}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          type="text"
                          id="login-email"
                          placeholder={t("Search by Name")}
                          autoFocus
                        />
                        {searchQuery && (
                          <span
                            style={{
                              position: "absolute",
                              right: "10px", // Adjust the position to fit the icon within the input
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setSearchQuery(""); // Clear the search query
                            }}
                          >
                            &times; {/* Cross icon (X) */}
                          </span>
                        )}
                      </div>
                      {StatusData === "InProgress" ? (
                        <CustomButton
                          // color="primary"
                          size="sm"
                          style={{
                            marginLeft: "10px",
                            marginRight: "10px",

                            display: "flex",
                            boxShadow: "none",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={async () => {
                            console.log("userPlanCurrent");
                            setShow(true);
                            setLoaderFileAdd(false);
                          }}
                          text={
                            <>
                              {LoaderFileAdd ? (
                                <SpinnerCustom color="primary" size="sm" />
                              ) : (
                                // <Spinner color="light" size="sm" />
                                <Plus size={24} style={{ cursor: "pointer" }} />
                              )}
                              <span style={{ marginLeft: "10px" }}>
                                {t("File")}
                              </span>
                            </>
                          }
                        />
                      ) : null}

                      {StatusData === "Completed" ? (
                        <CustomButton
                          color="primary"
                          size="sm"
                          style={{
                            marginLeft: "10px",
                            marginRight: "10px",

                            display: "flex",
                            boxShadow: "none",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          // onClick={toggleDropdown}
                          onClick={() => {
                            // toggleDropdown();
                            if (notCompletedProfile === true) {
                              setCompleteProfileD(true);
                            } else {
                              setModal(true);
                            }
                          }}
                          text={
                            <>
                              <Plus size={24} style={{ cursor: "pointer" }} />
                              <span style={{ marginLeft: "10px" }}>
                                {t("Folder")}
                              </span>
                            </>
                          }
                        />
                      ) : null}

                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle
                          tag="span"
                          data-toggle="dropdown"
                          aria-expanded={dropdownOpen}
                        ></DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            className="w-100 "
                            onClick={() => {
                              setShow(true);
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <FilePlus size={17} />
                              <h2
                                style={{
                                  marginLeft: "10px",
                                  paddingTop: "3px",
                                  fontSize: "16px",
                                }}
                              >
                                {t("File")}
                              </h2>
                            </div>
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => setModal(true)}
                            className="w-100 d-flex"
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <FolderPlus size={17} />
                              <h2
                                style={{
                                  marginLeft: "10px",
                                  paddingTop: "3px",
                                  fontSize: "16px",
                                }}
                              >
                                {t("Folder")}
                              </h2>
                            </div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </Col>
                </>
              ) : (
                <Col
                  md="12"
                  xs="12"
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    {subfolderState ? (
                      <>
                        <Button
                          style={{ boxShadow: "none" }}
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
                            Back
                          </span>
                        </Button>
                      </>
                    ) : null}
                  </span>
                  {/* <div></div> */}
                  <div style={{ flexGrow: 1 }}>
                    {window.innerWidth < 786 ? (
                      <MobileSelect
                        active={active}
                        handleSelectChange={handleSelectChange}
                        toggle={toggle}
                        pcolorFromLocalStorage={primary_color}
                        setFolderLoader={setFolderLoader}
                        setStatusData={setStatusData}
                        setCurrentPage={setCurrentPage}
                      />
                    ) : (
                      <DesktopNav
                        active={active}
                        toggle={toggle}
                        pcolorFromLocalStorage={primary_color}
                        setFolderLoader={setFolderLoader}
                        setStatusData={setStatusData}
                        setCurrentPage={setCurrentPage}
                      />
                    )}
                  </div>

                  <div style={{ display: "flex" }}>
                    {/* <div className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>{crumb} {index < breadcrumbs.length - 1 && ' > '}</span>
        ))}
      </div> */}
                    {/* <Input
                  style={{
                    height: '40px',
                    boxShadow: 'none',
                    fontSize: '16px',
                  }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  type="text"
                  id="login-email"
                  placeholder="Search by Name"
                  autoFocus
                /> */}
                    <div style={{ marginRight: "10px", cursor: "pointer" }}>
                      <RotateCw
                        id="refresh-icon"
                        onClick={async () => {
                          //   setFolderLoader(true);
                          //  await fetchAllBulkLinks();
                          setFolderLoader(true);
                          await fetchAllFiles(StatusData);
                          await fetchAllFolder();
                        }}
                      />
                      <UncontrolledTooltip
                        placement="bottom"
                        target="refresh-icon"
                      >
                        Refresh
                      </UncontrolledTooltip>
                    </div>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center",
                      }}
                    >
                      <Input
                        style={{
                          height: "35px",
                          boxShadow: "none",
                          fontSize: "14px",
                          paddingLeft: "30px", // Add padding to make space for the icon
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        id="login-email"
                        placeholder={t("Search by Name")}
                        autoFocus
                      />
                      {searchQuery && (
                        <span
                          style={{
                            position: "absolute",
                            right: "10px", // Adjust the position to fit the icon within the input
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSearchQuery(""); // Clear the search query
                          }}
                        >
                          &times; {/* Cross icon (X) */}
                        </span>
                      )}
                    </div>

                    <div>
                      {StatusData === "InProgress" ? (
                        <CustomButton
                          // color="primary"
                          size="sm"
                          style={{
                            marginLeft: "10px",
                            marginRight: "10px",

                            display: "flex",
                            boxShadow: "none",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={async () => {
                            console.log("userPlanCurrent");
                            setShow(true);
                            setLoaderFileAdd(false);
                            // console.log(userPlanCurrent);
                            // console.log(userTotalDocCount);

                            // setLoaderFileAdd(true);
                            // if (
                            //   userPlanCurrent === null ||
                            //   userPlanCurrent?.document_to_sign === "unlimited"
                            // ) {
                            //   setShow(true);
                            //   setLoaderFileAdd(false);
                            // } else {
                            //   const documents_to_sign_limit =
                            //     userPlanCurrent?.document_to_sign;
                            //   console.log(userTotalDocCount);
                            //   if (
                            //     parseInt(userTotalDocCount) <
                            //     parseInt(documents_to_sign_limit)
                            //   ) {
                            //     setShow(true);
                            //     setLoaderFileAdd(false);
                            //   } else {
                            //     setModalUpgradePremium(true);
                            //     setLoaderFileAdd(false);
                            //   }
                            // }

                            // end

                            // if (notCompletedProfile === true) {
                            //   setCompleteProfileD(true);
                            //   setLoaderFileAdd(false);
                            // } else {
                            //   const dataGet = await getCheckUserPlan();
                            //   console.log('dataGet');
                            //   console.log(dataGet);
                            //   if (dataGet?.userPlanDetails?.document_to_sign === 'unlimited') {
                            //     setShow(true);
                            //     setLoaderFileAdd(false);
                            //     console.log('dshjhjds');
                            //   } else {
                            //     const userDocumentsCount = dataGet?.userPlanDetails?.document_to_sign;
                            //     console.log(userDocumentsCount);
                            //     // const userDocuments = dataGet?.userDocuments
                            //     const userDocuments = dataGet?.userDocuments;

                            //     if (parseInt(userDocuments) === parseInt(userDocumentsCount)) {
                            //       // toastAlert('error', 'Document Limit ended Upgrade your plan!');
                            //       setModalUpgradePremium(true);
                            //       setLoaderFileAdd(false);
                            //     } else {
                            //       setShow(true);
                            //       setLoaderFileAdd(false);
                            //     }
                            //   }
                            // }
                          }}
                          text={
                            <>
                              {LoaderFileAdd ? (
                                <SpinnerCustom color="primary" size="sm" />
                              ) : (
                                // <Spinner color="light" size="sm" />
                                <Plus size={24} style={{ cursor: "pointer" }} />
                              )}
                              <span style={{ marginLeft: "10px" }}>
                                {t("File")}
                              </span>
                            </>
                          }
                        />
                      ) : null}

                      {StatusData === "Completed" ? (
                        <CustomButton
                          color="primary"
                          size="sm"
                          style={{
                            marginLeft: "10px",
                            marginRight: "10px",

                            display: "flex",
                            boxShadow: "none",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          // onClick={toggleDropdown}
                          onClick={() => {
                            // toggleDropdown();
                            if (notCompletedProfile === true) {
                              setCompleteProfileD(true);
                            } else {
                              setModal(true);
                            }
                          }}
                          text={
                            <>
                              <Plus size={24} style={{ cursor: "pointer" }} />
                              <span style={{ marginLeft: "10px" }}>
                                {t("Folder")}
                              </span>
                            </>
                          }
                        />
                      ) : null}

                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle
                          tag="span"
                          data-toggle="dropdown"
                          aria-expanded={dropdownOpen}
                        ></DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            className="w-100 "
                            onClick={() => {
                              setShow(true);
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <FilePlus size={17} />
                              <h2
                                style={{
                                  marginLeft: "10px",
                                  paddingTop: "3px",
                                  fontSize: "16px",
                                }}
                              >
                                {t("File")}
                              </h2>
                            </div>
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => setModal(true)}
                            className="w-100 d-flex"
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <FolderPlus size={17} />
                              <h2
                                style={{
                                  marginLeft: "10px",
                                  paddingTop: "3px",
                                  fontSize: "16px",
                                }}
                              >
                                {t("Folder")}
                              </h2>
                            </div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    {/* <div>
                  <UploadFile/>
                  </div> */}
                    {/* {StatusData === 'WaitingForOthers' || StatusData === 'Completed' ? (
                  <select
                    style={{width: '100%', fontSize: '16px', height: '40px',marginLeft:'10px'}}
                    value={TypeTemp}
                    onChange={e => setTypeTemp(e.target.value)}>
                    <option value="Files">Files</option>
                    <option value="Template">Template</option>
                  </select>
                ) : null} */}
                    {window.innerWidth < 786 ? null : (
                      <ButtonGroup
                        size="sm"
                        style={{ marginLeft: "10px", height: "40px" }}
                      >
                        <Button
                          color="secondary"
                          onClick={() => setRSelected(2)}
                          active={rSelected === 2}
                          outline
                        >
                          <AlignJustify size={24} />
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => setRSelected(1)}
                          active={rSelected === 1}
                          outline
                        >
                          <Grid size={24} />
                        </Button>
                      </ButtonGroup>
                    )}
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
                    <Row className="match-height mb-2 ">
                      {show ? (
                        <>
                          <Col xs={12} md={4}></Col>
                          <Col xs={12} md={4}>
                            {/* <div
                              style={{
                                border: isHovered
                                  ? `3px dashed ${primary_color}`
                                  : "3px dashed grey",
                                cursor: "pointer",
                                borderRadius: "10px",
                                padding: "30px",
                                marginBottom: "50px",
                                position: "relative",
                                //  backgroundColor: isHovered ? '#eeeeee' : 'transparent',
                                transition: "border 0.3s ease",
                              }}
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                            >
                              <X
                                size={16}
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  cursor: "pointer",
                                }}
                                onClick={() => setShow(!show)}
                              /> */}
                            <UploadFile
                              user={user} 
                              isHovered={isHovered}
                              setIsHovered={setIsHovered}
                              setShow={setShow}
                            />
                            {/* </div> */}
                          </Col>
                        </>
                      ) : (
                        <>
                          {/* {folderLoader ? (
                              <>
                                <Row>
                                  <Col md="12" xs="12" className="d-flex justify-content-center">
                                    <SpinnerCustom color="primary" />
                                  </Col>
                                </Row>
                              </>
                            ) : (
                              <></>
                            )} */}
                          {/* <Col md='4' xs='12'> */}
                          {rSelected === 1 ? (
                            <>
                              <Row>
                                {StatusData === "InProgress" ||
                                StatusData === "WaitingForOthers" ||
                                StatusData === "WaitingForMe" ? (
                                  // || StatusData === "Completed"
                                  <>
                                    {searchQuery.length === 0 ? (
                                      <>
                                        {StatusData === "Completed" ||
                                        StatusData === "WaitingForOthers" ? (
                                          <Row>
                                            <Col
                                              xs={12}
                                              style={{
                                                marginTop: "-20px",
                                                marginBottom: "10px",
                                              }}
                                            ></Col>
                                          </Row>
                                        ) : null}
                                        {folderLoader ? (
                                          <>
                                            <Row>
                                              <Col
                                                md="12"
                                                xs="12"
                                                className="d-flex justify-content-center"
                                              >
                                                {/* <Spinner color="primary" /> */}
                                                <SpinnerCustom color="primary" />
                                              </Col>
                                            </Row>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                        {currentItems.map((item, index) => (
                                          <>
                                            {item.file_id === null ||
                                            item.file_id ===
                                              undefined ? null : (
                                              <>
                                                {window.innerWidth < 786 ? (
                                                  <Card
                                                    style={{ margin: "10px" }}
                                                  >
                                                    {/* <CardImg top src={img1} alt='card1' /> */}
                                                    <CardBody
                                                      style={{
                                                        cursor: "pointer",
                                                        backgroundColor: `${
                                                          item.only_signer ===
                                                            true ||
                                                          item.only_signer ===
                                                            "true"
                                                            ? "#dcf6ff"
                                                            : "light"
                                                        }`,
                                                      }}
                                                    >
                                                      <div
                                                        className="d-flex justify-content-between align-items-center"
                                                        onClick={async () => {
                                                          // editor/100730
                                                          if (
                                                            StatusData ===
                                                            "WaitingForMe"
                                                          ) {
                                                            //console.log(items.token.email);
                                                            const FILEID =
                                                              item.file_id;
                                                            const EMAILD =
                                                              user?.email;
                                                            const postData = {
                                                              file_id: FILEID,
                                                              email: EMAILD,
                                                            };
                                                            try {
                                                              const apiData =
                                                                await post(
                                                                  "file/waitingForMeDocLink",
                                                                  postData
                                                                ); // Specify the endpoint you want to call
                                                              //console.log('Recipients');
                                                              //console.log(apiData);
                                                              window.location.href =
                                                                apiData.data;
                                                            } catch (error) {
                                                              //console.log('Error fetching data:', error);
                                                            }
                                                          } else if (
                                                            item.status ===
                                                            "WaitingForOthers"
                                                            //  ||item.status === 'Completed'
                                                          ) {
                                                            window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                          } else if (
                                                            item.status ===
                                                            "Completed"
                                                          ) {
                                                            window.location.href = `/completed/file/${item.file_id}`;
                                                          } else {
                                                            window.location.href = `/esign-setup/${item.file_id}`;
                                                          }
                                                        }}
                                                      >
                                                        <CardTitle
                                                          tag="h4"
                                                          className="d-flex justify-content-left align-items-center"
                                                        >
                                                          <img
                                                            src={pdfIcon}
                                                            alt="pdf icon"
                                                            style={{
                                                              width:
                                                                pdfIcon_width,
                                                              height: "auto",
                                                            }}
                                                          />
                                                          <span
                                                            style={{
                                                              fontSize: "14px",
                                                              marginTop: "2%",
                                                              marginLeft:
                                                                "10px",
                                                              whiteSpace:
                                                                "nowrap",
                                                              overflow:
                                                                "hidden",
                                                              textOverflow:
                                                                "ellipsis",
                                                              maxWidth: "110px",
                                                              display:
                                                                "inline-block",
                                                            }}
                                                            title={
                                                              item.name.length >
                                                              10
                                                                ? item.name
                                                                : null
                                                            }
                                                          >
                                                            {highlightText(
                                                              `${item.name}`,
                                                              searchQuery
                                                            )}
                                                          </span>

                                                          {/* <span style={{ marginLeft: '10px' }}>
                                {item.name}
                              </span> */}
                                                        </CardTitle>
                                                        {/* folder icon here */}
                                                        {/* <File size={24} /> */}
                                                        <div
                                                          style={{
                                                            marginTop: "-25px",
                                                          }}
                                                        >
                                                          {window.innerWidth <
                                                          786 ? null : (
                                                            <>
                                                              {StatusData ===
                                                              "WaitingForMe" ? (
                                                                <Badge color="danger">
                                                                  <User
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Waiting For Me"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : (
                                                                <>
                                                                  {item.status ===
                                                                  "InProgress" ? (
                                                                    <Badge color="info">
                                                                      <Clock
                                                                        size={
                                                                          12
                                                                        }
                                                                        className="align-middle me-25"
                                                                      />
                                                                      <span
                                                                        className="align-middle"
                                                                        style={{
                                                                          fontSize:
                                                                            "14px",
                                                                        }}
                                                                      >
                                                                        {t(
                                                                          "In Progress"
                                                                        )}
                                                                      </span>
                                                                    </Badge>
                                                                  ) : null}
                                                                  {item.status ===
                                                                  "WaitingForOthers" ? (
                                                                    <Badge color="warning">
                                                                      <Users
                                                                        size={
                                                                          12
                                                                        }
                                                                        className="align-middle me-25"
                                                                      />
                                                                      <span
                                                                        className="align-middle"
                                                                        style={{
                                                                          fontSize:
                                                                            "14px",
                                                                        }}
                                                                      >
                                                                        {t(
                                                                          "Waiting For Others"
                                                                        )}
                                                                      </span>
                                                                    </Badge>
                                                                  ) : null}
                                                                  {item.status ===
                                                                  "WaitingForMe" ? (
                                                                    <Badge color="danger">
                                                                      <User
                                                                        size={
                                                                          12
                                                                        }
                                                                        className="align-middle me-25"
                                                                      />
                                                                      <span
                                                                        className="align-middle"
                                                                        style={{
                                                                          fontSize:
                                                                            "14px",
                                                                        }}
                                                                      >
                                                                        {t(
                                                                          "Waiting For Me"
                                                                        )}
                                                                      </span>
                                                                    </Badge>
                                                                  ) : null}
                                                                  {window.innerWidth <
                                                                  730 ? null : (
                                                                    <>
                                                                      {item.status ===
                                                                      "Completed" ? (
                                                                        <Badge color="success">
                                                                          <CheckCircle
                                                                            size={
                                                                              12
                                                                            }
                                                                            className="align-middle me-25"
                                                                          />
                                                                          <span
                                                                            className="align-middle"
                                                                            style={{
                                                                              fontSize:
                                                                                "14px",
                                                                            }}
                                                                          >
                                                                            {t(
                                                                              "Completed"
                                                                            )}
                                                                          </span>
                                                                        </Badge>
                                                                      ) : null}
                                                                    </>
                                                                  )}
                                                                </>
                                                              )}
                                                            </>
                                                          )}
                                                        </div>
                                                      </div>

                                                      {/* <CardText>
                      This is a wider card with supporting text below as a natural lead-in to additional content. This content
                      is a little bit longer.
                    </CardText> */}
                                                      {/* image here */}

                                                      {/* <Badge color='primary'>
      <Star size={12} className='align-middle me-25' />
      <span className='align-middle'>Primary</span>
    </Badge> */}
                                                      <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                          {/* view  */}
                                                          <Eye
                                                            size={sizeP_icon}
                                                            id={`viewingd_${item.file_id}`}
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            onClick={async () => {
                                                              if (
                                                                StatusData ===
                                                                "WaitingForMe"
                                                              ) {
                                                                //console.log(items.token.email);
                                                                const FILEID =
                                                                  item.file_id;
                                                                const EMAILD =
                                                                  user?.email;
                                                                const postData =
                                                                  {
                                                                    file_id:
                                                                      FILEID,
                                                                    email:
                                                                      EMAILD,
                                                                  };
                                                                try {
                                                                  const apiData =
                                                                    await post(
                                                                      "file/waitingForMeDocLink",
                                                                      postData
                                                                    ); // Specify the endpoint you want to call
                                                                  //console.log('Recipients');
                                                                  //console.log(apiData);
                                                                  window.location.href =
                                                                    apiData.data;
                                                                } catch (error) {
                                                                  //console.log('Error fetching data:', error);
                                                                }
                                                              }
                                                              // else if (
                                                              //   item.status === 'WaitingForOthers' ||
                                                              //   item.status === 'Completed'
                                                              // ) {
                                                              //   window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                              // }
                                                              else if (
                                                                item.status ===
                                                                "WaitingForOthers"
                                                                //  ||item.status === 'Completed'
                                                              ) {
                                                                window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                              } else if (
                                                                item.status ===
                                                                "Completed"
                                                              ) {
                                                                window.location.href = `/completed/file/${item.file_id}`;
                                                              } else {
                                                                window.location.href = `/esign-setup/${item.file_id}`;
                                                              }
                                                              // if (
                                                              //   item.status === 'WaitingForOthers' ||
                                                              //   item.status === 'Completed'
                                                              // ) {
                                                              //   window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                              // } else {
                                                              //   window.location.href = `/esign-setup/${item.file_id}`;
                                                              // }
                                                            }}
                                                          />

                                                          {/* Icons for edit delete with tooltip  */}
                                                          {StatusData ===
                                                            "WaitingForMe" ||
                                                          item.status ===
                                                            "WaitingForOthers" ||
                                                          item.status ===
                                                            "Completed" ? (
                                                            <></>
                                                          ) : (
                                                            <>
                                                              <Edit2
                                                                onClick={() => {
                                                                  window.location.href = `/esign-setup/${item.file_id}`;
                                                                }}
                                                                id={`editingd_${item.file_id}`}
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                }}
                                                              />
                                                              <Archive
                                                                onClick={() => {
                                                                  setDeleteFolderId(
                                                                    item.file_id
                                                                  );
                                                                  setFolderName(
                                                                    item.name
                                                                  );
                                                                  setItemArchieveConfirmationFile(
                                                                    true
                                                                  );
                                                                }}
                                                                id={`archievingd_${item.file_id}`}
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color:
                                                                    "#CC99FF",
                                                                }}
                                                              />
                                                              <Trash2
                                                                id={`deletingd_${item.file_id}`}
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color: "red",
                                                                }}
                                                                onClick={() => {
                                                                  setDeleteFolderId(
                                                                    item.file_id
                                                                  );
                                                                  setFolderName(
                                                                    item.name
                                                                  );
                                                                  setItemDeleteConfirmationFile(
                                                                    true
                                                                  );
                                                                }}
                                                              />
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target={`editingd_${item.file_id}`}
                                                              >
                                                                Rename
                                                              </UncontrolledTooltip>
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target={`archievingd_${item.file_id}`}
                                                              >
                                                                {t("Archive")}
                                                              </UncontrolledTooltip>

                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target={`deletingd_${item.file_id}`}
                                                              >
                                                                {t("Delete")}
                                                              </UncontrolledTooltip>
                                                            </>
                                                          )}
                                                          <UncontrolledTooltip
                                                            placement="bottom"
                                                            target={`viewingd_${item.file_id}`}
                                                          >
                                                            {t("View")}
                                                          </UncontrolledTooltip>
                                                          {StatusData ===
                                                          "WaitingForMe" ? null : (
                                                            <>
                                                              <AtSign
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                id={`log_${item.file_id}`}
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color:
                                                                    "#FFCC99",
                                                                }}
                                                                onClick={async () => {
                                                                  await getActivityLog(
                                                                    item.file_id
                                                                  );
                                                                }}
                                                              />{" "}
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target={`log_${item.file_id}`}
                                                              >
                                                                {t("Audit Log")}
                                                              </UncontrolledTooltip>
                                                            </>
                                                          )}
                                                        </div>
                                                        {window.innerWidth <
                                                        786 ? null : (
                                                          <>
                                                            {StatusData ===
                                                            "WaitingForMe" ? null : (
                                                              <h3
                                                                style={{
                                                                  cursor:
                                                                    "default",
                                                                }}
                                                              >
                                                                {formatDateCustomTimelastActivity(
                                                                  item.last_change
                                                                )}
                                                              </h3>
                                                            )}{" "}
                                                          </>
                                                        )}
                                                      </div>
                                                      {/* <div style={{ display: 'flex', justifyContent: 'right' }}>
                            <h3 className='text-muted d-flex align-right'>{formatDate(item.last_change)}</h3>

                          </div> */}
                                                    </CardBody>
                                                    {/* <CardFooter>
                        
                        </CardFooter> */}
                                                  </Card>
                                                ) : (
                                                  <Col md="4" xs="12">
                                                    <Card>
                                                      {/* <CardImg top src={img1} alt='card1' /> */}
                                                      <CardBody
                                                        style={{
                                                          cursor: "pointer",
                                                          backgroundColor: `${
                                                            item.only_signer ===
                                                              true ||
                                                            item.only_signer ===
                                                              "true"
                                                              ? "#dcf6ff"
                                                              : "light"
                                                          }`,
                                                        }}
                                                      >
                                                        <div
                                                          className="d-flex justify-content-between align-items-center"
                                                          onClick={async () => {
                                                            // editor/100730
                                                            if (
                                                              StatusData ===
                                                              "WaitingForMe"
                                                            ) {
                                                              //console.log(items.token.email);
                                                              const FILEID =
                                                                item.file_id;
                                                              const EMAILD =
                                                                user?.email;
                                                              const postData = {
                                                                file_id: FILEID,
                                                                email: EMAILD,
                                                              };
                                                              try {
                                                                const apiData =
                                                                  await post(
                                                                    "file/waitingForMeDocLink",
                                                                    postData
                                                                  ); // Specify the endpoint you want to call
                                                                //console.log('Recipients');
                                                                //console.log(apiData);
                                                                window.location.href =
                                                                  apiData.data;
                                                              } catch (error) {
                                                                //console.log('Error fetching data:', error);
                                                              }
                                                            }
                                                            // else if (
                                                            //   item.status === 'WaitingForOthers' ||
                                                            //   item.status === 'Completed'
                                                            // ) {
                                                            //   window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                            // }
                                                            else if (
                                                              item.status ===
                                                              "WaitingForOthers"
                                                              //  ||item.status === 'Completed'
                                                            ) {
                                                              window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                            } else if (
                                                              item.status ===
                                                              "Completed"
                                                            ) {
                                                              window.location.href = `/completed/file/${item.file_id}`;
                                                            } else {
                                                              window.location.href = `/esign-setup/${item.file_id}`;
                                                            }
                                                          }}
                                                        >
                                                          <CardTitle
                                                            tag="h4"
                                                            className="d-flex justify-content-left align-items-center"
                                                          >
                                                            <img
                                                              src={pdfIcon}
                                                              alt="pdf icon"
                                                              style={{
                                                                width:
                                                                  pdfIcon_width,
                                                                height: "auto",
                                                              }}
                                                            />
                                                            <span
                                                              style={{
                                                                marginTop: "2%",
                                                                marginLeft:
                                                                  "10px",
                                                                whiteSpace:
                                                                  "nowrap",
                                                                overflow:
                                                                  "hidden",
                                                                textOverflow:
                                                                  "ellipsis",
                                                                maxWidth:
                                                                  "110px",
                                                                display:
                                                                  "inline-block",
                                                              }}
                                                              title={
                                                                item.name
                                                                  .length > 10
                                                                  ? item.name
                                                                  : null
                                                              }
                                                            >
                                                              {highlightText(
                                                                `${item.name}`,
                                                                searchQuery
                                                              )}
                                                            </span>

                                                            {/* <span style={{ marginLeft: '10px' }}>
                              {item.name}
                            </span> */}
                                                          </CardTitle>
                                                          {/* folder icon here */}
                                                          {/* <File size={24} /> */}
                                                          {window.innerWidth <
                                                          786 ? null : (
                                                            <>
                                                              <div
                                                                style={{
                                                                  marginTop:
                                                                    "-25px",
                                                                }}
                                                              >
                                                                {StatusData ===
                                                                "WaitingForMe" ? (
                                                                  <Badge color="danger">
                                                                    <User
                                                                      size={12}
                                                                      className="align-middle me-25"
                                                                    />
                                                                    <span
                                                                      className="align-middle"
                                                                      style={{
                                                                        fontSize:
                                                                          "14px",
                                                                      }}
                                                                    >
                                                                      {t(
                                                                        "Waiting For Me"
                                                                      )}
                                                                    </span>
                                                                  </Badge>
                                                                ) : (
                                                                  <>
                                                                    {item.status ===
                                                                    "InProgress" ? (
                                                                      <Badge color="info">
                                                                        <Clock
                                                                          size={
                                                                            12
                                                                          }
                                                                          className="align-middle me-25"
                                                                        />
                                                                        <span
                                                                          className="align-middle"
                                                                          style={{
                                                                            fontSize:
                                                                              "14px",
                                                                          }}
                                                                        >
                                                                          {t(
                                                                            "In Progress"
                                                                          )}
                                                                        </span>
                                                                      </Badge>
                                                                    ) : null}
                                                                    {item.status ===
                                                                    "WaitingForOthers" ? (
                                                                      <Badge color="warning">
                                                                        <Users
                                                                          size={
                                                                            12
                                                                          }
                                                                          className="align-middle me-25"
                                                                        />
                                                                        <span
                                                                          className="align-middle"
                                                                          style={{
                                                                            fontSize:
                                                                              "14px",
                                                                          }}
                                                                        >
                                                                          {t(
                                                                            "Waiting For Others"
                                                                          )}
                                                                        </span>
                                                                      </Badge>
                                                                    ) : null}
                                                                    {item.status ===
                                                                    "WaitingForMe" ? (
                                                                      <Badge color="danger">
                                                                        <User
                                                                          size={
                                                                            12
                                                                          }
                                                                          className="align-middle me-25"
                                                                        />
                                                                        <span
                                                                          className="align-middle"
                                                                          style={{
                                                                            fontSize:
                                                                              "14px",
                                                                          }}
                                                                        >
                                                                          {t(
                                                                            "Waiting For Me"
                                                                          )}
                                                                        </span>
                                                                      </Badge>
                                                                    ) : null}
                                                                    {window.innerWidth <
                                                                    730 ? null : (
                                                                      <>
                                                                        {item.status ===
                                                                        "Completed" ? (
                                                                          <Badge color="success">
                                                                            <CheckCircle
                                                                              size={
                                                                                12
                                                                              }
                                                                              className="align-middle me-25"
                                                                            />
                                                                            <span
                                                                              className="align-middle"
                                                                              style={{
                                                                                fontSize:
                                                                                  "14px",
                                                                              }}
                                                                            >
                                                                              {t(
                                                                                "Completed"
                                                                              )}
                                                                            </span>
                                                                          </Badge>
                                                                        ) : null}{" "}
                                                                      </>
                                                                    )}
                                                                  </>
                                                                )}
                                                              </div>{" "}
                                                            </>
                                                          )}
                                                        </div>

                                                        {/* <CardText>
                    This is a wider card with supporting text below as a natural lead-in to additional content. This content
                    is a little bit longer.
                  </CardText> */}
                                                        {/* image here */}

                                                        {/* <Badge color='primary'>
    <Star size={12} className='align-middle me-25' />
    <span className='align-middle'>Primary</span>
  </Badge> */}
                                                        <div className="d-flex justify-content-between align-items-center">
                                                          <div>
                                                            {/* view  */}
                                                            <Eye
                                                              size={sizeP_icon}
                                                              id={`viewingd_${item.file_id}`}
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                              onClick={async () => {
                                                                if (
                                                                  StatusData ===
                                                                  "WaitingForMe"
                                                                ) {
                                                                  //console.log(items.token.email);
                                                                  const FILEID =
                                                                    item.file_id;
                                                                  const EMAILD =
                                                                    user?.email;
                                                                  const postData =
                                                                    {
                                                                      file_id:
                                                                        FILEID,
                                                                      email:
                                                                        EMAILD,
                                                                    };
                                                                  try {
                                                                    const apiData =
                                                                      await post(
                                                                        "file/waitingForMeDocLink",
                                                                        postData
                                                                      ); // Specify the endpoint you want to call
                                                                    //console.log('Recipients');
                                                                    //console.log(apiData);
                                                                    window.location.href =
                                                                      apiData.data;
                                                                  } catch (error) {
                                                                    //console.log('Error fetching data:', error);
                                                                  }
                                                                } else if (
                                                                  item.status ===
                                                                  "WaitingForOthers"
                                                                  //  ||item.status === 'Completed'
                                                                ) {
                                                                  window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                                } else if (
                                                                  item.status ===
                                                                  "Completed"
                                                                ) {
                                                                  window.location.href = `/completed/file/${item.file_id}`;
                                                                } else {
                                                                  window.location.href = `/esign-setup/${item.file_id}`;
                                                                }
                                                                // if (
                                                                //   item.status === 'WaitingForOthers' ||
                                                                //   item.status === 'Completed'
                                                                // ) {
                                                                //   window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                                // } else {
                                                                //   window.location.href = `/esign-setup/${item.file_id}`;
                                                                // }
                                                              }}
                                                            />

                                                            {/* Icons for edit delete with tooltip  */}
                                                            {StatusData ===
                                                              "WaitingForMe" ||
                                                            item.status ===
                                                              "WaitingForOthers" ||
                                                            item.status ===
                                                              "Completed" ? (
                                                              <></>
                                                            ) : (
                                                              <>
                                                                <Edit2
                                                                  onClick={() => {
                                                                    window.location.href = `/esign-setup/${item.file_id}`;
                                                                  }}
                                                                  id={`editingd_${item.file_id}`}
                                                                  size={
                                                                    sizeP_icon
                                                                  }
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                    marginLeft:
                                                                      "10px",
                                                                  }}
                                                                />
                                                                <Archive
                                                                  onClick={() => {
                                                                    setDeleteFolderId(
                                                                      item.file_id
                                                                    );
                                                                    setFolderName(
                                                                      item.name
                                                                    );
                                                                    setItemArchieveConfirmationFile(
                                                                      true
                                                                    );
                                                                  }}
                                                                  id={`archievingd_${item.file_id}`}
                                                                  size={
                                                                    sizeP_icon
                                                                  }
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                    marginLeft:
                                                                      "10px",
                                                                    color:
                                                                      "#CC99FF",
                                                                  }}
                                                                />
                                                                <Trash2
                                                                  id={`deletingd_${item.file_id}`}
                                                                  size={
                                                                    sizeP_icon
                                                                  }
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                    marginLeft:
                                                                      "10px",
                                                                    color:
                                                                      "red",
                                                                  }}
                                                                  onClick={() => {
                                                                    setDeleteFolderId(
                                                                      item.file_id
                                                                    );
                                                                    setFolderName(
                                                                      item.name
                                                                    );
                                                                    setItemDeleteConfirmationFile(
                                                                      true
                                                                    );
                                                                  }}
                                                                />
                                                                <UncontrolledTooltip
                                                                  placement="bottom"
                                                                  target={`editingd_${item.file_id}`}
                                                                >
                                                                  Rename
                                                                </UncontrolledTooltip>
                                                                <UncontrolledTooltip
                                                                  placement="bottom"
                                                                  target={`archievingd_${item.file_id}`}
                                                                >
                                                                  {t("Archive")}
                                                                </UncontrolledTooltip>

                                                                <UncontrolledTooltip
                                                                  placement="bottom"
                                                                  target={`deletingd_${item.file_id}`}
                                                                >
                                                                  {t("Delete")}
                                                                </UncontrolledTooltip>
                                                              </>
                                                            )}
                                                            <UncontrolledTooltip
                                                              placement="bottom"
                                                              target={`viewingd_${item.file_id}`}
                                                            >
                                                              {t("View")}
                                                            </UncontrolledTooltip>
                                                            {StatusData ===
                                                            "WaitingForMe" ? null : (
                                                              <>
                                                                <AtSign
                                                                  size={
                                                                    sizeP_icon
                                                                  }
                                                                  id={`log_${item.file_id}`}
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                    marginLeft:
                                                                      "10px",
                                                                    color:
                                                                      "#FFCC99",
                                                                  }}
                                                                  onClick={async () => {
                                                                    await getActivityLog(
                                                                      item.file_id
                                                                    );
                                                                  }}
                                                                />{" "}
                                                                <UncontrolledTooltip
                                                                  placement="bottom"
                                                                  target={`log_${item.file_id}`}
                                                                >
                                                                  {t(
                                                                    "Audit Log"
                                                                  )}
                                                                </UncontrolledTooltip>
                                                              </>
                                                            )}
                                                            {StatusData ===
                                                            "Completed" ? (
                                                              <>
                                                                <Download
                                                                  size={
                                                                    sizeP_icon
                                                                  }
                                                                  id={`download1_${item.file_id}`}
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                    marginLeft:
                                                                      "10px",
                                                                    color:
                                                                      "grey",
                                                                  }}
                                                                  onClick={async () => {
                                                                    // console.log(item)
                                                                    let downloadUrl =
                                                                    item
                                                                    ?.bgimgs[0]
                                                                    ?.inprocess_doc||item
                                                                    ?.bgimgs[0]
                                                                    ?.image;;
                                                                    await handleDownloadPDFApp(
                                                                      downloadUrl,
                                                                      item?.name
                                                                    );
                                                                  }}
                                                                />{" "}
                                                                <UncontrolledTooltip
                                                                  placement="bottom"
                                                                  target={`download1_${item.file_id}`}
                                                                >
                                                                  {t(
                                                                    "Download"
                                                                  )}
                                                                </UncontrolledTooltip>
                                                              </>
                                                            ) : (
                                                              <>
                                                                <Download
                                                                  size={
                                                                    sizeP_icon
                                                                  }
                                                                  id={`download_${item.file_id}`}
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                    marginLeft:
                                                                      "10px",
                                                                    color:
                                                                      "grey",
                                                                  }}
                                                                  onClick={async () => {
                                                                    // console.log(item)
                                                                    let downloadUrl =
                                                                      item
                                                                        ?.bgimgs[0]
                                                                        ?.image;
                                                                    await handleDownloadPDFApp(
                                                                      downloadUrl,
                                                                      item?.name
                                                                    );
                                                                  }}
                                                                />{" "}
                                                                <UncontrolledTooltip
                                                                  placement="bottom"
                                                                  target={`download_${item.file_id}`}
                                                                >
                                                                  {t(
                                                                    "Download"
                                                                  )}
                                                                </UncontrolledTooltip>{" "}
                                                              </>
                                                            )}
                                                          </div>
                                                          {window.innerWidth <
                                                          786 ? null : (
                                                            <>
                                                              {StatusData ===
                                                              "WaitingForMe" ? null : (
                                                                <h3
                                                                  style={{
                                                                    cursor:
                                                                      "default",
                                                                  }}
                                                                >
                                                                  {formatDateCustomTimelastActivity(
                                                                    item.last_change
                                                                  )}
                                                                </h3>
                                                              )}
                                                            </>
                                                          )}
                                                        </div>
                                                        {/* <div style={{ display: 'flex', justifyContent: 'right' }}>
                          <h3 className='text-muted d-flex align-right'>{formatDate(item.last_change)}</h3>

                        </div> */}
                                                      </CardBody>
                                                      {/* <CardFooter>
                      
                      </CardFooter> */}
                                                    </Card>
                                                  </Col>
                                                )}
                                              </>
                                            )}
                                          </>
                                        ))}
                                      </>
                                    ) : (
                                      <>
                                        {filteredItems.length === 0 &&
                                        currentItems.length > 0 ? (
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
                                                    width: "100px",
                                                    height: "auto",
                                                  }}
                                                />
                                                <Label
                                                  className="form-label"
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {t("No Folder or File Exist")}
                                                </Label>
                                              </Col>
                                            </Row>
                                          </>
                                        ) : null}
                                        {filteredItems.map((item, index) => (
                                          <>
                                            {item.file_id === null ||
                                            item.file_id ===
                                              undefined ? null : (
                                              <Col md="4" xs="12">
                                                <Card>
                                                  {/* <CardImg top src={img1} alt='card1' /> */}
                                                  <CardBody
                                                    style={{
                                                      cursor: "pointer",
                                                      backgroundColor: `${
                                                        item.only_signer ===
                                                          true ||
                                                        item.only_signer ===
                                                          "true"
                                                          ? "#dcf6ff"
                                                          : "light"
                                                      }`,
                                                    }}
                                                  >
                                                    <div
                                                      className="d-flex justify-content-between align-items-center"
                                                      onClick={async () => {
                                                        // editor/100730
                                                        if (
                                                          StatusData ===
                                                          "WaitingForMe"
                                                        ) {
                                                          //console.log(items.token.email);
                                                          const FILEID =
                                                            item.file_id;
                                                          const EMAILD =
                                                            user?.email;
                                                          const postData = {
                                                            file_id: FILEID,
                                                            email: EMAILD,
                                                          };
                                                          try {
                                                            const apiData =
                                                              await post(
                                                                "file/waitingForMeDocLink",
                                                                postData
                                                              ); // Specify the endpoint you want to call
                                                            //console.log('Recipients');
                                                            //console.log(apiData);
                                                            window.location.href =
                                                              apiData.data;
                                                          } catch (error) {
                                                            //console.log('Error fetching data:', error);
                                                          }
                                                        } else if (
                                                          item.status ===
                                                          "WaitingForOthers"
                                                          //  ||item.status === 'Completed'
                                                        ) {
                                                          window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                        } else if (
                                                          item.status ===
                                                          "Completed"
                                                        ) {
                                                          window.location.href = `/completed/file/${item.file_id}`;
                                                        } else {
                                                          window.location.href = `/esign-setup/${item.file_id}`;
                                                        }
                                                      }}
                                                    >
                                                      <CardTitle
                                                        tag="h4"
                                                        className="d-flex justify-content-left align-items-center"
                                                      >
                                                        <img
                                                          src={pdfIcon}
                                                          alt="pdf icon"
                                                          style={{
                                                            width:
                                                              pdfIcon_width,
                                                            height: "auto",
                                                          }}
                                                        />
                                                        <span
                                                          style={{
                                                            fontSize: "14px",
                                                            marginTop: "2%",
                                                            marginLeft: "10px",
                                                            whiteSpace:
                                                              "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                              "ellipsis",
                                                            maxWidth: "110px",
                                                            display:
                                                              "inline-block",
                                                          }}
                                                          title={
                                                            item.name.length >
                                                            10
                                                              ? item.name
                                                              : null
                                                          }
                                                        >
                                                          {highlightText(
                                                            `${item.name}`,
                                                            searchQuery
                                                          )}
                                                        </span>

                                                        {/* <span style={{ marginLeft: '10px' }}>
                           {item.name}
                         </span> */}
                                                      </CardTitle>
                                                      {/* folder icon here */}
                                                      {/* <File size={24} /> */}
                                                      {window.innerWidth <
                                                      786 ? null : (
                                                        <>
                                                          {" "}
                                                          <div
                                                            style={{
                                                              marginTop:
                                                                "-25px",
                                                            }}
                                                          >
                                                            {item.only_signer ===
                                                              true ||
                                                            item.only_signer ===
                                                              "true" ? (
                                                              <Badge
                                                                color="primary"
                                                                style={{
                                                                  marginRight:
                                                                    "10px",
                                                                }}
                                                              >
                                                                <span
                                                                  className="align-middle"
                                                                  style={{
                                                                    fontSize:
                                                                      "14px",
                                                                  }}
                                                                >
                                                                  Self Signed
                                                                </span>
                                                              </Badge>
                                                            ) : null}
                                                            {StatusData ===
                                                            "WaitingForMe" ? (
                                                              <Badge color="danger">
                                                                <User
                                                                  size={12}
                                                                  className="align-middle me-25"
                                                                />
                                                                <span
                                                                  className="align-middle"
                                                                  style={{
                                                                    fontSize:
                                                                      "14px",
                                                                  }}
                                                                >
                                                                  {t(
                                                                    "Waiting For Me"
                                                                  )}
                                                                </span>
                                                              </Badge>
                                                            ) : (
                                                              <>
                                                                {item.status ===
                                                                "InProgress" ? (
                                                                  <Badge color="info">
                                                                    <Clock
                                                                      size={12}
                                                                      className="align-middle me-25"
                                                                    />
                                                                    <span
                                                                      className="align-middle"
                                                                      style={{
                                                                        fontSize:
                                                                          "14px",
                                                                      }}
                                                                    >
                                                                      {t(
                                                                        "In Progress"
                                                                      )}
                                                                    </span>
                                                                  </Badge>
                                                                ) : null}
                                                                {item.status ===
                                                                "WaitingForOthers" ? (
                                                                  <Badge color="warning">
                                                                    <Users
                                                                      size={12}
                                                                      className="align-middle me-25"
                                                                    />
                                                                    <span
                                                                      className="align-middle"
                                                                      style={{
                                                                        fontSize:
                                                                          "14px",
                                                                      }}
                                                                    >
                                                                      {t(
                                                                        "Waiting For Others"
                                                                      )}
                                                                    </span>
                                                                  </Badge>
                                                                ) : null}
                                                                {item.status ===
                                                                "WaitingForMe" ? (
                                                                  <Badge color="danger">
                                                                    <User
                                                                      size={12}
                                                                      className="align-middle me-25"
                                                                    />
                                                                    <span
                                                                      className="align-middle"
                                                                      style={{
                                                                        fontSize:
                                                                          "14px",
                                                                      }}
                                                                    >
                                                                      {t(
                                                                        "Waiting For Me"
                                                                      )}
                                                                    </span>
                                                                  </Badge>
                                                                ) : null}
                                                                {window.innerWidth <
                                                                730 ? null : (
                                                                  <>
                                                                    {item.status ===
                                                                    "Completed" ? (
                                                                      <Badge color="success">
                                                                        <CheckCircle
                                                                          size={
                                                                            12
                                                                          }
                                                                          className="align-middle me-25"
                                                                        />
                                                                        <span
                                                                          className="align-middle"
                                                                          style={{
                                                                            fontSize:
                                                                              "14px",
                                                                          }}
                                                                        >
                                                                          {t(
                                                                            "Completed"
                                                                          )}
                                                                        </span>
                                                                      </Badge>
                                                                    ) : null}
                                                                  </>
                                                                )}
                                                              </>
                                                            )}
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>

                                                    {/* <CardText>
                 This is a wider card with supporting text below as a natural lead-in to additional content. This content
                 is a little bit longer.
               </CardText> */}
                                                    {/* image here */}

                                                    {/* <Badge color='primary'>
 <Star size={12} className='align-middle me-25' />
 <span className='align-middle'>Primary</span>
</Badge> */}
                                                    <div className="d-flex justify-content-between align-items-center">
                                                      <div>
                                                        {/* view  */}
                                                        <Eye
                                                          size={sizeP_icon}
                                                          id={`viewingd_${item.file_id}`}
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={async () => {
                                                            if (
                                                              StatusData ===
                                                              "WaitingForMe"
                                                            ) {
                                                              //console.log(items.token.email);
                                                              const FILEID =
                                                                item.file_id;
                                                              const EMAILD =
                                                                user?.email;
                                                              const postData = {
                                                                file_id: FILEID,
                                                                email: EMAILD,
                                                              };
                                                              try {
                                                                const apiData =
                                                                  await post(
                                                                    "file/waitingForMeDocLink",
                                                                    postData
                                                                  ); // Specify the endpoint you want to call
                                                                //console.log('Recipients');
                                                                //console.log(apiData);
                                                                window.location.href =
                                                                  apiData.data;
                                                              } catch (error) {
                                                                //console.log('Error fetching data:', error);
                                                              }
                                                            } else if (
                                                              item.status ===
                                                              "WaitingForOthers"
                                                              //  ||item.status === 'Completed'
                                                            ) {
                                                              window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                            } else if (
                                                              item.status ===
                                                              "Completed"
                                                            ) {
                                                              window.location.href = `/completed/file/${item.file_id}`;
                                                            } else {
                                                              window.location.href = `/esign-setup/${item.file_id}`;
                                                            }
                                                            // if (
                                                            //   item.status === 'WaitingForOthers' ||
                                                            //   item.status === 'Completed'
                                                            // ) {
                                                            //   window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                            // } else {
                                                            //   window.location.href = `/esign-setup/${item.file_id}`;
                                                            // }
                                                          }}
                                                        />

                                                        {/* Icons for edit delete with tooltip  */}
                                                        {StatusData ===
                                                          "WaitingForMe" ||
                                                        item.status ===
                                                          "WaitingForOthers" ||
                                                        item.status ===
                                                          "Completed" ? (
                                                          <></>
                                                        ) : (
                                                          <>
                                                            <Edit2
                                                              onClick={() => {
                                                                window.location.href = `/esign-setup/${item.file_id}`;
                                                              }}
                                                              id={`editingd_${item.file_id}`}
                                                              size={sizeP_icon}
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                                marginLeft:
                                                                  "10px",
                                                              }}
                                                            />
                                                            <Archive
                                                              onClick={() => {
                                                                setDeleteFolderId(
                                                                  item.file_id
                                                                );
                                                                setFolderName(
                                                                  item.name
                                                                );
                                                                setItemArchieveConfirmationFile(
                                                                  true
                                                                );
                                                              }}
                                                              id={`archievingd_${item.file_id}`}
                                                              size={sizeP_icon}
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                                marginLeft:
                                                                  "10px",
                                                                color:
                                                                  "#CC99FF",
                                                              }}
                                                            />
                                                            <Trash2
                                                              id={`deletingd_${item.file_id}`}
                                                              size={sizeP_icon}
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                                marginLeft:
                                                                  "10px",
                                                                color: "red",
                                                              }}
                                                              onClick={() => {
                                                                setDeleteFolderId(
                                                                  item.file_id
                                                                );
                                                                setFolderName(
                                                                  item.name
                                                                );
                                                                setItemDeleteConfirmationFile(
                                                                  true
                                                                );
                                                              }}
                                                            />
                                                            <UncontrolledTooltip
                                                              placement="bottom"
                                                              target={`editingd_${item.file_id}`}
                                                            >
                                                              {t("Rename")}
                                                            </UncontrolledTooltip>
                                                            <UncontrolledTooltip
                                                              placement="bottom"
                                                              target={`archievingd_${item.file_id}`}
                                                            >
                                                              {t("Archive")}
                                                            </UncontrolledTooltip>

                                                            <UncontrolledTooltip
                                                              placement="bottom"
                                                              target={`deletingd_${item.file_id}`}
                                                            >
                                                              {t("Delete")}
                                                            </UncontrolledTooltip>
                                                          </>
                                                        )}
                                                        <UncontrolledTooltip
                                                          placement="bottom"
                                                          target={`viewingd_${item.file_id}`}
                                                        >
                                                          {t("View")}
                                                        </UncontrolledTooltip>
                                                        {StatusData ===
                                                        "WaitingForMe" ? null : (
                                                          <>
                                                            <AtSign
                                                              size={sizeP_icon}
                                                              id={`log_${item.file_id}`}
                                                              style={{
                                                                cursor:
                                                                  "pointer",
                                                                marginLeft:
                                                                  "10px",
                                                                color:
                                                                  "#FFCC99",
                                                              }}
                                                              onClick={async () => {
                                                                await getActivityLog(
                                                                  item.file_id
                                                                );
                                                              }}
                                                            />{" "}
                                                            <UncontrolledTooltip
                                                              placement="bottom"
                                                              target={`log_${item.file_id}`}
                                                            >
                                                              {t("Audit Log")}
                                                            </UncontrolledTooltip>
                                                          </>
                                                        )}
                                                      </div>
                                                      {window.innerWidth <
                                                        786 ? null : (
                                                          <> {StatusData ===
                                                      "WaitingForMe" ? null : (
                                                        <h3
                                                          style={{
                                                            cursor: "default",
                                                          }}
                                                        >
                                                          {formatDateCustomTimelastActivity(
                                                            item.last_change
                                                          )}
                                                        </h3>
                                                      )}</>)}
                                                    </div>
                                                    {/* <div style={{ display: 'flex', justifyContent: 'right' }}>
                       <h3 className='text-muted d-flex align-right'>{formatDate(item.last_change)}</h3>

                     </div> */}
                                                  </CardBody>
                                                  {/* <CardFooter>
                   
                   </CardFooter> */}
                                                </Card>
                                              </Col>
                                            )}
                                          </>
                                        ))}
                                      </>
                                    )}
                                    {filesArray.length === 0 &&
                                    foldersArray.length === 0 &&
                                    folderLoader === false &&
                                    TypeTemp === "Files" &&
                                    StatusData !== "Completed" ? (
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
                                                width: "100px",
                                                height: "auto",
                                              }}
                                            />
                                            <Label
                                              className="form-label"
                                              style={{ fontSize: "14px" }}
                                            >
                                              {t("No Folder or File Exist")}
                                            </Label>
                                          </Col>
                                        </Row>{" "}
                                      </>
                                    ) : null}
                                  </>
                                ) : (
                                  <>
                                    <Row>
                                      <Col
                                        xs={12}
                                        style={{
                                          marginTop: "-20px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        {/* <Nav className="nav-left">
                                            <NavItem>
                                              <NavLink
                                                style={
                                                  TypeTemp === 'Files'
                                                    ? {
                                                       
                                                      
                                                        display: 'flex',
                                                      }
                                                    : {display: 'flex'}
                                                }
                                                active={TypeTemp === 'Files'}
                                                onClick={() => {
                                                  setTypeTemp('Files');
                                                }}>
                                                <Label className="align-middle form-label"> {t("Standard Files")} </Label>
                                              </NavLink>
                                            </NavItem>
                                            <NavItem>
                                              <NavLink
                                                style={
                                                  TypeTemp === 'Template'
                                                    ? {
                                                       display: 'flex',
                                                      }
                                                    : {display: 'flex'}
                                                }
                                                active={TypeTemp === 'Template'}
                                                onClick={() => {
                                                  setTypeTemp('Template');
                                                }}>
                                                <Label className="align-middle form-label">{t("Template Files")}</Label>
                                              </NavLink>
                                            </NavItem>
                                          </Nav> */}
                                        {/* {t("Standard Files")} |  {t("Template Files")} */}
                                      </Col>
                                    </Row>
                                    {foldersArray.length === 0 &&
                                    filesArray.length === 0 &&
                                    folderLoader === false &&
                                    filteredItems.length === 0 &&
                                    TypeTemp === "Files" ? (
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
                                                width: "100px",
                                                height: "auto",
                                              }}
                                            />
                                            <Label
                                              className="form-label"
                                              style={{ fontSize: "14px" }}
                                            >
                                              {t("No Folder or File Exist")}
                                            </Label>
                                          </Col>
                                        </Row>{" "}
                                      </>
                                    ) : null}
                                    <>
                                      {searchQuery.length === 0 ? (
                                        <>
                                          {currentItems.map((item, index) => (
                                            <>
                                              {item.folder_id === null ||
                                              item.folder_id === undefined ? (
                                                <Col md="4" xs="12">
                                                  <Card>
                                                    {/* <CardImg top src={img1} alt='card1' /> */}
                                                    <CardBody
                                                      style={{
                                                        cursor: "pointer",
                                                        backgroundColor: `${
                                                          item.only_signer ===
                                                            true ||
                                                          item.only_signer ===
                                                            "true"
                                                            ? "#dcf6ff"
                                                            : "light"
                                                        }`,
                                                      }}
                                                    >
                                                      <div
                                                        className="d-flex justify-content-between align-items-center"
                                                        onClick={async () => {
                                                          // editor/100730
                                                          if (
                                                            StatusData ===
                                                            "WaitingForMe"
                                                          ) {
                                                            //console.log(items.token.email);
                                                            const FILEID =
                                                              item.file_id;
                                                            const EMAILD =
                                                              user?.email;
                                                            const postData = {
                                                              file_id: FILEID,
                                                              email: EMAILD,
                                                            };
                                                            try {
                                                              const apiData =
                                                                await post(
                                                                  "file/waitingForMeDocLink",
                                                                  postData
                                                                ); // Specify the endpoint you want to call
                                                              //console.log('Recipients');
                                                              //console.log(apiData);
                                                              window.location.href =
                                                                apiData.data;
                                                            } catch (error) {
                                                              //console.log('Error fetching data:', error);
                                                            }
                                                          } else if (
                                                            item.status ===
                                                            "WaitingForOthers"
                                                            //  ||item.status === 'Completed'
                                                          ) {
                                                            window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                          } else if (
                                                            item.status ===
                                                            "Completed"
                                                          ) {
                                                            window.location.href = `/completed/file/${item.file_id}`;
                                                          } else {
                                                            window.location.href = `/esign-setup/${item.file_id}`;
                                                          }
                                                        }}
                                                      >
                                                        <CardTitle
                                                          tag="h4"
                                                          className="d-flex justify-content-left align-items-center"
                                                        >
                                                          <img
                                                            src={pdfIcon}
                                                            alt="pdf icon"
                                                            style={{
                                                              width:
                                                                pdfIcon_width,
                                                              height: "auto",
                                                            }}
                                                          />
                                                          <span
                                                            style={{
                                                              fontSize:text_name_size,
                                                              marginTop: "2%",
                                                              marginLeft:
                                                                "10px",
                                                              whiteSpace:
                                                                "nowrap",
                                                              overflow:
                                                                "hidden",
                                                              textOverflow:
                                                                "ellipsis",
                                                              maxWidth: "110px",
                                                              display:
                                                                "inline-block",
                                                            }}
                                                            title={
                                                              item.name.length >
                                                              10
                                                                ? item.name
                                                                : null
                                                            }
                                                          >
                                                            {highlightText(
                                                              `${item.name}`,
                                                              searchQuery
                                                            )}
                                                          </span>

                                                          {/* <span style={{ marginLeft: '10px' }}>
                                {item.name}
                              </span> */}
                                                        </CardTitle>
                                                        {/* folder icon here */}
                                                        {/* <File size={24} /> */}
                                                        <div
                                                          style={{
                                                            marginTop: "-25px",
                                                          }}
                                                        >
                                                          {item.only_signer ===
                                                            true ||
                                                          item.only_signer ===
                                                            "true" ? (
                                                            <Badge
                                                              color="primary"
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            >
                                                              <span
                                                                className="align-middle"
                                                                style={{
                                                                  fontSize:
                                                                    "14px",
                                                                }}
                                                              >
                                                                Self Signed
                                                              </span>
                                                            </Badge>
                                                          ) : null}
                                                          {StatusData ===
                                                          "WaitingForMe" ? (
                                                            <Badge color="danger">
                                                              <User
                                                                size={12}
                                                                className="align-middle me-25"
                                                              />
                                                              <span
                                                                className="align-middle"
                                                                style={{
                                                                  fontSize:
                                                                    "14px",
                                                                }}
                                                              >
                                                                {t(
                                                                  "Waiting For Me"
                                                                )}
                                                              </span>
                                                            </Badge>
                                                          ) : (
                                                            <>
                                                              {item.status ===
                                                              "InProgress" ? (
                                                                <Badge color="info">
                                                                  <Clock
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "In Progress"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {item.status ===
                                                              "WaitingForOthers" ? (
                                                                <Badge color="warning">
                                                                  <Users
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Waiting For Others"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {item.status ===
                                                              "WaitingForMe" ? (
                                                                <Badge color="danger">
                                                                  <User
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Waiting For Me"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {window.innerWidth <
                                                                730 ? null : (
                                                                  <> {item.status ===
                                                              "Completed" ? (
                                                                <Badge color="success">
                                                                  <CheckCircle
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Completed"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}</>)}
                                                            </>
                                                          )}
                                                        </div>
                                                      </div>

                                                      {/* <CardText>
                      This is a wider card with supporting text below as a natural lead-in to additional content. This content
                      is a little bit longer.
                    </CardText> */}
                                                      {/* image here */}

                                                      {/* <Badge color='primary'>
      <Star size={12} className='align-middle me-25' />
      <span className='align-middle'>Primary</span>
    </Badge> */}
                                                      <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                          <Move
                                                            size={sizeP_icon}
                                                            id="move"
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                              setFolderName(
                                                                item.name
                                                              );
                                                              setFileToMove(
                                                                item.file_id
                                                              );
                                                              setModalMove(
                                                                true
                                                              );
                                                            }}
                                                          />

                                                          {/* view  */}
                                                          <Eye
                                                            size={sizeP_icon}
                                                            id="viewingd"
                                                            style={{
                                                              cursor: "pointer",
                                                              marginLeft:
                                                                "10px",
                                                            }}
                                                            onClick={async () => {
                                                              if (
                                                                StatusData ===
                                                                "WaitingForMe"
                                                              ) {
                                                                //console.log(items.token.email);
                                                                const FILEID =
                                                                  item.file_id;
                                                                const EMAILD =
                                                                  user?.email;
                                                                const postData =
                                                                  {
                                                                    file_id:
                                                                      FILEID,
                                                                    email:
                                                                      EMAILD,
                                                                  };
                                                                try {
                                                                  const apiData =
                                                                    await post(
                                                                      "file/waitingForMeDocLink",
                                                                      postData
                                                                    ); // Specify the endpoint you want to call
                                                                  //console.log('Recipients');
                                                                  //console.log(apiData);
                                                                  window.location.href =
                                                                    apiData.data;
                                                                } catch (error) {
                                                                  //console.log('Error fetching data:', error);
                                                                }
                                                              } else if (
                                                                item.status ===
                                                                "WaitingForOthers"
                                                                //  ||item.status === 'Completed'
                                                              ) {
                                                                window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                              } else if (
                                                                item.status ===
                                                                "Completed"
                                                              ) {
                                                                window.location.href = `/completed/file/${item.file_id}`;
                                                              } else {
                                                                window.location.href = `/esign-setup/${item.file_id}`;
                                                              }
                                                            }}
                                                          />
                                                          {StatusData ===
                                                          "WaitingForMe" ? null : (
                                                            <>
                                                              <AtSign
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                id={`log_${item.file_id}`}
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color:
                                                                    "#FFCC99",
                                                                }}
                                                                onClick={async () => {
                                                                  await getActivityLog(
                                                                    item.file_id
                                                                  );
                                                                }}
                                                              />{" "}
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target={`log_${item.file_id}`}
                                                              >
                                                                {t("Audit Log")}
                                                              </UncontrolledTooltip>
                                                              <Download
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                id={`download1_${item.file_id}`}
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color: "grey",
                                                                }}
                                                                onClick={async () => {
                                                                  // console.log(item)
                                                                  let downloadUrl =
                                                                    item
                                                                      ?.bgimgs[0]
                                                                      ?.inprocess_doc||item
                                                                      ?.bgimgs[0]
                                                                      ?.image;
                                                                  await handleDownloadPDFApp(
                                                                    downloadUrl,
                                                                    item?.name
                                                                  );
                                                                }}
                                                              />{" "}
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target={`download1_${item.file_id}`}
                                                              >
                                                                {t("Download")}
                                                              </UncontrolledTooltip>
                                                            </>
                                                          )}
                                                          {/* Icons for edit delete with tooltip  */}
                                                          {StatusData ===
                                                            "WaitingForMe" ||
                                                          item.status ===
                                                            "WaitingForOthers" ||
                                                          item.status ===
                                                            "Completed" ? (
                                                            <></>
                                                          ) : (
                                                            <>
                                                              <Edit2
                                                                onClick={() => {
                                                                  window.location.href = `/esign-setup/${item.file_id}`;
                                                                }}
                                                                id="editingd"
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                }}
                                                              />
                                                              <Archive
                                                                onClick={() => {
                                                                  setDeleteFolderId(
                                                                    item.file_id
                                                                  );
                                                                  setFolderName(
                                                                    item.name
                                                                  );
                                                                  setItemArchieveConfirmationFile(
                                                                    true
                                                                  );
                                                                }}
                                                                id="archievingd"
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color:
                                                                    "#CC99FF",
                                                                }}
                                                              />
                                                              <Trash2
                                                                id="deletingd"
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color: "red",
                                                                }}
                                                                onClick={() => {
                                                                  setDeleteFolderId(
                                                                    item.file_id
                                                                  );
                                                                  setFolderName(
                                                                    item.name
                                                                  );
                                                                  setItemDeleteConfirmationFile(
                                                                    true
                                                                  );
                                                                }}
                                                              />
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target="editingd"
                                                              >
                                                                Edit
                                                              </UncontrolledTooltip>
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target="archievingd"
                                                              >
                                                                {t("Archive")}
                                                              </UncontrolledTooltip>

                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target="deletingd"
                                                              >
                                                                {t("Delete")}
                                                              </UncontrolledTooltip>
                                                            </>
                                                          )}
                                                          <UncontrolledTooltip
                                                            placement="bottom"
                                                            target="viewingd"
                                                          >
                                                            {t("View")}
                                                          </UncontrolledTooltip>
                                                          <UncontrolledTooltip
                                                            placement="bottom"
                                                            target="move"
                                                          >
                                                            {t("Move")}
                                                          </UncontrolledTooltip>
                                                        </div>
                                                        <div>
                                                        {window.innerWidth <
                                                        786 ? null : (
                                                          <> <h3>
                                                            {formatDateCustomTimelastActivity(
                                                              item.last_change
                                                            )}
                                                          </h3></> )} 
                                                        </div>
                                                      </div>
                                                      {/* <div style={{ display: 'flex', justifyContent: 'right' }}>
                            <h3 className='text-muted d-flex align-right'>{formatDate(item.last_change)}</h3>

                          </div> */}
                                                    </CardBody>
                                                    {/* <CardFooter>
                        
                        </CardFooter> */}
                                                  </Card>
                                                </Col>
                                              ) : (
                                                <Col md="4" xs="12">
                                                  <Card>
                                                    {/* <CardImg top src={img1} alt='card1' /> */}
                                                    <CardBody className="d-flex justify-content-between align-items-center">
                                                      <Row>
                                                        <Col
                                                          md="12"
                                                          xs="12"
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={() => {
                                                            if (
                                                              subFolderId ===
                                                                null ||
                                                              subFolderId ===
                                                                undefined ||
                                                              subFolderId ===
                                                                "null" ||
                                                              subFolderId ===
                                                                "undefined"
                                                            ) {
                                                              window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                            } else {
                                                              // Get the existing IDs from localStorage
                                                              let ids =
                                                                JSON.parse(
                                                                  localStorage.getItem(
                                                                    "ids"
                                                                  )
                                                                ) || [];

                                                              // Add the new ID
                                                              ids.push(prevId);

                                                              // Save the updated array back to localStorage
                                                              localStorage.setItem(
                                                                "ids",
                                                                JSON.stringify(
                                                                  ids
                                                                )
                                                              );

                                                              window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                            }
                                                          }}
                                                        >
                                                          <CardTitle
                                                            tag="h3"
                                                            className="d-flex justify-content-left align-items-center"
                                                          >
                                                            {/* folder icon here */}
                                                            <Folder
                                                              style={{
                                                                color: `${item.color}`,
                                                              }}
                                                              size={folder_icon_size}
                                                            />
                                                            <span
                                                              style={{
                                                                fontSize:text_name_size,
                                                                marginLeft:
                                                                  "10px",
                                                                marginTop: "2%",
                                                                whiteSpace:
                                                                  "nowrap",
                                                                overflow:
                                                                  "hidden",
                                                                textOverflow:
                                                                  "ellipsis",
                                                                maxWidth:
                                                                  "150px",
                                                                display:
                                                                  "inline-block",
                                                              }}
                                                              title={
                                                                item.folder_name
                                                                  .length > 15
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
                                                            <div>
                                                              {/* <Row>
                                          <Col xs={6}> */}
                                                              {/* view  */}
                                                              <Eye
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                id="viewd"
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={async () => {
                                                                  if (
                                                                    StatusData ===
                                                                    "WaitingForMe"
                                                                  ) {
                                                                    //console.log(items.token.email);
                                                                    const FILEID =
                                                                      item.file_id;
                                                                    const EMAILD =
                                                                      user?.email;
                                                                    const postData =
                                                                      {
                                                                        file_id:
                                                                          FILEID,
                                                                        email:
                                                                          EMAILD,
                                                                      };
                                                                    try {
                                                                      const apiData =
                                                                        await post(
                                                                          "file/waitingForMeDocLink",
                                                                          postData
                                                                        ); // Specify the endpoint you want to call
                                                                      //console.log('Recipients');
                                                                      //console.log(apiData);
                                                                      window.location.href =
                                                                        apiData.data;
                                                                    } catch (error) {
                                                                      //console.log('Error fetching data:', error);
                                                                    }
                                                                  } else {
                                                                    if (
                                                                      subFolderId ===
                                                                        null ||
                                                                      subFolderId ===
                                                                        undefined ||
                                                                      subFolderId ===
                                                                        "null" ||
                                                                      subFolderId ===
                                                                        "undefined"
                                                                    ) {
                                                                      window.location.href = `/home/${item.uniq_id}/${subFolderId}`;

                                                                      // Get the existing IDs from localStorage
                                                                      let ids =
                                                                        JSON.parse(
                                                                          localStorage.getItem(
                                                                            "ids"
                                                                          )
                                                                        ) || [];

                                                                      // Add the new ID
                                                                      ids.push(
                                                                        prevId
                                                                      );

                                                                      // Save the updated array back to localStorage
                                                                      localStorage.setItem(
                                                                        "ids",
                                                                        JSON.stringify(
                                                                          ids
                                                                        )
                                                                      );
                                                                      window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                                    }
                                                                  }
                                                                }}
                                                              />
                                                              {/* Icons for edit delete with tooltip  */}
                                                              {StatusData ===
                                                                "WaitingForMe" ||
                                                              item.status ===
                                                                "WaitingForOthers" ||
                                                              item.status ===
                                                                "Completed" ? (
                                                                <></>
                                                              ) : (
                                                                <>
                                                                  <Edit2
                                                                    onClick={() => {
                                                                      //console.log(item.folder_name);
                                                                      //console.log(item.folder_id);
                                                                      setFolderNameUpdate(
                                                                        item.folder_name
                                                                      );
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setModalUpdate(
                                                                        true
                                                                      );
                                                                    }}
                                                                    id="editd"
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                    }}
                                                                  />

                                                                  <Archive
                                                                    id="archieved"
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                      color:
                                                                        "#CC99FF",
                                                                    }}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setFolderName(
                                                                        item.folder_name
                                                                      );
                                                                      setItemArchieveConfirmation(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <Trash2
                                                                    id="deleted"
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setFolderName(
                                                                        item.folder_name
                                                                      );
                                                                      setItemDeleteConfirmation(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target="editd"
                                                                  >
                                                                    {t(
                                                                      "Rename"
                                                                    )}
                                                                  </UncontrolledTooltip>

                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target="deleted"
                                                                  >
                                                                    {t(
                                                                      "Delete"
                                                                    )}
                                                                  </UncontrolledTooltip>
                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target="archieved"
                                                                  >
                                                                    {t(
                                                                      "Archive"
                                                                    )}
                                                                  </UncontrolledTooltip>
                                                                </>
                                                              )}
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target="viewd"
                                                              >
                                                                {t("View")}
                                                              </UncontrolledTooltip>
                                                              {/* </Col> */}
                                                            </div>
                                                            <div>
                                                              {/* <Col xs={6} style={{ display: 'flex', justifyContent: 'right' }}> */}
                                                              {/* <h3>
                                                                    {formatDateCustomTimelastActivity(item.last_change)}
                                                                  </h3> */}
                                                              {/* </Col> */}
                                                            </div>
                                                          </div>

                                                          {/* </Row> */}
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
                                        </>
                                      ) : (
                                        <>
                                          {filteredItems.map((item, index) => (
                                            <>
                                              {item.folder_id === null ||
                                              item.folder_id === undefined ? (
                                                <Col md="4" xs="12">
                                                  <Card>
                                                    {/* <CardImg top src={img1} alt='card1' /> */}
                                                    <CardBody
                                                      style={{
                                                        cursor: "pointer",
                                                        backgroundColor: `${
                                                          item.only_signer ===
                                                            true ||
                                                          item.only_signer ===
                                                            "true"
                                                            ? "#dcf6ff"
                                                            : "light"
                                                        }`,
                                                      }}
                                                    >
                                                      <div
                                                        className="d-flex justify-content-between align-items-center"
                                                        onClick={async () => {
                                                          // editor/100730
                                                          if (
                                                            StatusData ===
                                                            "WaitingForMe"
                                                          ) {
                                                            //console.log(items.token.email);
                                                            const FILEID =
                                                              item.file_id;
                                                            const EMAILD =
                                                              user?.email;
                                                            const postData = {
                                                              file_id: FILEID,
                                                              email: EMAILD,
                                                            };
                                                            try {
                                                              const apiData =
                                                                await post(
                                                                  "file/waitingForMeDocLink",
                                                                  postData
                                                                ); // Specify the endpoint you want to call
                                                              //console.log('Recipients');
                                                              //console.log(apiData);
                                                              window.location.href =
                                                                apiData.data;
                                                            } catch (error) {
                                                              //console.log('Error fetching data:', error);
                                                            }
                                                          } else if (
                                                            item.status ===
                                                            "WaitingForOthers"
                                                            //  ||item.status === 'Completed'
                                                          ) {
                                                            window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                          } else if (
                                                            item.status ===
                                                            "Completed"
                                                          ) {
                                                            window.location.href = `/completed/file/${item.file_id}`;
                                                          } else {
                                                            window.location.href = `/esign-setup/${item.file_id}`;
                                                          }
                                                        }}
                                                      >
                                                        <CardTitle
                                                          tag="h4"
                                                          className="d-flex justify-content-left align-items-center"
                                                        >
                                                          <img
                                                            src={pdfIcon}
                                                            alt="pdf icon"
                                                            style={{
                                                              width:
                                                                pdfIcon_width,
                                                              height: "auto",
                                                            }}
                                                          />
                                                          <span
                                                            style={{
                                                              fontSize:text_name_size,
                                                              marginTop: "2%",
                                                              marginLeft:
                                                                "10px",
                                                              whiteSpace:
                                                                "nowrap",
                                                              overflow:
                                                                "hidden",
                                                              textOverflow:
                                                                "ellipsis",
                                                              maxWidth: "110px",
                                                              display:
                                                                "inline-block",
                                                            }}
                                                            title={
                                                              item.name.length >
                                                              10
                                                                ? item.name
                                                                : null
                                                            }
                                                          >
                                                            {highlightText(
                                                              `${item.name}`,
                                                              searchQuery
                                                            )}
                                                          </span>

                                                          {/* <span style={{ marginLeft: '10px' }}>
                                {item.name}
                              </span> */}
                                                        </CardTitle>
                                                        {/* folder icon here */}
                                                        {/* <File size={24} /> */}
                                                        <div
                                                          style={{
                                                            marginTop: "-25px",
                                                          }}
                                                        >
                                                          {item.only_signer ===
                                                            true ||
                                                          item.only_signer ===
                                                            "true" ? (
                                                            <Badge
                                                              color="primary"
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            >
                                                              <span
                                                                className="align-middle"
                                                                style={{
                                                                  fontSize:
                                                                    "14px",
                                                                }}
                                                              >
                                                                Self Signed
                                                              </span>
                                                            </Badge>
                                                          ) : null}
                                                          {StatusData ===
                                                          "WaitingForMe" ? (
                                                            <Badge color="danger">
                                                              <User
                                                                size={12}
                                                                className="align-middle me-25"
                                                              />
                                                              <span
                                                                className="align-middle"
                                                                style={{
                                                                  fontSize:
                                                                    "14px",
                                                                }}
                                                              >
                                                                {t(
                                                                  "Waiting For Me"
                                                                )}
                                                              </span>
                                                            </Badge>
                                                          ) : (
                                                            <>
                                                              {item.status ===
                                                              "InProgress" ? (
                                                                <Badge color="info">
                                                                  <Clock
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "In Progress"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {item.status ===
                                                              "WaitingForOthers" ? (
                                                                <Badge color="warning">
                                                                  <Users
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Waiting For Others"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {item.status ===
                                                              "WaitingForMe" ? (
                                                                <Badge color="danger">
                                                                  <User
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Waiting For Me"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {window.innerWidth <
                                                                730 ? null : (
                                                                  <> {item.status ===
                                                              "Completed" ? (
                                                                <Badge color="success">
                                                                  <CheckCircle
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Completed"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}</>)}
                                                            </>
                                                          )}
                                                        </div>
                                                      </div>

                                                      {/* <CardText>
                      This is a wider card with supporting text below as a natural lead-in to additional content. This content
                      is a little bit longer.
                    </CardText> */}
                                                      {/* image here */}

                                                      {/* <Badge color='primary'>
      <Star size={12} className='align-middle me-25' />
      <span className='align-middle'>Primary</span>
    </Badge> */}
                                                      <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                          <Move
                                                            size={sizeP_icon}
                                                            id="move"
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                              setFolderName(
                                                                item.name
                                                              );
                                                              setFileToMove(
                                                                item.file_id
                                                              );
                                                              setModalMove(
                                                                true
                                                              );
                                                            }}
                                                          />

                                                          {/* view  */}
                                                          <Eye
                                                            size={sizeP_icon}
                                                            id="viewingd"
                                                            style={{
                                                              cursor: "pointer",
                                                              marginLeft:
                                                                "10px",
                                                            }}
                                                            onClick={async () => {
                                                              if (
                                                                StatusData ===
                                                                "WaitingForMe"
                                                              ) {
                                                                //console.log(items.token.email);
                                                                const FILEID =
                                                                  item.file_id;
                                                                const EMAILD =
                                                                  user?.email;
                                                                const postData =
                                                                  {
                                                                    file_id:
                                                                      FILEID,
                                                                    email:
                                                                      EMAILD,
                                                                  };
                                                                try {
                                                                  const apiData =
                                                                    await post(
                                                                      "file/waitingForMeDocLink",
                                                                      postData
                                                                    ); // Specify the endpoint you want to call
                                                                  //console.log('Recipients');
                                                                  //console.log(apiData);
                                                                  window.location.href =
                                                                    apiData.data;
                                                                } catch (error) {
                                                                  //console.log('Error fetching data:', error);
                                                                }
                                                              } else if (
                                                                item.status ===
                                                                "WaitingForOthers"
                                                                //  ||item.status === 'Completed'
                                                              ) {
                                                                window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                              } else if (
                                                                item.status ===
                                                                "Completed"
                                                              ) {
                                                                window.location.href = `/completed/file/${item.file_id}`;
                                                              } else {
                                                                window.location.href = `/esign-setup/${item.file_id}`;
                                                              }
                                                            }}
                                                          />
                                                          {StatusData ===
                                                          "WaitingForMe" ? null : (
                                                            <>
                                                              <AtSign
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                id={`log_${item.file_id}`}
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color:
                                                                    "#FFCC99",
                                                                }}
                                                                onClick={async () => {
                                                                  await getActivityLog(
                                                                    item.file_id
                                                                  );
                                                                }}
                                                              />{" "}
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target={`log_${item.file_id}`}
                                                              >
                                                                {t("Audit Log")}
                                                              </UncontrolledTooltip>
                                                            </>
                                                          )}
                                                          {/* Icons for edit delete with tooltip  */}
                                                          {StatusData ===
                                                            "WaitingForMe" ||
                                                          item.status ===
                                                            "WaitingForOthers" ||
                                                          item.status ===
                                                            "Completed" ? (
                                                            <></>
                                                          ) : (
                                                            <>
                                                              <Edit2
                                                                onClick={() => {
                                                                  window.location.href = `/esign-setup/${item.file_id}`;
                                                                }}
                                                                id="editingd"
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                }}
                                                              />
                                                              <Archive
                                                                onClick={() => {
                                                                  setDeleteFolderId(
                                                                    item.file_id
                                                                  );
                                                                  setFolderName(
                                                                    item.name
                                                                  );
                                                                  setItemArchieveConfirmationFile(
                                                                    true
                                                                  );
                                                                }}
                                                                id="archievingd"
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color:
                                                                    "#CC99FF",
                                                                }}
                                                              />
                                                              <Trash2
                                                                id="deletingd"
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                  marginLeft:
                                                                    "10px",
                                                                  color: "red",
                                                                }}
                                                                onClick={() => {
                                                                  setDeleteFolderId(
                                                                    item.file_id
                                                                  );
                                                                  setFolderName(
                                                                    item.name
                                                                  );
                                                                  setItemDeleteConfirmationFile(
                                                                    true
                                                                  );
                                                                }}
                                                              />
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target="editingd"
                                                              >
                                                                Edit
                                                              </UncontrolledTooltip>
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target="archievingd"
                                                              >
                                                                {t("Archive")}
                                                              </UncontrolledTooltip>

                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target="deletingd"
                                                              >
                                                                {t("Delete")}
                                                              </UncontrolledTooltip>
                                                            </>
                                                          )}
                                                          <UncontrolledTooltip
                                                            placement="bottom"
                                                            target="viewingd"
                                                          >
                                                            {t("View")}
                                                          </UncontrolledTooltip>
                                                          <UncontrolledTooltip
                                                            placement="bottom"
                                                            target="move"
                                                          >
                                                            {t("Move")}
                                                          </UncontrolledTooltip>
                                                        </div>
                                                        <div>
                                                        {window.innerWidth <
                                                        786 ? null : (
                                                          <>   <h3>
                                                            {formatDateCustomTimelastActivity(
                                                              item.last_change
                                                            )}
                                                          </h3></>)}
                                                        </div>
                                                      </div>
                                                      {/* <div style={{ display: 'flex', justifyContent: 'right' }}>
                            <h3 className='text-muted d-flex align-right'>{formatDateCustomTimelastActivity(item.last_change)}</h3>

                          </div> */}
                                                    </CardBody>
                                                    {/* <CardFooter>
                        
                        </CardFooter> */}
                                                  </Card>
                                                </Col>
                                              ) : (
                                                <Col md="4" xs="12">
                                                  <Card>
                                                    {/* <CardImg top src={img1} alt='card1' /> */}
                                                    <CardBody className="d-flex justify-content-between align-items-center">
                                                      <Row>
                                                        <Col
                                                          md="12"
                                                          xs="12"
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={() => {
                                                            if (
                                                              subFolderId ===
                                                                null ||
                                                              subFolderId ===
                                                                undefined ||
                                                              subFolderId ===
                                                                "null" ||
                                                              subFolderId ===
                                                                "undefined"
                                                            ) {
                                                              window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                            } else {
                                                              // Get the existing IDs from localStorage
                                                              let ids =
                                                                JSON.parse(
                                                                  localStorage.getItem(
                                                                    "ids"
                                                                  )
                                                                ) || [];

                                                              // Add the new ID
                                                              ids.push(prevId);

                                                              // Save the updated array back to localStorage
                                                              localStorage.setItem(
                                                                "ids",
                                                                JSON.stringify(
                                                                  ids
                                                                )
                                                              );

                                                              window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                            }
                                                          }}
                                                        >
                                                          <CardTitle
                                                            tag="h3"
                                                            className="d-flex justify-content-left align-items-center"
                                                          >
                                                            {/* folder icon here */}
                                                            <Folder
                                                              style={{
                                                                color: `${item.color}`,
                                                              }}
                                                              size={folder_icon_size}
                                                            />
                                                            <span
                                                              style={{
                                                                fontSize:text_name_size,
                                                                marginLeft:
                                                                  "10px",
                                                                marginTop: "2%",
                                                                whiteSpace:
                                                                  "nowrap",
                                                                overflow:
                                                                  "hidden",
                                                                textOverflow:
                                                                  "ellipsis",
                                                                maxWidth:
                                                                  "150px",
                                                                display:
                                                                  "inline-block",
                                                              }}
                                                              title={
                                                                item.folder_name
                                                                  .length > 15
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
                                                            <div>
                                                              {/* <Row>
                                          <Col xs={6}> */}
                                                              {/* view  */}
                                                              <Eye
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                id="viewd"
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={async () => {
                                                                  if (
                                                                    StatusData ===
                                                                    "WaitingForMe"
                                                                  ) {
                                                                    //console.log(items.token.email);
                                                                    const FILEID =
                                                                      item.file_id;
                                                                    const EMAILD =
                                                                      user?.email;
                                                                    const postData =
                                                                      {
                                                                        file_id:
                                                                          FILEID,
                                                                        email:
                                                                          EMAILD,
                                                                      };
                                                                    try {
                                                                      const apiData =
                                                                        await post(
                                                                          "file/waitingForMeDocLink",
                                                                          postData
                                                                        ); // Specify the endpoint you want to call
                                                                      //console.log('Recipients');
                                                                      //console.log(apiData);
                                                                      window.location.href =
                                                                        apiData.data;
                                                                    } catch (error) {
                                                                      //console.log('Error fetching data:', error);
                                                                    }
                                                                  } else {
                                                                    if (
                                                                      subFolderId ===
                                                                        null ||
                                                                      subFolderId ===
                                                                        undefined ||
                                                                      subFolderId ===
                                                                        "null" ||
                                                                      subFolderId ===
                                                                        "undefined"
                                                                    ) {
                                                                      window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                                    } else {
                                                                      // Get the existing IDs from localStorage
                                                                      let ids =
                                                                        JSON.parse(
                                                                          localStorage.getItem(
                                                                            "ids"
                                                                          )
                                                                        ) || [];

                                                                      // Add the new ID
                                                                      ids.push(
                                                                        prevId
                                                                      );

                                                                      // Save the updated array back to localStorage
                                                                      localStorage.setItem(
                                                                        "ids",
                                                                        JSON.stringify(
                                                                          ids
                                                                        )
                                                                      );
                                                                      window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                                    }
                                                                  }
                                                                }}
                                                              />
                                                              {/* Icons for edit delete with tooltip  */}
                                                              {StatusData ===
                                                                "WaitingForMe" ||
                                                              item.status ===
                                                                "WaitingForOthers" ||
                                                              item.status ===
                                                                "Completed" ? (
                                                                <></>
                                                              ) : (
                                                                <>
                                                                  <Edit2
                                                                    onClick={() => {
                                                                      //console.log(item.folder_name);
                                                                      //console.log(item.folder_id);
                                                                      setFolderNameUpdate(
                                                                        item.folder_name
                                                                      );
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setModalUpdate(
                                                                        true
                                                                      );
                                                                    }}
                                                                    id="editd"
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                    }}
                                                                  />

                                                                  <Archive
                                                                    id="archieved"
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                      color:
                                                                        "#CC99FF",
                                                                    }}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setFolderName(
                                                                        item.folder_name
                                                                      );
                                                                      setItemArchieveConfirmation(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <Trash2
                                                                    id="deleted"
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setFolderName(
                                                                        item.folder_name
                                                                      );
                                                                      setItemDeleteConfirmation(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target="editd"
                                                                  >
                                                                    {t(
                                                                      "Rename"
                                                                    )}
                                                                  </UncontrolledTooltip>

                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target="deleted"
                                                                  >
                                                                    {t(
                                                                      "Delete"
                                                                    )}
                                                                  </UncontrolledTooltip>
                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target="archieved"
                                                                  >
                                                                    {t(
                                                                      "Archive"
                                                                    )}
                                                                  </UncontrolledTooltip>
                                                                </>
                                                              )}
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target="viewd"
                                                              >
                                                                {t("View")}
                                                              </UncontrolledTooltip>
                                                              {/* </Col> */}
                                                            </div>
                                                            <div>
                                                              {/* <Col xs={6} style={{ display: 'flex', justifyContent: 'right' }}> */}
                                                              {window.innerWidth <
                                                        786 ? null : (
                                                          <>   <h3>
                                                                {formatDateCustomTimelastActivity(
                                                                  item.last_change
                                                                )}
                                                              </h3></>)}
                                                              {/* </Col> */}
                                                            </div>
                                                          </div>

                                                          {/* </Row> */}
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
                                        </>
                                      )}
                                    </>
                                  </>
                                )}
                                {currentItems.length === 0 ? null : (
                                  <div
                                    style={{
                                      display: "flex",
                                      padding: "5px",
                                      justifyContent: "right",
                                      alignItems: "center",
                                    }}
                                  >
                                    {searchQuery.length === 0 ? (
                                      <>
                                        <PaginationComponent
                                          currentPage={currentPage}
                                          itemsPerPage={itemsPerPage}
                                          totalItems={allItems?.length}
                                          handlePageChange={handlePageChange}
                                          handlePageChangeNo={
                                            handlePageChangeNo
                                          }
                                        />
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                )}
                              </Row>
                            </>
                          ) : (
                            <>
                              <Col md="12" xs="12">
                                <div className="table-responsive">
                                  <Table>
                                    <thead style={{ padding: "100px" }}>
                                      <tr>
                                        <th
                                          onClick={() => handleSort("name")}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <h4 style={{ fontWeight: 700 }}>
                                            {t("Name")}
                                            {sortField === "name"
                                              ? sortDirection === "asc"
                                                ? "↑"
                                                : "↓"
                                              : "↑↓"}
                                          </h4>

                                          {/* {sortAscending ? <ArrowUp size={15} /> : <ArrowDown size={15} />} */}
                                        </th>
                                        {/* <th>
                                          {' '}
                                          <h3 style={{fontWeight: 700}}>Status</h3>
                                        </th> */}

                                        {StatusData ===
                                        "WaitingForMe" ? null : (
                                          <th
                                            onClick={() => handleSort("name")}
                                            style={{ cursor: "pointer" }}
                                          >
                                            <h4 style={{ fontWeight: 700 }}>
                                              {t("Last Activity")}
                                              {sortField === "last_change"
                                                ? sortDirection === "asc"
                                                  ? "↑"
                                                  : "↓"
                                                : "↑↓"}
                                            </h4>
                                          </th>
                                        )}

                                        <th>
                                          <h4 style={{ fontWeight: 700 }}>
                                            {t("Actions")}
                                          </h4>
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      <tr>
                                        <td colspan="4">
                                          {folderLoader ? (
                                            <>
                                              <Row>
                                                <Col
                                                  md="12"
                                                  xs="12"
                                                  className="d-flex justify-content-center"
                                                >
                                                  {/* <Spinner color="primary" /> */}
                                                  <SpinnerCustom color="primary" />
                                                </Col>
                                              </Row>
                                            </>
                                          ) : (
                                            <></>
                                          )}

                                          {filteredItems.length === 0 ? (
                                            <></>
                                          ) : null}
                                          {foldersArray.length === 0 &&
                                          filesArray.length === 0 &&
                                          filteredItems.length === 0 &&
                                          folderLoader === false ? (
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
                                                      width: "100px",
                                                      height: "auto",
                                                    }}
                                                  />
                                                  <h4>
                                                    {t(
                                                      "No Folder or File Exist"
                                                    )}
                                                  </h4>
                                                </Col>
                                              </Row>{" "}
                                            </>
                                          ) : null}
                                        </td>{" "}
                                      </tr>
                                      {StatusData === "InProgress" ||
                                      StatusData === "WaitingForOthers" ||
                                      StatusData === "WaitingForMe" ? (
                                        <>
                                          {searchQuery.length === 0 ? (
                                            <>
                                              {currentItems.map(
                                                (item, index) => (
                                                  <>
                                                    {item.folder_id === null ||
                                                    item.folder_id ===
                                                      undefined ? (
                                                      <tr>
                                                        <td
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={async () => {
                                                            if (
                                                              StatusData ===
                                                              "WaitingForMe"
                                                            ) {
                                                              //console.log(items.token.email);
                                                              const FILEID =
                                                                item.file_id;
                                                              const EMAILD =
                                                                user?.email;
                                                              const postData = {
                                                                file_id: FILEID,
                                                                email: EMAILD,
                                                              };
                                                              try {
                                                                const apiData =
                                                                  await post(
                                                                    "file/waitingForMeDocLink",
                                                                    postData
                                                                  ); // Specify the endpoint you want to call
                                                                //console.log('Recipients');
                                                                //console.log(apiData);
                                                                window.location.href =
                                                                  apiData.data;
                                                              } catch (error) {
                                                                //console.log('Error fetching data:', error);
                                                              }
                                                            } else if (
                                                              item.status ===
                                                              "WaitingForOthers"
                                                              //  ||item.status === 'Completed'
                                                            ) {
                                                              window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                            } else if (
                                                              item.status ===
                                                              "Completed"
                                                            ) {
                                                              window.location.href = `/completed/file/${item.file_id}`;
                                                            } else {
                                                              window.location.href = `/esign-setup/${item.file_id}`;
                                                            }
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              display: "flex",
                                                              cursor: "pointer",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <img
                                                              src={pdfIcon}
                                                              alt="pdf icon"
                                                              style={{
                                                                width:
                                                                  pdfIcon_width,
                                                                height: "auto",
                                                              }}
                                                            />
                                                            <h3
                                                              style={{
                                                                marginLeft:
                                                                  "20px",
                                                              }}
                                                            >
                                                              {" "}
                                                              {highlightText(
                                                                `${item.name}`,
                                                                searchQuery
                                                              )}
                                                            </h3>
                                                          </span>
                                                        </td>

                                                        {StatusData ===
                                                        "WaitingForMe" ? null : (
                                                          <td>
                                                            <h3>
                                                              {formatDateCustomTimelastActivity(
                                                                item.last_change
                                                              )}
                                                            </h3>
                                                          </td>
                                                        )}
                                                        <td>
                                                          <div className="d-flex justify-content-between">
                                                            <div className="d-flex justify-content-between">
                                                              {/* view  */}
                                                              {/* fdfdffd */}

                                                              <CustomBadge
                                                                color="info"
                                                                text={t("View")}
                                                                onClick={async () => {
                                                                  if (
                                                                    StatusData ===
                                                                    "WaitingForMe"
                                                                  ) {
                                                                    //console.log(items.token.email);
                                                                    const FILEID =
                                                                      item.file_id;
                                                                    const EMAILD =
                                                                      user?.email;
                                                                    const postData =
                                                                      {
                                                                        file_id:
                                                                          FILEID,
                                                                        email:
                                                                          EMAILD,
                                                                      };
                                                                    try {
                                                                      const apiData =
                                                                        await post(
                                                                          "file/waitingForMeDocLink",
                                                                          postData
                                                                        ); // Specify the endpoint you want to call
                                                                      //console.log('Recipients');
                                                                      //console.log(apiData);
                                                                      window.location.href =
                                                                        apiData.data;
                                                                    } catch (error) {
                                                                      //console.log('Error fetching data:', error);
                                                                    }
                                                                  } else if (
                                                                    item.status ===
                                                                    "WaitingForOthers"
                                                                    //  ||item.status === 'Completed'
                                                                  ) {
                                                                    window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                                  } else if (
                                                                    item.status ===
                                                                    "Completed"
                                                                  ) {
                                                                    window.location.href = `/completed/file/${item.file_id}`;
                                                                  } else {
                                                                    window.location.href = `/esign-setup/${item.file_id}`;
                                                                  }
                                                                }}
                                                              />

                                                              {StatusData ===
                                                                "WaitingForMe" ||
                                                              item.status ===
                                                                "WaitingForOthers" ||
                                                              item.status ===
                                                                "Completed" ? (
                                                                <></>
                                                              ) : (
                                                                <>
                                                                  {" "}
                                                                  <CustomBadge
                                                                    color="success"
                                                                    text={t(
                                                                      "Edit"
                                                                    )}
                                                                    onClick={() => {
                                                                      window.location.href = `/esign-setup/${item.file_id}`;
                                                                    }}
                                                                  />
                                                                  <CustomBadge
                                                                    color="secondary"
                                                                    text={t(
                                                                      "Archive"
                                                                    )}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.file_id
                                                                      );
                                                                      setFolderName(
                                                                        item.name
                                                                      );
                                                                      setItemArchieveConfirmationFile(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <CustomBadge
                                                                    color="danger"
                                                                    text={t(
                                                                      "Trash"
                                                                    )}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.file_id
                                                                      );
                                                                      setFolderName(
                                                                        item.name
                                                                      );
                                                                      setItemDeleteConfirmationFile(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              )}

                                                              {StatusData ===
                                                              "WaitingForMe" ? null : (
                                                                <>
                                                                  <CustomBadge
                                                                    color="warning"
                                                                    text={t(
                                                                      "Audit Log"
                                                                    )}
                                                                    onClick={async () => {
                                                                      await getActivityLog(
                                                                        item.file_id
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              )}
                                                              {StatusData ===
                                                              "Completed" ? (
                                                                <>
                                                                  <CustomBadge
                                                                    color="primary"
                                                                    text={t(
                                                                      "Download"
                                                                    )}
                                                                    onClick={async () => {
                                                                      // console.log(item)
                                                                      let downloadUrl =
                                                                        item
                                                                          ?.bgimgs[0]
                                                                          ?.inprocess_doc;
                                                                      await handleDownloadPDFApp(
                                                                        downloadUrl,
                                                                        item?.name
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              ) : (
                                                                <>
                                                                  <CustomBadge
                                                                    color="primary"
                                                                    text={t(
                                                                      "Download"
                                                                    )}
                                                                    onClick={async () => {
                                                                      // console.log(item)
                                                                      let downloadUrl =
                                                                        item
                                                                          ?.bgimgs[0]
                                                                          ?.inprocess_doc;
                                                                      await handleDownloadPDFApp(
                                                                        downloadUrl,
                                                                        item?.name
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    ) : null}
                                                  </>
                                                )
                                              )}{" "}
                                            </>
                                          ) : (
                                            <>
                                              {filteredItems.map(
                                                (item, index) => (
                                                  <>
                                                    {item.folder_id === null ||
                                                    item.folder_id ===
                                                      undefined ? (
                                                      <>
                                                        <tr>
                                                          <td
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            onClick={async () => {
                                                              if (
                                                                StatusData ===
                                                                "WaitingForMe"
                                                              ) {
                                                                //console.log(items.token.email);
                                                                const FILEID =
                                                                  item.file_id;
                                                                const EMAILD =
                                                                  user?.email;
                                                                const postData =
                                                                  {
                                                                    file_id:
                                                                      FILEID,
                                                                    email:
                                                                      EMAILD,
                                                                  };
                                                                try {
                                                                  const apiData =
                                                                    await post(
                                                                      "file/waitingForMeDocLink",
                                                                      postData
                                                                    ); // Specify the endpoint you want to call
                                                                  //console.log('Recipients');
                                                                  //console.log(apiData);
                                                                  window.location.href =
                                                                    apiData.data;
                                                                } catch (error) {
                                                                  //console.log('Error fetching data:', error);
                                                                }
                                                              } else if (
                                                                item.status ===
                                                                "WaitingForOthers"
                                                                //  ||item.status === 'Completed'
                                                              ) {
                                                                window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                              } else if (
                                                                item.status ===
                                                                "Completed"
                                                              ) {
                                                                window.location.href = `/completed/file/${item.file_id}`;
                                                              } else {
                                                                window.location.href = `/esign-setup/${item.file_id}`;
                                                              }
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                display: "flex",
                                                                cursor:
                                                                  "pointer",
                                                                alignItems:
                                                                  "center",
                                                              }}
                                                            >
                                                              <img
                                                                src={pdfIcon}
                                                                alt="pdf icon"
                                                                style={{
                                                                  width:
                                                                    pdfIcon_width,
                                                                  height:
                                                                    "auto",
                                                                }}
                                                              />
                                                              <h3
                                                                style={{
                                                                  marginLeft:
                                                                    "20px",
                                                                }}
                                                              >
                                                                {" "}
                                                                {highlightText(
                                                                  `${item.name}`,
                                                                  searchQuery
                                                                )}
                                                              </h3>
                                                            </span>
                                                          </td>

                                                          {StatusData ===
                                                          "WaitingForMe" ? null : (
                                                            <td>
                                                              <h3>
                                                                {formatDateCustomTimelastActivity(
                                                                  item.last_change
                                                                )}
                                                              </h3>
                                                            </td>
                                                          )}
                                                          <td>
                                                            <div className="d-flex justify-content-between">
                                                              <div className="d-flex justify-content-between">
                                                                {/* view  */}
                                                                {/* fdfdffd */}

                                                                <CustomBadge
                                                                  color="info"
                                                                  text={t(
                                                                    "View"
                                                                  )}
                                                                  onClick={async () => {
                                                                    if (
                                                                      StatusData ===
                                                                      "WaitingForMe"
                                                                    ) {
                                                                      //console.log(items.token.email);
                                                                      const FILEID =
                                                                        item.file_id;
                                                                      const EMAILD =
                                                                        user?.email;
                                                                      const postData =
                                                                        {
                                                                          file_id:
                                                                            FILEID,
                                                                          email:
                                                                            EMAILD,
                                                                        };
                                                                      try {
                                                                        const apiData =
                                                                          await post(
                                                                            "file/waitingForMeDocLink",
                                                                            postData
                                                                          ); // Specify the endpoint you want to call
                                                                        //console.log('Recipients');
                                                                        //console.log(apiData);
                                                                        window.location.href =
                                                                          apiData.data;
                                                                      } catch (error) {
                                                                        //console.log('Error fetching data:', error);
                                                                      }
                                                                    } else if (
                                                                      item.status ===
                                                                      "WaitingForOthers"
                                                                      //  ||item.status === 'Completed'
                                                                    ) {
                                                                      window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                                    } else if (
                                                                      item.status ===
                                                                      "Completed"
                                                                    ) {
                                                                      window.location.href = `/completed/file/${item.file_id}`;
                                                                    } else {
                                                                      window.location.href = `/esign-setup/${item.file_id}`;
                                                                    }
                                                                  }}
                                                                />

                                                                {StatusData ===
                                                                  "WaitingForMe" ||
                                                                item.status ===
                                                                  "WaitingForOthers" ||
                                                                item.status ===
                                                                  "Completed" ? (
                                                                  <></>
                                                                ) : (
                                                                  <>
                                                                    {" "}
                                                                    <CustomBadge
                                                                      color="success"
                                                                      text={t(
                                                                        "Edit"
                                                                      )}
                                                                      onClick={() => {
                                                                        window.location.href = `/esign-setup/${item.file_id}`;
                                                                      }}
                                                                    />
                                                                    <CustomBadge
                                                                      color="secondary"
                                                                      text={t(
                                                                        "Archive"
                                                                      )}
                                                                      onClick={() => {
                                                                        setDeleteFolderId(
                                                                          item.file_id
                                                                        );
                                                                        setFolderName(
                                                                          item.name
                                                                        );
                                                                        setItemArchieveConfirmationFile(
                                                                          true
                                                                        );
                                                                      }}
                                                                    />
                                                                    <CustomBadge
                                                                      color="danger"
                                                                      text={t(
                                                                        "Trash"
                                                                      )}
                                                                      onClick={() => {
                                                                        setDeleteFolderId(
                                                                          item.file_id
                                                                        );
                                                                        setFolderName(
                                                                          item.name
                                                                        );
                                                                        setItemDeleteConfirmationFile(
                                                                          true
                                                                        );
                                                                      }}
                                                                    />
                                                                  </>
                                                                )}

                                                                {StatusData ===
                                                                "WaitingForMe" ? null : (
                                                                  <>
                                                                    <CustomBadge
                                                                      color="warning"
                                                                      text={t(
                                                                        "Audit Log"
                                                                      )}
                                                                      onClick={async () => {
                                                                        await getActivityLog(
                                                                          item.file_id
                                                                        );
                                                                      }}
                                                                    />
                                                                  </>
                                                                )}
                                                              </div>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                        {/* <tr>
                                                          <td
                                                            onClick={async () => {
                                                              if (StatusData === 'WaitingForMe') {
                                                                const items = JSON.parse(
                                                                );
                                                                //console.log(items.token.email);
                                                                const FILEID = item.file_id;
                                                                const EMAILD = items.token.email;
                                                                const postData = {
                                                                  file_id: FILEID,
                                                                  email: EMAILD,
                                                                };
                                                                try {
                                                                  const apiData = await post(
                                                                    'file/waitingForMeDocLink',
                                                                    postData,
                                                                  ); // Specify the endpoint you want to call
                                                                  //console.log('Recipients');
                                                                  //console.log(apiData);
                                                                  window.location.href = apiData.data;
                                                                } catch (error) {
                                                                  //console.log('Error fetching data:', error);
                                                                }
                                                              } else {
                                                                if (
                                                                  item.status === 'WaitingForOthers' ||
                                                                  item.status === 'Completed'
                                                                ) {
                                                                  window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                                } else {
                                                                  window.location.href = `/esign-setup/${item.file_id}`;
                                                                }
                                                              }
                                                            }}>
                                                            <span style={{display: 'flex', alignItems: 'center'}}>
                                                              <img
                                                                src={pdfIcon}
                                                                alt="pdf icon"
                                                                style={{width: '25px', height: 'auto'}}
                                                              />
                                                              <h4 style={{marginLeft: '20px'}}>{item.name}</h4>
                                                            </span>
                                                          </td>
                                                         
                                                          {StatusData === 'WaitingForMe' ? null : (
                                                            <td>
                                                              <h3>
                                                                {formatDateCustomTimelastActivity(item.last_change)}
                                                              </h3>

                                                            </td>
                                                          )}
                                                          <td>
                                                            <div className="d-flex justify-content-between">
                                                              <div>
                                                                <Eye
                                                                  size={sizeP_icon}
                                                                  id="viewing"
                                                                  style={{cursor: 'pointer'}}
                                                                  onClick={async () => {
                                                                    if (StatusData === 'WaitingForMe') {
                                                                      const items = JSON.parse(
                                                                      );
                                                                      //console.log(items.token.email);
                                                                      const FILEID = item.file_id;
                                                                      const EMAILD = items.token.email;
                                                                      const postData = {
                                                                        file_id: FILEID,
                                                                        email: EMAILD,
                                                                      };
                                                                      try {
                                                                        const apiData = await post(
                                                                          'file/waitingForMeDocLink',
                                                                          postData,
                                                                        ); // Specify the endpoint you want to call
                                                                        //console.log('Recipients');
                                                                        //console.log(apiData);
                                                                        window.location.href = apiData.data;
                                                                      } catch (error) {
                                                                        //console.log('Error fetching data:', error);
                                                                      }
                                                                    } else {
                                                                      if (
                                                                        item.status === 'WaitingForOthers' ||
                                                                        item.status === 'Completed'
                                                                      ) {
                                                                        window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                                      } else {
                                                                        window.location.href = `/esign-setup/${item.file_id}`;
                                                                      }
                                                                    }
                                                                  }}
                                                                />
                                                                {StatusData === 'WaitingForMe' ||
                                                                item.status === 'WaitingForOthers' ||
                                                                item.status === 'Completed' ? (
                                                                  <></>
                                                                ) : (
                                                                  <>
                                                                    {' '}
                                                                    <Edit2
                                                                      onClick={() => {
                                                                        window.location.href = `/esign-setup/${item.file_id}`;
                                                                      }}
                                                                      id="editing"
                                                                      size={sizeP_icon}
                                                                      style={{cursor: 'pointer', marginLeft: '10px'}}
                                                                    />
                                                                    <Archive
                                                                      onClick={() => {
                                                                        setDeleteFolderId(item.file_id);
                                                                        setFolderName(item.name);
                                                                        setItemArchieveConfirmationFile(true);
                                                                      }}
                                                                      id="archieving"
                                                                      size={sizeP_icon}
                                                                      style={{
                                                                        cursor: 'pointer',
                                                                        marginLeft: '10px',
                                                                        color: '#CC99FF',
                                                                      }}
                                                                    />
                                                                    <Trash2
                                                                      id="deleting"
                                                                      size={sizeP_icon}
                                                                      style={{
                                                                        cursor: 'pointer',
                                                                        marginLeft: '10px',
                                                                        color: 'red',
                                                                      }}
                                                                      onClick={() => {
                                                                        setDeleteFolderId(item.file_id);
                                                                        setFolderName(item.name);
                                                                        setItemDeleteConfirmationFile(true);
                                                                      }}
                                                                    />
                                                                    <UncontrolledTooltip
                                                                      placement="bottom"
                                                                      target="editing">
                                                                      Edit
                                                                    </UncontrolledTooltip>
                                                                    <UncontrolledTooltip
                                                                      placement="bottom"
                                                                      target="archieving">
                                                                     {t("Archive")}
                                                                    </UncontrolledTooltip>
                                                                    <UncontrolledTooltip
                                                                      placement="bottom"
                                                                      target="deleting">
                                                                     {t("Delete")}
                                                                    </UncontrolledTooltip>
                                                                  </>
                                                                )}
                                                                <UncontrolledTooltip
                                                                  placement="bottom"
                                                                  target="viewing">
                                                                 {t("View")}
                                                                </UncontrolledTooltip>
                                                                {StatusData === 'WaitingForMe' ? null : (
                                                                  <>
                                                                    <AtSign
                                                                      size={sizeP_icon}
                                                                      id={`log_${item.file_id}`}
                                                                      style={{
                                                                        cursor: 'pointer',
                                                                        marginLeft: '10px',
                                                                        color: '#FFCC99',
                                                                      }}
                                                                      onClick={async () => {
                                                                        await getActivityLog(item.file_id);
                                                                      }}
                                                                    />{' '}
                                                                    <UncontrolledTooltip
                                                                      placement="bottom"
                                                                      target={`log_${item.file_id}`}>
                                                                      Audit Log
                                                                    </UncontrolledTooltip>
                                                                  </>
                                                                )}
                                                              </div>
                                                            </div>
                                                          </td>
                                                        </tr> */}
                                                      </>
                                                    ) : null}
                                                  </>
                                                )
                                              )}
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {searchQuery.length === 0 ? (
                                            <>
                                              {currentItems.map(
                                                (item, index) => (
                                                  <>
                                                    {item.folder_id === null ||
                                                    item.folder_id ===
                                                      undefined ? (
                                                      <tr>
                                                        <td
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={async () => {
                                                            if (
                                                              StatusData ===
                                                              "WaitingForMe"
                                                            ) {
                                                              //console.log(items.token.email);
                                                              const FILEID =
                                                                item.file_id;
                                                              const EMAILD =
                                                                user?.email;
                                                              const postData = {
                                                                file_id: FILEID,
                                                                email: EMAILD,
                                                                waiting_for_others_doc,
                                                              };
                                                              try {
                                                                const apiData =
                                                                  await post(
                                                                    "file/waitingForMeDocLink",
                                                                    postData
                                                                  ); // Specify the endpoint you want to call
                                                                //console.log('Recipients');
                                                                //console.log(apiData);
                                                                window.location.href =
                                                                  apiData.data;
                                                              } catch (error) {
                                                                //console.log('Error fetching data:', error);
                                                              }
                                                            } else if (
                                                              item.status ===
                                                              "WaitingForOthers"
                                                              //  ||item.status === 'Completed'
                                                            ) {
                                                              window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                            } else if (
                                                              item.status ===
                                                              "Completed"
                                                            ) {
                                                              window.location.href = `/completed/file/${item.file_id}`;
                                                            } else {
                                                              window.location.href = `/esign-setup/${item.file_id}`;
                                                            }
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              display: "flex",
                                                            }}
                                                          >
                                                            <img
                                                              src={pdfIcon}
                                                              alt="pdf icon"
                                                              style={{
                                                                width:
                                                                  pdfIcon_width,
                                                                height: "auto",
                                                              }}
                                                            />
                                                            <h3
                                                              style={{
                                                                marginLeft:
                                                                  "20px",
                                                              }}
                                                            >
                                                              {" "}
                                                              {highlightText(
                                                                `${item.name}`,
                                                                searchQuery
                                                              )}
                                                            </h3>
                                                          </span>
                                                        </td>

                                                        <td>
                                                          {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
                                                          <h3>
                                                            {formatDateCustomTimelastActivity(
                                                              item.last_change
                                                            )}
                                                          </h3>

                                                          {/* </div> */}
                                                        </td>
                                                        <td>
                                                          <div>
                                                            <div className="d-flex">
                                                              <CustomBadge
                                                                color="primary"
                                                                text={t("Move")}
                                                                onClick={() => {
                                                                  setFolderName(
                                                                    item.name
                                                                  );
                                                                  setFileToMove(
                                                                    item.file_id
                                                                  );
                                                                  setModalMove(
                                                                    true
                                                                  );
                                                                }}
                                                              />

                                                              <CustomBadge
                                                                color="info"
                                                                text={t("View")}
                                                                onClick={async () => {
                                                                  if (
                                                                    StatusData ===
                                                                    "WaitingForMe"
                                                                  ) {
                                                                    //console.log(items.token.email);
                                                                    const FILEID =
                                                                      item.file_id;
                                                                    const EMAILD =
                                                                      user?.email;
                                                                    const postData =
                                                                      {
                                                                        file_id:
                                                                          FILEID,
                                                                        email:
                                                                          EMAILD,
                                                                      };
                                                                    try {
                                                                      const apiData =
                                                                        await post(
                                                                          "file/waitingForMeDocLink",
                                                                          postData
                                                                        ); // Specify the endpoint you want to call
                                                                      //console.log('Recipients');
                                                                      //console.log(apiData);
                                                                      window.location.href =
                                                                        apiData.data;
                                                                    } catch (error) {
                                                                      //console.log('Error fetching data:', error);
                                                                    }
                                                                  } else if (
                                                                    item.status ===
                                                                    "WaitingForOthers"
                                                                    //  ||item.status === 'Completed'
                                                                  ) {
                                                                    window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                                  } else if (
                                                                    item.status ===
                                                                    "Completed"
                                                                  ) {
                                                                    window.location.href = `/completed/file/${item.file_id}`;
                                                                  } else {
                                                                    window.location.href = `/esign-setup/${item.file_id}`;
                                                                  }
                                                                }}
                                                              />

                                                              {StatusData ===
                                                                "WaitingForMe" ||
                                                              item.status ===
                                                                "WaitingForOthers" ||
                                                              item.status ===
                                                                "Completed" ? (
                                                                <></>
                                                              ) : (
                                                                <>
                                                                  {/* Icons for edit delete with tooltip  */}
                                                                  <CustomBadge
                                                                    color="success"
                                                                    text={t(
                                                                      "Edit"
                                                                    )}
                                                                    onClick={() => {
                                                                      window.location.href = `/esign-setup/${item.file_id}`;
                                                                    }}
                                                                  />

                                                                  {/* <Edit2
                                                                      onClick={() => {
                                                                        window.location.href = `/esign-setup/${item.file_id}`;
                                                                      }}
                                                                      id={`editing-${item.file_id}`}
                                                                      size={sizeP_icon}
                                                                      style={{cursor: 'pointer', marginLeft: '10px'}}
                                                                    /> */}
                                                                  <CustomBadge
                                                                    color="secondary"
                                                                    text={t(
                                                                      "Archive"
                                                                    )}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.file_id
                                                                      );
                                                                      setFolderName(
                                                                        item.name
                                                                      );
                                                                      setItemArchieveConfirmationFile(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <CustomBadge
                                                                    color="danger"
                                                                    text={t(
                                                                      "Trash"
                                                                    )}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.file_id
                                                                      );
                                                                      setFolderName(
                                                                        item.name
                                                                      );
                                                                      setItemDeleteConfirmationFile(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              )}

                                                              {StatusData ===
                                                              "WaitingForMe" ? null : (
                                                                <>
                                                                  <CustomBadge
                                                                    color="warning"
                                                                    text={t(
                                                                      "Audit Log"
                                                                    )}
                                                                    onClick={async () => {
                                                                      await getActivityLog(
                                                                        item.file_id
                                                                      );
                                                                    }}
                                                                  />
                                                                  <CustomBadge
                                                                    color="primary"
                                                                    text={t(
                                                                      "Download"
                                                                    )}
                                                                    onClick={async () => {
                                                                      // console.log(item)
                                                                      let downloadUrl =
                                                                      item
                                                                      ?.bgimgs[0]
                                                                      ?.inprocess_doc||item
                                                                      ?.bgimgs[0]
                                                                      ?.image;
                                                                      await handleDownloadPDFApp(
                                                                        downloadUrl,
                                                                        item?.name
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    ) : (
                                                      <tr>
                                                        <td
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={() => {
                                                            if (
                                                              subFolderId ===
                                                                null ||
                                                              subFolderId ===
                                                                undefined ||
                                                              subFolderId ===
                                                                "null" ||
                                                              subFolderId ===
                                                                "undefined"
                                                            ) {
                                                              window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                            } else {
                                                              // Get the existing IDs from localStorage
                                                              let ids =
                                                                JSON.parse(
                                                                  localStorage.getItem(
                                                                    "ids"
                                                                  )
                                                                ) || [];

                                                              // Add the new ID
                                                              ids.push(prevId);

                                                              // Save the updated array back to localStorage
                                                              localStorage.setItem(
                                                                "ids",
                                                                JSON.stringify(
                                                                  ids
                                                                )
                                                              );
                                                              window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                            }
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              display: "flex",
                                                            }}
                                                          >
                                                            <Folder
                                                              style={{
                                                                color: `${item.color}`,
                                                              }}
                                                              size={25}
                                                            />
                                                            <h2
                                                              style={{
                                                                marginLeft:
                                                                  "20px",
                                                              }}
                                                            >
                                                              {item.folder_name}
                                                            </h2>
                                                          </span>
                                                        </td>
                                                        {/* <td>--</td> */}
                                                        <td>
                                                          {/* <div -style={{ display: 'flex', justifyContent: 'center' }}> */}
                                                          <h3>
                                                            --
                                                            {/* {formatDateCustomTimelastActivity(item.created_at)}hgghgh */}
                                                          </h3>

                                                          {/* </div> */}
                                                        </td>
                                                        <td>
                                                          <div>
                                                            <div className="d-flex ">
                                                              <CustomBadge
                                                                color="info"
                                                                text={t("View")}
                                                                onClick={() => {
                                                                  if (
                                                                    subFolderId ===
                                                                      null ||
                                                                    subFolderId ===
                                                                      undefined ||
                                                                    subFolderId ===
                                                                      "null" ||
                                                                    subFolderId ===
                                                                      "undefined"
                                                                  ) {
                                                                    window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                                  } else {
                                                                    // Get the existing IDs from localStorage
                                                                    let ids =
                                                                      JSON.parse(
                                                                        localStorage.getItem(
                                                                          "ids"
                                                                        )
                                                                      ) || [];

                                                                    // Add the new ID
                                                                    ids.push(
                                                                      prevId
                                                                    );

                                                                    // Save the updated array back to localStorage
                                                                    localStorage.setItem(
                                                                      "ids",
                                                                      JSON.stringify(
                                                                        ids
                                                                      )
                                                                    );
                                                                    window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                                  }
                                                                }}
                                                              />

                                                              {/* Icons for edit delete with tooltip  */}
                                                              {StatusData ===
                                                                "WaitingForMe" ||
                                                              item.status ===
                                                                "WaitingForOthers" ||
                                                              item.status ===
                                                                "Completed" ? (
                                                                <></>
                                                              ) : (
                                                                <>
                                                                  <CustomBadge
                                                                    color="success"
                                                                    text={t(
                                                                      "Edit"
                                                                    )}
                                                                    onClick={() => {
                                                                      //console.log(item.folder_name);
                                                                      //console.log(item.folder_id);
                                                                      setFolderNameUpdate(
                                                                        item.folder_name
                                                                      );
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setModalUpdate(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <CustomBadge
                                                                    color="secondary"
                                                                    text={t(
                                                                      "Archive"
                                                                    )}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setFolderName(
                                                                        item.folder_name
                                                                      );
                                                                      setItemArchieveConfirmation(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />

                                                                  <CustomBadge
                                                                    color="danger"
                                                                    text={t(
                                                                      "Trash"
                                                                    )}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setFolderName(
                                                                        item.folder_name
                                                                      );
                                                                      setItemDeleteConfirmation(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    )}
                                                  </>
                                                )
                                              )}{" "}
                                            </>
                                          ) : (
                                            <>
                                              {filteredItems.map(
                                                (item, index) => (
                                                  <>
                                                    {item.folder_id === null ||
                                                    item.folder_id ===
                                                      undefined ? (
                                                      <tr>
                                                        <td
                                                          onClick={async () => {
                                                            if (
                                                              StatusData ===
                                                              "WaitingForMe"
                                                            ) {
                                                              //console.log(items.token.email);
                                                              const FILEID =
                                                                item.file_id;
                                                              const EMAILD =
                                                                user?.email;
                                                              const postData = {
                                                                file_id: FILEID,
                                                                email: EMAILD,
                                                              };
                                                              try {
                                                                const apiData =
                                                                  await post(
                                                                    "file/waitingForMeDocLink",
                                                                    postData
                                                                  ); // Specify the endpoint you want to call
                                                                //console.log('Recipients');
                                                                //console.log(apiData);
                                                                window.location.href =
                                                                  apiData.data;
                                                              } catch (error) {
                                                                //console.log('Error fetching data:', error);
                                                              }
                                                            } else if (
                                                              item.status ===
                                                              "WaitingForOthers"
                                                              //  ||item.status === 'Completed'
                                                            ) {
                                                              window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                            } else if (
                                                              item.status ===
                                                              "Completed"
                                                            ) {
                                                              window.location.href = `/completed/file/${item.file_id}`;
                                                            } else {
                                                              window.location.href = `/esign-setup/${item.file_id}`;
                                                            }
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              display: "flex",
                                                              justifyContent:
                                                                "left",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <img
                                                              src={pdfIcon}
                                                              alt="pdf icon"
                                                              style={{
                                                                width:
                                                                  pdfIcon_width,
                                                                height: "auto",
                                                              }}
                                                            />
                                                            <h2
                                                              style={{
                                                                marginLeft:
                                                                  "20px",
                                                              }}
                                                            >
                                                              {" "}
                                                              {highlightText(
                                                                `${item.name}`,
                                                                searchQuery
                                                              )}
                                                            </h2>
                                                            <span>
                                                              {item.status ===
                                                              "InProgress" ? (
                                                                <Badge color="info">
                                                                  <Clock
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "In Progress"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {item.status ===
                                                              "WaitingForOthers" ? (
                                                                <Badge color="warning">
                                                                  <Users
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Waiting For Others"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {item.status ===
                                                              "WaitingForMe" ? (
                                                                <Badge color="danger">
                                                                  <User
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Waiting For Me"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}
                                                              {window.innerWidth <
                                                                730 ? null : (
                                                                  <> {item.status ===
                                                              "Completed" ? (
                                                                <Badge color="success">
                                                                  <CheckCircle
                                                                    size={12}
                                                                    className="align-middle me-25"
                                                                  />
                                                                  <span
                                                                    className="align-middle"
                                                                    style={{
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    {t(
                                                                      "Completed"
                                                                    )}
                                                                  </span>
                                                                </Badge>
                                                              ) : null}</>)}
                                                            </span>
                                                          </span>
                                                        </td>

                                                        <td>
                                                          {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
                                                          <h3>
                                                            {formatDateCustomTimelastActivity(
                                                              item.last_change
                                                            )}
                                                          </h3>

                                                          {/* </div> */}
                                                        </td>
                                                        <td>
                                                          <div>
                                                            <div className="d-flex">
                                                              <CustomBadge
                                                                color="primary"
                                                                text={t("Move")}
                                                                onClick={() => {
                                                                  setFolderName(
                                                                    item.name
                                                                  );
                                                                  setFileToMove(
                                                                    item.file_id
                                                                  );
                                                                  setModalMove(
                                                                    true
                                                                  );
                                                                }}
                                                              />

                                                              <CustomBadge
                                                                color="info"
                                                                text={t("View")}
                                                                onClick={async () => {
                                                                  if (
                                                                    StatusData ===
                                                                    "WaitingForMe"
                                                                  ) {
                                                                    //console.log(items.token.email);
                                                                    const FILEID =
                                                                      item.file_id;
                                                                    const EMAILD =
                                                                      user?.email;
                                                                    const postData =
                                                                      {
                                                                        file_id:
                                                                          FILEID,
                                                                        email:
                                                                          EMAILD,
                                                                      };
                                                                    try {
                                                                      const apiData =
                                                                        await post(
                                                                          "file/waitingForMeDocLink",
                                                                          postData
                                                                        ); // Specify the endpoint you want to call
                                                                      //console.log('Recipients');
                                                                      //console.log(apiData);
                                                                      window.location.href =
                                                                        apiData.data;
                                                                    } catch (error) {
                                                                      //console.log('Error fetching data:', error);
                                                                    }
                                                                  } else if (
                                                                    item.status ===
                                                                    "WaitingForOthers"
                                                                    //  ||item.status === 'Completed'
                                                                  ) {
                                                                    window.location.href = `/waiting_for_others_doc/file/${item.file_id}`;
                                                                  } else if (
                                                                    item.status ===
                                                                    "Completed"
                                                                  ) {
                                                                    window.location.href = `/completed/file/${item.file_id}`;
                                                                  } else {
                                                                    window.location.href = `/esign-setup/${item.file_id}`;
                                                                  }
                                                                }}
                                                              />

                                                              {StatusData ===
                                                                "WaitingForMe" ||
                                                              item.status ===
                                                                "WaitingForOthers" ||
                                                              item.status ===
                                                                "Completed" ? (
                                                                <></>
                                                              ) : (
                                                                <>
                                                                  {/* Icons for edit delete with tooltip  */}
                                                                  <CustomBadge
                                                                    color="success"
                                                                    text={t(
                                                                      "Edit"
                                                                    )}
                                                                    onClick={() => {
                                                                      window.location.href = `/esign-setup/${item.file_id}`;
                                                                    }}
                                                                  />

                                                                  {/* <Edit2
                                                                      onClick={() => {
                                                                        window.location.href = `/esign-setup/${item.file_id}`;
                                                                      }}
                                                                      id={`editing-${item.file_id}`}
                                                                      size={sizeP_icon}
                                                                      style={{cursor: 'pointer', marginLeft: '10px'}}
                                                                    /> */}
                                                                  <CustomBadge
                                                                    color="secondary"
                                                                    text={t(
                                                                      "Archive"
                                                                    )}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.file_id
                                                                      );
                                                                      setFolderName(
                                                                        item.name
                                                                      );
                                                                      setItemArchieveConfirmationFile(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <CustomBadge
                                                                    color="danger"
                                                                    text={t(
                                                                      "Trash"
                                                                    )}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.file_id
                                                                      );
                                                                      setFolderName(
                                                                        item.name
                                                                      );
                                                                      setItemDeleteConfirmationFile(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              )}

                                                              {StatusData ===
                                                              "WaitingForMe" ? null : (
                                                                <>
                                                                  <CustomBadge
                                                                    color="warning"
                                                                    text={t(
                                                                      "Audit Log"
                                                                    )}
                                                                    onClick={async () => {
                                                                      await getActivityLog(
                                                                        item.file_id
                                                                      );
                                                                    }}
                                                                  />
                                                                  <CustomBadge
                                                                    color="primary"
                                                                    text={t(
                                                                      "Download"
                                                                    )}
                                                                    onClick={async () => {
                                                                      // console.log(item)
                                                                      let downloadUrl =
                                                                      item
                                                                      ?.bgimgs[0]
                                                                      ?.inprocess_doc||item
                                                                      ?.bgimgs[0]
                                                                      ?.image;
                                                                      await handleDownloadPDFApp(
                                                                        downloadUrl,
                                                                        item?.name
                                                                      );
                                                                    }}
                                                                  />
                                                                </>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    ) : (
                                                      <tr>
                                                        <td>
                                                          <span
                                                            style={{
                                                              display: "flex",
                                                            }}
                                                          >
                                                            <Folder
                                                              style={{
                                                                color: `${item.color}`,
                                                              }}
                                                              size={25}
                                                            />
                                                            <h2
                                                              style={{
                                                                marginLeft:
                                                                  "20px",
                                                              }}
                                                            >
                                                              {item.folder_name}
                                                            </h2>
                                                          </span>
                                                        </td>
                                                        <td>-</td>
                                                        <td>
                                                          {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
                                                          <h3>
                                                            {formatDateCustomTimelastActivity(
                                                              item.last_change
                                                            )}
                                                          </h3>

                                                          {/* </div> */}
                                                        </td>
                                                        <td>
                                                          <div className="d-flex justify-content-between">
                                                            <div>
                                                              {/* view  */}

                                                              <Eye
                                                                size={
                                                                  sizeP_icon
                                                                }
                                                                id={`view-${item.folder_id}`}
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={() => {
                                                                  if (
                                                                    subFolderId ===
                                                                      null ||
                                                                    subFolderId ===
                                                                      undefined ||
                                                                    subFolderId ===
                                                                      "null" ||
                                                                    subFolderId ===
                                                                      "undefined"
                                                                  ) {
                                                                    window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                                  } else {
                                                                    // Get the existing IDs from localStorage
                                                                    let ids =
                                                                      JSON.parse(
                                                                        localStorage.getItem(
                                                                          "ids"
                                                                        )
                                                                      ) || [];

                                                                    // Add the new ID
                                                                    ids.push(
                                                                      prevId
                                                                    );

                                                                    // Save the updated array back to localStorage
                                                                    localStorage.setItem(
                                                                      "ids",
                                                                      JSON.stringify(
                                                                        ids
                                                                      )
                                                                    );
                                                                    window.location.href = `/home/${item.uniq_id}/${subFolderId}`;
                                                                  }
                                                                }}
                                                              />
                                                              {/* Icons for edit delete with tooltip  */}
                                                              {StatusData ===
                                                                "WaitingForMe" ||
                                                              item.status ===
                                                                "WaitingForOthers" ||
                                                              item.status ===
                                                                "Completed" ? (
                                                                <></>
                                                              ) : (
                                                                <>
                                                                  <Edit2
                                                                    onClick={() => {
                                                                      //console.log(item.folder_name);
                                                                      //console.log(item.folder_id);
                                                                      setFolderNameUpdate(
                                                                        item.folder_name
                                                                      );
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setModalUpdate(
                                                                        true
                                                                      );
                                                                    }}
                                                                    id={`edit-${item.folder_id}`}
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                    }}
                                                                  />

                                                                  <Archive
                                                                    id={`archieve-${item.folder_id}`}
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                      color:
                                                                        "#CC99FF",
                                                                    }}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setFolderName(
                                                                        item.folder_name
                                                                      );
                                                                      setItemArchieveConfirmation(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <Trash2
                                                                    id={`delete-${item.folder_id}`}
                                                                    size={
                                                                      sizeP_icon
                                                                    }
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      marginLeft:
                                                                        "10px",
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                    onClick={() => {
                                                                      setDeleteFolderId(
                                                                        item.folder_id
                                                                      );
                                                                      setFolderName(
                                                                        item.folder_name
                                                                      );
                                                                      setItemDeleteConfirmation(
                                                                        true
                                                                      );
                                                                    }}
                                                                  />
                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target={`edit-${item.folder_id}`}
                                                                  >
                                                                    {t(
                                                                      "Rename"
                                                                    )}
                                                                  </UncontrolledTooltip>

                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target={`delete-${item.folder_id}`}
                                                                  >
                                                                    {t(
                                                                      "Delete"
                                                                    )}
                                                                  </UncontrolledTooltip>
                                                                  <UncontrolledTooltip
                                                                    placement="bottom"
                                                                    target={`archieve-${item.folder_id}`}
                                                                  >
                                                                    {t(
                                                                      "Archive"
                                                                    )}
                                                                  </UncontrolledTooltip>
                                                                </>
                                                              )}
                                                              <UncontrolledTooltip
                                                                placement="bottom"
                                                                target={`view-${item.folder_id}`}
                                                              >
                                                                {t("View")}
                                                              </UncontrolledTooltip>
                                                            </div>
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    )}
                                                  </>
                                                )
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </tbody>
                                  </Table>
                                </div>
                                {/* </Card> */}
                                {/* </Table> */}
                                {currentItems.length === 0 ? null : (
                                  <div
                                    style={{
                                      display: "flex",
                                      padding: "5px",
                                      justifyContent: "right",
                                      alignItems: "center",
                                    }}
                                  >
                                    {searchQuery.length === 0 ? (
                                      <>
                                        <PaginationComponent
                                          currentPage={currentPage}
                                          itemsPerPage={itemsPerPage}
                                          totalItems={allItems?.length}
                                          handlePageChange={handlePageChange}
                                          handlePageChangeNo={
                                            handlePageChangeNo
                                          }
                                        />
                                      </>
                                    ) : null}
                                  </div>
                                )}
                              </Col>
                            </>
                          )}
                        </>
                      )}
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </Row>
            {/* Modal  Add Folder  */}

            <Modal
              isOpen={modal}
              toggle={() => {
                setErrorRequired(false);
                setFolderName("");
                setModal(false);
              }}
              className="modal-dialog-centered"
              modalClassName="info"
              key="success"
            >
              <ModalBody>
                <div
                  style={{
                    display: " flex",
                    justifyContent: "space-between",
                    marginBottom: "2%",
                  }}
                >
                  <h1 className="fw-bold">{t("Add Folder")}</h1>
                  <X
                    size={24}
                    onClick={() => {
                      setErrorRequired(false);
                      setFolderName("");
                      setModal(false);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <h3
                  style={{ fontSize: "16px" }}
                  className="form-label"
                  for="register-firstname"
                >
                  {t("Folder Name")}
                </h3>
                <Input
                  style={{
                    height: "40px",
                    boxShadow: "none",
                    fontSize: "16px",
                  }}
                  className={`form-control`}
                  type="text"
                  id="register-firstname"
                  value={folderName}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setErrorRequired(true);
                    } else {
                      setErrorRequired(false);
                    }
                    setFolderName(e.target.value);
                  }}
                  // placeholder="John"
                  autoFocus
                />
                {errorRequired ? (
                  <div style={{ color: "red", fontSize: "12px", margin: "1%" }}>
                    Name is required
                  </div>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  {colors.map((color) => (
                    <>
                      <div
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "20px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border:
                            color === selectedColor
                              ? "2px solid black"
                              : "none",
                          cursor: "pointer",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {color === selectedColor && (
                          <Check size={15} style={{ color: "white" }} />
                        )}{" "}
                        {/* Add this to show the check icon */}
                      </div>
                    </>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    marginBottom: "1%",
                  }}
                >
                  <CustomButton
                    padding={true}
                    color="primary"
                    size="sm"
                    style={{
                      boxShadow: "none",
                      marginBlock: "1%",
                      display: "flex",
                    }}
                    disabled={addFolderLoader}
                    onClick={() => addFolder()}
                    text={
                      <>
                        {addFolderLoader ? (
                          <Spinner color="light" size="sm" />
                        ) : //  <Spinner color="light" size="sm" />
                        null}
                        <span
                          style={{ fontSize: "16px" }}
                          className="align-middle ms-25"
                        >
                          {t("Save")}
                        </span>
                      </>
                    }
                  />
                </div>
              </ModalBody>
            </Modal>
            {/* Modal  Move File to folder  */}

            <Modal
              isOpen={modalMove}
              toggle={() => {
                // setErrorRequired(false)
                // setFolderName('')
                setModalMove(false);
              }}
              className="modal-dialog-centered modal-lg"
              modalClassName="info"
              key="success1"
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
                    padding: "2%",
                    borderBottom: "1px solid lightGrey",
                  }}
                >
                  <h1 className="fw-bold">{folderName}</h1>
                  <X
                    size={24}
                    onClick={() => {
                      // setErrorRequired(false)
                      setFolderName("");
                      setModalMove(false);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div style={{ padding: "2%", overflowY: "auto" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBlock: "10px",
                      borderBottom: "1px solid #e6e4e4",
                    }}
                  >
                    <h3> {t("Folder Name")}</h3>
                    <h3>{t("Location")}</h3>
                    <h3>{t("Action")}</h3>
                  </div>
                  {foldersArrayMove.length === 0 ? (
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
                              width: "100px",
                              height: "auto",
                            }}
                          />
                          <Label
                            className="form-label"
                            style={{ fontSize: "14px" }}
                          >
                            {t("No Folder or File Exist")}
                          </Label>
                        </Col>
                      </Row>{" "}
                    </>
                  ) : (
                    <>
                      {foldersArrayMove.map((folder) => (
                        <div
                          key={folder.id}
                          style={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            paddingBlock: "10px",
                            borderBottom: "1px solid #e6e4e4",
                          }}
                        >
                          <Folder
                            size={25}
                            style={{
                              marginRight: "10px",
                              color: `${folder.color}`,
                            }}
                          />
                          <h2 style={{ flexGrow: 1, marginTop: "10px" }}>
                            {folder.folder_name}
                          </h2>
                          {folder.location === "" ? null : (
                            <span
                              style={{
                                flexGrow: 1,
                                fontSize: "16px",
                                fontWeight: 600,
                              }}
                            >
                              /{folder.location}
                            </span>
                          )}

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <h3
                              onClick={async () => {
                                //console.log('uniq_id');

                                //console.log(folder.uniq_id);
                                const postData = {
                                  file_id: FileToMove,
                                  subfolder: true,
                                  subfolder_id: folder.uniq_id,
                                };
                                try {
                                  const apiData = await post(
                                    "file/update-file",
                                    postData
                                  );
                                  //console.log(apiData);
                                  if (
                                    apiData.error === true ||
                                    apiData.error === "true"
                                  ) {
                                    toastAlert(
                                      "error",
                                      "Can't Move Right now!"
                                    );
                                  } else {
                                    toastAlert(
                                      "success",
                                      "File Moved Successfully!"
                                    );
                                    setFolderName("");
                                    setModalMove(false);
                                    fetchAllFolder();
                                    fetchAllFiles(StatusData);
                                    fetchAllFoldersForModalMove();
                                  }
                                } catch (error) {
                                  //console.log('Error fetching data:', error);
                                  toastAlert("error", "Can't Move Right now!");
                                }
                              }}
                              style={{
                                marginTop: "10px",
                                fontWeight: 600,
                                fontSize: "16px",
                                cursor: "pointer",
                              }}
                            >
                              {t("Move")}
                            </h3>
                            {/* <MoveIcon size={24} style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => handleMove(folder.id)} /> */}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </ModalBody>
            </Modal>

            {/* Modal delete  */}

            <ModalConfirmationAlert
              isOpen={itemDeleteConfirmation}
              toggleFunc={() =>
                setItemDeleteConfirmation(!itemDeleteConfirmation)
              }
              loader={loadingDelete}
              callBackFunc={DeleteFolder}
              alertStatusDelete={"delete"}
              text={t(
                "By click delete, your Folder will go to Trash. Are you sure?"
              )}
            />
            {/* Archieve folder  */}

            <ModalConfirmationAlert
              isOpen={itemArchieveConfirmation}
              toggleFunc={() =>
                setItemArchieveConfirmation(!itemArchieveConfirmation)
              }
              loader={loadingDelete}
              callBackFunc={ArchieveFolder}
              text={t("Are you sure you want to archive this Folder?")}
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
            {/* Modal Archieve File  */}

            <ModalConfirmationAlert
              isOpen={itemArchieveConfirmationFile}
              toggleFunc={() => {
                setItemArchieveConfirmationFile(!itemArchieveConfirmationFile);
              }}
              loader={loadingDeleteFile}
              callBackFunc={ArchieveFile}
              text={t("Are you sure you want to archive this File?")}
            />
            {/* Modal Update Folder  */}

            <Modal
              isOpen={modalUpdate}
              toggle={() => {
                setErrorRequiredUpdate(false);
                setFolderNameUpdate("");
                setModalUpdate(false);
              }}
              className="modal-dialog-centered"
              modalClassName="info"
              key="update"
            >
              <ModalBody>
                <div
                  style={{
                    display: " flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h1 className="fw-bold"> {t("Rename Folder")} </h1>
                  <X
                    size={24}
                    onClick={() => {
                      setErrorRequiredUpdate(false);
                      setFolderNameUpdate("");

                      setModalUpdate(false);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <Label
                  style={{ fontSize: "16px" }}
                  className="form-label"
                  for="update-firstname"
                >
                  {t("Folder Name")}
                </Label>
                <Input
                  style={{
                    height: "40px",
                    fontSize: "16px",
                    boxShadow: "none",
                  }}
                  className={`form-control`}
                  type="text"
                  id="update-firstname"
                  value={folderNameUpdate}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setErrorRequiredUpdate(true);
                    } else {
                      setErrorRequiredUpdate(false);
                    }
                    setFolderNameUpdate(e.target.value);
                  }}
                  // placeholder="John"
                  autoFocus
                />
                {errorRequiredUpdate ? (
                  <div style={{ color: "red", fontSize: "12px", margin: "1%" }}>
                    Name is required
                  </div>
                ) : null}
                <div
                  style={{
                    marginTop: "3%",
                    display: "flex",
                    justifyContent: "right",
                  }}
                >
                  <Button
                    size="sm"
                    color="primary"
                    style={{
                      boxShadow: "none",
                      display: "flex",
                      marginBottom: "2%",
                    }}
                    disabled={addFolderLoaderUpdate}
                    onClick={() => updateFolder()}
                  >
                    {addFolderLoaderUpdate ? (
                      <SpinnerCustom color="light" size="sm" />
                    ) : // <Spinner color="light" size="sm" />
                    null}
                    <span
                      style={{ fontSize: "16px" }}
                      className="align-middle ms-25"
                    >
                      {t("Update")}
                    </span>
                  </Button>
                </div>
              </ModalBody>
            </Modal>

            <ActivityLogModal
              showLog={showLog}
              setShowLog={setShowLog}
              fileName={fileNameOpened}
              activityLogData={ActivityLogData}
              loaderData={loaderData}
            />

            {/* <ModalConfirmationProfile
                isOpen={completeProfileD}
                toggleFunc={() => {
                  setCompleteProfileD(!completeProfileD);
                }}
                profileGet={() => {
                  window.location.href();
                  checkProfileCompleted();
                }}
              />
              <ModalConfirmationCompanyProfile
                companyData={companyData}
                companyId={companyId}
                isOpen={completeProfileComp}
                toggleFunc={() => {
                  setCompleteProfileComp(!completeProfileComp);
                }}
                profileGet={() => {
                  checkProfileCompleted();
                }}
              /> */}
            {/* <ModalConfirmationPlan
                isOpen={completeProfile}
                toggleFunc={() => {
                  setCompleteProfile(!completeProfile);
                }}
              /> */}
            <ModalUpgradePremium
              isOpen={modalUpgradePremium}
              toggleFunc={() => {
                setModalUpgradePremium(!modalUpgradePremium);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { getUser, logout } from '../redux/navbar'; // Adjust the import path if needed
// import { decrypt } from '../utility/auth-token';

// const Home = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Access the correct part of the state from the navbar slice
//   const { user, loading, error } = useSelector((state) => state.navbar);

//   useEffect(() => {
//     const encryptedData = localStorage.getItem('user_data')
//     console.log("encryptedData")

//     console.log(encryptedData)
//     if (encryptedData) {
//       try {
//         const decryptedData = JSON.parse(decrypt(encryptedData));
//         const { token, user_id } = decryptedData;

//         // Fetch user data if not already available in Redux state
//         if (token && user_id && !user) {
//           dispatch(getUser({ user_id, token }));
//         }
//       } catch (error) {
//         console.error('Error processing token data:', error);
//       }
//     }
//   }, [dispatch, user]);
// // }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login'); // Navigate to login on logout
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Handle loading state
//   }

//   if (error) {
//     return <div>Error: {error}</div>; // Handle error state
//   }

//   return (
//     <div>
//       dafsdf
//       {user ? (
//         <div>
//           Welcome, {user.email}!
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <div>Please log in</div>
//       )}
//     </div>
//   );
// };

// export default Home;
