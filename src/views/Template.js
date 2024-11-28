import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";
import {
  TabContent,
  TabPane,
  Row,
  Col,
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
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { BASE_URL, deleteReq, get, post } from "../apis/api";
import { useDispatch } from "react-redux";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Plus,
  RotateCw,
  Users,
  X,
} from "react-feather";
import {
  formatDate,
  formatDateCustomTime,
  formatDateCustomTimelastActivity,
  formatDateTime,
  handleDownloadPDFApp,
  highlightText,
} from "../utility/Utils";
import { useParams, useNavigate } from "react-router-dom";
import emptyImage from "@assets/images/pages/empty.png";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import getUserPlan from "../utility/IpLocation/GetUserPlanData";
import ModalUpgradePremium from "../components/ModalUpgradePremium";
import ModalConfirmationPlan from "../components/ModalConfirmationPlan";
import useLogo from "@uselogo/useLogo";
import SpinnerCustom from "../components/SpinnerCustom";
import CustomButton from "../components/ButtonCustom";
import {
  getUser,
  selectPrimaryColor,
  selectLogo,
  selectLoading,
} from "../redux/navbar";
import CustomBadge from "../components/BadgeCustom";
import { useSelector } from "react-redux";
import UploadFileTemp from "../components/upload-file/FileUploaderTemplate";
import logoRemoveBg from "@assets/images/pages/logoRemoveBg.png";
import { decrypt } from "../utility/auth-token";
import FreeTrialAlert from "../components/FreeTrailAlert";
import PaginationComponent from "../components/pagination/PaginationComponent";
import { useTranslation } from "react-i18next";

const Template = () => {
  const dispatch = useDispatch();
  const {
    user,
    plan,
    userTempDocuments,
    subscription,
    isSubscripitonActive,
    isFreeTrialExpired,
    daysLeftExpiredfreePlan,
    status,
    error,
  } = useSelector((state) => state.navbar);
  const primary_color = useSelector(selectPrimaryColor);
  const { t } = useTranslation();
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);
  // sort
  const [daysleftExpired, setdaysleftExpired] = useState(0);
  const [freeTrailExpiredAlert, setFreeTrailExpiredAlert] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [loaderResponseFetch, setLoaderResponseFetch] = useState(false);
  const [loaderResponseFetch1, setLoaderResponseFetch1] = useState(false);
  const [LoaderFileAdd, setLoaderFileAdd] = useState(false);
  const [responseTemp, setResponsesTemp] = useState([]);
  // const getCheckUserPlan = async () => {
  //   const profileCompleted = await getUserPlan(items.token.user_id);
  //   //console.log('PROFILE  COMPLETED PLAN ');
  //   //console.log(profileCompleted);
  //   return profileCompleted;
  // };
  const [message, setMessage] = useState("");
  const [urlshare, seturlshare] = useState("");
  const [severity, setSeverity] = useState("warning");
  const [planAlert, setPlanAlert] = useState(false);
  const [active, setActive] = useState("0");
  const { subFolderId, prevId } = useParams();
  const [statusData1, setStatusData1] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [restoreAllLoader, setRestoreAllLoader] = useState(false);
  const [ItemRestoreAllConfirm, setItemRestoreAllConfirm] = useState(false);
  const [sendTemplate, setSendTemplate] = useState(false);
  const [SendTemplateResponses, setSendTemplateResponses] = useState(false);
  const [SendTemplateResponses1, setSendTemplateResponses1] = useState(false);
  const [modalUpgradePremium, setModalUpgradePremium] = useState(false);
  const [modalUpgradePremiumD, setModalUpgradePremiumD] = useState(false);

  const [emailError, setEmailError] = useState("");
  const validateEmail = (email) => {
    // Email regex pattern for basic validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  // Add this function to handle checkbox changes
  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      //console.log('selectedItems');

      //console.log(selectedItems);

      setSelectedItems((prevItems) => [...prevItems, { item }]);
    } else {
      //console.log(event.target.checked);

      //console.log(selectedItems);
      setSelectedItems((prevItems) => prevItems.filter((i) => i.item !== item));
    }
  };
  const [deleteFolderId, setDeleteFolderId] = useState("");

  const [email, setEmail] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [firstPart, setFirstPart] = useState("");

  const [subject, setSubject] = useState("");
  const [messageData, setMessageData] = useState("");
  const [temp_id, setTemp_id] = useState("");

  const [addFolderLoader, setAddFolderLoader] = useState(false);

  const [completeProfile, setCompleteProfile] = useState(false);

  const StatusChange = async () => {
    setRestoreAllLoader(true);

    const postData = {
      status: statusData1,
      bulk_link_ids: selectedItems,
    };
    try {
      const apiData = await post("bulk_links/updateStatus", postData); // Specify the endpoint you want to call
      //console.log('CHNAGE STATUS BULK LINK ');

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
        fetchAllBulkLinks();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const [isHovered, setIsHovered] = useState(false);

  const [foldersArray, setFoldersArray] = useState([]);
  const [filesArray, setFilesArray] = useState([]);

  const fetchAllBulkLinks = async () => {
    const postData = {
      user_id: user?.user_id,
    };
    try {
      const apiData = await post("template/get_template", postData); // Specify the endpoint you want to call
      //console.log('GET FOLDER BY USER ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        // toastAlert("error", apiData.message)
        setFoldersArray([]);
      } else {
        // //console.log(apiData.result)
        setFoldersArray(apiData.result);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
    setFolderLoader(false);
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
        //console.log('GET Files BY USER ID ');

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
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items to display per page
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  // Filtered items based on the search query
  // const filteredItems = foldersArray.filter(item => item.file_name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredItems = foldersArray.filter((item) => {
    const fullName = `${item.file_name || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  const [sortField, setSortField] = useState(""); // Field to sort by

  const filteredItems1 = responseTemp.filter((item) => {
    const fullName = `${item.title || ""}`.toLowerCase();
    return fullName.includes(searchQuery1.toLowerCase());
  });
  const handleSort = (field) => {
    console.log(field);
    if (field === "title" || field === "completed_at") {
      const direction =
        sortField === field && sortDirection === "asc" ? "desc" : "asc";

      // Sort the data
      const sortedData = [...responseTemp].sort((a, b) => {
        let comparison = 0;
        if (field === "completed_at") {
          comparison = new Date(a.completed_at) - new Date(b.completed_at);
        } else if (field === "title") {
          comparison = a.title.localeCompare(b.title);
        }

        // Apply the sort direction
        return direction === "asc" ? comparison : -comparison;
      });

      // Update state with sorted data and new sort field/direction
      setResponsesTemp(sortedData);
      setSortField(field);
      setSortDirection(direction);
    } else {
      const direction =
        sortField === field && sortDirection === "asc" ? "desc" : "asc";
      setSortField(field);
      setSortDirection(direction);
    }
  };
  const sortItems = (items) => {
    return items.sort((a, b) => {
      let fieldA, fieldB;
      if (sortField === "file_name") {
        fieldA = `${a.file_name || ""} `.toLowerCase();
        fieldB = `${b.file_name || ""}`.toLowerCase();
      }

      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };
  // const itemsPerPage = 9; // Number of items to display per page
  // let allItems = [...foldersArray, ...filesArray];
  // Calculate the index of the first and last item on the current page
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Assuming you have your data stored in an array called `allItems`
  // let currentItems = foldersArray.slice(indexOfFirstItem, indexOfLastItem);

  let currentItems = sortItems(
    foldersArray.slice(indexOfFirstItem, indexOfLastItem)
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

    currentItems = foldersArray.slice(indexOfFirstItem, indexOfLastItem);
    //console.log(currentItems);
  };
  // delete folder
  const [shareLoading, setShareLoading] = useState(false);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);

  // delete folderv api
  const DeleteBulkLink = async () => {
    setLoadingDelete(true);
    const postData = {
      template_id: deleteFolderId,
    };
    try {
      const apiData = await post("template/deleteTemplates", postData); // Specify the endpoint you want to call
      //console.log('DELETE BULK LINKS ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation(false);
        setLoadingDelete(false);
        fetchAllBulkLinks();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };

  // Add files
  // Fetch File

  const getFunctionTemplateDetails = async (fileId) => {
    // setImageUrls(apiData.result[0].image);
    setLoaderResponseFetch(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      template_id: fileId,
    };
    const apiData = await post("template/viewTemplate", postData); // Specify the endpoint you want to call
    //console.log('File Template Fetch');

    console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      setResponsesTemp(apiData?.response_data);
      setSendTemplateResponses(true);
      setLoaderResponseFetch(false);
    }
  };
  const getFunctionTemplateAuditLog = async (fileId) => {
    // setImageUrls(apiData.result[0].image);
    setLoaderResponseFetch1(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      template_id: fileId,
    };
    const apiData = await post("template/viewTemplateAuditLog", postData); // Specify the endpoint you want to call
    //console.log('File Template Fetch');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      setResponsesTemp(apiData.response_data);
      setSendTemplateResponses1(true);
      setLoaderResponseFetch1(false);
    }
  };
  const [show, setShow] = useState(false);
  const [subfolderState, setSubfolderState] = useState(false);
  const [folderLoader, setFolderLoader] = useState(true);
  const [modalSize, setModalSize] = useState("md");

  // Function to handle sorting by the "Created On" date
  const sortByCreatedOn = () => {
    const sorted = foldersArray; // yourData is the original data array
    //console.log(sorted);
    sorted.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFoldersArray(sorted);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // end sort
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  const getCheckUserPlan = async () => {
    const profileCompleted = await getUserPlan(user?.user_id);
    //console.log('PROFILE COMPLETED');
    //console.log(profileCompleted);
    return profileCompleted;
  };
  const fetchPlanUser = async () => {
    const dataGet = await getCheckUserPlan();
    //console.log('dataGet');
    //console.log(dataGet);
    if (dataGet?.userPlanDetails?.template === "unlimited") {
      // setShow(true);
      //console.log('dshjhjds');
    } else {
      setModalUpgradePremiumD(true);
      // toastAlert('error', ' Upgrade your plan!');
    }
  };
  const [userPlanCurrent, setUserPlanCurrent] = useState(null);
  const [userTotalDocCount, setUserTotalDocCount] = useState(null);
  // const [isHovered, setIsHovered] = useState(false);

  // useEffect(() => {
  //   const fetchDataSequentially = async () => {
  //     await fetchUserData();
  //     // fetchlocationUrl and fetchAllFiles will now be called in a separate useEffect
  //     // that listens for changes on userDetailsCurrent
  //   };

  //   fetchDataSequentially();
  // }, [dispatch]);
  // useEffect(() => {
  //   // Add sorting logic here when responseTemp changes
  //   const sortedData = [...responseTemp].sort((a, b) => {
  //     let comparison = 0;
  //     if (sortField === 'completed_at') {
  //       comparison = new Date(a.completed_at) - new Date(b.completed_at);
  //     } else if (sortField === 'title') {
  //       comparison = a.title.localeCompare(b.title);
  //     }

  //     return sortDirection === 'asc' ? comparison : -comparison;
  //   });
  //   setResponsesTemp(sortedData);
  // }, [sortField, sortDirection, responseTemp]);

  // useEffect(() => {
  //   if (userPlanCurrent) {
  //     const fetchDataAsync = async () => {
  //       await getLocatinIPn();
  //       const queryString = window.location.search;

  //       // Parse the query string to get parameters
  //       const urlParams = new URLSearchParams(queryString);

  //       // Get the value of the 'waitingforOtherstoast' parameter
  //       const waitingParam = urlParams.get("toastAlert");
  //       //console.log('waitingParam');

  //       //console.log(waitingParam);
  //       if (waitingParam != null || waitingParam != undefined) {
  //         toastAlert("success", "Template Added Successfully");
  //         // Remove the query parameter after 1 second
  //         setTimeout(() => {
  //           window.history.replaceState(
  //             {},
  //             document.title,
  //             window.location.pathname
  //           );
  //         }, 1000);
  //       }

  //       // if (subFolderId !== null && subFolderId !== undefined) {
  //       //   setSubfolderState(true);
  //       // } else {
  //       //   setSubfolderState(false);
  //       // }
  //       if (items === "" || items === undefined || items === null) {
  //         window.location.href = "/login";
  //       } else {
  //         // if (items.token.company_user) {
  //         //   setPlanAlert(false);
  //         // } else if (items.subdomain === null || items.subdomain === undefined) {
  //         // setPlanAlert(true)
  //         // const interval = setInterval(() => {
  //         // await fetchPlanUser();
  //         // await fetchData();
  //         await fetchAllBulkLinks();
  //         // fetchAllFiles(StatusData);
  //         // }, 1000);
  //         // return () => clearInterval(interval);
  //         // } else {
  //         //   setPlanAlert(false);
  //         // }
  //       }
  //     };

  //     fetchDataAsync();
  //     // Get params
  //   }
  // }, [userPlanCurrent]);
  const [SignersData, setSignersData] = useState([]);
  const fetchSignerData = async (file_id) => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post("file/getAllSignersByFileId", postData); // Specify the endpoint you want to call
      console.log("Signers ");

      console.log(apiData);
      if (apiData.error) {
        setSignersData([]);
      } else {
        // if(apiData)
        setSignersData(apiData.result);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const [inputErrors, setInputErrors] = useState([]);
  const AddSignersData = async () => {
    // setLoadingSignersSave(true);
    //console.log(signersData);
    //console.log(file_id);

    const postData = {
      file_id: temp_id,
      signers: SignersData,
    };
    try {
      console.log("signersData");
      console.log(SignersData);

      const apiData = await post("template/add-signer", postData); // Specify the endpoint you want to call
      console.log("Signers ");

      console.log(apiData);
      if (apiData.error) {
        // toastAlert("error", apiData.message);
        setSignersData([]);
      } else {
        // //console.log(apiData.result)
        // toastAlert("succes", apiData.message);
        setSignersData(apiData.data);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const handleInputChange = (i, event) => {
    const { name, value } = event.target;
    const newSignersData = [...SignersData];

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
        newInputErrors[i] = "Please enter a valid email address.";
      } else if (
        SignersData.some(
          (signer, index) => signer.email === value && index !== i
        )
      ) {
        newInputErrors[i] = "This email is already in use.";
      } else {
        newInputErrors[i] = "";
      }
    }

    newSignersData[i][name] = value;
    setSignersData(newSignersData);
    setInputErrors(newInputErrors);
  };
  const [titleBulk, setTitleBulk] = useState("");
  const [ToastAlertIdBulk, setToastAlertIdBulk] = useState("");
  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            fetchAllBulkLinks(),

            // fetchlocationUrl(),
            // fetchAllFiles(StatusData),
            // fetchAllFolder(),
            // fetchAllCardsDashboard(),
            // fetchAllFoldersForModalMove(),
          ]);
          console.log("REDUC SH");
          setUserPlanCurrent(plan);
          setUserTotalDocCount(userTempDocuments);
          console.log("PLAN DATA ");

          const queryParams = new URLSearchParams(location.search);
          const toastAlertD = queryParams.get("toastAlert");
          const toastAlertNAme = queryParams.get("name");
          //console.log('toastAlertD');

          //console.log(toastAlertD);
          //console.log(toastAlertNAme);

          if (toastAlertD === null || toastAlertD === undefined) {
            //console.log('No toastAlert ');
          } else {
            //console.log(' toastAlert ');
            setToastAlertIdBulk(true);
            setTitleBulk(toastAlertNAme);
            setLink(toastAlertD);
          }
          // setUserDetailsCutrrent(user);
          // setUserPlanCurrent(plan);
          // setUserTotalDocCount(docuemntsCount)
          // setLoaderData(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          // setLoaderData(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, status]);
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

  return (
    <div>
      <FreeTrialAlert
        isSubscripitonActive={isSubscripitonActive}
        subscription={subscription}
        isFreeTrialExpired={isFreeTrialExpired}
        daysleftExpired={daysLeftExpiredfreePlan}
      />

      <Row>
        {window.innerWidth > 730 ? (
          <Col md="12" xs="12" className="d-flex justify-content-between mt-1">
            <h1>{t("Template")}</h1>
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "10px", cursor: "pointer" }}>
                <RotateCw
                  id="refresh-icon"
                  onClick={async () => {
                    setFolderLoader(true);
                    await fetchAllBulkLinks();
                  }}
                />
                <UncontrolledTooltip placement="bottom" target="refresh-icon">
                  {t("Refresh")}
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
                  placeholder={t("Search by File Name")}
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
              {folderLoader ? null : (
                <>
                  {/* {modalUpgradePremiumD ? null : ( */}
                  <CustomButton
                    style={{
                      boxShadow: "none",
                      marginLeft: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    color="primary"
                    size="sm"
                    text={
                      <>
                        {" "}
                        {LoaderFileAdd ? (
                          <Spinner color="light" size="sm" />
                        ) : (
                          <Plus
                            id="RestoreAll"
                            size={20}
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                          />
                        )}
                        <span style={{ marginLeft: "10px" }}>
                          {t("Template")}
                        </span>
                      </>
                    }
                    onClick={async () => {
                      // setShow(true);
                      // setLoaderFileAdd(false);
                      // setLoaderFileAdd(true);
                      if (plan?.template_count === "UNLIMITED") {
                        setShow(true);
                        setLoaderFileAdd(false);
                      } else {
                        const documents_to_sign_limit = plan?.template_count;
                        console.log(userTotalDocCount);
                        if (
                          parseInt(userTotalDocCount) <
                          parseInt(documents_to_sign_limit)
                        ) {
                          console.log("sahgdhgads");
                          setShow(true);
                          setLoaderFileAdd(false);
                        } else {
                          console.log("UPGRADE ");

                          setModalUpgradePremium(true);
                          setLoaderFileAdd(false);
                        }
                      }
                    }}
                  />

                  {/* )}</> */}
                </>
              )}

              {/* <ButtonGroup size="sm" style={{ marginLeft: '10px', height: '40px' }}>
              <Button color='secondary' onClick={() => setRSelected(1)} active={rSelected === 1} outline>
                <Grid size={24} />
              </Button>
              <Button color='secondary' onClick={() => setRSelected(2)} active={rSelected === 2} outline>
                <AlignJustify size={24} />

              </Button>

            </ButtonGroup> */}
            </div>
          </Col>
        ) : (
          <>
            <Col
              md="12"
              xs="12"
              className="d-flex justify-content-between mt-1"
            >
              <h1>{t("Template")}</h1>
              <div style={{display:"flex"}}>
 <div style={{ cursor: "pointer" }}>
                  <RotateCw
                    id="refresh-icon"
                    onClick={async () => {
                      setFolderLoader(true);
                      await fetchAllBulkLinks();
                    }}
                  />
                  <UncontrolledTooltip placement="bottom" target="refresh-icon">
                    {t("Refresh")}
                  </UncontrolledTooltip>
                </div>
              {folderLoader ? null : (
                <>
                  {/* {modalUpgradePremiumD ? null : ( */}
                  <CustomButton
                    style={{
                      boxShadow: "none",
                      marginLeft: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    color="primary"
                    size="sm"
                    text={
                      <>
                        {" "}
                        {LoaderFileAdd ? (
                          <Spinner color="light" size="sm" />
                        ) : (
                          <Plus
                            id="RestoreAll"
                            size={20}
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                          />
                        )}
                        <span style={{ marginLeft: "10px" }}>
                          {t("Template")}
                        </span>
                      </>
                    }
                    onClick={async () => {
                      // setShow(true);
                      // setLoaderFileAdd(false);
                      // setLoaderFileAdd(true);
                      if (plan?.template_count === "UNLIMITED") {
                        setShow(true);
                        setLoaderFileAdd(false);
                      } else {
                        const documents_to_sign_limit = plan?.template_count;
                        console.log(userTotalDocCount);
                        if (
                          parseInt(userTotalDocCount) <
                          parseInt(documents_to_sign_limit)
                        ) {
                          console.log("sahgdhgads");
                          setShow(true);
                          setLoaderFileAdd(false);
                        } else {
                          console.log("UPGRADE ");

                          setModalUpgradePremium(true);
                          setLoaderFileAdd(false);
                        }
                      }
                    }}
                  />

                  {/* )}</> */}
                </>
              )}
              </div>
             
            </Col>
            <Col
              md="12"
              xs="12"
              className="d-flex justify-content-between mt-1"
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
                      width:window.innerWidth-30,
                      // paddingLeft: "30px", // Add padding to make space for the icon
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    id="login-email"
                    placeholder={t("Search by File Name")}
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
               

                {/* <ButtonGroup size="sm" style={{ marginLeft: '10px', height: '40px' }}>
             <Button color='secondary' onClick={() => setRSelected(1)} active={rSelected === 1} outline>
               <Grid size={24} />
             </Button>
             <Button color='secondary' onClick={() => setRSelected(2)} active={rSelected === 2} outline>
               <AlignJustify size={24} />

             </Button>

           </ButtonGroup> */}
          
            </Col>{" "}
          </>
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
                <Col md="12" xs="12">
                  {/* <Card style={{padding: '15px'}}> */}
                  {show ? (
                    <>
                      <Row>
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
                                top: 5,
                                right: 5,
                                cursor: "pointer",
                              }}
                              onClick={() => setShow(!show)}
                            /> */}
                          {/* <FileUploaderTemplate /> */}
                          <UploadFileTemp
                            user={user}
                            isHovered={isHovered}
                            setIsHovered={setIsHovered}
                            setShow={setShow}
                          />
                          {/* </div> */}
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            {/* <th></th> */}

                            {/* <th>Title</th> */}
                            <th
                              onClick={() => handleSort("file_name")}
                              style={{ cursor: "pointer" }}
                            >
                              <h4
                                            
                                style={{ fontWeight: 700, marginLeft: "20px",whiteSpace: "nowrap" }}
                              >
                                {t("Document Name")}
                                {sortField === "file_name"
                                  ? sortDirection === "asc"
                                    ? "↑"
                                    : "↓"
                                  : "↑↓"}
                              </h4>{" "}
                            </th>

                            <th>
                              <h4 style={{ fontWeight: 700 }}>
                                {t("Pending")}
                              </h4>
                            </th>
                            <th>
                              <h4 style={{ fontWeight: 700 }}>
                                {t("Completed")}
                              </h4>
                            </th>
                            <th>
                              <h4 style={{ fontWeight: 700,whiteSpace: "nowrap" }}>
                                {t("Total Send")}
                              </h4>
                            </th>
                            {/* <th onClick={sortByCreatedOn} style={{cursor: 'pointer', display: 'flex'}}>
                              {' '}
                              <h4 style={{fontWeight: 700}}>Created </h4>
                              {sortDirection === 'asc' ? (
                                <ArrowUp style={{marginLeft: '5px'}} size={15} />
                              ) : (
                                <ArrowDown style={{marginLeft: '5px'}} size={15} />
                              )}
                            </th> */}

                            <th>
                              <h4 style={{ fontWeight: 700 }}>
                                {t("Actions")}{" "}
                              </h4>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchQuery.length === 0 ? (
                            <>
                              {currentItems.length > 0
                                ? currentItems.map((item, index) => (
                                    <>
                                      <tr>
                                        <td>
                                          {item?.file_name === null ||
                                          item?.file_name === undefined ||
                                          item?.file_name === "null" ||
                                          item?.file_name === "undefined" ? (
                                            <>
                                              <h3
                                                style={{
                                                  color: "#2367a6",
                                                  cursor: "pointer",
                                                }}
                                              >
                                                -{" "}
                                              </h3>
                                            </>
                                          ) : (
                                            <h3
                                              style={{
                                                marginLeft: "20px",
                                                cursor: "pointer",
                                                whiteSpace: "nowrap"
                                              }}
                                              onClick={() => {
                                                window.location.href = `template-builder/${item.template_id}?open=true`;
                                              }}
                                            >
                                              {item?.file_name}.pdf
                                            </h3>
                                          )}
                                        </td>
                                        <td>
                                          <h3 style={{ marginLeft: "20px" }}>
                                            {item?.incomplete_responses}
                                          </h3>
                                        </td>

                                        <td>
                                          <h3 style={{ marginLeft: "20px" }}>
                                            {item?.completed_responses}
                                          </h3>
                                        </td>
                                        <td>
                                          <h3 style={{ marginLeft: "20px" }}>
                                            {item?.total_responses}
                                          </h3>
                                        </td>
                                        {/* <td>
                                          <h3>{formatDateCustomTimelastActivity(item.created_at, locationIP)}</h3>
                                        </td> */}
                                        <td>
                                          <div className="d-flex justify-content-between">
                                            <div className="d-flex justify-content-between">
                                              {item.url === null ||
                                              item.url === undefined ? null : (
                                                <>
                                                  <CustomBadge
                                                    color="success"
                                                    text={
                                                      <>
                                                        {shareLoading ? (
                                                          <Spinner
                                                            color="white"
                                                            size="sm"
                                                          />
                                                        ) : null}
                                                        <span
                                                          style={{
                                                            marginLeft: "5px",
                                                          }}
                                                        >
                                                          {t("Share")}
                                                        </span>
                                                      </>
                                                    }
                                                    onClick={async () => {
                                                      window.location.href = `template-builder/${item.template_id}?open=true1`;

                                                      //console.log('copy');
                                                      //console.log(item.url);
                                                      // setShareLoading(true)
                                                      // seturlshare(item.url);
                                                      // setTemp_id(
                                                      //   item.template_id
                                                      // );
                                                      // setMessageData(item.email_message)
                                                      // setSubject(item.email_subject)

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
                                                      // setShareLoading(false)

                                                      // setSendTemplate(true);
                                                    }}
                                                  />
                                                </>
                                              )}
                                              {/* {item?.total_responses === 0 ||
                                          item?.total_responses === '0' ||
                                          item?.total_responses === null ||
                                          item?.total_responses === undefined ?<>  */}
                                              <CustomBadge
                                                color="info"
                                                text={t("View")}
                                                onClick={() => {
                                                  window.location.href = `template-builder/${item.template_id}?open=true`;
                                                }}
                                              />

                                              {item?.total_responses === 0 ||
                                              item?.total_responses === "0" ||
                                              item?.total_responses === null ||
                                              item?.total_responses ===
                                                undefined ? (
                                                <> </>
                                              ) : (
                                                <>
                                                  {/* {loaderResponseFetch && temp_id === item.template_id ? (
                                                    <Spinner color="primary" size="sm" />
                                                  ) : ( */}
                                                  <CustomBadge
                                                    color="secondary"
                                                    text={
                                                      loaderResponseFetch &&
                                                      temp_id ===
                                                        item.template_id ? (
                                                        <>
                                                          <Spinner
                                                            color="white"
                                                            size="sm"
                                                          />{" "}
                                                          <span
                                                            style={{
                                                              marginLeft: "5px",
                                                            }}
                                                          >
                                                            {t(
                                                              "View Responses"
                                                            )}
                                                          </span>
                                                        </>
                                                      ) : (
                                                        t("View Responses")
                                                      )
                                                    }
                                                    onClick={() => {
                                                      setTemp_id(
                                                        item.template_id
                                                      );
                                                      setDocumentName(
                                                        `${item.file_name}.pdf`
                                                      );
                                                      getFunctionTemplateDetails(
                                                        item.template_id
                                                      );
                                                      // setSendTemplateResponses(true);
                                                    }}
                                                  />

                                                  {/* // )} */}
                                                </>
                                              )}
                                              {/* {loaderResponseFetch1 && temp_id === item.template_id ? (
                                                <Spinner color="white" size="sm" />
                                              ) : ( */}
                                              {/* <CustomBadge

                                                color="warning"
                                                // text="Audit Log"
                                                text={loaderResponseFetch1 && temp_id === item.template_id ? <><Spinner color="white" size="sm" /> <span style={{marginLeft:"5px"}}>Audit Log</span></>: "Audit Log"}

                                                onClick={() => {

                                                  setTemp_id(item.template_id);
                                                  setDocumentName(`${item.file_name}.pdf`);
                                                  getFunctionTemplateAuditLog(item.template_id);
                                                  // setSendTemplateResponses(true);
                                                }}
                                                /> */}

                                              {/* )} */}
                                              <CustomBadge
                                                color="danger"
                                                text={t("Trash")}
                                                onClick={() => {
                                                  setDeleteFolderId(
                                                    item.template_id
                                                  );
                                                  setItemDeleteConfirmation(
                                                    true
                                                  );
                                                }}
                                              />
                                              <CustomBadge
                                                color="primary"
                                                text={t("Download")}
                                                onClick={async () => {
                                                  setDeleteFolderId(
                                                    item.template_id
                                                  );
                                                  // setItemDeleteConfirmation(true);
                                                  await handleDownloadPDFApp(
                                                    item?.file_url_completed,
                                                    item?.file_name
                                                  );
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  ))
                                : null}
                            </>
                          ) : (
                            <>
                              {filteredItems.length > 0 ? (
                                <>
                                  {filteredItems.map((item, index) => (
                                    <>
                                      <tr>
                                        <td>
                                          {item?.file_name === null ||
                                          item?.file_name === undefined ||
                                          item?.file_name === "null" ||
                                          item?.file_name === "undefined" ? (
                                            <>
                                              <h3
                                                style={{
                                                  color: "#2367a6",
                                                  cursor: "pointer",
                                                }}
                                              >
                                                -{" "}
                                              </h3>
                                            </>
                                          ) : (
                                            <h3
                                              style={{
                                                marginLeft: "20px",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                window.location.href = `template-builder/${item.template_id}?open=true`;
                                              }}
                                            >
                                              {highlightText(
                                                `${item.file_name}`,
                                                searchQuery
                                              )}
                                              {/* {item?.file_name}.pdf */}
                                            </h3>
                                          )}
                                        </td>

                                        <td>
                                          <h3 style={{ marginLeft: "20px" }}>
                                            {item?.total_responses}
                                          </h3>
                                        </td>
                                        <td>
                                          <h3 style={{ marginLeft: "20px" }}>
                                            {item?.completed_responses}
                                          </h3>
                                        </td>
                                        <td>
                                          <h3 style={{ marginLeft: "20px" }}>
                                            {item?.incomplete_responses}
                                          </h3>
                                        </td>
                                        {/* <td>
                                         <h3>{formatDateCustomTimelastActivity(item.created_at, locationIP)}</h3>
                                       </td> */}
                                        <td>
                                          <div className="d-flex justify-content-between">
                                            <div className="d-flex justify-content-between">
                                              {item.url === null ||
                                              item.url === undefined ? null : (
                                                <>
                                                  <CustomBadge
                                                    color="success"
                                                    text="Share"
                                                    onClick={async () => {
                                                      //console.log('copy');
                                                      //console.log(item.url);
                                                      window.location.href = `template-builder/${item.template_id}?open=true`;

                                                      // seturlshare(item.url);
                                                      // setTemp_id(
                                                      //   item.template_id
                                                      // );
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

                                                      // setSendTemplate(true);
                                                    }}
                                                  />
                                                </>
                                              )}
                                              {/* {item?.total_responses === 0 ||
                                         item?.total_responses === '0' ||
                                         item?.total_responses === null ||
                                         item?.total_responses === undefined ?<>  */}
                                              <CustomBadge
                                                color="info"
                                                text={t("View")}
                                                onClick={() => {
                                                  window.location.href = `template-builder/${item.template_id}?open=true`;
                                                }}
                                              />

                                              {item?.total_responses === 0 ||
                                              item?.total_responses === "0" ||
                                              item?.total_responses === null ||
                                              item?.total_responses ===
                                                undefined ? (
                                                <> </>
                                              ) : (
                                                <>
                                                  {loaderResponseFetch &&
                                                  temp_id ===
                                                    item.template_id ? (
                                                    <Spinner
                                                      color="white"
                                                      size="sm"
                                                    />
                                                  ) : (
                                                    <CustomBadge
                                                      color="secondary"
                                                      text={t("View Responses")}
                                                      onClick={() => {
                                                        setTemp_id(
                                                          item.template_id
                                                        );
                                                        setDocumentName(
                                                          `${item.file_name}.pdf`
                                                        );
                                                        getFunctionTemplateDetails(
                                                          item.template_id
                                                        );
                                                        // setSendTemplateResponses(true);
                                                      }}
                                                    />
                                                  )}
                                                </>
                                              )}
                                              {/* {loaderResponseFetch1 && temp_id === item.template_id ? (
                                               <Spinner color="white" size="sm" />
                                             ) : (
                                               <CustomBadge
                                               color="warning"
                                               text="Audit Log"
                                               onClick={() => {
                                                 setTemp_id(item.template_id);
                                                 setDocumentName(`${item.file_name}.pdf`);
                                                 getFunctionTemplateAuditLog(item.template_id);
                                                 // setSendTemplateResponses(true);
                                               }}
                                               />
                                              
                                             )} */}
                                              <CustomBadge
                                                color="danger"
                                                text={t("Delete")}
                                                onClick={() => {
                                                  setDeleteFolderId(
                                                    item.template_id
                                                  );
                                                  setItemDeleteConfirmation(
                                                    true
                                                  );
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                                </>
                              ) : null}
                            </>
                          )}
                        </tbody>
                      </Table></div>
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
                          {filteredItems.length > 0 ||
                          filesArray.length > 0 ? null : (
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
                                <h4>{t("No File Exist")}</h4>
                              </Col>
                            </Row>
                          )}{" "}
                        </>
                      )}
                      {/* {foldersArray.length === 0 || filesArray.length === 0 ? null : ( */}
                      <div
                        style={{
                          display: "flex",
                          padding: "5px",
                          justifyContent: "right",
                          alignItems: "center",
                        }}
                      >
                        {foldersArray.length === 0 ? null : (
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
                                totalItems={foldersArray?.length}
                                handlePageChange={handlePageChange}
                                handlePageChangeNo={handlePageChangeNo}
                              />
                            </div>
                          </>
                        )}
                      </div>{" "}
                    </>
                  )}
                  {/* // )} */}
                  {/* </Card> */}
                </Col>
                {/* </>} */}
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </Row>
      {/* <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className={`modal-dialog-centered ${modalSize}`}
        // onClosed={() => setCardType('')}
      >
        <ModalBody className="px-sm-5 mx-50 pb-2 pt-2">
          {/* <h1 className="text-center mb-1 fw-bold">Upload
          <Row tag="form" className="gy-1 gx-1 mt-75">
            <Col xs={12}>

              <FileUploaderTemplate
                // subFolder={subFolderId}
                //  onlySigner={onlySigner}
                onDataReceived={item => {
                  setModalSize(item);
                }}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal> */}
      <ModalConfirmationAlert
        isOpen={ItemRestoreAllConfirm}
        toggleFunc={() => setItemRestoreAllConfirm(!ItemRestoreAllConfirm)}
        loader={restoreAllLoader}
        callBackFunc={StatusChange}
        text={`${t(
          "Are you sure you want to change Selected link Status to"
        )} ${statusData1}?`}
      />
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteBulkLink}
        alertStatusDelete={"delete"}
        text={t(
          "By click delete, your document will go to Trash. Are you sure?"
        )}
      />
      {/* Modal  Add Email  */}

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
              value={documentName}
              onChange={(e) => {
                let value = e.target.value;

                // Check if the document name ends with .pdf
                if (!value.toLowerCase().endsWith(".pdf")) {
                  value += ".pdf";
                }

                setDocumentName(value);
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
          <Label className="form-label" for="register-firstname">
            {t("Signers")}
          </Label>

          {SignersData &&
            SignersData.map((signer, i) => (
              <div key={i}>
                <Row className="justify-content-between align-items-center">
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
                  <Col md={5} xs={5} className="mb-md-0 mb-1">
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
                      onChange={(event) => handleInputChange(i, event)}
                      placeholder="Signer "
                    />
                  </Col>
                  <Col md={6} xs={6} className="mb-md-0 mb-1">
                    <h3 className="form-label" htmlFor={`animation-cost-${i}`}>
                      {t("Email")}
                    </h3>
                    <div style={{ position: "relative" }}>
                      <Input
                        style={{
                          fontSize: "16px",
                          boxShadow: "none",
                          paddingRight: inputErrors[i] ? "20px" : "0",
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
                  <Col md={12} xs={12} className="mb-md-0 mb-1">
                    {/* make checkbox and text as add mee as signer  */}
                  </Col>
                  <Col sm={12}>
                    <hr />
                  </Col>
                </Row>
              </div>
            ))}
          {/* {emailError && ( */}
          <div style={{ color: "red", fontSize: "12px" }}>{emailError}</div>
          {/* )} */}
          {/* {errorRequired ? <div style={{ color: 'red', fontSize: '12px', margin: "1%" }}>Email is required</div> : null} */}

          <Label className="form-label" for="register-firstname">
            {t("Email Subject")}
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
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
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
            value={messageData}
            onChange={(e) => {
              setMessageData(e.target.value);
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
                subject.length === 0 ||
                messageData.length === 0 ||
                SignersData.some((signer) => !signer.name || !signer.email)
                  ? true
                  : false
              }
              onClick={async () => {
                setAddFolderLoader(true);
                // await AddSignersData()
                const location = await getUserLocation();
                let email_d = user?.email;
                let user_id = user?.user_id;

                let email_name = `${
                  user?.first_name && user?.last_name
                    ? `${user?.first_name} ${user?.last_name}`
                    : email
                }`;
                console.log(email_name);
                const name_sender =
                  user?.first_name && user.first_name.trim() !== ""
                    ? user.first_name
                    : user.email.split("@")[0];
                const postData = {
                  url_hashed: urlshare,
                  user_id: user_id, //sender
                  signers: SignersData, // signerd
                  message: messageData,
                  subject: subject,
                  template_id: temp_id,
                  title: `${documentName}`,
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
                //console.log(apiData1);
                if (apiData1.error === true || apiData1.error === "true") {
                  toastAlert("error", apiData1.message);
                  setAddFolderLoader(false);
                } else {
                  //console.log(apiData1.url_data);
                  toastAlert("success", apiData1.message);

                  const user_id = user?.user_id;
                  const emailUser = user?.email;

                  let response_log = await getActivityLogUser({
                    user_id: user_id,
                    file_id: temp_id,
                    event: "TEMPLATE-SHARED",
                    user_shared_email: email,
                    description: `${emailUser} shared template ${firstPart} ${documentName} to email:${email}`,
                  });
                  if (response_log === true) {
                    //console.log('MAINTAIN LOG SUCCESS');
                  } else {
                    //console.log('MAINTAIN ERROR LOG');
                  }
                  setAddFolderLoader(false);
                  fetchAllBulkLinks();
                  setSubject("");
                  setMessageData("");
                  setSendTemplate(false);
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
      {/* Responses Modal  */}
      <Modal
        isOpen={SendTemplateResponses}
        toggle={() => {
          // setErrorRequired(false)
          // setFolderName('')
          setSendTemplateResponses(false);
        }}
        className="modal-dialog-centered modal-fullscreen"
        modalClassName="info"
        key="success12"
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
         
            {window.innerWidth<730?<>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",  
                alignItems: "center",
                flexDirection:"row"
              }}
            >
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
              
             
              <X
              size={24}
              onClick={() => {
                // setFolderName('')
                setSendTemplateResponses(false);
              }}
              style={{ cursor: "pointer" }}
            />
            </div>
            <div>
            <h1
                className="fw-bold mt-1 "
                style={{ marginLeft: "20px", marginRight: "20px" }}
              >
                {" "}
                {t("Template Responses")}
              </h1>
              
              <h1 className="fw-bold mt-1 " style={{ marginLeft: "20px" }}>
                {documentName}
              </h1>
              </div></>:<>
              <div
            style={{
              display: " flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
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
              |
              <h1
                className="fw-bold mt-1 "
                style={{ marginLeft: "20px", marginRight: "20px" }}
              >
                {" "}
                {t("Template Responses")}
              </h1>
              |
              <h1 className="fw-bold mt-1 " style={{ marginLeft: "20px" }}>
                {documentName}
              </h1>
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
                value={searchQuery1}
                onChange={(e) => setSearchQuery1(e.target.value)}
                type="text"
                id="login-email"
                placeholder="Search by Title"
                autoFocus
              />
              {searchQuery1 && (
                <span
                  style={{
                    position: "absolute",
                    right: "10px", // Adjust the position to fit the icon within the input
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSearchQuery1(""); // Clear the search query
                  }}
                >
                  &times; {/* Cross icon (X) */}
                </span>
              )}
            </div>
              <X
              size={24}
              onClick={() => {
                // setFolderName('')
                setSendTemplateResponses(false);
              }}
              style={{ cursor: "pointer" }}
            />
            </div></>}
           
            {/* <div style={{display: 'flex',justifyContent:"left",alignItems:"center"}}>
            <img
                          src={logoFromLocalStorage || logoURL}
                          alt="logo"
                          style={{width: '200px', height: 'auto'}}
                        />
              <h1 className="fw-bold">Responses | </h1>
              <h1 className="fw-bold" style={{marginLeft: '10px'}}>
                {documentName}
              </h1>
            </div> */}
           
         
        
          <Row>
            <Col xs={12}>
              {/* <Card style={{padding: '15px'}}> */}
              <div className="table-responsive">

              <Table>
                <thead>
                  <tr>
                    <th
                      style={{ marginLeft: "20px", cursor: "pointer" }}
                      onClick={() => handleSort("title")}
                    >
                      <h2 style={{ fontWeight: 700 }}>
                        Title
                        {sortField === "title"
                          ? sortDirection === "asc"
                            ? "↑"
                            : "↓"
                          : "↑↓"}
                      </h2>
                    </th>

                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Subject")}</h2>
                    </th>
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Message")}</h2>
                    </th>
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Status")}</h2>
                    </th>
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>
                        {t("Signers' Emails")}
                      </h2>
                    </th>
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Pending")}</h2>
                    </th>
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Completed")}</h2>
                    </th>

                    {/* <th
                      style={{ marginLeft: "20px", cursor: "pointer" }}
                      onClick={() => handleSort("completed_at")}
                    >
                      <h2 style={{ fontWeight: 700 }}>
                        Completed At
                        {sortField === "completed_at"
                          ? sortDirection === "asc"
                            ? "↑"
                            : "↓"
                          : "↑↓"}
                      </h2>{" "}
                    </th> */}
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Actions")}</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchQuery1.length === 0 ? (
                    <>
                      {responseTemp.map((item) => {
                        const signers = item.signers || []; // Assuming `signers` is an array in the item
                        const totalSigners = signers.length;
                        const completedCount = signers.filter(
                          (signer) => signer.completed_status === "true"
                        ).length;
                        const pendingCount = totalSigners - completedCount;
                        return (
                          <tr key={item.template_responses_id}>
                            <td
                              style={{ marginLeft: "20px", fontSize: "14px" }}
                            >
                              <h3>{item?.title}</h3>
                            </td>

                            <td
                              style={{ marginLeft: "20px", fontSize: "14px" }}
                            >
                              <h3>{item?.subject}</h3>
                            </td>
                            <td
                              style={{ marginLeft: "20px", fontSize: "14px" }}
                            >
                              <h3>{item?.message}</h3>
                            </td>
                            <td
                              style={{ marginLeft: "20px", fontSize: "14px" }}
                            >
                              {item?.completed === true ||
                              item?.completed === "true" ? (
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
                              ) : (
                                <Badge color="warning">
                                  <Users
                                    size={12}
                                    className="align-middle me-25"
                                  />
                                  <span
                                    className="align-middle"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {t("Pending")}
                                  </span>
                                </Badge>
                              )}
                            </td>
                            {/* New column for signers' emails */}
                            <td
                              style={{ marginLeft: "20px", fontSize: "14px" }}
                            >
                              {/* {item.signers && item.signers.length > 0 ? (
                item.signers.map((signer) => (
                  <div key={signer.signer_id}>
                    <span>{signer.email}</span>
                    {signer.completed_status === "true" && (
                      <CheckCircle size={12} className="text-success ms-1" />
                    )}
                  </div>
                ))
              ) : (
                <span>{t("No Signer Exist")}</span>
              )} */}
                              {item.signers && item.signers.length > 0 ? (
                                item.signers
                                  .slice() // Create a copy of the signers array to avoid mutating the original data
                                  .sort((a, b) => a.order_id - b.order_id) // Sort by order_id in ascending order
                                  .map((signer) => (
                                    <div
                                      key={signer.signer_id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span>{signer.email}</span>
                                      {signer.completed_status === "true" && (
                                        <CheckCircle
                                          size={12}
                                          className="text-success ms-1"
                                        />
                                      )}
                                    </div>
                                  ))
                              ) : (
                                <span>{t("No Signer Exist")}</span>
                              )}
                            </td>
                            <td
                              style={{ marginLeft: "20px", fontSize: "14px" }}
                            >
                              <h3>{pendingCount}</h3> {/* Show pending count */}
                            </td>
                            <td
                              style={{ marginLeft: "20px", fontSize: "14px" }}
                            >
                              <h3>{completedCount}</h3>{" "}
                              {/* Show completed count */}
                            </td>

                            <td
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {item.completed === true ||
                              item.completed === "true" ? (
                                <div style={{ display: "flex" }}>
                                  {" "}
                                  <Button
                                    size="sm"
                                    style={{
                                      boxShadow: "none",
                                      marginLeft: "10px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    color="primary"
                                    onClick={() => {
                                      // //console.log(item)
                                      window.location.href = `template_responses/${item.template_id}?item=${item.template_responses_id}`;
                                    }}
                                  >
                                    <Eye size={20} />
                                    <span
                                      style={{ fontSize: "16px" }}
                                      className="align-middle ms-25"
                                    >
                                      {t("View")}
                                    </span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    style={{
                                      boxShadow: "none",
                                      marginLeft: "10px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    color="success"
                                    onClick={async () => {
                                      // setDeleteFolderId(item.template_id);
                                      // setItemDeleteConfirmation(true);
                                      const tile = item?.title;
                                      // Check if the title ends with .pdf and remove it
                                      const modifiedTitle = tile
                                        ?.toLowerCase()
                                        .endsWith(".pdf")
                                        ? tile.slice(0, -4)
                                        : tile;

                                      await handleDownloadPDFApp(
                                        item?.completed_doc,
                                        modifiedTitle
                                      );
                                      // //console.log(item)
                                      //  window.location.href = `template_responses/${item.template_id}?item=${item.template_responses_id}`;
                                    }}
                                  >
                                    <Download size={20} />
                                    <span
                                      style={{ fontSize: "16px" }}
                                      className="align-middle ms-25"
                                    >
                                      {t("Download")}
                                    </span>
                                  </Button>
                                </div>
                              ) : (
                                <span>
                                  <Button
                                    size="sm"
                                    style={{
                                      boxShadow: "none",
                                      marginLeft: "10px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    color="primary"
                                    onClick={() => {
                                      // //console.log(item)
                                      window.location.href = `template_responses/${item.template_id}?item=${item.template_responses_id}`;
                                    }}
                                  >
                                    <Eye size={20} />
                                    <span
                                      style={{ fontSize: "16px" }}
                                      className="align-middle ms-25"
                                    >
                                      {t("View")}
                                    </span>
                                  </Button>
                                </span>
                              )}

                              {/* {formatDateTimeZone(item.location_date, item.ip_address)} */}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {filteredItems1.length > 0 ? (
                        <>
                          {filteredItems1.map((item) => {
                            const signers = item.signers || []; // Assuming `signers` is an array in the item
                            const totalSigners = signers.length;
                            const completedCount = signers.filter(
                              (signer) => signer.completed_status === "true"
                            ).length;
                            const pendingCount = totalSigners - completedCount;
                            return (
                              <tr key={item.template_responses_id}>
                                <td
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  <h3>{item?.title}</h3>
                                </td>

                                <td
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  <h3>{item?.subject}</h3>
                                </td>
                                <td
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  <h3>{item?.message}</h3>
                                </td>
                                <td
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {item?.completed === true ||
                                  item?.completed === "true" ? (
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
                                  ) : (
                                    <Badge color="warning">
                                      <Users
                                        size={12}
                                        className="align-middle me-25"
                                      />
                                      <span
                                        className="align-middle"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {t("Pending")}
                                      </span>
                                    </Badge>
                                  )}
                                </td>
                                {/* New column for signers' emails */}
                                <td
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {item.signers && item.signers.length > 0 ? (
                                    item.signers.map((signer) => (
                                      <div key={signer.signer_id}>
                                        <span>{signer.email}</span>
                                        {signer.completed_status === "true" && (
                                          <CheckCircle
                                            size={12}
                                            className="text-success ms-1"
                                          />
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <span>{t("No Signer Exist")}</span>
                                  )}
                                </td>
                                <td
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  <h3>{completedCount}</h3>{" "}
                                  {/* Show completed count */}
                                </td>
                                <td
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  <h3>{pendingCount}</h3>{" "}
                                  {/* Show pending count */}
                                </td>
                                <td
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  <h3>
                                    {item?.completed === true ||
                                    item?.completed === "true"
                                      ? formatDateCustomTimelastActivity(
                                          item.completed_at
                                        )
                                      : "-"}{" "}
                                  </h3>
                                </td>
                                <td style={{ display: "flex" }}>
                                  {item.completed === true ||
                                  item.completed === "true" ? (
                                    <>
                                      {" "}
                                      <Button
                                        size="sm"
                                        style={{
                                          boxShadow: "none",
                                          marginLeft: "10px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                        color="primary"
                                        onClick={() => {
                                          // //console.log(item)
                                          window.location.href = `template_responses/${item.template_id}?item=${item.template_responses_id}`;
                                        }}
                                      >
                                        <Eye size={20} />
                                        <span
                                          style={{ fontSize: "16px" }}
                                          className="align-middle ms-25"
                                        >
                                          {t("View")}
                                        </span>
                                      </Button>
                                      <Button
                                        size="sm"
                                        style={{
                                          boxShadow: "none",
                                          marginLeft: "10px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                        color="success"
                                        onClick={async () => {
                                          // setDeleteFolderId(item.template_id);
                                          // setItemDeleteConfirmation(true);
                                          const tile = item?.title;
                                          // Check if the title ends with .pdf and remove it
                                          const modifiedTitle = tile
                                            ?.toLowerCase()
                                            .endsWith(".pdf")
                                            ? tile.slice(0, -4)
                                            : tile;

                                          await handleDownloadPDFApp(
                                            item?.completed_doc,
                                            modifiedTitle
                                          );
                                          // //console.log(item)
                                          //  window.location.href = `template_responses/${item.template_id}?item=${item.template_responses_id}`;
                                        }}
                                      >
                                        <Download size={20} />
                                        <span
                                          style={{ fontSize: "16px" }}
                                          className="align-middle ms-25"
                                        >
                                          {t("Download")}
                                        </span>
                                      </Button>
                                    </>
                                  ) : (
                                    <span>
                                      {" "}
                                      <Button
                                        size="sm"
                                        style={{
                                          boxShadow: "none",
                                          marginLeft: "10px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                        color="primary"
                                        onClick={() => {
                                          // //console.log(item)
                                          window.location.href = `template_responses/${item.template_id}?item=${item.template_responses_id}`;
                                        }}
                                      >
                                        <Eye size={20} />
                                        <span
                                          style={{ fontSize: "16px" }}
                                          className="align-middle ms-25"
                                        >
                                          {t("View")}
                                        </span>
                                      </Button>
                                    </span>
                                  )}

                                  {/* {formatDateTimeZone(item.location_date, item.ip_address)} */}
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      ) : (
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
                            <h4>{t("No File Exist")}</h4>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                </tbody>
              </Table>
              </div>
              {/* </Card> */}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={SendTemplateResponses1}
        toggle={() => {
          // setErrorRequired(false)
          // setFolderName('')
          setSendTemplateResponses1(false);
        }}
        className="modal-dialog-centered modal-fullscreen"
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
          {window.innerWidth < 768 ? (
            <>
              <div
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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

                <X
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSendTemplateResponses1(false);
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              >
                <h1 className="fw-bold mt-1 "> {t("Activity Log")}</h1>

                <h3 className="fw-bold mt-1 ">{documentName}</h3>
              </div>
            </>
          ) : (
            <div
              xs={12}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
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
                |
                <h1
                  className="fw-bold mt-1 "
                  style={{ marginLeft: "20px", marginRight: "20px" }}
                >
                  {" "}
                  {t("Audit Log")}
                </h1>
                |
                <h1 className="fw-bold mt-1 " style={{ marginLeft: "20px" }}>
                  {documentName}
                </h1>
              </div>
              <X
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSendTemplateResponses1(false);
                }}
              />
            </div>
          )}

          <Row style={{ marginTop: "20px" }}>
            {loaderResponseFetch1 ? (
              <Row>
                <Col md="12" xs="12" className="d-flex justify-content-center">
                  <SpinnerCustom color="primary" />
                </Col>
              </Row>
            ) : null}
            <Col xs={12}>
              {/* <Card style={{padding: '15px'}}> */}
              <div style={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr>
                      <th style={{ marginLeft: "20px" }}>
                        <h2 style={{ fontWeight: 700 }}>{t("Event")}</h2>
                      </th>
                      <th style={{ marginLeft: "20px" }}>
                        <h2 style={{ fontWeight: 700 }}>{t("Description")}</h2>
                      </th>
                      <th style={{ marginLeft: "20px" }}>
                        <h2 style={{ fontWeight: 700 }}>{t("IP Address")}</h2>
                      </th>
                      <th style={{ marginLeft: "20px" }}>
                        <h2 style={{ fontWeight: 700 }}>{t("Country")}</h2>
                      </th>

                      {/* <th style={{marginLeft: '20px'}}>
                        <h2 style={{fontWeight: 700}}>Email</h2>{' '}
                      </th> */}
                      <th style={{ marginLeft: "20px" }}>
                        <h2 style={{ fontWeight: 700 }}> {t("Date")}</h2>{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseTemp.map((item) => (
                      <tr key={item.template_responses_id}>
                        <td style={{ marginLeft: "20px", fontSize: "16px" }}>
                          {/* <h2>{item.event.split('-').join(' ')}</h2> */}
                          <h2>
                            {item?.event ? item.event.split("-").join(" ") : ""}
                          </h2>

                          {/* <h2>{item?.event?.split('-').join(' ')}</h2> */}
                        </td>
                        <td style={{ marginLeft: "20px", fontSize: "16px" }}>
                          <h2>
                            {item.description}
                            {/* {item?.description.split(/(\S+@\S+\.\S+)/).map((part, index) => {
                                      // Check if the part is an email address
                                      if (/\S+@\S+\.\S+/.test(part)) {
                                        // Apply fontWeight 700 for email address
                                        return (
                                          <span key={index} style={{fontWeight: 700}}>
                                            {part}
                                          </span>
                                        );
                                      } else {
                                        // Keep other parts as they are
                                        return <span key={index}>{part}</span>;
                                      }
                                    })} */}
                          </h2>
                        </td>
                        <td style={{ marginLeft: "20px", fontSize: "16px" }}>
                          <h2>{item?.ip_address}</h2>
                        </td>
                        <td style={{ marginLeft: "20px", fontSize: "16px" }}>
                          <h2>{item?.location_country}</h2>
                        </td>

                        {/* <td style={{marginLeft: '20px', fontSize: '16px'}}>
                          <h2>{item?.user_shared_email}</h2>
                        </td> */}

                        <td style={{ marginLeft: "20px", fontSize: "16px" }}>
                          <h2>
                            {formatDateCustomTimelastActivity(
                              item?.location_date
                            )}
                          </h2>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>{" "}
              {/* </Card> */}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <ModalConfirmationPlan
        isOpen={completeProfile}
        toggleFunc={() => setCompleteProfile(!completeProfile)}
      />
      <ModalUpgradePremium
        isOpen={modalUpgradePremium}
        toggleFunc={() => {
          setModalUpgradePremium(!modalUpgradePremium);
        }}
      />
    </div>
  );
};

export default Template;
